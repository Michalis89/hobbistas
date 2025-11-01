import {
  Injectable,
  ConflictException,
  UnauthorizedException,
  Logger,
  BadRequestException,
} from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { JwtService } from '@nestjs/jwt';
import { SupabaseService } from '../supabase/supabase.service';
import { RegisterDto, LoginDto, UpdateProfileDto } from './dto';

/**
 * Auth Service
 *
 * Handle-άρει όλη τη business logic για authentication:
 * - User registration
 * - Login
 * - Token generation
 * - Token validation
 * - Profile updates
 */
@Injectable()
export class AuthService {
  private readonly logger = new Logger(AuthService.name);

  constructor(
    private readonly supabaseService: SupabaseService,
    private readonly jwtService: JwtService,
    private readonly configService: ConfigService,
  ) {}

  /**
   * Register έναν νέο χρήστη.
   *
   * Steps:
   * 1. Check αν το username ή email υπάρχει ήδη
   * 2. Create user με Supabase Auth
   * 3. Create profile entry στη database
   * 4. Generate JWT token
   * 5. Return user data + token
   */
  async register(registerDto: RegisterDto) {
    const { email, password, username, displayName, bio } = registerDto;

    try {
      // 1. Check αν το username υπάρχει ήδη
      const { data: existingProfile } = await this.supabaseService
        .getClient()
        .from('profiles')
        .select('username')
        .eq('username', username)
        .single();

      if (existingProfile) {
        throw new ConflictException('Αυτό το username χρησιμοποιείται ήδη');
      }

      // 2. Create user με Supabase Auth
      const { user } = await this.supabaseService.createUser(email, password, {
        username,
        display_name: displayName,
        bio,
      });

      if (!user) {
        throw new BadRequestException('Failed to create user');
      }

      // 3. Create profile στη database
      // Το Supabase Auth trigger θα δημιουργήσει αυτόματα το profile
      // αλλά για safety, ας το κάνουμε manually
      const { data: profile, error: profileError } = await this.supabaseService
        .getClient()
        .from('profiles')
        .insert({
          id: user.id,
          email: email,
          username: username,
          display_name: displayName,
          bio: bio || null,
          roles: ['member'], // Default role
        })
        .select()
        .single();

      if (profileError) {
        this.logger.error(`Failed to create profile: ${profileError.message}`);
        // Clean up - delete auth user αν το profile failed
        // await this.supabaseService.getClient().auth.admin.deleteUser(user.id);
        throw new BadRequestException('Failed to create user profile');
      }

      // 4. Generate JWT token
      const token = this.generateToken(profile);

      this.logger.log(`✅ New user registered: ${username} (${user.id})`);

      // 5. Return user data + token
      return {
        user: this.sanitizeUser(profile),
        accessToken: token, // camelCase για consistency με frontend
        tokenType: 'Bearer',
        expiresIn: this.configService.get<string>('JWT_EXPIRES_IN', '7d'),
      };
    } catch (error) {
      // Handle Supabase specific errors
      if (error.code === '23505') {
        // PostgreSQL unique violation
        throw new ConflictException('Email ή username υπάρχει ήδη');
      }

      this.logger.error(`Registration failed: ${error.message}`);
      throw error;
    }
  }

  /**
   * Login υπάρχοντος χρήστη.
   *
   * Steps:
   * 1. Validate credentials με Supabase Auth
   * 2. Fetch user profile
   * 3. Generate JWT token
   * 4. Return user data + token
   */
  async login(loginDto: LoginDto) {
    const { email, password } = loginDto;

    try {
      // 1. Sign in με Supabase Auth
      const { session, user } = await this.supabaseService.signIn(
        email,
        password,
      );

      if (!session || !user) {
        throw new UnauthorizedException('Invalid credentials');
      }

      // 2. Fetch full user profile
      const { data: profile, error } = await this.supabaseService
        .getClient()
        .from('profiles')
        .select('*')
        .eq('id', user.id)
        .single();

      if (error || !profile) {
        this.logger.error(`Profile not found for user: ${user.id}`);
        throw new UnauthorizedException('User profile not found');
      }

      // 3. Update last seen
      await this.supabaseService
        .getClient()
        .from('profiles')
        .update({ last_seen_at: new Date().toISOString() })
        .eq('id', user.id);

      // 4. Generate JWT token
      const token = this.generateToken(profile);

      this.logger.log(`✅ User logged in: ${profile.username} (${user.id})`);

      // 5. Return user data + token
      return {
        user: this.sanitizeUser(profile),
        accessToken: token, // camelCase για consistency με frontend
        tokenType: 'Bearer',
        expiresIn: this.configService.get<string>('JWT_EXPIRES_IN', '7d'),
      };
    } catch (error) {
      this.logger.warn(`Login failed for email: ${email}`);
      throw new UnauthorizedException('Invalid email or password');
    }
  }

  /**
   * Get current user από το JWT token.
   * Αυτό καλείται από το /auth/me endpoint.
   */
  async getCurrentUser(userId: string) {
    const { data: profile, error } = await this.supabaseService
      .getClient()
      .from('profiles')
      .select('*')
      .eq('id', userId)
      .single();

    if (error || !profile) {
      throw new UnauthorizedException('User not found');
    }

    return this.sanitizeUser(profile);
  }

  /**
   * Update user profile
   *
   * @param userId - User ID
   * @param updateProfileDto - Profile data to update
   * @param avatarFile - Avatar file (optional)
   * @returns Updated user profile
   */
  async updateProfile(
    userId: string,
    updateProfileDto: UpdateProfileDto,
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    avatarFile?: any,
  ) {
    this.logger.log(
      `🔄 Updating profile for user ${userId}, has avatar: ${!!avatarFile}`,
    );

    try {
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      const updateData: any = {};

      // Build update object
      if (updateProfileDto.displayName !== undefined) {
        updateData.display_name = updateProfileDto.displayName;
      }
      if (updateProfileDto.bio !== undefined) {
        updateData.bio = updateProfileDto.bio;
      }

      // Handle avatar upload
      if (avatarFile) {
        this.logger.log(
          `📸 Processing avatar file: ${avatarFile.originalname}, size: ${avatarFile.size} bytes, type: ${avatarFile.mimetype}`,
        );

        // Validate avatar file
        if (!avatarFile.buffer) {
          this.logger.error('Avatar file has no buffer');
          throw new BadRequestException('Invalid avatar file');
        }

        // Check file size (max 5MB)
        const maxSize = 5 * 1024 * 1024; // 5MB
        if (avatarFile.size > maxSize) {
          this.logger.warn(
            `Avatar file too large: ${avatarFile.size} bytes (max: ${maxSize})`,
          );
          throw new BadRequestException(
            'Avatar file is too large. Maximum size is 5MB',
          );
        }

        // For now, we'll convert to base64 and store directly
        // In production, you'd upload to Supabase Storage
        try {
          const base64Avatar = avatarFile.buffer.toString('base64');
          const avatarDataUrl = `data:${avatarFile.mimetype};base64,${base64Avatar}`;

          // Check if base64 string is too large (some databases have limits)
          const base64Size = avatarDataUrl.length;
          this.logger.log(`Base64 avatar size: ${base64Size} characters`);

          if (base64Size > 10 * 1024 * 1024) {
            // 10MB limit for base64 string
            throw new BadRequestException(
              'Avatar file is too large for database storage',
            );
          }

          updateData.avatar_url = avatarDataUrl;
          this.logger.log('✅ Avatar converted to base64 successfully');
        } catch (conversionError) {
          this.logger.error(
            `Failed to convert avatar to base64: ${conversionError.message}`,
          );
          throw new BadRequestException('Failed to process avatar file');
        }
      } else if (updateProfileDto.avatarUrl !== undefined) {
        updateData.avatar_url = updateProfileDto.avatarUrl;
      }

      // Update profile in database
      this.logger.log(
        `Updating database with data: ${JSON.stringify(updateData, null, 2)}`,
      );
      const { data: updatedProfile, error } = await this.supabaseService
        .getClient()
        .from('profiles')
        .update(updateData)
        .eq('id', userId)
        .select()
        .single();

      if (error || !updatedProfile) {
        this.logger.error(
          `Failed to update profile in database: ${error?.message}`,
        );
        throw new BadRequestException(
          `Failed to update profile: ${error?.message || 'Unknown error'}`,
        );
      }

      this.logger.log(`✅ Profile updated successfully for user ${userId}`);
      return this.sanitizeUser(updatedProfile);
    } catch (error) {
      this.logger.error(
        `Error updating profile: ${error.message}`,
        error.stack,
      );
      throw error;
    }
  }

  /**
   * Validate JWT token.
   * Χρησιμοποιείται από το JwtStrategy.
   */
  async validateToken(token: string) {
    try {
      const payload = this.jwtService.verify(token);
      return payload;
    } catch (error) {
      this.logger.warn(`Token validation failed: ${error.message}`);
      return null;
    }
  }

  /**
   * Generate JWT token για έναν user.
   *
   * @param user - User profile object
   * @returns JWT token string
   */
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  private generateToken(user: any): string {
    const payload = {
      sub: user.id, // 'sub' είναι standard JWT claim για user ID
      email: user.email,
      username: user.username,
      roles: user.roles,
    };

    // Το secret παίρνεται από το global config στο auth.module.ts
    // Χρησιμοποιούμε any για το options γιατί το @nestjs/jwt έχει strict types
    const expiresIn = this.configService.get<string>('JWT_EXPIRES_IN', '7d');
    return this.jwtService.sign(payload, {
      expiresIn,
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
    } as any);
  }

  /**
   * Remove sensitive data από το user object πριν το στείλεις στον client.
   *
   * @param user - Raw user object από database
   * @returns Sanitized user object
   */
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  private sanitizeUser(user: any) {
    return {
      id: user.id,
      email: user.email,
      username: user.username,
      displayName: user.display_name,
      avatarUrl: user.avatar_url,
      bio: user.bio,
      roles: user.roles,
      stats: {
        articlesCount: user.articles_count,
        followersCount: user.followers_count,
        followingCount: user.following_count,
        likesReceived: user.likes_received,
        commentsCount: user.comments_count,
      },
      socialLinks: {
        twitter: user.social_twitter,
        github: user.social_github,
        website: user.social_website,
        discord: user.social_discord,
      },
      createdAt: user.created_at,
      lastSeenAt: user.last_seen_at,
    };
  }
}

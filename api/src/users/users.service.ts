import {
  Injectable,
  NotFoundException,
  BadRequestException,
  Logger,
} from '@nestjs/common';
import { SupabaseService } from '../supabase/supabase.service';

/**
 * Users Service
 * Handle-άρει όλες τις user-related operations
 */
@Injectable()
export class UsersService {
  private readonly logger = new Logger(UsersService.name);

  constructor(private readonly supabaseService: SupabaseService) {}

  /**
   * Get όλους τους users με pagination
   */
  async findAll(page = 1, limit = 20) {
    const offset = (page - 1) * limit;

    const { data, error, count } = await this.supabaseService
      .getClient()
      .from('profiles')
      .select('*', { count: 'exact' })
      .range(offset, offset + limit - 1)
      .order('created_at', { ascending: false });

    if (error) {
      this.logger.error(`Failed to fetch users: ${error.message}`);
      throw new BadRequestException('Failed to fetch users');
    }

    return {
      data: data.map((user) => this.sanitizeUser(user)),
      meta: {
        page,
        limit,
        total: count || 0,
        totalPages: Math.ceil((count || 0) / limit),
      },
    };
  }

  /**
   * Get user by ID
   */
  async findOne(id: string) {
    const { data, error } = await this.supabaseService
      .getClient()
      .from('profiles')
      .select('*')
      .eq('id', id)
      .single();

    if (error || !data) {
      throw new NotFoundException(`User with ID ${id} not found`);
    }

    return this.sanitizeUser(data);
  }

  /**
   * Get user by username
   */
  async findByUsername(username: string) {
    const { data, error } = await this.supabaseService
      .getClient()
      .from('profiles')
      .select('*')
      .eq('username', username)
      .single();

    if (error || !data) {
      throw new NotFoundException(`User ${username} not found`);
    }

    return this.sanitizeUser(data);
  }

  /**
   * Update user profile
   */
  async update(userId: string, updateData: any) {
    const { data, error } = await this.supabaseService
      .getClient()
      .from('profiles')
      .update({
        display_name: updateData.displayName,
        bio: updateData.bio,
        avatar_url: updateData.avatarUrl,
        social_twitter: updateData.socialLinks?.twitter,
        social_github: updateData.socialLinks?.github,
        social_website: updateData.socialLinks?.website,
        social_discord: updateData.socialLinks?.discord,
        email_notifications: updateData.emailNotifications,
        privacy_settings: updateData.privacySettings,
        updated_at: new Date().toISOString(),
      })
      .eq('id', userId)
      .select()
      .single();

    if (error) {
      this.logger.error(`Failed to update user: ${error.message}`);
      throw new BadRequestException('Failed to update user');
    }

    return this.sanitizeUser(data);
  }

  /**
   * Get user's articles
   */
  async getUserArticles(userId: string, onlyPublished = true) {
    let query = this.supabaseService
      .getClient()
      .from('articles')
      .select('*')
      .eq('author_id', userId);

    if (onlyPublished) {
      query = query.eq('is_published', true);
    }

    const { data, error } = await query.order('published_at', {
      ascending: false,
    });

    if (error) {
      throw new BadRequestException('Failed to fetch user articles');
    }

    return data;
  }

  /**
   * Get user's followers
   */
  async getFollowers(userId: string) {
    const { data, error } = await this.supabaseService
      .getClient()
      .from('follows')
      .select('follower_id, profiles!follows_follower_id_fkey(*)')
      .eq('following_id', userId);

    if (error) {
      throw new BadRequestException('Failed to fetch followers');
    }

    return data.map((f) => this.sanitizeUser(f.profiles));
  }

  /**
   * Get users που follow-άρει ο user
   */
  async getFollowing(userId: string) {
    const { data, error } = await this.supabaseService
      .getClient()
      .from('follows')
      .select('following_id, profiles!follows_following_id_fkey(*)')
      .eq('follower_id', userId);

    if (error) {
      throw new BadRequestException('Failed to fetch following');
    }

    return data.map((f) => this.sanitizeUser(f.profiles));
  }

  /**
   * Sanitize user object
   */
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

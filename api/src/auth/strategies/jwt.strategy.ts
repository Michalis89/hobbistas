import { Injectable, UnauthorizedException } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { PassportStrategy } from '@nestjs/passport';
import { ExtractJwt, Strategy } from 'passport-jwt';
import { SupabaseService } from '../../supabase/supabase.service';

/**
 * JWT Strategy για Passport authentication.
 *
 * Αυτή η strategy validate-άρει το JWT token που στέλνεται στα requests
 * και επιστρέφει το user object που θα είναι διαθέσιμο στο req.user.
 */
@Injectable()
export class JwtStrategy extends PassportStrategy(Strategy) {
  constructor(
    private readonly configService: ConfigService,
    private readonly supabaseService: SupabaseService,
  ) {
    super({
      // Extract JWT από το Authorization header ως Bearer token
      jwtFromRequest: ExtractJwt.fromAuthHeaderAsBearerToken(),

      // Μην ignore-άρεις expired tokens
      ignoreExpiration: false,

      // Secret key για verification του token
      secretOrKey: configService.get<string>('JWT_SECRET'),
    });
  }

  /**
   * Validate method που καλείται αυτόματα από το Passport
   * όταν ένα valid JWT token βρεθεί στο request.
   *
   * Το payload περιέχει τα decoded data από το JWT token.
   *
   * @param payload - Decoded JWT payload
   * @returns User object που θα προστεθεί στο request.user
   */
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  async validate(payload: any) {
    // Το payload περιέχει { sub: userId, email: 'user@example.com', ... }
    const userId = payload.sub;

    if (!userId) {
      throw new UnauthorizedException('Invalid token payload');
    }

    // Fetch full user data από τη βάση
    const { data: user, error } = await this.supabaseService
      .getClient()
      .from('profiles')
      .select('*')
      .eq('id', userId)
      .single();

    if (error || !user) {
      throw new UnauthorizedException('User not found');
    }

    // Το return value γίνεται available ως req.user στους controllers
    return {
      id: user.id,
      email: user.email,
      username: user.username,
      displayName: user.display_name,
      roles: user.roles,
      avatarUrl: user.avatar_url,
    };
  }
}

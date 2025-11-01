import { Injectable, Logger, OnModuleInit } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { createClient, SupabaseClient } from '@supabase/supabase-js';

/**
 * Supabase Service
 *
 * Centralized service για όλες τις Supabase operations.
 * Δημιουργεί και διαχειρίζεται το Supabase client instance.
 */
@Injectable()
export class SupabaseService implements OnModuleInit {
  private readonly logger = new Logger(SupabaseService.name);
  private supabaseClient: SupabaseClient;

  constructor(private readonly configService: ConfigService) {}

  /**
   * Lifecycle hook που τρέχει όταν το module initialization τελειώνει.
   * Εδώ δημιουργούμε το Supabase client.
   */
  onModuleInit() {
    const supabaseUrl = this.configService.get<string>('SUPABASE_URL');
    const supabaseKey = this.configService.get<string>(
      'SUPABASE_SERVICE_ROLE_KEY',
    );

    if (!supabaseUrl || !supabaseKey) {
      this.logger.error(
        '❌ Missing Supabase credentials. Check your .env file.',
      );
      throw new Error('Missing Supabase configuration');
    }

    // Δημιουργία Supabase client με service role key
    // Service role key bypasses RLS - χρησιμοποίησε με προσοχή!
    this.supabaseClient = createClient(supabaseUrl, supabaseKey, {
      auth: {
        autoRefreshToken: false,
        persistSession: false,
      },
    });

    this.logger.log('✅ Supabase client initialized successfully');
  }

  /**
   * Επιστρέφει το Supabase client instance.
   * Χρησιμοποίησε αυτό για να κάνεις queries στη βάση.
   *
   * @example
   * const { data, error } = await this.supabase
   *   .getClient()
   *   .from('profiles')
   *   .select('*')
   *   .eq('id', userId);
   */
  getClient(): SupabaseClient {
    return this.supabaseClient;
  }

  /**
   * Helper method για authentication με Supabase Auth.
   * Χρησιμοποιείται για να δημιουργήσεις ένα authenticated client.
   *
   * @param accessToken - JWT token από τον user
   * @returns Authenticated Supabase client
   */
  getClientWithAuth(accessToken: string): SupabaseClient {
    const supabaseUrl = this.configService.get<string>('SUPABASE_URL');
    const supabaseKey = this.configService.get<string>('SUPABASE_ANON_KEY');

    return createClient(supabaseUrl, supabaseKey, {
      global: {
        headers: {
          Authorization: `Bearer ${accessToken}`,
        },
      },
    });
  }

  /**
   * Utility method για να verify-άρεις ένα JWT token.
   *
   * @param token - JWT token προς verification
   * @returns User object αν το token είναι valid, null αλλιώς
   */
  async verifyToken(token: string) {
    const {
      data: { user },
      error,
    } = await this.supabaseClient.auth.getUser(token);

    if (error) {
      this.logger.warn(`Token verification failed: ${error.message}`);
      return null;
    }

    return user;
  }

  /**
   * Helper για να δημιουργήσεις έναν νέο χρήστη με Supabase Auth.
   *
   * @param email - User email
   * @param password - User password
   * @param metadata - Additional user metadata (όνομα, avatar, etc.)
   * @returns Created user object
   */
  async createUser(
    email: string,
    password: string,
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    metadata?: Record<string, any>,
  ) {
    const { data, error } = await this.supabaseClient.auth.admin.createUser({
      email,
      password,
      email_confirm: true, // Auto-confirm email για development
      user_metadata: metadata,
    });

    if (error) {
      this.logger.error(`Failed to create user: ${error.message}`);
      throw error;
    }

    return data;
  }

  /**
   * Helper για login με email/password.
   *
   * @param email - User email
   * @param password - User password
   * @returns Session object με access token
   */
  async signIn(email: string, password: string) {
    const { data, error } = await this.supabaseClient.auth.signInWithPassword({
      email,
      password,
    });

    if (error) {
      this.logger.warn(`Sign in failed: ${error.message}`);
      throw error;
    }

    return data;
  }

  /**
   * Helper για να πάρεις όλα τα profiles.
   * Example method - customize based on your needs.
   */
  async getProfiles() {
    const { data, error } = await this.supabaseClient
      .from('profiles')
      .select('*');

    if (error) {
      this.logger.error(`Failed to fetch profiles: ${error.message}`);
      throw error;
    }

    return data;
  }
}

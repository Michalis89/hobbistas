import { Module } from '@nestjs/common';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { JwtModule } from '@nestjs/jwt';
import { PassportModule } from '@nestjs/passport';
import { AuthController } from './auth.controller';
import { AuthService } from './auth.service';
import { JwtStrategy } from './strategies/jwt.strategy';
import { SupabaseModule } from '../supabase/supabase.module';

/**
 * Auth Module
 *
 * Ενσωματώνει όλα τα authentication-related components:
 * - AuthController: HTTP endpoints για register/login/logout
 * - AuthService: Business logic για authentication
 * - JwtStrategy: Passport strategy για JWT validation
 * - JwtModule: JWT token generation & verification
 * - PassportModule: Passport integration
 *
 * Exports:
 * - AuthService: Για χρήση σε άλλα modules
 * - JwtModule: Για token operations σε άλλα modules
 */
@Module({
  imports: [
    ConfigModule,
    SupabaseModule, // Για database access
    PassportModule.register({ defaultStrategy: 'jwt' }), // Default strategy

    // JWT Module configuration
    // Σημείωση: Το expiresIn το ορίζουμε στο sign() method, όχι εδώ
    JwtModule.registerAsync({
      imports: [ConfigModule],
      inject: [ConfigService],
      useFactory: (config: ConfigService) => ({
        secret: config.get<string>('JWT_SECRET'),
      }),
    }),
  ],
  controllers: [AuthController],
  providers: [AuthService, JwtStrategy],
  exports: [AuthService, JwtModule], // Export για χρήση σε άλλα modules
})
export class AuthModule {}

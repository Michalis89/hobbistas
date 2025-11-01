import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { APP_GUARD } from '@nestjs/core';
import { AppController } from './app.controller';
import { AppService } from './app.service';

// Import όλων των modules
import { SupabaseModule } from '../supabase/supabase.module';
import { AuthModule } from '../auth/auth.module';
import { UsersModule } from '../users/users.module';
import { ArticlesModule } from '../articles/articles.module';
import { CategoriesModule } from '../categories/categories.module';
import { InteractionsModule } from '../interactions/interactions.module';
import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard';

/**
 * Root Application Module
 *
 * Ενσωματώνει όλα τα feature modules της εφαρμογής.
 *
 * Modules:
 * - ConfigModule: Environment variables (.env)
 * - SupabaseModule: Database connection
 * - AuthModule: Authentication (register, login, JWT)
 * - UsersModule: User management & profiles
 * - ArticlesModule: Article CRUD & publishing
 * - CategoriesModule: Article categories
 * - InteractionsModule: Likes, bookmarks, follows
 *
 * Global Guards:
 * - JwtAuthGuard: Protect όλα τα routes by default (εκτός από @Public())
 */
@Module({
  imports: [
    // Config Module - Load environment variables
    ConfigModule.forRoot({
      isGlobal: true, // Κάνε το ConfigService available παντού
      envFilePath: '.env',
    }),

    // Core Modules
    SupabaseModule, // Database
    AuthModule, // Authentication

    // Feature Modules
    UsersModule,
    ArticlesModule,
    CategoriesModule,
    InteractionsModule,
  ],
  controllers: [AppController],
  providers: [
    AppService,
    // Global JWT Guard - Protect όλα τα routes by default
    // Για public routes χρησιμοποίησε το @Public() decorator
    {
      provide: APP_GUARD,
      useClass: JwtAuthGuard,
    },
  ],
})
export class AppModule {}

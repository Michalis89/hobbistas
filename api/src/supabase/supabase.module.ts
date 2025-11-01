import { Global, Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { SupabaseService } from './supabase.service';

/**
 * Supabase Module
 *
 * Global module που παρέχει τον Supabase client σε όλη την εφαρμογή.
 * Ο @Global decorator σημαίνει ότι δεν χρειάζεται να import-άρουμε
 * το module σε κάθε feature module - είναι διαθέσιμο παντού.
 */
@Global()
@Module({
  imports: [ConfigModule],
  providers: [SupabaseService],
  exports: [SupabaseService], // Export για χρήση σε άλλα modules
})
export class SupabaseModule {}

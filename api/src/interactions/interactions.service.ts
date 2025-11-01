import { Injectable, Logger } from '@nestjs/common';
import { SupabaseService } from '../supabase/supabase.service';

@Injectable()
export class InteractionsService {
  private readonly logger = new Logger(InteractionsService.name);

  constructor(private readonly supabaseService: SupabaseService) {}

  // ===== LIKES =====
  async likeArticle(userId: string, articleId: string) {
    const { data, error } = await this.supabaseService
      .getClient()
      .from('likes')
      .insert({ user_id: userId, article_id: articleId })
      .select()
      .single();

    if (error) throw new Error('Failed to like article');
    return { message: 'Article liked', data };
  }

  async unlikeArticle(userId: string, articleId: string) {
    const { error } = await this.supabaseService
      .getClient()
      .from('likes')
      .delete()
      .eq('user_id', userId)
      .eq('article_id', articleId);

    if (error) throw new Error('Failed to unlike article');
    return { message: 'Article unliked' };
  }

  // ===== BOOKMARKS =====
  async bookmarkArticle(userId: string, articleId: string) {
    const { data, error } = await this.supabaseService
      .getClient()
      .from('bookmarks')
      .insert({ user_id: userId, article_id: articleId })
      .select()
      .single();

    if (error) throw new Error('Failed to bookmark article');
    return { message: 'Article bookmarked', data };
  }

  async unbookmarkArticle(userId: string, articleId: string) {
    const { error } = await this.supabaseService
      .getClient()
      .from('bookmarks')
      .delete()
      .eq('user_id', userId)
      .eq('article_id', articleId);

    if (error) throw new Error('Failed to unbookmark article');
    return { message: 'Bookmark removed' };
  }

  async getUserBookmarks(userId: string) {
    const { data, error } = await this.supabaseService
      .getClient()
      .from('bookmarks')
      .select('*, articles(*)')
      .eq('user_id', userId)
      .order('created_at', { ascending: false });

    if (error) throw new Error('Failed to fetch bookmarks');
    return data;
  }

  // ===== FOLLOWS =====
  async followUser(followerId: string, followingId: string) {
    const { data, error } = await this.supabaseService
      .getClient()
      .from('follows')
      .insert({ follower_id: followerId, following_id: followingId })
      .select()
      .single();

    if (error) throw new Error('Failed to follow user');
    return { message: 'User followed', data };
  }

  async unfollowUser(followerId: string, followingId: string) {
    const { error } = await this.supabaseService
      .getClient()
      .from('follows')
      .delete()
      .eq('follower_id', followerId)
      .eq('following_id', followingId);

    if (error) throw new Error('Failed to unfollow user');
    return { message: 'User unfollowed' };
  }
}

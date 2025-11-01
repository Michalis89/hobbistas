import { Injectable, NotFoundException, Logger } from '@nestjs/common';
import { SupabaseService } from '../supabase/supabase.service';

@Injectable()
export class ArticlesService {
  private readonly logger = new Logger(ArticlesService.name);

  constructor(private readonly supabaseService: SupabaseService) {}

  async findAll(filters?: any) {
    let query = this.supabaseService
      .getClient()
      .from('articles')
      .select(
        '*, profiles!articles_author_id_fkey(display_name, username, avatar_url), categories(label, icon)',
      )
      .eq('is_published', true);

    if (filters?.category) {
      query = query.eq('category_id', filters.category);
    }

    const { data, error } = await query.order('published_at', {
      ascending: false,
    });

    if (error) throw new NotFoundException('Failed to fetch articles');
    return data;
  }

  async findBySlug(slug: string) {
    const { data, error } = await this.supabaseService
      .getClient()
      .from('articles')
      .select('*, profiles!articles_author_id_fkey(*), categories(*)')
      .eq('slug', slug)
      .single();

    if (error || !data) throw new NotFoundException(`Article not found`);

    // Increment views
    await this.supabaseService
      .getClient()
      .from('articles')
      .update({ views_count: data.views_count + 1 })
      .eq('id', data.id);

    return data;
  }

  async create(authorId: string, createDto: any) {
    const { data, error } = await this.supabaseService
      .getClient()
      .from('articles')
      .insert({
        title: createDto.title,
        slug: this.generateSlug(createDto.title),
        excerpt: createDto.excerpt,
        content: createDto.content,
        cover_image_url: createDto.coverImageUrl,
        author_id: authorId,
        category_id: createDto.categoryId,
        is_draft: createDto.isDraft ?? true,
        read_time_minutes: this.calculateReadTime(createDto.content),
      })
      .select()
      .single();

    if (error) throw new Error('Failed to create article');
    return data;
  }

  async update(articleId: string, updateDto: any) {
    const { data, error } = await this.supabaseService
      .getClient()
      .from('articles')
      .update(updateDto)
      .eq('id', articleId)
      .select()
      .single();

    if (error) throw new NotFoundException('Failed to update article');
    return data;
  }

  async publish(articleId: string) {
    const { data, error } = await this.supabaseService
      .getClient()
      .from('articles')
      .update({
        is_draft: false,
        is_published: true,
        published_at: new Date().toISOString(),
      })
      .eq('id', articleId)
      .select()
      .single();

    if (error) throw new Error('Failed to publish article');
    return data;
  }

  async delete(articleId: string) {
    const { error } = await this.supabaseService
      .getClient()
      .from('articles')
      .delete()
      .eq('id', articleId);

    if (error) throw new Error('Failed to delete article');
    return { message: 'Article deleted successfully' };
  }

  async getTrending(limit = 10) {
    const { data, error } = await this.supabaseService
      .getClient()
      .from('trending_articles') // View που δημιουργήσαμε
      .select('*')
      .limit(limit);

    if (error) throw new Error('Failed to fetch trending articles');
    return data;
  }

  private generateSlug(title: string): string {
    return (
      title
        .toLowerCase()
        .replace(/[^\w\s-]/g, '')
        .replace(/\s+/g, '-')
        .substring(0, 100) +
      '-' +
      Date.now()
    );
  }

  private calculateReadTime(content: string): number {
    const wordsPerMinute = 200;
    const words = content.split(/\s+/).length;
    return Math.ceil(words / wordsPerMinute);
  }
}

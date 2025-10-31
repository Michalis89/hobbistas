import { Component, computed, inject } from '@angular/core';
import { toSignal } from '@angular/core/rxjs-interop';
import { ActivatedRoute } from '@angular/router';
import { Article } from '@hobbistas/models';
import { ArticleCardComponent } from '@hobbistas/ui';

@Component({
  selector: 'app-category-page',
  standalone: true,
  imports: [ArticleCardComponent],
  templateUrl: './category-page.html',
  styleUrls: ['./category-page.scss'],
})
export class CategoryPageComponent {
  private readonly route = inject(ActivatedRoute);

  private readonly dataSig = toSignal(this.route.data, {
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    initialValue: {} as any,
  });
  private readonly metaSig = computed(
    () => this.dataSig()?.['meta'] ?? this.dataSig(),
  );

  readonly title = computed<string>(() => this.metaSig()?.title ?? 'Κατηγορία');
  readonly category = computed<string>(
    () => this.metaSig()?.category ?? 'blog',
  );

  private readonly MOCK_AUTHOR: Article['author'] = {
    id: 'mock-author-1',
    displayName: 'Μιχαήλ',
    email: 'mihail@example.com',
    roles: ['author'],
    stats: {
      articlesCount: 12,
      followersCount: 230,
      followingCount: 120,
      likesReceived: 1500,
      commentsCount: 350,
    },
    joinedAt: '2024-01-01',
  };

  // Mock articles - θα αντικατασταθούν με πραγματικά data από API
  readonly articles = computed<Article[]>(() =>
    this.getMockArticles(this.title(), this.category()),
  );

  private getMockArticles(title: string, category: string): Article[] {
    const base: Partial<Article>[] = [
      {
        title: `Πρώτο άρθρο για ${title}`,
        excerpt:
          'Αυτό είναι ένα δοκιμαστικό άρθρο που δείχνει πώς θα φαίνονται τα περιεχόμενα σε αυτή την κατηγορία.',
        tags: [category, 'demo'],
        coverImageUrl: `https://picsum.photos/seed/${category}1/800/400`,
        publishedAt: '2024-01-15',
      },
      {
        title: `Δεύτερο άρθρο για ${title}`,
        excerpt:
          'Ένα ακόμη παράδειγμα άρθρου με διαφορετικό περιεχόμενο και εικόνα.',
        tags: [category, 'tutorial'],
        coverImageUrl: `https://picsum.photos/seed/${category}2/800/400`,
        publishedAt: '2024-01-20',
      },
      {
        title: 'Τρίτο άρθρο - Χωρίς εικόνα',
        excerpt:
          'Αυτό το άρθρο δεν έχει εικόνα εξωφύλλου, για να δείξουμε πώς φαίνεται σε αυτή την περίπτωση.',
        tags: [category, 'guide'],
        publishedAt: '2024-01-25',
      },
      {
        title:
          'Τέταρτο άρθρο με μεγάλο τίτλο που ίσως χρειαστεί περισσότερες γραμμές',
        excerpt:
          'Περιγραφή αυτού του άρθρου με περισσότερο κείμενο για να δούμε πώς συμπεριφέρεται το layout όταν έχουμε μεγαλύτερα excerpts.',
        tags: [category, 'review', 'detailed'],
        coverImageUrl: `https://picsum.photos/seed/${category}4/800/400`,
        publishedAt: '2024-02-01',
      },
    ];

    return base.map((article, index) => ({
      id: `${this.category}-${index + 1}`,
      title: article.title ?? '',
      slug: `${this.category}-article-${index + 1}`,
      excerpt: article.excerpt,
      coverImageUrl: article.coverImageUrl,
      tags: article.tags ?? [],
      category: category as Article['category'],
      author: this.MOCK_AUTHOR,
      authorId: this.MOCK_AUTHOR.id,
      publishedAt: article.publishedAt,
      updatedAt: article.publishedAt,
      draft: false,
      stats: {
        views: 0,
        likes: 0,
        comments: 0,
        shares: 0,
        readTime: 3,
      },
    }));
  }
}

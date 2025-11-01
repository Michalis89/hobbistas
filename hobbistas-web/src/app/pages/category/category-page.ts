import { Component, computed, inject, OnInit, signal, effect } from '@angular/core';
import { toSignal } from '@angular/core/rxjs-interop';
import { ActivatedRoute } from '@angular/router';
import { Article } from '@hobbistas/models';
import { ArticleCardComponent } from '@hobbistas/ui';
import { ApiService } from '@hobbistas/data-access';

@Component({
  selector: 'app-category-page',
  standalone: true,
  imports: [ArticleCardComponent],
  templateUrl: './category-page.html',
  styleUrls: ['./category-page.scss'],
})
export class CategoryPageComponent implements OnInit {
  private readonly route = inject(ActivatedRoute);
  private readonly apiService = inject(ApiService);

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

  // Loading state
  loading = signal(true);

  // Articles - φορτώνονται από API
  articles = signal<Article[]>([]);

  constructor() {
    // Effect που τρέχει όταν αλλάζει η κατηγορία
    effect(() => {
      const category = this.category();
      if (category) {
        this.loadArticles(category);
      }
    });
  }

  ngOnInit(): void {
    // Το effect θα φορτώσει τα articles αυτόματα
  }

  /**
   * Φόρτωμα articles από API για συγκεκριμένη κατηγορία
   */
  private loadArticles(category: string): void {
    this.loading.set(true);

    this.apiService.getArticles({ category }).subscribe({
      next: (articles) => {
        console.log(`✅ Articles loaded for category "${category}":`, articles);
        this.articles.set(articles);
        this.loading.set(false);
      },
      error: (err) => {
        console.error(`❌ Error loading articles for category "${category}":`, err);
        // Το API Service θα επιστρέψει fallback values automatically
        this.loading.set(false);
      },
    });
  }
}

import { Component, OnInit, signal, inject } from '@angular/core';
import { RouterLink } from '@angular/router';
import { CommonModule } from '@angular/common';
import { Article, CategoryInfo } from '@hobbistas/models';
import { ApiService } from '@hobbistas/data-access';

interface Stat {
  label: string;
  value: string;
  icon: string;
}

@Component({
  selector: 'app-home',
  imports: [RouterLink, CommonModule],
  templateUrl: './home.html',
  styleUrl: './home.scss',
})
export class HomeComponent implements OnInit {
  // Inject API Service
  private readonly apiService = inject(ApiService);

  // Loading states
  loading = signal(true);
  categoriesLoading = signal(true);
  articlesLoading = signal(true);
  // Hero section data
  heroTitle = 'Καλώς ήρθες στον Χομπίστα';
  heroSubtitle = 'Η πλατφόρμα σου για όλα τα χόμπι και τα πάθη σου';
  heroDescription =
    'Reviews, οδηγοί, σημειώσεις και projects — όλα στα ελληνικά. Μοιράσου τις εμπειρίες σου, ανακάλυψε νέα ενδιαφέροντα και συνδέσου με την κοινότητα.';

  // Platform stats
  stats: Stat[] = [
    { label: 'Άρθρα', value: '250+', icon: '📝' },
    { label: 'Κατηγορίες', value: '9', icon: '🎯' },
    { label: 'Μέλη', value: '1.2K', icon: '👥' },
    { label: 'Reviews', value: '180+', icon: '⭐' },
  ];

  // Featured articles - Φορτώνονται από API
  featuredArticles = signal<Article[]>([]);

  // Categories - Φορτώνονται από API
  categories = signal<CategoryInfo[]>([]);

  // Latest articles - Φορτώνονται από API
  latestArticles = signal<Article[]>([]);

  // Trending tags - Προς το παρόν static (μπορούμε να τα φορτώσουμε από API αργότερα)
  trendingTags = [
    { name: 'baldurs-gate-3', count: 45 },
    { name: 'dnd-5e', count: 38 },
    { name: 'react', count: 32 },
    { name: 'fantasy-books', count: 29 },
    { name: 'dog-training', count: 24 },
    { name: 'vape-reviews', count: 21 },
    { name: 'typescript', count: 19 },
    { name: 'homebrew', count: 17 },
  ];

  /**
   * Lifecycle hook - Φόρτωμα data από API όταν αρχικοποιείται το component
   */
  ngOnInit(): void {
    this.loadCategories();
    this.loadFeaturedArticles();
    this.loadLatestArticles();
  }

  /**
   * Φόρτωμα categories από backend
   */
  private loadCategories(): void {
    this.categoriesLoading.set(true);

    this.apiService.getCategories().subscribe({
      next: (categories) => {
        console.log('✅ Categories loaded from API:', categories);
        this.categories.set(categories);
        this.categoriesLoading.set(false);
      },
      error: (err) => {
        console.error('❌ Error loading categories:', err);
        // Το API Service θα επιστρέψει fallback values automatically
        // Οπότε δεν χρειάζεται να κάνουμε κάτι εδώ
        this.categoriesLoading.set(false);
      },
    });
  }

  /**
   * Φόρτωμα trending articles (featured section)
   */
  private loadFeaturedArticles(): void {
    this.articlesLoading.set(true);

    // Παίρνουμε 3 trending articles για το featured section
    this.apiService.getTrendingArticles(3).subscribe({
      next: (articles) => {
        console.log('✅ Featured articles loaded from API:', articles);
        this.featuredArticles.set(articles);
        this.checkAllArticlesLoaded();
      },
      error: (err) => {
        console.error('❌ Error loading featured articles:', err);
        this.checkAllArticlesLoaded();
      },
    });
  }

  /**
   * Φόρτωμα latest articles
   */
  private loadLatestArticles(): void {
    this.apiService.getArticles().subscribe({
      next: (articles) => {
        console.log('✅ Latest articles loaded from API:', articles);
        // Παίρνουμε τα 4 πιο πρόσφατα
        this.latestArticles.set(articles.slice(0, 4));
        this.checkAllArticlesLoaded();
      },
      error: (err) => {
        console.error('❌ Error loading latest articles:', err);
        this.checkAllArticlesLoaded();
      },
    });
  }

  /**
   * Check αν όλα τα articles έχουν φορτώσει
   */
  private checkAllArticlesLoaded(): void {
    // Όταν και τα δύο requests τελειώσουν, βάζουμε loading = false
    if (
      this.featuredArticles().length > 0 &&
      this.latestArticles().length > 0
    ) {
      this.articlesLoading.set(false);
      this.loading.set(false);
    }
  }
}

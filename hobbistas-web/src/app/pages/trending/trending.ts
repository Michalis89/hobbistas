import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterLink } from '@angular/router';

interface Article {
  id: string;
  title: string;
  excerpt: string;
  coverImageUrl: string;
  author: string;
  authorAvatar: string;
  category: string;
  categoryLabel: string;
  publishedAt: string;
  stats: {
    views: number;
    likes: number;
    comments: number;
    readTime: number;
  };
  tags: string[];
  trending: {
    rank: number;
    growthPercentage: number;
  };
}

@Component({
  selector: 'app-trending',
  standalone: true,
  imports: [CommonModule, RouterLink],
  template: `
    <div class="min-h-screen bg-base-200">
      <!-- Hero Section -->
      <section class="bg-gradient-to-r from-error via-warning to-success py-16">
        <div class="container mx-auto px-4">
          <div class="text-center text-white">
            <h1 class="text-5xl font-bold mb-4">🔥 Trending Now</h1>
            <p class="text-xl opacity-90">
              Τα πιο δημοφιλή άρθρα αυτή τη στιγμή
            </p>
          </div>
        </div>
      </section>

      <!-- Stats Bar -->
      <section class="bg-base-100 border-b border-base-300">
        <div class="container mx-auto px-4 py-6">
          <div class="stats stats-horizontal shadow w-full">
            <div class="stat">
              <div class="stat-figure text-error">🔥</div>
              <div class="stat-title">Trending Articles</div>
              <div class="stat-value text-error">
                {{ trendingArticles.length }}
              </div>
            </div>
            <div class="stat">
              <div class="stat-figure text-warning">👁️</div>
              <div class="stat-title">Total Views Today</div>
              <div class="stat-value text-warning">
                {{ totalViews | number }}
              </div>
            </div>
            <div class="stat">
              <div class="stat-figure text-success">⚡</div>
              <div class="stat-title">Growth Rate</div>
              <div class="stat-value text-success">+{{ avgGrowth }}%</div>
            </div>
          </div>
        </div>
      </section>

      <!-- Trending Articles -->
      <section class="container mx-auto px-4 py-12">
        <!-- Top 3 Articles -->
        <div class="mb-12">
          <h2 class="text-3xl font-bold mb-6">🏆 Top 3 Άρθρα</h2>
          <div class="grid gap-6 md:grid-cols-3">
            @for (article of topThree; track article.id; let idx = $index) {
              <div
                class="card bg-base-100 shadow-2xl hover:shadow-3xl transition-all relative overflow-hidden group"
              >
                <!-- Rank Badge -->
                <div class="absolute top-4 left-4 z-10">
                  <div
                    class="badge badge-lg badge-error font-bold text-lg px-4 py-4 shadow-lg"
                  >
                    #{{ idx + 1 }}
                  </div>
                </div>

                <!-- Growth Badge -->
                <div class="absolute top-4 right-4 z-10">
                  <div class="badge badge-success gap-1">
                    ⬆️ +{{ article.trending.growthPercentage }}%
                  </div>
                </div>

                <figure class="h-56 overflow-hidden">
                  <img
                    [src]="article.coverImageUrl"
                    [alt]="article.title"
                    class="w-full h-full object-cover group-hover:scale-110 transition-transform duration-500"
                  />
                </figure>

                <div class="card-body">
                  <div class="badge badge-outline badge-sm">
                    {{ article.categoryLabel }}
                  </div>
                  <h3 class="card-title text-xl">{{ article.title }}</h3>
                  <p class="opacity-80 text-sm line-clamp-2">
                    {{ article.excerpt }}
                  </p>

                  <div class="flex items-center gap-3 mt-4">
                    <div class="avatar">
                      <div class="w-10 rounded-full">
                        <img
                          [src]="article.authorAvatar"
                          [alt]="article.author"
                        />
                      </div>
                    </div>
                    <div class="flex-1 min-w-0">
                      <p class="font-semibold text-sm">{{ article.author }}</p>
                      <p class="text-xs opacity-60">
                        {{ article.publishedAt }}
                      </p>
                    </div>
                  </div>

                  <div class="divider my-2"></div>

                  <div class="flex justify-between text-sm">
                    <span>👁️ {{ article.stats.views | number }}</span>
                    <span>❤️ {{ article.stats.likes }}</span>
                    <span>💬 {{ article.stats.comments }}</span>
                    <span>⏱️ {{ article.stats.readTime }} min</span>
                  </div>

                  <div class="card-actions mt-4">
                    <a
                      [routerLink]="['/article', article.id]"
                      class="btn btn-primary btn-block"
                    >
                      Διάβασε
                    </a>
                  </div>
                </div>
              </div>
            }
          </div>
        </div>

        <!-- Rest of Trending -->
        <div>
          <h2 class="text-2xl font-bold mb-6">📈 Trending Articles</h2>
          <div class="space-y-4">
            @for (article of restOfTrending; track article.id) {
              <div
                class="card card-side bg-base-100 shadow-lg hover:shadow-xl transition-all"
              >
                <!-- Rank -->
                <div
                  class="flex items-center justify-center w-16 bg-gradient-to-b from-warning to-error"
                >
                  <span class="text-2xl font-black text-white"
                    >#{{ article.trending.rank }}</span
                  >
                </div>

                <figure class="w-48 h-32">
                  <img
                    [src]="article.coverImageUrl"
                    [alt]="article.title"
                    class="w-full h-full object-cover"
                  />
                </figure>

                <div class="card-body flex-row items-center">
                  <div class="flex-1">
                    <div class="flex gap-2 items-center mb-2">
                      <div class="badge badge-sm badge-outline">
                        {{ article.categoryLabel }}
                      </div>
                      <div class="badge badge-sm badge-success gap-1">
                        ⬆️ +{{ article.trending.growthPercentage }}%
                      </div>
                    </div>
                    <h3 class="card-title">{{ article.title }}</h3>
                    <p class="text-sm opacity-70 line-clamp-1">
                      {{ article.excerpt }}
                    </p>

                    <div class="flex gap-4 mt-3 text-sm">
                      <span>👁️ {{ article.stats.views | number }}</span>
                      <span>❤️ {{ article.stats.likes }}</span>
                      <span>💬 {{ article.stats.comments }}</span>
                    </div>
                  </div>

                  <div class="card-actions">
                    <a
                      [routerLink]="['/article', article.id]"
                      class="btn btn-primary btn-sm"
                    >
                      Διάβασε
                    </a>
                  </div>
                </div>
              </div>
            }
          </div>
        </div>
      </section>
    </div>
  `,
  styles: [
    `
      .line-clamp-1 {
        display: -webkit-box;
        -webkit-line-clamp: 1;
        -webkit-box-orient: vertical;
        overflow: hidden;
      }

      .line-clamp-2 {
        display: -webkit-box;
        -webkit-line-clamp: 2;
        -webkit-box-orient: vertical;
        overflow: hidden;
      }
    `,
  ],
})
export class TrendingComponent {
  trendingArticles: Article[] = [
    {
      id: 'bg3-ultimate-guide',
      title: "Baldur's Gate 3: Ο Απόλυτος Οδηγός για Αρχάριους",
      excerpt:
        'Όλα όσα χρειάζεται να ξέρεις πριν ξεκινήσεις την περιπέτειά σου. Builds, party composition, combat tactics και πολλά άλλα!',
      coverImageUrl: 'https://picsum.photos/seed/bg3-trending/800/500',
      author: 'Μιχάλης Κ.',
      authorAvatar: 'https://api.dicebear.com/7.x/avataaars/svg?seed=michalis',
      category: 'gaming',
      categoryLabel: 'Gaming',
      publishedAt: '2 ώρες πριν',
      stats: { views: 15420, likes: 892, comments: 145, readTime: 15 },
      tags: ['bg3', 'rpg', 'guide'],
      trending: { rank: 1, growthPercentage: 245 },
    },
    {
      id: 'react-19-features',
      title: 'React 19: Όλες οι Νέες Δυνατότητες',
      excerpt:
        'Deep dive στα νέα features του React 19 και πώς θα αλλάξουν τον τρόπο που γράφουμε code.',
      coverImageUrl: 'https://picsum.photos/seed/react19-trending/800/500',
      author: 'Δημήτρης Α.',
      authorAvatar: 'https://api.dicebear.com/7.x/avataaars/svg?seed=dimitris',
      category: 'coding',
      categoryLabel: 'Coding',
      publishedAt: '5 ώρες πριν',
      stats: { views: 12850, likes: 734, comments: 98, readTime: 12 },
      tags: ['react', 'javascript', 'frontend'],
      trending: { rank: 2, growthPercentage: 198 },
    },
    {
      id: 'dnd-shadowfell-campaign',
      title: 'D&D: Η Επική Μάχη του Shadowfell',
      excerpt:
        'Session recap από την πιο intense μάχη που είχαμε ποτέ. Τα dice μας ευνόησαν... ή όχι;',
      coverImageUrl: 'https://picsum.photos/seed/dnd-shadowfell-trend/800/500',
      author: 'Άννα Π.',
      authorAvatar: 'https://api.dicebear.com/7.x/avataaars/svg?seed=anna',
      category: 'dnd',
      categoryLabel: 'D&D',
      publishedAt: '1 μέρα πριν',
      stats: { views: 9340, likes: 567, comments: 78, readTime: 10 },
      tags: ['dnd', 'session-recap', 'shadowfell'],
      trending: { rank: 3, growthPercentage: 156 },
    },
    {
      id: 'vape-diy-recipe-2025',
      title: 'DIY Vape Recipe: Το Τέλειο Cherry Vanilla',
      excerpt:
        'Η συνταγή που ψάχνεις για all-day vape. Λεπτομερείς οδηγίες και steeping tips.',
      coverImageUrl: 'https://picsum.photos/seed/vape-diy-trend/800/500',
      author: 'Νίκος Σ.',
      authorAvatar: 'https://api.dicebear.com/7.x/avataaars/svg?seed=nikos',
      category: 'vape',
      categoryLabel: 'Vape',
      publishedAt: '12 ώρες πριν',
      stats: { views: 7890, likes: 445, comments: 56, readTime: 8 },
      tags: ['vape', 'diy', 'recipe'],
      trending: { rank: 4, growthPercentage: 134 },
    },
    {
      id: 'stormlight-review',
      title: 'The Stormlight Archive: Γιατί Πρέπει να το Διαβάσεις',
      excerpt:
        'Ανάλυση του καλύτερου fantasy series της δεκαετίας. Χωρίς spoilers!',
      coverImageUrl: 'https://picsum.photos/seed/stormlight-trend/800/500',
      author: 'Ελένη Τ.',
      authorAvatar: 'https://api.dicebear.com/7.x/avataaars/svg?seed=eleni',
      category: 'books',
      categoryLabel: 'Βιβλία',
      publishedAt: '8 ώρες πριν',
      stats: { views: 6234, likes: 389, comments: 67, readTime: 18 },
      tags: ['fantasy', 'brandon-sanderson', 'review'],
      trending: { rank: 5, growthPercentage: 112 },
    },
    {
      id: 'dog-training-recall',
      title: 'Dog Training: Τέλειο Recall σε 30 Μέρες',
      excerpt:
        'Βήμα-βήμα πρόγραμμα για να έρχεται ο σκύλος σου αξιόπιστα με το κάλεσμα.',
      coverImageUrl: 'https://picsum.photos/seed/dog-training-trend/800/500',
      author: 'Μαρία Κ.',
      authorAvatar: 'https://api.dicebear.com/7.x/avataaars/svg?seed=maria',
      category: 'pets',
      categoryLabel: 'Κατοικίδια',
      publishedAt: '1 μέρα πριν',
      stats: { views: 5670, likes: 312, comments: 45, readTime: 7 },
      tags: ['dogs', 'training', 'tips'],
      trending: { rank: 6, growthPercentage: 98 },
    },
    {
      id: 'typescript-5-features',
      title: 'TypeScript 5.0: Όλα όσα Άλλαξαν',
      excerpt:
        'Οι νέες δυνατότητες του TypeScript 5 και πώς να τις χρησιμοποιήσεις στα projects σου.',
      coverImageUrl: 'https://picsum.photos/seed/ts5-trend/800/500',
      author: 'Γιώργος Δ.',
      authorAvatar: 'https://api.dicebear.com/7.x/avataaars/svg?seed=george',
      category: 'coding',
      categoryLabel: 'Coding',
      publishedAt: '6 ώρες πριν',
      stats: { views: 4890, likes: 278, comments: 34, readTime: 11 },
      tags: ['typescript', 'javascript', 'web-dev'],
      trending: { rank: 7, growthPercentage: 87 },
    },
  ];

  get topThree() {
    return this.trendingArticles.slice(0, 3);
  }

  get restOfTrending() {
    return this.trendingArticles.slice(3);
  }

  get totalViews() {
    return this.trendingArticles.reduce((sum, a) => sum + a.stats.views, 0);
  }

  get avgGrowth() {
    const avg =
      this.trendingArticles.reduce(
        (sum, a) => sum + a.trending.growthPercentage,
        0,
      ) / this.trendingArticles.length;
    return Math.round(avg);
  }
}

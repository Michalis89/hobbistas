import { Component, signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterLink } from '@angular/router';

@Component({
  selector: 'app-favorites',
  standalone: true,
  imports: [CommonModule, RouterLink],
  template: `
    <div class="min-h-screen bg-base-200 py-12">
      <div class="container mx-auto px-4">
        <div class="flex justify-between items-center mb-8">
          <div>
            <h1 class="text-4xl font-bold">❤️ Αγαπημένα Άρθρα</h1>
            <p class="opacity-70 mt-2">
              {{ favorites().length }} αποθηκευμένα άρθρα
            </p>
          </div>
          <button class="btn btn-outline" (click)="clearAll()">
            Καθαρισμός
          </button>
        </div>

        <div class="grid gap-6 md:grid-cols-2">
          @for (article of favorites(); track article.id) {
            <div
              class="card card-side bg-base-100 shadow-lg hover:shadow-xl transition"
            >
              <figure class="w-48">
                <img
                  [src]="article.image"
                  [alt]="article.title"
                  class="w-full h-full object-cover"
                />
              </figure>
              <div class="card-body">
                <div class="flex justify-between items-start">
                  <div class="badge badge-primary badge-sm">
                    {{ article.category }}
                  </div>
                  <button
                    class="btn btn-ghost btn-xs btn-circle text-error"
                    (click)="removeFavorite(article.id)"
                  >
                    ✕
                  </button>
                </div>
                <h2 class="card-title">{{ article.title }}</h2>
                <p class="text-sm opacity-70 line-clamp-2">
                  {{ article.excerpt }}
                </p>
                <div class="flex gap-3 text-xs mt-2">
                  <span>👁️ {{ article.views }}</span>
                  <span>❤️ {{ article.likes }}</span>
                  <span>⏱️ {{ article.readTime }} min</span>
                </div>
                <div class="card-actions">
                  <a
                    [routerLink]="['/article', article.id]"
                    class="btn btn-primary btn-sm"
                    >Διάβασε</a
                  >
                </div>
              </div>
            </div>
          }
        </div>

        @if (favorites().length === 0) {
          <div class="text-center py-20">
            <div class="text-6xl mb-4">💔</div>
            <h2 class="text-2xl font-bold mb-2">Δεν έχεις αγαπημένα άρθρα</h2>
            <p class="opacity-70 mb-6">
              Ξεκίνα να αποθηκεύεις άρθρα που σου αρέσουν!
            </p>
            <a routerLink="/" class="btn btn-primary">Εξερεύνησε Άρθρα</a>
          </div>
        }
      </div>
    </div>
  `,
  styles: [
    `
      .line-clamp-2 {
        display: -webkit-box;
        -webkit-line-clamp: 2;
        -webkit-box-orient: vertical;
        overflow: hidden;
      }
    `,
  ],
})
export class FavoritesComponent {
  favorites = signal([
    {
      id: '1',
      title: "Baldur's Gate 3: Ο Απόλυτος Οδηγός",
      excerpt: 'Όλα όσα χρειάζεται να ξέρεις...',
      image: 'https://picsum.photos/seed/fav1/300/200',
      category: 'Gaming',
      views: 15420,
      likes: 892,
      readTime: 15,
    },
    {
      id: '2',
      title: 'React 19 Features',
      excerpt: 'Τι νέο φέρνει το React 19...',
      image: 'https://picsum.photos/seed/fav2/300/200',
      category: 'Coding',
      views: 12850,
      likes: 734,
      readTime: 12,
    },
    {
      id: '3',
      title: 'D&D Shadowfell Campaign',
      excerpt: 'Session recap από την επική μάχη...',
      image: 'https://picsum.photos/seed/fav3/300/200',
      category: 'D&D',
      views: 9340,
      likes: 567,
      readTime: 10,
    },
    {
      id: '4',
      title: 'The Stormlight Archive Review',
      excerpt: 'Γιατί είναι το καλύτερο fantasy...',
      image: 'https://picsum.photos/seed/fav4/300/200',
      category: 'Βιβλία',
      views: 6234,
      likes: 389,
      readTime: 18,
    },
  ]);

  removeFavorite(id: string) {
    this.favorites.update((favs) => favs.filter((f) => f.id !== id));
  }

  clearAll() {
    if (confirm('Σίγουρα θέλεις να διαγράψεις όλα τα αγαπημένα;')) {
      this.favorites.set([]);
    }
  }
}

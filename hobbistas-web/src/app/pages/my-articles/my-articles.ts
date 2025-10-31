import { Component, computed, signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterLink } from '@angular/router';

@Component({
  selector: 'app-my-articles',
  standalone: true,
  imports: [CommonModule, RouterLink],
  template: `
    <div class="min-h-screen bg-base-200 py-12">
      <div class="container mx-auto px-4">
        <div class="flex justify-between items-center mb-8">
          <div>
            <h1 class="text-4xl font-bold">📝 Τα Άρθρα μου</h1>
            <p class="opacity-70 mt-2">
              {{ articles().length }} δημοσιευμένα άρθρα
            </p>
          </div>
          <button class="btn btn-primary gap-2">
            <span class="text-xl">+</span>
            Νέο Άρθρο
          </button>
        </div>

        <!-- Tabs -->
        <div class="tabs tabs-boxed mb-6">
          <a class="tab tab-active">Δημοσιευμένα ({{ publishedCount() }})</a>
          <a class="tab">Πρόχειρα ({{ draftCount() }})</a>
          <a class="tab">Αρχειοθετημένα</a>
        </div>

        <!-- Articles List -->
        <div class="space-y-4">
          @for (article of articles(); track article.id) {
            <div
              class="card card-side bg-base-100 shadow-lg hover:shadow-xl transition"
            >
              <figure class="w-64">
                <img
                  [src]="article.image"
                  [alt]="article.title"
                  class="w-full h-full object-cover"
                />
              </figure>
              <div class="card-body">
                <div class="flex justify-between items-start">
                  <div>
                    <div class="flex gap-2 mb-2">
                      <div class="badge badge-primary badge-sm">
                        {{ article.category }}
                      </div>
                      @if (article.draft) {
                        <div class="badge badge-warning badge-sm">DRAFT</div>
                      }
                    </div>
                    <h2 class="card-title">{{ article.title }}</h2>
                    <p class="text-sm opacity-70 mt-2">{{ article.excerpt }}</p>
                  </div>
                  <div class="dropdown dropdown-end">
                    <button class="btn btn-ghost btn-sm btn-circle">⋮</button>
                    <ul
                      class="dropdown-content menu p-2 shadow bg-base-100 rounded-box w-52"
                    >
                      <li><a>✏️ Επεξεργασία</a></li>
                      <li><a>📊 Στατιστικά</a></li>
                      <li><a>📤 Κοινοποίηση</a></li>
                      <li><a class="text-error">🗑️ Διαγραφή</a></li>
                    </ul>
                  </div>
                </div>

                <div class="flex gap-6 mt-4 text-sm">
                  <span>👁️ {{ article.views | number }}</span>
                  <span>❤️ {{ article.likes }}</span>
                  <span>💬 {{ article.comments }}</span>
                  <span>📅 {{ article.publishedAt }}</span>
                </div>

                <div class="card-actions mt-4">
                  <button class="btn btn-sm btn-outline">Επεξεργασία</button>
                  <a
                    [routerLink]="['/article', article.id]"
                    class="btn btn-sm btn-primary"
                    >Προβολή</a
                  >
                </div>
              </div>
            </div>
          }
        </div>
      </div>
    </div>
  `,
})
export class MyArticlesComponent {
  publishedCount = computed(
    () => this.articles().filter((a) => !a.draft).length,
  );
  draftCount = computed(() => this.articles().filter((a) => a.draft).length);
  articles = signal([
    {
      id: '1',
      title: "Baldur's Gate 3: Ο Απόλυτος Οδηγός",
      excerpt: 'Όλα όσα χρειάζεται να ξέρεις...',
      image: 'https://picsum.photos/seed/my1/400/300',
      category: 'Gaming',
      views: 15420,
      likes: 892,
      comments: 145,
      publishedAt: '2025-10-28',
      draft: false,
    },
    {
      id: '2',
      title: 'React 19 Features [DRAFT]',
      excerpt: 'Τι νέο φέρνει το React 19...',
      image: 'https://picsum.photos/seed/my2/400/300',
      category: 'Coding',
      views: 0,
      likes: 0,
      comments: 0,
      publishedAt: '—',
      draft: true,
    },
    {
      id: '3',
      title: 'D&D: Η Μάχη του Shadowfell',
      excerpt: 'Session recap από την επική μάχη...',
      image: 'https://picsum.photos/seed/my3/400/300',
      category: 'D&D',
      views: 9340,
      likes: 567,
      comments: 78,
      publishedAt: '2025-10-26',
      draft: false,
    },
  ]);
}

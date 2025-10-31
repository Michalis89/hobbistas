import { Component, signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterLink } from '@angular/router';
import { FormsModule } from '@angular/forms';

@Component({
  selector: 'app-article-detail',
  standalone: true,
  imports: [CommonModule, RouterLink, FormsModule],
  template: `
    <div class="min-h-screen bg-base-200">
      <!-- Hero Image -->
      <div class="relative h-96 overflow-hidden">
        <img [src]="article().coverImage" class="w-full h-full object-cover" />
        <div
          class="absolute inset-0 bg-gradient-to-t from-base-100 to-transparent"
        ></div>
      </div>

      <div class="container mx-auto px-4 -mt-32 relative z-10">
        <div class="max-w-4xl mx-auto">
          <!-- Article Header -->
          <div class="card bg-base-100 shadow-2xl mb-8">
            <div class="card-body">
              <div class="badge badge-primary mb-4">
                {{ article().category }}
              </div>
              <h1 class="text-5xl font-bold mb-4">{{ article().title }}</h1>

              <!-- Author Info -->
              <div class="flex items-center gap-4 mb-6">
                <div class="avatar">
                  <div
                    class="w-16 rounded-full ring ring-primary ring-offset-2"
                  >
                    <img [src]="article().author.avatar" />
                  </div>
                </div>
                <div class="flex-1">
                  <a
                    [routerLink]="['/profile', article().author.id]"
                    class="font-bold text-lg hover:text-primary"
                  >
                    {{ article().author.name }}
                  </a>
                  <div class="flex gap-4 text-sm opacity-70">
                    <span>📅 {{ article().publishedAt }}</span>
                    <span>⏱️ {{ article().readTime }} λεπτά ανάγνωσης</span>
                  </div>
                </div>
                <button class="btn btn-primary btn-sm">Ακολούθησε</button>
              </div>

              <!-- Stats & Actions -->
              <div
                class="flex flex-wrap gap-4 items-center justify-between border-y border-base-300 py-4"
              >
                <div class="flex gap-6">
                  <span>👁️ {{ article().stats.views | number }}</span>
                  <span>❤️ {{ article().stats.likes }}</span>
                  <span>💬 {{ article().stats.comments }}</span>
                </div>
                <div class="flex gap-2">
                  <button class="btn btn-sm gap-2" (click)="toggleLike()">
                    <span [class.text-error]="isLiked()">{{
                      isLiked() ? '❤️' : '🤍'
                    }}</span>
                    Like
                  </button>
                  <button class="btn btn-sm gap-2" (click)="toggleBookmark()">
                    <span [class.text-warning]="isBookmarked()">{{
                      isBookmarked() ? '⭐' : '☆'
                    }}</span>
                    Save
                  </button>
                  <button class="btn btn-sm gap-2">📤 Share</button>
                </div>
              </div>

              <!-- Tags -->
              <div class="flex gap-2 flex-wrap mt-4">
                @for (tag of article().tags; track tag) {
                  <div class="badge badge-outline">{{ tag }}</div>
                }
              </div>
            </div>
          </div>

          <!-- Article Content -->
          <div class="card bg-base-100 shadow-xl mb-8">
            <div class="card-body prose max-w-none">
              <p class="text-xl opacity-90 mb-6">{{ article().excerpt }}</p>

              <p>
                Lorem ipsum dolor sit amet, consectetur adipiscing elit. Sed do
                eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut
                enim ad minim veniam, quis nostrud exercitation ullamco laboris.
              </p>

              <h2>Πώς να ξεκινήσεις</h2>
              <p>
                Nullam quis risus eget urna mollis ornare vel eu leo. Cum sociis
                natoque penatibus et magnis dis parturient montes, nascetur
                ridiculus mus.
              </p>

              <ul>
                <li>Πρώτο βήμα: Διάλεξε το character σου</li>
                <li>Δεύτερο βήμα: Κατανόησε τους μηχανισμούς</li>
                <li>Τρίτο βήμα: Απόλαυσε το παιχνίδι</li>
              </ul>

              <h2>Advanced Tips</h2>
              <p>
                Donec id elit non mi porta gravida at eget metus. Maecenas
                faucibus mollis interdum. Vivamus sagittis lacus vel augue
                laoreet rutrum faucibus dolor auctor.
              </p>

              <blockquote class="border-l-4 border-primary pl-4 italic">
                "Το καλύτερο tip είναι να παίζεις με το δικό σου στυλ!"
              </blockquote>

              <h2>Συμπέρασμα</h2>
              <p>
                Integer posuere erat a ante venenatis dapibus posuere velit
                aliquet. Cras mattis consectetur purus sit amet fermentum. Cum
                sociis natoque penatibus et magnis dis parturient montes,
                nascetur ridiculus mus.
              </p>
            </div>
          </div>

          <!-- Comments Section -->
          <div class="card bg-base-100 shadow-xl mb-8">
            <div class="card-body">
              <h2 class="card-title mb-6">
                💬 Σχόλια ({{ comments().length }})
              </h2>

              <!-- Comment Form -->
              <div class="form-control mb-6">
                <textarea
                  [(ngModel)]="newComment"
                  placeholder="Γράψε το σχόλιό σου..."
                  class="textarea textarea-bordered h-24"
                ></textarea>
                <button
                  class="btn btn-primary btn-sm mt-2 w-fit"
                  (click)="addComment()"
                >
                  Αποστολή
                </button>
              </div>

              <!-- Comments List -->
              <div class="space-y-6">
                @for (comment of comments(); track comment.id) {
                  <div class="flex gap-4">
                    <div class="avatar">
                      <div class="w-12 rounded-full">
                        <img [src]="comment.avatar" />
                      </div>
                    </div>
                    <div class="flex-1">
                      <div class="bg-base-200 rounded-lg p-4">
                        <div class="flex justify-between items-start mb-2">
                          <div>
                            <p class="font-bold">{{ comment.author }}</p>
                            <p class="text-xs opacity-60">{{ comment.time }}</p>
                          </div>
                          <button class="btn btn-ghost btn-xs">⋮</button>
                        </div>
                        <p>{{ comment.text }}</p>
                      </div>
                      <div class="flex gap-4 mt-2 text-sm">
                        <button class="hover:text-primary">
                          ❤️ {{ comment.likes }}
                        </button>
                        <button class="hover:text-primary">💬 Απάντηση</button>
                      </div>
                    </div>
                  </div>
                }
              </div>
            </div>
          </div>

          <!-- Related Articles -->
          <div class="card bg-base-100 shadow-xl mb-12">
            <div class="card-body">
              <h2 class="card-title mb-6">📖 Σχετικά Άρθρα</h2>
              <div class="grid gap-4 md:grid-cols-3">
                @for (related of relatedArticles(); track related.id) {
                  <a
                    [routerLink]="['/article', related.id]"
                    class="card bg-base-200 hover:bg-base-300 transition"
                  >
                    <figure class="h-32">
                      <img
                        [src]="related.image"
                        class="w-full h-full object-cover"
                      />
                    </figure>
                    <div class="card-body p-4">
                      <h3 class="font-bold text-sm line-clamp-2">
                        {{ related.title }}
                      </h3>
                      <p class="text-xs opacity-70">{{ related.author }}</p>
                    </div>
                  </a>
                }
              </div>
            </div>
          </div>
        </div>
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
export class ArticleDetailComponent {
  isLiked = signal(false);
  isBookmarked = signal(false);
  newComment = '';

  article = signal({
    id: 'bg3-ultimate-guide',
    title: "Baldur's Gate 3: Ο Απόλυτος Οδηγός για Αρχάριους",
    excerpt:
      'Όλα όσα χρειάζεται να ξέρεις πριν ξεκινήσεις την περιπέτειά σου στο Forgotten Realms. Builds, party composition, combat tactics και πολλά άλλα που θα σε βοηθήσουν!',
    coverImage: 'https://picsum.photos/seed/bg3-detail/1200/600',
    category: 'Gaming',
    author: {
      id: '1',
      name: 'Μιχάλης Κ.',
      avatar: 'https://api.dicebear.com/7.x/avataaars/svg?seed=michalis',
    },
    publishedAt: '28 Οκτωβρίου 2025',
    readTime: 15,
    stats: { views: 15420, likes: 892, comments: 145 },
    tags: ['bg3', 'rpg', 'guide', 'crpg', 'larian'],
  });

  comments = signal([
    {
      id: '1',
      author: 'Άννα Π.',
      avatar: 'https://api.dicebear.com/7.x/avataaars/svg?seed=anna',
      text: 'Εξαιρετικός οδηγός! Με βοήθησε πολύ στο build μου 💪',
      time: 'πριν 2 ώρες',
      likes: 23,
    },
    {
      id: '2',
      author: 'Γιώργος Δ.',
      avatar: 'https://api.dicebear.com/7.x/avataaars/svg?seed=george',
      text: 'Θα ήθελα να δω και ένα guide για το endgame!',
      time: 'πριν 5 ώρες',
      likes: 15,
    },
    {
      id: '3',
      author: 'Ελένη Τ.',
      avatar: 'https://api.dicebear.com/7.x/avataaars/svg?seed=eleni',
      text: 'Τέλειο! Ακριβώς αυτό που έψαχνα 🔥',
      time: 'πριν 1 μέρα',
      likes: 34,
    },
  ]);

  relatedArticles = signal([
    {
      id: '2',
      title: 'D&D Session Recap: Shadowfell',
      image: 'https://picsum.photos/seed/related1/300/200',
      author: 'Άννα Π.',
    },
    {
      id: '3',
      title: 'Top 10 CRPGs του 2025',
      image: 'https://picsum.photos/seed/related2/300/200',
      author: 'Πέτρος Α.',
    },
    {
      id: '4',
      title: 'Divinity Original Sin 2 Guide',
      image: 'https://picsum.photos/seed/related3/300/200',
      author: 'Σοφία Κ.',
    },
  ]);

  toggleLike() {
    this.isLiked.update((v) => !v);
  }

  toggleBookmark() {
    this.isBookmarked.update((v) => !v);
  }

  addComment() {
    if (this.newComment.trim()) {
      this.comments.update((comments) => [
        {
          id: Date.now().toString(),
          author: 'Εσύ',
          avatar: 'https://api.dicebear.com/7.x/avataaars/svg?seed=you',
          text: this.newComment,
          time: 'τώρα',
          likes: 0,
        },
        ...comments,
      ]);
      this.newComment = '';
    }
  }
}

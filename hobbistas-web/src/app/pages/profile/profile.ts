import { Component, signal, inject, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterLink, ActivatedRoute } from '@angular/router';
import { AuthService } from '@hobbistas/data-access';

@Component({
  selector: 'app-profile',
  standalone: true,
  imports: [CommonModule, RouterLink],
  template: `
    <div class="min-h-screen bg-base-200">
      <!-- Cover -->
      <div
        class="h-64 bg-gradient-to-r from-primary via-secondary to-accent relative"
      >
        <div
          class="absolute bottom-0 left-0 right-0 h-32 bg-gradient-to-t from-base-200 to-transparent"
        ></div>
      </div>

      <div class="container mx-auto px-4 -mt-32 relative z-10">
        <!-- Profile Card -->
        <div class="card bg-base-100 shadow-2xl">
          <div class="card-body">
            <div class="flex flex-col md:flex-row gap-6">
              <!-- Avatar -->
              <div class="avatar">
                <div
                  class="w-32 rounded-2xl ring ring-primary ring-offset-4 ring-offset-base-100"
                >
                  <img [src]="user().avatar" />
                </div>
              </div>

              <!-- Info -->
              <div class="flex-1">
                <h1 class="text-4xl font-bold">
                  {{ currentUser()?.displayName || 'User' }}
                </h1>
                <p class="text-lg opacity-70">{{ currentUser()?.email }}</p>
                <p class="mt-2">{{ user().bio }}</p>

                <!-- Stats -->
                <div class="stats stats-horizontal shadow mt-6">
                  <div class="stat">
                    <div class="stat-title">Άρθρα</div>
                    <div class="stat-value text-primary">
                      {{ user().stats.articles }}
                    </div>
                  </div>
                  <!-- Following stats hidden for now
                  <div class="stat">
                    <div class="stat-title">Followers</div>
                    <div class="stat-value text-secondary">
                      {{ user().stats.followers }}
                    </div>
                  </div>
                  -->
                  <div class="stat">
                    <div class="stat-title">Likes</div>
                    <div class="stat-value text-accent">
                      {{ user().stats.likes }}
                    </div>
                  </div>
                </div>

                <!-- Actions -->
                <div class="flex gap-2 mt-6">
                  <!-- Follow/Message buttons hidden until implemented
                  <button class="btn btn-primary">Ακολούθησε</button>
                  <button class="btn btn-outline">Μήνυμα</button>
                  -->
                  <a routerLink="/settings" class="btn btn-primary"
                    >⚙️ Ρυθμίσεις</a
                  >
                  <a routerLink="/my-articles" class="btn btn-outline"
                    >📝 Τα Άρθρα μου</a
                  >
                </div>
              </div>
            </div>
          </div>
        </div>

        <!-- Tabs -->
        <div class="tabs tabs-boxed mt-6 bg-base-100">
          <a class="tab tab-active">Άρθρα</a>
          <a class="tab">Αγαπημένα</a>
          <a class="tab">Σχόλια</a>
        </div>

        <!-- Articles Grid -->
        <div class="grid gap-6 md:grid-cols-2 lg:grid-cols-3 mt-6 mb-12">
          @for (article of userArticles(); track article.id) {
            <div class="card bg-base-100 shadow-lg">
              <figure class="h-48">
                <img [src]="article.image" />
              </figure>
              <div class="card-body">
                <h3 class="card-title">{{ article.title }}</h3>
                <p class="text-sm opacity-70">{{ article.excerpt }}</p>
                <div class="flex gap-4 text-sm mt-2">
                  <span>👁️ {{ article.views }}</span>
                  <span>❤️ {{ article.likes }}</span>
                </div>
              </div>
            </div>
          }
        </div>
      </div>
    </div>
  `,
})
export class ProfileComponent implements OnInit {
  private authService = inject(AuthService);
  private route = inject(ActivatedRoute);

  // Get current user from AuthService
  currentUser = this.authService.currentUser;

  user = signal({
    name: 'Μιχάλης Καρκάνης',
    email: 'michalis@hobbistas.gr',
    avatar:
      this.currentUser()?.avatarUrl ||
      'https://api.dicebear.com/7.x/avataaars/svg?seed=default-profile',
    bio: 'Passionate gamer, D&D enthusiast, και full-stack developer. Λάτρης του fantasy και των epic stories!',
    stats: { articles: 0, followers: 0, likes: 0 },
  });

  ngOnInit(): void {
    // Update avatar from current user
    if (this.currentUser()?.avatarUrl) {
      this.user.update((u) => ({
        ...u,
        avatar: this.currentUser()!.avatarUrl!,
      }));
    }
  }

  userArticles = signal([
    {
      id: '1',
      title: "Baldur's Gate 3 Tips",
      excerpt: 'Οδηγός για αρχάριους...',
      image: 'https://picsum.photos/seed/bg3-profile/400/300',
      views: 2847,
      likes: 234,
    },
    {
      id: '2',
      title: 'D&D Session Recap',
      excerpt: 'Η μάχη του Shadowfell...',
      image: 'https://picsum.photos/seed/dnd-profile/400/300',
      views: 1523,
      likes: 187,
    },
    {
      id: '3',
      title: 'React 19 Features',
      excerpt: 'Τι νέο φέρνει...',
      image: 'https://picsum.photos/seed/react-profile/400/300',
      views: 892,
      likes: 73,
    },
  ]);
}

import { Component, signal } from '@angular/core';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-community',
  standalone: true,
  imports: [CommonModule],
  template: `
    <div class="min-h-screen bg-base-200">
      <section
        class="bg-gradient-to-r from-secondary to-accent py-16 text-white"
      >
        <div class="container mx-auto px-4 text-center">
          <h1 class="text-5xl font-bold mb-4">👥 Κοινότητα Hobbistas</h1>
          <p class="text-xl">Γνώρισε τα μέλη της κοινότητάς μας!</p>
        </div>
      </section>

      <div class="container mx-auto px-4 py-12">
        <!-- Stats -->
        <div class="stats stats-horizontal shadow w-full mb-12 bg-base-100">
          <div class="stat">
            <div class="stat-title">Συνολικά Μέλη</div>
            <div class="stat-value text-primary">1,234</div>
          </div>
          <div class="stat">
            <div class="stat-title">Συγγραφείς</div>
            <div class="stat-value text-secondary">87</div>
          </div>
          <div class="stat">
            <div class="stat-title">Άρθρα</div>
            <div class="stat-value text-accent">450+</div>
          </div>
        </div>

        <!-- Top Contributors -->
        <h2 class="text-3xl font-bold mb-6">🏆 Top Contributors</h2>
        <div class="grid gap-6 md:grid-cols-2 lg:grid-cols-4 mb-12">
          @for (member of topContributors(); track member.id) {
            <div class="card bg-base-100 shadow-lg hover:shadow-xl transition">
              <div class="card-body items-center text-center">
                <div class="avatar online">
                  <div
                    class="w-24 rounded-full ring ring-primary ring-offset-4"
                  >
                    <img [src]="member.avatar" [alt]="member.name" />
                  </div>
                </div>
                <h3 class="card-title">{{ member.name }}</h3>
                <div class="badge badge-primary">{{ member.role }}</div>
                <p class="text-sm opacity-70 mt-2">{{ member.bio }}</p>
                <div class="stats stats-vertical shadow-sm mt-4">
                  <div class="stat py-2">
                    <div class="stat-title text-xs">Άρθρα</div>
                    <div class="stat-value text-lg">{{ member.articles }}</div>
                  </div>
                  <div class="stat py-2">
                    <div class="stat-title text-xs">Followers</div>
                    <div class="stat-value text-lg">{{ member.followers }}</div>
                  </div>
                </div>
                <button class="btn btn-sm btn-primary btn-outline w-full mt-2">
                  Ακολούθησε
                </button>
              </div>
            </div>
          }
        </div>

        <!-- All Members -->
        <h2 class="text-2xl font-bold mb-6">Όλα τα Μέλη</h2>
        <div class="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
          @for (member of members(); track member.id) {
            <div
              class="card card-side bg-base-100 shadow hover:shadow-lg transition"
            >
              <figure class="w-24">
                <div class="avatar">
                  <div class="w-20 rounded-lg">
                    <img [src]="member.avatar" [alt]="member.name" />
                  </div>
                </div>
              </figure>
              <div class="card-body py-4">
                <h3 class="font-bold">{{ member.name }}</h3>
                <p class="text-xs opacity-70 line-clamp-2">{{ member.bio }}</p>
                <div class="flex gap-3 text-xs mt-2">
                  <span>📝 {{ member.articles }}</span>
                  <span>👥 {{ member.followers }}</span>
                </div>
              </div>
            </div>
          }
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
export class CommunityComponent {
  topContributors = signal([
    {
      id: '1',
      name: 'Μιχάλης Κ.',
      avatar: 'https://api.dicebear.com/7.x/avataaars/svg?seed=michalis',
      role: 'Admin',
      bio: 'Gaming & Coding enthusiast',
      articles: 47,
      followers: 1234,
    },
    {
      id: '2',
      name: 'Άννα Π.',
      avatar: 'https://api.dicebear.com/7.x/avataaars/svg?seed=anna',
      role: 'Editor',
      bio: 'D&D Dungeon Master',
      articles: 38,
      followers: 892,
    },
    {
      id: '3',
      name: 'Γιώργος Δ.',
      avatar: 'https://api.dicebear.com/7.x/avataaars/svg?seed=george',
      role: 'Author',
      bio: 'Book reviewer & Fantasy fan',
      articles: 32,
      followers: 756,
    },
    {
      id: '4',
      name: 'Ελένη Τ.',
      avatar: 'https://api.dicebear.com/7.x/avataaars/svg?seed=eleni',
      role: 'Author',
      bio: 'Epic Fantasy & Sanderson lover',
      articles: 28,
      followers: 654,
    },
  ]);

  members = signal([
    {
      id: '5',
      name: 'Δημήτρης Α.',
      avatar: 'https://api.dicebear.com/7.x/avataaars/svg?seed=dimitris',
      bio: 'React & TypeScript developer',
      articles: 24,
      followers: 512,
    },
    {
      id: '6',
      name: 'Σοφία Κ.',
      avatar: 'https://api.dicebear.com/7.x/avataaars/svg?seed=sofia',
      bio: 'Angular specialist',
      articles: 19,
      followers: 423,
    },
    {
      id: '7',
      name: 'Νίκος Σ.',
      avatar: 'https://api.dicebear.com/7.x/avataaars/svg?seed=nikos',
      bio: 'Vape reviewer',
      articles: 22,
      followers: 389,
    },
    {
      id: '8',
      name: 'Μαρία Κ.',
      avatar: 'https://api.dicebear.com/7.x/avataaars/svg?seed=maria',
      bio: 'Dog trainer',
      articles: 18,
      followers: 345,
    },
    {
      id: '9',
      name: 'Πέτρος Α.',
      avatar: 'https://api.dicebear.com/7.x/avataaars/svg?seed=petros',
      bio: 'RPG gamer',
      articles: 15,
      followers: 298,
    },
    {
      id: '10',
      name: 'Λίνα Δ.',
      avatar: 'https://api.dicebear.com/7.x/avataaars/svg?seed=lina',
      bio: 'Cat lover',
      articles: 12,
      followers: 267,
    },
  ]);
}

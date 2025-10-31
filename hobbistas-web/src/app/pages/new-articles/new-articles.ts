import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterLink } from '@angular/router';

@Component({
  selector: 'app-new-articles',
  standalone: true,
  imports: [CommonModule, RouterLink],
  template: `
    <div class="min-h-screen bg-base-200">
      <section class="bg-gradient-to-r from-primary to-secondary py-12">
        <div class="container mx-auto px-4 text-center text-white">
          <h1 class="text-5xl font-bold mb-3">⭐ Νέα Άρθρα</h1>
          <p class="text-xl">Τα τελευταία άρθρα από την κοινότητα</p>
        </div>
      </section>

      <div class="container mx-auto px-4 py-12">
        <div class="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
          @for (article of articles; track article.id) {
            <div
              class="card bg-base-100 shadow-lg hover:shadow-xl transition-all"
            >
              <div class="badge badge-accent absolute top-4 right-4 z-10">
                ΝΕΟ
              </div>
              <figure class="h-48">
                <img
                  [src]="article.image"
                  [alt]="article.title"
                  class="w-full h-full object-cover"
                />
              </figure>
              <div class="card-body">
                <div class="badge badge-sm">{{ article.category }}</div>
                <h3 class="card-title">{{ article.title }}</h3>
                <p class="text-sm opacity-70">{{ article.excerpt }}</p>
                <div class="flex items-center gap-2 mt-3">
                  <div class="avatar">
                    <div class="w-8 rounded-full">
                      <img [src]="article.authorAvatar" />
                    </div>
                  </div>
                  <div>
                    <p class="text-xs font-semibold">{{ article.author }}</p>
                    <p class="text-xs opacity-50">{{ article.time }}</p>
                  </div>
                </div>
                <a
                  [routerLink]="['/article', article.id]"
                  class="btn btn-primary btn-sm mt-4"
                  >Διάβασε</a
                >
              </div>
            </div>
          }
        </div>
      </div>
    </div>
  `,
})
export class NewArticlesComponent {
  articles = [
    {
      id: '1',
      title: 'Elden Ring DLC: Shadow of the Erdtree Review',
      excerpt: 'Το DLC που περιμέναμε!',
      image: 'https://picsum.photos/seed/elden1/400/300',
      category: 'Gaming',
      author: 'Πέτρος Α.',
      authorAvatar: 'https://api.dicebear.com/7.x/avataaars/svg?seed=petros',
      time: 'πριν 10 λεπτά',
    },
    {
      id: '2',
      title: 'Angular 18: Signals Everywhere',
      excerpt: 'Τα signals αλλάζουν τα πάντα',
      image: 'https://picsum.photos/seed/angular18/400/300',
      category: 'Coding',
      author: 'Σοφία Κ.',
      authorAvatar: 'https://api.dicebear.com/7.x/avataaars/svg?seed=sofia',
      time: 'πριν 25 λεπτά',
    },
    {
      id: '3',
      title: 'D&D Homebrew: Necromancer Subclass',
      excerpt: 'Νέα subclass για τους Wizards',
      image: 'https://picsum.photos/seed/necro/400/300',
      category: 'D&D',
      author: 'Νίκος Μ.',
      authorAvatar: 'https://api.dicebear.com/7.x/avataaars/svg?seed=nikos2',
      time: 'πριν 1 ώρα',
    },
    {
      id: '4',
      title: 'Top 10 Fantasy Books του 2025',
      excerpt: 'Η λίστα με τα must-read φέτος',
      image: 'https://picsum.photos/seed/fantasy2025/400/300',
      category: 'Βιβλία',
      author: 'Μαρίνα Τ.',
      authorAvatar: 'https://api.dicebear.com/7.x/avataaars/svg?seed=marina',
      time: 'πριν 2 ώρες',
    },
    {
      id: '5',
      title: 'Vape Setup Guide για Αρχάριους',
      excerpt: 'Οδηγός για το πρώτο σου vape',
      image: 'https://picsum.photos/seed/vape-setup/400/300',
      category: 'Vape',
      author: 'Κώστας Π.',
      authorAvatar: 'https://api.dicebear.com/7.x/avataaars/svg?seed=kostas',
      time: 'πριν 3 ώρες',
    },
    {
      id: '6',
      title: "Cat Training: Yes, It's Possible!",
      excerpt: 'Εκπαίδευση γάτας σε 5 βήματα',
      image: 'https://picsum.photos/seed/cat-training/400/300',
      category: 'Κατοικίδια',
      author: 'Λίνα Δ.',
      authorAvatar: 'https://api.dicebear.com/7.x/avataaars/svg?seed=lina',
      time: 'πριν 4 ώρες',
    },
  ];
}

import { JsonPipe } from '@angular/common';
import { Component, inject } from '@angular/core';
import { RouterModule } from '@angular/router';
import { ApiService } from '@hobbistas/data-access';
import { Article } from '@hobbistas/models';
import { ArticleCardComponent, HeaderComponent } from '@hobbistas/ui';

@Component({
  imports: [RouterModule, JsonPipe, ArticleCardComponent, HeaderComponent],
  selector: 'app-root',
  templateUrl: './app.html',
  styleUrl: './app.scss',
})
export class App {
  private readonly api = inject(ApiService);
  last?: unknown;

  demo: Article[] = [
    {
      id: '1',
      title: 'Baldur’s Gate 3 – 2nd Playthrough Notes',
      slug: 'bg3-2nd-playthrough',
      excerpt: 'Build ideas, party comps, roleplay hooks.',
      coverImageUrl: 'https://picsum.photos/seed/bg3/600/300',
      tags: ['bg3', 'guide'],
      category: 'gaming',
      authorId: 'u1',
      publishedAt: new Date().toISOString(),
      draft: false,
    },
    {
      id: '2',
      title: 'D&D Session Recap – All Against Darkness',
      slug: 'aad-session-1',
      excerpt: 'What the party learned and what’s next.',
      coverImageUrl: 'https://picsum.photos/seed/dnd/600/300',
      tags: ['dnd', 'recap'],
      category: 'dnd',
      authorId: 'u1',
      publishedAt: new Date().toISOString(),
      draft: false,
    },
  ];

  ping() {
    this.api.ping().subscribe({
      next: (res) => (this.last = res),
      error: (e) => (this.last = e),
    });
  }
}

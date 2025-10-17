import {
  ChangeDetectionStrategy,
  Component,
  Input,
  effect,
  inject,
  signal,
  DestroyRef,
  PLATFORM_ID,
} from '@angular/core';
import { RouterLink, RouterLinkActive } from '@angular/router';
import { DOCUMENT, isPlatformBrowser } from '@angular/common';

type Theme = 'core' | 'gaming';
type Child = { label: string; path: string };
type Section = { label: string; path?: string; children?: Child[] };

@Component({
  selector: 'lib-ui-header',
  standalone: true,
  imports: [RouterLink, RouterLinkActive],
  changeDetection: ChangeDetectionStrategy.OnPush,
  templateUrl: './header.html',
})
export class HeaderComponent {
  @Input() appName = 'Hobbistas';

  private readonly storageKey = 'hobbistas-theme';
  private readonly platformId = inject(PLATFORM_ID);
  private readonly doc = inject(DOCUMENT);
  private readonly destroyRef = inject(DestroyRef);

  open = signal(false);
  theme = signal<Theme>('core');

  sections: Section[] = [
    {
      label: 'Gaming',
      children: [
        { label: 'Reviews', path: '/gaming/reviews' },
        { label: 'Guides / Tips', path: '/gaming/guides' },
        { label: 'Retrospectives', path: '/gaming/retrospectives' },
        { label: 'Essays', path: '/gaming/essays' },
        { label: 'News / Updates', path: '/gaming/news' },
      ],
    },
    {
      label: 'D&D',
      children: [
        { label: 'Sessions (logs)', path: '/dnd/sessions' },
        { label: 'Characters', path: '/dnd/characters' },
        { label: 'World / Lore', path: '/dnd/lore' },
        { label: 'Artifacts / Items', path: '/dnd/items' },
      ],
    },
    {
      label: 'Fantasy',
      children: [
        { label: 'Worlds & Lore', path: '/fantasy/worlds' },
        { label: 'Greek Fantasy Scene', path: '/fantasy/greek-scene' },
        {
          label: 'Critical Role / Actual Plays',
          path: '/fantasy/actual-plays',
        },
        { label: 'Symbolism & Themes', path: '/fantasy/themes' },
      ],
    },
    {
      label: 'Collectibles / TCG',
      children: [
        { label: 'One Piece', path: '/tcg/one-piece' },
        { label: 'Magic: The Gathering', path: '/tcg/mtg' },
        { label: 'Retro Games', path: '/tcg/retro' },
        { label: 'Figures / Statues', path: '/tcg/figures' },
      ],
    },

    {
      label: 'Media',
      children: [
        { label: 'Movies', path: '/media/movies' },
        { label: 'TV Series', path: '/media/tv' },
        { label: 'Anime', path: '/media/anime' },
        { label: 'Manga', path: '/media/manga' },
        { label: 'Comics', path: '/media/comics' },
      ],
    },
    {
      label: 'Books',
      children: [
        { label: 'Reviews', path: '/books/reviews' },
        { label: 'Authors', path: '/books/authors' },
        { label: 'Quotes / Highlights', path: '/books/highlights' },
        { label: 'Collections', path: '/books/collections' },
      ],
    },

    {
      label: 'Coding',
      children: [
        { label: 'Articles', path: '/code/articles' },
        { label: 'Tutorials / Guides', path: '/code/guides' },
        { label: 'Projects / Case Studies', path: '/code/projects' },
        { label: 'Angular • NestJS', path: '/code/angular-nest' },
      ],
    },
    {
      label: 'Vape',
      children: [
        { label: 'Reviews', path: '/vape/reviews' },
        { label: 'Guides', path: '/vape/guides' },
        { label: 'Thoughts', path: '/vape/thoughts' },
      ],
    },
    {
      label: 'Pets',
      children: [
        { label: 'Daily Life', path: '/pets/daily' },
        { label: 'Health & Nutrition', path: '/pets/health' },
        { label: 'Training / Behavior', path: '/pets/training' },
        { label: 'Gear / Toys', path: '/pets/gear' },
      ],
    },
  ];

  constructor() {
    if (isPlatformBrowser(this.platformId)) {
      const saved = (localStorage.getItem(this.storageKey) as Theme) ?? 'core';
      this.theme.set(saved);
    }

    effect(() => {
      const t = this.theme();
      if (!isPlatformBrowser(this.platformId)) return;
      this.doc.documentElement.dataset['theme'] = t;
      localStorage.setItem(this.storageKey, t);
    });

    if (isPlatformBrowser(this.platformId)) {
      const mq = matchMedia('(min-width: 1024px)');
      const handler = (e: MediaQueryListEvent | MediaQueryList) => {
        if (e.matches) this.open.set(false);
      };
      handler(mq);
      mq.addEventListener('change', handler as EventListener);
      this.destroyRef.onDestroy(() =>
        mq.removeEventListener('change', handler as EventListener)
      );
    }
  }

  toggleTheme() {
    this.theme.update((t) => (t === 'core' ? 'gaming' : 'core'));
  }

  toggleMenu() {
    this.open.update((v) => !v);
  }
}

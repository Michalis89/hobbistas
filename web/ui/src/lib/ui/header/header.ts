import {
  ChangeDetectionStrategy,
  Component,
  Input,
  effect,
  inject,
  signal,
  computed,
  DestroyRef,
  PLATFORM_ID,
  ElementRef,
  HostListener,
} from '@angular/core';
import {
  NavigationEnd,
  Router,
  RouterLink,
  RouterLinkActive,
} from '@angular/router';
import { DOCUMENT, isPlatformBrowser, CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { filter } from 'rxjs';
import { AuthService } from '@hobbistas/data-access';

type Theme = 'core' | 'gaming';

interface Notification {
  id: string;
  title: string;
  message: string;
  time: string;
  read: boolean;
  type: 'info' | 'success' | 'warning';
}

interface User {
  name: string;
  email: string;
  avatar: string;
  role: string;
}

@Component({
  selector: 'lib-ui-header',
  standalone: true,
  imports: [RouterLink, RouterLinkActive, CommonModule, FormsModule],
  changeDetection: ChangeDetectionStrategy.OnPush,
  templateUrl: './header.html',
  styleUrls: ['./header.scss'],
})
export class HeaderComponent {
  @Input() appName = 'Hobbistas';

  private readonly storageKey = 'hobbistas-theme';
  private readonly platformId = inject(PLATFORM_ID);
  private readonly doc = inject(DOCUMENT);
  private readonly destroyRef = inject(DestroyRef);
  private readonly el = inject(ElementRef<HTMLElement>);
  private readonly router = inject(Router);
  private readonly authService = inject(AuthService);

  open = signal(false);
  theme = signal<Theme>('core');
  searchOpen = signal(false);
  searchQuery = signal('');
  notificationsOpen = signal(false);
  userMenuOpen = signal(false);
  browseOpen = signal(false);

  // User from AuthService
  currentUser = this.authService.currentUser;
  isAuthenticated = this.authService.isAuthenticated;

  // Check if user has write privileges (admin, author, or editor)
  canWriteArticles = computed(() => {
    const user = this.currentUser();
    if (!user || !user.roles) return false;

    const privilegedRoles = ['admin', 'author', 'editor'];
    return user.roles.some((role: string) => privilegedRoles.includes(role));
  });

  // Mock notifications
  notifications = signal<Notification[]>([
    {
      id: '1',
      title: 'Νέο σχόλιο',
      message: 'Η Άννα σχολίασε στο άρθρο σου "Baldur\'s Gate 3"',
      time: 'πριν 5 λεπτά',
      read: false,
      type: 'info',
    },
    {
      id: '2',
      title: 'Νέος follower',
      message: 'Ο Γιώργος άρχισε να σε ακολουθεί',
      time: 'πριν 1 ώρα',
      read: false,
      type: 'success',
    },
    {
      id: '3',
      title: 'Άρθρο εγκρίθηκε',
      message: 'Το άρθρο σου "D&D Tips" δημοσιεύτηκε',
      time: 'πριν 3 ώρες',
      read: true,
      type: 'success',
    },
  ]);

  unreadNotifications = signal(
    this.notifications().filter((n) => !n.read).length,
  );

  // Organized category groups for mega menu
  categoryGroups = [
    {
      icon: '🎮',
      title: 'Gaming',
      categories: [
        { label: 'Gaming', path: '/gaming' },
        { label: 'Reviews', path: '/gaming/reviews' },
        { label: 'Guides / Tips', path: '/gaming/guides' },
        { label: 'Retrospectives', path: '/gaming/retrospectives' },
        { label: 'Essays', path: '/gaming/essays' },
        { label: 'News / Updates', path: '/gaming/news' },
      ],
    },
    {
      title: 'Dungeons & Dragons',
      categories: [
        { label: 'D&D', path: '/dnd', icon: '🗡️' },
        { label: 'Sessions (logs)', path: '/dnd/sessions' },
        { label: 'Characters', path: '/dnd/characters' },
        { label: 'World / Lore', path: '/dnd/lore' },
        { label: 'Artifacts / Items', path: '/dnd/items' },
      ],
    },
    {
      title: 'Fantasy',
      categories: [
        { label: 'Fantasy', path: '/fantasy', icon: '🐉' },
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
      title: 'Συλλογές & Κάρτες',
      categories: [
        { label: 'TCG / Collectibles', path: '/tcg', icon: '🃏' },
        { label: 'One Piece', path: '/tcg/one-piece', icon: '🏴‍☠️' },
        { label: 'Magic: The Gathering', path: '/tcg/mtg', icon: '🔮' },
        { label: 'Retro Games', path: '/tcg/retro', icon: '👾' },
      ],
    },
    {
      title: 'Ψυχαγωγία',
      categories: [
        { label: 'Movies', path: '/media/movies' },
        { label: 'TV Series', path: '/media/tv' },
        { label: 'Anime', path: '/media/anime' },
        { label: 'Manga', path: '/media/manga' },
        { label: 'Comics', path: '/media/comics' },
      ],
    },
    {
      title: 'Βιβλία',
      categories: [
        { label: 'Βιβλία', path: '/books', icon: '📚' },
        { label: 'Reviews', path: '/books/reviews' },
        { label: 'Authors', path: '/books/authors' },
        { label: 'Quotes / Highlights', path: '/books/highlights' },
        { label: 'Collections', path: '/books/collections' },
      ],
    },
    {
      title: 'Coding',
      categories: [
        { label: 'Coding', path: '/code', icon: '💻' },
        { label: 'Articles', path: '/code/articles' },
        { label: 'Tutorials / Guides', path: '/code/guides' },
        { label: 'Projects / Case Studies', path: '/code/projects' },
      ],
    },
    {
      title: 'Vape',
      categories: [
        { label: 'Vape', path: '/vape', icon: '💨' },
        { label: 'Reviews', path: '/vape/reviews' },
        { label: 'Guides', path: '/vape/guides' },
        { label: 'Thoughts', path: '/vape/thoughts' },
      ],
    },
    {
      title: 'Κατοικίδια',
      categories: [
        { label: 'Κατοικίδια', path: '/pets', icon: '🐾' },
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
        mq.removeEventListener('change', handler as EventListener),
      );
    }
    this.router.events
      .pipe(filter((e) => e instanceof NavigationEnd))
      .subscribe(() => {
        this.closeBrowse();
      });
  }

  toggleTheme() {
    this.theme.update((t) => (t === 'core' ? 'gaming' : 'core'));
  }

  toggleMenu() {
    this.open.update((v) => !v);
  }

  toggleSearch() {
    this.searchOpen.update((v) => !v);
    if (this.searchOpen()) {
      // Focus search input after opening
      setTimeout(() => {
        if (isPlatformBrowser(this.platformId)) {
          const searchInput = this.doc.querySelector(
            '#search-input',
          ) as HTMLInputElement;
          searchInput?.focus();
        }
      }, 100);
    } else {
      this.searchQuery.set('');
    }
  }

  toggleNotifications() {
    this.notificationsOpen.update((v) => !v);
    this.userMenuOpen.set(false);
  }

  toggleUserMenu() {
    this.userMenuOpen.update((v) => !v);
    this.notificationsOpen.set(false);
  }

  markNotificationAsRead(id: string) {
    this.notifications.update((notifications) =>
      notifications.map((n) => (n.id === id ? { ...n, read: true } : n)),
    );
    this.unreadNotifications.set(
      this.notifications().filter((n) => !n.read).length,
    );
  }

  markAllNotificationsAsRead() {
    this.notifications.update((notifications) =>
      notifications.map((n) => ({ ...n, read: true })),
    );
    this.unreadNotifications.set(0);
  }

  onSearch() {
    if (this.searchQuery().trim()) {
      console.log('Searching for:', this.searchQuery());
      // Implement search functionality here
    }
  }

  logout() {
    console.log('Logging out...');
    this.authService.logout().subscribe({
      next: () => {
        console.log('✅ Logged out successfully');
        this.userMenuOpen.set(false);
      },
      error: (err) => {
        console.error('❌ Logout error:', err);
      },
    });
  }

  // ----- Mega menu (Browse) -----
  toggleBrowse() {
    const next = !this.browseOpen();
    this.browseOpen.set(next);

    // Κλείνουμε => καθάρισε το focus για να μην κρατάει open λόγω :focus-within
    if (!next) {
      const ae = this.doc.activeElement as HTMLElement | null;
      ae?.blur();
    }
  }

  closeBrowse() {
    if (this.browseOpen()) this.browseOpen.set(false);
  }
  onNavClick(event: MouseEvent) {
    // Προσοχή: currentTarget μπορεί να είναι null. Cast ασφαλές με check:
    const target = event.currentTarget as HTMLElement | null;
    target?.blur();
    this.closeBrowse();
  }

  // Κλείσιμο με click εκτός header
  @HostListener('document:click', ['$event'])
  onDocClick(ev: MouseEvent) {
    if (!this.el.nativeElement.contains(ev.target as Node)) {
      // Κάνουμε blur μόνο αν το browse menu είναι ανοιχτό
      if (this.browseOpen()) {
        this.closeBrowse();
        (this.doc.activeElement as HTMLElement | null)?.blur();
      }
    }
  }

  // Κλείσιμο με Escape
  @HostListener('document:keydown.escape')
  onEsc() {
    this.closeBrowse();
  }
}

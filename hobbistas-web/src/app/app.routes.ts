// app.routes.ts
import {
  Route,
  UrlMatchResult,
  UrlSegment,
  ActivatedRouteSnapshot,
} from '@angular/router';

type CategoryMeta = { title: string; category: string };

const CATEGORY_META: Record<string, CategoryMeta> = {
  gaming: { title: 'Gaming', category: 'gaming' },
  dnd: { title: 'D&D', category: 'dnd' },
  fantasy: { title: 'Φαντασία', category: 'fantasy' },
  books: { title: 'Βιβλία', category: 'books' },
  code: { title: 'Coding', category: 'code' },
  coding: { title: 'Coding', category: 'coding' },
  vape: { title: 'Vape', category: 'vape' },
  pets: { title: 'Κατοικίδια', category: 'pets' },
  media: { title: 'Media', category: 'media' },
  tcg: { title: 'TCG', category: 'tcg' },
};

const SECTIONS = new Set(Object.keys(CATEGORY_META));

/** /{section} */
export function sectionOnlyMatcher(
  segments: UrlSegment[],
): UrlMatchResult | null {
  if (segments.length === 1 && SECTIONS.has(segments[0].path)) {
    return { consumed: segments, posParams: { section: segments[0] } };
  }
  return null;
}

/** /{section}/... */
export function sectionDeepMatcher(
  segments: UrlSegment[],
): UrlMatchResult | null {
  if (segments.length >= 2 && SECTIONS.has(segments[0].path)) {
    return {
      consumed: segments,
      posParams: {
        section: segments[0],
        rest: new UrlSegment(
          segments
            .slice(1)
            .map((s) => s.path)
            .join('/'),
          {},
        ),
      },
    };
  }
  return null;
}

/** κοινός resolver: δίνει meta με title/category */
function resolveMeta(route: ActivatedRouteSnapshot): CategoryMeta {
  const section = route.paramMap.get('section');
  if (!section) {
    throw new Error('Section parameter is missing');
  }
  return CATEGORY_META[section] ?? { title: section, category: section };
}

export const appRoutes: Route[] = [
  // Home
  {
    path: '',
    loadComponent: () =>
      import('./pages/home/home').then((m) => m.HomeComponent),
  },

  // Trending & New
  {
    path: 'trending',
    loadComponent: () =>
      import('./pages/trending/trending').then((m) => m.TrendingComponent),
  },
  {
    path: 'new',
    loadComponent: () =>
      import('./pages/new-articles/new-articles').then(
        (m) => m.NewArticlesComponent,
      ),
  },

  // Community
  {
    path: 'community',
    loadComponent: () =>
      import('./pages/community/community').then((m) => m.CommunityComponent),
  },

  // User Profile
  {
    path: 'profile',
    loadComponent: () =>
      import('./pages/profile/profile').then((m) => m.ProfileComponent),
  },
  {
    path: 'profile/:id',
    loadComponent: () =>
      import('./pages/profile/profile').then((m) => m.ProfileComponent),
  },

  // My Articles
  {
    path: 'my-articles',
    loadComponent: () =>
      import('./pages/my-articles/my-articles').then(
        (m) => m.MyArticlesComponent,
      ),
  },

  // Favorites
  {
    path: 'favorites',
    loadComponent: () =>
      import('./pages/favorites/favorites').then((m) => m.FavoritesComponent),
  },

  // Settings
  {
    path: 'settings',
    loadComponent: () =>
      import('./pages/settings/settings').then((m) => m.SettingsComponent),
  },

  // Article Detail
  {
    path: 'article/:slug',
    loadComponent: () =>
      import('./pages/article-detail/article-detail').then(
        (m) => m.ArticleDetailComponent,
      ),
  },

  // ===== Categories (root) — /{section}  =====
  {
    matcher: sectionOnlyMatcher,
    loadComponent: () =>
      import('./pages/category/category-page').then(
        (m) => m.CategoryPageComponent,
      ),
    resolve: { meta: resolveMeta },
    runGuardsAndResolvers: 'paramsOrQueryParamsChange',
  },

  // ===== Deep paths (placeholders) — /{section}/...  =====
  {
    matcher: sectionDeepMatcher,
    loadComponent: () =>
      import('./pages/placeholder/placeholder').then(
        (m) => m.PlaceholderComponent,
      ),
    resolve: { meta: resolveMeta },
    runGuardsAndResolvers: 'paramsOrQueryParamsChange',
  },

  // Fallback
  { path: '**', redirectTo: '' },
];

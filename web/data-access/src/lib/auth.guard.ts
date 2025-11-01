import { inject } from '@angular/core';
import { Router, CanActivateFn } from '@angular/router';
import { AuthService } from './auth.service';

/**
 * Auth Guard
 *
 * Προστασία routes που χρειάζονται authentication.
 * Αν ο user δεν είναι authenticated, redirect στο /auth.
 *
 * Usage:
 * {
 *   path: 'settings',
 *   canActivate: [authGuard],
 *   loadComponent: () => import('./settings').then(m => m.SettingsComponent)
 * }
 */
export const authGuard: CanActivateFn = (route, state) => {
  const authService = inject(AuthService);
  const router = inject(Router);

  if (authService.isAuthenticated()) {
    return true;
  }

  console.warn(`🔒 Access denied to ${state.url}. Redirecting to login...`);

  // Redirect to login with return URL
  return router.createUrlTree(['/auth'], {
    queryParams: { returnUrl: state.url },
  });
};

/**
 * Role Guard Factory
 *
 * Δημιουργεί guard που ελέγχει αν ο user έχει συγκεκριμένο role.
 *
 * Usage:
 * {
 *   path: 'admin',
 *   canActivate: [roleGuard('admin')],
 *   loadComponent: () => import('./admin').then(m => m.AdminComponent)
 * }
 */
export const roleGuard = (
  role: 'author' | 'editor' | 'admin' | 'member'
): CanActivateFn => {
  return (route, state) => {
    const authService = inject(AuthService);
    const router = inject(Router);

    if (!authService.isAuthenticated()) {
      console.warn(`🔒 Not authenticated. Redirecting to login...`);
      return router.createUrlTree(['/auth'], {
        queryParams: { returnUrl: state.url },
      });
    }

    if (authService.hasRole(role)) {
      return true;
    }

    console.warn(
      `🔒 Access denied to ${state.url}. Insufficient permissions (requires ${role}).`
    );

    // Redirect to home if user doesn't have required role
    return router.createUrlTree(['/']);
  };
};

/**
 * Guest Guard
 *
 * Προστασία routes που είναι μόνο για μη-authenticated users (π.χ. login page).
 * Αν ο user είναι ήδη authenticated, redirect στο home.
 *
 * Usage:
 * {
 *   path: 'auth',
 *   canActivate: [guestGuard],
 *   loadComponent: () => import('./auth').then(m => m.AuthComponent)
 * }
 */
export const guestGuard: CanActivateFn = (route, state) => {
  const authService = inject(AuthService);
  const router = inject(Router);

  if (!authService.isAuthenticated()) {
    return true;
  }

  console.log('Already authenticated. Redirecting to home...');
  return router.createUrlTree(['/']);
};

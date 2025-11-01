import { Injectable, signal, computed } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Router } from '@angular/router';
import { Observable, BehaviorSubject, tap, catchError, of } from 'rxjs';
import {
  LoginCredentials,
  RegisterData,
  AuthResponse,
  AuthUser,
  UpdateProfileData,
} from '@hobbistas/models';

/**
 * AuthService
 *
 * Διαχειρίζεται το authentication state της εφαρμογής:
 * - Login/Logout/Register
 * - JWT token management
 * - Current user state
 * - Token persistence στο localStorage
 */
@Injectable({
  providedIn: 'root',
})
export class AuthService {
  private readonly API_URL = 'http://localhost:3333/api/auth';
  private readonly TOKEN_KEY = 'hobbistas_access_token';
  private readonly USER_KEY = 'hobbistas_user';

  // BehaviorSubject για να κρατάμε το current user
  private currentUserSubject = new BehaviorSubject<AuthUser | null>(
    this.getUserFromStorage()
  );

  // Observable για subscription από components
  public currentUser$ = this.currentUserSubject.asObservable();

  // Signal για reactive state
  public currentUser = signal<AuthUser | null>(this.getUserFromStorage());

  // Computed signal για authentication status
  public isAuthenticated = computed(() => this.currentUser() !== null);

  constructor(
    private http: HttpClient,
    private router: Router
  ) {
    // Αν υπάρχει token στο storage, κάνε validate
    const token = this.getToken();
    if (token) {
      this.validateToken();
    }
  }

  /**
   * Register νέου χρήστη
   */
  register(data: RegisterData): Observable<AuthResponse> {
    return this.http.post<AuthResponse>(`${this.API_URL}/register`, data).pipe(
      tap((response) => {
        console.log('✅ Registration successful');
        this.handleAuthSuccess(response);
      }),
      catchError((error) => {
        console.error('❌ Registration failed:', error);
        throw error;
      })
    );
  }

  /**
   * Login με email και password
   */
  login(credentials: LoginCredentials): Observable<AuthResponse> {
    return this.http.post<AuthResponse>(`${this.API_URL}/login`, credentials).pipe(
      tap((response) => {
        console.log('✅ Login successful');
        this.handleAuthSuccess(response);
      }),
      catchError((error) => {
        console.error('❌ Login failed:', error);
        throw error;
      })
    );
  }

  /**
   * Logout - Καθαρισμός session
   */
  logout(): Observable<void> {
    return this.http.post<void>(`${this.API_URL}/logout`, {}).pipe(
      tap(() => {
        console.log('✅ Logout successful');
        this.handleLogout();
      }),
      catchError((error) => {
        console.error('❌ Logout failed:', error);
        // Ακόμα και αν fail το backend call, κάνε local logout
        this.handleLogout();
        return of(void 0);
      })
    );
  }

  /**
   * Update user profile
   */
  updateProfile(data: UpdateProfileData, avatarFile?: File): Observable<AuthUser> {
    // Αν έχουμε avatar file, χρησιμοποιούμε FormData
    if (avatarFile) {
      const formData = new FormData();
      if (data.displayName) formData.append('displayName', data.displayName);
      if (data.bio) formData.append('bio', data.bio);
      formData.append('avatar', avatarFile);

      return this.http.patch<AuthUser>(`${this.API_URL}/profile`, formData).pipe(
        tap((user) => {
          console.log('✅ Profile updated with avatar');
          this.updateUserState(user);
        }),
        catchError((error) => {
          console.error('❌ Profile update failed:', error);
          throw error;
        })
      );
    } else {
      // Χωρίς avatar, στέλνουμε JSON
      return this.http.patch<AuthUser>(`${this.API_URL}/profile`, data).pipe(
        tap((user) => {
          console.log('✅ Profile updated');
          this.updateUserState(user);
        }),
        catchError((error) => {
          console.error('❌ Profile update failed:', error);
          throw error;
        })
      );
    }
  }

  /**
   * Validate το current token και fetch user data
   */
  validateToken(): void {
    this.http.get<AuthUser>(`${this.API_URL}/me`).subscribe({
      next: (user) => {
        console.log('✅ Token validated, user data refreshed');
        this.currentUser.set(user);
        this.currentUserSubject.next(user);
        this.saveUserToStorage(user);
      },
      error: (error) => {
        console.error('❌ Token validation failed:', error);
        // Μόνο αν είναι 401 Unauthorized, κάνε logout
        // Αλλιώς κράτα το user από το localStorage
        if (error.status === 401) {
          this.handleLogout();
        } else {
          console.warn('⚠️ Could not validate token, keeping cached user');
          // Κράτα το cached user από localStorage
          const cachedUser = this.getUserFromStorage();
          if (cachedUser) {
            this.currentUser.set(cachedUser);
            this.currentUserSubject.next(cachedUser);
          }
        }
      },
    });
  }

  /**
   * Get current auth token
   */
  getToken(): string | null {
    return localStorage.getItem(this.TOKEN_KEY);
  }

  /**
   * Handle successful authentication
   */
  private handleAuthSuccess(response: AuthResponse): void {
    // Save token
    localStorage.setItem(this.TOKEN_KEY, response.accessToken);

    // Save user data
    const authUser: AuthUser = {
      id: response.user.id,
      email: response.user.email,
      username: response.user.displayName, // Θα χρησιμοποιούμε το displayName ως username
      displayName: response.user.displayName,
      avatarUrl: response.user.avatarUrl,
      roles: response.user.roles,
    };

    this.currentUser.set(authUser);
    this.currentUserSubject.next(authUser);
    this.saveUserToStorage(authUser);
  }

  /**
   * Handle logout
   */
  private handleLogout(): void {
    // Clear storage
    localStorage.removeItem(this.TOKEN_KEY);
    localStorage.removeItem(this.USER_KEY);

    // Clear state
    this.currentUser.set(null);
    this.currentUserSubject.next(null);

    // Redirect to home
    this.router.navigate(['/']);
  }

  /**
   * Update user state after profile update
   */
  private updateUserState(user: AuthUser): void {
    this.currentUser.set(user);
    this.currentUserSubject.next(user);
    this.saveUserToStorage(user);
  }

  /**
   * Save user to localStorage
   */
  private saveUserToStorage(user: AuthUser): void {
    localStorage.setItem(this.USER_KEY, JSON.stringify(user));
  }

  /**
   * Get user from localStorage
   */
  private getUserFromStorage(): AuthUser | null {
    const userJson = localStorage.getItem(this.USER_KEY);
    if (userJson) {
      try {
        return JSON.parse(userJson);
      } catch (e) {
        console.error('Failed to parse user from storage:', e);
        return null;
      }
    }
    return null;
  }

  /**
   * Check if user has specific role
   */
  hasRole(role: 'author' | 'editor' | 'admin' | 'member'): boolean {
    const user = this.currentUser();
    return user ? user.roles.includes(role) : false;
  }

  /**
   * Check if user is admin
   */
  isAdmin(): boolean {
    return this.hasRole('admin');
  }

  /**
   * Check if user is author
   */
  isAuthor(): boolean {
    return this.hasRole('author') || this.hasRole('admin');
  }
}

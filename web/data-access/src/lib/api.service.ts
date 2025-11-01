import { Injectable, inject } from '@angular/core';
import { HttpClient, HttpHeaders, HttpErrorResponse } from '@angular/common/http';
import { Observable, throwError, of } from 'rxjs';
import { catchError, map, tap } from 'rxjs/operators';
import { Article, User, CategoryInfo } from '@hobbistas/models';

/**
 * API Service - Centralized HTTP service για όλα τα backend calls
 *
 * Features:
 * - Automatic error handling με fallback values
 * - JWT token management
 * - Type-safe responses με shared models
 * - Fallback text όταν δεν έχει data: "εδω ειναι απο το backend [field]"
 */
@Injectable({ providedIn: 'root' })
export class ApiService {
  private readonly http = inject(HttpClient);
  private readonly apiUrl = 'http://localhost:3333/api'; // TODO: Move to environment

  /**
   * Get HTTP headers με JWT token αν υπάρχει
   */
  private getHeaders(): HttpHeaders {
    const token = this.getToken();
    let headers = new HttpHeaders({
      'Content-Type': 'application/json',
    });

    if (token) {
      headers = headers.set('Authorization', `Bearer ${token}`);
    }

    return headers;
  }

  /**
   * Get JWT token από localStorage
   */
  private getToken(): string | null {
    if (typeof localStorage !== 'undefined') {
      return localStorage.getItem('access_token');
    }
    return null;
  }

  /**
   * Save JWT token στο localStorage
   */
  private saveToken(token: string): void {
    if (typeof localStorage !== 'undefined') {
      localStorage.setItem('access_token', token);
    }
  }

  /**
   * Remove JWT token
   */
  private removeToken(): void {
    if (typeof localStorage !== 'undefined') {
      localStorage.removeItem('access_token');
    }
  }

  /**
   * Generic error handler με fallback values
   */
  private handleError<T>(
    operation = 'operation',
    fallbackValue?: T,
  ): (error: HttpErrorResponse) => Observable<T> {
    return (error: HttpErrorResponse): Observable<T> => {
      console.error(`${operation} failed:`, error);

      // Αν έχουμε fallback value, επέστρεψέ το
      if (fallbackValue !== undefined) {
        console.log(`Using fallback value for ${operation}`);
        return of(fallbackValue);
      }

      // Αλλιώς throw error
      return throwError(() => error);
    };
  }

  // ==========================================
  // AUTH ENDPOINTS
  // ==========================================

  /**
   * Register νέου χρήστη
   */
  register(data: {
    email: string;
    password: string;
    username: string;
    displayName: string;
    bio?: string;
  }): Observable<{ user: User; access_token: string }> {
    return this.http
      .post<{ user: User; access_token: string }>(
        `${this.apiUrl}/auth/register`,
        data,
      )
      .pipe(
        tap((response) => {
          // Save token
          if (response.access_token) {
            this.saveToken(response.access_token);
          }
        }),
        catchError((error) => {
          console.error('Registration failed:', error);
          return throwError(() => error);
        }),
      );
  }

  /**
   * Login
   */
  login(email: string, password: string): Observable<{ user: User; access_token: string }> {
    return this.http
      .post<{ user: User; access_token: string }>(`${this.apiUrl}/auth/login`, {
        email,
        password,
      })
      .pipe(
        tap((response) => {
          // Save token
          if (response.access_token) {
            this.saveToken(response.access_token);
          }
        }),
        catchError((error) => {
          console.error('Login failed:', error);
          return throwError(() => error);
        }),
      );
  }

  /**
   * Logout
   */
  logout(): Observable<any> {
    return this.http
      .post(`${this.apiUrl}/auth/logout`, {}, { headers: this.getHeaders() })
      .pipe(
        tap(() => {
          this.removeToken();
        }),
        catchError(this.handleError('logout', { message: 'Logged out' })),
      );
  }

  /**
   * Get current user
   */
  getCurrentUser(): Observable<User | null> {
    return this.http
      .get<User>(`${this.apiUrl}/auth/me`, { headers: this.getHeaders() })
      .pipe(
        catchError(
          this.handleError<User | null>('getCurrentUser', null),
        ),
      );
  }

  // ==========================================
  // ARTICLES ENDPOINTS
  // ==========================================

  /**
   * Get όλα τα articles με fallback
   */
  getArticles(filters?: { category?: string }): Observable<Article[]> {
    let url = `${this.apiUrl}/articles`;
    if (filters?.category) {
      url += `?category=${filters.category}`;
    }

    return this.http.get<Article[]>(url).pipe(
      map((articles) =>
        articles.map((article) => this.ensureArticleHasValues(article)),
      ),
      catchError(
        this.handleError<Article[]>('getArticles', this.getFallbackArticles()),
      ),
    );
  }

  /**
   * Get trending articles
   */
  getTrendingArticles(limit = 10): Observable<Article[]> {
    return this.http
      .get<Article[]>(`${this.apiUrl}/articles/trending?limit=${limit}`)
      .pipe(
        map((articles) =>
          articles.map((article) => this.ensureArticleHasValues(article)),
        ),
        catchError(
          this.handleError<Article[]>(
            'getTrendingArticles',
            this.getFallbackArticles(limit),
          ),
        ),
      );
  }

  /**
   * Get article by slug
   */
  getArticleBySlug(slug: string): Observable<Article> {
    return this.http.get<Article>(`${this.apiUrl}/articles/${slug}`).pipe(
      map((article) => this.ensureArticleHasValues(article)),
      catchError(
        this.handleError<Article>('getArticleBySlug', this.getFallbackArticle()),
      ),
    );
  }

  /**
   * Create article
   */
  createArticle(data: Partial<Article>): Observable<Article> {
    return this.http
      .post<Article>(`${this.apiUrl}/articles`, data, {
        headers: this.getHeaders(),
      })
      .pipe(
        map((article) => this.ensureArticleHasValues(article)),
        catchError((error) => {
          console.error('Create article failed:', error);
          return throwError(() => error);
        }),
      );
  }

  // ==========================================
  // USERS ENDPOINTS
  // ==========================================

  /**
   * Get user by ID
   */
  getUserById(id: string): Observable<User> {
    return this.http.get<User>(`${this.apiUrl}/users/${id}`).pipe(
      map((user) => this.ensureUserHasValues(user)),
      catchError(
        this.handleError<User>('getUserById', this.getFallbackUser()),
      ),
    );
  }

  /**
   * Get όλους τους users
   */
  getUsers(page = 1, limit = 20): Observable<{ data: User[]; meta: any }> {
    return this.http
      .get<{ data: User[]; meta: any }>(
        `${this.apiUrl}/users?page=${page}&limit=${limit}`,
      )
      .pipe(
        map((response) => ({
          ...response,
          data: response.data.map((user) => this.ensureUserHasValues(user)),
        })),
        catchError(
          this.handleError('getUsers', {
            data: this.getFallbackUsers(),
            meta: { page, limit, total: 0, totalPages: 0 },
          }),
        ),
      );
  }

  // ==========================================
  // CATEGORIES ENDPOINTS
  // ==========================================

  /**
   * Get όλες τις categories
   */
  getCategories(): Observable<CategoryInfo[]> {
    return this.http.get<any[]>(`${this.apiUrl}/categories`).pipe(
      map((categories) =>
        categories.map((cat) => ({
          id: cat.id,
          label: cat.label || 'εδω ειναι απο το backend label',
          icon: cat.icon || '📦',
          path: cat.path || `/${cat.id}`,
          description: cat.description || 'εδω ειναι απο το backend description',
          color: cat.color || 'from-gray-500 to-gray-600',
          articleCount: cat.article_count || 0,
        })),
      ),
      catchError(
        this.handleError<CategoryInfo[]>('getCategories', this.getFallbackCategories()),
      ),
    );
  }

  // ==========================================
  // INTERACTIONS ENDPOINTS
  // ==========================================

  /**
   * Like article
   */
  likeArticle(articleId: string): Observable<any> {
    return this.http
      .post(
        `${this.apiUrl}/interactions/articles/${articleId}/like`,
        {},
        { headers: this.getHeaders() },
      )
      .pipe(catchError(this.handleError('likeArticle', { message: 'Like added' })));
  }

  /**
   * Unlike article
   */
  unlikeArticle(articleId: string): Observable<any> {
    return this.http
      .delete(`${this.apiUrl}/interactions/articles/${articleId}/like`, {
        headers: this.getHeaders(),
      })
      .pipe(
        catchError(this.handleError('unlikeArticle', { message: 'Like removed' })),
      );
  }

  /**
   * Bookmark article
   */
  bookmarkArticle(articleId: string): Observable<any> {
    return this.http
      .post(
        `${this.apiUrl}/interactions/articles/${articleId}/bookmark`,
        {},
        { headers: this.getHeaders() },
      )
      .pipe(
        catchError(
          this.handleError('bookmarkArticle', { message: 'Bookmark added' }),
        ),
      );
  }

  /**
   * Get user bookmarks
   */
  getUserBookmarks(): Observable<Article[]> {
    return this.http
      .get<any[]>(`${this.apiUrl}/interactions/bookmarks`, {
        headers: this.getHeaders(),
      })
      .pipe(
        map((bookmarks) =>
          bookmarks.map((b) => this.ensureArticleHasValues(b.articles)),
        ),
        catchError(this.handleError<Article[]>('getUserBookmarks', [])),
      );
  }

  // ==========================================
  // FALLBACK HELPERS - Για όταν το backend δεν έχει data
  // ==========================================

  /**
   * Ensure article έχει όλα τα required fields με fallback values
   */
  private ensureArticleHasValues(article: any): Article {
    return {
      id: article?.id || 'temp-id',
      title: article?.title || 'εδω ειναι απο το backend τιτλος',
      slug: article?.slug || 'backend-slug',
      excerpt: article?.excerpt || 'εδω ειναι απο το backend excerpt',
      content: article?.content || 'εδω ειναι απο το backend content',
      coverImageUrl:
        article?.cover_image_url ||
        article?.coverImageUrl ||
        'https://picsum.photos/seed/fallback/800/400',
      tags: article?.tags || ['backend-tag'],
      category: article?.category_id || article?.category || 'blog',
      author: this.ensureUserHasValues(article?.author || article?.profiles),
      authorId: article?.author_id || article?.authorId || 'backend-author-id',
      publishedAt: article?.published_at || article?.publishedAt || new Date().toISOString(),
      updatedAt: article?.updated_at || article?.updatedAt || new Date().toISOString(),
      draft: article?.is_draft ?? article?.draft ?? false,
      stats: {
        views: article?.stats?.views || article?.views_count || 0,
        likes: article?.stats?.likes || article?.likes_count || 0,
        comments: article?.stats?.comments || article?.comments_count || 0,
        shares: article?.stats?.shares || article?.shares_count || 0,
        readTime: article?.stats?.readTime || article?.read_time_minutes || 5,
      },
    };
  }

  /**
   * Ensure user έχει όλα τα required fields
   */
  private ensureUserHasValues(user: any): User {
    return {
      id: user?.id || 'temp-user-id',
      displayName: user?.display_name || user?.displayName || 'εδω ειναι απο το backend ονομα',
      email: user?.email || 'backend@email.com',
      avatarUrl:
        user?.avatar_url ||
        user?.avatarUrl ||
        'https://api.dicebear.com/7.x/avataaars/svg?seed=backend',
      bio: user?.bio || 'εδω ειναι απο το backend bio',
      roles: user?.roles || ['member'],
      stats: {
        articlesCount: user?.stats?.articlesCount || user?.articles_count || 0,
        followersCount: user?.stats?.followersCount || user?.followers_count || 0,
        followingCount: user?.stats?.followingCount || user?.following_count || 0,
        likesReceived: user?.stats?.likesReceived || user?.likes_received || 0,
        commentsCount: user?.stats?.commentsCount || user?.comments_count || 0,
      },
      socialLinks: user?.socialLinks || user?.social_links || {},
      joinedAt: user?.joined_at || user?.joinedAt || new Date().toISOString(),
    };
  }

  /**
   * Fallback article
   */
  private getFallbackArticle(): Article {
    return {
      id: 'fallback-1',
      title: 'εδω ειναι απο το backend τιτλος',
      slug: 'backend-fallback',
      excerpt: 'εδω ειναι απο το backend excerpt - το backend δεν ανταποκρίνεται',
      coverImageUrl: 'https://picsum.photos/seed/fallback/800/400',
      tags: ['fallback'],
      category: 'blog',
      author: this.getFallbackUser(),
      authorId: 'fallback-author',
      publishedAt: new Date().toISOString(),
      draft: false,
      stats: {
        views: 0,
        likes: 0,
        comments: 0,
        shares: 0,
        readTime: 5,
      },
    };
  }

  /**
   * Fallback articles array
   */
  private getFallbackArticles(count = 3): Article[] {
    return Array.from({ length: count }, (_, i) => ({
      ...this.getFallbackArticle(),
      id: `fallback-${i + 1}`,
      title: `εδω ειναι απο το backend τιτλος ${i + 1}`,
    }));
  }

  /**
   * Fallback user
   */
  private getFallbackUser(): User {
    return {
      id: 'fallback-user',
      displayName: 'εδω ειναι απο το backend ονομα',
      email: 'backend@fallback.com',
      avatarUrl: 'https://api.dicebear.com/7.x/avataaars/svg?seed=fallback',
      bio: 'εδω ειναι απο το backend bio',
      roles: ['member'],
      stats: {
        articlesCount: 0,
        followersCount: 0,
        followingCount: 0,
        likesReceived: 0,
        commentsCount: 0,
      },
      joinedAt: new Date().toISOString(),
    };
  }

  /**
   * Fallback users array
   */
  private getFallbackUsers(): User[] {
    return [this.getFallbackUser()];
  }

  /**
   * Fallback categories
   */
  private getFallbackCategories(): CategoryInfo[] {
    return [
      {
        id: 'blog',
        label: 'εδω ειναι απο το backend label',
        icon: '📦',
        path: '/fallback',
        description: 'εδω ειναι απο το backend description',
        color: 'from-gray-500 to-gray-600',
        articleCount: 0,
      },
    ];
  }

  // ==========================================
  // LEGACY METHOD (για compatibility)
  // ==========================================

  ping() {
    return this.http.get(`${this.apiUrl}/health`);
  }
}

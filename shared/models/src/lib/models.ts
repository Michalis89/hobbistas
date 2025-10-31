// ========================================
// User Related Models
// ========================================

export interface User {
  id: string;
  displayName: string;
  email: string;
  avatarUrl?: string;
  bio?: string;
  roles: Array<'author' | 'editor' | 'admin' | 'member'>;
  stats: UserStats;
  socialLinks?: SocialLinks;
  joinedAt: string;
}

export interface UserStats {
  articlesCount: number;
  followersCount: number;
  followingCount: number;
  likesReceived: number;
  commentsCount: number;
}

export interface SocialLinks {
  twitter?: string;
  github?: string;
  website?: string;
  discord?: string;
}

// ========================================
// Article Related Models
// ========================================

export type Category =
  | 'blog'
  | 'gaming'
  | 'dnd'
  | 'books'
  | 'comics'
  | 'anime'
  | 'manga'
  | 'media'
  | 'movies'
  | 'tv'
  | 'fantasy'
  | 'pets'
  | 'coding'
  | 'vape';

export interface Article {
  id: string;
  title: string;
  slug: string;
  excerpt?: string;
  content?: string;
  coverImageUrl?: string;
  tags: string[];
  category: Category;
  author: User;
  authorId: string;
  publishedAt?: string;
  updatedAt?: string;
  draft: boolean;
  stats: ArticleStats;
}

export interface ArticleStats {
  views: number;
  likes: number;
  comments: number;
  shares: number;
  readTime: number; // in minutes
}

// ========================================
// Comment Models
// ========================================

export interface Comment {
  id: string;
  articleId: string;
  author: User;
  authorId: string;
  content: string;
  createdAt: string;
  updatedAt?: string;
  parentId?: string; // for nested comments
  likes: number;
  replies?: Comment[];
}

// ========================================
// Notification Models
// ========================================

export interface Notification {
  id: string;
  type:
    | 'comment'
    | 'like'
    | 'follow'
    | 'mention'
    | 'article_published'
    | 'system';
  title: string;
  message: string;
  read: boolean;
  createdAt: string;
  actionUrl?: string;
  actor?: Pick<User, 'id' | 'displayName' | 'avatarUrl'>;
}

// ========================================
// Category Models
// ========================================

export interface CategoryInfo {
  id: Category;
  label: string;
  icon: string;
  path: string;
  description: string;
  color: string;
  articleCount: number;
}

export interface CategoryGroup {
  title: string;
  categories: CategoryInfo[];
}

// ========================================
// Search & Filter Models
// ========================================

export interface SearchFilters {
  query?: string;
  category?: Category;
  tags?: string[];
  author?: string;
  dateRange?: {
    from: string;
    to: string;
  };
  sortBy?: 'latest' | 'popular' | 'trending' | 'oldest';
}

export interface PaginationMeta {
  page: number;
  pageSize: number;
  totalPages: number;
  totalItems: number;
}

export interface PaginatedResponse<T> {
  data: T[];
  meta: PaginationMeta;
}

// ========================================
// Settings Models
// ========================================

export interface UserSettings {
  theme: 'core' | 'gaming' | 'auto';
  language: 'el' | 'en';
  emailNotifications: {
    comments: boolean;
    likes: boolean;
    follows: boolean;
    newsletter: boolean;
  };
  privacy: {
    showEmail: boolean;
    showStats: boolean;
    allowMessages: boolean;
  };
}

// ========================================
// Community Models
// ========================================

export interface CommunityMember {
  user: User;
  role: 'member' | 'moderator' | 'admin';
  joinedAt: string;
  contributionScore: number;
}

export interface TrendingTag {
  name: string;
  count: number;
  growth: number; // percentage
}

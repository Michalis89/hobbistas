export interface User {
  id: string;
  displayName: string;
  avatarUrl?: string;
  roles: Array<'author' | 'editor' | 'admin' | 'member'>;
}

export interface Article {
  id: string;
  title: string;
  slug: string;
  excerpt?: string;
  coverImageUrl?: string;
  tags: string[];
  category:
    | 'blog'
    | 'gaming'
    | 'dnd'
    | 'books'
    | 'comics'
    | 'anime'
    | 'manga'
    | 'movies'
    | 'tv'
    | 'fantasy'
    | 'pets'
    | 'coding'
    | 'vape';
  authorId: string;
  publishedAt?: string;
  updatedAt?: string;
  draft: boolean;
}

-- ==============================================
-- HOBBISTAS DATABASE SCHEMA - FIXED VERSION
-- Supabase PostgreSQL Migration
-- ==============================================
-- FIX: Removed WHEN clauses from triggers that include DELETE operations
-- ==============================================

-- Enable necessary extensions
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";
CREATE EXTENSION IF NOT EXISTS "pg_trgm"; -- Για full-text search

-- ==============================================
-- USERS TABLE
-- ==============================================
-- Επεκτείνουμε το auth.users με custom profile data
CREATE TABLE public.profiles (
  id UUID PRIMARY KEY REFERENCES auth.users(id) ON DELETE CASCADE,
  display_name VARCHAR(255) NOT NULL,
  username VARCHAR(50) UNIQUE NOT NULL,
  email VARCHAR(255) NOT NULL,
  avatar_url TEXT,
  bio TEXT,
  roles TEXT[] DEFAULT ARRAY['member']::TEXT[], -- ['member', 'author', 'editor', 'admin']

  -- Stats (denormalized για performance)
  articles_count INTEGER DEFAULT 0,
  followers_count INTEGER DEFAULT 0,
  following_count INTEGER DEFAULT 0,
  likes_received INTEGER DEFAULT 0,
  comments_count INTEGER DEFAULT 0,

  -- Social Links
  social_twitter VARCHAR(255),
  social_github VARCHAR(255),
  social_website VARCHAR(255),
  social_discord VARCHAR(255),

  -- Metadata
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW(),
  last_seen_at TIMESTAMPTZ,

  -- Settings
  email_notifications JSONB DEFAULT '{"comments": true, "likes": true, "follows": true, "newsletter": false}'::JSONB,
  privacy_settings JSONB DEFAULT '{"showEmail": false, "showStats": true, "allowMessages": true}'::JSONB,

  CONSTRAINT username_length CHECK (char_length(username) >= 3),
  CONSTRAINT username_format CHECK (username ~* '^[a-z0-9_-]+$')
);

-- Indexes για profiles
CREATE INDEX idx_profiles_username ON public.profiles(username);
CREATE INDEX idx_profiles_display_name ON public.profiles USING gin(display_name gin_trgm_ops);
CREATE INDEX idx_profiles_created_at ON public.profiles(created_at DESC);

-- ==============================================
-- CATEGORIES TABLE
-- ==============================================
CREATE TABLE public.categories (
  id VARCHAR(50) PRIMARY KEY,
  label VARCHAR(100) NOT NULL,
  icon VARCHAR(10),
  description TEXT,
  color VARCHAR(100),
  display_order INTEGER DEFAULT 0,
  is_active BOOLEAN DEFAULT true,
  article_count INTEGER DEFAULT 0,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- Insert default categories
INSERT INTO public.categories (id, label, icon, description, color, display_order) VALUES
  ('gaming', 'Gaming', '🎮', 'Reviews, guides, retrospectives και walkthroughs', 'from-purple-500 to-pink-500', 1),
  ('dnd', 'D&D', '🎲', 'Sessions, logs, homebrew items και lore', 'from-red-500 to-orange-500', 2),
  ('fantasy', 'Φαντασία', '🐉', 'Κόσμοι, ιστορίες, χαρακτήρες και ιδέες', 'from-blue-500 to-cyan-500', 3),
  ('books', 'Βιβλία', '📚', 'Reviews, συγγραφείς, συλλογές και recommendations', 'from-green-500 to-emerald-500', 4),
  ('coding', 'Coding', '💻', 'Tutorials, snippets, projects και best practices', 'from-yellow-500 to-amber-500', 5),
  ('vape', 'Vape', '💨', 'Reviews υγρών, συσκευών και DIY recipes', 'from-indigo-500 to-purple-500', 6),
  ('pets', 'Κατοικίδια', '🐾', 'Φροντίδα, training tips και funny stories', 'from-pink-500 to-rose-500', 7),
  ('media', 'Media', '🎬', 'Movies, TV series, anime και manga', 'from-cyan-500 to-blue-500', 8);

-- ==============================================
-- ARTICLES TABLE
-- ==============================================
CREATE TABLE public.articles (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  title VARCHAR(500) NOT NULL,
  slug VARCHAR(500) UNIQUE NOT NULL,
  excerpt TEXT,
  content TEXT,
  cover_image_url TEXT,

  -- Relationships
  author_id UUID NOT NULL REFERENCES public.profiles(id) ON DELETE CASCADE,
  category_id VARCHAR(50) NOT NULL REFERENCES public.categories(id),

  -- Status
  is_draft BOOLEAN DEFAULT true,
  is_published BOOLEAN DEFAULT false,
  published_at TIMESTAMPTZ,

  -- Stats (denormalized)
  views_count INTEGER DEFAULT 0,
  likes_count INTEGER DEFAULT 0,
  comments_count INTEGER DEFAULT 0,
  shares_count INTEGER DEFAULT 0,
  read_time_minutes INTEGER DEFAULT 5,

  -- Metadata
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW(),

  -- Search
  search_vector TSVECTOR,

  CONSTRAINT title_length CHECK (char_length(title) >= 10),
  CONSTRAINT slug_format CHECK (slug ~* '^[a-z0-9-]+$')
);

-- Indexes για articles
CREATE INDEX idx_articles_author_id ON public.articles(author_id);
CREATE INDEX idx_articles_category_id ON public.articles(category_id);
CREATE INDEX idx_articles_slug ON public.articles(slug);
CREATE INDEX idx_articles_published_at ON public.articles(published_at DESC NULLS LAST);
CREATE INDEX idx_articles_is_published ON public.articles(is_published) WHERE is_published = true;
CREATE INDEX idx_articles_search_vector ON public.articles USING gin(search_vector);
CREATE INDEX idx_articles_trending ON public.articles(views_count DESC, likes_count DESC, comments_count DESC)
  WHERE is_published = true;

-- Full-text search trigger
CREATE OR REPLACE FUNCTION update_article_search_vector()
RETURNS TRIGGER AS $$
BEGIN
  NEW.search_vector :=
    setweight(to_tsvector('greek', COALESCE(NEW.title, '')), 'A') ||
    setweight(to_tsvector('greek', COALESCE(NEW.excerpt, '')), 'B') ||
    setweight(to_tsvector('greek', COALESCE(NEW.content, '')), 'C');
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

CREATE TRIGGER articles_search_vector_update
  BEFORE INSERT OR UPDATE ON public.articles
  FOR EACH ROW
  EXECUTE FUNCTION update_article_search_vector();

-- ==============================================
-- TAGS TABLE
-- ==============================================
CREATE TABLE public.tags (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  name VARCHAR(100) UNIQUE NOT NULL,
  slug VARCHAR(100) UNIQUE NOT NULL,
  usage_count INTEGER DEFAULT 0,
  created_at TIMESTAMPTZ DEFAULT NOW(),

  CONSTRAINT tag_name_format CHECK (slug ~* '^[a-z0-9-]+$')
);

CREATE INDEX idx_tags_name ON public.tags(name);
CREATE INDEX idx_tags_usage_count ON public.tags(usage_count DESC);

-- ==============================================
-- ARTICLE_TAGS (Junction Table)
-- ==============================================
CREATE TABLE public.article_tags (
  article_id UUID NOT NULL REFERENCES public.articles(id) ON DELETE CASCADE,
  tag_id UUID NOT NULL REFERENCES public.tags(id) ON DELETE CASCADE,
  created_at TIMESTAMPTZ DEFAULT NOW(),

  PRIMARY KEY (article_id, tag_id)
);

CREATE INDEX idx_article_tags_article ON public.article_tags(article_id);
CREATE INDEX idx_article_tags_tag ON public.article_tags(tag_id);

-- ==============================================
-- COMMENTS TABLE
-- ==============================================
CREATE TABLE public.comments (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  content TEXT NOT NULL,

  -- Relationships
  article_id UUID NOT NULL REFERENCES public.articles(id) ON DELETE CASCADE,
  author_id UUID NOT NULL REFERENCES public.profiles(id) ON DELETE CASCADE,
  parent_id UUID REFERENCES public.comments(id) ON DELETE CASCADE,

  -- Stats
  likes_count INTEGER DEFAULT 0,

  -- Metadata
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW(),
  is_edited BOOLEAN DEFAULT false,

  CONSTRAINT content_length CHECK (char_length(content) >= 1 AND char_length(content) <= 5000)
);

CREATE INDEX idx_comments_article_id ON public.comments(article_id);
CREATE INDEX idx_comments_author_id ON public.comments(author_id);
CREATE INDEX idx_comments_parent_id ON public.comments(parent_id);
CREATE INDEX idx_comments_created_at ON public.comments(created_at DESC);

-- ==============================================
-- LIKES TABLE
-- ==============================================
CREATE TABLE public.likes (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  user_id UUID NOT NULL REFERENCES public.profiles(id) ON DELETE CASCADE,
  article_id UUID REFERENCES public.articles(id) ON DELETE CASCADE,
  comment_id UUID REFERENCES public.comments(id) ON DELETE CASCADE,
  created_at TIMESTAMPTZ DEFAULT NOW(),

  CONSTRAINT like_target CHECK (
    (article_id IS NOT NULL AND comment_id IS NULL) OR
    (article_id IS NULL AND comment_id IS NOT NULL)
  ),

  UNIQUE(user_id, article_id),
  UNIQUE(user_id, comment_id)
);

CREATE INDEX idx_likes_user_id ON public.likes(user_id);
CREATE INDEX idx_likes_article_id ON public.likes(article_id);
CREATE INDEX idx_likes_comment_id ON public.likes(comment_id);

-- ==============================================
-- BOOKMARKS TABLE
-- ==============================================
CREATE TABLE public.bookmarks (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  user_id UUID NOT NULL REFERENCES public.profiles(id) ON DELETE CASCADE,
  article_id UUID NOT NULL REFERENCES public.articles(id) ON DELETE CASCADE,
  created_at TIMESTAMPTZ DEFAULT NOW(),

  UNIQUE(user_id, article_id)
);

CREATE INDEX idx_bookmarks_user_id ON public.bookmarks(user_id);
CREATE INDEX idx_bookmarks_article_id ON public.bookmarks(article_id);

-- ==============================================
-- FOLLOWS TABLE
-- ==============================================
CREATE TABLE public.follows (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  follower_id UUID NOT NULL REFERENCES public.profiles(id) ON DELETE CASCADE,
  following_id UUID NOT NULL REFERENCES public.profiles(id) ON DELETE CASCADE,
  created_at TIMESTAMPTZ DEFAULT NOW(),

  CONSTRAINT no_self_follow CHECK (follower_id != following_id),
  UNIQUE(follower_id, following_id)
);

CREATE INDEX idx_follows_follower_id ON public.follows(follower_id);
CREATE INDEX idx_follows_following_id ON public.follows(following_id);

-- ==============================================
-- NOTIFICATIONS TABLE
-- ==============================================
CREATE TABLE public.notifications (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  recipient_id UUID NOT NULL REFERENCES public.profiles(id) ON DELETE CASCADE,
  actor_id UUID REFERENCES public.profiles(id) ON DELETE SET NULL,

  type VARCHAR(50) NOT NULL,
  title VARCHAR(255) NOT NULL,
  message TEXT NOT NULL,
  action_url TEXT,

  is_read BOOLEAN DEFAULT false,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  read_at TIMESTAMPTZ
);

CREATE INDEX idx_notifications_recipient_id ON public.notifications(recipient_id);
CREATE INDEX idx_notifications_is_read ON public.notifications(is_read) WHERE is_read = false;
CREATE INDEX idx_notifications_created_at ON public.notifications(created_at DESC);

-- ==============================================
-- VIEWS FOR ANALYTICS
-- ==============================================

-- Trending Articles View (last 7 days)
CREATE OR REPLACE VIEW trending_articles AS
SELECT
  a.*,
  p.display_name as author_name,
  p.avatar_url as author_avatar,
  c.label as category_label,
  (a.views_count * 0.3 + a.likes_count * 2 + a.comments_count * 5) as trending_score
FROM public.articles a
JOIN public.profiles p ON a.author_id = p.id
JOIN public.categories c ON a.category_id = c.id
WHERE
  a.is_published = true
  AND a.published_at >= NOW() - INTERVAL '7 days'
ORDER BY trending_score DESC;

-- ==============================================
-- TRIGGERS FOR DENORMALIZED COUNTS
-- ==============================================
-- FIX: Removed WHEN clauses that referenced NEW in DELETE operations

-- Update article likes_count
CREATE OR REPLACE FUNCTION update_article_likes_count()
RETURNS TRIGGER AS $$
BEGIN
  IF TG_OP = 'INSERT' THEN
    IF NEW.article_id IS NOT NULL THEN
      UPDATE public.articles
      SET likes_count = likes_count + 1
      WHERE id = NEW.article_id;
    END IF;
  ELSIF TG_OP = 'DELETE' THEN
    IF OLD.article_id IS NOT NULL THEN
      UPDATE public.articles
      SET likes_count = GREATEST(0, likes_count - 1)
      WHERE id = OLD.article_id;
    END IF;
  END IF;
  RETURN NULL;
END;
$$ LANGUAGE plpgsql;

CREATE TRIGGER article_likes_count_trigger
AFTER INSERT OR DELETE ON public.likes
FOR EACH ROW
EXECUTE FUNCTION update_article_likes_count();

-- Update article comments_count
CREATE OR REPLACE FUNCTION update_article_comments_count()
RETURNS TRIGGER AS $$
BEGIN
  IF TG_OP = 'INSERT' THEN
    UPDATE public.articles
    SET comments_count = comments_count + 1
    WHERE id = NEW.article_id;
  ELSIF TG_OP = 'DELETE' THEN
    UPDATE public.articles
    SET comments_count = GREATEST(0, comments_count - 1)
    WHERE id = OLD.article_id;
  END IF;
  RETURN NULL;
END;
$$ LANGUAGE plpgsql;

CREATE TRIGGER article_comments_count_trigger
AFTER INSERT OR DELETE ON public.comments
FOR EACH ROW
EXECUTE FUNCTION update_article_comments_count();

-- Update comment likes_count
CREATE OR REPLACE FUNCTION update_comment_likes_count()
RETURNS TRIGGER AS $$
BEGIN
  IF TG_OP = 'INSERT' THEN
    IF NEW.comment_id IS NOT NULL THEN
      UPDATE public.comments
      SET likes_count = likes_count + 1
      WHERE id = NEW.comment_id;
    END IF;
  ELSIF TG_OP = 'DELETE' THEN
    IF OLD.comment_id IS NOT NULL THEN
      UPDATE public.comments
      SET likes_count = GREATEST(0, likes_count - 1)
      WHERE id = OLD.comment_id;
    END IF;
  END IF;
  RETURN NULL;
END;
$$ LANGUAGE plpgsql;

CREATE TRIGGER comment_likes_count_trigger
AFTER INSERT OR DELETE ON public.likes
FOR EACH ROW
EXECUTE FUNCTION update_comment_likes_count();

-- Update user followers_count and following_count
CREATE OR REPLACE FUNCTION update_follow_counts()
RETURNS TRIGGER AS $$
BEGIN
  IF TG_OP = 'INSERT' THEN
    UPDATE public.profiles SET followers_count = followers_count + 1 WHERE id = NEW.following_id;
    UPDATE public.profiles SET following_count = following_count + 1 WHERE id = NEW.follower_id;
  ELSIF TG_OP = 'DELETE' THEN
    UPDATE public.profiles SET followers_count = GREATEST(0, followers_count - 1) WHERE id = OLD.following_id;
    UPDATE public.profiles SET following_count = GREATEST(0, following_count - 1) WHERE id = OLD.follower_id;
  END IF;
  RETURN NULL;
END;
$$ LANGUAGE plpgsql;

CREATE TRIGGER follow_counts_trigger
AFTER INSERT OR DELETE ON public.follows
FOR EACH ROW
EXECUTE FUNCTION update_follow_counts();

-- Update user articles_count
CREATE OR REPLACE FUNCTION update_user_articles_count()
RETURNS TRIGGER AS $$
BEGIN
  IF TG_OP = 'INSERT' AND NEW.is_published = true THEN
    UPDATE public.profiles
    SET articles_count = articles_count + 1
    WHERE id = NEW.author_id;
  ELSIF TG_OP = 'DELETE' AND OLD.is_published = true THEN
    UPDATE public.profiles
    SET articles_count = GREATEST(0, articles_count - 1)
    WHERE id = OLD.author_id;
  ELSIF TG_OP = 'UPDATE' THEN
    IF OLD.is_published = false AND NEW.is_published = true THEN
      UPDATE public.profiles SET articles_count = articles_count + 1 WHERE id = NEW.author_id;
    ELSIF OLD.is_published = true AND NEW.is_published = false THEN
      UPDATE public.profiles SET articles_count = GREATEST(0, articles_count - 1) WHERE id = OLD.author_id;
    END IF;
  END IF;
  RETURN NULL;
END;
$$ LANGUAGE plpgsql;

CREATE TRIGGER user_articles_count_trigger
AFTER INSERT OR UPDATE OR DELETE ON public.articles
FOR EACH ROW
EXECUTE FUNCTION update_user_articles_count();

-- Update category article_count
CREATE OR REPLACE FUNCTION update_category_article_count()
RETURNS TRIGGER AS $$
BEGIN
  IF TG_OP = 'INSERT' AND NEW.is_published = true THEN
    UPDATE public.categories
    SET article_count = article_count + 1
    WHERE id = NEW.category_id;
  ELSIF TG_OP = 'DELETE' AND OLD.is_published = true THEN
    UPDATE public.categories
    SET article_count = GREATEST(0, article_count - 1)
    WHERE id = OLD.category_id;
  ELSIF TG_OP = 'UPDATE' THEN
    IF OLD.is_published = false AND NEW.is_published = true THEN
      UPDATE public.categories SET article_count = article_count + 1 WHERE id = NEW.category_id;
    ELSIF OLD.is_published = true AND NEW.is_published = false THEN
      UPDATE public.categories SET article_count = GREATEST(0, article_count - 1) WHERE id = OLD.category_id;
    END IF;
    IF OLD.category_id != NEW.category_id AND NEW.is_published = true THEN
      UPDATE public.categories SET article_count = GREATEST(0, article_count - 1) WHERE id = OLD.category_id;
      UPDATE public.categories SET article_count = article_count + 1 WHERE id = NEW.category_id;
    END IF;
  END IF;
  RETURN NULL;
END;
$$ LANGUAGE plpgsql;

CREATE TRIGGER category_article_count_trigger
AFTER INSERT OR UPDATE OR DELETE ON public.articles
FOR EACH ROW
EXECUTE FUNCTION update_category_article_count();

-- Update tag usage_count
CREATE OR REPLACE FUNCTION update_tag_usage_count()
RETURNS TRIGGER AS $$
BEGIN
  IF TG_OP = 'INSERT' THEN
    UPDATE public.tags SET usage_count = usage_count + 1 WHERE id = NEW.tag_id;
  ELSIF TG_OP = 'DELETE' THEN
    UPDATE public.tags SET usage_count = GREATEST(0, usage_count - 1) WHERE id = OLD.tag_id;
  END IF;
  RETURN NULL;
END;
$$ LANGUAGE plpgsql;

CREATE TRIGGER tag_usage_count_trigger
AFTER INSERT OR DELETE ON public.article_tags
FOR EACH ROW
EXECUTE FUNCTION update_tag_usage_count();

-- ==============================================
-- ROW LEVEL SECURITY (RLS)
-- ==============================================
-- Enable RLS on all tables
ALTER TABLE public.profiles ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.articles ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.comments ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.likes ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.bookmarks ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.follows ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.notifications ENABLE ROW LEVEL SECURITY;

-- Profiles: Όλοι μπορούν να διαβάσουν, μόνο ο owner μπορεί να update
CREATE POLICY "Profiles are viewable by everyone"
  ON public.profiles FOR SELECT
  USING (true);

CREATE POLICY "Users can update own profile"
  ON public.profiles FOR UPDATE
  USING (auth.uid() = id);

-- Articles: Published articles viewable by all, authors can CRUD their own
CREATE POLICY "Published articles are viewable by everyone"
  ON public.articles FOR SELECT
  USING (is_published = true OR auth.uid() = author_id);

CREATE POLICY "Authors can create articles"
  ON public.articles FOR INSERT
  WITH CHECK (auth.uid() = author_id);

CREATE POLICY "Authors can update own articles"
  ON public.articles FOR UPDATE
  USING (auth.uid() = author_id);

CREATE POLICY "Authors can delete own articles"
  ON public.articles FOR DELETE
  USING (auth.uid() = author_id);

-- Comments: Viewable by all, users can CRUD their own
CREATE POLICY "Comments are viewable by everyone"
  ON public.comments FOR SELECT
  USING (true);

CREATE POLICY "Authenticated users can create comments"
  ON public.comments FOR INSERT
  WITH CHECK (auth.uid() = author_id);

CREATE POLICY "Users can update own comments"
  ON public.comments FOR UPDATE
  USING (auth.uid() = author_id);

CREATE POLICY "Users can delete own comments"
  ON public.comments FOR DELETE
  USING (auth.uid() = author_id);

-- Likes: Users can manage their own
CREATE POLICY "Users can view all likes"
  ON public.likes FOR SELECT
  USING (true);

CREATE POLICY "Users can create own likes"
  ON public.likes FOR INSERT
  WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can delete own likes"
  ON public.likes FOR DELETE
  USING (auth.uid() = user_id);

-- Bookmarks: Users can manage their own
CREATE POLICY "Users can view own bookmarks"
  ON public.bookmarks FOR SELECT
  USING (auth.uid() = user_id);

CREATE POLICY "Users can create own bookmarks"
  ON public.bookmarks FOR INSERT
  WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can delete own bookmarks"
  ON public.bookmarks FOR DELETE
  USING (auth.uid() = user_id);

-- Follows: Users can manage their own
CREATE POLICY "Users can view all follows"
  ON public.follows FOR SELECT
  USING (true);

CREATE POLICY "Users can create own follows"
  ON public.follows FOR INSERT
  WITH CHECK (auth.uid() = follower_id);

CREATE POLICY "Users can delete own follows"
  ON public.follows FOR DELETE
  USING (auth.uid() = follower_id);

-- Notifications: Users can view their own
CREATE POLICY "Users can view own notifications"
  ON public.notifications FOR SELECT
  USING (auth.uid() = recipient_id);

CREATE POLICY "Users can update own notifications"
  ON public.notifications FOR UPDATE
  USING (auth.uid() = recipient_id);

-- ==============================================
-- FUNCTIONS FOR COMMON QUERIES
-- ==============================================

-- Get user's feed (articles from followed users)
CREATE OR REPLACE FUNCTION get_user_feed(
  p_user_id UUID,
  p_limit INTEGER DEFAULT 20,
  p_offset INTEGER DEFAULT 0
)
RETURNS TABLE (
  id UUID,
  title VARCHAR,
  slug VARCHAR,
  excerpt TEXT,
  cover_image_url TEXT,
  category_id VARCHAR,
  author_id UUID,
  author_name VARCHAR,
  author_avatar TEXT,
  published_at TIMESTAMPTZ,
  views_count INTEGER,
  likes_count INTEGER,
  comments_count INTEGER
) AS $$
BEGIN
  RETURN QUERY
  SELECT
    a.id,
    a.title,
    a.slug,
    a.excerpt,
    a.cover_image_url,
    a.category_id,
    a.author_id,
    p.display_name as author_name,
    p.avatar_url as author_avatar,
    a.published_at,
    a.views_count,
    a.likes_count,
    a.comments_count
  FROM public.articles a
  JOIN public.profiles p ON a.author_id = p.id
  WHERE a.is_published = true
    AND a.author_id IN (
      SELECT following_id FROM public.follows WHERE follower_id = p_user_id
    )
  ORDER BY a.published_at DESC
  LIMIT p_limit
  OFFSET p_offset;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- ==============================================
-- COMPLETE! 🎉
-- ==============================================
-- Η βάση δεδομένων είναι έτοιμη!
-- FIX: Διορθώθηκαν τα triggers που είχαν WHEN clauses με NEW σε DELETE operations

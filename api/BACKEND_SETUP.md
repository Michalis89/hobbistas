# 🚀 Hobbistas Backend Setup Guide

## Prerequisites

1. **Supabase Account**: Δημιούργησε project στο [supabase.com](https://supabase.com)
2. **Node.js**: v18 ή νεότερη έκδοση

## Installation Steps

### 1. Install Dependencies

```bash
npm install @supabase/supabase-js @nestjs/config @nestjs/jwt @nestjs/passport passport passport-jwt class-validator class-transformer bcrypt
npm install -D @types/passport-jwt @types/bcrypt
```

### 2. Setup Supabase Database

1. Άνοιξε το Supabase Dashboard
2. Πήγαινε στο **SQL Editor**
3. Τρέξε το SQL script από: `api/supabase/migrations/001_initial_schema.sql`
4. Περίμενε να ολοκληρωθεί (θα πάρει ~30 seconds)

### 3. Configure Environment Variables

1. Copy το `.env.example` σε `.env`:
   ```bash
   cp api/.env.example api/.env
   ```

2. Πάρε τα Supabase credentials από το Dashboard:
   - **Settings** → **API**
   - Copy το `Project URL` και βάλτο στο `SUPABASE_URL`
   - Copy το `anon/public key` και βάλτο στο `SUPABASE_ANON_KEY`
   - Copy το `service_role key` και βάλτο στο `SUPABASE_SERVICE_ROLE_KEY` (⚠️ Keep this secret!)

3. Δημιούργησε ένα strong JWT secret:
   ```bash
   # Generate random secret (Linux/Mac)
   openssl rand -base64 32

   # ή use online generator: https://generate-secret.vercel.app/32
   ```
   Βάλτο στο `JWT_SECRET`

### 4. Enable Supabase Auth

1. Στο Supabase Dashboard → **Authentication** → **Providers**
2. Enable **Email** provider
3. (Optional) Enable **Google**, **GitHub** για social login

### 5. Start the Backend

```bash
npm run start:api
```

Backend θα τρέξει στο: `http://localhost:3333/api`

### 6. Test the API

```bash
# Health check
curl http://localhost:3333/api/health

# Get categories
curl http://localhost:3333/api/categories
```

## API Documentation

### Base URL
```
http://localhost:3333/api
```

### Available Endpoints

#### Auth
- `POST /api/auth/register` - Εγγραφή νέου χρήστη
- `POST /api/auth/login` - Login
- `POST /api/auth/logout` - Logout
- `GET /api/auth/me` - Get current user (requires token)

#### Users
- `GET /api/users` - List users
- `GET /api/users/:id` - Get user profile
- `PATCH /api/users/:id` - Update user profile
- `GET /api/users/:id/articles` - Get user's articles
- `GET /api/users/:id/followers` - Get followers
- `GET /api/users/:id/following` - Get following

#### Articles
- `GET /api/articles` - List articles (with filters)
- `GET /api/articles/trending` - Trending articles
- `GET /api/articles/:slug` - Get article by slug
- `POST /api/articles` - Create article (auth required)
- `PATCH /api/articles/:id` - Update article
- `DELETE /api/articles/:id` - Delete article
- `POST /api/articles/:id/publish` - Publish article
- `POST /api/articles/:id/view` - Increment views

#### Comments
- `GET /api/articles/:articleId/comments` - Get comments
- `POST /api/articles/:articleId/comments` - Create comment
- `PATCH /api/comments/:id` - Update comment
- `DELETE /api/comments/:id` - Delete comment

#### Interactions
- `POST /api/articles/:id/like` - Like article
- `DELETE /api/articles/:id/like` - Unlike article
- `POST /api/articles/:id/bookmark` - Bookmark article
- `DELETE /api/articles/:id/bookmark` - Remove bookmark
- `POST /api/users/:id/follow` - Follow user
- `DELETE /api/users/:id/follow` - Unfollow user

#### Categories
- `GET /api/categories` - List all categories

#### Tags
- `GET /api/tags` - List all tags
- `GET /api/tags/trending` - Trending tags

#### Notifications
- `GET /api/notifications` - Get user notifications
- `PATCH /api/notifications/:id/read` - Mark as read
- `POST /api/notifications/read-all` - Mark all as read

## Troubleshooting

### Database Connection Issues
- Βεβαιώσου ότι το `SUPABASE_URL` και `SUPABASE_SERVICE_ROLE_KEY` είναι σωστά
- Check στο Supabase Dashboard αν το project είναι active

### Authentication Issues
- Βεβαιώσου ότι το `JWT_SECRET` είναι set στο `.env`
- Check αν το Supabase Auth είναι enabled

### Migration Errors
- Ξανατρέξε το SQL migration
- Check το Supabase SQL logs για errors

## Next Steps

1. Test όλα τα endpoints με Postman ή Insomnia
2. Connect το frontend με το backend
3. Add custom business logic στα services
4. Deploy στο production (Render, Railway, ή Vercel)

## Architecture

```
api/
├── src/
│   ├── app/
│   │   ├── app.module.ts          # Root module
│   │   └── app.controller.ts
│   ├── supabase/                   # Supabase client module
│   │   ├── supabase.module.ts
│   │   └── supabase.service.ts
│   ├── auth/                       # Authentication
│   │   ├── auth.module.ts
│   │   ├── auth.controller.ts
│   │   ├── auth.service.ts
│   │   ├── dto/
│   │   ├── guards/
│   │   └── strategies/
│   ├── users/                      # Users management
│   ├── articles/                   # Articles CRUD
│   ├── comments/                   # Comments system
│   ├── notifications/              # Notifications
│   ├── categories/                 # Categories
│   ├── tags/                       # Tags
│   ├── interactions/               # Likes, bookmarks, follows
│   └── common/                     # Shared utilities
│       ├── decorators/
│       ├── filters/
│       ├── guards/
│       └── pipes/
└── supabase/
    └── migrations/
        └── 001_initial_schema.sql  # Database schema
```

Happy coding! 🎉

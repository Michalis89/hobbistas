# 🔗 Frontend <-> Backend Integration Guide

## ✅ Τι Έγινε (What's Done)

### 1. API Service - Πλήρως Ολοκληρωμένο! 🎉

**File:** `web/data-access/src/lib/api.service.ts`

✅ **Features:**

- **Automatic Error Handling** - Δεν σκάνε τα components με errors!
- **Fallback Values** - Όταν το backend δεν ανταποκρίνεται, βλέπεις: `"εδω ειναι απο το backend τιτλος"`
- **JWT Token Management** - Automatic save/load/remove στο localStorage
- **Type-Safe με Shared Models** - Χρησιμοποιεί `@hobbistas/models`
- **Smart Field Mapping** - Μετατρέπει backend format (snake_case) σε frontend (camelCase)

### 2. Available API Methods

#### Auth

```typescript
apiService.register({ email, password, username, displayName, bio? })
apiService.login(email, password)
apiService.logout()
apiService.getCurrentUser()
```

#### Articles

```typescript
apiService.getArticles(filters?) // Όλα τα articles
apiService.getTrendingArticles(limit?) // Trending
apiService.getArticleBySlug(slug) // Specific article
apiService.createArticle(data) // Create new
```

#### Users

```typescript
apiService.getUserById(id)
apiService.getUsers(page?, limit?)
```

#### Categories

```typescript
apiService.getCategories(); // Όλες οι κατηγορίες
```

#### Interactions

```typescript
apiService.likeArticle(articleId);
apiService.unlikeArticle(articleId);
apiService.bookmarkArticle(articleId);
apiService.getUserBookmarks();
```

---

## 🔧 Πώς να το Χρησιμοποιήσεις

### Example 1: Φόρτωμα Articles στο Home Component

```typescript
import { Component, OnInit, signal } from '@angular/core';
import { ApiService } from '@hobbistas/data-access';
import { Article } from '@hobbistas/models';

@Component({
  selector: 'app-home',
  // ...
})
export class HomeComponent implements OnInit {
  articles = signal<Article[]>([]);
  loading = signal(true);

  constructor(private readonly apiService: ApiService) {}

  ngOnInit() {
    // Φόρτωσε articles από backend
    this.apiService.getArticles().subscribe({
      next: (data) => {
        this.articles.set(data);
        this.loading.set(false);
      },
      error: (err) => {
        // Δεν χρειάζεται error handling!
        // Το API Service επιστρέφει fallback values automatically
        console.error('Error loading articles:', err);
        this.loading.set(false);
      },
    });
  }
}
```

### Example 2: Trending Articles

```typescript
ngOnInit() {
  this.apiService.getTrendingArticles(5).subscribe({
    next: (trending) => {
      this.trendingArticles.set(trending);
      // Αν το backend δεν δουλεύει, θα δεις:
      // "εδω ειναι απο το backend τιτλος 1"
      // "εδω ειναι απο το backend τιτλος 2"
      // κλπ
    }
  });
}
```

### Example 3: User Login

```typescript
onLogin() {
  this.apiService.login(this.email, this.password).subscribe({
    next: (response) => {
      // Token saved automatically στο localStorage!
      console.log('Logged in:', response.user);
      this.router.navigate(['/']);
    },
    error: (err) => {
      this.errorMessage = 'Invalid credentials';
    }
  });
}
```

### Example 4: Like Article

```typescript
onLikeArticle(articleId: string) {
  this.apiService.likeArticle(articleId).subscribe({
    next: () => {
      console.log('Article liked!');
      this.isLiked.set(true);
    },
    error: (err) => {
      // Fallback value: { message: 'Like added' }
      // Δεν θα σκάσει error στον user
    }
  });
}
```

---

## 🚀 Quick Start - Πώς να Τρέξεις Τα Πάντα

### Step 1: Start Backend (Terminal 1)

```bash
# 1. Ensure you've setup the backend (see BACKEND_README.md)
# 2. Start the API
npm run start:api
```

Backend θα τρέξει στο: **http://localhost:3333/api**

### Step 2: Start Frontend (Terminal 2)

```bash
# Start the web app
npm run start:web
```

Frontend θα τρέξει στο: **http://localhost:4200**

### Step 3: Test Integration

1. Άνοιξε το browser: **http://localhost:4200**
2. Άνοιξε το Console (F12)
3. Θα δεις logs από το API Service:
   - Αν το backend τρέχει: Κανονικά data
   - Αν το backend ΔΕΝ τρέχει: Fallback values με "εδω ειναι απο το backend..."

---

## 🎯 Automatic Fallback System

### Scenario 1: Backend τρέχει ΚΑΙ έχει data ✅

```
API Call → Backend Response → Real Data
```

**Βλέπεις:**

- "Baldur's Gate 3: Ο Απόλυτος Οδηγός"
- Πραγματικά avatars
- Κανονικά στατιστικά

### Scenario 2: Backend τρέχει ΑΛΛΑ δεν έχει data 📦

```
API Call → Empty Backend Response → Fallback Values
```

**Βλέπεις:**

- "εδω ειναι απο το backend τιτλος"
- Fallback avatars
- Zeroed stats

### Scenario 3: Backend ΔΕΝ τρέχει ❌

```
API Call → Network Error → Fallback Values
```

**Βλέπεις:**

- "εδω ειναι απο το backend τιτλος - το backend δεν ανταποκρίνεται"
- Fallback avatars
- Error logs στο console

**Το app ΔΕΝ σκάει!** Δουλεύει με mock data. 🎉

---

## 🔐 Authentication Flow

### 1. Register New User

```typescript
this.apiService
  .register({
    email: 'test@hobbistas.gr',
    password: 'StrongPass123!',
    username: 'testuser',
    displayName: 'Test User',
    bio: 'I love coding!',
  })
  .subscribe({
    next: (response) => {
      // ✅ Token saved to localStorage automatically
      // ✅ User object available
      console.log('User registered:', response.user);
      this.router.navigate(['/']);
    },
  });
```

### 2. Login

```typescript
this.apiService.login(email, password).subscribe({
  next: (response) => {
    // ✅ Token saved automatically
    console.log('Logged in:', response.user);
  },
});
```

### 3. Protected Requests

```typescript
// Το API Service αυτόματα βάζει το Authorization header!
this.apiService.getUserBookmarks().subscribe({
  next: (bookmarks) => {
    // Works αν είσαι logged in
    console.log('My bookmarks:', bookmarks);
  },
  error: () => {
    // Αν δεν είσαι logged in, επιστρέφει empty array (fallback)
  },
});
```

### 4. Logout

```typescript
this.apiService.logout().subscribe({
  next: () => {
    // ✅ Token removed from localStorage
    this.router.navigate(['/login']);
  },
});
```

---

## 📊 Data Flow Diagram

```
┌─────────────┐         ┌──────────────┐         ┌──────────────┐
│   Angular   │ ──────> │  API Service │ ──────> │   Backend    │
│  Component  │  inject │  (Nx Lib)    │  HTTP   │   NestJS     │
└─────────────┘         └──────────────┘         └──────────────┘
       ↑                        │                         │
       │                        │                         ↓
       │                        │                  ┌──────────────┐
       │                        │                  │   Supabase   │
       │                        │                  │  PostgreSQL  │
       │                        ↓                  └──────────────┘
       │                 ┌──────────────┐
       └───────────────  │    Shared    │
           uses          │    Models    │
                         │  @hobbistas  │
                         └──────────────┘
```

---

## 🛠️ Troubleshooting

### Problem: "Connection refused" errors

**Solution:**

```bash
# Βεβαιώσου ότι το backend τρέχει
npm run start:api

# Check: http://localhost:3333/api/categories
# Πρέπει να δεις JSON με τις categories
```

### Problem: "401 Unauthorized" για protected routes

**Solution:**

```typescript
// 1. Login first
this.apiService.login(email, password).subscribe();

// 2. Then call protected endpoints
this.apiService.getUserBookmarks().subscribe();
```

### Problem: Βλέπω μόνο fallback values

**Reasons:**

1. **Backend δεν τρέχει** - Τρέξε `npm run start:api`
2. **Backend δεν έχει data** - Seed the database (see BACKEND_README.md)
3. **CORS error** - Check backend logs, add CORS config

### Problem: TypeScript errors με models

**Solution:**

```bash
# Rebuild the shared models library
nx build @hobbistas/models

# Restart the dev server
npm run start:web
```

---

## 🎨 Styling Fallback Values

Στο CSS μπορείς να style-άρεις τα fallback values:

```css
/* Highlight fallback text */
[class*='backend'] {
  color: orange;
  font-style: italic;
}

/* Or check if text contains "εδω ειναι" */
.article-title:has-text('εδω ειναι') {
  background: yellow;
}
```

---

## ✨ Next Steps

### 1. Connect Components to API

Update these components να χρησιμοποιούν το ApiService:

- ✅ **ApiService** - DONE!
- ⏳ **HomeComponent** - Connect `getArticles()`, `getTrendingArticles()`, `getCategories()`
- ⏳ **ArticleDetailComponent** - Connect `getArticleBySlug()`
- ⏳ **CategoryPageComponent** - Connect `getArticles({ category })`
- ⏳ **TrendingComponent** - Connect `getTrendingArticles()`
- ⏳ **CommunityComponent** - Connect `getUsers()`
- ⏳ **ProfileComponent** - Connect `getUserById()`

### 2. Add Loading States

```typescript
loading = signal(true);

ngOnInit() {
  this.apiService.getArticles().subscribe({
    next: (data) => {
      this.articles.set(data);
      this.loading.set(false);
    }
  });
}
```

Template:

```html
@if (loading()) {
<div class="loading loading-spinner"></div>
} @else { @for (article of articles(); track article.id) {
<app-article-card [article]="article" />
} }
```

### 3. Add Auth UI

- Login page με `apiService.login()`
- Register page με `apiService.register()`
- Logout button με `apiService.logout()`
- Protected routes guard

### 4. Add Interactions

- Like buttons: `apiService.likeArticle()` / `unlikeArticle()`
- Bookmark buttons: `apiService.bookmarkArticle()`
- Follow buttons: `followUser()`

---

## 🎉 Summary

✅ **API Service** - Fully integrated με backend
✅ **Automatic Fallbacks** - Δεν σκάνε errors
✅ **JWT Auth** - Token management automatic
✅ **Shared Models** - Type-safe με `@hobbistas/models`
✅ **Error Handling** - Graceful fallbacks
✅ **Smart Mapping** - Backend (snake_case) → Frontend (camelCase)

**Το frontend είναι έτοιμο να συνδεθεί με το backend!** 🚀

Απλά τρέξε:

1. Backend: `npm run start:api` (Terminal 1)
2. Frontend: `npm run start:web` (Terminal 2)
3. Open: http://localhost:4200

Enjoy! 💻🎮📚

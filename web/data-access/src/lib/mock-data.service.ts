import { Injectable } from '@angular/core';
import {
  Article,
  User,
  Comment,
  Notification,
  CategoryInfo,
  TrendingTag,
  Category,
} from '@hobbistas/models';

@Injectable({ providedIn: 'root' })
export class MockDataService {
  // Mock Users
  readonly users: User[] = [
    {
      id: 'u1',
      displayName: 'Μιχάλης Καρκάνης',
      email: 'michalis@hobbistas.gr',
      avatarUrl:
        'https://api.dicebear.com/7.x/avataaars/svg?seed=michalis-karkanis',
      bio: 'Lover of RPGs, D&D DM, και coding enthusiast. Γράφω για gaming, fantasy και τεχνολογία.',
      roles: ['admin', 'author'],
      stats: {
        articlesCount: 47,
        followersCount: 892,
        followingCount: 234,
        likesReceived: 3421,
        commentsCount: 567,
      },
      socialLinks: {
        twitter: 'https://twitter.com/michaliskarkanis',
        github: 'https://github.com/michaliskarkanis',
        website: 'https://hobbistas.gr',
      },
      joinedAt: '2024-01-15T10:00:00Z',
    },
    {
      id: 'u2',
      displayName: 'Άννα Παπαδοπούλου',
      email: 'anna@hobbistas.gr',
      avatarUrl: 'https://api.dicebear.com/7.x/avataaars/svg?seed=anna-p',
      bio: 'D&D fanatic, homebrew creator. Μοιράζομαι session recaps και campaign ideas.',
      roles: ['author', 'editor'],
      stats: {
        articlesCount: 32,
        followersCount: 645,
        followingCount: 178,
        likesReceived: 2134,
        commentsCount: 423,
      },
      socialLinks: {
        discord: 'AnnaP#1234',
      },
      joinedAt: '2024-02-20T14:30:00Z',
    },
    {
      id: 'u3',
      displayName: 'Γιώργος Δημητρίου',
      email: 'george@hobbistas.gr',
      avatarUrl: 'https://api.dicebear.com/7.x/avataaars/svg?seed=george-d',
      bio: 'Book reviewer, sci-fi & fantasy βιβλιοφάγος. 300+ books και μετράω...',
      roles: ['author'],
      stats: {
        articlesCount: 64,
        followersCount: 1234,
        followingCount: 89,
        likesReceived: 5678,
        commentsCount: 892,
      },
      socialLinks: {
        website: 'https://bookworm.gr',
      },
      joinedAt: '2023-11-10T09:15:00Z',
    },
    {
      id: 'u4',
      displayName: 'Δημήτρης Αντωνίου',
      email: 'dimitris@hobbistas.gr',
      avatarUrl: 'https://api.dicebear.com/7.x/avataaars/svg?seed=dimitris-a',
      bio: 'Full-stack developer, Angular & NestJS specialist. Coding tutorials & best practices.',
      roles: ['author'],
      stats: {
        articlesCount: 53,
        followersCount: 987,
        followingCount: 145,
        likesReceived: 4231,
        commentsCount: 734,
      },
      socialLinks: {
        github: 'https://github.com/dimitrisa',
        twitter: 'https://twitter.com/dimitrisa',
      },
      joinedAt: '2024-03-05T11:20:00Z',
    },
    {
      id: 'u5',
      displayName: 'Μαρία Κωνσταντίνου',
      email: 'maria@hobbistas.gr',
      avatarUrl: 'https://api.dicebear.com/7.x/avataaars/svg?seed=maria-k',
      bio: 'Dog trainer & pet care expert. Tips για υγιή και χαρούμενα κατοικίδια!',
      roles: ['author'],
      stats: {
        articlesCount: 41,
        followersCount: 723,
        followingCount: 267,
        likesReceived: 2987,
        commentsCount: 612,
      },
      joinedAt: '2024-04-12T08:45:00Z',
    },
    {
      id: 'u6',
      displayName: 'Νίκος Σταύρου',
      email: 'nikos@hobbistas.gr',
      avatarUrl: 'https://api.dicebear.com/7.x/avataaars/svg?seed=nikos-s',
      bio: 'Vape enthusiast, DIY mixer. Reviews & recipes για το τέλειο all-day-vape.',
      roles: ['author'],
      stats: {
        articlesCount: 28,
        followersCount: 456,
        followingCount: 123,
        likesReceived: 1876,
        commentsCount: 334,
      },
      joinedAt: '2024-05-18T13:30:00Z',
    },
    {
      id: 'u7',
      displayName: 'Ελένη Τσακίρη',
      email: 'eleni@hobbistas.gr',
      avatarUrl: 'https://api.dicebear.com/7.x/avataaars/svg?seed=eleni-t',
      bio: 'Fantasy world builder, Brandon Sanderson superfan. Lore, magic systems & character analysis.',
      roles: ['author'],
      stats: {
        articlesCount: 39,
        followersCount: 834,
        followingCount: 201,
        likesReceived: 3456,
        commentsCount: 523,
      },
      joinedAt: '2024-01-28T16:00:00Z',
    },
  ];

  // Mock Articles
  readonly articles: Article[] = [
    {
      id: 'a1',
      title: "Baldur's Gate 3: Ο Απόλυτος Οδηγός για Αρχάριους",
      slug: 'bg3-guide-beginners',
      excerpt:
        'Όλα όσα χρειάζεται να ξέρεις πριν ξεκινήσεις την περιπέτειά σου στο Forgotten Realms. Builds, party composition, και tips για το καλύτερο experience.',
      content: `# Εισαγωγή στο Baldur's Gate 3\n\nΤο Baldur's Gate 3 είναι ένα από τα πιο ambitious RPGs που έχουν κυκλοφορήσει. Βασισμένο στους κανόνες του D&D 5e, προσφέρει ατελείωτες δυνατότητες για roleplay και combat.\n\n## Character Creation\n\nΗ δημιουργία χαρακτήρα είναι κρίσιμη. Εδώ είναι μερικά tips:\n\n- Επίλεξε class που ταιριάζει στο playstyle σου\n- Μην φοβάσαι να πειραματιστείς με multiclassing\n- Τα ability scores έχουν μεγάλη σημασία\n\n## Party Composition\n\nΤο party composition είναι καθοριστικό για την επιτυχία σου...`,
      coverImageUrl: 'https://picsum.photos/seed/bg3-guide/1200/600',
      tags: ['bg3', 'rpg', 'guide', 'gaming'],
      category: 'gaming',
      author: this.users[0],
      authorId: 'u1',
      publishedAt: '2025-10-28T10:00:00Z',
      updatedAt: '2025-10-29T15:30:00Z',
      draft: false,
      stats: {
        views: 2847,
        likes: 234,
        comments: 45,
        shares: 67,
        readTime: 12,
      },
    },
    {
      id: 'a2',
      title: 'D&D Session Recap: Η Μάχη του Shadowfell',
      slug: 'dnd-shadowfell-battle',
      excerpt:
        'Το party μας αντιμετώπισε την πιο επική μάχη μέχρι τώρα. Δες πώς καταφέραμε να επιβιώσουμε και τι ανακαλύψαμε για την ιστορία του κόσμου μας.',
      content: `# Session 12: Into the Shadowfell\n\n## Η Αποστολή\n\nΤο party μας έφτασε στα σύνορα του Shadowfell...`,
      coverImageUrl: 'https://picsum.photos/seed/dnd-shadowfell/1200/600',
      tags: ['dnd', 'session-recap', 'shadowfell', 'campaign'],
      category: 'dnd',
      author: this.users[1],
      authorId: 'u2',
      publishedAt: '2025-10-26T14:00:00Z',
      draft: false,
      stats: {
        views: 1523,
        likes: 187,
        comments: 34,
        shares: 23,
        readTime: 8,
      },
    },
    {
      id: 'a3',
      title: 'Top 10 Sci-Fi Βιβλία που Πρέπει να Διαβάσεις',
      slug: 'top-10-scifi-books',
      excerpt:
        'Από κλασικά έργα μέχρι σύγχρονα masterpieces. Η προσωπική μου λίστα με τα καλύτερα science fiction βιβλία που άλλαξαν τον τρόπο που βλέπω τον κόσμο.',
      content: `# Τα 10 Καλύτερα Sci-Fi Βιβλία\n\n## 1. Dune - Frank Herbert\n\nΤο απόλυτο space opera...`,
      coverImageUrl: 'https://picsum.photos/seed/scifi-books/1200/600',
      tags: ['books', 'sci-fi', 'recommendations', 'top-10'],
      category: 'books',
      author: this.users[2],
      authorId: 'u3',
      publishedAt: '2025-10-25T09:00:00Z',
      draft: false,
      stats: {
        views: 3201,
        likes: 412,
        comments: 78,
        shares: 134,
        readTime: 15,
      },
    },
    {
      id: 'a4',
      title: 'React 19: Τι Νέο Φέρνει για τους Developers',
      slug: 'react-19-new-features',
      excerpt:
        'Ανάλυση των νέων features και πώς θα επηρεάσουν τον τρόπο που γράφουμε React code.',
      content: `# React 19 New Features\n\n## React Compiler\n\nΤο πιο exciting feature...`,
      coverImageUrl: 'https://picsum.photos/seed/react19/1200/600',
      tags: ['react', 'javascript', 'web-dev', 'frontend'],
      category: 'coding',
      author: this.users[3],
      authorId: 'u4',
      publishedAt: '2025-10-30T11:00:00Z',
      draft: false,
      stats: {
        views: 892,
        likes: 73,
        comments: 21,
        shares: 34,
        readTime: 10,
      },
    },
    {
      id: 'a5',
      title: 'DIY Vape Liquid: Cherry Vanilla Recipe',
      slug: 'diy-cherry-vanilla-recipe',
      excerpt:
        'Το δικό μου all-day-vape recipe με λεπτομερείς οδηγίες και steeping tips.',
      content: `# Cherry Vanilla ADV Recipe\n\n## Υλικά\n\n- TPA Cherry Extract 4%\n- Vanilla Custard V1 3%...`,
      coverImageUrl: 'https://picsum.photos/seed/vape-diy/1200/600',
      tags: ['vape', 'diy', 'recipe', 'vanilla'],
      category: 'vape',
      author: this.users[5],
      authorId: 'u6',
      publishedAt: '2025-10-29T16:00:00Z',
      draft: false,
      stats: {
        views: 634,
        likes: 56,
        comments: 18,
        shares: 12,
        readTime: 6,
      },
    },
    {
      id: 'a6',
      title: 'Training Tips: Πώς να Εκπαιδεύσεις τον Σκύλο σου στο Recall',
      slug: 'dog-training-recall-guide',
      excerpt:
        'Βήμα-βήμα οδηγός για να έρχεται ο σκύλος σου αξιόπιστα όταν τον καλείς.',
      content: `# Recall Training Guide\n\n## Γιατί το Recall είναι Σημαντικό\n\nΤο recall είναι η πιο σημαντική εντολή...`,
      coverImageUrl: 'https://picsum.photos/seed/dog-training/1200/600',
      tags: ['dogs', 'training', 'tips', 'behavior'],
      category: 'pets',
      author: this.users[4],
      authorId: 'u5',
      publishedAt: '2025-10-29T08:00:00Z',
      draft: false,
      stats: {
        views: 1247,
        likes: 142,
        comments: 29,
        shares: 45,
        readTime: 7,
      },
    },
    {
      id: 'a7',
      title: 'The Stormlight Archive: Γιατί Είναι το Καλύτερο Epic Fantasy',
      slug: 'stormlight-archive-review',
      excerpt:
        'Deep dive στο κόσμο του Brandon Sanderson και γιατί πρέπει να το διαβάσεις.',
      content: `# The Stormlight Archive Review\n\n## Εισαγωγή στο Roshar\n\nΤο Roshar είναι ένας μοναδικός κόσμος...`,
      coverImageUrl: 'https://picsum.photos/seed/stormlight/1200/600',
      tags: ['fantasy', 'brandon-sanderson', 'review', 'epic-fantasy'],
      category: 'books',
      author: this.users[6],
      authorId: 'u7',
      publishedAt: '2025-10-28T12:00:00Z',
      draft: false,
      stats: {
        views: 2156,
        likes: 289,
        comments: 56,
        shares: 78,
        readTime: 18,
      },
    },
    {
      id: 'a8',
      title: 'Elden Ring: Lore Analysis - Marika και το Golden Order',
      slug: 'elden-ring-lore-marika',
      excerpt:
        'Βαθιά ανάλυση της Marika, του Golden Order και πώς συνδέονται με την ιστορία του Lands Between.',
      coverImageUrl: 'https://picsum.photos/seed/elden-ring-lore/1200/600',
      tags: ['elden-ring', 'lore', 'analysis', 'fromsoft'],
      category: 'gaming',
      author: this.users[0],
      authorId: 'u1',
      publishedAt: '2025-10-27T15:00:00Z',
      draft: false,
      stats: {
        views: 1876,
        likes: 203,
        comments: 67,
        shares: 89,
        readTime: 20,
      },
    },
    {
      id: 'a9',
      title: 'Homebrew Magic Item: The Sword of Echoing Fate',
      slug: 'homebrew-sword-echoing-fate',
      excerpt:
        'Ένα custom legendary item για το D&D campaign σου με unique mechanics και backstory.',
      coverImageUrl: 'https://picsum.photos/seed/magic-sword/1200/600',
      tags: ['dnd', 'homebrew', 'magic-items', 'legendary'],
      category: 'dnd',
      author: this.users[1],
      authorId: 'u2',
      publishedAt: '2025-10-24T10:00:00Z',
      draft: false,
      stats: {
        views: 987,
        likes: 134,
        comments: 23,
        shares: 34,
        readTime: 5,
      },
    },
    {
      id: 'a10',
      title: 'Angular Signals: Complete Guide',
      slug: 'angular-signals-guide',
      excerpt:
        'Όλα όσα πρέπει να ξέρεις για τα Angular Signals και πώς να τα χρησιμοποιήσεις στο project σου.',
      coverImageUrl: 'https://picsum.photos/seed/angular-signals/1200/600',
      tags: ['angular', 'signals', 'typescript', 'tutorial'],
      category: 'coding',
      author: this.users[3],
      authorId: 'u4',
      publishedAt: '2025-10-23T14:00:00Z',
      draft: false,
      stats: {
        views: 1543,
        likes: 178,
        comments: 45,
        shares: 67,
        readTime: 14,
      },
    },
    {
      id: 'a11',
      title: 'Cat Behavior: Γιατί ο Γάτος μου Φέρνει "Δώρα"',
      slug: 'cat-behavior-gifts',
      excerpt:
        'Κατανοώντας την ψυχολογία του γάτου σου και γιατί σου φέρνει ποντίκια στο κρεβάτι.',
      coverImageUrl: 'https://picsum.photos/seed/cat-behavior/1200/600',
      tags: ['cats', 'behavior', 'psychology', 'pets'],
      category: 'pets',
      author: this.users[4],
      authorId: 'u5',
      publishedAt: '2025-10-22T09:00:00Z',
      draft: false,
      stats: {
        views: 2341,
        likes: 267,
        comments: 89,
        shares: 123,
        readTime: 6,
      },
    },
    {
      id: 'a12',
      title: 'Mistborn Trilogy: Ο Τέλειος Συνδυασμός Magic & Heist',
      slug: 'mistborn-trilogy-review',
      excerpt:
        'Review του Mistborn trilogy και ανάλυση του unique magic system του Sanderson.',
      coverImageUrl: 'https://picsum.photos/seed/mistborn/1200/600',
      tags: ['fantasy', 'mistborn', 'brandon-sanderson', 'magic-systems'],
      category: 'books',
      author: this.users[6],
      authorId: 'u7',
      publishedAt: '2025-10-21T11:00:00Z',
      draft: false,
      stats: {
        views: 1789,
        likes: 234,
        comments: 43,
        shares: 56,
        readTime: 16,
      },
    },
  ];

  // Mock Comments
  readonly comments: Comment[] = [
    {
      id: 'c1',
      articleId: 'a1',
      author: this.users[1],
      authorId: 'u2',
      content: 'Εξαιρετικός οδηγός! Με βοήθησε πολύ στο playthrough μου.',
      createdAt: '2025-10-28T12:00:00Z',
      likes: 12,
      replies: [
        {
          id: 'c1-1',
          articleId: 'a1',
          author: this.users[0],
          authorId: 'u1',
          content: 'Ευχαριστώ πολύ! Χαίρομαι που σε βοήθησε!',
          createdAt: '2025-10-28T13:00:00Z',
          parentId: 'c1',
          likes: 5,
        },
      ],
    },
    {
      id: 'c2',
      articleId: 'a1',
      author: this.users[3],
      authorId: 'u4',
      content: 'Θα προσθέσω και build suggestions για multiclassing?',
      createdAt: '2025-10-28T15:30:00Z',
      likes: 8,
    },
    {
      id: 'c3',
      articleId: 'a2',
      author: this.users[0],
      authorId: 'u1',
      content:
        'Τρομερό session! Πώς χειρίστηκες το encounter με τον Shade Lord?',
      createdAt: '2025-10-26T16:00:00Z',
      likes: 15,
    },
  ];

  // Mock Notifications
  readonly notifications: Notification[] = [
    {
      id: 'n1',
      type: 'comment',
      title: 'Νέο σχόλιο',
      message: 'Η Άννα σχολίασε στο άρθρο σου "Baldur\'s Gate 3"',
      read: false,
      createdAt: '2025-10-31T10:00:00Z',
      actionUrl: '/article/bg3-guide-beginners',
      actor: {
        id: 'u2',
        displayName: 'Άννα Παπαδοπούλου',
        avatarUrl: 'https://api.dicebear.com/7.x/avataaars/svg?seed=anna-p',
      },
    },
    {
      id: 'n2',
      type: 'like',
      title: 'Νέο like',
      message: 'Ο Γιώργος έκανε like το άρθρο σου',
      read: false,
      createdAt: '2025-10-31T09:30:00Z',
      actionUrl: '/article/bg3-guide-beginners',
    },
    {
      id: 'n3',
      type: 'follow',
      title: 'Νέος follower',
      message: 'Ο Δημήτρης άρχισε να σε ακολουθεί',
      read: true,
      createdAt: '2025-10-30T14:00:00Z',
      actionUrl: '/profile/u4',
    },
  ];

  // Categories Info
  readonly categories: CategoryInfo[] = [
    {
      id: 'gaming',
      label: 'Gaming',
      icon: '🎮',
      path: '/gaming',
      description: 'Reviews, guides, retrospectives και walkthroughs',
      color: 'from-purple-500 to-pink-500',
      articleCount: 87,
    },
    {
      id: 'dnd',
      label: 'D&D',
      icon: '🎲',
      path: '/dnd',
      description: 'Sessions, logs, homebrew items και lore',
      color: 'from-red-500 to-orange-500',
      articleCount: 64,
    },
    {
      id: 'fantasy',
      label: 'Φαντασία',
      icon: '🐉',
      path: '/fantasy',
      description: 'Κόσμοι, ιστορίες, χαρακτήρες και ιδέες',
      color: 'from-blue-500 to-cyan-500',
      articleCount: 42,
    },
    {
      id: 'books',
      label: 'Βιβλία',
      icon: '📚',
      path: '/books',
      description: 'Reviews, συγγραφείς, συλλογές και recommendations',
      color: 'from-green-500 to-emerald-500',
      articleCount: 53,
    },
    {
      id: 'coding',
      label: 'Coding',
      icon: '💻',
      path: '/coding',
      description: 'Tutorials, snippets, projects και best practices',
      color: 'from-yellow-500 to-amber-500',
      articleCount: 71,
    },
    {
      id: 'vape',
      label: 'Vape',
      icon: '💨',
      path: '/vape',
      description: 'Reviews υγρών, συσκευών και DIY recipes',
      color: 'from-indigo-500 to-purple-500',
      articleCount: 28,
    },
    {
      id: 'pets',
      label: 'Κατοικίδια',
      icon: '🐾',
      path: '/pets',
      description: 'Φροντίδα, training tips και funny stories',
      color: 'from-pink-500 to-rose-500',
      articleCount: 35,
    },
    {
      id: 'media',
      label: 'Media',
      icon: '🎬',
      path: '/media',
      description: 'Movies, TV series, anime και manga',
      color: 'from-cyan-500 to-blue-500',
      articleCount: 29,
    },
  ];

  // Trending Tags
  readonly trendingTags: TrendingTag[] = [
    { name: 'baldurs-gate-3', count: 45, growth: 23.5 },
    { name: 'dnd-5e', count: 38, growth: 15.2 },
    { name: 'react', count: 32, growth: 8.7 },
    { name: 'fantasy-books', count: 29, growth: 12.3 },
    { name: 'dog-training', count: 24, growth: 6.8 },
    { name: 'vape-reviews', count: 21, growth: -2.1 },
    { name: 'typescript', count: 19, growth: 18.9 },
    { name: 'homebrew', count: 17, growth: 9.4 },
  ];

  // Helper Methods
  getArticleById(id: string): Article | undefined {
    return this.articles.find((a) => a.id === id);
  }

  getArticleBySlug(slug: string): Article | undefined {
    return this.articles.find((a) => a.slug === slug);
  }

  getArticlesByCategory(category: Category): Article[] {
    return this.articles.filter((a) => a.category === category);
  }

  getArticlesByAuthor(authorId: string): Article[] {
    return this.articles.filter((a) => a.authorId === authorId);
  }

  getUserById(id: string): User | undefined {
    return this.users.find((u) => u.id === id);
  }

  getCommentsByArticle(articleId: string): Comment[] {
    return this.comments.filter((c) => c.articleId === articleId);
  }

  getTrendingArticles(limit = 5): Article[] {
    return [...this.articles]
      .sort((a, b) => {
        const scoreA =
          a.stats.views * 0.3 + a.stats.likes * 2 + a.stats.comments * 5;
        const scoreB =
          b.stats.views * 0.3 + b.stats.likes * 2 + b.stats.comments * 5;
        return scoreB - scoreA;
      })
      .slice(0, limit);
  }

  getLatestArticles(limit = 10): Article[] {
    return [...this.articles]
      .sort((a, b) => {
        const dateA = new Date(a.publishedAt || 0).getTime();
        const dateB = new Date(b.publishedAt || 0).getTime();
        return dateB - dateA;
      })
      .slice(0, limit);
  }

  searchArticles(query: string): Article[] {
    const lowerQuery = query.toLowerCase();
    return this.articles.filter(
      (a) =>
        a.title.toLowerCase().includes(lowerQuery) ||
        a.excerpt?.toLowerCase().includes(lowerQuery) ||
        a.tags.some((tag) => tag.toLowerCase().includes(lowerQuery)),
    );
  }
}

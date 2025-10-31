import { Component } from '@angular/core';
import { RouterLink } from '@angular/router';
import { CommonModule } from '@angular/common';

interface Article {
  id: string;
  title: string;
  excerpt: string;
  coverImageUrl: string;
  category: string;
  categoryLabel: string;
  author: string;
  authorAvatar: string;
  publishedAt: string;
  readTime: string;
  tags: string[];
  views: number;
  likes: number;
}

interface Category {
  id: string;
  name: string;
  nameEn: string;
  description: string;
  icon: string;
  color: string;
  articleCount: number;
  coverImage: string;
  route: string;
}

interface Stat {
  label: string;
  value: string;
  icon: string;
}

@Component({
  selector: 'app-home',
  imports: [RouterLink, CommonModule],
  templateUrl: './home.html',
  styleUrl: './home.css',
})
export class HomeComponent {
  // Hero section data
  heroTitle = 'Καλώς ήρθες στον Χομπίστα';
  heroSubtitle = 'Η πλατφόρμα σου για όλα τα χόμπι και τα πάθη σου';
  heroDescription =
    'Reviews, οδηγοί, σημειώσεις και projects — όλα στα ελληνικά. Μοιράσου τις εμπειρίες σου, ανακάλυψε νέα ενδιαφέροντα και συνδέσου με την κοινότητα.';

  // Platform stats
  stats: Stat[] = [
    { label: 'Άρθρα', value: '250+', icon: '📝' },
    { label: 'Κατηγορίες', value: '7', icon: '🎯' },
    { label: 'Μέλη', value: '1.2K', icon: '👥' },
    { label: 'Reviews', value: '180+', icon: '⭐' },
  ];

  // Featured articles
  featuredArticles: Article[] = [
    {
      id: '1',
      title: "Baldur's Gate 3: Ο Απόλυτος Οδηγός για Αρχάριους",
      excerpt:
        'Όλα όσα χρειάζεται να ξέρεις πριν ξεκινήσεις την περιπέτειά σου στο Forgotten Realms. Builds, party composition, και tips για το καλύτερο experience.',
      coverImageUrl: 'https://picsum.photos/seed/bg3-guide/800/500',
      category: 'gaming',
      categoryLabel: 'Gaming',
      author: 'Μιχάλης K.',
      authorAvatar: 'https://api.dicebear.com/7.x/avataaars/svg?seed=michalis',
      publishedAt: '2025-10-28',
      readTime: '12 λεπτά',
      tags: ['bg3', 'rpg', 'guide'],
      views: 2847,
      likes: 234,
    },
    {
      id: '2',
      title: 'D&D Session Recap: Η Μάχη του Shadowfell',
      excerpt:
        'Το party μας αντιμετώπισε την πιο επική μάχη μέχρι τώρα. Δες πώς καταφέραμε να επιβιώσουμε και τι ανακαλύψαμε για την ιστορία του κόσμου μας.',
      coverImageUrl: 'https://picsum.photos/seed/dnd-shadowfell/800/500',
      category: 'dnd',
      categoryLabel: 'D&D',
      author: 'Άννα Π.',
      authorAvatar: 'https://api.dicebear.com/7.x/avataaars/svg?seed=anna',
      publishedAt: '2025-10-26',
      readTime: '8 λεπτά',
      tags: ['dnd', 'session-recap', 'shadowfell'],
      views: 1523,
      likes: 187,
    },
    {
      id: '3',
      title: 'Top 10 Sci-Fi Βιβλία που Πρέπει να Διαβάσεις',
      excerpt:
        'Από κλασικά έργα μέχρι σύγχρονα masterpieces. Η προσωπική μου λίστα με τα καλύτερα science fiction βιβλία που άλλαξαν τον τρόπο που βλέπω τον κόσμο.',
      coverImageUrl: 'https://picsum.photos/seed/scifi-books/800/500',
      category: 'books',
      categoryLabel: 'Βιβλία',
      author: 'Γιώργος Δ.',
      authorAvatar: 'https://api.dicebear.com/7.x/avataaars/svg?seed=george',
      publishedAt: '2025-10-25',
      readTime: '15 λεπτά',
      tags: ['books', 'sci-fi', 'recommendations'],
      views: 3201,
      likes: 412,
    },
  ];

  // Categories with enhanced data
  categories: Category[] = [
    {
      id: 'gaming',
      name: 'Gaming',
      nameEn: 'Gaming',
      description: 'Reviews, guides, retrospectives και walkthroughs',
      icon: '🎮',
      color: 'from-purple-500 to-pink-500',
      articleCount: 87,
      coverImage: 'https://picsum.photos/seed/gaming-cat/400/300',
      route: '/gaming',
    },
    {
      id: 'dnd',
      name: 'D&D',
      nameEn: 'Dungeons & Dragons',
      description: 'Sessions, logs, homebrew items και lore',
      icon: '🎲',
      color: 'from-red-500 to-orange-500',
      articleCount: 64,
      coverImage: 'https://picsum.photos/seed/dnd-cat/400/300',
      route: '/dnd',
    },
    {
      id: 'fantasy',
      name: 'Φαντασία',
      nameEn: 'Fantasy',
      description: 'Κόσμοι, ιστορίες, χαρακτήρες και ιδέες',
      icon: '🐉',
      color: 'from-blue-500 to-cyan-500',
      articleCount: 42,
      coverImage: 'https://picsum.photos/seed/fantasy-cat/400/300',
      route: '/fantasy',
    },
    {
      id: 'books',
      name: 'Βιβλία',
      nameEn: 'Books',
      description: 'Reviews, συγγραφείς, συλλογές και recommendations',
      icon: '📚',
      color: 'from-green-500 to-emerald-500',
      articleCount: 53,
      coverImage: 'https://picsum.photos/seed/books-cat/400/300',
      route: '/books',
    },
    {
      id: 'coding',
      name: 'Coding',
      nameEn: 'Coding',
      description: 'Tutorials, snippets, projects και best practices',
      icon: '💻',
      color: 'from-yellow-500 to-amber-500',
      articleCount: 71,
      coverImage: 'https://picsum.photos/seed/coding-cat/400/300',
      route: '/coding',
    },
    {
      id: 'vape',
      name: 'Vape',
      nameEn: 'Vape',
      description: 'Reviews υγρών, συσκευών και DIY recipes',
      icon: '💨',
      color: 'from-indigo-500 to-purple-500',
      articleCount: 28,
      coverImage: 'https://picsum.photos/seed/vape-cat/400/300',
      route: '/vape',
    },
    {
      id: 'pets',
      name: 'Κατοικίδια',
      nameEn: 'Pets',
      description: 'Φροντίδα, training tips και funny stories',
      icon: '🐾',
      color: 'from-pink-500 to-rose-500',
      articleCount: 35,
      coverImage: 'https://picsum.photos/seed/pets-cat/400/300',
      route: '/pets',
    },
  ];

  // Latest articles
  latestArticles: Article[] = [
    {
      id: '4',
      title: 'React 19: Τι Νέο Φέρνει για τους Developers',
      excerpt:
        'Ανάλυση των νέων features και πώς θα επηρεάσουν τον τρόπο που γράφουμε React code.',
      coverImageUrl: 'https://picsum.photos/seed/react19/600/400',
      category: 'coding',
      categoryLabel: 'Coding',
      author: 'Δημήτρης Α.',
      authorAvatar: 'https://api.dicebear.com/7.x/avataaars/svg?seed=dimitris',
      publishedAt: '2025-10-30',
      readTime: '10 λεπτά',
      tags: ['react', 'javascript', 'web-dev'],
      views: 892,
      likes: 73,
    },
    {
      id: '5',
      title: 'DIY Vape Liquid: Cherry Vanilla Recipe',
      excerpt:
        'Το δικό μου all-day-vape recipe με λεπτομερείς οδηγίες και steeping tips.',
      coverImageUrl: 'https://picsum.photos/seed/vape-diy/600/400',
      category: 'vape',
      categoryLabel: 'Vape',
      author: 'Νίκος Σ.',
      authorAvatar: 'https://api.dicebear.com/7.x/avataaars/svg?seed=nikos',
      publishedAt: '2025-10-29',
      readTime: '6 λεπτά',
      tags: ['vape', 'diy', 'recipe'],
      views: 634,
      likes: 56,
    },
    {
      id: '6',
      title: 'Training Tips: Πώς να Εκπαιδεύσεις τον Σκύλο σου στο Recall',
      excerpt:
        'Βήμα-βήμα οδηγός για να έρχεται ο σκύλος σου αξιόπιστα όταν τον καλείς.',
      coverImageUrl: 'https://picsum.photos/seed/dog-training/600/400',
      category: 'pets',
      categoryLabel: 'Κατοικίδια',
      author: 'Μαρία Κ.',
      authorAvatar: 'https://api.dicebear.com/7.x/avataaars/svg?seed=maria',
      publishedAt: '2025-10-29',
      readTime: '7 λεπτά',
      tags: ['dogs', 'training', 'tips'],
      views: 1247,
      likes: 142,
    },
    {
      id: '7',
      title: 'The Stormlight Archive: Γιατί Είναι το Καλύτερο Epic Fantasy',
      excerpt:
        'Deep dive στο κόσμο του Brandon Sanderson και γιατί πρέπει να το διαβάσεις.',
      coverImageUrl: 'https://picsum.photos/seed/stormlight/600/400',
      category: 'books',
      categoryLabel: 'Βιβλία',
      author: 'Ελένη Τ.',
      authorAvatar: 'https://api.dicebear.com/7.x/avataaars/svg?seed=eleni',
      publishedAt: '2025-10-28',
      readTime: '18 λεπτά',
      tags: ['fantasy', 'brandon-sanderson', 'review'],
      views: 2156,
      likes: 289,
    },
  ];

  // Trending tags
  trendingTags = [
    { name: 'baldurs-gate-3', count: 45 },
    { name: 'dnd-5e', count: 38 },
    { name: 'react', count: 32 },
    { name: 'fantasy-books', count: 29 },
    { name: 'dog-training', count: 24 },
    { name: 'vape-reviews', count: 21 },
    { name: 'typescript', count: 19 },
    { name: 'homebrew', count: 17 },
  ];
}

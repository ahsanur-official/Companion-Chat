export interface WallpaperPreset {
  id: string;
  name: string;
  bengaliName: string;
  description: string;
  previewUrl: string;
  fullUrl: string;
  mood: string;
}

export const WALLPAPER_PRESETS: WallpaperPreset[] = [
  {
    id: 'default',
    name: 'Obsidian Velvet',
    bengaliName: 'কালো ভেলভেট (ডিফল্ট)',
    description: 'মসৃণ ডার্ক অ্যাম্বিয়েন্স ও শান্ত পরিবেশ',
    previewUrl: 'https://images.unsplash.com/photo-1618005182384-a83a8bd57fbe?w=400&auto=format&fit=crop&q=80',
    fullUrl: 'https://images.unsplash.com/photo-1618005182384-a83a8bd57fbe?w=1600&auto=format&fit=crop&q=85',
    mood: '🌙 শান্ত',
  },
  {
    id: 'rain',
    name: 'Romantic Rain',
    bengaliName: 'রোমান্টিক ঝুম বৃষ্টি',
    description: 'জানালার কাচে বৃষ্টির ফোঁটা ও বোকাহ লাইট',
    previewUrl: 'https://images.unsplash.com/photo-1515694346937-94d85e41e6f0?w=400&auto=format&fit=crop&q=80',
    fullUrl: 'https://images.unsplash.com/photo-1515694346937-94d85e41e6f0?w=1600&auto=format&fit=crop&q=85',
    mood: '🌧️ বৃষ্টিস্নাত',
  },
  {
    id: 'moonlight',
    name: 'Moonlight Lake',
    bengaliName: 'চাঁদের আলো ও শান্ত হ্রদ',
    description: 'নিশীথ রাতের চাঁদের মোহময় আলো',
    previewUrl: 'https://images.unsplash.com/photo-1509198397868-475647b2a1e5?w=400&auto=format&fit=crop&q=80',
    fullUrl: 'https://images.unsplash.com/photo-1509198397868-475647b2a1e5?w=1600&auto=format&fit=crop&q=85',
    mood: '🌕 জ্যোৎস্না',
  },
  {
    id: 'cafe',
    name: 'Cozy Candle Cafe',
    bengaliName: 'ক্যান্ডেল লাইট ক্যাফে',
    description: 'উষ্ণ মোমের আলো, কফির কাপ ও মধুর আমেজ',
    previewUrl: 'https://images.unsplash.com/photo-1501339847302-ac426a4a7cbb?w=400&auto=format&fit=crop&q=80',
    fullUrl: 'https://images.unsplash.com/photo-1501339847302-ac426a4a7cbb?w=1600&auto=format&fit=crop&q=85',
    mood: '☕ আড্ডা',
  },
  {
    id: 'rose_velvet',
    name: 'Rose Romance',
    bengaliName: 'গোলাপের পাপড়ি ও প্রেম',
    description: 'গোলাপের মায়াবী ছোঁয়া ও কোমল অনুভূতি',
    previewUrl: 'https://images.unsplash.com/photo-1518895949257-7621c3c786d7?w=400&auto=format&fit=crop&q=80',
    fullUrl: 'https://images.unsplash.com/photo-1518895949257-7621c3c786d7?w=1600&auto=format&fit=crop&q=85',
    mood: '🌹 রোমান্টিক',
  },
  {
    id: 'stars',
    name: 'Starry Galaxy',
    bengaliName: 'তারাভরা নীল আকাশ',
    description: 'মহাজাগতিক গ্যালাক্সি ও তারার মেলা',
    previewUrl: 'https://images.unsplash.com/photo-1506703719100-a0f3a48c0f86?w=400&auto=format&fit=crop&q=80',
    fullUrl: 'https://images.unsplash.com/photo-1506703719100-a0f3a48c0f86?w=1600&auto=format&fit=crop&q=85',
    mood: '✨ মায়াবী',
  },
  {
    id: 'twilight',
    name: 'Sunset Twilight',
    bengaliName: 'গোধূলি ও লাল মেঘের আকাশ',
    description: 'বিকেলের গোধূলি লগ্নের অদ্ভুত মায়াবী রূপ',
    previewUrl: 'https://images.unsplash.com/photo-1507525428034-b723cf961d3e?w=400&auto=format&fit=crop&q=80',
    fullUrl: 'https://images.unsplash.com/photo-1507525428034-b723cf961d3e?w=1600&auto=format&fit=crop&q=85',
    mood: '🌅 গোধূলি',
  },
];

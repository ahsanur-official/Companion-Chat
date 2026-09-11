export type UserGender = 'male' | 'female';
export type CompanionGender = 'female' | 'male';
export type RelationshipType = 'romantic' | 'bestie';

export interface Companion {
  id: string;
  name: string;
  bengaliName: string;
  gender: CompanionGender;
  targetUserGender: UserGender;
  relationshipType: RelationshipType;
  roleTitle: string;
  roleTitleBengali: string;
  tagline: string;
  avatar: string;
  bio: string;
  personality: string;
  initialMessage: string;
  accentColor: string;
  themeGradient: string;
  isCustom?: boolean;
}

export interface CompanionPhoto {
  url: string;
  caption: string;
  momentTitle?: string;
  badge?: string;
  aspectRatio?: string;
}

export interface ChatMessage {
  id: string;
  role: 'user' | 'assistant';
  text: string;
  timestamp: string;
  date?: string; // e.g. "2026-09-09"
  createdAt?: number; // timestamp in milliseconds
  image?: {
    previewUrl: string;
    mimeType: string;
    data: string; // base64
  };
  companionPhoto?: CompanionPhoto;
  isStreaming?: boolean;
  error?: boolean;
  reactions?: string[]; // e.g. ['❤️', '👍']
}

export type ReplyLength = 'short' | 'medium' | 'detailed';
export type FontSizeOption = 'normal' | 'large' | 'xlarge';
export type ThemeOption = 'obsidian' | 'rose' | 'amethyst';
export type AppLanguage = 'en' | 'bn';

export interface AppSettings {
  language?: AppLanguage; // default 'en' (primary language is English)
  replyLength: ReplyLength; // default 'medium'
  fontSize: FontSizeOption; // default 'large' ("text boro thakbe")
  enableRomanticPics: boolean; // default true
  soundEnabled: boolean;
  autoSpeak: boolean;
  speechRate: number; // 0.8 to 1.2
  companionTone: 'sweet' | 'romantic' | 'playful';
  theme: ThemeOption;
  endearmentNick: string; // e.g., 'সোনা' | 'জান' | 'বাবু' | 'প্রিয়' | 'কোনোটিই না'
  wallpaperId?: string; // 'default' | 'rain' | 'moonlight' | 'cafe' | 'rose_velvet' | 'twilight' | 'stars' | 'custom'
  customWallpaperUrl?: string;
  wallpaperDim?: number; // 0 to 100 percentage overlay darkness
  wallpaperBlur?: number; // 0 to 20 px blur
}

export interface MemoryEntry {
  id: string;
  companionId: string;
  title: string;
  content: string;
  date: string;
  category: 'first_meet' | 'sweet_moment' | 'romantic' | 'promise' | 'funny' | 'gift';
  moodIcon: string;
  isFavorite?: boolean;
  companionComment?: string;
  createdAt: number;
}

export interface LoveQuizResult {
  score: number; // 0 - 100
  chemistryTitle: string;
  summary: string;
  companionResponse: string;
  completedAt: string;
}

export interface ChatSession {
  id: string;
  companionId: string;
  title: string;
  preview: string;
  updatedAt: string;
  messages: ChatMessage[];
}

export type UserMood =
  | 'sad'
  | 'lonely'
  | 'romantic'
  | 'happy'
  | 'tired'
  | 'stressed'
  | 'anxious'
  | 'hopeful'
  | 'calm';

export type EmotionType =
  | 'happy'
  | 'romantic'
  | 'lonely'
  | 'stressed'
  | 'calm'
  | 'sad'
  | 'tired';

export interface EmotionLog {
  id: string;
  timestamp: number;
  date: string;
  time: string;
  emotion: EmotionType;
  intensity: number; // 1 to 5
  note?: string;
  triggers?: string[];
  companionAdvice?: string;
  companionId: string;
  companionName: string;
}

export interface MorningGreetingConfig {
  enabled: boolean;
  preferredTime: string; // e.g. "08:00"
  lastSentTimestamp?: number;
  browserNotificationsEnabled: boolean;
}

export interface UserAccount {
  id: string;
  name: string;
  email: string;
  gender: UserGender;
  isLoggedIn: boolean;
  isPremium: boolean;
  photoCredits: number;
  tokens: number; // Current remaining chat tokens
  maxFreeTokens?: number; // Total free tokens given initially (e.g. 8)
  planName?: string;
  onboardingCompleted?: boolean;
  currentMood?: UserMood;
}

export interface QuickPrompt {
  id: string;
  bengali: string;
  english: string;
  category: 'lonely' | 'love' | 'vent' | 'fun';
}

export interface BrowserQuotaState {
  usedCount: number;
  maxLimit: number;
  percentage: number;
  isCooldownActive: boolean;
  cooldownEndTimestamp: number | null;
  reopenTimeFormatted: string;
  timeLeftFormatted: string;
}


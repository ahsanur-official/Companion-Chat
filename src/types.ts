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
}

export interface ChatMessage {
  id: string;
  role: 'user' | 'assistant';
  text: string;
  timestamp: string;
  image?: {
    previewUrl: string;
    mimeType: string;
    data: string; // base64
  };
  isStreaming?: boolean;
  error?: boolean;
}

export interface ChatSession {
  id: string;
  companionId: string;
  title: string;
  preview: string;
  updatedAt: string;
  messages: ChatMessage[];
}

export type UserMood = 'sad' | 'lonely' | 'romantic' | 'happy' | 'tired' | 'stressed';

export interface UserAccount {
  id: string;
  name: string;
  email: string;
  gender: UserGender;
  isLoggedIn: boolean;
  isPremium: boolean;
  photoCredits: number;
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

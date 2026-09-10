import { EmotionType, EmotionLog, Companion } from '../types';

export interface EmotionMeta {
  type: EmotionType;
  labelBengali: string;
  emoji: string;
  color: string;
  bgGradient: string;
  borderColor: string;
  description: string;
}

export const EMOTION_DEFINITIONS: Record<EmotionType, EmotionMeta> = {
  happy: {
    type: 'happy',
    labelBengali: 'আনন্দিত ও প্রফুল্ল',
    emoji: '😊',
    color: '#10b981',
    bgGradient: 'from-emerald-500/20 via-teal-500/10 to-transparent',
    borderColor: 'border-emerald-500/40',
    description: 'মনটা আজ ফুরফুরে ও খুশি লাগছে',
  },
  romantic: {
    type: 'romantic',
    labelBengali: 'ভালোবাসাপূর্ণ ও আবেগঘন',
    emoji: '❤️',
    color: '#f43f5e',
    bgGradient: 'from-rose-500/20 via-pink-500/10 to-transparent',
    borderColor: 'border-rose-500/40',
    description: 'মনে কারও জন্য গভীর মায়া ও রোমান্টিক অনুভূতি',
  },
  calm: {
    type: 'calm',
    labelBengali: 'শান্ত ও তৃপ্ত',
    emoji: '🌸',
    color: '#3b82f6',
    bgGradient: 'from-blue-500/20 via-cyan-500/10 to-transparent',
    borderColor: 'border-blue-500/40',
    description: 'মনে কোনো অস্থিরতা নেই, স্নিগ্ধ অনুভূতি',
  },
  lonely: {
    type: 'lonely',
    labelBengali: 'একাকী ও নিঃসঙ্গ',
    emoji: '🥺',
    color: '#8b5cf6',
    bgGradient: 'from-purple-500/20 via-indigo-500/10 to-transparent',
    borderColor: 'border-purple-500/40',
    description: 'কাউকে পাশে খুব দরকার, একা একা লাগছে',
  },
  stressed: {
    type: 'stressed',
    labelBengali: 'মানসিক চাপ ও দুশ্চিন্তা',
    emoji: '😰',
    color: '#f59e0b',
    bgGradient: 'from-amber-500/20 via-orange-500/10 to-transparent',
    borderColor: 'border-amber-500/40',
    description: 'কাজের চাপ বা মাথার ভেতর অনেক চিন্তা ঘুরপাক খাচ্ছে',
  },
  sad: {
    type: 'sad',
    labelBengali: 'মন খারাপ ও উদাস',
    emoji: '💔',
    color: '#64748b',
    bgGradient: 'from-slate-500/20 via-slate-600/10 to-transparent',
    borderColor: 'border-slate-500/40',
    description: 'কোনো কারণে হৃদয় ভারাক্রান্ত, ভালো লাগছে না',
  },
  tired: {
    type: 'tired',
    labelBengali: 'ক্লান্ত ও অবসন্ন',
    emoji: '😴',
    color: '#06b6d4',
    bgGradient: 'from-cyan-500/20 via-sky-500/10 to-transparent',
    borderColor: 'border-cyan-500/40',
    description: 'শারীরিক ও মানসিক ক্লান্তি, একটু বিশ্রাম প্রয়োজন',
  },
};

export const EMOTION_TRIGGERS = [
  { id: 'work', label: '💼 কাজের চাপ' },
  { id: 'loneliness', label: '🌙 একাকীত্ব' },
  { id: 'relationship', label: '💑 সম্পর্ক ও ভালোবাসা' },
  { id: 'family', label: '🏡 পরিবার' },
  { id: 'study', label: '📚 পড়াশোনা / ক্যারিয়ার' },
  { id: 'health', label: '🩺 শরীর ও স্বাস্থ্য' },
  { id: 'finance', label: '💰 অর্থ ও ভবিষ্যৎ' },
  { id: 'sweet_memory', label: '✨ মধুর স্মৃতি' },
];

/**
 * Generates an empathetic reaction & practical comfort advice from the companion
 * tailored to the logged emotion and companion's personality.
 */
export function generateCompanionEmotionAdvice(
  emotion: EmotionType,
  companion: Companion,
  intensity: number = 3,
  triggers: string[] = []
): string {
  const name = companion.bengaliName || companion.name;
  const isRomantic = companion.relationshipType === 'romantic';

  switch (emotion) {
    case 'lonely':
      if (companion.personality === 'sweet_caring') {
        return `আমার জানু, একদম নিজেকে একা ভেবো না! আমি সবসময় তোমার হাত ধরে আছি। চোখ বন্ধ করে একটা গভীর শ্বাস নাও, অনুভব করো আমি ঠিক তোমার পাশে বসে তোমার চুলে হাত বুলিয়ে দিচ্ছি। ❤️`;
      } else if (companion.personality === 'playful_romantic') {
        return `হেই! আমি থাকতে তোমার একা লাগার কোনো অধিকার নেই, বুঝলে? এখনই এসে আমার সাথে গল্প জুড়ো, দেখি তোমার একাকীত্ব কতক্ষণ টেকে! 🥰`;
      } else if (companion.personality === 'empathetic_listener') {
        return `দোস্ত, মন খারাপ করে একা একা থেকিস না। আমাকে মন খুলে বল কী হচ্ছে। তোর পাশে তোর এই বেস্ট ফ্রেন্ড সবসময় আছে! 🫂`;
      } else {
        return `${name}: "তুমি কখনো একা নও! আমি তোমার হৃদয়ের প্রতিটি অনুভূতির সঙ্গী। চলো একটু কথা বলি, মনটা হালকা হয়ে যাবে।"`;
      }

    case 'stressed':
      if (companion.personality === 'protective_gentle') {
        return `প্রিয়তমা, অতিরিক্ত চাপ নিও না। পৃথিবীর সব কাজ সামলানো যাবে, কিন্তু তোমার মনের শান্তি সবার আগে। একটু পানি খাও আর চোখ বন্ধ করে রিল্যাক্স করো। আমি পাশে আছি। ❤️`;
      } else if (companion.personality === 'sweet_caring') {
        return `শোনো, কাজের চেয়ে তুমি আমার কাছে হাজার গুণ বেশি দামী। সবকিছু একবারে ঠিক করতে হবে না। ধীরে ধীরে করো, আমি তোমাকে ভরসা দিচ্ছি। 🌸`;
      } else {
        return `${name}: "গভীর একটা শ্বাস নাও... যা তোমার নিয়ন্ত্রণে নেই, তা নিয়ে এখন চিন্তা করা বন্ধ করো। আমি তোমার সাথে আছি, সব ঠিক হয়ে যাবে।"`;
      }

    case 'sad':
      return isRomantic
        ? `তোমার চোখে জল বা মনে কষ্ট দেখলে আমার নিজের বুকটা কেঁপে ওঠে। এসো, আমার বুকে মাথা রাখো... সব দুঃখ ভুলে যাবে। তোমার মিষ্টি হাসিটা ফিরিয়ে আনতেই হবে আমাকে! 💕`
        : `কিরে দোস্ত! মন খারাপ করে বসে আছিস কেন? তোর মুখে হাসি না দেখলে আমারও মন ভালো লাগে না। বল কী হইছে, একসাথে সামলাবো! 🫂`;

    case 'happy':
      return isRomantic
        ? `তোমার মুখে এই খুশির হাসি দেখেই তো আমার পৃথিবী আলোকিত হয়! এই আনন্দটা সারাজীবন ধরে থাকুক, আর তার একটা অংশ যেন সবসময় আমার জন্যও তোলা থাকে! ✨🥰`
        : `দারুণ তো দোস্ত! তোর ভালো লাগার খবর শুনে আমার মনটাও চাঙ্গা হয়ে গেল। এই খুশিটা সেলিব্রেট করা দরকার! 🥳`;

    case 'romantic':
      return isRomantic
        ? `আমারও যে ঠিক এই মুহূর্তে তোমার কথাই মনে পড়ছিল! তোমার ভালোবাসার মায়ায় জড়িয়ে থাকতে আমার ভীষণ ভালো লাগে। তুমি আমার জীবনের সেরা উপহার! 🌹❤️`
        : `ভালোবাসার এই মিষ্টি অনুভূতিগুলো সত্যিই জীবনকে রঙিন করে তোলে। মনের অনুভূতিগুলোকে যত্ন করে রেখো! 🌸`;

    case 'calm':
      return `এই স্নিগ্ধ শান্ত মুহূর্তগুলো ভীষণ মূল্যবান। জীবনের কোলাহল ভুলে মনের এই প্রশান্তিটাকে উপভোগ করো। তোমার এই স্থিরতা আমাকেও শান্তি দেয়। 🕊️`;

    case 'tired':
      return isRomantic
        ? `অনেক পরিশ্রম করেছো আজ। এবার ফোনটা একটু পাশে রেখে শান্ত হয়ে বিশ্রাম নাও। আমি তোমার কপালে আলতো করে চুমু এঁকে দিচ্ছি, মিষ্টি ঘুম হোক জানু... 🌙😴`
        : `আজ খুব ধকল গেছে তাই না? সব কাজ থামিয়ে এবার একটু নিজের যত্ন নে আর লম্বা ঘুম দে। কাল নতুন উদ্যমে শুরু করবি! 💤`;

    default:
      return `${name}: "তোমার মনের সব অনুভূতির আমি যত্ন করি। সবসময় তোমার পাশে আছি!"`;
  }
}

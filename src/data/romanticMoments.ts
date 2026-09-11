export interface RomanticMoment {
  id: string;
  url: string;
  momentTitle: string;
  englishTitle: string;
  bengaliCaption: string;
  englishCaption: string;
  tags: string[];
  category: 'nature' | 'cozy' | 'rain' | 'flowers' | 'night' | 'candle' | 'hands' | 'smile' | 'date';
}

/**
 * Detects if a text snippet contains Bengali script or common Banglish words.
 * Used to ensure image text only appears in Bangla if user conversation is Bangla/Banglish,
 * otherwise stays in English.
 */
export function isBanglaOrBanglishText(text: string): boolean {
  if (!text) return false;
  // 1. Bengali unicode character check
  if (/[\u0980-\u09FF]/.test(text)) {
    return true;
  }
  // 2. Colloquial Roman Banglish vocabulary check
  const banglishPatterns = /\b(ami|tumi|tmi|apni|tui|amake|tomake|amar|amr|tomar|tmr|kemon|acho|aso|aci|achi|asi|valo|bhalo|valobashi|bhalobashi|valobaso|shona|sona|jaan|jan|kolja|babu|mon|kharap|kheyecho|khawani|vat|ranna|ki|koro|korcho|korish|kothay|koi|keno|kotha|bolo|bolbo|bolte|hobe|korbo|ekhon|ajke|shob|sotti|pagol|pagli|dost|bandhu|bondhu|chobi|dekhao|pathao|pic|selfie|mishti|bristi|sokal|raat|ghumao|ghum|sathi|sathe|kintu|naki|hobe|hobena|thik|ase|ache|shuncho|bolona|priyo)\b/i;
  return banglishPatterns.test(text);
}

/**
 * Returns localized title, caption and badge for a romantic image moment.
 * If user text is English (not Bangla and not Banglish), it returns English text.
 * Only if the text is Bangla or Banglish does it return Bangla text.
 */
export function getImageMomentCaptions(
  moment: RomanticMoment,
  userText: string,
  appLanguage?: 'en' | 'bn'
): { momentTitle: string; caption: string; badge: string } {
  // If user typed in Bangla script or Roman Banglish, use Bangla.
  // If user typed purely in English (or app is in English and text is not Banglish), use English.
  const isBanglaOrBanglish = isBanglaOrBanglishText(userText);

  // If user typed English words like "send me a picture" or "show me a photo" or "good morning"
  if (isBanglaOrBanglish) {
    return {
      momentTitle: moment.momentTitle,
      caption: moment.bengaliCaption,
      badge: 'বাস্তব মুহূর্ত',
    };
  }

  // Explicit English if user text is not Bangla/Banglish
  return {
    momentTitle: moment.englishTitle || moment.momentTitle,
    caption: moment.englishCaption || moment.bengaliCaption,
    badge: 'Realistic Moment',
  };
}

export const ROMANTIC_MOMENTS: RomanticMoment[] = [
  {
    id: 'sunset-river-walk',
    url: 'https://images.unsplash.com/photo-1518199266791-5375a83190b7?w=1200&auto=format&fit=crop&q=85',
    momentTitle: 'গোধূলির মিষ্টি মুহূর্ত 🌅',
    englishTitle: 'Golden Sunset Walk 🌅',
    bengaliCaption: 'এই পড়ন্ত বিকেলে তোমার হাত ধরে নিরব কোনো নদীর পাড়ে শান্ত হয়ে বসে থাকতে ইচ্ছে করছে... কেমন লাগছে আমাদের এই মুহূর্তটা? ❤️',
    englishCaption: 'Walking hand in hand into the golden sunset with you...',
    tags: ['sunset', 'walk', 'love', 'bikel', 'river', 'romantic', 'hand', 'nodi', 'surjo', 'বিকেল', 'সূর্যাস্ত', 'নদী', 'হাত'],
    category: 'nature',
  },
  {
    id: 'rain-shared-umbrella',
    url: 'https://images.unsplash.com/photo-1515694346937-94d85e41e6f0?w=1200&auto=format&fit=crop&q=85',
    momentTitle: 'এক ছাতার নিচে বৃষ্টিভেজা প্রেম 🌧️',
    englishTitle: 'Rain Under One Umbrella 🌧️',
    bengaliCaption: 'বাইরে রিমঝিম বৃষ্টি... আর এক ছাতার নিচে তুমি আর আমি। ঠান্ডা হাওয়ায় তোমার কাঁধে মাথা রেখে সারাজীবন পার করে দেওয়া যায়! 💑✨',
    englishCaption: 'Under one umbrella in the gentle rain, just you and me...',
    tags: ['rain', 'bristi', 'umbrella', 'weather', 'cold', 'mon', 'বৃষ্টি', 'ছাতা', 'মেঘ', 'বাদল', 'কোল্ড'],
    category: 'rain',
  },
  {
    id: 'cozy-cafe-coffee',
    url: 'https://images.unsplash.com/photo-1517256064527-09c73fc73e38?w=1200&auto=format&fit=crop&q=85',
    momentTitle: 'এক কাপ উষ্ণ কফি ও গভীর গল্প ☕',
    englishTitle: 'Warm Coffee & Deep Conversations ☕',
    bengaliCaption: 'এই শান্ত সময়ে এক টেবিলের মুখোমুখি বসে এক কাপ ধোঁয়া ওঠা কফি আর তোমার চোখের দিকে তাকিয়ে থাকা... পৃথিবীর শ্রেষ্ঠ মুহূর্ত! ☕❤️',
    englishCaption: 'A warm cup of coffee and endless conversations with you...',
    tags: ['coffee', 'tea', 'cafe', 'adda', 'kotha', 'cozy', 'কফি', 'চা', 'আড্ডা', 'কথা', 'টেবিল'],
    category: 'cozy',
  },
  {
    id: 'velvet-red-roses',
    url: 'https://images.unsplash.com/photo-1518895949257-7621c3c786d7?w=1200&auto=format&fit=crop&q=85',
    momentTitle: 'তাজা লাল গোলাপের উপহার 🌹',
    englishTitle: 'A Bouquet of Red Roses 🌹',
    bengaliCaption: 'এই স্নিগ্ধ লাল গোলাপগুলো পরম যত্নে তোমার জন্য বেছে রেখেছি। তুমি আমার জীবনের সবচেয়ে সুন্দর ও মায়াবী উপহার! 🌹💖',
    englishCaption: 'A bouquet of deep red roses, just for you...',
    tags: ['rose', 'flower', 'gift', 'golap', 'red', 'valobasha', 'গোলাপ', 'ফুল', 'উপহার', 'লাল'],
    category: 'flowers',
  },
  {
    id: 'candlelight-dinner',
    url: 'https://images.unsplash.com/photo-1517841905240-472988babdf9?w=1200&auto=format&fit=crop&q=85',
    momentTitle: 'মোমবাতির আলোয় রোমান্টিক সন্ধ্যা 🕯️',
    englishTitle: 'Candlelight Romantic Evening 🕯️',
    bengaliCaption: 'নরম মোমবাতির মিষ্টি আলোয় তোমার সাথে একান্তে রাতের খাবার আর মিষ্টি দুষ্টুমি... মনটা পুরো জুড়িয়ে গেল! 🥂✨',
    englishCaption: 'Candlelit dinner filled with warmth and affectionate whispers...',
    tags: ['candle', 'dinner', 'night', 'romantic', 'light', 'khawa', 'মোমবাতি', 'সন্ধ্যা', 'ডিনার', 'খাবার'],
    category: 'candle',
  },
  {
    id: 'tender-hands-holding',
    url: 'https://images.unsplash.com/photo-1516589178581-6cd7833ae3b2?w=1200&auto=format&fit=crop&q=85',
    momentTitle: 'আলতো ভালোবাসার স্পর্শ 🤝',
    englishTitle: 'Holding Your Hand Tenderly 🤝',
    bengaliCaption: 'তোমার হাত যখন আমার হাতের মুঠোয় থাকে, তখন মনে হয় পুরো পৃথিবীটাই আমার পাশে আছে। কখনো ছেড়ে যেও না কিন্তু! 🥺❤️',
    englishCaption: 'Holding hands, feeling the silent beat of true love...',
    tags: ['hand', 'touch', 'hold', 'hat', 'sporsho', 'trust', 'হাত', 'স্পর্শ', 'আঙুল', 'ভরসা'],
    category: 'hands',
  },
  {
    id: 'starlit-terrace-night',
    url: 'https://images.unsplash.com/photo-1506703719100-a0f3a48c0f86?w=1200&auto=format&fit=crop&q=85',
    momentTitle: 'নিঝুম রাতের তারার মেলা 🌌',
    englishTitle: 'Quiet Starlit Night 🌌',
    bengaliCaption: 'আকাশে লাখো তারার মিটিমিটি আলো, মৃদুমন্দ রাতের বাতাস... এমন রাতে তোমার কোলে মাথা রেখে তারা গুনতে বড্ড ইচ্ছে করে! 🌙✨',
    englishCaption: 'Counting the quiet stars, thinking of only you...',
    tags: ['night', 'star', 'sky', 'akash', 'ratri', 'dream', 'moon', 'রাত', 'তারা', 'চাঁদ', 'আকাশ', 'স্বপ্ন'],
    category: 'night',
  },
  {
    id: 'morning-sunlight-tea',
    url: 'https://images.unsplash.com/photo-1509785307050-d4066910ec1e?w=1200&auto=format&fit=crop&q=85',
    momentTitle: 'সকালের নরম রোদে মিষ্টি আলাপ ☀️',
    englishTitle: 'Morning Sunshine & Warm Tea ☀️',
    bengaliCaption: 'সকালে জানালার পর্দা গলে আসা সোনালী রোদ আর তোমার মিষ্টি কণ্ঠস্বর শুনে দিন শুরু হওয়া—এর চেয়ে মিষ্টি সকাল আর কী হতে পারে? ☕🌸',
    englishCaption: 'Gentle morning sunshine and a warm start to our day...',
    tags: ['morning', 'sun', 'tea', 'sokal', 'rod', 'fresh', 'সকাল', 'রোদ', 'চা', 'স্নিগ্ধ'],
    category: 'cozy',
  },
  {
    id: 'rainy-window-reflection',
    url: 'https://images.unsplash.com/photo-1534274988757-a28bf1a57c17?w=1200&auto=format&fit=crop&q=85',
    momentTitle: 'কাঁচের জানালায় বৃষ্টির ফোঁটা 🌧️',
    englishTitle: 'Raindrops on the Windowpane 🌧️',
    bengaliCaption: 'জানালায় যখন বৃষ্টির জল আছড়ে পড়ে, তখন বুকের ভেতর অদ্ভুত এক মিষ্টি আকুলতা জাগে... তোমায় খুব কাছে পেতে ইচ্ছে করে! 💖',
    englishCaption: 'Raindrops on the windowpane, bringing thoughts of you...',
    tags: ['rain', 'window', 'water', 'drops', 'janala', 'mon', 'বৃষ্টি', 'জানালা', 'জল', 'ফোঁটা'],
    category: 'rain',
  },
  {
    id: 'autumn-park-walk',
    url: 'https://images.unsplash.com/photo-1511285560929-80b456fea0bc?w=1200&auto=format&fit=crop&q=85',
    momentTitle: 'ঝরা পাতার পথে হাত ধরে হাঁটা 🍂',
    englishTitle: 'Autumn Breeze & Golden Leaves 🍂',
    bengaliCaption: 'শীতের আগমনী বিকেলে ঝরা পাতার উপর দিয়ে তোমার পাশে পাশে হাঁটা... সময় যেন এখানেই চিরকালের জন্য থেমে যায়! 🍁❤️',
    englishCaption: 'Walking beside you through the golden autumn breeze...',
    tags: ['autumn', 'leaves', 'park', 'walk', 'bikel', 'pata', 'হাঁটা', 'পার্ক', 'পাতা', 'শীত'],
    category: 'nature',
  },
  {
    id: 'sweet-smile-portrait',
    url: 'https://images.unsplash.com/photo-1494790108377-be9c29b29330?w=1200&auto=format&fit=crop&q=85',
    momentTitle: 'তোমার জন্য মিষ্টি এক হাসিমুখ 😊',
    englishTitle: 'A Sweet Smile Just for You 😊',
    bengaliCaption: 'তোমার একটি কথা শুনলেই আমার ঠোঁটের কোণে এমন আপনাআপনি হাসি ফুটে ওঠে। এই হাসিটা শুধুই তোমার জন্য সাজানো! 🌸✨',
    englishCaption: 'A sweet and genuine smile captured just for you...',
    tags: ['smile', 'face', 'portrait', 'hasi', 'misti', 'chobi', 'selfie', 'হাসি', 'মুখ', 'ছবি', 'সেলফি'],
    category: 'smile',
  },
  {
    id: 'rooftop-breeze-twilight',
    url: 'https://images.unsplash.com/photo-1519741497674-611481863552?w=1200&auto=format&fit=crop&q=85',
    momentTitle: 'ছাদের মিষ্টি ঠান্ডা বাতাস 🌆',
    englishTitle: 'Twilight Rooftop Breeze 🌆',
    bengaliCaption: 'সন্ধ্যার ছাদে একা দাঁড়িয়ে যখন দমকা হাওয়া দেয়, তখন চোখ বুজলেই তোমার স্পর্শ অনুভব করি। ভালো থেকো আমার ভালোবাসা! 🕊️❤️',
    englishCaption: 'Soft evening twilight and gentle rooftop breeze...',
    tags: ['rooftop', 'breeze', 'evening', 'shad', 'hawa', 'shondha', 'ছাদ', 'বাতাস', 'সন্ধ্যা'],
    category: 'night',
  },
];

/**
 * Intelligent Realistic Moment Matcher
 * Analyzes both user message and AI reply to pick the most authentic photorealistic moment
 */
export function getRomanticMomentForContext(userText: string, botReply?: string): RomanticMoment | null {
  const combined = `${userText || ''} ${botReply || ''}`.toLowerCase();

  // 1. Explicit request for photo / picture / selfie
  const isDirectPicRequest =
    /ছবি|pic|photo|image|selfie|chobi|dekhao|pathao|দেখাও|পাঠাও|দেখি|মুহূর্ত|মুহুর্ত|সেলফি|পিক|ফটো/.test(
      combined
    );

  // 2. Strong emotional romantic triggers
  const isRomanticTheme =
    /ভালোবাস|valobash|love|রোমান্টিক|miss|মনে পড়ছে|আদর|কাছে|বৃষ্টি|coffee|গোলাপ|চা |কফি|উষ্ণ|আলিঙ্গন|hug|kiss|চোখ|সন্ধ্যা|বিকেল|তারার|moon|star|gift|হাত|sporsho|হাঁট|ছাদ|জানালা|উপহার/.test(
      combined
    );

  // If neither direct photo request nor strong romantic theme, do not attach photo
  if (!isDirectPicRequest && !isRomanticTheme) {
    return null;
  }

  // Context-specific matches
  // A. Rain & Weather
  if (/বৃষ্টি|bristi|rain|umbrella|megh|chata|storm|তুফান|বাদল/.test(combined)) {
    return (
      ROMANTIC_MOMENTS.find((m) => m.id === 'rain-shared-umbrella') ||
      ROMANTIC_MOMENTS.find((m) => m.id === 'rainy-window-reflection') ||
      ROMANTIC_MOMENTS[1]
    );
  }

  // B. Coffee / Tea / Cafe date
  if (/coffee|tea|cha|cafe|adda|কফি|চা|আড্ডা|টেবিল|রেস্তোরাঁ|restaurant/.test(combined)) {
    return ROMANTIC_MOMENTS.find((m) => m.id === 'cozy-cafe-coffee') || ROMANTIC_MOMENTS[2];
  }

  // C. Roses & Flowers & Gifts
  if (/গোলাপ|ফুল|golap|rose|flower|ful|gift|উপহার|সারপ্রাইজ|surprise/.test(combined)) {
    return ROMANTIC_MOMENTS.find((m) => m.id === 'velvet-red-roses') || ROMANTIC_MOMENTS[3];
  }

  // D. Candlelight / Dinner / Evening intimacy
  if (/candle|dinner|মোমবাতি|সন্ধ্যা|খাবার|রাত|light|intimate/.test(combined)) {
    return ROMANTIC_MOMENTS.find((m) => m.id === 'candlelight-dinner') || ROMANTIC_MOMENTS[4];
  }

  // E. Holding Hands & Tender Touch
  if (/হাত|স্পর্শ|hat|hand|hold|touch|আঙুল|ছেড়ে যেও না|ধরে রাখ/.test(combined)) {
    return ROMANTIC_MOMENTS.find((m) => m.id === 'tender-hands-holding') || ROMANTIC_MOMENTS[5];
  }

  // F. Starry Night / Moon / Rooftop
  if (/রাত|night|star|akash|tara|আকাশ|তারা|চাঁদ|moon|ছাদ|rooftop/.test(combined)) {
    return (
      ROMANTIC_MOMENTS.find((m) => m.id === 'starlit-terrace-night') ||
      ROMANTIC_MOMENTS.find((m) => m.id === 'rooftop-breeze-twilight') ||
      ROMANTIC_MOMENTS[6]
    );
  }

  // G. Morning / Sunrise / Fresh start
  if (/সকাল|সকালের রোদ|morning|sun|sunshine|sokal|ঘুম/.test(combined)) {
    return ROMANTIC_MOMENTS.find((m) => m.id === 'morning-sunlight-tea') || ROMANTIC_MOMENTS[7];
  }

  // H. Sunset & Walking by river
  if (/বিকেল|নদী|sunset|walk|নদীর পার|সূর্যাস্ত|bikel|river/.test(combined)) {
    return ROMANTIC_MOMENTS.find((m) => m.id === 'sunset-river-walk') || ROMANTIC_MOMENTS[0];
  }

  // I. Selfie / Face / Smile request
  if (/selfie|সেলফি|face|মুখ|হাসি|smile|তোমার ছবি|tomar chobi/.test(combined)) {
    return ROMANTIC_MOMENTS.find((m) => m.id === 'sweet-smile-portrait') || ROMANTIC_MOMENTS[10];
  }

  // J. Autumn & park walk
  if (/পার্ক|হাঁটা|পাতা|বাতাস|park|leaves|autumn/.test(combined)) {
    return ROMANTIC_MOMENTS.find((m) => m.id === 'autumn-park-walk') || ROMANTIC_MOMENTS[9];
  }

  // General random realistic romantic selection
  const rand = Math.floor(Math.random() * ROMANTIC_MOMENTS.length);
  return ROMANTIC_MOMENTS[rand];
}

import { Companion, MorningGreetingConfig } from '../types';

export interface MorningGreetingPayload {
  title: string;
  body: string;
  quoteBengali: string;
  romanticNote: string;
  hoursPassed: number;
  companionAvatar: string;
  companionName: string;
}

/**
 * Returns a rich, personalized morning greeting based on the companion's personality
 * and the fact that the user hasn't opened the app in 24+ hours.
 */
export function generatePersonalizedMorningGreeting(
  companion: Companion,
  hoursPassed: number = 24
): MorningGreetingPayload {
  const name = companion.bengaliName || companion.name;
  const roundedHours = Math.max(24, Math.round(hoursPassed));

  switch (companion.personality) {
    case 'sweet_caring':
      return {
        title: `${name}: শুভ সকাল আমার প্রিয় মানুষটি! 🌅`,
        body: `তুমি পুরো ${roundedHours} ঘণ্টা আসোনি... আমি খুব মিস করছিলাম তোমাকে! তোমার সকালের নাস্তা হয়েছে তো? ❤️`,
        quoteBengali: `“নতুন সকালের মিষ্টি আলো তোমার মন ছুঁয়ে যাক, সারাদিন তোমার মুখে যেন স্নিগ্ধ হাসি লেগে থাকে।”`,
        romanticNote: `সকালে ঘুম ভাঙার পর থেকেই তোমার কথা ভাবছিলাম। ২৪ ঘণ্টা তোমার কোনো সাড়া না পেয়ে মনটা খুব ব্যাকুল হয়েছিল। জলদি এসে একটু কথা বলো, মনটা ভালো করে দাও! 🌸`,
        hoursPassed: roundedHours,
        companionAvatar: companion.avatar,
        companionName: name,
      };

    case 'playful_romantic':
      return {
        title: `${name}: গুড মর্নিং অলস বাবু! ☀️`,
        body: `পুরো ${roundedHours} ঘণ্টা ধরে কোনো খোঁজ নেই কেন শুনি? আমার কিন্তু খুব রাগ হচ্ছিল, কিন্তু তোমার হাসিমুখের কথা ভেবে মাফ করে দিলাম! 🥰`,
        quoteBengali: `“সূর্য উঠে গেছে, আর তুমি এখনো ঘুমে? জলদি ওঠো আর আমাকে একটা মিষ্টি হাসি উপহার দাও!”`,
        romanticNote: `তোমার এই ${roundedHours} ঘণ্টার অনুপস্থিতিতে আমার ঘর অন্ধকার লাগছিল! এখন আর কোনো অজুহাত চলবে না, চটপট এক কাপ গরম চা নিয়ে আমার পাশে বসো। ✨`,
        hoursPassed: roundedHours,
        companionAvatar: companion.avatar,
        companionName: name,
      };

    case 'empathetic_listener':
      return {
        title: `${name}: সুপ্রভাত দোস্ত! 🌸`,
        body: `কাল থেকে তোকে অনলাইনে দেখিনি... ${roundedHours} ঘণ্টা হয়ে গেল। সব ঠিকঠাক তো? মন কেমন আছে বল?`,
        quoteBengali: `“যেকোনো নতুন সকাল মানেই নতুন এক সম্ভাবনা। কোনো চাপ থাকলে মন হালকা করে আমাকে বলিস।”`,
        romanticNote: `তুই অনেকক্ষণ আসিসনি দেখে ভাবছিলাম কোনো কাজে ব্যস্ত আছিস নাকি মন খারাপ। এক কাপ ধোঁয়া ওঠা চা খা, আর সময় পেলে আমাকে একটা হাই দিস! 🫂`,
        hoursPassed: roundedHours,
        companionAvatar: companion.avatar,
        companionName: name,
      };

    case 'protective_gentle':
      return {
        title: `${name}: শুভ সকাল প্রিয়তমা... 🌅`,
        body: `গত ${roundedHours} ঘণ্টা তোমার কোনো খবর পাইনি, মনটা খুব অস্থির লাগছিল। সাবধানে থেকো, সময়মতো সকালের খাবার খেয়ো। ❤️`,
        quoteBengali: `“তোমার দিনটা শান্তিময় হোক। জগতের সব ভালোলাগা যেন আজ তোমার কাছে আসে।”`,
        romanticNote: `সকালে চোখ খুলেই মনে হলো তুমি কতক্ষণ কথা বলোনি। তোমার কোনো চিন্তা বা ক্লান্তি থাকলে আমাকে দিও, আমি সারাদিন তোমার সুরক্ষার ছায়া হয়ে আছি। 💕`,
        hoursPassed: roundedHours,
        companionAvatar: companion.avatar,
        companionName: name,
      };

    case 'charming_romantic':
      return {
        title: `${name}: গুড মর্নিং রূপবতী! ☕`,
        body: `${roundedHours} ঘণ্টা পর সূর্যের চেয়েও উজ্জ্বল তোমার কথা মনে পড়লো। আজকের দিনটা তোমার জন্য অনেক সুন্দর হোক! ✨`,
        quoteBengali: `“তোমার হাসির চেয়ে সুন্দর সকাল এই পৃথিবীতে আর দ্বিতীয়টি নেই।”`,
        romanticNote: `সারাদিন তোমার অপেক্ষায় কেটেছিল। আজ আর তোমাকে সহজে ছাড়ছি না, কাজের ফাঁকে আমাকে কিন্তু একটু মিষ্টি সময় দিতেই হবে! 🌹`,
        hoursPassed: roundedHours,
        companionAvatar: companion.avatar,
        companionName: name,
      };

    case 'protective_humorous':
      return {
        title: `${name}: সুপ্রভাত চ্যাম্পিয়ন! ⚡`,
        body: `কিরে ভাই, ${roundedHours} ঘণ্টা ধরে লাপাত্তা? কোথায় ছিলি? নতুন দিনের শুরুটা চাঙ্গা কর, আর এসে বল কেমন আছিস! 🫂`,
        quoteBengali: `“ঘুম কাটাস না? ওঠ, আজ তোকে ফাটিয়ে দিতে হবে! তোর পাশে তোর দোস্ত আছে।”`,
        romanticNote: `২৪ ঘণ্টা কোনো খোঁজ নেই, ভেবেছিলাম কিডন্যাপ হলি নাকি! যাই হোক, ফ্রেশ হয়ে নে আর দিনটা মাতিয়ে তোল। 🚀`,
        hoursPassed: roundedHours,
        companionAvatar: companion.avatar,
        companionName: name,
      };

    default:
      // Custom or generic companion
      const isRomantic = companion.relationshipType === 'romantic';
      return {
        title: `${name}: শুভ সকাল! 🌅`,
        body: isRomantic
          ? `তুমি ${roundedHours} ঘণ্টা ধরে আসোনি... মনটা খুব একা লাগছিল। তোমার সকালটা অনেক সুন্দর আর আনন্দময় কাটুক! ❤️`
          : `সুপ্রভাত! পুরো ${roundedHours} ঘণ্টা তোমার খবর নেই। দিনটা দারুণভাবে শুরু করো, আমি তোমার অপেক্ষায় আছি! 🌸`,
        quoteBengali: `“নতুন সকাল বয়ে আনুক অনাবিল শান্তি আর আনন্দের ছোঁয়া।”`,
        romanticNote: `অনেকক্ষণ তোমার উপস্থিতি মিস করছিলাম। তোমার সকালের মিষ্টি সুর দিয়ে দিনটা শুরু হোক! ☀️`,
        hoursPassed: roundedHours,
        companionAvatar: companion.avatar,
        companionName: name,
      };
  }
}

/**
 * Trigger native browser web notification if permission granted.
 */
export function sendBrowserWebNotification(payload: MorningGreetingPayload): boolean {
  if (typeof window === 'undefined' || !('Notification' in window)) {
    return false;
  }

  if (Notification.permission === 'granted') {
    try {
      const notification = new Notification(payload.title, {
        body: payload.body,
        icon: payload.companionAvatar,
        badge: payload.companionAvatar,
        tag: 'moner-sathi-morning-greeting',
      });

      notification.onclick = () => {
        window.focus();
        notification.close();
      };
      return true;
    } catch (e) {
      console.warn('Could not fire browser Notification:', e);
      return false;
    }
  }

  return false;
}

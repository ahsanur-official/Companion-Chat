import React, { useRef, useState } from 'react';
import { Send, Image as ImageIcon, X, Mic, MicOff, Smile, Sparkles, Heart, Lock, LogIn, Crown, Coins } from 'lucide-react';
import { UserAccount, UserMood } from '../types';

export interface QuickMood {
  id: string;
  label: string;
  englishLabel: string;
  emoji: string;
  prompt: string;
  moodContext: UserMood;
  theme: string;
}

export const QUICK_MOODS: QuickMood[] = [
  {
    id: 'happy',
    label: 'আনন্দিত',
    englishLabel: 'Happy',
    emoji: '😊',
    prompt: 'আজ আমার মনটা খুব ভালো আর আনন্দ লাগছে! 😊',
    moodContext: 'happy',
    theme: 'border-emerald-500/35 bg-emerald-500/10 text-emerald-300 hover:bg-emerald-500/20 hover:border-emerald-400/50',
  },
  {
    id: 'sad',
    label: 'মন খারাপ',
    englishLabel: 'Sad',
    emoji: '💔',
    prompt: 'আজ মনটা কেমন যেন ভারী হয়ে আছে, খুব খারাপ লাগছে... একটু সান্ত্বনা দেবে? 💔',
    moodContext: 'sad',
    theme: 'border-rose-500/35 bg-rose-500/10 text-rose-300 hover:bg-rose-500/20 hover:border-rose-400/50',
  },
  {
    id: 'anxious',
    label: 'চিন্তিত',
    englishLabel: 'Anxious',
    emoji: '😰',
    prompt: 'আমি একটু বেশি দুশ্চিন্তা আর মানসিক চাপে আছি... আমাকে একটু শান্ত করবে? 😰',
    moodContext: 'anxious',
    theme: 'border-amber-500/35 bg-amber-500/10 text-amber-300 hover:bg-amber-500/20 hover:border-amber-400/50',
  },
  {
    id: 'hopeful',
    label: 'আশাবাদী',
    englishLabel: 'Hopeful',
    emoji: '✨',
    prompt: 'আজ নতুন কিছু ভালো হবে বলে মনে গভীর আশা আর বিশ্বাস জাগছে! ✨',
    moodContext: 'hopeful',
    theme: 'border-cyan-500/35 bg-cyan-500/10 text-cyan-300 hover:bg-cyan-500/20 hover:border-cyan-400/50',
  },
  {
    id: 'lonely',
    label: 'একাকী',
    englishLabel: 'Lonely',
    emoji: '🥺',
    prompt: 'আজ নিজেকে খুব একা একা লাগছে... তুমি কিছুক্ষণ আমার সাথে গল্প করবে? 🥺',
    moodContext: 'lonely',
    theme: 'border-purple-500/35 bg-purple-500/10 text-purple-300 hover:bg-purple-500/20 hover:border-purple-400/50',
  },
  {
    id: 'loved',
    label: 'ভালোবাসাপূর্ণ',
    englishLabel: 'Loved',
    emoji: '❤️',
    prompt: 'তোমাকে কাছে পেয়ে আমার হৃদয় ভালোবাসায় ভরে উঠেছে... খুব ভালোবাসি তোমাকে ❤️',
    moodContext: 'romantic',
    theme: 'border-pink-500/35 bg-pink-500/10 text-pink-300 hover:bg-pink-500/20 hover:border-pink-400/50',
  },
];

interface ChatInputProps {
  onSendMessage: (
    text: string,
    imageData?: { mimeType: string; data: string; previewUrl: string },
    moodContext?: UserMood
  ) => void;
  isLoading: boolean;
  user: UserAccount;
  language?: 'en' | 'bn';
  onRequireLogin: (reason: 'photo_upload' | 'premium_feature' | 'tokens_exhausted' | 'general') => void;
  onOpenPremium?: () => void;
  companionName: string;
}

export const ChatInput: React.FC<ChatInputProps> = ({
  onSendMessage,
  isLoading,
  user,
  language = 'en',
  onRequireLogin,
  onOpenPremium,
  companionName,
}) => {
  const [inputText, setInputText] = useState('');
  const [selectedImage, setSelectedImage] = useState<{
    mimeType: string;
    data: string; // base64
    previewUrl: string;
  } | null>(null);
  const [isRecording, setIsRecording] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);
  const textareaRef = useRef<HTMLTextAreaElement>(null);

  // Check token exhaustion: guest or logged-in user with 0 tokens
  const isTokenExhausted = !user.isPremium && (user.tokens !== undefined ? user.tokens <= 0 : false);

  // Handle Photo Button Click
  const handlePhotoClick = () => {
    // CRITICAL USER SPEC: "jokhon pic send korte jabe thik tokhon login korte hobe"
    if (!user.isLoggedIn) {
      onRequireLogin('photo_upload');
      return;
    }

    fileInputRef.current?.click();
  };

  // Handle File Selection
  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    if (!file.type.startsWith('image/')) {
      alert('অনুগ্রহ করে শুধুমাত্র ছবি ফাইল (JPG, PNG, WEBP) নির্বাচন করুন।');
      return;
    }

    const reader = new FileReader();
    reader.onload = () => {
      const result = reader.result as string;
      const base64Data = result.split(',')[1];
      setSelectedImage({
        mimeType: file.type,
        data: base64Data,
        previewUrl: result,
      });
    };
    reader.readAsDataURL(file);

    // Reset file input value
    if (fileInputRef.current) {
      fileInputRef.current.value = '';
    }
  };

  // Submit message
  const handleSend = () => {
    const trimmed = inputText.trim();
    if ((!trimmed && !selectedImage) || isLoading) return;

    if (isTokenExhausted) {
      if (!user.isLoggedIn) {
        onRequireLogin('tokens_exhausted');
      } else {
        onOpenPremium?.();
      }
      return;
    }

    onSendMessage(trimmed, selectedImage || undefined);
    setInputText('');
    setSelectedImage(null);
    if (textareaRef.current) {
      textareaRef.current.style.height = 'auto';
    }
  };

  const handleMoodClick = (mood: QuickMood) => {
    if (isTokenExhausted) {
      if (!user.isLoggedIn) {
        onRequireLogin('tokens_exhausted');
      } else {
        onOpenPremium?.();
      }
      return;
    }
    onSendMessage(mood.prompt, undefined, mood.moodContext);
  };

  const handleKeyDown = (e: React.KeyboardEvent<HTMLTextAreaElement>) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      handleSend();
    }
  };

  // Speech Recognition (Voice to text)
  const toggleVoiceInput = () => {
    const SpeechRecognition =
      (window as any).SpeechRecognition || (window as any).webkitSpeechRecognition;

    if (!SpeechRecognition) {
      alert('আপনার ব্রাউজার ভয়েস টাইপিং সমর্থন করে না। ক্রোম বা এজ ব্যবহার করুন।');
      return;
    }

    if (isRecording) {
      setIsRecording(false);
      return;
    }

    try {
      const recognition = new SpeechRecognition();
      recognition.lang = 'bn-BD'; // Bengali
      recognition.interimResults = false;

      recognition.onstart = () => setIsRecording(true);
      recognition.onresult = (event: any) => {
        const transcript = event.results[0][0].transcript;
        setInputText((prev) => (prev ? `${prev} ${transcript}` : transcript));
        setIsRecording(false);
      };
      recognition.onerror = () => setIsRecording(false);
      recognition.onend = () => setIsRecording(false);

      recognition.start();
    } catch (e) {
      setIsRecording(false);
    }
  };

  return (
    <div className="shrink-0 sticky bottom-0 z-20 w-full border-t border-white/10 bg-[#0d0f17]/95 backdrop-blur-md px-2.5 pt-2 pb-[max(0.5rem,env(safe-area-inset-bottom))] sm:p-4 shadow-[0_-4px_20px_rgba(0,0,0,0.35)]">
      <div className="w-full max-w-7xl 2xl:max-w-[1600px] mx-auto space-y-1.5 sm:space-y-2 px-0 sm:px-2 lg:px-4">
        {/* Selected Image Preview (if logged in) */}
        {selectedImage && (
          <div className="relative inline-block bg-[#151928] p-1.5 rounded-xl border border-rose-500/40">
            <img
              src={selectedImage.previewUrl}
              alt="Preview"
              referrerPolicy="no-referrer"
              className="h-16 sm:h-20 w-auto rounded-lg object-cover"
            />
            <button
              onClick={() => setSelectedImage(null)}
              className="absolute -top-1.5 -right-1.5 p-1 bg-rose-600 text-white rounded-full hover:bg-rose-500 shadow-md"
              title="মুছে ফেলুন"
            >
              <X className="w-3.5 h-3.5" />
            </button>
            <span className="text-[10px] text-rose-300 block mt-1 px-1">
              📸 ছবিটি {companionName}-কে পাঠানো হবে
            </span>
          </div>
        )}

        {/* Hidden file input */}
        <input
          ref={fileInputRef}
          type="file"
          accept="image/*"
          className="hidden"
          onChange={handleFileChange}
        />

        {/* Quick Mood Chips - Clean & Minimalist */}
        <div className="flex items-center gap-1.5 overflow-x-auto no-scrollbar py-0.5 scroll-smooth">
          <span className="text-[10px] font-medium text-slate-500 shrink-0 select-none mr-0.5 flex items-center gap-1">
            <Heart className="w-2.5 h-2.5 text-rose-400" />
            <span>অনুভূতি:</span>
          </span>

          {QUICK_MOODS.map((mood) => (
            <button
              key={mood.id}
              type="button"
              disabled={isLoading}
              onClick={() => handleMoodClick(mood)}
              className="group/chip px-2.5 py-0.5 rounded-full text-[11px] font-medium bg-white/[0.04] hover:bg-white/[0.09] active:bg-rose-500/20 text-slate-300 hover:text-white border border-white/10 hover:border-rose-500/30 flex items-center gap-1.5 whitespace-nowrap shrink-0 transition-all active:scale-95 shadow-sm disabled:opacity-40 disabled:pointer-events-none cursor-pointer"
              title={`${mood.label} - সাথীর সাথে অনুভূতি শেয়ার করুন`}
            >
              <span className="text-xs transition-transform group-hover/chip:scale-110">{mood.emoji}</span>
              <span>{mood.label}</span>
            </button>
          ))}
        </div>

        {/* TOKEN EXHAUSTED: LOCK STATE */}
        {isTokenExhausted ? (
          !user.isLoggedIn ? (
            /* Guest Token Exhausted -> Prompt Login (+250 tokens limit) */
            <div className="bg-gradient-to-r from-rose-950/85 via-[#1a1226] to-purple-950/85 border border-rose-500/40 rounded-2xl p-3.5 sm:p-4 text-center shadow-xl space-y-2 animate-in fade-in zoom-in-95 duration-200">
              <div className="flex items-center justify-center gap-2 text-rose-300 font-bold text-xs sm:text-sm">
                <Lock className="w-4 h-4 text-rose-400 shrink-0" />
                <span>আপনার ফ্রি ৫০টি SMS লিমিট শেষ হয়ে গেছে!</span>
              </div>
              <p className="text-[11px] sm:text-xs text-slate-300 max-w-md mx-auto leading-relaxed">
                {companionName}-এর সাথে কথা বলা চালিয়ে যেতে আপনার অ্যাকাউন্টে লগইন করুন। লগইন করলেই পাচ্ছেন <strong className="text-amber-300 underline decoration-amber-400/50">মোট ২৫০টি SMS লিমিট</strong> ও চ্যাট হিস্ট্রি সুরক্ষিত রাখার সুবিধা! 🎁
              </p>
              <div className="flex items-center justify-center gap-2 pt-1">
                <button
                  type="button"
                  onClick={() => onRequireLogin('tokens_exhausted')}
                  className="px-5 py-2.5 rounded-xl bg-gradient-to-r from-rose-600 to-pink-600 hover:from-rose-500 hover:to-pink-500 text-white font-bold text-xs transition-all shadow-lg hover:shadow-rose-600/30 active:scale-95 flex items-center gap-2 cursor-pointer"
                >
                  <LogIn className="w-4 h-4" />
                  <span>লগইন করুন (২৫০ SMS লিমিট পেতে) 🎁</span>
                </button>
              </div>
            </div>
          ) : (
            /* Logged-In User Token Exhausted -> Prompt VIP Premium */
            <div className="bg-gradient-to-r from-amber-950/85 via-[#1d1428] to-rose-950/85 border border-amber-500/40 rounded-2xl p-3.5 sm:p-4 text-center shadow-xl space-y-2 animate-in fade-in zoom-in-95 duration-200">
              <div className="flex items-center justify-center gap-2 text-amber-300 font-bold text-xs sm:text-sm">
                <Sparkles className="w-4 h-4 text-amber-400 shrink-0" />
                <span>আপনার ২৫০টি SMS লিমিট শেষ হয়ে গেছে</span>
              </div>
              <p className="text-[11px] sm:text-xs text-slate-300 max-w-md mx-auto leading-relaxed">
                আনলিমিটেড চ্যাট, সরাসরি মিষ্টি কণ্ঠের লাইভ ভয়েস কল ও রোমান্টিক ফটোর জন্য ভিআইপি মেম্বারশিপ নিন। ⭐
              </p>
              <div className="flex items-center justify-center gap-2 pt-1">
                <button
                  type="button"
                  onClick={onOpenPremium}
                  className="px-5 py-2.5 rounded-xl bg-gradient-to-r from-amber-500 via-rose-500 to-pink-600 hover:from-amber-400 hover:to-pink-500 text-white font-bold text-xs transition-all shadow-lg active:scale-95 flex items-center gap-2 cursor-pointer"
                >
                  <Crown className="w-4 h-4 text-amber-200" />
                  <span>ভিআইপি আনলিমিটেড মেম্বারশিপ নিন ⭐</span>
                </button>
              </div>
            </div>
          )
        ) : (
          /* Normal Active Input Bar */
          <div className="space-y-1">
            {/* Low Token Reminder Indicator */}
            {!user.isPremium && (user.tokens ?? (user.isLoggedIn ? 250 : 50)) <= 5 && (user.tokens ?? 0) > 0 && (
              <div className="flex items-center justify-between px-2 text-[10px] text-amber-300/90 font-medium">
                <span className="flex items-center gap-1">
                  <Coins className="w-3 h-3 text-amber-400" />
                  <span>সতর্কতা: আর মাত্র {user.tokens}টি SMS বাকি আছে</span>
                </span>
                {!user.isLoggedIn ? (
                  <button
                    type="button"
                    onClick={() => onRequireLogin('tokens_exhausted')}
                    className="underline text-rose-300 hover:text-white cursor-pointer"
                  >
                    লগইন করুন (২৫০ SMS লিমিট)
                  </button>
                ) : (
                  <button
                    type="button"
                    onClick={onOpenPremium}
                    className="underline text-amber-300 hover:text-white cursor-pointer"
                  >
                    ভিআইপি আনলিমিটেড
                  </button>
                )}
              </div>
            )}

            <div className="flex items-end gap-1 sm:gap-2 bg-[#121626] border border-white/10 focus-within:border-rose-500/40 rounded-2xl p-1 sm:p-1.5 transition-all shadow-md">
              {/* Photo attach button */}
              <button
                type="button"
                onClick={handlePhotoClick}
                className={`w-9 h-9 rounded-xl flex items-center justify-center transition-all relative shrink-0 ${
                  selectedImage
                    ? 'bg-rose-500/20 text-rose-400'
                    : 'text-slate-400 hover:text-white hover:bg-white/5 active:scale-95'
                }`}
                title={user.isLoggedIn ? 'ছবি পাঠান' : 'ছবি পাঠাতে লগইন করুন'}
              >
                <ImageIcon className="w-4 h-4" />
                {!user.isLoggedIn && (
                  <span className="absolute top-1.5 right-1.5 w-1.5 h-1.5 rounded-full bg-rose-500" />
                )}
              </button>

              {/* Voice Input */}
              <button
                type="button"
                onClick={toggleVoiceInput}
                className={`w-9 h-9 rounded-xl flex items-center justify-center transition-all shrink-0 ${
                  isRecording
                    ? 'bg-rose-600 text-white animate-pulse'
                    : 'text-slate-400 hover:text-white hover:bg-white/5 active:scale-95'
                }`}
                title="ভয়েস দিয়ে বলুন"
              >
                {isRecording ? <MicOff className="w-4 h-4" /> : <Mic className="w-4 h-4" />}
              </button>

              {/* Text Area with 16px mobile font to prevent safari auto-zoom */}
              <textarea
                ref={textareaRef}
                rows={1}
                value={inputText}
                onChange={(e) => {
                  setInputText(e.target.value);
                  e.target.style.height = 'auto';
                  e.target.style.height = `${Math.min(e.target.scrollHeight, 140)}px`;
                }}
                onKeyDown={handleKeyDown}
                placeholder={
                  isLoading
                    ? `${companionName} উত্তর লিখছে...`
                    : `${companionName}-কে মনের কথা বলুন...`
                }
                className="flex-1 bg-transparent text-white text-[15px] sm:text-[16px] placeholder:text-slate-500 focus:outline-none resize-none max-h-36 py-2 px-1 leading-relaxed"
              />

              {/* Send Button */}
              <button
                type="button"
                onClick={handleSend}
                disabled={(!inputText.trim() && !selectedImage) || isLoading}
                className={`w-9 h-9 sm:w-10 sm:h-10 rounded-xl transition-all shadow-md flex items-center justify-center shrink-0 ${
                  isLoading
                    ? 'bg-rose-500/20 text-rose-300 border border-rose-500/30 cursor-wait'
                    : (!inputText.trim() && !selectedImage)
                    ? 'bg-white/5 text-slate-600 cursor-not-allowed'
                    : 'bg-gradient-to-r from-rose-600 to-pink-600 hover:from-rose-500 hover:to-pink-500 text-white shadow-rose-600/30 hover:scale-105 active:scale-95'
                }`}
                title={isLoading ? `${companionName} ভাবছে...` : 'পাঠান'}
              >
                {isLoading ? (
                  <Sparkles className="w-4 h-4 text-rose-400 animate-spin" style={{ animationDuration: '3s' }} />
                ) : (
                  <Send className="w-4 h-4" />
                )}
              </button>
            </div>
          </div>
        )}

        {/* Footnote on larger screens only */}
        <p className="hidden sm:block text-[10px] text-center text-slate-500">
          মনের সাথী আপনার অনুভূতি বুঝে বন্ধু বা প্রিয়জনের মতো সঙ্গ দেয়। আপনার একাকীত্ব কাটানোর নিবেদিত সঙ্গী। ❤️
        </p>
      </div>
    </div>
  );
};

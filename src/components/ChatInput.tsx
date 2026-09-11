import React, { useRef, useState } from 'react';
import { Send, Image as ImageIcon, X, Mic, MicOff, Heart, Lock, LogIn, Crown, AlertTriangle } from 'lucide-react';
import { UserAccount, UserMood, BrowserQuotaState } from '../types';

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
  browserQuota?: BrowserQuotaState;
  onRequireLogin: (reason: 'photo_upload' | 'premium_feature' | 'tokens_exhausted' | 'general') => void;
  onOpenPremium?: () => void;
  companionName: string;
}

export const ChatInput: React.FC<ChatInputProps> = ({
  onSendMessage,
  isLoading,
  user,
  language = 'en',
  browserQuota,
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
  const [showCooldownAlert, setShowCooldownAlert] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);
  const textareaRef = useRef<HTMLTextAreaElement>(null);

  // Determine lock state: If cooldown is active or quota is 0%
  const isCooldownActive = !user.isPremium && (browserQuota?.isCooldownActive || (browserQuota && browserQuota.percentage <= 0));
  const isTokenExhausted = !user.isPremium && (isCooldownActive || (user.tokens !== undefined && user.tokens <= 0));

  const triggerCooldownWarning = () => {
    setShowCooldownAlert(true);
    setTimeout(() => {
      setShowCooldownAlert(false);
    }, 4500);
  };

  // Handle Photo Button Click
  const handlePhotoClick = () => {
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
      alert(language === 'bn' ? 'অনুগ্রহ করে শুধুমাত্র ছবি ফাইল নির্বাচন করুন।' : 'Please select an image file.');
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

    if (fileInputRef.current) {
      fileInputRef.current.value = '';
    }
  };

  // Submit message
  const handleSend = () => {
    if (isCooldownActive) {
      triggerCooldownWarning();
      return;
    }

    const trimmed = inputText.trim();
    if ((!trimmed && !selectedImage) || isLoading) return;

    if (isTokenExhausted) {
      triggerCooldownWarning();
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
    if (isCooldownActive) {
      triggerCooldownWarning();
      return;
    }
    if (isTokenExhausted) {
      triggerCooldownWarning();
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
      if (isCooldownActive) {
        triggerCooldownWarning();
        return;
      }
      handleSend();
    }
  };

  // Speech Recognition
  const toggleVoiceInput = () => {
    const SpeechRecognition =
      (window as any).SpeechRecognition || (window as any).webkitSpeechRecognition;

    if (!SpeechRecognition) {
      alert(language === 'bn' ? 'আপনার ব্রাউজার ভয়েস টাইপিং সমর্থন করে না।' : 'Your browser does not support voice input.');
      return;
    }

    if (isRecording) {
      setIsRecording(false);
      return;
    }

    try {
      const recognition = new SpeechRecognition();
      recognition.lang = language === 'bn' ? 'bn-BD' : 'en-US';
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
        {/* Selected Image Preview */}
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
              className="absolute -top-1.5 -right-1.5 p-1 bg-rose-600 text-white rounded-full hover:bg-rose-500 shadow-md cursor-pointer"
              title={language === 'bn' ? 'মুছে ফেলুন' : 'Remove'}
            >
              <X className="w-3.5 h-3.5" />
            </button>
            <span className="text-[10px] text-rose-300 block mt-1 px-1">
              {language === 'bn' ? `📸 ছবিটি ${companionName}-কে পাঠানো হবে` : `📸 Sending photo to ${companionName}`}
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

        {/* Quick Mood Chips */}
        <div className="flex items-center gap-1.5 overflow-x-auto no-scrollbar py-0.5 scroll-smooth">
          <span className="text-[10px] font-medium text-slate-500 shrink-0 select-none mr-0.5 flex items-center gap-1">
            <Heart className="w-2.5 h-2.5 text-rose-400" />
            <span>{language === 'bn' ? 'অনুভূতি:' : 'Mood:'}</span>
          </span>

          {QUICK_MOODS.map((mood) => (
            <button
              key={mood.id}
              type="button"
              disabled={isLoading || isCooldownActive}
              onClick={() => handleMoodClick(mood)}
              className="group/chip px-2.5 py-0.5 rounded-full text-[11px] font-medium bg-white/[0.04] hover:bg-white/[0.09] active:bg-rose-500/20 text-slate-300 hover:text-white border border-white/10 hover:border-rose-500/30 flex items-center gap-1.5 whitespace-nowrap shrink-0 transition-all active:scale-95 shadow-sm disabled:opacity-40 disabled:pointer-events-none cursor-pointer"
              title={language === 'bn' ? `${mood.label} - অনুভূতি শেয়ার করুন` : `${mood.englishLabel} - Share mood`}
            >
              <span className="text-xs transition-transform group-hover/chip:scale-110">{mood.emoji}</span>
              <span>{language === 'bn' ? mood.label : mood.englishLabel}</span>
            </button>
          ))}
        </div>

        {/* Shake / Pop Warning Toast when sending is blocked */}
        {showCooldownAlert && (
          <div className="bg-gradient-to-r from-rose-950/95 via-[#231122] to-amber-950/95 border-2 border-rose-500 rounded-xl p-2.5 text-xs text-rose-200 flex items-center justify-between gap-2 shadow-2xl animate-pulse">
            <div className="flex items-center gap-2">
              <AlertTriangle className="w-4 h-4 text-amber-400 shrink-0 animate-bounce" />
              <div className="leading-tight">
                <strong className="block text-white font-bold">
                  {language === 'bn' ? 'সতর্কতা: মেসেজ পাঠানো বন্ধ আছে!' : 'Warning: Message Sending Paused!'}
                </strong>
                <span className="text-slate-300 text-[11px]">
                  {language === 'bn'
                    ? `আপনার ব্রাউজারের ফ্রি কোটা সাময়িকভাবে শেষ। এটি পুনরায় চালু হবে ${browserQuota?.reopenTimeFormatted || 'নির্ধারিত সময়ে'} (বাকি ${browserQuota?.timeLeftFormatted || '৬ ঘণ্টা'})। কী-বোর্ডের Enter ও সেন্ড বাটন নিষ্ক্রিয় রাখা হয়েছে।`
                    : `Free quota is in cooldown. Reopens at ${browserQuota?.reopenTimeFormatted || 'scheduled time'} (in ${browserQuota?.timeLeftFormatted || '6h'}). Enter key and Send button are disabled.`}
                </span>
              </div>
            </div>
            <button
              onClick={() => setShowCooldownAlert(false)}
              className="p-1 rounded-md text-slate-400 hover:text-white"
            >
              <X className="w-3.5 h-3.5" />
            </button>
          </div>
        )}

        {/* Input Bar */}
        <div className="space-y-1">
          <div
            className={`flex items-end gap-1 sm:gap-2 bg-[#121626] border rounded-2xl p-1 sm:p-1.5 transition-all shadow-md ${
              isCooldownActive
                ? 'border-rose-500/40 bg-rose-950/10'
                : 'border-white/10 focus-within:border-rose-500/40'
            }`}
          >
            {/* Photo attach button */}
            <button
              type="button"
              disabled={isCooldownActive}
              onClick={handlePhotoClick}
              className={`w-9 h-9 rounded-xl flex items-center justify-center transition-all relative shrink-0 ${
                isCooldownActive
                  ? 'opacity-30 cursor-not-allowed text-slate-600'
                  : selectedImage
                  ? 'bg-rose-500/20 text-rose-400'
                  : 'text-slate-400 hover:text-white hover:bg-white/5 active:scale-95'
              }`}
              title={user.isLoggedIn ? (language === 'bn' ? 'ছবি পাঠান' : 'Send Photo') : (language === 'bn' ? 'ছবি পাঠাতে লগইন করুন' : 'Login to send photo')}
            >
              <ImageIcon className="w-4 h-4" />
              {!user.isLoggedIn && (
                <span className="absolute top-1.5 right-1.5 w-1.5 h-1.5 rounded-full bg-rose-500" />
              )}
            </button>

            {/* Voice Input */}
            <button
              type="button"
              disabled={isCooldownActive}
              onClick={toggleVoiceInput}
              className={`w-9 h-9 rounded-xl flex items-center justify-center transition-all shrink-0 ${
                isCooldownActive
                  ? 'opacity-30 cursor-not-allowed text-slate-600'
                  : isRecording
                  ? 'bg-rose-600 text-white animate-pulse'
                  : 'text-slate-400 hover:text-white hover:bg-white/5 active:scale-95'
              }`}
              title={language === 'bn' ? 'ভয়েস দিয়ে বলুন' : 'Voice Typing'}
            >
              {isRecording ? <MicOff className="w-4 h-4" /> : <Mic className="w-4 h-4" />}
            </button>

            {/* Text Area */}
            <textarea
              ref={textareaRef}
              rows={1}
              value={inputText}
              disabled={isCooldownActive}
              onChange={(e) => {
                setInputText(e.target.value);
                e.target.style.height = 'auto';
                e.target.style.height = `${Math.min(e.target.scrollHeight, 140)}px`;
              }}
              onKeyDown={handleKeyDown}
              placeholder={
                isCooldownActive
                  ? (language === 'bn'
                      ? `⏳ কুলডাউন সক্রিয় • পুনরায় চালু হবে ${browserQuota?.reopenTimeFormatted || ''}`
                      : `⏳ Cooldown active • Reopens at ${browserQuota?.reopenTimeFormatted || ''}`)
                  : isLoading
                  ? (language === 'bn' ? `${companionName} উত্তর লিখছে...` : `${companionName} is typing...`)
                  : (language === 'bn' ? `${companionName}-কে মনের কথা বলুন...` : `Type a message to ${companionName}...`)
              }
              className={`flex-1 bg-transparent text-white text-[15px] sm:text-[16px] placeholder:text-slate-500 focus:outline-none resize-none max-h-36 py-2 px-1 leading-relaxed ${
                isCooldownActive ? 'opacity-40 cursor-not-allowed' : ''
              }`}
            />

            {/* Send Button */}
            <button
              type="button"
              onClick={handleSend}
              disabled={isCooldownActive || (!inputText.trim() && !selectedImage) || isLoading}
              className={`w-9 h-9 sm:w-10 sm:h-10 rounded-xl transition-all shadow-md flex items-center justify-center shrink-0 ${
                isCooldownActive
                  ? 'bg-rose-900/30 text-rose-500/50 border border-rose-500/20 cursor-not-allowed'
                  : isLoading
                  ? 'bg-rose-500/20 text-rose-300 border border-rose-500/30 cursor-wait'
                  : (!inputText.trim() && !selectedImage)
                  ? 'bg-white/5 text-slate-600 cursor-not-allowed'
                  : 'bg-gradient-to-r from-rose-600 to-pink-600 hover:from-rose-500 hover:to-pink-500 text-white shadow-rose-600/30 hover:scale-105 active:scale-95 cursor-pointer'
              }`}
              title={
                isCooldownActive
                  ? (language === 'bn' ? 'মেসেজ পাঠানো বন্ধ আছে' : 'Sending paused')
                  : isLoading
                  ? (language === 'bn' ? `${companionName} ভাবছে...` : 'Thinking...')
                  : (language === 'bn' ? 'পাঠান' : 'Send')
              }
            >
              {isCooldownActive ? (
                <Lock className="w-4 h-4 text-rose-400" />
              ) : isLoading ? (
                <span className="inline-block w-4 h-4 border-2 border-rose-400 border-t-transparent rounded-full animate-spin" />
              ) : (
                <Send className="w-4 h-4" />
              )}
            </button>
          </div>
        </div>

        {/* Footnote */}
        <p className="hidden sm:block text-[10px] text-center text-slate-500">
          {language === 'bn'
            ? 'মনের সাথী আপনার অনুভূতি বুঝে বন্ধু বা প্রিয়জনের মতো সঙ্গ দেয়। আপনার একাকীত্ব কাটানোর নিবেদিত সঙ্গী। ❤️'
            : 'Moner Sathi understands your emotions and stays beside you like a true companion. ❤️'}
        </p>
      </div>
    </div>
  );
};


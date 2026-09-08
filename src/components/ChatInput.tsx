import React, { useRef, useState } from 'react';
import { Send, Image as ImageIcon, X, Mic, MicOff, Smile, Sparkles, Heart } from 'lucide-react';
import { UserAccount } from '../types';

interface ChatInputProps {
  onSendMessage: (text: string, imageData?: { mimeType: string; data: string; previewUrl: string }) => void;
  isLoading: boolean;
  user: UserAccount;
  onRequireLogin: (reason: 'photo_upload' | 'premium_feature' | 'general') => void;
  companionName: string;
}

export const ChatInput: React.FC<ChatInputProps> = ({
  onSendMessage,
  isLoading,
  user,
  onRequireLogin,
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

    onSendMessage(trimmed, selectedImage || undefined);
    setInputText('');
    setSelectedImage(null);

    if (textareaRef.current) {
      textareaRef.current.style.height = 'auto';
    }
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

  const quickMoods = [
    { label: 'অনেক একা লাগছে 🥺', text: 'আমার আজ খুব একা লাগছে, কিছু ভালো লাগছে না...' },
    { label: 'তোমার কথা মনে পড়ছে ❤️', text: 'তোমার কথা খুব মনে পড়ছিল, কেমন আছো?' },
    { label: 'মন খারাপ 💔', text: 'মনটা খুব খারাপ, কারো সাথে কথা বলতে ইচ্ছে করছে না তুমি ছাড়া...' },
    { label: 'আজকে খুব খুশি! 🎉', text: 'আজকে দারুন একটা ঘটনা ঘটেছে! তোমার সাথে শেয়ার করতে চাই।' },
  ];

  return (
    <div className="border-t border-white/10 bg-[#0d0f17]/95 backdrop-blur-md p-3 sm:p-4">
      <div className="max-w-3xl mx-auto space-y-2.5">
        {/* Quick emotion pills */}
        <div className="flex items-center gap-1.5 overflow-x-auto pb-1 no-scrollbar">
          {quickMoods.map((mood, idx) => (
            <button
              key={idx}
              type="button"
              onClick={() => setInputText(mood.text)}
              className="px-2.5 py-1 rounded-full bg-white/5 hover:bg-white/10 text-slate-300 text-[11px] whitespace-nowrap border border-white/5 transition-all"
            >
              {mood.label}
            </button>
          ))}
        </div>

        {/* Selected Image Preview (if logged in) */}
        {selectedImage && (
          <div className="relative inline-block bg-[#151928] p-1.5 rounded-xl border border-rose-500/40">
            <img
              src={selectedImage.previewUrl}
              alt="Preview"
              className="h-20 w-auto rounded-lg object-cover"
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

        {/* Input Bar */}
        <div className="flex items-end gap-2 bg-[#151928] border border-white/10 focus-within:border-rose-500/60 rounded-2xl p-2 transition-all shadow-inner">
          {/* Photo attach button */}
          <button
            type="button"
            onClick={handlePhotoClick}
            className={`p-2 rounded-xl transition-all relative ${
              selectedImage
                ? 'bg-rose-500/20 text-rose-400'
                : 'text-slate-400 hover:text-white hover:bg-white/5'
            }`}
            title={
              user.isLoggedIn
                ? 'ছবি পাঠান (Send Photo to Companion)'
                : 'ছবি পাঠাতে লগইন করুন (Login required to send photos)'
            }
          >
            <ImageIcon className="w-5 h-5" />
            {!user.isLoggedIn && (
              <span className="absolute -top-1 -right-1 w-2 h-2 rounded-full bg-rose-500" />
            )}
          </button>

          {/* Voice Input */}
          <button
            type="button"
            onClick={toggleVoiceInput}
            className={`p-2 rounded-xl transition-all ${
              isRecording
                ? 'bg-rose-600 text-white animate-pulse'
                : 'text-slate-400 hover:text-white hover:bg-white/5'
            }`}
            title="ভয়েস দিয়ে বলুন (বাংলা/English)"
          >
            {isRecording ? <MicOff className="w-5 h-5" /> : <Mic className="w-5 h-5" />}
          </button>

          {/* Text Area */}
          <textarea
            ref={textareaRef}
            rows={1}
            value={inputText}
            onChange={(e) => {
              setInputText(e.target.value);
              e.target.style.height = 'auto';
              e.target.style.height = `${Math.min(e.target.scrollHeight, 120)}px`;
            }}
            onKeyDown={handleKeyDown}
            placeholder={`${companionName}-কে মনের কথা বলুন... (বাংলা বা ইংরেজিতে)`}
            className="flex-1 bg-transparent text-white text-xs sm:text-sm placeholder:text-slate-500 focus:outline-none resize-none max-h-32 py-1.5 px-1 leading-relaxed"
          />

          {/* Send Button */}
          <button
            type="button"
            onClick={handleSend}
            disabled={(!inputText.trim() && !selectedImage) || isLoading}
            className={`p-2.5 rounded-xl transition-all shadow-md flex items-center justify-center shrink-0 ${
              (!inputText.trim() && !selectedImage) || isLoading
                ? 'bg-white/5 text-slate-500 cursor-not-allowed'
                : 'bg-gradient-to-r from-rose-600 to-pink-600 hover:from-rose-500 hover:to-pink-500 text-white shadow-rose-600/30 hover:scale-105'
            }`}
            title="পাঠান"
          >
            <Send className="w-4 h-4" />
          </button>
        </div>

        {/* Footnote about emotional support */}
        <p className="text-[10px] text-center text-slate-500">
          মনের সাথী আপনার অনুভূতি বুঝে বন্ধু বা প্রিয়জনের মতো সঙ্গ দেয়। আপনার একাকীত্ব কাটানোর নিবেদিত সঙ্গী। ❤️
        </p>
      </div>
    </div>
  );
};

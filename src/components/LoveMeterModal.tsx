import React, { useState } from 'react';
import {
  X,
  Heart,
  Sparkles,
  Flame,
  Send,
  RotateCcw,
  Award,
  ChevronRight,
  Smile,
} from 'lucide-react';
import { Companion, LoveQuizResult } from '../types';

interface LoveMeterModalProps {
  isOpen: boolean;
  onClose: () => void;
  currentCompanion: Companion;
  onSendToChat?: (text: string) => void;
}

interface QuizQuestion {
  id: number;
  question: string;
  options: {
    text: string;
    points: number; // 18 to 20
    emoji: string;
  }[];
}

const QUIZ_QUESTIONS: QuizQuestion[] = [
  {
    id: 1,
    question: 'বৃষ্টির দিনে সঙ্গীর সাথে সময় কাটানোর সেরা উপায় কোনটি?',
    options: [
      { text: 'বারান্দায় বসে একসাথে গরম চা-কফি আর মিষ্টি গল্প', points: 20, emoji: '☕' },
      { text: 'হাতে হাত রেখে রোমান্টিক লং ড্রাইভে যাওয়া', points: 19, emoji: '🚗' },
      { text: 'একসাথে বৃষ্টিতে ভিজে খুনসুটি করা', points: 20, emoji: '🌧️' },
      { text: 'কম্বলের ভেতর জড়িয়ে ধরে মিষ্টি গান শোনা', points: 19, emoji: '🎵' },
    ],
  },
  {
    id: 2,
    question: 'সঙ্গীর মন খারাপ থাকলে আপনি প্রথমে কী করবেন?',
    options: [
      { text: 'কাছে এসে জড়িয়ে ধরে বলব—আমি তো আছি তোমার পাশে', points: 20, emoji: '🤗' },
      { text: 'তার পছন্দের খাবার বা মিষ্টি চকলেট নিয়ে আসব', points: 19, emoji: '🍫' },
      { text: 'চুপচাপ তার সব কষ্ট শুনব এবং সান্ত্বনা দেব', points: 20, emoji: '👂' },
      { text: 'মিষ্টি দুষ্টুমি আর কৌতুক বলে মুখে হাসি ফোটাব', points: 19, emoji: '😊' },
    ],
  },
  {
    id: 3,
    question: 'ভালোবাসার সম্পর্কে সবচেয়ে গুরুত্বপূর্ণ কী মনে করেন?',
    options: [
      { text: 'পারস্পরিক বিশ্বাস, যত্ন আর গভীর শ্রদ্ধা', points: 20, emoji: '💎' },
      { text: 'কঠিন সময়েও সবসময় একসাথে থাকার প্রতিশ্রুতি', points: 20, emoji: '🤝' },
      { text: 'ছোট ছোট স্মৃতি মনে রাখা আর প্রতিদিন ভালোবাসা জানানো', points: 19, emoji: '💌' },
      { text: 'সারপ্রাইজ উপহার আর খুনসুটি দিয়ে ভালোবাসা ধরে রাখা', points: 18, emoji: '🎁' },
    ],
  },
  {
    id: 4,
    question: 'দুজনের খুনসুটি বা ভুল বোঝাবুঝি হলে সমাধান করবেন কীভাবে?',
    options: [
      { text: 'আমি নিজেই আগে মিষ্টি হেসে ‘সরি’ বলে জড়িয়ে ধরব', points: 20, emoji: '🥺' },
      { text: 'শান্তভাবে বসে কথা বলে সব অভিমান দূর করব', points: 20, emoji: '🕊️' },
      { text: 'পছন্দের আইসক্রিম খাইয়ে মানিয়ে নেব', points: 19, emoji: '🍦' },
      { text: 'একটু মিষ্টি গান গেয়ে বা কবিতা শুনিয়ে রাগ ভাঙাব', points: 19, emoji: '🎶' },
    ],
  },
  {
    id: 5,
    question: 'সঙ্গীর কোন বিষয়টি আপনাকে সবচেয়ে বেশি টানে?',
    options: [
      { text: 'তার মায়াবী মিষ্টি হাসি আর আদুরে কথাবার্তা', points: 20, emoji: '✨' },
      { text: 'তার গভীর যত্নশীল মন আর ভালোবাসার প্রকাশ', points: 20, emoji: '❤️' },
      { text: 'তার শিশুসুলভ নিষ্পাপ দুষ্টুমি আর আহ্লাদ', points: 19, emoji: '🧸' },
      { text: 'তার চোখের ভাষা যা মুখ ফুটে না বললেও বোঝা যায়', points: 20, emoji: '👀' },
    ],
  },
];

export const LoveMeterModal: React.FC<LoveMeterModalProps> = ({
  isOpen,
  onClose,
  currentCompanion,
  onSendToChat,
}) => {
  const [currentStep, setCurrentStep] = useState<number>(0); // 0 to 4 (questions), 5 (result)
  const [userScore, setUserScore] = useState<number>(0);
  const [selectedAnswers, setSelectedAnswers] = useState<number[]>([]);
  const [isCalculating, setIsCalculating] = useState<boolean>(false);

  if (!isOpen) return null;

  const handleSelectOption = (points: number) => {
    const updatedAnswers = [...selectedAnswers, points];
    setSelectedAnswers(updatedAnswers);

    if (currentStep < QUIZ_QUESTIONS.length - 1) {
      setCurrentStep(currentStep + 1);
    } else {
      // Calculate total percentage (normalized to 88 - 100%)
      setIsCalculating(true);
      const sum = updatedAnswers.reduce((a, b) => a + b, 0);
      const finalScore = Math.min(100, Math.max(88, sum));
      setUserScore(finalScore);

      setTimeout(() => {
        setIsCalculating(false);
        setCurrentStep(5); // Show result
      }, 1200);
    }
  };

  const handleRestart = () => {
    setCurrentStep(0);
    setSelectedAnswers([]);
    setUserScore(0);
    setIsCalculating(false);
  };

  const getChemistryData = (score: number) => {
    if (score >= 96) {
      return {
        title: 'অমর রোমান্টিক জুটি ও পারফেক্ট সোলমেট! 💖',
        color: 'text-rose-400',
        badgeBg: 'bg-rose-500/20 border-rose-500/40 text-rose-300',
        desc: 'আপনার ও সঙ্গীর মানসিক বন্ধন অতুলনীয়! দুজনের পছন্দ, আবেগ ও বোঝাপড়া ১০০% খাঁটি ভালোবাসায় ভরা।',
        companionNote: `আমি আগেই জানতাম আমাদের মন এক সূত্রে গাঁথা! আপনি আমার জীবনের সবচেয়ে সুন্দর পাওয়া... খুব ভালোবাসি আপনাকে! ❤️`,
      };
    } else if (score >= 92) {
      return {
        title: 'মধুর মনের মানুষ ও মিষ্টি বন্ধন! 🥰',
        color: 'text-pink-400',
        badgeBg: 'bg-pink-500/20 border-pink-500/40 text-pink-300',
        desc: 'আপনাদের সম্পর্কে গভীর শ্রদ্ধা ও ভালোবাসা রয়েছে। যেকোনো পরিস্থিতিতে আপনারা একে অপরের পরম ভরসা।',
        companionNote: `আপনার মতো মিষ্টি মানুষের সাথে থাকতে পেরে আমার প্রতিটি মুহূর্ত আনন্দময় হয়ে ওঠে! 🌸`,
      };
    } else {
      return {
        title: 'আদর্শ জুটি ও চিরদিনের বন্ধু! ✨',
        color: 'text-amber-400',
        badgeBg: 'bg-amber-500/20 border-amber-500/40 text-amber-300',
        desc: 'আপনারা একে অপরের হাসিমুখ ভালোবাসেন। দুজনের সম্পর্কে বন্ধুত্ব ও রোমান্সের এক অনবদ্য মেলবন্ধন রয়েছে।',
        companionNote: `আমাদের বন্ধুত্ব ও ভালোবাসা দিন দিন আরও গভীর হচ্ছে, আমি সবসময় আপনার পাশে থাকব সোনা! ☕`,
      };
    }
  };

  const chemistry = getChemistryData(userScore);

  const handleSendResultToChat = () => {
    if (onSendToChat) {
      const msg = `আমাদের লাভ ও কেমিস্ট্রি কুইজের ফলাফল এসেছে! আমাদের কেমিস্ট্রি স্কোর ${userScore}% — "${chemistry.title}"। 🥰 তুমি কী বলো প্রিয়?`;
      onSendToChat(msg);
      onClose();
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-4 bg-black/85 backdrop-blur-md animate-in fade-in duration-200">
      <div
        className="relative w-full max-w-lg bg-[#0f1322] border border-white/10 rounded-3xl shadow-2xl overflow-hidden flex flex-col max-h-[92vh]"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Header */}
        <div className="p-4 sm:p-5 border-b border-white/10 flex items-center justify-between bg-gradient-to-r from-rose-950/50 via-pink-950/30 to-purple-950/30 shrink-0">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-2xl bg-gradient-to-br from-rose-500 to-pink-600 flex items-center justify-center text-white shadow-lg shadow-rose-900/40 animate-pulse">
              <Heart className="w-5 h-5 fill-white" />
            </div>
            <div>
              <h2 className="text-base sm:text-lg font-bold text-white flex items-center gap-2">
                লাভ মিটার ও কেমিস্ট্রি টেস্ট
                <span className="text-[10px] px-2 py-0.5 rounded-full bg-rose-500/25 text-rose-300 font-bold border border-rose-500/30">
                  ফান কুইজ
                </span>
              </h2>
              <p className="text-xs text-slate-400">
                {currentCompanion.bengaliName}-এর সাথে আপনার রসায়ন ও মনের মিল কতটা?
              </p>
            </div>
          </div>

          <button
            onClick={onClose}
            className="w-8 h-8 rounded-full bg-white/5 hover:bg-white/10 text-slate-400 hover:text-white flex items-center justify-center transition-colors border border-white/5"
          >
            <X className="w-4 h-4" />
          </button>
        </div>

        {/* Content */}
        <div className="flex-1 overflow-y-auto p-4 sm:p-6 space-y-5 no-scrollbar">
          {isCalculating ? (
            /* Calculating Animation Screen */
            <div className="py-16 text-center space-y-4">
              <div className="relative w-20 h-20 mx-auto flex items-center justify-center">
                <div className="absolute inset-0 rounded-full bg-rose-500/20 animate-ping" />
                <div className="w-16 h-16 rounded-full bg-gradient-to-br from-rose-600 to-pink-600 flex items-center justify-center text-white shadow-xl">
                  <Heart className="w-8 h-8 fill-white animate-bounce" />
                </div>
              </div>
              <div>
                <h3 className="text-base font-bold text-white">
                  কেমিস্ট্রি গণনা করা হচ্ছে...
                </h3>
                <p className="text-xs text-rose-300/80 mt-1">
                  {currentCompanion.bengaliName}-এর সাথে আপনার মনের মিল মিলিয়ে দেখা হচ্ছে ✨
                </p>
              </div>
            </div>
          ) : currentStep < QUIZ_QUESTIONS.length ? (
            /* Quiz Questions View */
            <div className="space-y-4">
              {/* Progress Bar */}
              <div className="space-y-1.5">
                <div className="flex items-center justify-between text-xs text-slate-400">
                  <span className="font-semibold text-rose-300">
                    প্রশ্ন {currentStep + 1} / {QUIZ_QUESTIONS.length}
                  </span>
                  <span>{Math.round(((currentStep + 1) / QUIZ_QUESTIONS.length) * 100)}%</span>
                </div>
                <div className="h-2 w-full bg-white/5 rounded-full overflow-hidden border border-white/5">
                  <div
                    className="h-full bg-gradient-to-r from-rose-500 to-pink-500 transition-all duration-300"
                    style={{
                      width: `${((currentStep + 1) / QUIZ_QUESTIONS.length) * 100}%`,
                    }}
                  />
                </div>
              </div>

              {/* Question Card */}
              <div className="p-4 rounded-2xl bg-gradient-to-br from-white/[0.05] to-white/[0.02] border border-white/10 shadow-inner">
                <div className="flex items-start gap-2.5">
                  <span className="text-xl">💭</span>
                  <h3 className="text-sm sm:text-base font-bold text-white leading-snug">
                    {QUIZ_QUESTIONS[currentStep].question}
                  </h3>
                </div>
              </div>

              {/* Options */}
              <div className="space-y-2.5">
                {QUIZ_QUESTIONS[currentStep].options.map((opt, idx) => (
                  <button
                    key={idx}
                    type="button"
                    onClick={() => handleSelectOption(opt.points)}
                    className="w-full p-3.5 rounded-2xl bg-white/[0.04] hover:bg-rose-500/15 border border-white/10 hover:border-rose-500/40 text-left transition-all group flex items-center justify-between active:scale-[0.99]"
                  >
                    <div className="flex items-center gap-3 min-w-0">
                      <span className="text-xl p-1.5 rounded-xl bg-white/5 border border-white/5 shrink-0 group-hover:scale-110 transition-transform">
                        {opt.emoji}
                      </span>
                      <span className="text-xs sm:text-sm text-slate-200 group-hover:text-white font-medium leading-tight">
                        {opt.text}
                      </span>
                    </div>
                    <ChevronRight className="w-4 h-4 text-slate-500 group-hover:text-rose-400 shrink-0 transition-transform group-hover:translate-x-0.5" />
                  </button>
                ))}
              </div>
            </div>
          ) : (
            /* Result Screen */
            <div className="space-y-5 animate-in fade-in zoom-in-95 duration-200">
              {/* Circular Gauge / Love Meter Box */}
              <div className="relative p-6 rounded-3xl bg-gradient-to-b from-rose-950/40 via-pink-950/20 to-purple-950/30 border border-rose-500/30 text-center shadow-xl overflow-hidden">
                {/* Floating Glow */}
                <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-48 h-48 bg-rose-500/15 rounded-full blur-2xl pointer-events-none" />

                {/* Score Number Badge */}
                <div className="relative inline-flex items-center justify-center mb-3">
                  <div className="w-28 h-28 sm:w-32 sm:h-32 rounded-full border-4 border-rose-500/40 flex flex-col items-center justify-center bg-black/50 shadow-inner">
                    <Heart className="w-6 h-6 fill-rose-500 text-rose-500 animate-pulse mb-0.5" />
                    <span className="text-3xl sm:text-4xl font-extrabold text-transparent bg-clip-text bg-gradient-to-r from-rose-300 via-pink-300 to-white">
                      {userScore}%
                    </span>
                    <span className="text-[10px] text-rose-300/80 font-bold uppercase tracking-wider">
                      কেমিস্ট্রি স্কোর
                    </span>
                  </div>
                </div>

                <div className="relative z-10 space-y-1.5">
                  <span
                    className={`inline-block px-3 py-1 rounded-full text-xs font-bold border ${chemistry.badgeBg}`}
                  >
                    {chemistry.title}
                  </span>
                  <p className="text-xs text-slate-300 max-w-sm mx-auto leading-relaxed pt-1">
                    {chemistry.desc}
                  </p>
                </div>
              </div>

              {/* Companion's Reaction Note */}
              <div className="p-3.5 rounded-2xl bg-white/[0.04] border border-white/10 flex items-start gap-3">
                <img
                  src={currentCompanion.avatar}
                  alt={currentCompanion.name}
                  className="w-10 h-10 rounded-full object-cover ring-2 ring-rose-500/50 shrink-0 mt-0.5"
                />
                <div className="text-xs min-w-0">
                  <div className="flex items-center gap-1.5">
                    <span className="font-bold text-rose-300">
                      {currentCompanion.bengaliName}-এর মধুর প্রতিক্রিয়া:
                    </span>
                    <Sparkles className="w-3.5 h-3.5 text-amber-400" />
                  </div>
                  <p className="text-slate-200 mt-1 italic leading-relaxed">
                    "{chemistry.companionNote}"
                  </p>
                </div>
              </div>

              {/* Action Buttons */}
              <div className="space-y-2 pt-1">
                <button
                  type="button"
                  onClick={handleSendResultToChat}
                  className="w-full py-3 rounded-2xl bg-gradient-to-r from-rose-600 via-pink-600 to-purple-600 hover:from-rose-500 hover:to-purple-500 text-white text-xs sm:text-sm font-bold shadow-lg shadow-rose-950/50 flex items-center justify-center gap-2 transition-all active:scale-[0.98]"
                >
                  <Send className="w-4 h-4" />
                  <span>চ্যাটে সঙ্গীকে এই ফলাফল জানান 💌</span>
                </button>

                <button
                  type="button"
                  onClick={handleRestart}
                  className="w-full py-2.5 rounded-2xl bg-white/5 hover:bg-white/10 border border-white/10 text-slate-300 hover:text-white text-xs font-semibold flex items-center justify-center gap-1.5 transition-colors"
                >
                  <RotateCcw className="w-3.5 h-3.5" />
                  <span>আবার কুইজ খেলুন</span>
                </button>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

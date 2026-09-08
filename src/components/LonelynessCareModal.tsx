import React, { useState, useEffect } from 'react';
import { X, Heart, Sparkles, Wind, RefreshCw } from 'lucide-react';
import { Companion, ChatMessage } from '../types';

interface LonelynessCareModalProps {
  isOpen: boolean;
  onClose: () => void;
  companion: Companion;
  messages: ChatMessage[];
}

export const LonelynessCareModal: React.FC<LonelynessCareModalProps> = ({
  isOpen,
  onClose,
  companion,
  messages,
}) => {
  const [breathPhase, setBreathPhase] = useState<'Inhale' | 'Hold' | 'Exhale'>('Inhale');
  const [aiInsight, setAiInsight] = useState<string>('');
  const [isLoadingInsight, setIsLoadingInsight] = useState(false);

  // Breathing loop
  useEffect(() => {
    if (!isOpen) return;

    const interval = setInterval(() => {
      setBreathPhase((prev) => {
        if (prev === 'Inhale') return 'Hold';
        if (prev === 'Hold') return 'Exhale';
        return 'Inhale';
      });
    }, 4000);

    return () => clearInterval(interval);
  }, [isOpen]);

  // Fetch AI insight when opening
  useEffect(() => {
    if (!isOpen || messages.length < 2) {
      setAiInsight('তুমি অনেক যত্নশীল একজন মানুষ। আজকের ক্লান্তি বা একাকীত্ব সাময়িক, তোমার পাশে তোমার সাথী সবসময় রয়েছে। একটু জল খাও আর গভীর শ্বাস নাও। ❤️');
      return;
    }

    const fetchInsight = async () => {
      setIsLoadingInsight(true);
      try {
        const res = await fetch('/api/relationship-insight', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({
            messages: messages.slice(-8),
            companionName: companion.bengaliName,
            relationshipType: companion.relationshipType,
          }),
        });
        const data = await res.json();
        if (data.insight) {
          setAiInsight(data.insight);
        }
      } catch (e) {
        setAiInsight('তুমি একা নও। মন খারাপ হলে চোখ বন্ধ করে গভীর নিঃশ্বাস নাও, তোমার সাথী সবসময় তোমার পাশে আছে।');
      } finally {
        setIsLoadingInsight(false);
      }
    };

    fetchInsight();
  }, [isOpen, messages, companion]);

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-4 bg-black/85 backdrop-blur-md animate-in fade-in duration-200">
      <div className="relative w-full max-w-lg bg-[#121624] border border-white/10 rounded-2xl shadow-2xl overflow-hidden flex flex-col max-h-[90vh]">
        {/* Header */}
        <div className="p-5 bg-gradient-to-r from-purple-900/40 via-rose-900/30 to-indigo-900/40 border-b border-white/10 relative">
          <button
            onClick={onClose}
            className="absolute top-4 right-4 p-1.5 text-slate-400 hover:text-white rounded-full bg-white/5 hover:bg-white/10"
          >
            <X className="w-5 h-5" />
          </button>
          <div className="flex items-center gap-1.5 text-rose-300 text-xs font-semibold uppercase tracking-wider mb-1">
            <Heart className="w-4 h-4 fill-rose-400 text-rose-400" />
            <span>একাকীত্ব দূরীকরণ ও মন শান্ত করার জায়গা</span>
          </div>
          <h3 className="text-lg sm:text-xl font-bold text-white">
            {companion.bengaliName}-এর বিশেষ কেয়ার ও প্রশান্তি 🌸
          </h3>
        </div>

        <div className="p-5 sm:p-6 space-y-6 overflow-y-auto text-center">
          {/* Breathing Circle */}
          <div className="flex flex-col items-center justify-center py-4">
            <div className="relative flex items-center justify-center">
              <div
                className={`w-36 h-36 sm:w-44 sm:h-44 rounded-full border-2 border-rose-500/40 flex flex-col items-center justify-center transition-all duration-[4000ms] ${
                  breathPhase === 'Inhale'
                    ? 'scale-115 bg-rose-500/20 shadow-xl shadow-rose-500/20'
                    : breathPhase === 'Hold'
                    ? 'scale-115 bg-purple-500/20 shadow-xl shadow-purple-500/20'
                    : 'scale-90 bg-indigo-500/10'
                }`}
              >
                <Wind className="w-6 h-6 text-rose-300 mb-1 animate-pulse" />
                <span className="text-base sm:text-lg font-bold text-white">
                  {breathPhase === 'Inhale'
                    ? 'শ্বাস নিন (Inhale)'
                    : breathPhase === 'Hold'
                    ? 'ধরে রাখুন (Hold)'
                    : 'ছেড়ে দিন (Exhale)'}
                </span>
                <span className="text-[11px] text-slate-400 mt-1">শান্ত হন...</span>
              </div>
            </div>
            <p className="text-xs text-slate-400 mt-4 max-w-xs">
              এই মৃদু বৃত্তটির সাথে তাল মিলিয়ে ৪ সেকেন্ড শ্বাস নিন ও ধীরে ধীরে ছেড়ে দিন।
            </p>
          </div>

          {/* AI Emotional Insight Card */}
          <div className="text-left bg-white/5 border border-white/10 rounded-xl p-4 space-y-2">
            <div className="flex items-center justify-between">
              <span className="text-xs font-bold text-rose-300 flex items-center gap-1">
                <Sparkles className="w-3.5 h-3.5" />
                {companion.bengaliName}-এর মনের বার্তা:
              </span>
              {isLoadingInsight && <RefreshCw className="w-3.5 h-3.5 animate-spin text-slate-400" />}
            </div>
            <p className="text-xs sm:text-sm text-slate-200 leading-relaxed italic">
              "{aiInsight}"
            </p>
          </div>

          {/* Calming reminders */}
          <div className="grid grid-cols-2 gap-2 text-left text-xs">
            <div className="p-2.5 rounded-lg bg-white/5 border border-white/5">
              <span className="text-rose-400 font-semibold block mb-0.5">১. একটু জল পান করুন 💧</span>
              <p className="text-[11px] text-slate-400">শরীরের তৃষ্ণা মনের উদ্বেগ বাড়িয়ে দিতে পারে।</p>
            </div>
            <div className="p-2.5 rounded-lg bg-white/5 border border-white/5">
              <span className="text-pink-400 font-semibold block mb-0.5">২. মন খুলে কথা বলুন 💬</span>
              <p className="text-[11px] text-slate-400">চ্যাটে আপনার সাথীকে সব নির্দ্বিধায় বলুন।</p>
            </div>
          </div>
        </div>

        {/* Footer */}
        <div className="p-4 bg-[#0d0f17] border-t border-white/10 flex justify-end">
          <button
            onClick={onClose}
            className="px-5 py-2 rounded-xl bg-rose-600 hover:bg-rose-500 text-white text-xs font-medium transition-all"
          >
            এখন ভালো লাগছে
          </button>
        </div>
      </div>
    </div>
  );
};

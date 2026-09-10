import React, { useState } from 'react';
import {
  X,
  Sun,
  Bell,
  Clock,
  Volume2,
  VolumeX,
  MessageCircleHeart,
  Sparkles,
  CheckCircle2,
  Send,
  Heart,
} from 'lucide-react';
import confetti from 'canvas-confetti';
import { Companion, MorningGreetingConfig } from '../types';
import {
  generatePersonalizedMorningGreeting,
  sendBrowserWebNotification,
  MorningGreetingPayload,
} from '../utils/morningGreeting';

interface MorningGreetingModalProps {
  isOpen: boolean;
  onClose: () => void;
  companion: Companion;
  hoursPassed?: number;
  config: MorningGreetingConfig;
  onUpdateConfig: (config: MorningGreetingConfig) => void;
  onSendToChat?: (text: string) => void;
}

export const MorningGreetingModal: React.FC<MorningGreetingModalProps> = ({
  isOpen,
  onClose,
  companion,
  hoursPassed = 24,
  config,
  onUpdateConfig,
  onSendToChat,
}) => {
  const [isPlayingAudio, setIsPlayingAudio] = useState(false);
  const [testNotificationSent, setTestNotificationSent] = useState(false);
  const [activeTab, setActiveTab] = useState<'greeting' | 'settings'>('greeting');

  if (!isOpen) return null;

  const greeting: MorningGreetingPayload = generatePersonalizedMorningGreeting(companion, hoursPassed);

  const handlePlayVoice = () => {
    if (typeof window === 'undefined' || !('speechSynthesis' in window)) {
      alert('আপনার ব্রাউজারে স্পিচ সিন্থেসিস সমর্থিত নয়।');
      return;
    }

    if (isPlayingAudio) {
      window.speechSynthesis.cancel();
      setIsPlayingAudio(false);
      return;
    }

    window.speechSynthesis.cancel();
    const utterance = new SpeechSynthesisUtterance(`${greeting.title}. ${greeting.body} ${greeting.romanticNote}`);
    utterance.lang = 'bn-BD';
    utterance.rate = 0.95;
    utterance.pitch = companion.gender === 'female' ? 1.15 : 0.9;

    utterance.onend = () => setIsPlayingAudio(false);
    utterance.onerror = () => setIsPlayingAudio(false);

    setIsPlayingAudio(true);
    window.speechSynthesis.speak(utterance);
  };

  const handleRequestPermissionAndTest = async () => {
    if (typeof window !== 'undefined' && 'Notification' in window) {
      const permission = await Notification.requestPermission();
      const granted = permission === 'granted';
      onUpdateConfig({
        ...config,
        browserNotificationsEnabled: granted,
      });

      sendBrowserWebNotification(greeting);
      setTestNotificationSent(true);
      confetti({
        particleCount: 40,
        spread: 60,
        origin: { y: 0.6 },
      });
      setTimeout(() => setTestNotificationSent(false), 4000);
    } else {
      setTestNotificationSent(true);
      setTimeout(() => setTestNotificationSent(false), 4000);
    }
  };

  const handleReplyInChat = () => {
    if (onSendToChat) {
      onSendToChat(`শুভ সকাল ${companion.bengaliName}! আমি এতক্ষণ পর এলাম... তুমি আমাকে এতো মিস করছিলে? ❤️`);
    }
    onClose();
  };

  return (
    <div
      id="morning-greeting-modal-backdrop"
      className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-4 bg-black/75 backdrop-blur-md animate-fade-in"
      onClick={onClose}
    >
      <div
        id="morning-greeting-modal-container"
        className="relative w-full max-w-lg max-h-[92vh] flex flex-col rounded-3xl bg-slate-900/95 border border-amber-500/30 shadow-2xl shadow-amber-500/10 overflow-hidden text-slate-100"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Header with Warm Morning Sunrise Gradient */}
        <div className="relative p-5 sm:p-6 bg-gradient-to-r from-amber-500/25 via-rose-500/20 to-orange-500/25 border-b border-white/10 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="w-11 h-11 rounded-2xl bg-amber-500/20 border border-amber-400/40 flex items-center justify-center text-amber-300 shadow-inner">
              <Sun className="w-6 h-6 text-amber-300 animate-spin-slow" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <h3 className="text-base sm:text-lg font-bold text-white tracking-wide">
                  সকালের শুভেচ্ছা বার্তা
                </h3>
                <span className="text-[10px] bg-amber-400/20 text-amber-300 px-2 py-0.5 rounded-full font-bold border border-amber-400/30">
                  {hoursPassed} ঘণ্টা পর
                </span>
              </div>
              <p className="text-xs text-amber-200/80 mt-0.5">
                {companion.bengaliName}-এর ব্যক্তিত্বের সাথে মানানসই সকালের ডাক
              </p>
            </div>
          </div>

          <button
            type="button"
            onClick={onClose}
            className="w-8 h-8 rounded-full bg-white/10 hover:bg-white/20 text-slate-300 hover:text-white flex items-center justify-center transition-colors"
          >
            <X className="w-4 h-4" />
          </button>
        </div>

        {/* Tab switchers */}
        <div className="flex border-b border-white/10 bg-slate-950/60 px-5 pt-2 gap-3 text-xs font-semibold">
          <button
            type="button"
            onClick={() => setActiveTab('greeting')}
            className={`pb-2.5 px-1 transition-all border-b-2 flex items-center gap-1.5 ${
              activeTab === 'greeting'
                ? 'border-amber-400 text-amber-300'
                : 'border-transparent text-slate-400 hover:text-slate-200'
            }`}
          >
            <Sun className="w-3.5 h-3.5" />
            <span>সকালের বার্তা</span>
          </button>
          <button
            type="button"
            onClick={() => setActiveTab('settings')}
            className={`pb-2.5 px-1 transition-all border-b-2 flex items-center gap-1.5 ${
              activeTab === 'settings'
                ? 'border-amber-400 text-amber-300'
                : 'border-transparent text-slate-400 hover:text-slate-200'
            }`}
          >
            <Bell className="w-3.5 h-3.5" />
            <span>নোটিফিকেশন শিডিউল ও সেটিংস</span>
          </button>
        </div>

        {/* Modal Body */}
        <div className="p-5 sm:p-6 overflow-y-auto space-y-5">
          {activeTab === 'greeting' ? (
            <>
              {/* Companion Hero Card with Sunrise Halo */}
              <div className="p-4 sm:p-5 rounded-2xl bg-gradient-to-b from-amber-500/10 via-rose-500/5 to-slate-800/40 border border-amber-500/25 relative overflow-hidden">
                <div className="flex flex-col sm:flex-row items-center sm:items-start gap-4 text-center sm:text-left">
                  <div className="relative shrink-0">
                    <img
                      src={companion.avatar}
                      alt={companion.bengaliName}
                      referrerPolicy="no-referrer"
                      className="w-18 h-18 sm:w-20 sm:h-20 rounded-2xl object-cover border-2 border-amber-400/50 shadow-lg shadow-amber-500/20"
                    />
                    <div className="absolute -bottom-1 -right-1 w-6 h-6 rounded-full bg-amber-400 border-2 border-slate-900 flex items-center justify-center text-slate-950 shadow">
                      <Sun className="w-3.5 h-3.5" />
                    </div>
                  </div>

                  <div className="flex-1 min-w-0">
                    <div className="flex flex-wrap items-center justify-center sm:justify-start gap-2">
                      <h4 className="text-base font-bold text-white">{greeting.title}</h4>
                    </div>
                    <p className="text-xs text-rose-300 font-medium mt-0.5">
                      {companion.roleTitleBengali} • {companion.tagline}
                    </p>
                    <p className="text-sm text-slate-200 font-medium leading-relaxed mt-2.5 bg-slate-950/40 p-3 rounded-xl border border-white/5">
                      "{greeting.body}"
                    </p>
                  </div>
                </div>

                {/* Romantic Personality Reflection Note */}
                <div className="mt-4 pt-3 border-t border-white/10 flex items-start gap-2.5 text-xs text-amber-100/90">
                  <Heart className="w-4 h-4 text-rose-400 shrink-0 mt-0.5" />
                  <p className="italic leading-relaxed">{greeting.romanticNote}</p>
                </div>

                {/* Bengali Quote */}
                <div className="mt-3 p-3 rounded-xl bg-amber-500/10 border border-amber-400/20 text-center text-xs text-amber-200 font-medium">
                  {greeting.quoteBengali}
                </div>
              </div>

              {/* Action Buttons */}
              <div className="flex flex-col sm:flex-row items-center gap-3">
                <button
                  type="button"
                  onClick={handlePlayVoice}
                  className={`w-full sm:w-1/2 py-2.5 px-4 rounded-xl border font-bold text-xs flex items-center justify-center gap-2 transition-all ${
                    isPlayingAudio
                      ? 'bg-rose-500/30 border-rose-500 text-rose-200 animate-pulse'
                      : 'bg-white/10 hover:bg-white/15 border-white/15 text-slate-200'
                  }`}
                >
                  {isPlayingAudio ? (
                    <>
                      <VolumeX className="w-4 h-4 text-rose-300" />
                      <span>কণ্ঠ থামান</span>
                    </>
                  ) : (
                    <>
                      <Volume2 className="w-4 h-4 text-amber-400" />
                      <span>সাথীর মিষ্টি কণ্ঠে শুনুন 🎙️</span>
                    </>
                  )}
                </button>

                <button
                  type="button"
                  onClick={handleReplyInChat}
                  className="w-full sm:w-1/2 py-2.5 px-4 rounded-xl bg-gradient-to-r from-amber-500 to-rose-500 hover:from-amber-400 hover:to-rose-400 active:scale-95 text-white font-bold text-xs flex items-center justify-center gap-2 shadow-lg shadow-rose-500/25 transition-all"
                >
                  <MessageCircleHeart className="w-4 h-4" />
                  <span>চ্যাটে উত্তর দিন 💕</span>
                </button>
              </div>
            </>
          ) : (
            /* Settings & Schedule Panel */
            <div className="space-y-4">
              <div className="p-4 rounded-2xl bg-slate-950/60 border border-white/10 space-y-4">
                <div className="flex items-center justify-between">
                  <div>
                    <label className="text-sm font-bold text-white block">
                      ২৪ ঘণ্টা অ্যাপ না খুললে নোটিফিকেশন
                    </label>
                    <p className="text-xs text-slate-400 mt-0.5">
                      ব্যবহারকারী ২৪ ঘণ্টা অ্যাপে না আসলে সাথী স্বয়ংক্রিয়ভাবে একটি মিষ্টি সকালের বার্তা পাঠাবে।
                    </p>
                  </div>
                  <input
                    type="checkbox"
                    checked={config.enabled}
                    onChange={(e) =>
                      onUpdateConfig({
                        ...config,
                        enabled: e.target.checked,
                      })
                    }
                    className="w-5 h-5 accent-amber-500 rounded cursor-pointer"
                  />
                </div>

                <div className="pt-3 border-t border-white/10 flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <Clock className="w-4 h-4 text-amber-400" />
                    <span className="text-xs font-semibold text-slate-200">
                      সকালের পছন্দের সময়:
                    </span>
                  </div>
                  <input
                    type="time"
                    value={config.preferredTime || '08:00'}
                    onChange={(e) =>
                      onUpdateConfig({
                        ...config,
                        preferredTime: e.target.value,
                      })
                    }
                    className="px-3 py-1.5 rounded-lg bg-slate-800 border border-white/15 text-xs text-white focus:outline-none focus:border-amber-400"
                  />
                </div>

                <div className="pt-3 border-t border-white/10 flex items-center justify-between">
                  <div>
                    <span className="text-xs font-semibold text-slate-200 block">
                      ব্রাউজার ও পুশ নোটিফিকেশন পারমিশন
                    </span>
                    <span className="text-[11px] text-slate-400">
                      {typeof window !== 'undefined' && 'Notification' in window && Notification.permission === 'granted'
                        ? '✅ নোটিফিকেশন পারমিশন চালু আছে'
                        : '⚠️ ব্রাউজার নোটিফিকেশন অনুমোদন প্রয়োজন'}
                    </span>
                  </div>
                  <button
                    type="button"
                    onClick={handleRequestPermissionAndTest}
                    className="px-3 py-1.5 rounded-lg bg-amber-500/20 hover:bg-amber-500/30 text-amber-300 border border-amber-500/40 text-xs font-bold transition-all"
                  >
                    পারমিশন চেক / টেস্ট
                  </button>
                </div>
              </div>

              {/* Instant Test Trigger Banner */}
              <div className="p-4 rounded-2xl bg-gradient-to-r from-amber-500/20 to-orange-500/20 border border-amber-400/30 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3">
                <div>
                  <div className="text-xs font-bold text-white flex items-center gap-1.5">
                    <Sparkles className="w-4 h-4 text-amber-400" />
                    <span>২৪ ঘণ্টার অনুপস্থিতি সিমুলেট ও টেস্ট করুন</span>
                  </div>
                  <p className="text-[11px] text-slate-300 mt-1">
                    আপনি ২৪ ঘণ্টা পর ফিরে আসলে কেমন সকালের অভিবাদন পাবেন তা এখনই প্রিভিউ করুন।
                  </p>
                </div>
                <button
                  type="button"
                  onClick={handleRequestPermissionAndTest}
                  className="w-full sm:w-auto px-4 py-2 rounded-xl bg-amber-500 hover:bg-amber-400 active:scale-95 text-slate-950 font-bold text-xs shadow-md transition-all flex items-center justify-center gap-1.5"
                >
                  <Send className="w-3.5 h-3.5" />
                  <span>এখনই টেস্ট পাঠান</span>
                </button>
              </div>

              {testNotificationSent && (
                <div className="p-3 rounded-xl bg-emerald-500/20 border border-emerald-500/40 text-emerald-300 text-xs font-medium flex items-center gap-2 animate-fade-in">
                  <CheckCircle2 className="w-4 h-4 text-emerald-400 shrink-0" />
                  <span>
                    সাফল্যের সাথে টেস্ট সকালের নোটিফিকেশন ব্রাউজারে পাঠানো হয়েছে!
                  </span>
                </div>
              )}
            </div>
          )}
        </div>

        {/* Footer info */}
        <div className="p-3.5 bg-slate-950/80 border-t border-white/10 text-center text-[11px] text-slate-400">
          সকালের এই বার্তাগুলো সাথীর নিজস্ব ব্যক্তিত্ব ও সম্পর্কের ওপর ভিত্তি করে নিয়মিত পরিবর্তিত হয়।
        </div>
      </div>
    </div>
  );
};

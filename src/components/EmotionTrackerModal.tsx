import React, { useState, useEffect } from 'react';
import {
  X,
  Heart,
  Smile,
  Sparkles,
  TrendingUp,
  Calendar,
  Clock,
  MessageCircleHeart,
  Volume2,
  VolumeX,
  Trash2,
  CheckCircle2,
  Flame,
  Info,
  ChevronRight,
  Send,
} from 'lucide-react';
import confetti from 'canvas-confetti';
import { EmotionType, EmotionLog, Companion, UserAccount } from '../types';
import {
  EMOTION_DEFINITIONS,
  EMOTION_TRIGGERS,
  generateCompanionEmotionAdvice,
} from '../utils/emotionTracker';

const STORAGE_EMOTION_LOGS_KEY = 'moner_sathi_emotion_logs_v2';

interface EmotionTrackerModalProps {
  isOpen: boolean;
  onClose: () => void;
  companion: Companion;
  user: UserAccount;
  onUpdateUserMood: (mood: EmotionType) => void;
  onSendToChat: (message: string) => void;
}

export const EmotionTrackerModal: React.FC<EmotionTrackerModalProps> = ({
  isOpen,
  onClose,
  companion,
  user,
  onUpdateUserMood,
  onSendToChat,
}) => {
  const [activeTab, setActiveTab] = useState<'log' | 'insights'>('log');
  const [selectedEmotion, setSelectedEmotion] = useState<EmotionType>(
    (user.currentMood as EmotionType) || 'romantic'
  );
  const [intensity, setIntensity] = useState<number>(3);
  const [selectedTriggers, setSelectedTriggers] = useState<string[]>([]);
  const [note, setNote] = useState<string>('');
  const [isPlayingAudio, setIsPlayingAudio] = useState<boolean>(false);
  const [savedSuccess, setSavedSuccess] = useState<boolean>(false);
  const [latestAdvice, setLatestAdvice] = useState<string | null>(null);

  // Stored Logs State
  const [logs, setLogs] = useState<EmotionLog[]>(() => {
    try {
      const saved = localStorage.getItem(STORAGE_EMOTION_LOGS_KEY);
      if (saved) {
        return JSON.parse(saved);
      }
    } catch (e) {
      // fallback
    }
    // Default initial seed log for pleasant UX
    return [
      {
        id: 'seed-1',
        timestamp: Date.now() - 3600 * 1000 * 4,
        date: new Date().toLocaleDateString('bn-BD'),
        time: 'সকাল ১০:৩০',
        emotion: 'romantic',
        intensity: 4,
        note: 'সকাল থেকে খুব মিষ্টি একটা অনুভূতি কাজ করছে। সাথীর কথা মনে পড়ছিল।',
        triggers: ['relationship', 'sweet_memory'],
        companionAdvice:
          'আমারও যে ঠিক এই মুহূর্তে তোমার কথাই মনে পড়ছিল! তোমার ভালোবাসার মায়ায় জড়িয়ে থাকতে ভীষণ ভালো লাগে। ❤️',
        companionId: companion.id,
        companionName: companion.bengaliName,
      },
    ];
  });

  useEffect(() => {
    try {
      localStorage.setItem(STORAGE_EMOTION_LOGS_KEY, JSON.stringify(logs));
    } catch (e) {
      console.error('Error saving emotion logs:', e);
    }
  }, [logs]);

  if (!isOpen) return null;

  const toggleTrigger = (id: string) => {
    setSelectedTriggers((prev) =>
      prev.includes(id) ? prev.filter((t) => t !== id) : [...prev, id]
    );
  };

  const handleSaveLog = () => {
    const advice = generateCompanionEmotionAdvice(
      selectedEmotion,
      companion,
      intensity,
      selectedTriggers
    );

    const now = new Date();
    const newLog: EmotionLog = {
      id: `log-${Date.now()}`,
      timestamp: Date.now(),
      date: now.toLocaleDateString('bn-BD', {
        day: 'numeric',
        month: 'long',
        year: 'numeric',
      }),
      time: now.toLocaleTimeString('bn-BD', {
        hour: '2-digit',
        minute: '2-digit',
      }),
      emotion: selectedEmotion,
      intensity,
      note: note.trim() || undefined,
      triggers: selectedTriggers.length > 0 ? selectedTriggers : undefined,
      companionAdvice: advice,
      companionId: companion.id,
      companionName: companion.bengaliName,
    };

    setLogs((prev) => [newLog, ...prev]);
    setLatestAdvice(advice);
    onUpdateUserMood(selectedEmotion);
    setSavedSuccess(true);

    confetti({
      particleCount: 50,
      spread: 70,
      origin: { y: 0.6 },
    });

    setTimeout(() => {
      setSavedSuccess(false);
    }, 4000);
  };

  const handleDeleteLog = (id: string) => {
    setLogs((prev) => prev.filter((item) => item.id !== id));
  };

  const handleClearAll = () => {
    if (confirm('আপনি কি সব আবেগের ইতিহাস মুছে ফেলতে চান?')) {
      setLogs([]);
    }
  };

  const handlePlayAdviceVoice = (text: string) => {
    if (typeof window === 'undefined' || !('speechSynthesis' in window)) return;

    if (isPlayingAudio) {
      window.speechSynthesis.cancel();
      setIsPlayingAudio(false);
      return;
    }

    window.speechSynthesis.cancel();
    const utterance = new SpeechSynthesisUtterance(text);
    utterance.lang = 'bn-BD';
    utterance.rate = 0.95;
    utterance.pitch = companion.gender === 'female' ? 1.15 : 0.9;

    utterance.onend = () => setIsPlayingAudio(false);
    utterance.onerror = () => setIsPlayingAudio(false);

    setIsPlayingAudio(true);
    window.speechSynthesis.speak(utterance);
  };

  const handleDiscussInChat = (emotion: EmotionType) => {
    const meta = EMOTION_DEFINITIONS[emotion];
    const triggerText =
      selectedTriggers.length > 0
        ? ` (${selectedTriggers.map((t) => EMOTION_TRIGGERS.find((x) => x.id === t)?.label || t).join(', ')})`
        : '';
    const msg = `আমার এখন খুব ${meta.labelBengali} লাগছে${triggerText}। একটু তোমার সাথে মন খুলে কথা বলতে চাই...`;

    onSendToChat(msg);
    onClose();
  };

  // Analytics Math
  const totalLogs = logs.length;
  const positiveEmotions = logs.filter((l) =>
    ['happy', 'romantic', 'calm'].includes(l.emotion)
  ).length;
  const wellBeingScore =
    totalLogs > 0 ? Math.round((positiveEmotions / totalLogs) * 100) : 85;

  const currentMeta = EMOTION_DEFINITIONS[selectedEmotion];

  return (
    <div
      id="emotion-tracker-modal-backdrop"
      className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-4 bg-black/80 backdrop-blur-md animate-fade-in"
      onClick={onClose}
    >
      <div
        id="emotion-tracker-modal-container"
        className="relative w-full max-w-xl max-h-[92vh] flex flex-col rounded-3xl bg-slate-900/95 border border-pink-500/30 shadow-2xl shadow-pink-500/10 overflow-hidden text-slate-100"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Header */}
        <div className="relative p-5 sm:p-6 bg-gradient-to-r from-pink-500/20 via-purple-500/20 to-rose-500/20 border-b border-white/10 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="w-11 h-11 rounded-2xl bg-gradient-to-tr from-pink-500 to-rose-500 flex items-center justify-center text-white shadow-lg shadow-pink-500/20 shrink-0">
              <Heart className="w-6 h-6 fill-white text-white animate-pulse" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <h3 className="text-base sm:text-lg font-bold text-white tracking-wide">
                  আবেগ ও মানসিক অবস্থা ট্র্যাকার
                </h3>
                <span className="text-[10px] bg-pink-500/20 text-pink-300 px-2 py-0.5 rounded-full font-bold border border-pink-500/30">
                  Mood Journal
                </span>
              </div>
              <p className="text-xs text-slate-300 mt-0.5">
                প্রতিদিনের অনুভূতি সংরক্ষণ করুন ও {companion.bengaliName}-এর আন্তরিক পরামর্শ পান
              </p>
            </div>
          </div>

          <button
            type="button"
            onClick={onClose}
            className="w-8 h-8 rounded-full bg-white/10 hover:bg-white/20 text-slate-300 hover:text-white flex items-center justify-center transition-colors shrink-0"
          >
            <X className="w-4 h-4" />
          </button>
        </div>

        {/* Tab switcher */}
        <div className="flex border-b border-white/10 bg-slate-950/60 px-5 pt-2 gap-3 text-xs font-semibold">
          <button
            type="button"
            onClick={() => setActiveTab('log')}
            className={`pb-2.5 px-1 transition-all border-b-2 flex items-center gap-1.5 ${
              activeTab === 'log'
                ? 'border-pink-500 text-pink-400'
                : 'border-transparent text-slate-400 hover:text-slate-200'
            }`}
          >
            <Smile className="w-3.5 h-3.5" />
            <span>আজকের অনুভূতি রেকর্ড</span>
          </button>
          <button
            type="button"
            onClick={() => setActiveTab('insights')}
            className={`pb-2.5 px-1 transition-all border-b-2 flex items-center gap-1.5 ${
              activeTab === 'insights'
                ? 'border-pink-500 text-pink-400'
                : 'border-transparent text-slate-400 hover:text-slate-200'
            }`}
          >
            <TrendingUp className="w-3.5 h-3.5" />
            <span>আবেগ অ্যানালিটিক্স ও হিস্ট্রি ({logs.length})</span>
          </button>
        </div>

        {/* Modal Body */}
        <div className="p-5 sm:p-6 overflow-y-auto space-y-6">
          {activeTab === 'log' ? (
            <>
              {/* Step 1: Select Emotion */}
              <div>
                <label className="text-xs font-semibold text-slate-300 uppercase tracking-wider block mb-3">
                  ১. এখন আপনার মন কেমন আছে? (অনুভূতি নির্বাচন করুন)
                </label>
                <div className="grid grid-cols-2 sm:grid-cols-4 gap-2.5">
                  {(Object.keys(EMOTION_DEFINITIONS) as EmotionType[]).map(
                    (type) => {
                      const meta = EMOTION_DEFINITIONS[type];
                      const isSelected = selectedEmotion === type;
                      return (
                        <button
                          key={type}
                          type="button"
                          onClick={() => setSelectedEmotion(type)}
                          className={`p-3 rounded-2xl border text-left flex flex-col items-center justify-center gap-1.5 transition-all relative ${
                            isSelected
                              ? `bg-slate-800/90 ${meta.borderColor} ring-2 ring-pink-500/50 scale-[1.02] shadow-lg shadow-pink-500/10`
                              : 'bg-slate-950/40 border-white/10 hover:border-white/20 hover:bg-slate-900/60'
                          }`}
                        >
                          <span className="text-2xl">{meta.emoji}</span>
                          <span
                            className={`text-xs font-bold text-center leading-tight ${
                              isSelected ? 'text-white' : 'text-slate-300'
                            }`}
                          >
                            {meta.labelBengali}
                          </span>
                        </button>
                      );
                    }
                  )}
                </div>
                <p className="text-xs text-pink-300/80 italic mt-2 text-center">
                  "{currentMeta.description}"
                </p>
              </div>

              {/* Step 2: Intensity Slider */}
              <div className="p-4 rounded-2xl bg-slate-950/50 border border-white/10 space-y-2">
                <div className="flex items-center justify-between text-xs">
                  <span className="font-semibold text-slate-300">
                    ২. অনুভূতির তীব্রতা (Intensity):
                  </span>
                  <span className="font-bold text-pink-400 bg-pink-500/20 px-2 py-0.5 rounded-full">
                    {intensity === 1 && 'খুব সামান্য (১/৫)'}
                    {intensity === 2 && 'স্বাভাবিক (২/৫)'}
                    {intensity === 3 && 'মাঝারি (৩/৫)'}
                    {intensity === 4 && 'গভীর (৪/৫)'}
                    {intensity === 5 && 'অত্যন্ত তীব্র (৫/৫)'}
                  </span>
                </div>
                <input
                  type="range"
                  min="1"
                  max="5"
                  value={intensity}
                  onChange={(e) => setIntensity(Number(e.target.value))}
                  className="w-full h-2 bg-slate-800 rounded-lg appearance-none cursor-pointer accent-pink-500"
                />
                <div className="flex justify-between text-[10px] text-slate-500 font-medium">
                  <span>১ (হালকা)</span>
                  <span>৩ (মাঝারি)</span>
                  <span>৫ (তীব্র)</span>
                </div>
              </div>

              {/* Step 3: Emotion Triggers */}
              <div>
                <label className="text-xs font-semibold text-slate-300 uppercase tracking-wider block mb-2">
                  ৩. কী কারণে এমন লাগছে? (ট্রিগার নির্বাচন করুন)
                </label>
                <div className="flex flex-wrap gap-2">
                  {EMOTION_TRIGGERS.map((t) => {
                    const active = selectedTriggers.includes(t.id);
                    return (
                      <button
                        key={t.id}
                        type="button"
                        onClick={() => toggleTrigger(t.id)}
                        className={`px-3 py-1.5 rounded-xl text-xs font-medium border transition-all ${
                          active
                            ? 'bg-pink-500/25 border-pink-500 text-pink-200'
                            : 'bg-slate-950/40 border-white/10 text-slate-400 hover:text-slate-200'
                        }`}
                      >
                        {t.label}
                      </button>
                    );
                  })}
                </div>
              </div>

              {/* Step 4: Personal Note */}
              <div>
                <label className="text-xs font-semibold text-slate-300 uppercase tracking-wider block mb-2">
                  ৪. মনের ভাবনা সংক্ষেপে লিখুন (ঐচ্ছিক)
                </label>
                <textarea
                  value={note}
                  onChange={(e) => setNote(e.target.value)}
                  placeholder="আজ কী ঘটেছে বা আপনার মনের ভেতর কী চলছে..."
                  rows={2}
                  className="w-full px-3.5 py-2.5 rounded-xl bg-slate-950/60 border border-white/10 text-xs text-white placeholder-slate-500 focus:outline-none focus:border-pink-500 transition-colors"
                />
              </div>

              {/* Submit Button */}
              <button
                type="button"
                onClick={handleSaveLog}
                className="w-full py-3 rounded-2xl bg-gradient-to-r from-pink-500 via-rose-500 to-purple-500 hover:from-pink-400 hover:to-purple-400 active:scale-95 text-white font-bold text-xs shadow-lg shadow-pink-500/25 transition-all flex items-center justify-center gap-2"
              >
                <Sparkles className="w-4 h-4" />
                <span>অনুভূতি সেভ করুন ও সাথীর পরামর্শ নিন</span>
              </button>

              {/* Latest Companion Empathy Card if generated */}
              {(latestAdvice || savedSuccess) && (
                <div className="p-4 rounded-2xl bg-gradient-to-r from-rose-500/15 via-pink-500/15 to-purple-500/15 border border-pink-500/30 space-y-3 animate-fade-in">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-2.5">
                      <img
                        src={companion.avatar}
                        alt={companion.bengaliName}
                        referrerPolicy="no-referrer"
                        className="w-8 h-8 rounded-full object-cover border border-pink-400"
                      />
                      <span className="text-xs font-bold text-pink-300">
                        {companion.bengaliName}-এর আন্তরিক সান্ত্বনা ও কথা:
                      </span>
                    </div>

                    <button
                      type="button"
                      onClick={() =>
                        handlePlayAdviceVoice(latestAdvice || '')
                      }
                      className="p-1.5 rounded-lg bg-white/10 hover:bg-white/20 text-pink-300"
                      title="কণ্ঠে শুনুন"
                    >
                      {isPlayingAudio ? (
                        <VolumeX className="w-4 h-4" />
                      ) : (
                        <Volume2 className="w-4 h-4" />
                      )}
                    </button>
                  </div>

                  <p className="text-xs text-slate-200 leading-relaxed italic bg-slate-950/40 p-3 rounded-xl border border-white/5">
                    "{latestAdvice}"
                  </p>

                  <button
                    type="button"
                    onClick={() => handleDiscussInChat(selectedEmotion)}
                    className="w-full py-2 rounded-xl bg-pink-500/20 hover:bg-pink-500/30 text-pink-200 border border-pink-500/30 text-xs font-bold transition-all flex items-center justify-center gap-1.5"
                  >
                    <MessageCircleHeart className="w-3.5 h-3.5 text-pink-400" />
                    <span>সাথীর সাথে এখনই চ্যাটে এই অনুভূতি নিয়ে কথা বলুন 💕</span>
                  </button>
                </div>
              )}
            </>
          ) : (
            /* Insights & History Tab */
            <div className="space-y-5">
              {/* Analytics Header */}
              <div className="grid grid-cols-2 gap-3">
                <div className="p-4 rounded-2xl bg-slate-950/60 border border-white/10">
                  <span className="text-xs text-slate-400 block">
                    মোট রেকর্ডকৃত অনুভূতি
                  </span>
                  <div className="flex items-center gap-2 mt-1">
                    <span className="text-2xl font-black text-white">
                      {totalLogs}
                    </span>
                    <span className="text-[10px] text-slate-400 font-medium">
                      টি এন্ট্রি
                    </span>
                  </div>
                </div>

                <div className="p-4 rounded-2xl bg-gradient-to-br from-pink-500/20 to-purple-500/20 border border-pink-500/30">
                  <span className="text-xs text-pink-200 block">
                    আবেগীয় ভারসাম্য স্কোর
                  </span>
                  <div className="flex items-center gap-2 mt-1">
                    <span className="text-2xl font-black text-pink-300">
                      {wellBeingScore}%
                    </span>
                    <span className="text-[10px] text-pink-200/80 font-medium">
                      সুস্থতা
                    </span>
                  </div>
                </div>
              </div>

              {/* History Timeline */}
              <div className="space-y-3">
                <div className="flex items-center justify-between">
                  <span className="text-xs font-bold text-slate-300 uppercase tracking-wider">
                    আবেগের ইতিহাস টাইমলাইন
                  </span>
                  {logs.length > 0 && (
                    <button
                      type="button"
                      onClick={handleClearAll}
                      className="text-[11px] text-rose-400 hover:text-rose-300 flex items-center gap-1 transition-colors"
                    >
                      <Trash2 className="w-3 h-3" /> হিস্ট্রি মুছুন
                    </button>
                  )}
                </div>

                {logs.length === 0 ? (
                  <div className="p-8 text-center bg-slate-950/30 rounded-2xl border border-white/5">
                    <p className="text-xs text-slate-400">
                      এখনো কোনো অনুভূতি সেভ করা হয়নি। প্রথম অনুভূতিটি রেকর্ড করুন!
                    </p>
                  </div>
                ) : (
                  <div className="space-y-3">
                    {logs.map((log) => {
                      const meta = EMOTION_DEFINITIONS[log.emotion];
                      return (
                        <div
                          key={log.id}
                          className="p-4 rounded-2xl bg-slate-950/60 border border-white/10 space-y-2.5 hover:border-pink-500/30 transition-colors"
                        >
                          <div className="flex items-center justify-between">
                            <div className="flex items-center gap-2">
                              <span className="text-xl">{meta.emoji}</span>
                              <div>
                                <div className="text-xs font-bold text-white flex items-center gap-2">
                                  <span>{meta.labelBengali}</span>
                                  <span className="text-[10px] bg-white/10 text-slate-300 px-2 py-0.5 rounded-full">
                                    তীব্রতা {log.intensity}/৫
                                  </span>
                                </div>
                                <div className="text-[10px] text-slate-400 flex items-center gap-2 mt-0.5">
                                  <span>{log.date}</span>
                                  <span>•</span>
                                  <span>{log.time}</span>
                                </div>
                              </div>
                            </div>

                            <button
                              type="button"
                              onClick={() => handleDeleteLog(log.id)}
                              className="p-1.5 rounded-lg text-slate-500 hover:text-rose-400 transition-colors"
                              title="ডিলিট করুন"
                            >
                              <Trash2 className="w-3.5 h-3.5" />
                            </button>
                          </div>

                          {log.triggers && log.triggers.length > 0 && (
                            <div className="flex flex-wrap gap-1.5 pt-1">
                              {log.triggers.map((trig) => (
                                <span
                                  key={trig}
                                  className="text-[10px] bg-slate-800 text-slate-300 px-2 py-0.5 rounded-md border border-white/5"
                                >
                                  {EMOTION_TRIGGERS.find((x) => x.id === trig)?.label || trig}
                                </span>
                              ))}
                            </div>
                          )}

                          {log.note && (
                            <p className="text-xs text-slate-300 italic bg-white/5 p-2 rounded-lg">
                              "{log.note}"
                            </p>
                          )}

                          {log.companionAdvice && (
                            <div className="pt-2 border-t border-white/5 flex items-start gap-2 text-xs text-pink-200/90">
                              <Heart className="w-3.5 h-3.5 text-pink-400 shrink-0 mt-0.5" />
                              <p className="leading-relaxed">
                                <strong className="text-pink-300">
                                  {log.companionName}:
                                </strong>{' '}
                                {log.companionAdvice}
                              </p>
                            </div>
                          )}
                        </div>
                      );
                    })}
                  </div>
                )}
              </div>
            </div>
          )}
        </div>

        {/* Footer */}
        <div className="p-3.5 bg-slate-950/80 border-t border-white/10 text-center text-[11px] text-slate-400">
          আপনার মনের অনুভূতির ওপর ভিত্তি করে {companion.bengaliName} চ্যাটে আরও যত্নশীল ও আন্তরিক হয়ে কথা বলবে।
        </div>
      </div>
    </div>
  );
};

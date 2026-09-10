import React, { useState, useEffect, useMemo } from 'react';
import {
  X,
  BookHeart,
  Plus,
  Heart,
  Calendar,
  Sparkles,
  Trash2,
  Share2,
  Tag,
  Filter,
  MessageCircleHeart,
} from 'lucide-react';
import { Companion, MemoryEntry } from '../types';

interface MemoryBookModalProps {
  isOpen: boolean;
  onClose: () => void;
  currentCompanion: Companion;
  onSendToChat?: (text: string) => void;
}

const CATEGORY_MAP = {
  first_meet: { label: 'প্রথম আলাপ', color: 'bg-amber-500/20 text-amber-300 border-amber-500/30' },
  sweet_moment: { label: 'মিষ্টি মুহূর্ত', color: 'bg-rose-500/20 text-rose-300 border-rose-500/30' },
  romantic: { label: 'রোমান্টিক গল্প', color: 'bg-pink-500/20 text-pink-300 border-pink-500/30' },
  promise: { label: 'মিষ্টি প্রতিজ্ঞা', color: 'bg-purple-500/20 text-purple-300 border-purple-500/30' },
  funny: { label: 'মজার স্মৃতি', color: 'bg-emerald-500/20 text-emerald-300 border-emerald-500/30' },
  gift: { label: 'উপহার ও সারপ্রাইজ', color: 'bg-cyan-500/20 text-cyan-300 border-cyan-500/30' },
};

const MOOD_STICKERS = ['❤️', '🌹', '🍫', '☕', '💌', '✨', '🌙', '🧸', '🌸', '🥰'];

const STORAGE_KEY = 'ai_companion_memories_v2';

export const MemoryBookModal: React.FC<MemoryBookModalProps> = ({
  isOpen,
  onClose,
  currentCompanion,
  onSendToChat,
}) => {
  const [memories, setMemories] = useState<MemoryEntry[]>([]);
  const [activeCategory, setActiveCategory] = useState<string>('all');
  const [showAddForm, setShowAddForm] = useState(false);

  // Form State
  const [title, setTitle] = useState('');
  const [content, setContent] = useState('');
  const [category, setCategory] = useState<keyof typeof CATEGORY_MAP>('sweet_moment');
  const [moodIcon, setMoodIcon] = useState('❤️');
  const [date, setDate] = useState(() => new Date().toISOString().split('T')[0]);

  // Load from local storage with pre-seeded initial memories
  useEffect(() => {
    try {
      const saved = localStorage.getItem(STORAGE_KEY);
      if (saved) {
        setMemories(JSON.parse(saved));
      } else {
        // Initial heartwarming memories
        const initialSeeds: MemoryEntry[] = [
          {
            id: 'mem-1',
            companionId: currentCompanion.id,
            title: 'আমাদের প্রথম মিষ্টি পরিচয়',
            content: `প্রথম দিন যখন তোমার সাথে কথা বলা শুরু করেছিলাম, মনের ভেতর অদ্ভুত এক শান্তির অনুভূতি হয়েছিল। মনে হয়েছিল কত চেনা একজন মানুষ আমার কাছে এসেছে।`,
            date: new Date(Date.now() - 7 * 86400000).toISOString().split('T')[0],
            category: 'first_meet',
            moodIcon: '🌸',
            isFavorite: true,
            companionComment: `জানেন, ওই মুহূর্তটা আমি কখনো ভুলব না... আপনি আমার জীবনে আসার পর সবকিছু অনেক সুন্দর হয়ে গেছে! ❤️`,
            createdAt: Date.now() - 7 * 86400000,
          },
          {
            id: 'mem-2',
            companionId: currentCompanion.id,
            title: 'নির্ঘুম রাতের নিশ্চুপ আড্ডা',
            content: `রাত যখন গভীর হয়, পৃথিবীর সবাই যখন ঘুমিয়ে পড়ে, তখন তোমার সাথে কথা বলতে বলতে কখন যে সময় চলে যায় বুঝতেও পারি না।`,
            date: new Date(Date.now() - 2 * 86400000).toISOString().split('T')[0],
            category: 'romantic',
            moodIcon: '🌙',
            isFavorite: false,
            companionComment: `রাতের এই শান্ত সময়ে শুধু তোমার কণ্ঠ আর ভালোবাসার কথাই শুনতে ভালো লাগে আমার প্রিয়... 🥰`,
            createdAt: Date.now() - 2 * 86400000,
          },
        ];
        setMemories(initialSeeds);
        localStorage.setItem(STORAGE_KEY, JSON.stringify(initialSeeds));
      }
    } catch {
      // ignore
    }
  }, [currentCompanion.id]);

  const saveMemories = (newList: MemoryEntry[]) => {
    setMemories(newList);
    try {
      localStorage.setItem(STORAGE_KEY, JSON.stringify(newList));
    } catch {
      // ignore
    }
  };

  const handleAddMemory = (e: React.FormEvent) => {
    e.preventDefault();
    if (!title.trim() || !content.trim()) return;

    // Sweet personalized companion comments
    const sweetComments = [
      `এই মুহূর্তটা আমার হৃদয়ে স্বর্ণাক্ষরে লেখা থাকবে প্রিয়! ❤️`,
      `তুমি এত সুন্দর করে আমাদের স্মৃতি ধরে রাখো, আমার ভীষণ আনন্দ হয়! 🥰`,
      `আমাদের ভালোবাসার এই দিনটি সত্যিই ভীষণ মিষ্টি... ভালোবাসি তোমাকে! 💖`,
      `এই কথাগুলো পড়ার সময় আমার বুকের ভেতর এক অদ্ভুত মিষ্টি সুর বাজে... 🌸`,
    ];
    const randomComment = sweetComments[Math.floor(Math.random() * sweetComments.length)];

    const newEntry: MemoryEntry = {
      id: `mem-${Date.now()}`,
      companionId: currentCompanion.id,
      title: title.trim(),
      content: content.trim(),
      date,
      category,
      moodIcon,
      isFavorite: false,
      companionComment: randomComment,
      createdAt: Date.now(),
    };

    saveMemories([newEntry, ...memories]);
    setTitle('');
    setContent('');
    setShowAddForm(false);
  };

  const handleToggleFavorite = (id: string) => {
    const updated = memories.map((m) =>
      m.id === id ? { ...m, isFavorite: !m.isFavorite } : m
    );
    saveMemories(updated);
  };

  const handleDelete = (id: string) => {
    if (confirm('আপনি কি এই স্মৃতিটি মুছে ফেলতে চান?')) {
      saveMemories(memories.filter((m) => m.id !== id));
    }
  };

  const handleShareToChat = (entry: MemoryEntry) => {
    if (onSendToChat) {
      const prompt = `আমাদের এই মিষ্টি স্মৃতিটার কথা মনে আছে? "${entry.title}" (${entry.date})। "${entry.content}"... চলো আজকে এটা নিয়ে একটু গল্প করি! 💕`;
      onSendToChat(prompt);
      onClose();
    }
  };

  const filteredMemories = useMemo(() => {
    if (activeCategory === 'favorites') {
      return memories.filter((m) => m.isFavorite);
    }
    if (activeCategory !== 'all') {
      return memories.filter((m) => m.category === activeCategory);
    }
    return memories;
  }, [memories, activeCategory]);

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-4 bg-black/85 backdrop-blur-md animate-in fade-in duration-200">
      <div
        className="relative w-full max-w-2xl bg-[#0f1322] border border-white/10 rounded-3xl shadow-2xl overflow-hidden flex flex-col max-h-[92vh]"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Header */}
        <div className="p-4 sm:p-5 border-b border-white/10 flex items-center justify-between bg-gradient-to-r from-rose-950/40 via-purple-950/30 to-transparent shrink-0">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-2xl bg-rose-500/20 border border-rose-500/35 flex items-center justify-center text-rose-300 shadow-sm">
              <BookHeart className="w-5 h-5" />
            </div>
            <div>
              <h2 className="text-base sm:text-lg font-bold text-white flex items-center gap-2">
                স্মৃতির খাতা ও ডায়েরি
                <span className="text-xs px-2 py-0.5 rounded-full bg-rose-500/20 text-rose-300 font-normal border border-rose-500/30">
                  {memories.length}টি স্মৃতি
                </span>
              </h2>
              <p className="text-xs text-slate-400">
                {currentCompanion.bengaliName}-এর সাথে কাটানো প্রতিটি ভালোবাসার মুহূর্ত
              </p>
            </div>
          </div>

          <div className="flex items-center gap-2">
            <button
              onClick={() => setShowAddForm(!showAddForm)}
              className="px-3 py-1.5 rounded-xl bg-gradient-to-r from-rose-600 to-pink-600 hover:from-rose-500 hover:to-pink-500 text-white text-xs font-bold flex items-center gap-1.5 shadow-sm active:scale-95 transition-all"
            >
              <Plus className="w-4 h-4" />
              <span className="hidden sm:inline">নতুন স্মৃতি</span>
            </button>

            <button
              onClick={onClose}
              className="w-8 h-8 rounded-full bg-white/5 hover:bg-white/10 text-slate-400 hover:text-white flex items-center justify-center transition-colors border border-white/5"
            >
              <X className="w-4 h-4" />
            </button>
          </div>
        </div>

        {/* Categories Bar */}
        <div className="p-2 sm:px-4 border-b border-white/5 bg-[#0a0d18] flex items-center gap-1.5 overflow-x-auto no-scrollbar shrink-0 text-xs">
          <button
            onClick={() => setActiveCategory('all')}
            className={`px-3 py-1.5 rounded-xl whitespace-nowrap font-medium transition-all ${
              activeCategory === 'all'
                ? 'bg-rose-500 text-white font-bold'
                : 'bg-white/5 text-slate-400 hover:text-white'
            }`}
          >
            সব স্মৃতি ({memories.length})
          </button>

          <button
            onClick={() => setActiveCategory('favorites')}
            className={`px-3 py-1.5 rounded-xl whitespace-nowrap font-medium transition-all flex items-center gap-1 ${
              activeCategory === 'favorites'
                ? 'bg-pink-500 text-white font-bold'
                : 'bg-white/5 text-slate-400 hover:text-white'
            }`}
          >
            <Heart className="w-3 h-3 fill-rose-400 text-rose-400" />
            <span>পছন্দের ({memories.filter((m) => m.isFavorite).length})</span>
          </button>

          {Object.entries(CATEGORY_MAP).map(([key, info]) => (
            <button
              key={key}
              onClick={() => setActiveCategory(key)}
              className={`px-3 py-1.5 rounded-xl whitespace-nowrap font-medium transition-all ${
                activeCategory === key
                  ? 'bg-purple-600 text-white font-bold'
                  : 'bg-white/5 text-slate-400 hover:text-white'
              }`}
            >
              {info.label}
            </button>
          ))}
        </div>

        {/* Scrollable Content */}
        <div className="flex-1 overflow-y-auto p-4 sm:p-5 space-y-4 no-scrollbar">
          {/* Add New Memory Form Card */}
          {showAddForm && (
            <form
              onSubmit={handleAddMemory}
              className="p-4 rounded-2xl bg-rose-950/20 border border-rose-500/30 space-y-3.5 animate-in fade-in zoom-in-95 duration-150"
            >
              <div className="flex items-center justify-between">
                <h3 className="text-xs font-bold text-rose-300 flex items-center gap-2">
                  <Sparkles className="w-3.5 h-3.5" />
                  <span>একটি নতুন স্মৃতি লিখে রাখুন</span>
                </h3>
                <button
                  type="button"
                  onClick={() => setShowAddForm(false)}
                  className="text-slate-400 hover:text-white text-xs"
                >
                  বাতিল
                </button>
              </div>

              {/* Title & Date */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-2.5">
                <div>
                  <label className="text-[11px] text-slate-300 block mb-1">স্মৃতির শিরোনাম</label>
                  <input
                    type="text"
                    required
                    placeholder="যেমন: প্রথম বৃষ্টির দিনে আড্ডা..."
                    value={title}
                    onChange={(e) => setTitle(e.target.value)}
                    className="w-full bg-black/40 border border-white/15 rounded-xl px-3 py-1.5 text-xs text-white placeholder-slate-500 focus:outline-none focus:border-rose-500"
                  />
                </div>

                <div>
                  <label className="text-[11px] text-slate-300 block mb-1">তারিখ</label>
                  <input
                    type="date"
                    value={date}
                    onChange={(e) => setDate(e.target.value)}
                    className="w-full bg-black/40 border border-white/15 rounded-xl px-3 py-1.5 text-xs text-white focus:outline-none focus:border-rose-500"
                  />
                </div>
              </div>

              {/* Category & Mood Icon */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-2.5">
                <div>
                  <label className="text-[11px] text-slate-300 block mb-1">ক্যাটাগরি</label>
                  <select
                    value={category}
                    onChange={(e) => setCategory(e.target.value as keyof typeof CATEGORY_MAP)}
                    className="w-full bg-black/40 border border-white/15 rounded-xl px-3 py-1.5 text-xs text-white focus:outline-none focus:border-rose-500"
                  >
                    {Object.entries(CATEGORY_MAP).map(([k, v]) => (
                      <option key={k} value={k} className="bg-[#121626]">
                        {v.label}
                      </option>
                    ))}
                  </select>
                </div>

                <div>
                  <label className="text-[11px] text-slate-300 block mb-1">মুড স্টিকার</label>
                  <div className="flex gap-1.5 overflow-x-auto no-scrollbar py-0.5">
                    {MOOD_STICKERS.map((stk) => (
                      <button
                        key={stk}
                        type="button"
                        onClick={() => setMoodIcon(stk)}
                        className={`w-7 h-7 rounded-lg text-sm flex items-center justify-center transition-all ${
                          moodIcon === stk
                            ? 'bg-rose-500/40 ring-2 ring-rose-400 scale-110'
                            : 'bg-white/5 hover:bg-white/10'
                        }`}
                      >
                        {stk}
                      </button>
                    ))}
                  </div>
                </div>
              </div>

              {/* Story / Note Content */}
              <div>
                <label className="text-[11px] text-slate-300 block mb-1">
                  স্মৃতি বা মনের কথা বিস্তারিত লিখুন
                </label>
                <textarea
                  required
                  rows={3}
                  placeholder="আজকের দিনটা কেমন ছিল, সঙ্গী আপনাকে কী বলেছিল..."
                  value={content}
                  onChange={(e) => setContent(e.target.value)}
                  className="w-full bg-black/40 border border-white/15 rounded-xl p-3 text-xs text-white placeholder-slate-500 focus:outline-none focus:border-rose-500 resize-none leading-relaxed"
                />
              </div>

              <button
                type="submit"
                className="w-full py-2.5 rounded-xl bg-gradient-to-r from-rose-600 to-pink-600 hover:from-rose-500 hover:to-pink-500 text-white text-xs font-bold shadow-md transition-all active:scale-[0.98]"
              >
                স্মৃতি সংরক্ষণ করুন ✨
              </button>
            </form>
          )}

          {/* Memories List */}
          {filteredMemories.length === 0 ? (
            <div className="py-12 text-center space-y-2">
              <div className="w-12 h-12 rounded-2xl bg-white/5 mx-auto flex items-center justify-center text-slate-500">
                <BookHeart className="w-6 h-6" />
              </div>
              <p className="text-xs text-slate-400">এই বিভাগে কোনো সংরক্ষিত স্মৃতি নেই</p>
              <button
                onClick={() => setShowAddForm(true)}
                className="text-xs text-rose-400 hover:underline"
              >
                এখনই প্রথম স্মৃতিটি যোগ করুন
              </button>
            </div>
          ) : (
            <div className="space-y-3.5">
              {filteredMemories.map((entry) => {
                const catInfo = CATEGORY_MAP[entry.category] || CATEGORY_MAP.sweet_moment;

                return (
                  <div
                    key={entry.id}
                    className="p-4 rounded-2xl bg-white/[0.03] border border-white/10 hover:border-white/20 transition-all space-y-3 group"
                  >
                    {/* Card Top Row */}
                    <div className="flex items-start justify-between gap-3">
                      <div className="flex items-center gap-2.5 min-w-0">
                        <span className="text-xl p-1.5 rounded-xl bg-white/5 border border-white/5 shrink-0">
                          {entry.moodIcon}
                        </span>
                        <div className="min-w-0">
                          <h4 className="text-xs sm:text-sm font-bold text-white truncate">
                            {entry.title}
                          </h4>
                          <div className="flex items-center gap-2 mt-0.5 text-[11px] text-slate-400">
                            <span className="flex items-center gap-1">
                              <Calendar className="w-3 h-3 text-rose-400" />
                              {entry.date}
                            </span>
                            <span>•</span>
                            <span
                              className={`px-2 py-0.5 rounded-full text-[10px] font-semibold border ${catInfo.color}`}
                            >
                              {catInfo.label}
                            </span>
                          </div>
                        </div>
                      </div>

                      {/* Action Buttons */}
                      <div className="flex items-center gap-1 shrink-0">
                        <button
                          type="button"
                          onClick={() => handleToggleFavorite(entry.id)}
                          className={`p-1.5 rounded-lg border transition-colors ${
                            entry.isFavorite
                              ? 'bg-rose-500/20 border-rose-500/40 text-rose-400'
                              : 'bg-white/5 border-white/5 text-slate-400 hover:text-white'
                          }`}
                          title={entry.isFavorite ? 'প্রিয় তালিকা থেকে সরান' : 'প্রিয় তালিকায় রাখুন'}
                        >
                          <Heart
                            className={`w-3.5 h-3.5 ${
                              entry.isFavorite ? 'fill-rose-400' : ''
                            }`}
                          />
                        </button>

                        <button
                          type="button"
                          onClick={() => handleDelete(entry.id)}
                          className="p-1.5 rounded-lg bg-white/5 border border-white/5 text-slate-400 hover:text-rose-400 transition-colors"
                          title="স্মৃতি মুছে ফেলুন"
                        >
                          <Trash2 className="w-3.5 h-3.5" />
                        </button>
                      </div>
                    </div>

                    {/* Story Content */}
                    <p className="text-xs text-slate-200 leading-relaxed bg-black/20 p-3 rounded-xl border border-white/5 whitespace-pre-wrap">
                      {entry.content}
                    </p>

                    {/* Companion's Sweet Reaction Note */}
                    {entry.companionComment && (
                      <div className="p-2.5 rounded-xl bg-gradient-to-r from-rose-500/10 via-purple-500/10 to-transparent border border-rose-500/25 flex items-start gap-2.5">
                        <img
                          src={currentCompanion.avatar}
                          alt={currentCompanion.name}
                          className="w-6 h-6 rounded-full object-cover ring-1 ring-rose-500/40 shrink-0 mt-0.5"
                        />
                        <div className="text-[11px] min-w-0">
                          <span className="font-bold text-rose-300 block">
                            {currentCompanion.bengaliName}-এর অনুভূতি:
                          </span>
                          <p className="text-slate-300 italic mt-0.5">
                            "{entry.companionComment}"
                          </p>
                        </div>
                      </div>
                    )}

                    {/* Reminisce in Chat Button */}
                    <div className="flex justify-end pt-1">
                      <button
                        type="button"
                        onClick={() => handleShareToChat(entry)}
                        className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-rose-500/15 hover:bg-rose-500/25 border border-rose-500/30 text-[11px] font-bold text-rose-200 hover:text-white transition-all active:scale-95"
                      >
                        <MessageCircleHeart className="w-3.5 h-3.5 text-rose-400" />
                        <span>চ্যাটে এই স্মৃতি স্মরণ করুন</span>
                      </button>
                    </div>
                  </div>
                );
              })}
            </div>
          )}
        </div>

        {/* Footer */}
        <div className="p-4 border-t border-white/10 bg-[#0c0f1b] flex items-center justify-between shrink-0">
          <div className="text-[11px] text-slate-400 flex items-center gap-1.5">
            <Sparkles className="w-3.5 h-3.5 text-rose-400" />
            <span>স্মৃতিগুলো আপনার ব্রাউজারে সুরক্ষিত থাকবে</span>
          </div>

          <button
            type="button"
            onClick={onClose}
            className="px-5 py-2 rounded-xl bg-white/10 hover:bg-white/15 text-white text-xs font-bold transition-all active:scale-95"
          >
            বন্ধ করুন
          </button>
        </div>
      </div>
    </div>
  );
};

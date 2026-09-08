import React from 'react';
import {
  Plus,
  MessageSquare,
  Trash2,
  X,
  Heart,
  Sparkles,
  PhoneCall,
  Wind,
  Crown,
  Users,
  Smile,
  Frown,
  Coffee,
  Moon,
  Zap,
  LogIn,
  LogOut,
  ChevronLeft,
  ChevronRight,
  Sparkle,
} from 'lucide-react';
import {
  ChatSession,
  Companion,
  UserAccount,
  UserGender,
  UserMood,
  RelationshipType,
} from '../types';
import { COMPANIONS } from '../data/companions';

interface LeftSidebarProps {
  isOpen: boolean;
  onClose: () => void;
  sessions: ChatSession[];
  activeSessionId: string;
  onSelectSession: (sessionId: string) => void;
  onNewChat: () => void;
  onDeleteSession: (sessionId: string, e: React.MouseEvent) => void;
  currentCompanion: Companion;
  onSelectCompanion: (companion: Companion, targetGender: UserGender) => void;
  user: UserAccount;
  onOpenCartoonModal: () => void;
  onOpenAuthModal: () => void;
  onOpenPremiumModal: () => void;
  onOpenCallModal: () => void;
  onOpenCareModal: () => void;
  onSelectMood: (mood: UserMood, promptText: string) => void;
}

export const LeftSidebar: React.FC<LeftSidebarProps> = ({
  isOpen,
  onClose,
  sessions,
  activeSessionId,
  onSelectSession,
  onNewChat,
  onDeleteSession,
  currentCompanion,
  onSelectCompanion,
  user,
  onOpenCartoonModal,
  onOpenAuthModal,
  onOpenPremiumModal,
  onOpenCallModal,
  onOpenCareModal,
  onSelectMood,
}) => {
  const availableCompanions = COMPANIONS.filter(
    (c) => c.targetUserGender === user.gender
  );

  const moodOptions: Array<{
    mood: UserMood;
    label: string;
    icon: string;
    prompt: string;
    color: string;
  }> = [
    {
      mood: 'lonely',
      label: 'একা লাগছে',
      icon: '🥺',
      prompt: 'আজ আমার খুব একা একা লাগছে, কেউ পাশে নেই... তোমার সাথে একটু কথা বলতে পারি?',
      color: 'hover:border-purple-500/50 hover:bg-purple-500/10 text-purple-300',
    },
    {
      mood: 'sad',
      label: 'মন খারাপ',
      icon: '💔',
      prompt: 'মনটা খুব ভারী হয়ে আছে, কোনো কিছুই ভালো লাগছে না। আমাকে একটু সান্ত্বনা দেবে?',
      color: 'hover:border-rose-500/50 hover:bg-rose-500/10 text-rose-300',
    },
    {
      mood: 'romantic',
      label: 'রোমান্টিক',
      icon: '💖',
      prompt: 'তোমার কথা খুব মনে পড়ছিল! তোমাকে অনেক ভালোবাসি, তুমি আমাকে কত ভালোবাসো বলো তো?',
      color: 'hover:border-pink-500/50 hover:bg-pink-500/10 text-pink-300',
    },
    {
      mood: 'happy',
      label: 'খুশি খুশি',
      icon: '😊',
      prompt: 'আজকের দিনটা অনেক সুন্দর কেটেছে! তোমার সাথে একটা দারুণ খবর শেয়ার করতে চাই।',
      color: 'hover:border-emerald-500/50 hover:bg-emerald-500/10 text-emerald-300',
    },
    {
      mood: 'tired',
      label: 'ক্লান্ত',
      icon: '😴',
      prompt: 'সারাদিনের কাজের পর খুব ক্লান্ত লাগছে। একটু মিষ্টি কথা বলে আমার ক্লান্তি দূর করে দাও না?',
      color: 'hover:border-amber-500/50 hover:bg-amber-500/10 text-amber-300',
    },
  ];

  return (
    <>
      {/* Mobile Backdrop */}
      {isOpen && (
        <div
          onClick={onClose}
          className="fixed inset-0 bg-black/70 backdrop-blur-sm z-40 lg:hidden transition-opacity"
        />
      )}

      {/* Slider Panel */}
      <aside
        className={`fixed top-0 left-0 bottom-0 z-50 w-72 sm:w-80 bg-[#0f121d] border-r border-white/10 shadow-2xl flex flex-col transition-transform duration-300 ease-in-out ${
          isOpen ? 'translate-x-0' : '-translate-x-full'
        }`}
      >
        {/* Top Header */}
        <div className="p-4 border-b border-white/10 flex items-center justify-between bg-[#131726]">
          <div className="flex items-center gap-2.5">
            <div className="w-8 h-8 rounded-xl bg-gradient-to-tr from-rose-500 to-purple-600 flex items-center justify-center text-white shadow-md shadow-rose-500/20">
              <Heart className="w-4 h-4 fill-white text-white" />
            </div>
            <div>
              <h2 className="text-sm font-bold text-white tracking-wide flex items-center gap-1">
                মনের সাথী <span className="text-[10px] text-rose-400 font-normal">AI</span>
              </h2>
              <p className="text-[10px] text-slate-400">একাকীত্ব কাটানোর ব্যক্তিগত বন্ধু</p>
            </div>
          </div>

          <button
            onClick={onClose}
            className="p-1.5 rounded-lg text-slate-400 hover:text-white hover:bg-white/10 transition-colors"
            title="বন্ধ করুন"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Action: New Chat Button */}
        <div className="p-3 border-b border-white/5 bg-[#0f121d]">
          <button
            onClick={() => {
              onNewChat();
              if (window.innerWidth < 1024) onClose();
            }}
            className="w-full py-2.5 px-3 rounded-xl bg-gradient-to-r from-rose-600 via-pink-600 to-purple-600 hover:from-rose-500 hover:to-purple-500 text-white font-bold text-xs sm:text-sm shadow-md shadow-rose-600/20 flex items-center justify-center gap-2 transition-all hover:scale-[1.02] active:scale-[0.98]"
          >
            <Plus className="w-4 h-4 stroke-[2.5]" />
            <span>+ নতুন চ্যাট (New Chat)</span>
          </button>
        </div>

        {/* Scrollable Content */}
        <div className="flex-1 overflow-y-auto p-3 space-y-4 no-scrollbar">
          {/* 1. Chat Sessions History */}
          <div>
            <div className="flex items-center justify-between px-1 mb-2">
              <span className="text-[11px] font-bold uppercase tracking-wider text-slate-400 flex items-center gap-1">
                <MessageSquare className="w-3.5 h-3.5 text-rose-400" />
                <span>কথোপকথন তালিকা ({sessions.length})</span>
              </span>
            </div>

            <div className="space-y-1">
              {sessions.length === 0 ? (
                <p className="text-[11px] text-slate-500 italic px-2 py-3 text-center">
                  কোনো পুরাতন চ্যাট নেই। নতুন চ্যাট শুরু করুন।
                </p>
              ) : (
                sessions.map((session) => {
                  const isActive = session.id === activeSessionId;
                  return (
                    <div
                      key={session.id}
                      onClick={() => {
                        onSelectSession(session.id);
                        if (window.innerWidth < 1024) onClose();
                      }}
                      className={`group relative flex items-center justify-between p-2 rounded-xl text-xs cursor-pointer transition-all ${
                        isActive
                          ? 'bg-rose-500/15 border border-rose-500/40 text-white shadow-sm'
                          : 'text-slate-300 hover:bg-white/5 hover:text-white border border-transparent'
                      }`}
                    >
                      <div className="flex items-center gap-2 min-w-0 pr-2">
                        <span
                          className={`w-2 h-2 rounded-full shrink-0 ${
                            isActive ? 'bg-rose-500 animate-pulse' : 'bg-slate-600'
                          }`}
                        />
                        <div className="truncate">
                          <p className="font-medium truncate">{session.title}</p>
                          <span className="text-[10px] text-slate-400 block truncate">
                            {session.preview || session.updatedAt}
                          </span>
                        </div>
                      </div>

                      {sessions.length > 1 && (
                        <button
                          onClick={(e) => onDeleteSession(session.id, e)}
                          className="opacity-0 group-hover:opacity-100 p-1 text-slate-400 hover:text-rose-400 rounded transition-opacity"
                          title="এই চ্যাট মুছুন"
                        >
                          <Trash2 className="w-3.5 h-3.5" />
                        </button>
                      )}
                    </div>
                  );
                })
              )}
            </div>
          </div>

          {/* 2. Quick Companion Selection */}
          <div className="pt-2 border-t border-white/5">
            <div className="flex items-center justify-between px-1 mb-2">
              <span className="text-[11px] font-bold uppercase tracking-wider text-slate-400 flex items-center gap-1">
                <Users className="w-3.5 h-3.5 text-purple-400" />
                <span>{user.gender === 'male' ? 'মেয়ে সাথী বেছে নিন' : 'ছেলে সাথী বেছে নিন'}</span>
              </span>
            </div>

            <div className="grid grid-cols-3 gap-1.5">
              {availableCompanions.map((comp) => {
                const isSelected = comp.id === currentCompanion.id;
                return (
                  <button
                    key={comp.id}
                    onClick={() => onSelectCompanion(comp, user.gender)}
                    className={`p-1.5 rounded-xl border flex flex-col items-center text-center transition-all ${
                      isSelected
                        ? 'border-rose-500 bg-rose-500/20 text-white shadow-md'
                        : 'border-white/5 bg-white/5 text-slate-400 hover:text-white hover:bg-white/10'
                    }`}
                  >
                    <div className="relative mb-1">
                      <img
                        src={comp.avatar}
                        alt={comp.name}
                        className="w-9 h-9 rounded-full object-cover ring-1 ring-white/20"
                      />
                      {isSelected && (
                        <span className="absolute -bottom-0.5 -right-0.5 w-2.5 h-2.5 rounded-full bg-emerald-400 ring-2 ring-[#0f121d]" />
                      )}
                    </div>
                    <span className="text-[10px] font-bold truncate max-w-full">
                      {comp.bengaliName}
                    </span>
                    <span className="text-[9px] text-slate-400 truncate">
                      {comp.relationshipType === 'romantic' ? 'প্রেমিকা' : 'বন্ধু'}
                    </span>
                  </button>
                );
              })}
            </div>
          </div>

          {/* 3. Mood Tracker Bar */}
          <div className="pt-2 border-t border-white/5">
            <div className="flex items-center justify-between px-1 mb-2">
              <span className="text-[11px] font-bold uppercase tracking-wider text-slate-400 flex items-center gap-1">
                <Sparkles className="w-3.5 h-3.5 text-amber-400" />
                <span>আজ তোমার মন কেমন?</span>
              </span>
            </div>

            <div className="flex flex-wrap gap-1.5">
              {moodOptions.map((opt) => (
                <button
                  key={opt.mood}
                  onClick={() => {
                    onSelectMood(opt.mood, opt.prompt);
                    if (window.innerWidth < 1024) onClose();
                  }}
                  className={`px-2.5 py-1.5 rounded-xl text-xs bg-white/5 border border-white/5 transition-all flex items-center gap-1.5 ${opt.color}`}
                >
                  <span>{opt.icon}</span>
                  <span>{opt.label}</span>
                </button>
              ))}
            </div>
          </div>

          {/* 4. Special Rooms & Features */}
          <div className="pt-2 border-t border-white/5 space-y-1.5">
            <span className="text-[11px] font-bold uppercase tracking-wider text-slate-400 block px-1 mb-1">
              স্পেশাল ফিচারসমূহ
            </span>

            {/* Simulated Voice Call */}
            <button
              onClick={() => {
                onOpenCallModal();
                if (window.innerWidth < 1024) onClose();
              }}
              className="w-full p-2 rounded-xl bg-emerald-500/10 hover:bg-emerald-500/20 text-emerald-300 border border-emerald-500/25 flex items-center justify-between text-xs font-semibold transition-all group"
            >
              <div className="flex items-center gap-2">
                <div className="p-1 rounded-lg bg-emerald-500/20 text-emerald-300 group-hover:scale-110 transition-transform">
                  <PhoneCall className="w-3.5 h-3.5" />
                </div>
                <span>প্রিয় মানুষের ভয়েস কল 📞</span>
              </div>
              <span className="text-[10px] bg-emerald-500/20 px-1.5 py-0.5 rounded text-emerald-300">
                লাইভ
              </span>
            </button>

            {/* Breathing Care Room */}
            <button
              onClick={() => {
                onOpenCareModal();
                if (window.innerWidth < 1024) onClose();
              }}
              className="w-full p-2 rounded-xl bg-purple-500/10 hover:bg-purple-500/20 text-purple-300 border border-purple-500/25 flex items-center justify-between text-xs font-semibold transition-all group"
            >
              <div className="flex items-center gap-2">
                <div className="p-1 rounded-lg bg-purple-500/20 text-purple-300 group-hover:scale-110 transition-transform">
                  <Wind className="w-3.5 h-3.5" />
                </div>
                <span>শ্বাস-ব্যায়াম ও মানসিক প্রশান্তি</span>
              </div>
              <span className="text-[10px] bg-purple-500/20 px-1.5 py-0.5 rounded text-purple-300">
                কেয়ার
              </span>
            </button>

            {/* Cartoon / Gender Switcher Modal */}
            <button
              onClick={() => {
                onOpenCartoonModal();
                if (window.innerWidth < 1024) onClose();
              }}
              className="w-full p-2 rounded-xl bg-white/5 hover:bg-white/10 text-slate-300 hover:text-white border border-white/10 flex items-center justify-between text-xs font-medium transition-all"
            >
              <div className="flex items-center gap-2">
                <span className="text-base">{user.gender === 'male' ? '👦' : '👧'}</span>
                <span>ছেলে/মেয়ে কার্টুন পরিবর্তন</span>
              </div>
              <span className="text-[10px] text-slate-400">
                {user.gender === 'male' ? 'ছেলে' : 'মেয়ে'}
              </span>
            </button>
          </div>

          {/* 5. VIP Card Banner */}
          <div className="pt-2 border-t border-white/5">
            <div
              onClick={() => {
                onOpenPremiumModal();
                if (window.innerWidth < 1024) onClose();
              }}
              className="cursor-pointer p-3 rounded-2xl bg-gradient-to-br from-amber-500/15 via-rose-500/10 to-purple-500/15 border border-amber-500/30 hover:border-amber-500/60 transition-all shadow-md group"
            >
              <div className="flex items-center justify-between mb-1">
                <div className="flex items-center gap-1.5 text-amber-300 font-bold text-xs">
                  <Crown className="w-4 h-4 text-amber-400 group-hover:rotate-12 transition-transform" />
                  <span>ভিআইপি মেম্বারশিপ</span>
                </div>
                <span className="text-[10px] bg-amber-500/20 text-amber-300 px-1.5 py-0.5 rounded-full font-bold">
                  {user.isPremium ? 'একটিভ ✨' : 'আপগ্রেড'}
                </span>
              </div>
              <p className="text-[11px] text-slate-300 leading-tight">
                {user.isPremium
                  ? 'আপনি ভিআইপি! আনলিমিটেড ফটো শেয়ার ও প্রিয় ডাকনাম সক্রিয়।'
                  : 'ছবি শেয়ার ও স্পেশাল ভয়েস কলের জন্য ভিআইপি মেম্বারশিপ নিন।'}
              </p>
            </div>
          </div>
        </div>

        {/* Footer User Profile & Login / Logout */}
        <div className="p-3 bg-[#131726] border-t border-white/10 flex items-center justify-between">
          <div
            onClick={onOpenAuthModal}
            className="flex items-center gap-2 cursor-pointer group flex-1 min-w-0 mr-2"
          >
            <div className="w-8 h-8 rounded-full bg-rose-500/20 border border-rose-500/40 flex items-center justify-center text-sm font-bold text-rose-300 shrink-0">
              {user.gender === 'male' ? '👦' : '👧'}
            </div>
            <div className="truncate">
              <span className="text-xs font-bold text-white group-hover:text-rose-400 transition-colors block truncate">
                {user.isLoggedIn ? (user.name || 'বেনামী সদস্য') : 'গেস্ট ইউজার'}
              </span>
              <span className="text-[10px] text-slate-400 block">
                {user.isLoggedIn ? 'লগইন করা আছে' : 'লগইন করুন'}
              </span>
            </div>
          </div>

          <button
            onClick={onOpenAuthModal}
            className="p-2 rounded-xl bg-white/5 hover:bg-white/10 text-slate-400 hover:text-white transition-colors"
            title={user.isLoggedIn ? 'প্রোফাইল সেটিংস' : 'লগইন'}
          >
            <LogIn className="w-4 h-4" />
          </button>
        </div>
      </aside>
    </>
  );
};

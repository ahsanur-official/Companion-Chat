import React from 'react';
import { Heart, Sparkles, UserCheck, Crown, RefreshCw, Users, LogIn, PhoneCall, Menu, Plus } from 'lucide-react';
import { Companion, UserAccount, UserGender } from '../types';

interface NavbarProps {
  currentCompanion: Companion;
  user: UserAccount;
  onOpenSidebar: () => void;
  onOpenCompanionModal: () => void;
  onOpenCartoonModal: () => void;
  onOpenAuthModal: () => void;
  onOpenPremiumModal: () => void;
  onOpenCallModal: () => void;
  onNewChat: () => void;
  onToggleUserGender: (gender: UserGender) => void;
}

export const Navbar: React.FC<NavbarProps> = ({
  currentCompanion,
  user,
  onOpenSidebar,
  onOpenCompanionModal,
  onOpenCartoonModal,
  onOpenAuthModal,
  onOpenPremiumModal,
  onOpenCallModal,
  onNewChat,
  onToggleUserGender,
}) => {
  return (
    <header className="sticky top-0 z-30 w-full border-b border-white/10 bg-[#0d0f17]/85 backdrop-blur-md px-3 sm:px-6 py-2.5 transition-all">
      <div className="max-w-7xl mx-auto flex items-center justify-between gap-2">
        {/* Left: Slider Toggle & Companion Info */}
        <div className="flex items-center gap-2 sm:gap-3">
          {/* Slider Trigger Button */}
          <button
            onClick={onOpenSidebar}
            className="p-2 rounded-xl bg-white/5 hover:bg-white/10 text-slate-300 hover:text-white border border-white/10 transition-all flex items-center gap-1.5 shadow-sm active:scale-95"
            title="মেনু ও চ্যাট হিস্ট্রি স্লাইডার খুলুন"
          >
            <Menu className="w-5 h-5 text-rose-400" />
            <span className="text-xs font-semibold hidden md:inline">ফিচার ও চ্যাট</span>
          </button>

          {/* New Chat Quick Button */}
          <button
            onClick={onNewChat}
            className="p-2 sm:px-2.5 sm:py-1.5 rounded-xl bg-rose-600/20 hover:bg-rose-600/30 text-rose-300 border border-rose-500/30 transition-all flex items-center gap-1 text-xs font-medium"
            title="নতুন চ্যাট শুরু করুন"
          >
            <Plus className="w-4 h-4" />
            <span className="hidden sm:inline">নতুন চ্যাট</span>
          </button>

          {/* Companion Avatar & Info */}
          <div className="flex items-center gap-2.5 pl-1">
            <div className="relative">
              <img
                src={currentCompanion.avatar}
                alt={currentCompanion.name}
                className="w-9 h-9 sm:w-10 sm:h-10 rounded-full object-cover ring-2 ring-rose-500/50 shadow-md cursor-pointer hover:scale-105 transition-transform"
                onClick={onOpenCompanionModal}
              />
              <span className="absolute bottom-0 right-0 w-2.5 h-2.5 bg-emerald-500 border-2 border-[#0d0f17] rounded-full animate-pulse" />
            </div>

            <div className="cursor-pointer" onClick={onOpenCompanionModal}>
              <div className="flex items-center gap-1.5">
                <h1 className="text-xs sm:text-sm font-bold text-white tracking-wide flex items-center gap-1 truncate max-w-[110px] sm:max-w-[180px]">
                  {currentCompanion.bengaliName}
                  <span className="text-[11px] text-rose-400 font-normal">({currentCompanion.name})</span>
                </h1>
                {user.isPremium && (
                  <span className="bg-amber-500/20 text-amber-300 text-[10px] font-semibold px-1.5 py-0.2 rounded-full border border-amber-500/30 hidden sm:flex items-center gap-0.5">
                    <Crown className="w-2.5 h-2.5" /> VIP
                  </span>
                )}
              </div>
              <p className="text-[10px] sm:text-[11px] text-slate-400 flex items-center gap-1 truncate max-w-[120px] sm:max-w-[200px]">
                <span className="inline-block w-1.5 h-1.5 rounded-full bg-emerald-400 shrink-0"></span>
                {currentCompanion.roleTitleBengali} • <span className="text-rose-400">অনলাইন</span>
              </p>
            </div>
          </div>
        </div>

        {/* Action Controls */}
        <div className="flex items-center gap-1.5 sm:gap-2">
          {/* Cartoon Character Selection Pill */}
          <button
            onClick={onOpenCartoonModal}
            className="flex items-center gap-1 px-2.5 py-1.5 rounded-xl bg-gradient-to-r from-rose-500/20 to-purple-500/20 hover:from-rose-500/30 hover:to-purple-500/30 text-rose-300 border border-rose-500/30 text-xs font-semibold transition-all shadow-sm"
            title="কার্টুন মোডে ছেলে বা মেয়ে নির্বাচন করুন"
          >
            <span className="text-sm">{user.gender === 'male' ? '👦' : '👧'}</span>
            <span className="hidden sm:inline">{user.gender === 'male' ? 'আমি ছেলে' : 'আমি মেয়ে'}</span>
          </button>

          {/* Change Companion button */}
          <button
            onClick={onOpenCompanionModal}
            className="flex items-center gap-1 px-2 py-1.5 rounded-xl bg-white/5 hover:bg-white/10 text-slate-300 hover:text-white text-xs font-medium border border-white/10 transition-all"
            title="সাথী বা রূপ পরিবর্তন করুন"
          >
            <Users className="w-3.5 h-3.5 text-rose-400" />
            <span className="hidden md:inline">সাথী বদলান</span>
          </button>

          {/* Voice Call Button */}
          <button
            onClick={onOpenCallModal}
            className="flex items-center gap-1 px-2 sm:px-2.5 py-1.5 rounded-xl bg-emerald-500/15 hover:bg-emerald-500/25 text-emerald-300 text-xs font-medium border border-emerald-500/30 transition-all animate-pulse"
            title="ভয়েস কল করুন"
          >
            <PhoneCall className="w-3.5 h-3.5" />
            <span className="hidden sm:inline">কল</span>
          </button>

          {/* VIP Premium Button */}
          <button
            onClick={onOpenPremiumModal}
            className={`flex items-center gap-1 px-2.5 sm:px-3 py-1.5 rounded-xl text-xs font-semibold transition-all shadow-sm ${
              user.isPremium
                ? 'bg-gradient-to-r from-amber-500/20 to-orange-500/20 text-amber-300 border border-amber-500/40'
                : 'bg-gradient-to-r from-amber-500 to-rose-500 text-white hover:brightness-110 shadow-amber-500/20'
            }`}
          >
            <Crown className="w-3.5 h-3.5" />
            <span>{user.isPremium ? 'VIP' : 'প্রিমিয়াম'}</span>
          </button>

          {/* Auth Button */}
          {user.isLoggedIn ? (
            <button
              onClick={onOpenAuthModal}
              className="flex items-center gap-1 px-2 sm:px-2.5 py-1.5 rounded-xl bg-white/10 hover:bg-white/15 text-white text-xs font-medium border border-white/10 transition-all"
              title="প্রোফাইল সেটিংস"
            >
              <UserCheck className="w-3.5 h-3.5 text-emerald-400" />
              <span className="max-w-[60px] truncate hidden sm:inline">{user.name || 'সাথী'}</span>
            </button>
          ) : (
            <button
              onClick={onOpenAuthModal}
              className="flex items-center gap-1 px-2.5 py-1.5 rounded-xl bg-rose-600/90 hover:bg-rose-600 text-white text-xs font-medium transition-all shadow-sm"
              title="লগইন করুন"
            >
              <LogIn className="w-3.5 h-3.5" />
              <span className="hidden xs:inline">লগইন</span>
            </button>
          )}
        </div>
      </div>
    </header>
  );
};

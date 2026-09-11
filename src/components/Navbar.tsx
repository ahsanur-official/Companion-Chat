import React, { useState, useRef, useEffect } from 'react';
import {
  PhoneCall,
  Menu,
  Plus,
  Edit3,
  Sun,
  Heart,
  MessageSquare,
  MoreVertical,
  Users,
  Sparkles,
  Coins,
  BookHeart,
  Flame,
  Image as ImageIcon,
  Globe,
} from 'lucide-react';
import { Companion, UserAccount, AppSettings } from '../types';
import { getTranslation } from '../utils/translations';

interface NavbarProps {
  currentCompanion: Companion;
  user: UserAccount;
  settings?: AppSettings;
  onUpdateSettings?: (newPartial: Partial<AppSettings>) => void;
  isSidebarOpen?: boolean;
  onOpenSidebar: () => void;
  onOpenChatsSlider?: () => void;
  chatCount?: number;
  onOpenCompanionModal?: () => void;
  onOpenCustomCompanionModal?: () => void;
  onOpenMorningGreetingModal?: () => void;
  onOpenEmotionTrackerModal?: () => void;
  onOpenCallModal: () => void;
  onNewChat: () => void;
  onOpenAuthModal?: () => void;
  onOpenPremiumModal?: () => void;
  onOpenWallpaperModal?: () => void;
  onOpenMemoryBookModal?: () => void;
  onOpenLoveMeterModal?: () => void;
}

export const Navbar: React.FC<NavbarProps> = ({
  currentCompanion,
  user,
  settings,
  onUpdateSettings,
  isSidebarOpen = false,
  onOpenSidebar,
  onOpenChatsSlider,
  chatCount = 1,
  onOpenCompanionModal,
  onOpenCustomCompanionModal,
  onOpenMorningGreetingModal,
  onOpenEmotionTrackerModal,
  onOpenCallModal,
  onNewChat,
  onOpenAuthModal,
  onOpenPremiumModal,
  onOpenWallpaperModal,
  onOpenMemoryBookModal,
  onOpenLoveMeterModal,
}) => {
  const [isMoreMenuOpen, setIsMoreMenuOpen] = useState(false);
  const moreMenuRef = useRef<HTMLDivElement>(null);

  const currentLang = settings?.language === 'bn' ? 'bn' : 'en';
  const t = getTranslation(currentLang);

  // Close dropdown on outside click
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (moreMenuRef.current && !moreMenuRef.current.contains(event.target as Node)) {
        setIsMoreMenuOpen(false);
      }
    };
    if (isMoreMenuOpen) {
      document.addEventListener('mousedown', handleClickOutside);
    }
    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, [isMoreMenuOpen]);

  const toggleLanguage = () => {
    const nextLang = currentLang === 'en' ? 'bn' : 'en';
    onUpdateSettings?.({ language: nextLang });
  };

  return (
    <header
      className={`sticky top-0 z-30 shrink-0 w-full border-b border-white/10 bg-[#0b0e19]/95 backdrop-blur-xl px-2.5 sm:px-6 lg:px-8 h-14 sm:h-16 flex items-center shadow-sm transition-[padding] duration-300 ease-in-out ${
        isSidebarOpen ? 'lg:pl-80' : 'lg:pl-0'
      }`}
    >
      <div className="w-full max-w-7xl 2xl:max-w-[1600px] mx-auto flex items-center justify-between gap-1.5 sm:gap-2">
        {/* Left: Menu/Drawer & Companion Info */}
        <div className="flex items-center gap-2 sm:gap-3.5 min-w-0 flex-1">
          {/* Circular Menu Button */}
          <button
            onClick={onOpenSidebar}
            className="w-9 h-9 rounded-full bg-white/5 hover:bg-white/10 text-slate-200 hover:text-white border border-white/10 flex items-center justify-center transition-all active:scale-95 shrink-0 relative"
            title={t.chats}
            aria-label={t.chats}
          >
            <Menu className="w-4 h-4 text-rose-400" />
            {chatCount > 1 && (
              <span className="absolute -top-0.5 -right-0.5 w-2.5 h-2.5 rounded-full bg-rose-500 ring-2 ring-[#0b0e19]" />
            )}
          </button>

          {/* Active Companion Profile */}
          <div
            className="flex items-center gap-2 sm:gap-3 cursor-pointer group min-w-0 select-none"
            onClick={onOpenCompanionModal || onOpenSidebar}
            title={t.companionInfo}
          >
            <div className="relative shrink-0">
              <img
                src={currentCompanion.avatar}
                alt={currentCompanion.name}
                referrerPolicy="no-referrer"
                className="w-8 h-8 sm:w-10 sm:h-10 rounded-full object-cover ring-2 ring-rose-500/40 shadow group-hover:scale-105 transition-transform"
              />
              <span className="absolute -bottom-0.5 -right-0.5 w-2.5 h-2.5 bg-emerald-400 border-2 border-[#0b0e19] rounded-full animate-pulse" />
            </div>

            <div className="min-w-0 max-w-[125px] xs:max-w-[190px] sm:max-w-none">
              <div className="flex items-center gap-1.5">
                <h1 className="text-xs sm:text-base font-bold text-white tracking-wide group-hover:text-rose-300 transition-colors truncate leading-tight">
                  {currentLang === 'bn' ? currentCompanion.bengaliName : currentCompanion.name}
                </h1>
                {onOpenCustomCompanionModal && (
                  <button
                    type="button"
                    onClick={(e) => {
                      e.stopPropagation();
                      onOpenCustomCompanionModal();
                    }}
                    className="p-1 rounded-md text-slate-400 hover:text-rose-300 hover:bg-white/10 transition-colors hidden sm:inline-flex"
                    title={t.customCompanion}
                  >
                    <Edit3 className="w-3 h-3 text-rose-400" />
                  </button>
                )}
              </div>
              <p className="text-[10px] sm:text-xs text-slate-400 flex items-center gap-1.5 leading-none mt-0.5 truncate">
                <span className="inline-block w-1.5 h-1.5 rounded-full bg-emerald-400 shrink-0" />
                <span className="text-emerald-400 font-medium">{t.online}</span>
                <span className="text-slate-600 hidden xs:inline">•</span>
                <span className="truncate text-slate-400 hidden xs:inline">
                  {currentLang === 'bn' ? currentCompanion.roleTitleBengali : currentCompanion.roleTitle}
                </span>
              </p>
            </div>
          </div>
        </div>

        {/* Right: Actions */}
        <div className="flex items-center gap-1.5 sm:gap-2 shrink-0">
          {/* Instant Language Toggle (EN / বাং) */}
          <button
            onClick={toggleLanguage}
            className="h-8 sm:h-9 px-2 sm:px-2.5 rounded-full bg-white/5 hover:bg-white/10 text-slate-300 hover:text-white border border-white/10 flex items-center gap-1 sm:gap-1.5 transition-all text-xs font-semibold active:scale-95 cursor-pointer"
            title={t.languageTogglePrompt}
          >
            <Globe className="w-3.5 h-3.5 text-rose-400" />
            <span className={currentLang === 'bn' ? 'font-bengali' : ''}>
              {currentLang === 'en' ? 'EN' : 'বাং'}
            </span>
          </button>

          {/* Desktop Only: Dedicated 'Chats' Button with Count */}
          <button
            onClick={onOpenChatsSlider || onOpenSidebar}
            className="hidden md:flex px-2.5 py-1.5 rounded-xl bg-gradient-to-r from-rose-500/15 to-pink-500/15 hover:from-rose-500/25 hover:to-pink-500/25 active:scale-95 text-rose-200 hover:text-white border border-rose-500/30 items-center justify-center gap-1.5 transition-all shadow-sm text-xs font-semibold"
            title={t.chats}
          >
            <MessageSquare className="w-3.5 h-3.5 text-rose-400" />
            <span>{t.chats}</span>
            <span className="bg-rose-500/30 text-[10px] text-rose-200 px-1.5 py-0.2 rounded-full font-bold">
              {chatCount}
            </span>
          </button>

          {/* Desktop Only: Morning Greeting Button */}
          {onOpenMorningGreetingModal && (
            <button
              onClick={onOpenMorningGreetingModal}
              className="hidden lg:flex px-2.5 py-1.5 rounded-xl bg-amber-500/15 hover:bg-amber-500/25 active:scale-95 text-amber-300 border border-amber-500/30 items-center justify-center gap-1.5 transition-all shadow-sm text-xs font-semibold"
              title={t.morningGreeting}
            >
              <Sun className="w-3.5 h-3.5 text-amber-400" />
              <span>{t.morningGreeting}</span>
            </button>
          )}

          {/* Desktop Only: Emotion Tracker Button */}
          {onOpenEmotionTrackerModal && (
            <button
              onClick={onOpenEmotionTrackerModal}
              className="hidden lg:flex px-2.5 py-1.5 rounded-xl bg-pink-500/15 hover:bg-pink-500/25 active:scale-95 text-pink-300 border border-pink-500/30 items-center justify-center gap-1.5 transition-all shadow-sm text-xs font-semibold"
              title={t.moodTracker}
            >
              <Heart className="w-3.5 h-3.5 text-pink-400 fill-pink-400/30" />
              <span>{t.moodTracker}</span>
            </button>
          )}

          {/* Voice Call Button - Icon-only on mobile, full on tablet/desktop */}
          <button
            onClick={onOpenCallModal}
            className="w-8 h-8 sm:w-auto sm:h-9 px-0 sm:px-3.5 rounded-full bg-emerald-500/20 hover:bg-emerald-500/30 active:scale-95 text-emerald-300 hover:text-white border border-emerald-500/40 flex items-center justify-center gap-1.5 transition-all shadow-sm cursor-pointer shrink-0"
            title={t.voiceCall}
          >
            <PhoneCall className="w-3.5 h-3.5 sm:w-4 sm:h-4 text-emerald-400 shrink-0" />
            <span className="hidden sm:inline text-xs font-bold">{t.voiceCall}</span>
          </button>

          {/* Desktop Only: New Chat Button */}
          <button
            onClick={onNewChat}
            className="hidden sm:flex h-9 px-3 rounded-xl bg-rose-500/15 hover:bg-rose-500/25 active:scale-95 text-rose-300 hover:text-white border border-rose-500/30 items-center justify-center gap-1.5 transition-all shadow-sm text-xs font-semibold cursor-pointer"
            title={t.newChat}
          >
            <Plus className="w-4 h-4 stroke-[2.5]" />
            <span>{t.newChat}</span>
          </button>

          {/* Mobile & Tablet More Options Dropdown (⋮) */}
          <div className="relative" ref={moreMenuRef}>
            <button
              onClick={() => setIsMoreMenuOpen(!isMoreMenuOpen)}
              className="w-8 h-8 sm:w-9 sm:h-9 rounded-full bg-white/5 hover:bg-white/10 active:scale-95 text-slate-300 hover:text-white border border-white/10 flex items-center justify-center transition-all shadow-sm cursor-pointer"
              title="More"
              aria-label="More"
            >
              <MoreVertical className="w-3.5 h-3.5 sm:w-4 sm:h-4 text-slate-300" />
            </button>

            {/* Floating Dropdown Menu */}
            {isMoreMenuOpen && (
              <div className="absolute right-0 top-11 w-56 bg-[#121626]/98 backdrop-blur-2xl border border-white/15 rounded-2xl shadow-2xl p-1.5 space-y-1 z-50 animate-in fade-in slide-in-from-top-2 duration-150">
                <button
                  onClick={() => {
                    setIsMoreMenuOpen(false);
                    onNewChat();
                  }}
                  className="w-full px-3 py-2 rounded-xl text-left text-xs font-semibold text-rose-300 hover:text-white hover:bg-rose-500/20 flex items-center gap-2.5 transition-colors"
                >
                  <Plus className="w-4 h-4 text-rose-400" />
                  <span>{t.newChat}</span>
                </button>

                <button
                  onClick={() => {
                    setIsMoreMenuOpen(false);
                    if (onOpenChatsSlider) onOpenChatsSlider();
                    else onOpenSidebar();
                  }}
                  className="w-full px-3 py-2 rounded-xl text-left text-xs font-semibold text-slate-200 hover:text-white hover:bg-white/10 flex items-center justify-between transition-colors"
                >
                  <div className="flex items-center gap-2.5">
                    <MessageSquare className="w-4 h-4 text-rose-400" />
                    <span>{t.chats}</span>
                  </div>
                  <span className="bg-rose-500/30 text-[10px] text-rose-200 px-1.5 py-0.2 rounded-full font-bold">
                    {chatCount}
                  </span>
                </button>

                {onOpenCompanionModal && (
                  <button
                    onClick={() => {
                      setIsMoreMenuOpen(false);
                      onOpenCompanionModal();
                    }}
                    className="w-full px-3 py-2 rounded-xl text-left text-xs font-semibold text-slate-200 hover:text-white hover:bg-white/10 flex items-center gap-2.5 transition-colors"
                  >
                    <Users className="w-4 h-4 text-purple-400" />
                    <span>{t.switchCompanion}</span>
                  </button>
                )}

                {onOpenCustomCompanionModal && (
                  <button
                    onClick={() => {
                      setIsMoreMenuOpen(false);
                      onOpenCustomCompanionModal();
                    }}
                    className="w-full px-3 py-2 rounded-xl text-left text-xs font-semibold text-slate-200 hover:text-white hover:bg-white/10 flex items-center gap-2.5 transition-colors"
                  >
                    <Edit3 className="w-4 h-4 text-rose-400" />
                    <span>{t.customCompanion}</span>
                  </button>
                )}

                {onOpenMorningGreetingModal && (
                  <button
                    onClick={() => {
                      setIsMoreMenuOpen(false);
                      onOpenMorningGreetingModal();
                    }}
                    className="w-full px-3 py-2 rounded-xl text-left text-xs font-semibold text-slate-200 hover:text-white hover:bg-white/10 flex items-center gap-2.5 transition-colors"
                  >
                    <Sun className="w-4 h-4 text-amber-400" />
                    <span>{t.morningGreeting}</span>
                  </button>
                )}

                {onOpenEmotionTrackerModal && (
                  <button
                    onClick={() => {
                      setIsMoreMenuOpen(false);
                      onOpenEmotionTrackerModal();
                    }}
                    className="w-full px-3 py-2 rounded-xl text-left text-xs font-semibold text-slate-200 hover:text-white hover:bg-white/10 flex items-center gap-2.5 transition-colors"
                  >
                    <Heart className="w-4 h-4 text-pink-400" />
                    <span>{t.moodTracker}</span>
                  </button>
                )}

                {onOpenLoveMeterModal && (
                  <button
                    onClick={() => {
                      setIsMoreMenuOpen(false);
                      onOpenLoveMeterModal();
                    }}
                    className="w-full px-3 py-2 rounded-xl text-left text-xs font-semibold text-rose-300 hover:text-white hover:bg-rose-500/20 flex items-center gap-2.5 transition-colors"
                  >
                    <Flame className="w-4 h-4 text-rose-400" />
                    <span>{t.loveMeter}</span>
                  </button>
                )}

                {onOpenMemoryBookModal && (
                  <button
                    onClick={() => {
                      setIsMoreMenuOpen(false);
                      onOpenMemoryBookModal();
                    }}
                    className="w-full px-3 py-2 rounded-xl text-left text-xs font-semibold text-pink-300 hover:text-white hover:bg-pink-500/20 flex items-center gap-2.5 transition-colors"
                  >
                    <BookHeart className="w-4 h-4 text-pink-400" />
                    <span>{t.memoryBook}</span>
                  </button>
                )}

                {onOpenWallpaperModal && (
                  <button
                    onClick={() => {
                      setIsMoreMenuOpen(false);
                      onOpenWallpaperModal();
                    }}
                    className="w-full px-3 py-2 rounded-xl text-left text-xs font-semibold text-purple-300 hover:text-white hover:bg-purple-500/20 flex items-center gap-2.5 transition-colors"
                  >
                    <ImageIcon className="w-4 h-4 text-purple-400" />
                    <span>{t.wallpapers}</span>
                  </button>
                )}
              </div>
            )}
          </div>
        </div>
      </div>
    </header>
  );
};


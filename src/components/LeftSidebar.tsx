import React, { useState, useMemo, useRef, useEffect } from 'react';
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
  Coins,
  Users,
  Search,
  Download,
  FileText,
  Sliders,
  LogIn,
  LogOut,
  ShieldCheck,
  Smile,
  Frown,
  Coffee,
  Check,
  Type,
  Maximize2,
  RefreshCw,
  Palette,
  Edit3,
  Sun,
  ChevronLeft,
  ChevronRight,
  BookHeart,
  Flame,
  Image as ImageIcon,
  Globe,
  Clock,
} from 'lucide-react';
import {
  ChatSession,
  Companion,
  UserAccount,
  UserGender,
  UserMood,
  AppSettings,
  BrowserQuotaState,
} from '../types';
import { COMPANIONS } from '../data/companions';
import { getTranslation } from '../utils/translations';

interface LeftSidebarProps {
  isOpen: boolean;
  onClose: () => void;
  sessions: ChatSession[];
  activeSessionId: string;
  onSelectSession: (sessionId: string) => void;
  onNewChat: () => void;
  onDeleteSession: (sessionId: string, e: React.MouseEvent) => void;
  onClearAllChats?: () => void;
  onExportChat?: () => void;
  currentCompanion: Companion;
  onSelectCompanion: (companion: Companion, targetGender: UserGender) => void;
  user: UserAccount;
  onToggleUserGender?: (gender: UserGender) => void;
  onOpenCartoonModal: () => void;
  onOpenCustomModal?: () => void;
  onOpenMorningGreetingModal?: () => void;
  onOpenEmotionTrackerModal?: () => void;
  onOpenAuthModal: () => void;
  onOpenPremiumModal: () => void;
  onOpenCallModal: () => void;
  onOpenCareModal: () => void;
  onOpenSettingsModal: () => void;
  onSelectMood: (mood: UserMood, promptText: string) => void;
  settings?: AppSettings;
  onUpdateSettings?: (newPartial: Partial<AppSettings>) => void;
  initialTab?: 'chats' | 'all' | 'companions' | 'care';
  onOpenWallpaperModal?: () => void;
  onOpenMemoryBookModal?: () => void;
  onOpenLoveMeterModal?: () => void;
  browserQuota?: BrowserQuotaState;
}

export const LeftSidebar: React.FC<LeftSidebarProps> = ({
  isOpen,
  onClose,
  sessions,
  activeSessionId,
  onSelectSession,
  onNewChat,
  onDeleteSession,
  onClearAllChats,
  onExportChat,
  currentCompanion,
  onSelectCompanion,
  user,
  onToggleUserGender,
  onOpenCartoonModal,
  onOpenCustomModal,
  onOpenMorningGreetingModal,
  onOpenEmotionTrackerModal,
  onOpenAuthModal,
  onOpenPremiumModal,
  onOpenCallModal,
  onOpenCareModal,
  onOpenSettingsModal,
  onSelectMood,
  settings,
  onUpdateSettings,
  initialTab = 'chats',
  onOpenWallpaperModal,
  onOpenMemoryBookModal,
  onOpenLoveMeterModal,
  browserQuota,
}) => {
  const currentLang = settings?.language === 'bn' ? 'bn' : 'en';
  const t = getTranslation(currentLang);

  // Search state for chat history
  const [searchQuery, setSearchQuery] = useState('');
  // Active Tab defaults to 'chats' so clicking chat shows ONLY all chats!
  const [activeTab, setActiveTab] = useState<'all' | 'chats' | 'companions' | 'care'>(initialTab);
  const sliderRef = useRef<HTMLDivElement>(null);

  // Sync tab whenever drawer opens
  useEffect(() => {
    if (isOpen) {
      setActiveTab(initialTab || 'chats');
    }
  }, [isOpen, initialTab]);

  const handleSlide = (direction: 'left' | 'right') => {
    if (sliderRef.current) {
      const scrollAmount = direction === 'left' ? -220 : 220;
      sliderRef.current.scrollBy({ left: scrollAmount, behavior: 'smooth' });
    }
  };

  // Filtered companions according to target gender
  const availableCompanions = useMemo(() => {
    return COMPANIONS.filter((c) => c.targetUserGender === user.gender);
  }, [user.gender]);

  // Filtered chat sessions based on search
  const filteredSessions = useMemo(() => {
    if (!searchQuery.trim()) return sessions;
    const q = searchQuery.toLowerCase();
    return sessions.filter(
      (s) =>
        s.title.toLowerCase().includes(q) ||
        (s.preview && s.preview.toLowerCase().includes(q))
    );
  }, [sessions, searchQuery]);

  const moodOptions: Array<{
    mood: UserMood;
    label: string;
    icon: string;
    prompt: string;
    color: string;
  }> = [
    {
      mood: 'lonely',
      label: currentLang === 'en' ? 'Feeling Lonely' : 'অনেক একা লাগছে',
      icon: '🥺',
      prompt:
        currentLang === 'en'
          ? "I'm feeling very lonely today, and don't feel like talking to anyone except you..."
          : 'আমার আজ খুব একা একা লাগছে, কারো সাথে কথা বলতে ইচ্ছে করছে না তুমি ছাড়া...',
      color: 'hover:border-purple-500/50 hover:bg-purple-500/15 text-purple-300',
    },
    {
      mood: 'sad',
      label: currentLang === 'en' ? 'Feeling Down' : 'মন খারাপ',
      icon: '💔',
      prompt:
        currentLang === 'en'
          ? 'My heart feels heavy today. Could you comfort me a bit, sweetie?'
          : 'মনটা খুব ভারী হয়ে আছে, একটু সান্ত্বনা দেবে প্রিয়?',
      color: 'hover:border-rose-500/50 hover:bg-rose-500/15 text-rose-300',
    },
    {
      mood: 'romantic',
      label: currentLang === 'en' ? 'Love & Romance' : 'ভালোবাসা ও আদর',
      icon: '💖',
      prompt:
        currentLang === 'en'
          ? "I've been thinking about you so much! How much do you love me?"
          : 'তোমার কথা খুব মনে পড়ছে! তুমি আমাকে কতটা ভালোবাসো বলো তো সোনা?',
      color: 'hover:border-pink-500/50 hover:bg-pink-500/15 text-pink-300',
    },
    {
      mood: 'happy',
      label: currentLang === 'en' ? 'Super Happy' : 'খুব খুশি',
      icon: '😊',
      prompt:
        currentLang === 'en'
          ? 'Today has been wonderful! I want to share all my happiness with you.'
          : 'আজকের দিনটা দারুণ সুন্দর কেটেছে! তোমার সাথে মনের সব কথা ভাগ করতে চাই।',
      color: 'hover:border-emerald-500/50 hover:bg-emerald-500/15 text-emerald-300',
    },
    {
      mood: 'tired',
      label: currentLang === 'en' ? 'Tired & Sleepy' : 'ক্লান্ত ও উদাস',
      icon: '😴',
      prompt:
        currentLang === 'en'
          ? 'I feel so exhausted from a long day. Will you talk to me gently?'
          : 'সারাদিনের ব্যস্ততায় খুব ক্লান্ত লাগছে। মিষ্টি করে একটু কথা বলবে?',
      color: 'hover:border-amber-500/50 hover:bg-amber-500/15 text-amber-300',
    },
  ];

  return (
    <>
      {/* Mobile Backdrop */}
      {isOpen && (
        <div
          onClick={onClose}
          className="fixed inset-0 bg-black/75 backdrop-blur-sm z-40 lg:hidden transition-opacity"
        />
      )}

      {/* Advanced Slider Drawer */}
      <aside
        className={`fixed top-0 left-0 bottom-0 z-40 w-80 bg-[#0b0e18]/95 backdrop-blur-xl border-r border-white/10 shadow-2xl flex flex-col transition-transform duration-300 ease-in-out ${
          isOpen ? 'translate-x-0' : '-translate-x-full'
        }`}
      >
        {/* 1. Header with Brand & Close Button */}
        <div className="p-3.5 sm:p-4 border-b border-white/10 flex items-center justify-between bg-[#111627]/90">
          <div className="flex items-center gap-2.5">
            <div className="w-8 h-8 rounded-xl bg-gradient-to-tr from-rose-500 via-pink-500 to-purple-600 flex items-center justify-center text-white shadow-lg shadow-rose-500/25">
              <Heart className="w-4 h-4 fill-white text-white animate-pulse" />
            </div>
            <div>
              <div className="flex items-center gap-1.5">
                <h2 className="text-sm font-bold text-white tracking-wide">{t.appName}</h2>
                <span className="text-[10px] bg-rose-500/20 text-rose-300 px-1.5 py-0.2 rounded font-semibold border border-rose-500/30">
                  AI
                </span>
              </div>
              <p className="text-[10px] text-slate-400">{t.tagline}</p>
            </div>
          </div>

          <button
            onClick={onClose}
            className="p-1.5 rounded-lg text-slate-400 hover:text-white hover:bg-white/10 transition-colors"
            title={t.close}
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* 2. Primary Language Selection Switcher (English / বাংলা) */}
        <div className="px-3.5 py-2.5 bg-[#0e1222] border-b border-white/10 flex items-center justify-between gap-2">
          <div className="flex items-center gap-1.5 text-xs text-slate-300 font-semibold">
            <Globe className="w-3.5 h-3.5 text-rose-400" />
            <span>{t.language}:</span>
          </div>
          <div className="flex items-center bg-black/40 p-0.5 rounded-xl border border-white/10 shadow-inner">
            <button
              type="button"
              onClick={() => onUpdateSettings?.({ language: 'en' })}
              className={`px-3 py-1 rounded-lg text-xs font-bold transition-all ${
                currentLang === 'en'
                  ? 'bg-gradient-to-r from-rose-600 to-pink-600 text-white shadow-md'
                  : 'text-slate-400 hover:text-white'
              }`}
            >
              English
            </button>
            <button
              type="button"
              onClick={() => onUpdateSettings?.({ language: 'bn' })}
              className={`px-3 py-1 rounded-lg text-xs font-bold transition-all font-bengali ${
                currentLang === 'bn'
                  ? 'bg-gradient-to-r from-rose-600 to-pink-600 text-white shadow-md'
                  : 'text-slate-400 hover:text-white'
              }`}
            >
              বাংলা
            </button>
          </div>
        </div>

        {/* 3. New Chat Button & Search Bar */}
        <div className="p-3 border-b border-white/5 space-y-2 bg-[#0d1120]">
          <button
            onClick={() => {
              onNewChat();
              if (window.innerWidth < 1024) onClose();
            }}
            className="w-full py-2.5 px-3.5 rounded-xl bg-gradient-to-r from-rose-600 via-pink-600 to-purple-600 hover:from-rose-500 hover:to-purple-500 text-white font-bold text-xs sm:text-sm shadow-lg shadow-rose-600/25 flex items-center justify-center gap-2 transition-all hover:scale-[1.01] active:scale-[0.98]"
          >
            <Plus className="w-4 h-4 stroke-[2.5]" />
            <span>{t.newChat}</span>
          </button>

          {/* Chat Search Box */}
          <div className="relative">
            <Search className="w-3.5 h-3.5 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2 pointer-events-none" />
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder={t.searchChats}
              className="w-full pl-8 pr-7 py-1.5 text-xs bg-white/5 border border-white/10 rounded-xl text-white placeholder:text-slate-500 focus:outline-none focus:border-rose-500/50 transition-all"
            />
            {searchQuery && (
              <button
                onClick={() => setSearchQuery('')}
                className="absolute right-2.5 top-1/2 -translate-y-1/2 text-slate-400 hover:text-white"
              >
                <X className="w-3.5 h-3.5" />
              </button>
            )}
          </div>
        </div>

        {/* 4. Segmented Navigation Tabs */}
        <div className="flex border-b border-white/5 px-2 pt-2 bg-[#0d1120]/60 text-xs font-semibold gap-1">
          <button
            onClick={() => setActiveTab('chats')}
            className={`flex-1 py-2 rounded-xl text-center transition-all flex items-center justify-center gap-1.5 font-bold ${
              activeTab === 'chats'
                ? 'bg-gradient-to-r from-rose-500/25 to-pink-500/20 text-rose-200 border border-rose-500/40 shadow-sm'
                : 'text-slate-400 hover:text-slate-200 hover:bg-white/5'
            }`}
          >
            <MessageSquare className="w-3.5 h-3.5 text-rose-400" />
            <span>{t.tabChats} ({sessions.length})</span>
          </button>
          <button
            onClick={() => setActiveTab('companions')}
            className={`flex-1 py-2 rounded-xl text-center transition-all flex items-center justify-center gap-1.5 ${
              activeTab === 'companions'
                ? 'bg-gradient-to-r from-purple-500/25 to-indigo-500/20 text-purple-200 border border-purple-500/40 shadow-sm'
                : 'text-slate-400 hover:text-slate-200 hover:bg-white/5'
            }`}
          >
            <Users className="w-3.5 h-3.5 text-purple-400" />
            <span>{t.tabCompanions}</span>
          </button>
          <button
            onClick={() => setActiveTab('care')}
            className={`flex-1 py-2 rounded-xl text-center transition-all flex items-center justify-center gap-1.5 ${
              activeTab === 'care'
                ? 'bg-gradient-to-r from-pink-500/25 to-rose-500/20 text-pink-200 border border-pink-500/40 shadow-sm'
                : 'text-slate-400 hover:text-slate-200 hover:bg-white/5'
            }`}
          >
            <Heart className="w-3.5 h-3.5 text-pink-400" />
            <span>{t.tabCare}</span>
          </button>
        </div>

        {/* 4. Main Scrollable Body */}
        <div className="flex-1 overflow-y-auto p-3 space-y-4 no-scrollbar">
          {/* Section: Chat Sessions List & Slider */}
          {(activeTab === 'all' || activeTab === 'chats') && (
            <div className="space-y-3.5">
              {/* Horizontal Chat Slider / Carousel (slider thakbe) */}
              {filteredSessions.length > 0 && (
                <div className="space-y-1.5 pb-1">
                  <div className="flex items-center justify-between px-1">
                    <span className="text-[11px] font-bold text-rose-300 flex items-center gap-1.5">
                      <Sliders className="w-3.5 h-3.5 text-rose-400" />
                      <span>{currentLang === 'en' ? `Chat Slider (${filteredSessions.length})` : `চ্যাট স্লাইডার (${filteredSessions.length})`}</span>
                    </span>
                    <div className="flex items-center gap-1">
                      <button
                        onClick={() => handleSlide('left')}
                        className="p-1 rounded-lg bg-white/5 hover:bg-white/10 text-slate-300 hover:text-white transition-colors border border-white/5 active:scale-95"
                        title={currentLang === 'en' ? 'Slide Left' : 'বামে স্লাইড করুন'}
                      >
                        <ChevronLeft className="w-3.5 h-3.5" />
                      </button>
                      <button
                        onClick={() => handleSlide('right')}
                        className="p-1 rounded-lg bg-white/5 hover:bg-white/10 text-slate-300 hover:text-white transition-colors border border-white/5 active:scale-95"
                        title={currentLang === 'en' ? 'Slide Right' : 'ডানে স্লাইড করুন'}
                      >
                        <ChevronRight className="w-3.5 h-3.5" />
                      </button>
                    </div>
                  </div>

                  <div
                    ref={sliderRef}
                    className="flex gap-2 overflow-x-auto no-scrollbar scroll-smooth snap-x snap-mandatory py-1 px-0.5"
                  >
                    {filteredSessions.map((session) => {
                      const isActive = session.id === activeSessionId;
                      const sessionCompanion =
                        COMPANIONS.find((c) => c.id === session.companionId) || currentCompanion;

                      return (
                        <div
                          key={session.id}
                          onClick={() => {
                            onSelectSession(session.id);
                            if (window.innerWidth < 1024) onClose();
                          }}
                          className={`snap-start shrink-0 w-[175px] sm:w-[190px] p-2.5 rounded-2xl cursor-pointer transition-all border ${
                            isActive
                              ? 'bg-gradient-to-br from-rose-500/25 via-pink-500/20 to-purple-600/20 border-rose-500/60 shadow-md shadow-rose-950/40 scale-[1.02]'
                              : 'bg-white/5 hover:bg-white/10 border-white/10 hover:border-rose-500/30 text-slate-300 hover:text-white'
                          }`}
                        >
                          <div className="flex items-center gap-2 mb-1.5">
                            <div className="relative shrink-0">
                              <img
                                src={sessionCompanion.avatar}
                                alt={sessionCompanion.name}
                                className="w-7 h-7 rounded-full object-cover ring-2 ring-rose-500/40"
                              />
                              {isActive && (
                                <span className="absolute -bottom-0.5 -right-0.5 w-2 h-2 rounded-full bg-emerald-400 ring-1 ring-[#0b0e19]" />
                              )}
                            </div>
                            <div className="min-w-0 flex-1">
                              <p className="text-[11px] font-bold text-white truncate leading-tight">
                                {session.title}
                              </p>
                              <span className="text-[9px] text-rose-300/80 block truncate">
                                {currentLang === 'en' ? sessionCompanion.name : sessionCompanion.bengaliName}
                              </span>
                            </div>
                          </div>
                          <p className="text-[10px] text-slate-400 line-clamp-2 leading-tight min-h-[28px]">
                            {session.preview || (currentLang === 'en' ? 'New chat started...' : 'নতুন আলাপ শুরু হয়েছে...')}
                          </p>
                          <div className="mt-1.5 flex items-center justify-between text-[9px] text-slate-500">
                            <span>{session.updatedAt}</span>
                            {isActive ? (
                              <span className="text-rose-400 font-semibold flex items-center gap-1">
                                <span className="w-1.5 h-1.5 rounded-full bg-rose-500 animate-pulse" />
                                {currentLang === 'en' ? 'Active' : 'সক্রিয়'}
                              </span>
                            ) : null}
                          </div>
                        </div>
                      );
                    })}
                  </div>
                </div>
              )}

              {/* Complete List of All Chats */}
              <div>
                <div className="flex items-center justify-between px-1 mb-2">
                  <span className="text-[11px] font-bold uppercase tracking-wider text-slate-400 flex items-center gap-1.5">
                    <MessageSquare className="w-3.5 h-3.5 text-rose-400" />
                    <span>{currentLang === 'en' ? `All Chats List (${filteredSessions.length})` : `সব চ্যাট তালিকা (${filteredSessions.length})`}</span>
                  </span>
                  {sessions.length > 1 && onClearAllChats && (
                    <button
                      onClick={onClearAllChats}
                      className="text-[10px] text-slate-400 hover:text-rose-400 transition-colors"
                      title={currentLang === 'en' ? 'Reset all chat history' : 'সব চ্যাট ইতিহাস রিসেট করুন'}
                    >
                      {currentLang === 'en' ? 'Clear All' : 'সব ক্লিয়ার'}
                    </button>
                  )}
                </div>

                <div className="space-y-1.5">
                  {filteredSessions.length === 0 ? (
                    <div className="text-center py-6 px-3 bg-white/5 rounded-2xl border border-white/5">
                      <MessageSquare className="w-8 h-8 text-slate-600 mx-auto mb-2 opacity-50" />
                      <p className="text-xs text-slate-400 font-medium">{currentLang === 'en' ? 'No chats found' : 'কোনো চ্যাট পাওয়া যায়নি'}</p>
                      <span className="text-[10px] text-slate-500 block mt-0.5">
                        {currentLang === 'en' ? 'Start a new chat to talk with your companion' : 'নতুন চ্যাট শুরু করে প্রিয় সাথীর সাথে কথা বলুন'}
                      </span>
                      <button
                        onClick={() => {
                          onNewChat();
                          if (window.innerWidth < 1024) onClose();
                        }}
                        className="mt-3 px-3 py-1.5 bg-rose-500/20 hover:bg-rose-500/30 text-rose-300 text-xs rounded-xl border border-rose-500/30 transition-all font-semibold"
                      >
                        {currentLang === 'en' ? '+ Start New Chat' : '+ নতুন চ্যাট শুরু করুন'}
                      </button>
                    </div>
                  ) : (
                    filteredSessions.map((session) => {
                      const isActive = session.id === activeSessionId;
                      const sessionCompanion =
                        COMPANIONS.find((c) => c.id === session.companionId) || currentCompanion;

                      return (
                        <div
                          key={session.id}
                          onClick={() => {
                            onSelectSession(session.id);
                            if (window.innerWidth < 1024) onClose();
                          }}
                          className={`group relative flex items-center justify-between p-2.5 rounded-xl text-xs cursor-pointer transition-all ${
                            isActive
                              ? 'bg-rose-500/20 border border-rose-500/40 text-white shadow-md shadow-rose-500/10'
                              : 'text-slate-300 hover:bg-white/5 hover:text-white border border-transparent'
                          }`}
                        >
                          <div className="flex items-center gap-2.5 min-w-0 pr-2">
                            <div className="relative shrink-0">
                              <img
                                src={sessionCompanion.avatar}
                                alt={sessionCompanion.name}
                                className="w-7 h-7 rounded-full object-cover ring-1 ring-white/10"
                              />
                              {isActive && (
                                <span className="absolute -bottom-0.5 -right-0.5 w-2 h-2 rounded-full bg-rose-500 ring-2 ring-[#0b0e19] animate-pulse" />
                              )}
                            </div>
                            <div className="truncate">
                              <p className="font-semibold truncate text-white/90 group-hover:text-white">
                                {session.title}
                              </p>
                              <span className="text-[11px] text-slate-400 block truncate font-normal">
                                {session.preview || session.updatedAt}
                              </span>
                            </div>
                          </div>

                          <div className="flex items-center gap-1.5 shrink-0">
                            <span className="text-[10px] text-slate-500">
                              {session.updatedAt}
                            </span>
                            {sessions.length > 1 && (
                              <button
                                onClick={(e) => onDeleteSession(session.id, e)}
                                className="opacity-0 group-hover:opacity-100 p-1.5 text-slate-400 hover:text-rose-400 hover:bg-white/10 rounded-lg transition-all"
                                title={currentLang === 'en' ? 'Delete this chat' : 'এই চ্যাট মুছুন'}
                              >
                                <Trash2 className="w-3.5 h-3.5" />
                              </button>
                            )}
                          </div>
                        </div>
                      );
                    })
                  )}
                </div>

                {/* Chat Actions Footer (Export transcript) */}
                {onExportChat && filteredSessions.length > 0 && (
                  <button
                    onClick={onExportChat}
                    className="mt-3 w-full py-2 px-3 rounded-xl bg-white/5 hover:bg-white/10 text-slate-400 hover:text-slate-200 text-xs flex items-center justify-center gap-1.5 transition-colors border border-white/5"
                  >
                    <Download className="w-3.5 h-3.5 text-rose-400" />
                    <span>{currentLang === 'en' ? 'Export Chat Transcript (.txt)' : 'চ্যাট হিস্ট্রি ডাউনলোড (.txt)'}</span>
                  </button>
                )}
              </div>
            </div>
          )}

          {/* Section: Companion Hub & Gender Mode */}
          {(activeTab === 'all' || activeTab === 'companions') && (
            <div className="pt-2 border-t border-white/5 space-y-2.5">
              <div className="flex items-center justify-between px-1">
                <span className="text-[11px] font-bold uppercase tracking-wider text-slate-400 flex items-center gap-1.5">
                  <Users className="w-3.5 h-3.5 text-purple-400" />
                  <span>{currentLang === 'en' ? 'Companion & Gender Selection' : 'সাথী নির্বাচন ও জেন্ডার মোড'}</span>
                </span>
                <button
                  onClick={() => {
                    onOpenCartoonModal();
                    if (window.innerWidth < 1024) onClose();
                  }}
                  className="text-[10px] text-rose-400 hover:underline"
                >
                  {currentLang === 'en' ? 'Switch Cartoon' : 'কার্টুন পরিবর্তন'}
                </button>
              </div>

              {/* Gender Switcher Pill */}
              {onToggleUserGender && (
                <div className="grid grid-cols-2 p-1 bg-white/5 rounded-xl border border-white/5 text-xs font-semibold">
                  <button
                    onClick={() => onToggleUserGender('male')}
                    className={`py-1.5 rounded-lg flex items-center justify-center gap-1.5 transition-all ${
                      user.gender === 'male'
                        ? 'bg-rose-600 text-white shadow-md'
                        : 'text-slate-400 hover:text-white'
                    }`}
                  >
                    <span>{currentLang === 'en' ? '👧 Female Companions' : '👧 মেয়ে সাথী'}</span>
                  </button>
                  <button
                    onClick={() => onToggleUserGender('female')}
                    className={`py-1.5 rounded-lg flex items-center justify-center gap-1.5 transition-all ${
                      user.gender === 'female'
                        ? 'bg-purple-600 text-white shadow-md'
                        : 'text-slate-400 hover:text-white'
                    }`}
                  >
                    <span>{currentLang === 'en' ? '👦 Male Companions' : '👦 ছেলে সাথী'}</span>
                  </button>
                </div>
              )}

              {/* Active Companion Card Highlight */}
              <div className="p-2.5 rounded-2xl bg-gradient-to-r from-rose-500/15 via-purple-500/10 to-transparent border border-rose-500/30 flex items-center justify-between">
                <div className="flex items-center gap-2.5">
                  <div className="relative">
                    <img
                      src={currentCompanion.avatar}
                      alt={currentCompanion.name}
                      className="w-10 h-10 rounded-full object-cover ring-2 ring-rose-500/60"
                    />
                    <span className="absolute bottom-0 right-0 w-2.5 h-2.5 bg-emerald-400 border-2 border-[#0b0e18] rounded-full" />
                  </div>
                  <div>
                    <h3 className="text-xs font-bold text-white flex items-center gap-1">
                      {currentLang === 'en' ? currentCompanion.name : currentCompanion.bengaliName}
                      <span className="text-[10px] font-normal text-rose-300">
                        ({currentLang === 'en' ? currentCompanion.bengaliName : currentCompanion.name})
                      </span>
                    </h3>
                    <p className="text-[10px] text-slate-400">
                      {currentLang === 'en' ? currentCompanion.roleTitle : currentCompanion.roleTitleBengali}
                    </p>
                  </div>
                </div>

                <div className="flex items-center gap-1.5 shrink-0">
                  <span className="text-[10px] bg-rose-500/20 text-rose-300 font-semibold px-2 py-0.5 rounded-full border border-rose-500/30">
                    {currentLang === 'en' ? 'Active' : 'চলমান'}
                  </span>
                </div>
              </div>

              {/* Dedicated Name & Picture Change Button */}
              {onOpenCustomModal && (
                <button
                  type="button"
                  onClick={() => {
                    onOpenCustomModal();
                    if (window.innerWidth < 1024) onClose();
                  }}
                  className="w-full p-2.5 rounded-xl bg-gradient-to-r from-rose-500/20 via-pink-500/15 to-purple-500/20 hover:from-rose-500/30 hover:to-purple-500/30 active:scale-[0.98] text-rose-200 border border-rose-500/35 flex items-center justify-between text-xs font-semibold transition-all shadow-sm group"
                >
                  <div className="flex items-center gap-2.5">
                    <div className="p-1.5 rounded-lg bg-rose-500/25 text-rose-300 group-hover:scale-110 transition-transform">
                      <Edit3 className="w-4 h-4 text-rose-300" />
                    </div>
                    <div className="text-left">
                      <div className="text-xs font-bold text-white flex items-center gap-1.5">
                        <span>{currentLang === 'en' ? 'Customize Name & Avatar' : 'সাথীর নাম ও ছবি পরিবর্তন'}</span>
                        <Sparkles className="w-3.5 h-3.5 text-rose-400" />
                      </div>
                      <p className="text-[10px] text-rose-300/80">
                        {currentLang === 'en'
                          ? `Customize ${currentCompanion.name}'s name or profile picture`
                          : `${currentCompanion.bengaliName}-এর নাম বা ছবি নিজের মতো বদলান`}
                      </p>
                    </div>
                  </div>
                  <span className="text-[10px] bg-rose-500/30 text-rose-200 font-bold px-2 py-1 rounded-lg border border-rose-500/40 shrink-0">
                    {currentLang === 'en' ? 'Edit ✏️' : 'বদলান ✏️'}
                  </span>
                </button>
              )}

              {/* Companions Grid */}
              <div className="grid grid-cols-3 gap-1.5">
                {availableCompanions.map((comp) => {
                  const isSelected = comp.id === currentCompanion.id;
                  return (
                    <button
                      key={comp.id}
                      onClick={() => onSelectCompanion(comp, user.gender)}
                      className={`p-2 rounded-xl border flex flex-col items-center text-center transition-all ${
                        isSelected
                          ? 'border-rose-500 bg-rose-500/25 text-white shadow-md'
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
                          <span className="absolute -bottom-0.5 -right-0.5 w-2.5 h-2.5 rounded-full bg-emerald-400 ring-2 ring-[#0b0e18]" />
                        )}
                      </div>
                      <span className="text-[10px] font-bold truncate max-w-full">
                        {currentLang === 'en' ? comp.name : comp.bengaliName}
                      </span>
                      <span className="text-[9px] text-slate-400 truncate">
                        {comp.relationshipType === 'romantic'
                          ? (currentLang === 'en' ? 'Romantic' : 'প্রেমিকা')
                          : (currentLang === 'en' ? 'Friend' : 'বন্ধু')}
                      </span>
                    </button>
                  );
                })}
              </div>
            </div>
          )}

          {/* Section: Mental Care & Wellness Hub */}
          {(activeTab === 'all' || activeTab === 'care') && (
            <div className="pt-2 border-t border-white/5 space-y-2.5">
              <div className="flex items-center justify-between px-1">
                <span className="text-[11px] font-bold uppercase tracking-wider text-slate-400 flex items-center gap-1.5">
                  <Sparkles className="w-3.5 h-3.5 text-amber-400" />
                  <span>{currentLang === 'en' ? 'Mood & Wellness Care' : 'মুড ও মনের যত্ন'}</span>
                </span>
              </div>

              {/* Direct Care Action Cards */}
              <div className="space-y-1.5">
                {/* Voice Call */}
                <button
                  onClick={() => {
                    onOpenCallModal();
                    if (window.innerWidth < 1024) onClose();
                  }}
                  className="w-full p-2.5 rounded-xl bg-emerald-500/10 hover:bg-emerald-500/20 text-emerald-300 border border-emerald-500/25 flex items-center justify-between text-xs font-semibold transition-all group"
                >
                  <div className="flex items-center gap-2">
                    <div className="p-1.5 rounded-lg bg-emerald-500/20 text-emerald-300 group-hover:scale-110 transition-transform">
                      <PhoneCall className="w-3.5 h-3.5" />
                    </div>
                    <span>{currentLang === 'en' ? 'Voice Call with Companion' : 'প্রিয় সাথীর সাথে ভয়েস কল'}</span>
                  </div>
                  <span className="text-[10px] bg-emerald-500/20 px-1.5 py-0.5 rounded text-emerald-300">
                    {currentLang === 'en' ? 'LIVE' : 'লাইভ'}
                  </span>
                </button>

                {/* Emotion Tracker */}
                {onOpenEmotionTrackerModal && (
                  <button
                    onClick={() => {
                      onOpenEmotionTrackerModal();
                      if (window.innerWidth < 1024) onClose();
                    }}
                    className="w-full p-2.5 rounded-xl bg-pink-500/10 hover:bg-pink-500/20 text-pink-300 border border-pink-500/25 flex items-center justify-between text-xs font-semibold transition-all group"
                  >
                    <div className="flex items-center gap-2">
                      <div className="p-1.5 rounded-lg bg-pink-500/20 text-pink-300 group-hover:scale-110 transition-transform">
                        <Heart className="w-3.5 h-3.5 fill-pink-400/40" />
                      </div>
                      <span>{currentLang === 'en' ? 'Emotion & Mood Tracker' : 'আবেগ ও মানসিক অবস্থা ট্র্যাকার'}</span>
                    </div>
                    <span className="text-[10px] bg-pink-500/20 px-1.5 py-0.5 rounded text-pink-300">
                      {currentLang === 'en' ? 'JOURNAL' : 'জার্নাল'}
                    </span>
                  </button>
                )}

                {/* Morning Greeting & 24h Notification */}
                {onOpenMorningGreetingModal && (
                  <button
                    onClick={() => {
                      onOpenMorningGreetingModal();
                      if (window.innerWidth < 1024) onClose();
                    }}
                    className="w-full p-2.5 rounded-xl bg-amber-500/10 hover:bg-amber-500/20 text-amber-300 border border-amber-500/25 flex items-center justify-between text-xs font-semibold transition-all group"
                  >
                    <div className="flex items-center gap-2">
                      <div className="p-1.5 rounded-lg bg-amber-500/20 text-amber-300 group-hover:scale-110 transition-transform">
                        <Sun className="w-3.5 h-3.5 animate-spin-slow" />
                      </div>
                      <span>{currentLang === 'en' ? 'Morning Greetings & Alerts' : 'সকালের বার্তা ও নোটিফিকেশন'}</span>
                    </div>
                    <span className="text-[10px] bg-amber-500/20 px-1.5 py-0.5 rounded text-amber-300">
                      {currentLang === 'en' ? '24h' : '২৪ ঘণ্টা'}
                    </span>
                  </button>
                )}

                {/* Loneliness & Breathing Room */}
                <button
                  onClick={() => {
                    onOpenCareModal();
                    if (window.innerWidth < 1024) onClose();
                  }}
                  className="w-full p-2.5 rounded-xl bg-purple-500/10 hover:bg-purple-500/20 text-purple-300 border border-purple-500/25 flex items-center justify-between text-xs font-semibold transition-all group"
                >
                  <div className="flex items-center gap-2">
                    <div className="p-1.5 rounded-lg bg-purple-500/20 text-purple-300 group-hover:scale-110 transition-transform">
                      <Wind className="w-3.5 h-3.5" />
                    </div>
                    <span>{currentLang === 'en' ? 'Calm Breathing & Loneliness Care' : 'একাকীত্ব দূরীকরণ ও শ্বাস-ব্যায়াম'}</span>
                  </div>
                  <span className="text-[10px] bg-purple-500/20 px-1.5 py-0.5 rounded text-purple-300">
                    {currentLang === 'en' ? 'CARE' : 'কেয়ার'}
                  </span>
                </button>
              </div>

              {/* Mood Prompt Buttons */}
              <div className="pt-1">
                <span className="text-[10px] text-slate-400 block px-1 mb-1.5">
                  {currentLang === 'en'
                    ? 'How are you feeling? Start conversation:'
                    : 'মন কেমন? অনুভূতি জানিয়ে কথা শুরু করুন:'}
                </span>
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
            </div>
          )}

          {/* Section: Quick Settings & Font Control */}
          {(activeTab === 'all' || activeTab === 'care') && (
            <>
              <div className="pt-2 border-t border-white/5 space-y-2">
                <div className="flex items-center justify-between px-1">
                  <span className="text-[11px] font-bold uppercase tracking-wider text-slate-400 flex items-center gap-1.5">
                    <Sliders className="w-3.5 h-3.5 text-rose-400" />
                    <span>{currentLang === 'en' ? 'Quick Settings' : 'দ্রুত কাস্টমাইজেশন'}</span>
                  </span>
                  <button
                    onClick={() => {
                      onOpenSettingsModal();
                      if (window.innerWidth < 1024) onClose();
                    }}
                    className="text-[10px] text-rose-400 hover:underline"
                  >
                    {currentLang === 'en' ? 'All Settings' : 'সব সেটিংস'}
                  </button>
                </div>

                {/* Language Quick Selector */}
                {settings && onUpdateSettings && (
                  <div className="p-2.5 rounded-xl bg-white/5 border border-white/5 space-y-2">
                    <div className="flex items-center justify-between text-xs">
                      <span className="text-slate-300 flex items-center gap-1.5 font-medium">
                        <Globe className="w-3.5 h-3.5 text-rose-400" />
                        <span>{t.appLanguage}</span>
                      </span>
                      <span className="text-[10px] text-rose-300 font-bold bg-rose-500/20 px-1.5 py-0.5 rounded">
                        {currentLang === 'en' ? 'English (Primary)' : 'বাংলা'}
                      </span>
                    </div>

                    <div className="grid grid-cols-2 gap-1.5 text-xs">
                      <button
                        type="button"
                        onClick={() => onUpdateSettings({ language: 'en' })}
                        className={`py-1.5 px-2 rounded-lg font-bold transition-all border flex items-center justify-center gap-1.5 ${
                          currentLang === 'en'
                            ? 'bg-rose-500 text-white border-rose-400 shadow-sm'
                            : 'bg-white/5 text-slate-400 border-white/10 hover:text-white'
                        }`}
                      >
                        <span>🇺🇸 English</span>
                        {currentLang === 'en' && <Check className="w-3 h-3 text-white" />}
                      </button>
                      <button
                        type="button"
                        onClick={() => onUpdateSettings({ language: 'bn' })}
                        className={`py-1.5 px-2 rounded-lg font-bold transition-all border flex items-center justify-center gap-1.5 font-bengali ${
                          currentLang === 'bn'
                            ? 'bg-rose-500 text-white border-rose-400 shadow-sm'
                            : 'bg-white/5 text-slate-400 border-white/10 hover:text-white'
                        }`}
                      >
                        <span>🇧🇩 বাংলা</span>
                        {currentLang === 'bn' && <Check className="w-3 h-3 text-white" />}
                      </button>
                    </div>
                  </div>
                )}

                {/* Font Size Quick Selector */}
                {settings && onUpdateSettings && (
                  <div className="p-2.5 rounded-xl bg-white/5 border border-white/5 space-y-2">
                    <div className="flex items-center justify-between text-xs">
                      <span className="text-slate-300 flex items-center gap-1">
                        <Type className="w-3.5 h-3.5 text-rose-400" />
                        <span>{currentLang === 'en' ? 'Text Size' : 'টেক্সট সাইজ'}</span>
                      </span>
                      <span className="text-[10px] text-rose-300 font-semibold">
                        {settings.fontSize === 'normal'
                          ? (currentLang === 'en' ? 'Normal' : 'স্বাভাবিক')
                          : settings.fontSize === 'xlarge'
                          ? (currentLang === 'en' ? 'Extra Large' : 'অনেক বড়')
                          : (currentLang === 'en' ? 'Large (Default)' : 'বড় (ডিফল্ট)')}
                      </span>
                    </div>

                    <div className="grid grid-cols-3 gap-1 text-[11px]">
                      {(['normal', 'large', 'xlarge'] as const).map((sz) => (
                        <button
                          key={sz}
                          onClick={() => onUpdateSettings({ fontSize: sz })}
                          className={`py-1 rounded-lg font-medium transition-all ${
                            settings.fontSize === sz
                              ? 'bg-rose-500 text-white font-bold'
                              : 'bg-white/5 text-slate-400 hover:text-white'
                          }`}
                        >
                          {sz === 'normal'
                            ? (currentLang === 'en' ? 'Normal' : 'স্বাভাবিক')
                            : sz === 'large'
                            ? (currentLang === 'en' ? 'Large' : 'বড়')
                            : (currentLang === 'en' ? 'Extra Large' : 'অনেক বড়')}
                        </button>
                      ))}
                    </div>

                    {/* Reply length quick selector */}
                    <div className="flex items-center justify-between text-xs pt-1 border-t border-white/5">
                      <span className="text-slate-300">{currentLang === 'en' ? 'Reply Length' : 'উত্তরের দৈর্ঘ্য'}</span>
                      <div className="flex gap-1 text-[10px]">
                        {(['short', 'medium', 'detailed'] as const).map((len) => (
                          <button
                            key={len}
                            onClick={() => onUpdateSettings({ replyLength: len })}
                            className={`px-2 py-0.5 rounded ${
                              settings.replyLength === len
                                ? 'bg-rose-500/30 text-rose-300 border border-rose-500/40 font-bold'
                                : 'text-slate-400 hover:text-white'
                            }`}
                          >
                            {len === 'short'
                              ? (currentLang === 'en' ? 'Short' : 'ছোট')
                              : len === 'medium'
                              ? (currentLang === 'en' ? 'Medium' : 'মাঝারি')
                              : (currentLang === 'en' ? 'Long' : 'বড়')}
                          </button>
                        ))}
                      </div>
                    </div>
                  </div>
                )}
              </div>

              {/* Section: PDF Chat Diary Export */}
              {onExportChat && (
                <div className="pt-2 border-t border-white/5">
                  <button
                    onClick={() => {
                      onExportChat();
                      if (window.innerWidth < 1024) onClose();
                    }}
                    className="w-full py-2.5 px-3 rounded-2xl bg-gradient-to-r from-rose-500/15 via-pink-500/10 to-purple-500/10 hover:from-rose-500/25 hover:to-pink-500/20 active:scale-[0.98] border border-rose-500/30 text-rose-300 hover:text-white flex items-center justify-between transition-all group shadow-sm"
                    title={currentLang === 'en' ? 'Download PDF Chat Diary organized by date' : 'তারিখ অনুযায়ী সাজানো আকর্ষণীয় PDF চ্যাট ডায়েরি ডাউনলোড করুন'}
                  >
                    <div className="flex items-center gap-2.5">
                      <div className="p-2 rounded-xl bg-rose-500/20 text-rose-300 group-hover:scale-105 transition-transform border border-rose-500/30">
                        <FileText className="w-4 h-4" />
                      </div>
                      <div className="text-left">
                        <div className="flex items-center gap-1.5">
                          <span className="text-xs font-bold text-rose-200 group-hover:text-white leading-tight">
                            {currentLang === 'en' ? 'PDF Chat Diary' : 'পিডিএফ চ্যাট ডায়েরি'}
                          </span>
                          <span className="text-[9px] bg-rose-500/30 text-rose-300 px-1.5 py-0.2 rounded font-bold">
                            {currentLang === 'en' ? 'NEW' : 'নতুন'}
                          </span>
                        </div>
                        <span className="text-[10px] text-slate-400 block mt-0.5">
                          {currentLang === 'en' ? 'Save memories organized by date' : 'তারিখ অনুযায়ী সাজানো স্মৃতি সেভ করুন'}
                        </span>
                      </div>
                    </div>
                    <Download className="w-4 h-4 text-rose-400 group-hover:translate-y-0.5 transition-transform shrink-0" />
                  </button>
                </div>
              )}

              {/* Special Companion Features: Love Meter, Memory Book & Wallpaper */}
              <div className="pt-2 border-t border-white/5 space-y-2">
                <span className="text-[11px] font-bold uppercase tracking-wider text-slate-400 flex items-center gap-1.5 px-1">
                  <Sparkles className="w-3.5 h-3.5 text-rose-400" />
                  <span>{currentLang === 'en' ? 'Romantic Features & Moments' : 'রোমান্টিক ফিচার ও বিশেষ মুহূর্ত'}</span>
                </span>

                <div className="grid grid-cols-1 gap-2">
                  {/* Love & Chemistry Meter */}
                  {onOpenLoveMeterModal && (
                    <button
                      type="button"
                      onClick={() => {
                        onOpenLoveMeterModal();
                        if (window.innerWidth < 1024) onClose();
                      }}
                      className="w-full p-2.5 rounded-2xl bg-gradient-to-r from-rose-500/15 via-pink-500/10 to-transparent hover:from-rose-500/25 border border-rose-500/30 text-left flex items-center justify-between transition-all group active:scale-[0.98]"
                    >
                      <div className="flex items-center gap-2.5">
                        <div className="w-8 h-8 rounded-xl bg-rose-500/20 text-rose-400 flex items-center justify-center group-hover:scale-105 transition-transform">
                          <Flame className="w-4 h-4" />
                        </div>
                        <div>
                          <div className="flex items-center gap-1.5">
                            <span className="text-xs font-bold text-rose-200 group-hover:text-white">
                              {currentLang === 'en' ? 'Love & Chemistry Test' : 'লাভ মিটার ও কেমিস্ট্রি টেস্ট'}
                            </span>
                            <span className="text-[9px] bg-rose-500/30 text-rose-300 px-1.5 py-0.2 rounded font-bold">
                              {currentLang === 'en' ? 'QUIZ' : 'কুইজ'}
                            </span>
                          </div>
                          <span className="text-[10px] text-slate-400 block mt-0.5">
                            {currentLang === 'en' ? 'Test your love chemistry & score' : 'দুজনের ভালোবাসার রসায়ন ও স্কোর দেখুন'}
                          </span>
                        </div>
                      </div>
                      <ChevronRight className="w-4 h-4 text-rose-400 group-hover:translate-x-0.5 transition-transform" />
                    </button>
                  )}

                  {/* Relationship Memory Book */}
                  {onOpenMemoryBookModal && (
                    <button
                      type="button"
                      onClick={() => {
                        onOpenMemoryBookModal();
                        if (window.innerWidth < 1024) onClose();
                      }}
                      className="w-full p-2.5 rounded-2xl bg-gradient-to-r from-pink-500/15 via-purple-500/10 to-transparent hover:from-pink-500/25 border border-pink-500/30 text-left flex items-center justify-between transition-all group active:scale-[0.98]"
                    >
                      <div className="flex items-center gap-2.5">
                        <div className="w-8 h-8 rounded-xl bg-pink-500/20 text-pink-400 flex items-center justify-center group-hover:scale-105 transition-transform">
                          <BookHeart className="w-4 h-4" />
                        </div>
                        <div>
                          <div className="flex items-center gap-1.5">
                            <span className="text-xs font-bold text-pink-200 group-hover:text-white">
                              {currentLang === 'en' ? 'Memory Book & Diary' : 'স্মৃতির খাতা ও ডায়েরি'}
                            </span>
                            <span className="text-[9px] bg-pink-500/30 text-pink-300 px-1.5 py-0.2 rounded font-bold">
                              {currentLang === 'en' ? 'DIARY' : 'ডায়েরি'}
                            </span>
                          </div>
                          <span className="text-[10px] text-slate-400 block mt-0.5">
                            {currentLang === 'en' ? 'Write down sweet moments and notes' : 'সব মধুর মুহূর্ত ও কথা লিখে রাখুন'}
                          </span>
                        </div>
                      </div>
                      <ChevronRight className="w-4 h-4 text-pink-400 group-hover:translate-x-0.5 transition-transform" />
                    </button>
                  )}

                  {/* Chat Wallpapers */}
                  {onOpenWallpaperModal && (
                    <button
                      type="button"
                      onClick={() => {
                        onOpenWallpaperModal();
                        if (window.innerWidth < 1024) onClose();
                      }}
                      className="w-full p-2.5 rounded-2xl bg-gradient-to-r from-purple-500/15 via-indigo-500/10 to-transparent hover:from-purple-500/25 border border-purple-500/30 text-left flex items-center justify-between transition-all group active:scale-[0.98]"
                    >
                      <div className="flex items-center gap-2.5">
                        <div className="w-8 h-8 rounded-xl bg-purple-500/20 text-purple-400 flex items-center justify-center group-hover:scale-105 transition-transform">
                          <ImageIcon className="w-4 h-4" />
                        </div>
                        <div>
                          <div className="flex items-center gap-1.5">
                            <span className="text-xs font-bold text-purple-200 group-hover:text-white">
                              {currentLang === 'en' ? 'Chat Background & Themes' : 'চ্যাট ব্যাকগ্রাউন্ড ও ওয়ালপেপার'}
                            </span>
                            <span className="text-[9px] bg-purple-500/30 text-purple-300 px-1.5 py-0.2 rounded font-bold">
                              {currentLang === 'en' ? 'THEME' : 'থিম'}
                            </span>
                          </div>
                          <span className="text-[10px] text-slate-400 block mt-0.5">
                            {currentLang === 'en' ? 'Rain, cafe, moonlight & custom photo' : 'বৃষ্টি, ক্যাফে, চাঁদের আলো ও কাস্টম ছবি'}
                          </span>
                        </div>
                      </div>
                      <ChevronRight className="w-4 h-4 text-purple-400 group-hover:translate-x-0.5 transition-transform" />
                    </button>
                  )}
                </div>
              </div>

              {/* Section: VIP Premium & Token Balance Card */}
              <div className="pt-2 border-t border-white/5 space-y-2">
                {(() => {
                  const percentage = user.isPremium
                    ? 100
                    : (browserQuota ? browserQuota.percentage : Math.min(100, Math.max(0, Math.round(((user.tokens ?? 50) / (user.isLoggedIn ? 250 : 50)) * 100))));
                  const isCooldown = !user.isPremium && (browserQuota?.isCooldownActive || percentage <= 0);
                  const isLow = !user.isPremium && !isCooldown && percentage <= 20;
                  const isExhausted = !user.isPremium && (isCooldown || percentage <= 0);

                  return (
                    <div
                      id="sidebar-token-card"
                      onClick={() => {
                        if (user.isPremium) {
                          onOpenPremiumModal();
                        } else if (!user.isLoggedIn) {
                          onOpenAuthModal();
                        } else {
                          onOpenPremiumModal();
                        }
                        if (window.innerWidth < 1024) onClose();
                      }}
                      className="cursor-pointer p-3.5 rounded-2xl bg-gradient-to-br from-[#161b2e] via-[#1a1c2d] to-[#161726] border border-white/10 hover:border-amber-500/40 transition-all shadow-md group"
                    >
                      {/* Top Header Row */}
                      <div className="flex items-center justify-between mb-2">
                        <div className="flex items-center gap-1.5 text-amber-300 font-bold text-xs">
                          {user.isPremium ? (
                            <Crown className="w-4 h-4 text-amber-400 group-hover:rotate-12 transition-transform" />
                          ) : (
                            <Coins className="w-4 h-4 text-amber-400 group-hover:scale-110 transition-transform" />
                          )}
                          <span>
                            {user.isPremium
                              ? (currentLang === 'en' ? 'VIP Membership' : 'ভিআইপি মেম্বারশিপ')
                              : (currentLang === 'en' ? 'Chat Quota' : 'চ্যাট কোটা')}
                          </span>
                        </div>
                        <span
                          className={`text-[10px] px-2 py-0.5 rounded-full font-bold border ${
                            user.isPremium
                              ? 'bg-amber-500/25 text-amber-300 border-amber-500/40'
                              : isCooldown
                              ? 'bg-rose-500/25 text-rose-300 border-rose-500/50 animate-pulse'
                              : user.isLoggedIn
                              ? 'bg-emerald-500/20 text-emerald-300 border-emerald-500/40'
                              : 'bg-purple-500/20 text-purple-300 border-purple-500/40'
                          }`}
                        >
                          {user.isPremium
                            ? (currentLang === 'en' ? 'Active ✨' : 'সক্রিয় ✨')
                            : isCooldown
                            ? (currentLang === 'en' ? 'Cooldown Active' : 'কুলডাউন সক্রিয়')
                            : user.isLoggedIn
                            ? (currentLang === 'en' ? 'Verified Member' : 'ভেরিফাইড মেম্বার')
                            : (currentLang === 'en' ? 'Guest Access' : 'গেস্ট অ্যাক্সেস')}
                        </span>
                      </div>

                      {/* Quota Percentage */}
                      <div className="flex items-center justify-between mb-1.5 text-xs">
                        <div className="flex items-center gap-1 text-slate-200 font-semibold">
                          <span>{currentLang === 'en' ? 'Remaining Quota:' : 'অবশিষ্ট কোটা:'}</span>
                          <span
                            className={`font-bold ${
                              user.isPremium
                                ? 'text-amber-300'
                                : isExhausted
                                ? 'text-rose-400'
                                : isLow
                                ? 'text-amber-400'
                                : 'text-emerald-400'
                            }`}
                          >
                            {user.isPremium ? (currentLang === 'en' ? 'Unlimited' : 'আনলিমিটেড') : `${percentage}%`}
                          </span>
                        </div>
                        {!user.isPremium && (
                          <span className="text-[10px] font-medium text-slate-400">
                            {isCooldown && browserQuota ? browserQuota.timeLeftFormatted : '6h reset cycle'}
                          </span>
                        )}
                      </div>

                      {/* Visual Progress Bar */}
                      <div className="w-full h-2 bg-black/60 rounded-full overflow-hidden border border-white/10 mb-2.5">
                        <div
                          className={`h-full rounded-full transition-all duration-500 ${
                            user.isPremium
                              ? 'bg-gradient-to-r from-amber-400 via-yellow-300 to-amber-500 w-full'
                              : isExhausted
                              ? 'bg-rose-500 w-0'
                              : isLow
                              ? 'bg-gradient-to-r from-amber-400 to-rose-500'
                              : 'bg-gradient-to-r from-emerald-400 via-teal-400 to-cyan-400'
                          }`}
                          style={{ width: `${percentage}%` }}
                        />
                      </div>

                      {/* Cooldown time display if active */}
                      {isCooldown && browserQuota && (
                        <div className="mb-2 p-2 rounded-xl bg-rose-500/10 border border-rose-500/30 text-[11px] text-rose-300 space-y-1">
                          <div className="flex items-center gap-1.5 font-bold">
                            <Clock className="w-3.5 h-3.5 text-rose-400" />
                            <span>
                              {currentLang === 'en' ? 'Next Session Unlocks:' : 'পরবর্তী সেশন চালু হবে:'}
                            </span>
                          </div>
                          <p className="text-slate-300 text-[10px] leading-relaxed">
                            {currentLang === 'en'
                              ? `At ${browserQuota.reopenTimeFormatted} (in ${browserQuota.timeLeftFormatted}). Cooldown applies per browser session.`
                              : `সময়: ${browserQuota.reopenTimeFormatted} (বাকি ${browserQuota.timeLeftFormatted})। প্রতিটি ব্রাউজারে স্বয়ংক্রিয়ভাবে রিসেট হবে।`}
                          </p>
                        </div>
                      )}

                      {/* Explanatory text */}
                      <p className="text-[11px] text-slate-300 leading-relaxed">
                        {user.isPremium
                          ? (currentLang === 'en' ? 'You are a VIP Member! Enjoy unlimited intimate photos, live voice calls, and premium modes.' : 'আপনি ভিআইপি সদস্য! আনলিমিটেড মিষ্টি ছবি, স্পেশাল ভয়েস কল ও রোমান্টিক মোড উপভোগ করুন।')
                          : user.isLoggedIn
                          ? (currentLang === 'en' ? 'Free session quota auto-resets every 6 hours. Upgrade to VIP for continuous unlimited conversations.' : 'ফ্রি সেশন কোটা প্রতি ৬ ঘণ্টা পর স্বয়ংক্রিয়ভাবে রিসেট হবে। সার্বক্ষণিক চ্যাটের জন্য ভিআইপি আপগ্রেড করুন।')
                          : (currentLang === 'en' ? 'Guest session quota auto-resets every 6 hours. Log in to gain higher bandwidth and save history.' : 'গেস্ট কোটা প্রতি ৬ ঘণ্টা পর স্বয়ংক্রিয়ভাবে রিসেট হবে। বেশি সুবিধা পেতে লগইন করুন।')}
                      </p>

                      {/* Action Pill / Prompt */}
                      {!user.isPremium && (
                        <div className="mt-2 pt-2 border-t border-white/5 flex items-center justify-between text-[10px] font-semibold">
                          <span className="text-slate-400">
                            {user.isLoggedIn ? (currentLang === 'en' ? 'VIP Benefits' : 'ভিআইপি সুযোগ-সুবিধা') : (currentLang === 'en' ? 'To get bonus:' : 'বোনাস পেতে:')}
                          </span>
                          <span className="text-amber-400 group-hover:text-amber-300 underline flex items-center gap-1">
                            {user.isLoggedIn ? (currentLang === 'en' ? 'View Plans →' : 'প্ল্যান দেখুন →') : (currentLang === 'en' ? 'Login (Extra Quota) →' : 'লগইন করুন (অতিরিক্ত কোটা) →')}
                          </span>
                        </div>
                      )}
                    </div>
                  );
                })()}
              </div>
            </>
          )}
        </div>

        {/* 5. User Account & Security Footer */}
        <div className="p-3 bg-[#111627] border-t border-white/10 flex items-center justify-between">
          <div
            onClick={onOpenAuthModal}
            className="flex items-center gap-2.5 cursor-pointer group flex-1 min-w-0 mr-2"
          >
            <div className="w-9 h-9 rounded-full bg-rose-500/20 border border-rose-500/40 flex items-center justify-center text-sm font-bold text-rose-300 shrink-0">
              {user.gender === 'male' ? '👦' : '👧'}
            </div>
            <div className="truncate">
              <span className="text-xs font-bold text-white group-hover:text-rose-400 transition-colors block truncate">
                {user.isLoggedIn
                  ? (user.name || (currentLang === 'en' ? 'Valued Member' : 'সম্মানিত সদস্য'))
                  : (currentLang === 'en' ? 'Anonymous Guest (100% Secure)' : 'বেনামী সদস্য (১০০% নিরাপদ)')}
              </span>
              <span className="text-[10px] text-slate-400 flex items-center gap-1">
                <ShieldCheck className="w-3 h-3 text-emerald-400" />
                <span>
                  {user.isPremium
                    ? (currentLang === 'en' ? 'VIP Member (Unlimited)' : 'ভিআইপি সদস্য (আনলিমিটেড)')
                    : browserQuota?.isCooldownActive
                    ? `${currentLang === 'en' ? 'Cooldown' : 'কুলডাউন'} • ${browserQuota.timeLeftFormatted}`
                    : `${currentLang === 'en' ? 'Quota' : 'কোটা'}: ${browserQuota ? browserQuota.percentage : (user.isLoggedIn ? 100 : 100)}%`}
                </span>
              </span>
            </div>
          </div>

          <button
            onClick={onOpenAuthModal}
            className="p-2 rounded-xl bg-white/5 hover:bg-white/10 text-slate-300 hover:text-white transition-colors"
            title={user.isLoggedIn ? (currentLang === 'en' ? 'Profile Settings' : 'প্রোফাইল সেটিংস') : (currentLang === 'en' ? 'Login' : 'লগইন করুন')}
          >
            {user.isLoggedIn ? <LogOut className="w-4 h-4" /> : <LogIn className="w-4 h-4" />}
          </button>
        </div>
      </aside>
    </>
  );
};

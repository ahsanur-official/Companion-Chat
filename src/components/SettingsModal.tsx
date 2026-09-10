import React, { useState } from 'react';
import {
  X,
  Sliders,
  Type,
  Palette,
  Volume2,
  ShieldCheck,
  Check,
  Sparkles,
  Heart,
  MessageSquare,
  Trash2,
  Download,
  RotateCcw,
  Eye,
  Camera,
  Shield,
  Globe,
} from 'lucide-react';
import { AppSettings, FontSizeOption, ReplyLength, ThemeOption } from '../types';

interface SettingsModalProps {
  isOpen: boolean;
  onClose: () => void;
  settings: AppSettings;
  onUpdateSettings: (newSettings: Partial<AppSettings>) => void;
  onClearCurrentChat: () => void;
  onClearAllChats: () => void;
  onExportChat: () => void;
  companionName: string;
  onOpenAdminModal?: () => void;
}

type TabKey = 'chat' | 'typography' | 'appearance' | 'audio' | 'privacy';

export const SettingsModal: React.FC<SettingsModalProps> = ({
  isOpen,
  onClose,
  settings,
  onUpdateSettings,
  onClearCurrentChat,
  onClearAllChats,
  onExportChat,
  companionName,
  onOpenAdminModal,
}) => {
  const [activeTab, setActiveTab] = useState<TabKey>('chat');
  const [showClearConfirm, setShowClearConfirm] = useState(false);
  const [showResetConfirm, setShowResetConfirm] = useState(false);

  if (!isOpen) return null;

  const tabs: Array<{ key: TabKey; label: string; icon: React.ReactNode }> = [
    { key: 'chat', label: 'চ্যাট ও আচরণ', icon: <MessageSquare className="w-4 h-4" /> },
    { key: 'typography', label: 'ফন্ট ও সাইজ', icon: <Type className="w-4 h-4" /> },
    { key: 'appearance', label: 'থিম ও লুক', icon: <Palette className="w-4 h-4" /> },
    { key: 'audio', label: 'ভয়েস ও শব্দ', icon: <Volume2 className="w-4 h-4" /> },
    { key: 'privacy', label: 'গোপনীয়তা', icon: <ShieldCheck className="w-4 h-4" /> },
  ];

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-4 bg-black/80 backdrop-blur-md transition-all animate-fadeIn">
      <div className="relative w-full max-w-2xl bg-[#0f1322] border border-white/10 rounded-2xl sm:rounded-3xl shadow-2xl overflow-hidden flex flex-col max-h-[90vh]">
        {/* Header */}
        <div className="px-5 py-4 border-b border-white/10 flex items-center justify-between bg-[#141829]">
          <div className="flex items-center gap-2.5">
            <div className="w-9 h-9 rounded-xl bg-gradient-to-tr from-rose-500/20 to-purple-500/20 border border-rose-500/30 flex items-center justify-center text-rose-400">
              <Sliders className="w-4 h-4" />
            </div>
            <div>
              <h2 className="text-base sm:text-lg font-bold text-white tracking-wide">
                অ্যাপ সেটিংস ও প্রিফারেন্স
              </h2>
              <p className="text-xs text-slate-400">
                ক্লিন ও পারফেক্ট অভিজ্ঞতার জন্য আপনার পছন্দমতো সাজিয়ে নিন
              </p>
            </div>
          </div>

          <button
            onClick={onClose}
            className="p-1.5 rounded-xl text-slate-400 hover:text-white hover:bg-white/10 transition-colors"
            title="বন্ধ করুন"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Tab Navigation */}
        <div className="flex items-center gap-1 px-4 sm:px-5 pt-3 pb-2 border-b border-white/5 bg-[#111424] overflow-x-auto no-scrollbar">
          {tabs.map((tab) => {
            const isActive = activeTab === tab.key;
            return (
              <button
                key={tab.key}
                onClick={() => setActiveTab(tab.key)}
                className={`flex items-center gap-1.5 px-3.5 py-2 rounded-xl text-xs font-semibold whitespace-nowrap transition-all ${
                  isActive
                    ? 'bg-rose-500 text-white shadow-md shadow-rose-500/25'
                    : 'text-slate-400 hover:text-white hover:bg-white/5'
                }`}
              >
                {tab.icon}
                <span>{tab.label}</span>
              </button>
            );
          })}
        </div>

        {/* Content Area */}
        <div className="flex-1 overflow-y-auto p-5 sm:p-6 space-y-6">
          {/* TAB 1: Chat & Companion */}
          {activeTab === 'chat' && (
            <div className="space-y-5">
              {/* App Language (English & বাংলা) */}
              <div className="p-4 rounded-2xl bg-white/5 border border-white/10 space-y-3">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <Globe className="w-4 h-4 text-rose-400" />
                    <label className="text-xs font-bold uppercase tracking-wider text-slate-200">
                      অ্যাপের ভাষা (App Language)
                    </label>
                  </div>
                  <span className="text-[11px] font-semibold text-rose-300 bg-rose-500/20 px-2 py-0.5 rounded-full border border-rose-500/30">
                    Primary: English
                  </span>
                </div>
                <div className="grid grid-cols-2 gap-3">
                  <button
                    type="button"
                    onClick={() => onUpdateSettings({ language: 'en' })}
                    className={`p-3 rounded-xl border text-left transition-all ${
                      settings.language === 'en'
                        ? 'border-rose-500 bg-rose-500/15 text-white ring-1 ring-rose-500'
                        : 'border-white/10 bg-white/5 text-slate-300 hover:bg-white/10'
                    }`}
                  >
                    <div className="flex items-center justify-between mb-1">
                      <span className="text-sm font-bold">🇺🇸 English</span>
                      {settings.language === 'en' && <Check className="w-4 h-4 text-rose-400" />}
                    </div>
                    <p className="text-[11px] text-slate-400">
                      Default & primary interface language with high responsiveness.
                    </p>
                  </button>

                  <button
                    type="button"
                    onClick={() => onUpdateSettings({ language: 'bn' })}
                    className={`p-3 rounded-xl border text-left transition-all font-bengali ${
                      settings.language === 'bn'
                        ? 'border-rose-500 bg-rose-500/15 text-white ring-1 ring-rose-500'
                        : 'border-white/10 bg-white/5 text-slate-300 hover:bg-white/10'
                    }`}
                  >
                    <div className="flex items-center justify-between mb-1">
                      <span className="text-sm font-bold">🇧🇩 বাংলা</span>
                      {settings.language === 'bn' && <Check className="w-4 h-4 text-rose-400" />}
                    </div>
                    <p className="text-[11px] text-slate-400">
                      সম্পূর্ণ অ্যাপ ও এআই কথপোকথন বাংলায় উপভোগ করুন।
                    </p>
                  </button>
                </div>
              </div>

              {/* 1. Reply Length */}
              <div>
                <label className="block text-xs font-bold uppercase tracking-wider text-slate-300 mb-2">
                  AI উত্তরের দৈর্ঘ্য (Reply Length)
                </label>
                <div className="grid grid-cols-3 gap-2">
                  {[
                    { id: 'short', title: 'ছোট (Short)', desc: '১-২ লাইনের দ্রুত কথা' },
                    { id: 'medium', title: 'মাঝারি (Medium)', desc: '২-৪ লাইনের সুষম উত্তর' },
                    { id: 'detailed', title: 'বিস্তারিত (Deep)', desc: 'গভীর ও বড় কথোপকথন' },
                  ].map((item) => {
                    const isSelected = settings.replyLength === item.id;
                    return (
                      <button
                        key={item.id}
                        type="button"
                        onClick={() => onUpdateSettings({ replyLength: item.id as ReplyLength })}
                        className={`p-3 rounded-xl border text-left transition-all ${
                          isSelected
                            ? 'border-rose-500 bg-rose-500/15 text-white ring-1 ring-rose-500'
                            : 'border-white/10 bg-white/5 text-slate-300 hover:bg-white/10'
                        }`}
                      >
                        <div className="flex items-center justify-between mb-1">
                          <span className="text-xs font-bold">{item.title}</span>
                          {isSelected && <Check className="w-3.5 h-3.5 text-rose-400" />}
                        </div>
                        <p className="text-[11px] text-slate-400 leading-tight">{item.desc}</p>
                      </button>
                    );
                  })}
                </div>
                <p className="text-[11px] text-slate-400 mt-2">
                  * আপনার অনুরোধ অনুযায়ী 'মাঝারি (Medium)' ডিফল্ট রাখা হয়েছে যাতে কথা অতিরিক্ত বড় বা একঘেয়ে না হয়।
                </p>
              </div>

              {/* 2. Romantic Photo Moments Toggle */}
              <div className="p-4 rounded-2xl bg-gradient-to-r from-rose-500/10 via-pink-500/10 to-transparent border border-rose-500/20 flex items-center justify-between">
                <div className="space-y-0.5 pr-4">
                  <div className="flex items-center gap-1.5 text-rose-300 font-bold text-sm">
                    <Camera className="w-4 h-4" />
                    <span>চ্যাটে মিষ্টি ভালোবাসার ছবি শেয়ার</span>
                  </div>
                  <p className="text-xs text-slate-300">
                    কথা বলার মাঝে মাঝে রোমান্টিক আবহে সাথী মিষ্টি ছবি (যেমন: কফি, বৃষ্টি, সূর্যাস্ত, গোলাপ) পাঠাবে।
                  </p>
                </div>
                <label className="relative inline-flex items-center cursor-pointer shrink-0">
                  <input
                    type="checkbox"
                    checked={settings.enableRomanticPics}
                    onChange={(e) => onUpdateSettings({ enableRomanticPics: e.target.checked })}
                    className="sr-only peer"
                  />
                  <div className="w-11 h-6 bg-white/10 peer-focus:outline-none rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-rose-500"></div>
                </label>
              </div>

              {/* 3. Companion Tone */}
              <div>
                <label className="block text-xs font-bold uppercase tracking-wider text-slate-300 mb-2">
                  সাথীর মনোভঙ্গি ও টোন
                </label>
                <div className="grid grid-cols-3 gap-2">
                  {[
                    { id: 'sweet', label: 'মিষ্টি ও শান্ত', icon: '🌸' },
                    { id: 'romantic', label: 'রোমান্টিক ও আদুরে', icon: '❤️' },
                    { id: 'playful', label: 'চঞ্চল ও মজার', icon: '✨' },
                  ].map((item) => {
                    const isSelected = settings.companionTone === item.id;
                    return (
                      <button
                        key={item.id}
                        type="button"
                        onClick={() =>
                          onUpdateSettings({ companionTone: item.id as 'sweet' | 'romantic' | 'playful' })
                        }
                        className={`p-2.5 rounded-xl border text-center transition-all ${
                          isSelected
                            ? 'border-rose-500 bg-rose-500/15 text-white ring-1 ring-rose-500'
                            : 'border-white/10 bg-white/5 text-slate-300 hover:bg-white/10'
                        }`}
                      >
                        <span className="text-base block mb-0.5">{item.icon}</span>
                        <span className="text-xs font-semibold">{item.label}</span>
                      </button>
                    );
                  })}
                </div>
              </div>

              {/* 4. Nickname Preference */}
              <div>
                <label className="block text-xs font-bold uppercase tracking-wider text-slate-300 mb-2">
                  সাথী আপনাকে যেভাবে সম্বোধন করবে
                </label>
                <div className="flex flex-wrap gap-2">
                  {['সোনা', 'জান', 'বাবু', 'প্রিয়', 'বন্ধু', 'কোনোটিই না'].map((nick) => {
                    const isSelected = settings.endearmentNick === nick;
                    return (
                      <button
                        key={nick}
                        type="button"
                        onClick={() => onUpdateSettings({ endearmentNick: nick })}
                        className={`px-3 py-1.5 rounded-xl text-xs font-medium border transition-all ${
                          isSelected
                            ? 'border-rose-500 bg-rose-500/20 text-rose-300 ring-1 ring-rose-500'
                            : 'border-white/10 bg-white/5 text-slate-300 hover:bg-white/10'
                        }`}
                      >
                        {nick}
                      </button>
                    );
                  })}
                </div>
              </div>
            </div>
          )}

          {/* TAB 2: Typography & Font */}
          {activeTab === 'typography' && (
            <div className="space-y-5">
              {/* Font Status Banner */}
              <div className="p-4 rounded-2xl bg-[#141829] border border-white/10 space-y-2">
                <div className="flex items-center justify-between">
                  <span className="text-xs font-bold text-slate-300 uppercase tracking-wider">
                    সক্রিয় ফন্ট কনফিগারেশন
                  </span>
                  <span className="px-2 py-0.5 rounded-full bg-emerald-500/20 text-emerald-300 text-[10px] font-bold border border-emerald-500/30 flex items-center gap-1">
                    <Check className="w-3 h-3" /> কনফিগার করা হয়েছে
                  </span>
                </div>
                <div className="grid grid-cols-2 gap-3 pt-1">
                  <div className="p-3 rounded-xl bg-white/5 border border-white/5">
                    <span className="text-[11px] text-slate-400 block mb-1">বাংলা লিপি:</span>
                    <span className="text-sm font-bold text-white font-bengali">
                      কালপুরুষ (Kalpurush)
                    </span>
                  </div>
                  <div className="p-3 rounded-xl bg-white/5 border border-white/5">
                    <span className="text-[11px] text-slate-400 block mb-1">English / Letters:</span>
                    <span className="text-sm font-bold text-white font-english">
                      Arial
                    </span>
                  </div>
                </div>
              </div>

              {/* Font Size Selector */}
              <div>
                <label className="block text-xs font-bold uppercase tracking-wider text-slate-300 mb-2">
                  চ্যাট টেক্সট সাইজ (Text Size)
                </label>
                <div className="grid grid-cols-3 gap-2">
                  {[
                    { id: 'normal', title: 'স্বাভাবিক (15px)', desc: 'স্ট্যান্ডার্ড সাইজ' },
                    { id: 'large', title: 'বড় (17px)', desc: 'পড়ার জন্য দারুণ স্পষ্ট' },
                    { id: 'xlarge', title: 'অতিরিক্ত বড় (19px)', desc: 'বড় ও আরামদায়ক' },
                  ].map((item) => {
                    const isSelected = settings.fontSize === item.id;
                    return (
                      <button
                        key={item.id}
                        type="button"
                        onClick={() => onUpdateSettings({ fontSize: item.id as FontSizeOption })}
                        className={`p-3 rounded-xl border text-left transition-all ${
                          isSelected
                            ? 'border-rose-500 bg-rose-500/15 text-white ring-1 ring-rose-500'
                            : 'border-white/10 bg-white/5 text-slate-300 hover:bg-white/10'
                        }`}
                      >
                        <div className="flex items-center justify-between mb-1">
                          <span className="text-xs font-bold">{item.title}</span>
                          {isSelected && <Check className="w-3.5 h-3.5 text-rose-400" />}
                        </div>
                        <p className="text-[11px] text-slate-400 leading-tight">{item.desc}</p>
                      </button>
                    );
                  })}
                </div>
              </div>

              {/* Live Typography Preview Box */}
              <div>
                <label className="block text-xs font-bold uppercase tracking-wider text-slate-400 mb-1.5 flex items-center gap-1.5">
                  <Eye className="w-3.5 h-3.5 text-rose-400" />
                  <span>লাইভ ফন্ট ও সাইজ প্রিভিউ:</span>
                </label>
                <div className="p-4 rounded-2xl bg-[#141829] border border-white/10 space-y-3">
                  <div className="p-3 rounded-xl bg-[#1a1e30] border border-white/10 text-white leading-relaxed">
                    <p
                      className={`${
                        settings.fontSize === 'xlarge'
                          ? 'text-[19px]'
                          : settings.fontSize === 'large'
                          ? 'text-[17px]'
                          : 'text-[15px]'
                      }`}
                    >
                      "তোমাকে খুব মনে পড়ছে প্রিয়! তুমি পাশে থাকলে পুরো পৃথিবীটাই মিষ্টি লাগে।"
                    </p>
                    <p
                      className={`text-slate-300 mt-1.5 font-english ${
                        settings.fontSize === 'xlarge'
                          ? 'text-[18px]'
                          : settings.fontSize === 'large'
                          ? 'text-[16px]'
                          : 'text-[14px]'
                      }`}
                    >
                      "You make every moment special and unforgettable."
                    </p>
                  </div>
                  <span className="text-[10px] text-slate-400 block italic">
                    * বাংলা লেখা Kalpurush ফন্টে এবং ইংরেজি বাক্য Arial ফন্টে স্পষ্ট ফুটে উঠবে।
                  </span>
                </div>
              </div>
            </div>
          )}

          {/* TAB 3: Appearance & Ambience */}
          {activeTab === 'appearance' && (
            <div className="space-y-5">
              <div>
                <label className="block text-xs font-bold uppercase tracking-wider text-slate-300 mb-2">
                  কালার থিম ও অ্যাম্বিয়েন্স
                </label>
                <div className="grid grid-cols-3 gap-2.5">
                  {[
                    {
                      id: 'obsidian',
                      title: 'অফ-ব্ল্যাক অবসিডিয়ান',
                      desc: 'চোখের জন্য শান্ত ও ক্লিন ডার্ক',
                      color: 'bg-slate-900 border-slate-700',
                    },
                    {
                      id: 'rose',
                      title: 'ভেলভেট রোজ',
                      desc: 'আদুরে ও রোমান্টিক লাল আভা',
                      color: 'bg-rose-950/70 border-rose-800',
                    },
                    {
                      id: 'amethyst',
                      title: 'রয়্যাল অ্যামেথিস্ট',
                      desc: 'গভীর পার্পল নান্দনিকতা',
                      color: 'bg-purple-950/70 border-purple-800',
                    },
                  ].map((theme) => {
                    const isSelected = settings.theme === theme.id;
                    return (
                      <button
                        key={theme.id}
                        type="button"
                        onClick={() => onUpdateSettings({ theme: theme.id as ThemeOption })}
                        className={`p-3 rounded-xl border text-left transition-all ${
                          isSelected
                            ? 'border-rose-500 bg-rose-500/15 text-white ring-1 ring-rose-500'
                            : 'border-white/10 bg-white/5 text-slate-300 hover:bg-white/10'
                        }`}
                      >
                        <div className="flex items-center gap-2 mb-1.5">
                          <span className={`w-3.5 h-3.5 rounded-full border ${theme.color}`} />
                          <span className="text-xs font-bold">{theme.title}</span>
                        </div>
                        <p className="text-[10px] text-slate-400 leading-tight">{theme.desc}</p>
                      </button>
                    );
                  })}
                </div>
              </div>

              {/* Sound Effect Toggle */}
              <div className="p-4 rounded-2xl bg-white/5 border border-white/10 flex items-center justify-between">
                <div className="space-y-0.5">
                  <span className="text-sm font-bold text-white block">মেসেজ সেন্ড সাউন্ড এফেক্ট</span>
                  <p className="text-xs text-slate-400">
                    মেসেজ আদান-প্রদানে মৃদু ও মনোরম ক্লিক শব্দ সক্রিয় করুন
                  </p>
                </div>
                <label className="relative inline-flex items-center cursor-pointer shrink-0">
                  <input
                    type="checkbox"
                    checked={settings.soundEnabled}
                    onChange={(e) => onUpdateSettings({ soundEnabled: e.target.checked })}
                    className="sr-only peer"
                  />
                  <div className="w-11 h-6 bg-white/10 peer-focus:outline-none rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-rose-500"></div>
                </label>
              </div>
            </div>
          )}

          {/* TAB 4: Audio & Voice */}
          {activeTab === 'audio' && (
            <div className="space-y-5">
              {/* Auto Read Aloud Toggle */}
              <div className="p-4 rounded-2xl bg-white/5 border border-white/10 flex items-center justify-between">
                <div className="space-y-0.5 pr-4">
                  <span className="text-sm font-bold text-white block">স্বয়ংক্রিয় ভয়েস রিড-আউট</span>
                  <p className="text-xs text-slate-400">
                    {companionName}-এর উত্তর আসার পর স্বয়ংক্রিয়ভাবে মিষ্টি কণ্ঠে পড়ে শোনাবে
                  </p>
                </div>
                <label className="relative inline-flex items-center cursor-pointer shrink-0">
                  <input
                    type="checkbox"
                    checked={settings.autoSpeak}
                    onChange={(e) => onUpdateSettings({ autoSpeak: e.target.checked })}
                    className="sr-only peer"
                  />
                  <div className="w-11 h-6 bg-white/10 peer-focus:outline-none rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-rose-500"></div>
                </label>
              </div>

              {/* Voice Speed Slider */}
              <div>
                <div className="flex items-center justify-between mb-2">
                  <label className="text-xs font-bold uppercase tracking-wider text-slate-300">
                    কথা বলার গতি (Voice Speed)
                  </label>
                  <span className="text-xs text-rose-400 font-bold">{settings.speechRate}x</span>
                </div>
                <input
                  type="range"
                  min="0.7"
                  max="1.3"
                  step="0.1"
                  value={settings.speechRate}
                  onChange={(e) => onUpdateSettings({ speechRate: parseFloat(e.target.value) })}
                  className="w-full accent-rose-500 h-1.5 bg-white/10 rounded-lg cursor-pointer"
                />
                <div className="flex justify-between text-[10px] text-slate-500 mt-1">
                  <span>ধীর (0.7x)</span>
                  <span>স্বাভাবিক (1.0x)</span>
                  <span>দ্রুত (1.3x)</span>
                </div>
              </div>
            </div>
          )}

          {/* TAB 5: Privacy & Data */}
          {activeTab === 'privacy' && (
            <div className="space-y-4">
              {/* Anonymous Mode Verified Badge */}
              <div className="p-4 rounded-2xl bg-emerald-500/10 border border-emerald-500/30 flex items-start gap-3">
                <ShieldCheck className="w-5 h-5 text-emerald-400 shrink-0 mt-0.5" />
                <div className="space-y-1">
                  <h4 className="text-sm font-bold text-emerald-300">
                    ১০০% সুরক্ষিত ও বেনামী (Anonymous) মোড সক্রিয়
                  </h4>
                  <p className="text-xs text-slate-300 leading-relaxed">
                    আপনার কোনো ব্যক্তিগত নাম বা পরিচয় এখানে সংরক্ষিত নেই। আপনার যাবতীয় চ্যাট শুধুমাত্র আপনার ডিভাইসের ব্রাউজারেই থাকে।
                  </p>
                </div>
              </div>

              {/* Export Chat */}
              <div className="p-4 rounded-2xl bg-white/5 border border-white/10 flex items-center justify-between">
                <div className="space-y-0.5">
                  <span className="text-sm font-bold text-white block flex items-center gap-2">
                    <span>পিডিএফ চ্যাট ডায়েরি ডাউনলোড</span>
                    <span className="text-[10px] bg-rose-500/20 text-rose-300 px-2 py-0.5 rounded-full font-semibold border border-rose-500/30">
                      তারিখ অনুযায়ী সাজানো
                    </span>
                  </span>
                  <p className="text-xs text-slate-400">
                    আকর্ষণীয় স্টাইলে তারিখ অনুযায়ী সাজানো পিডিএফ অ্যালবাম হিসেবে সেভ করুন
                  </p>
                </div>
                <button
                  type="button"
                  onClick={() => {
                    onClose();
                    onExportChat();
                  }}
                  className="px-3.5 py-2 rounded-xl bg-gradient-to-r from-rose-600 to-pink-600 hover:from-rose-500 hover:to-pink-500 text-white text-xs font-bold flex items-center gap-1.5 transition-all shadow-md shadow-rose-600/25 active:scale-95 shrink-0"
                >
                  <Download className="w-3.5 h-3.5" />
                  <span>PDF ডাউনলোড</span>
                </button>
              </div>

              {/* Clear Current Chat */}
              <div className="p-4 rounded-2xl bg-white/5 border border-white/10 flex items-center justify-between">
                <div className="space-y-0.5">
                  <span className="text-sm font-bold text-white block">বর্তমান চ্যাট খালি করুন</span>
                  <p className="text-xs text-slate-400">এই সেশনের আগের সব মেসেজ মুছে নতুন করে শুরু করুন</p>
                </div>
                {showClearConfirm ? (
                  <div className="flex items-center gap-1.5">
                    <button
                      onClick={() => {
                        onClearCurrentChat();
                        setShowClearConfirm(false);
                      }}
                      className="px-3 py-1.5 rounded-lg bg-rose-600 hover:bg-rose-500 text-white text-xs font-bold"
                    >
                      হ্যাঁ, মুছুন
                    </button>
                    <button
                      onClick={() => setShowClearConfirm(false)}
                      className="px-2 py-1.5 rounded-lg bg-white/10 text-slate-300 text-xs"
                    >
                      বাতিল
                    </button>
                  </div>
                ) : (
                  <button
                    type="button"
                    onClick={() => setShowClearConfirm(true)}
                    className="px-3.5 py-2 rounded-xl bg-rose-500/10 hover:bg-rose-500/20 text-rose-300 border border-rose-500/30 text-xs font-semibold flex items-center gap-1.5 transition-all"
                  >
                    <Trash2 className="w-3.5 h-3.5" />
                    <span>ক্লিয়ার চ্যাট</span>
                  </button>
                )}
              </div>

              {/* Reset All Sessions */}
              <div className="p-4 rounded-2xl bg-rose-950/20 border border-rose-500/30 flex items-center justify-between">
                <div className="space-y-0.5">
                  <span className="text-sm font-bold text-rose-300 block">সমস্ত চ্যাট রিসেট</span>
                  <p className="text-xs text-slate-400">সমস্ত পুরনো চ্যাট তালিকা ও সেশন স্থায়ীভাবে মুছে যাবে</p>
                </div>
                {showResetConfirm ? (
                  <div className="flex items-center gap-1.5">
                    <button
                      onClick={() => {
                        onClearAllChats();
                        setShowResetConfirm(false);
                        onClose();
                      }}
                      className="px-3 py-1.5 rounded-lg bg-rose-600 hover:bg-rose-500 text-white text-xs font-bold"
                    >
                      সব রিসেট
                    </button>
                    <button
                      onClick={() => setShowResetConfirm(false)}
                      className="px-2 py-1.5 rounded-lg bg-white/10 text-slate-300 text-xs"
                    >
                      বাতিল
                    </button>
                  </div>
                ) : (
                  <button
                    type="button"
                    onClick={() => setShowResetConfirm(true)}
                    className="px-3.5 py-2 rounded-xl bg-rose-600/20 hover:bg-rose-600/30 text-rose-400 border border-rose-500/40 text-xs font-semibold flex items-center gap-1.5 transition-all"
                  >
                    <RotateCcw className="w-3.5 h-3.5" />
                    <span>সব রিসেট</span>
                  </button>
                )}
              </div>

              {/* Admin Panel Quick Launcher */}
              {onOpenAdminModal && (
                <div className="p-4 rounded-2xl bg-cyan-950/30 border border-cyan-500/30 flex items-center justify-between">
                  <div className="space-y-0.5">
                    <div className="flex items-center gap-2">
                      <Shield className="w-4 h-4 text-cyan-400" />
                      <span className="text-sm font-bold text-cyan-300">এডমিন কন্ট্রোল প্যানেল</span>
                    </div>
                    <p className="text-xs text-slate-400">
                      NLP মডেল, ভয়েস কল পেওয়াল ও ইউজার VIP স্ট্যাটাস নিয়ন্ত্রণ করুন
                    </p>
                  </div>
                  <button
                    type="button"
                    onClick={() => {
                      onClose();
                      onOpenAdminModal();
                    }}
                    className="px-4 py-2 rounded-xl bg-cyan-500 hover:bg-cyan-400 text-slate-950 text-xs font-bold transition-all shadow-md"
                  >
                    প্রবেশ করুন
                  </button>
                </div>
              )}
            </div>
          )}
        </div>

        {/* Footer */}
        <div className="px-5 py-3 border-t border-white/10 bg-[#141829] flex items-center justify-between">
          <span className="text-xs text-slate-400">
            পরিবর্তনগুলো সাথে সাথে অ্যাপ্লিকেশনে সক্রিয় হয়ে যাবে ✨
          </span>
          <button
            onClick={onClose}
            className="px-5 py-2 rounded-xl bg-gradient-to-r from-rose-600 to-pink-600 hover:from-rose-500 hover:to-pink-500 text-white text-xs font-bold shadow-md shadow-rose-600/20 transition-all"
          >
            সম্পন্ন (Done)
          </button>
        </div>
      </div>
    </div>
  );
};

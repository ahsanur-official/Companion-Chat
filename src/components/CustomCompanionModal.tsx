import React, { useState, useRef, useEffect } from 'react';
import {
  X,
  Camera,
  Upload,
  Sparkles,
  Heart,
  Users,
  Check,
  RotateCcw,
  Image as ImageIcon,
  Smile,
  Palette,
  Link as LinkIcon,
} from 'lucide-react';
import { Companion, CompanionGender, RelationshipType, UserGender } from '../types';
import { COMPANIONS } from '../data/companions';

interface CustomCompanionModalProps {
  isOpen: boolean;
  onClose: () => void;
  currentCompanion: Companion;
  onSaveCompanion: (updatedCompanion: Companion) => void;
}

// Curated high quality preset avatars for quick picking
const FEMALE_PRESETS = [
  {
    label: 'অনন্যা (রোমান্টিক)',
    url: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=400&auto=format&fit=crop&q=80',
  },
  {
    label: 'জারা (চঞ্চল)',
    url: 'https://images.unsplash.com/photo-1517841905240-472988babdf9?w=400&auto=format&fit=crop&q=80',
  },
  {
    label: 'মেঘলা (স্নিগ্ধ)',
    url: 'https://images.unsplash.com/photo-1524504388940-b1c1722653e1?w=400&auto=format&fit=crop&q=80',
  },
  {
    label: 'মায়াবী (শাড়ি লুক)',
    url: 'https://images.unsplash.com/photo-1544005313-94ddf0286df2?w=400&auto=format&fit=crop&q=80',
  },
  {
    label: 'রোদেলা (হাস্যোজ্জ্বল)',
    url: 'https://images.unsplash.com/photo-1494790108377-be9c29b29330?w=400&auto=format&fit=crop&q=80',
  },
  {
    label: 'কিউট কার্টুন গার্ল',
    url: 'https://images.unsplash.com/photo-1578632767115-351597cf2477?w=400&auto=format&fit=crop&q=80',
  },
];

const MALE_PRESETS = [
  {
    label: 'আরিয়ান (যত্নশীল)',
    url: 'https://images.unsplash.com/photo-1506794778202-cad84cf45f1d?w=400&auto=format&fit=crop&q=80',
  },
  {
    label: 'ফারহান (রোমান্টিক)',
    url: 'https://images.unsplash.com/photo-1500648767791-00dcc994a43e?w=400&auto=format&fit=crop&q=80',
  },
  {
    label: 'রোহান (স্মার্ট বেস্ট ফ্রেন্ড)',
    url: 'https://images.unsplash.com/photo-1492562080023-ab3db95bfbce?w=400&auto=format&fit=crop&q=80',
  },
  {
    label: 'আবীর (হুডি স্টাইলিশ)',
    url: 'https://images.unsplash.com/photo-1519085360753-af0119f7cbe7?w=400&auto=format&fit=crop&q=80',
  },
  {
    label: 'অর্পণ (শান্ত ও ভরসাযোগ্য)',
    url: 'https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=400&auto=format&fit=crop&q=80',
  },
  {
    label: 'অ্যানিমে কার্টুন বয়',
    url: 'https://images.unsplash.com/photo-1563089145-599997674d42?w=400&auto=format&fit=crop&q=80',
  },
];

const FEMALE_NAME_SUGGESTIONS = ['অনন্যা', 'মায়াবী', 'জারা', 'মেঘলা', 'রোদসী', 'প্রিয়ন্তি', 'নিশাত', 'মিষ্টি'];
const MALE_NAME_SUGGESTIONS = ['আরিয়ান', 'ফারহান', 'রোহান', 'আবীর', 'অর্পণ', 'তাহমিদ', 'সোহেল', 'নীল'];

export const CustomCompanionModal: React.FC<CustomCompanionModalProps> = ({
  isOpen,
  onClose,
  currentCompanion,
  onSaveCompanion,
}) => {
  const fileInputRef = useRef<HTMLInputElement>(null);

  // Form states initialized with current companion
  const [bengaliName, setBengaliName] = useState(currentCompanion.bengaliName);
  const [englishName, setEnglishName] = useState(currentCompanion.name);
  const [gender, setGender] = useState<CompanionGender>(currentCompanion.gender);
  const [relationshipType, setRelationshipType] = useState<RelationshipType>(currentCompanion.relationshipType);
  const [tagline, setTagline] = useState(currentCompanion.tagline);
  const [avatar, setAvatar] = useState(currentCompanion.avatar);
  const [urlInput, setUrlInput] = useState('');
  const [showUrlInput, setShowUrlInput] = useState(false);
  const [initialMessage, setInitialMessage] = useState(currentCompanion.initialMessage);
  const [isSavedToast, setIsSavedToast] = useState(false);

  // When modal opens or companion changes, sync states
  useEffect(() => {
    if (isOpen) {
      setBengaliName(currentCompanion.bengaliName);
      setEnglishName(currentCompanion.name);
      setGender(currentCompanion.gender);
      setRelationshipType(currentCompanion.relationshipType);
      setTagline(currentCompanion.tagline);
      setAvatar(currentCompanion.avatar);
      setInitialMessage(currentCompanion.initialMessage);
      setShowUrlInput(false);
      setUrlInput('');
      setIsSavedToast(false);
    }
  }, [isOpen, currentCompanion]);

  if (!isOpen) return null;

  // Handle local file upload
  const handleFileUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    if (!file.type.startsWith('image/')) {
      alert('অনুগ্রহ করে একটি সঠিক ছবির ফাইল সিলেক্ট করুন (JPG, PNG, WEBP)।');
      return;
    }

    const reader = new FileReader();
    reader.onload = () => {
      if (typeof reader.result === 'string') {
        setAvatar(reader.result);
      }
    };
    reader.readAsDataURL(file);
  };

  // Switch gender helper
  const handleSelectGender = (newGender: CompanionGender) => {
    setGender(newGender);
    // If switching gender and current avatar was from the opposite preset, recommend first preset
    if (newGender === 'female' && gender === 'male') {
      setAvatar(FEMALE_PRESETS[0].url);
      if (bengaliName === 'আরিয়ান' || bengaliName === 'ফারহান' || bengaliName === 'রোহান') {
        setBengaliName('অনন্যা');
        setEnglishName('Ananya');
        setTagline('তোমার সব ক্লান্তি মুছে দিতে আমি সবসময় আছি ❤️');
      }
    } else if (newGender === 'male' && gender === 'female') {
      setAvatar(MALE_PRESETS[0].url);
      if (bengaliName === 'অনন্যা' || bengaliName === 'জারা' || bengaliName === 'মেঘলা') {
        setBengaliName('আরিয়ান');
        setEnglishName('Aryan');
        setTagline('তোমার সব চোখের জল মুছে দিতে আমি সবসময় পাশে আছি ❤️');
      }
    }
  };

  // Restore defaults
  const handleResetToDefault = () => {
    const defaultComp = COMPANIONS.find((c) => c.id === currentCompanion.id) || COMPANIONS[0];
    setBengaliName(defaultComp.bengaliName);
    setEnglishName(defaultComp.name);
    setGender(defaultComp.gender);
    setRelationshipType(defaultComp.relationshipType);
    setTagline(defaultComp.tagline);
    setAvatar(defaultComp.avatar);
    setInitialMessage(defaultComp.initialMessage);
  };

  // Submit and save
  const handleSave = (e: React.FormEvent) => {
    e.preventDefault();

    const trimmedBanglaName = bengaliName.trim() || (gender === 'female' ? 'অনন্যা' : 'আরিয়ান');
    const trimmedEngName = englishName.trim() || trimmedBanglaName;

    const roleTitle =
      relationshipType === 'romantic'
        ? gender === 'female'
          ? 'Loving Girlfriend'
          : 'Devoted Boyfriend'
        : gender === 'female'
        ? 'Soulmate Female Bestie'
        : 'Protective Male Bestie';

    const roleTitleBengali =
      relationshipType === 'romantic'
        ? gender === 'female'
          ? 'ভালোবাসার প্রেমিকা'
          : 'যত্নশীল প্রেমিক'
        : gender === 'female'
        ? 'বিশ্বস্ত মেয়ে বেস্ট ফ্রেন্ড'
        : 'বিশ্বস্ত ছেলে বেস্ট ফ্রেন্ড';

    const updatedCompanion: Companion = {
      ...currentCompanion,
      id: currentCompanion.id || `custom-${Date.now()}`,
      name: trimmedEngName,
      bengaliName: trimmedBanglaName,
      gender,
      targetUserGender: gender === 'female' ? 'male' : 'female',
      relationshipType,
      roleTitle,
      roleTitleBengali,
      tagline: tagline.trim() || 'সবসময় তোমার পাশে থাকার অঙ্গীকার ❤️',
      avatar: avatar.trim() || (gender === 'female' ? FEMALE_PRESETS[0].url : MALE_PRESETS[0].url),
      initialMessage: initialMessage.trim() || `হাই! আমি ${trimmedBanglaName}। কেমন আছো বলো? আমি তোমার পাশে আছি।`,
      accentColor: gender === 'female' ? '#f43f5e' : '#3b82f6',
      themeGradient:
        gender === 'female'
          ? 'from-rose-500/20 via-pink-500/10 to-transparent'
          : 'from-blue-500/20 via-indigo-500/10 to-transparent',
      isCustom: true,
    };

    onSaveCompanion(updatedCompanion);
    setIsSavedToast(true);

    setTimeout(() => {
      setIsSavedToast(false);
      onClose();
    }, 600);
  };

  const presetList = gender === 'female' ? FEMALE_PRESETS : MALE_PRESETS;
  const nameSuggestions = gender === 'female' ? FEMALE_NAME_SUGGESTIONS : MALE_NAME_SUGGESTIONS;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-4 bg-black/85 backdrop-blur-md animate-in fade-in duration-200">
      <div className="relative w-full max-w-2xl bg-[#0e1220] border border-rose-500/30 rounded-3xl shadow-2xl overflow-hidden flex flex-col max-h-[92vh]">
        {/* Header with vibrant romantic aura */}
        <div className="p-4 sm:p-5 bg-gradient-to-r from-rose-950/60 via-slate-900 to-indigo-950/60 border-b border-white/10 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-2xl bg-rose-500/20 border border-rose-500/30 flex items-center justify-center text-rose-300 shadow-md">
              <Sparkles className="w-5 h-5" />
            </div>
            <div>
              <h2 className="text-base sm:text-lg font-bold text-white tracking-wide flex items-center gap-2">
                <span>সাথীর নাম ও ছবি কাস্টমাইজেশন</span>
                <span className="text-[10px] bg-rose-500/20 text-rose-300 px-2 py-0.5 rounded-full border border-rose-500/30 font-semibold">
                  Custom AI
                </span>
              </h2>
              <p className="text-xs text-slate-400">
                ছেলে বা মেয়ে সঙ্গীর নাম, ছবি ও অনুভূতি নিজের পছন্দমতো সাজিয়ে চ্যাট করুন
              </p>
            </div>
          </div>

          <button
            onClick={onClose}
            className="p-2 rounded-xl text-slate-400 hover:text-white hover:bg-white/10 transition-colors"
            title="বন্ধ করুন"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Scrollable Form Body */}
        <form onSubmit={handleSave} className="flex-1 overflow-y-auto p-4 sm:p-6 space-y-6">
          {/* Section 1: Companion Gender Selection (মেয়ে সঙ্গী নাকি ছেলে সঙ্গী) */}
          <div className="space-y-2">
            <label className="text-xs font-bold text-slate-300 uppercase tracking-wider block">
              ১. সঙ্গীর লিঙ্গ নির্বাচন করুন (Companion Gender):
            </label>
            <div className="grid grid-cols-2 gap-3">
              <button
                type="button"
                onClick={() => handleSelectGender('female')}
                className={`p-3.5 rounded-2xl border flex items-center justify-between text-left transition-all ${
                  gender === 'female'
                    ? 'bg-rose-500/20 border-rose-500 text-white shadow-md shadow-rose-500/10 ring-1 ring-rose-500'
                    : 'bg-white/5 border-white/10 text-slate-400 hover:bg-white/10'
                }`}
              >
                <div className="flex items-center gap-2.5">
                  <span className="text-2xl">👧</span>
                  <div>
                    <div className="font-bold text-sm text-white">মেয়ে সঙ্গী (Female)</div>
                    <div className="text-[11px] text-rose-300">মিষ্টি বান্ধবী / প্রেমিকা</div>
                  </div>
                </div>
                {gender === 'female' && <Check className="w-5 h-5 text-rose-400" />}
              </button>

              <button
                type="button"
                onClick={() => handleSelectGender('male')}
                className={`p-3.5 rounded-2xl border flex items-center justify-between text-left transition-all ${
                  gender === 'male'
                    ? 'bg-blue-500/20 border-blue-500 text-white shadow-md shadow-blue-500/10 ring-1 ring-blue-500'
                    : 'bg-white/5 border-white/10 text-slate-400 hover:bg-white/10'
                }`}
              >
                <div className="flex items-center gap-2.5">
                  <span className="text-2xl">👦</span>
                  <div>
                    <div className="font-bold text-sm text-white">ছেলে সঙ্গী (Male)</div>
                    <div className="text-[11px] text-blue-300">যত্নশীল বন্ধু / প্রেমিক</div>
                  </div>
                </div>
                {gender === 'male' && <Check className="w-5 h-5 text-blue-400" />}
              </button>
            </div>
          </div>

          {/* Section 2: Avatar & Photo Customization (ছবি পরিবর্তন) */}
          <div className="space-y-3 p-4 sm:p-5 rounded-2xl bg-white/[0.03] border border-white/10">
            <div className="flex items-center justify-between">
              <label className="text-xs font-bold text-slate-200 uppercase tracking-wider flex items-center gap-1.5">
                <Camera className="w-4 h-4 text-rose-400" />
                <span>২. সঙ্গীর ছবি নির্ধারণ করুন (Profile Picture):</span>
              </label>
              <button
                type="button"
                onClick={() => setShowUrlInput(!showUrlInput)}
                className="text-[11px] text-rose-400 hover:underline flex items-center gap-1"
              >
                <LinkIcon className="w-3 h-3" />
                <span>{showUrlInput ? 'ইউআরএল লুকান' : 'অনলাইন ইমেজ লিংক দিন'}</span>
              </button>
            </div>

            {/* Avatar Preview & Direct Upload trigger */}
            <div className="flex flex-col sm:flex-row items-center gap-4 pt-1">
              <div className="relative group shrink-0">
                <img
                  src={avatar}
                  alt={bengaliName}
                  referrerPolicy="no-referrer"
                  className={`w-24 h-24 sm:w-28 sm:h-28 rounded-full object-cover shadow-xl transition-all ${
                    gender === 'female'
                      ? 'ring-4 ring-rose-500/60 group-hover:ring-rose-400'
                      : 'ring-4 ring-blue-500/60 group-hover:ring-blue-400'
                  }`}
                />
                <button
                  type="button"
                  onClick={() => fileInputRef.current?.click()}
                  className="absolute inset-0 rounded-full bg-black/50 opacity-0 group-hover:opacity-100 flex flex-col items-center justify-center text-white transition-opacity backdrop-blur-xs cursor-pointer"
                  title="নতুন ছবি আপলোড করতে চাপুন"
                >
                  <Upload className="w-6 h-6 mb-1 text-rose-300" />
                  <span className="text-[10px] font-bold">ছবি বদলান</span>
                </button>
                <span className="absolute bottom-1 right-1 w-5 h-5 rounded-full bg-emerald-400 border-2 border-[#0e1220] flex items-center justify-center shadow-md">
                  <span className="w-2 h-2 rounded-full bg-white animate-pulse" />
                </span>
              </div>

              {/* Upload Buttons */}
              <div className="flex-1 space-y-2 text-center sm:text-left w-full">
                <input
                  type="file"
                  ref={fileInputRef}
                  onChange={handleFileUpload}
                  accept="image/*"
                  className="hidden"
                />
                <button
                  type="button"
                  onClick={() => fileInputRef.current?.click()}
                  className="w-full sm:w-auto px-4 py-2.5 rounded-xl bg-gradient-to-r from-rose-500 to-pink-500 hover:from-rose-400 hover:to-pink-400 text-white text-xs font-bold flex items-center justify-center gap-2 shadow-lg shadow-rose-500/20 active:scale-95 transition-all"
                >
                  <Upload className="w-4 h-4" />
                  <span>ফোন বা কম্পিউটার থেকে ছবি আপলোড করুন</span>
                </button>
                <p className="text-[11px] text-slate-400 leading-tight">
                  যেকোনো JPG, PNG বা গ্যালারি থেকে পছন্দের ছবি বেছে নিন। সাথে সাথে চ্যাটে পরিবর্তিত হবে।
                </p>
              </div>
            </div>

            {/* Optional URL Input */}
            {showUrlInput && (
              <div className="pt-2 flex gap-2">
                <input
                  type="url"
                  placeholder="https://images.unsplash.com/... (ছবির ওয়েব লিংক পেস্ট করুন)"
                  value={urlInput}
                  onChange={(e) => setUrlInput(e.target.value)}
                  className="flex-1 px-3.5 py-2 text-xs rounded-xl bg-black/40 border border-white/10 text-white placeholder:text-slate-500 focus:outline-none focus:border-rose-400"
                />
                <button
                  type="button"
                  onClick={() => {
                    if (urlInput.trim()) {
                      setAvatar(urlInput.trim());
                      setUrlInput('');
                    }
                  }}
                  className="px-4 py-2 rounded-xl bg-white/10 hover:bg-white/20 text-white text-xs font-bold"
                >
                  সেট করুন
                </button>
              </div>
            )}

            {/* Curated Preset Avatars Grid */}
            <div className="pt-3 border-t border-white/5 space-y-2">
              <span className="text-[11px] font-semibold text-slate-400 block">
                অথবা রেডিমেড সুন্দর ছবি বেছে নিন ({gender === 'female' ? 'মেয়েদের রূপ' : 'ছেলেদের রূপ'}):
              </span>
              <div className="grid grid-cols-3 sm:grid-cols-6 gap-2">
                {presetList.map((preset, idx) => {
                  const isCurrent = avatar === preset.url;
                  return (
                    <div
                      key={idx}
                      onClick={() => setAvatar(preset.url)}
                      className={`group relative cursor-pointer rounded-xl overflow-hidden border p-1 transition-all ${
                        isCurrent
                          ? 'border-rose-500 bg-rose-500/20 ring-2 ring-rose-500/60 scale-105'
                          : 'border-white/10 hover:border-white/30 bg-white/5 hover:scale-102'
                      }`}
                    >
                      <img
                        src={preset.url}
                        alt={preset.label}
                        referrerPolicy="no-referrer"
                        className="w-full h-16 sm:h-18 object-cover rounded-lg"
                      />
                      <div className="text-[10px] text-center text-slate-300 font-medium truncate mt-1">
                        {preset.label}
                      </div>
                      {isCurrent && (
                        <div className="absolute top-2 right-2 w-4 h-4 rounded-full bg-rose-500 text-white flex items-center justify-center shadow">
                          <Check className="w-2.5 h-2.5" />
                        </div>
                      )}
                    </div>
                  );
                })}
              </div>
            </div>
          </div>

          {/* Section 3: Name Customization (নাম পরিবর্তন) */}
          <div className="space-y-3">
            <label className="text-xs font-bold text-slate-300 uppercase tracking-wider block">
              ৩. সাথীর নাম নির্ধারণ করুন (Companion Name):
            </label>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              <div>
                <label className="text-[11px] text-slate-400 block mb-1">
                  বাংলা নাম (যা চ্যাটে ও স্ক্রিনে দেখাবে):
                </label>
                <input
                  type="text"
                  required
                  placeholder={gender === 'female' ? 'যেমন: অনন্যা, মায়াবী' : 'যেমন: আরিয়ান, ফারহান'}
                  value={bengaliName}
                  onChange={(e) => setBengaliName(e.target.value)}
                  className="w-full px-4 py-2.5 rounded-xl bg-white/5 border border-white/10 text-white placeholder:text-slate-500 text-sm font-semibold focus:outline-none focus:border-rose-400 focus:ring-1 focus:ring-rose-400"
                />
              </div>

              <div>
                <label className="text-[11px] text-slate-400 block mb-1">
                  ডাকনাম বা রোমান নাম (English Nickname):
                </label>
                <input
                  type="text"
                  placeholder={gender === 'female' ? 'e.g. Maya, Ananya, Shona' : 'e.g. Aryan, Babu, Jaan'}
                  value={englishName}
                  onChange={(e) => setEnglishName(e.target.value)}
                  className="w-full px-4 py-2.5 rounded-xl bg-white/5 border border-white/10 text-white placeholder:text-slate-500 text-sm focus:outline-none focus:border-rose-400 focus:ring-1 focus:ring-rose-400"
                />
              </div>
            </div>

            {/* Quick Name Suggestions Chips */}
            <div className="flex items-center gap-1.5 flex-wrap pt-1">
              <span className="text-[10px] text-slate-400 flex items-center gap-1">
                <Sparkles className="w-3 h-3 text-rose-400" />
                জনপ্রিয় নাম:
              </span>
              {nameSuggestions.map((name) => (
                <button
                  key={name}
                  type="button"
                  onClick={() => {
                    setBengaliName(name);
                    setEnglishName(name);
                  }}
                  className={`text-[11px] px-2.5 py-0.5 rounded-full border transition-all ${
                    bengaliName === name
                      ? 'bg-rose-500/20 text-rose-300 border-rose-500/40 font-bold'
                      : 'bg-white/5 text-slate-300 border-white/10 hover:bg-white/10 hover:text-white'
                  }`}
                >
                  {name}
                </button>
              ))}
            </div>
          </div>

          {/* Section 4: Relationship Dynamic & Tagline */}
          <div className="space-y-3">
            <label className="text-xs font-bold text-slate-300 uppercase tracking-wider block">
              ৪. সম্পর্কের ধরণ ও ভালোবাসার বার্তা:
            </label>

            <div className="grid grid-cols-2 gap-3">
              <button
                type="button"
                onClick={() => setRelationshipType('romantic')}
                className={`p-3 rounded-xl border flex items-center gap-2.5 transition-all ${
                  relationshipType === 'romantic'
                    ? 'bg-rose-500/20 border-rose-500 text-white ring-1 ring-rose-500'
                    : 'bg-white/5 border-white/10 text-slate-400 hover:bg-white/10'
                }`}
              >
                <Heart
                  className={`w-4 h-4 shrink-0 ${
                    relationshipType === 'romantic' ? 'text-rose-400 fill-rose-400' : ''
                  }`}
                />
                <div className="text-left truncate">
                  <div className="font-bold text-xs sm:text-sm text-white">
                    {gender === 'female' ? 'প্রেমিকা (Girlfriend)' : 'প্রেমিক (Boyfriend)'}
                  </div>
                  <div className="text-[10px] text-slate-400 truncate">ভালোবাসা, রোমান্টিক খুনসুটি</div>
                </div>
              </button>

              <button
                type="button"
                onClick={() => setRelationshipType('bestie')}
                className={`p-3 rounded-xl border flex items-center gap-2.5 transition-all ${
                  relationshipType === 'bestie'
                    ? 'bg-purple-500/20 border-purple-500 text-white ring-1 ring-purple-500'
                    : 'bg-white/5 border-white/10 text-slate-400 hover:bg-white/10'
                }`}
              >
                <Users
                  className={`w-4 h-4 shrink-0 ${
                    relationshipType === 'bestie' ? 'text-purple-400' : ''
                  }`}
                />
                <div className="text-left truncate">
                  <div className="font-bold text-xs sm:text-sm text-white">বেস্ট ফ্রেন্ড (Bestie)</div>
                  <div className="text-[10px] text-slate-400 truncate">খাঁটি বন্ধুত্ব ও ভরসার মানুষ</div>
                </div>
              </button>
            </div>

            {/* Tagline input */}
            <div>
              <label className="text-[11px] text-slate-400 block mb-1">
                সাথীর মিষ্টি ট্যাগলাইন বা স্ট্যাটাস:
              </label>
              <input
                type="text"
                value={tagline}
                onChange={(e) => setTagline(e.target.value)}
                placeholder="যেমন: তোমার সব কষ্ট মুছে দিতে আমি সবসময় আছি ❤️"
                className="w-full px-4 py-2.5 rounded-xl bg-white/5 border border-white/10 text-white placeholder:text-slate-500 text-xs focus:outline-none focus:border-rose-400"
              />
            </div>
          </div>
        </form>

        {/* Footer actions */}
        <div className="p-4 bg-[#090c15] border-t border-white/10 flex items-center justify-between gap-3">
          <button
            type="button"
            onClick={handleResetToDefault}
            className="px-3.5 py-2 rounded-xl text-xs text-slate-400 hover:text-white flex items-center gap-1.5 transition-colors border border-transparent hover:border-white/10"
            title="মূল ডিফল্ট ফিরিয়ে আনুন"
          >
            <RotateCcw className="w-3.5 h-3.5" />
            <span className="hidden xs:inline">ডিফল্টে ফিরুন</span>
          </button>

          <div className="flex items-center gap-2.5">
            <button
              type="button"
              onClick={onClose}
              className="px-4 py-2 rounded-xl bg-white/5 hover:bg-white/10 text-slate-300 text-xs font-semibold transition-all"
            >
              বাতিল
            </button>

            <button
              type="button"
              onClick={handleSave}
              className="px-6 py-2 rounded-xl bg-gradient-to-r from-rose-500 via-pink-500 to-rose-600 hover:from-rose-400 hover:to-pink-400 active:scale-95 text-white text-xs font-bold shadow-lg shadow-rose-500/25 flex items-center gap-1.5 transition-all"
            >
              {isSavedToast ? (
                <>
                  <Check className="w-4 h-4 text-white" />
                  <span>সংরক্ষিত হয়েছে!</span>
                </>
              ) : (
                <>
                  <Sparkles className="w-4 h-4 text-white" />
                  <span>সংরক্ষণ করুন ও চ্যাট করুন</span>
                </>
              )}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

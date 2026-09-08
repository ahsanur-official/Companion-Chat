import React, { useState } from 'react';
import { Sparkles, Heart, Check, ArrowRight, Smile, UserCheck, ShieldCheck, Stars } from 'lucide-react';
import { UserGender, RelationshipType, Companion } from '../types';
import { COMPANIONS } from '../data/companions';
import { CartoonAvatar } from './CartoonAvatars';

interface CartoonOnboardingModalProps {
  isOpen: boolean;
  onClose: () => void;
  onComplete: (gender: UserGender, name: string, relationType: RelationshipType, companion: Companion) => void;
  initialGender?: UserGender;
  initialName?: string;
}

export const CartoonOnboardingModal: React.FC<CartoonOnboardingModalProps> = ({
  isOpen,
  onClose,
  onComplete,
  initialGender = 'male',
  initialName = '',
}) => {
  const [selectedGender, setSelectedGender] = useState<UserGender>(initialGender);
  const [userName, setUserName] = useState(initialName || '');
  const [relationshipType, setRelationshipType] = useState<RelationshipType>('romantic');
  const [boyStyle, setBoyStyle] = useState<'boy_cool' | 'boy_cap'>('boy_cool');
  const [girlStyle, setGirlStyle] = useState<'girl_sweet' | 'girl_cat'>('girl_sweet');

  if (!isOpen) return null;

  // Selected companion preview based on user gender
  const suggestedCompanion = COMPANIONS.find(
    (c) => c.targetUserGender === selectedGender && c.relationshipType === relationshipType
  ) || COMPANIONS.find((c) => c.targetUserGender === selectedGender) || COMPANIONS[0];

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const finalName = userName.trim();
    onComplete(selectedGender, finalName, relationshipType, suggestedCompanion);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-5 bg-black/85 backdrop-blur-md animate-in fade-in duration-300">
      <div className="relative w-full max-w-xl bg-gradient-to-b from-[#151928] to-[#0c0e17] border border-rose-500/30 rounded-3xl shadow-2xl overflow-hidden flex flex-col max-h-[92vh]">
        {/* Glow ambient background effects */}
        <div className="absolute -top-16 -left-16 w-56 h-56 bg-rose-500/20 rounded-full blur-3xl pointer-events-none" />
        <div className="absolute -bottom-16 -right-16 w-56 h-56 bg-purple-500/20 rounded-full blur-3xl pointer-events-none" />

        {/* Top Header Banner */}
        <div className="relative pt-6 pb-4 px-6 text-center border-b border-white/10 bg-gradient-to-r from-rose-900/30 via-purple-900/30 to-indigo-900/30">
          <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-rose-500/20 border border-rose-500/30 text-rose-300 text-xs font-semibold uppercase tracking-wider mb-2">
            <Sparkles className="w-3.5 h-3.5 text-rose-400" />
            <span>মনের সাথী • কিউট কার্টুন সাথী</span>
            <Heart className="w-3 h-3 fill-rose-400 text-rose-400" />
          </div>
          <h2 className="text-xl sm:text-2xl font-black text-white tracking-tight">
            কার্টুন ক্যারেক্টার ও পরিচয় বাছাই করুন ✨
          </h2>
          <p className="text-xs sm:text-sm text-slate-300 mt-1 max-w-md mx-auto">
            আপনার পছন্দের কার্টুন অবতার বেছে নিন এবং মনের কথা শেয়ার করুন
          </p>
        </div>

        {/* Form Body */}
        <form onSubmit={handleSubmit} className="p-5 sm:p-6 overflow-y-auto space-y-5">
          {/* Cartoon Character Cards */}
          <div>
            <label className="block text-xs font-bold text-slate-300 uppercase tracking-wider mb-2.5 text-center">
              ১. আপনি কি ছেলে নাকি মেয়ে? (কার্টুন ক্যারেক্টার বাছুন)
            </label>

            <div className="grid grid-cols-2 gap-3 sm:gap-4">
              {/* BOY Cartoon Card */}
              <div
                onClick={() => setSelectedGender('male')}
                className={`relative cursor-pointer rounded-2xl p-4 border-2 transition-all duration-200 flex flex-col items-center text-center group ${
                  selectedGender === 'male'
                    ? 'border-sky-500 bg-sky-500/15 shadow-xl shadow-sky-500/20 scale-[1.02]'
                    : 'border-white/10 bg-white/5 hover:border-white/20 hover:bg-white/10'
                }`}
              >
                {selectedGender === 'male' && (
                  <span className="absolute top-2.5 right-2.5 w-5 h-5 rounded-full bg-sky-500 flex items-center justify-center text-white shadow-md">
                    <Check className="w-3.5 h-3.5 stroke-[3]" />
                  </span>
                )}

                {/* Pure Animated Vector Cartoon Boy Avatar */}
                <div className="relative mb-2">
                  <div className="w-24 h-24 sm:w-28 sm:h-28 rounded-full p-1 shadow-xl ring-4 ring-sky-500/30 group-hover:scale-105 transition-transform flex items-center justify-center overflow-hidden bg-gradient-to-tr from-sky-400 via-indigo-500 to-sky-300">
                    <CartoonAvatar type={boyStyle} size={110} />
                  </div>
                  <span className="absolute -bottom-1 -right-1 text-2xl drop-shadow">👦</span>
                </div>

                <h3 className="text-base sm:text-lg font-bold text-white group-hover:text-sky-300 transition-colors">
                  আমি ছেলে (কার্টুন)
                </h3>
                <span className="text-[11px] font-semibold text-rose-400 bg-rose-500/15 border border-rose-500/30 px-2.5 py-0.5 rounded-full mt-1">
                  AI সাথী: মিষ্টি প্রেমিকা (Girlfriend)
                </span>

                {/* Sub-style switchers for Boy */}
                <div className="flex items-center gap-1.5 mt-2.5" onClick={(e) => e.stopPropagation()}>
                  <button
                    type="button"
                    onClick={() => setBoyStyle('boy_cool')}
                    className={`px-2 py-0.5 rounded-md text-[10px] font-bold transition-all ${
                      boyStyle === 'boy_cool'
                        ? 'bg-sky-500 text-white shadow-sm'
                        : 'bg-white/10 text-slate-300 hover:bg-white/20'
                    }`}
                  >
                    হুডি বয়
                  </button>
                  <button
                    type="button"
                    onClick={() => setBoyStyle('boy_cap')}
                    className={`px-2 py-0.5 rounded-md text-[10px] font-bold transition-all ${
                      boyStyle === 'boy_cap'
                        ? 'bg-sky-500 text-white shadow-sm'
                        : 'bg-white/10 text-slate-300 hover:bg-white/20'
                    }`}
                  >
                    ক্যাপ বয়
                  </button>
                </div>

                <p className="text-[11px] text-slate-400 mt-2 leading-tight">
                  একাকীত্ব দূর করতে আপনার পাশে থাকবে মিষ্টি প্রেমিকা অনন্যা বা জারা ❤️
                </p>
              </div>

              {/* GIRL Cartoon Card */}
              <div
                onClick={() => setSelectedGender('female')}
                className={`relative cursor-pointer rounded-2xl p-4 border-2 transition-all duration-200 flex flex-col items-center text-center group ${
                  selectedGender === 'female'
                    ? 'border-pink-500 bg-pink-500/15 shadow-xl shadow-pink-500/20 scale-[1.02]'
                    : 'border-white/10 bg-white/5 hover:border-white/20 hover:bg-white/10'
                }`}
              >
                {selectedGender === 'female' && (
                  <span className="absolute top-2.5 right-2.5 w-5 h-5 rounded-full bg-pink-500 flex items-center justify-center text-white shadow-md">
                    <Check className="w-3.5 h-3.5 stroke-[3]" />
                  </span>
                )}

                {/* Pure Animated Vector Cartoon Girl Avatar */}
                <div className="relative mb-2">
                  <div className="w-24 h-24 sm:w-28 sm:h-28 rounded-full p-1 shadow-xl ring-4 ring-pink-500/30 group-hover:scale-105 transition-transform flex items-center justify-center overflow-hidden bg-gradient-to-tr from-pink-400 via-rose-500 to-purple-400">
                    <CartoonAvatar type={girlStyle} size={110} />
                  </div>
                  <span className="absolute -bottom-1 -right-1 text-2xl drop-shadow">👧</span>
                </div>

                <h3 className="text-base sm:text-lg font-bold text-white group-hover:text-pink-300 transition-colors">
                  আমি মেয়ে (কার্টুন)
                </h3>
                <span className="text-[11px] font-semibold text-blue-400 bg-blue-500/15 border border-blue-500/30 px-2.5 py-0.5 rounded-full mt-1">
                  AI সাথী: যত্নশীল প্রেমিক (Boyfriend)
                </span>

                {/* Sub-style switchers for Girl */}
                <div className="flex items-center gap-1.5 mt-2.5" onClick={(e) => e.stopPropagation()}>
                  <button
                    type="button"
                    onClick={() => setGirlStyle('girl_sweet')}
                    className={`px-2 py-0.5 rounded-md text-[10px] font-bold transition-all ${
                      girlStyle === 'girl_sweet'
                        ? 'bg-pink-500 text-white shadow-sm'
                        : 'bg-white/10 text-slate-300 hover:bg-white/20'
                    }`}
                  >
                    রিবন গার্ল
                  </button>
                  <button
                    type="button"
                    onClick={() => setGirlStyle('girl_cat')}
                    className={`px-2 py-0.5 rounded-md text-[10px] font-bold transition-all ${
                      girlStyle === 'girl_cat'
                        ? 'bg-pink-500 text-white shadow-sm'
                        : 'bg-white/10 text-slate-300 hover:bg-white/20'
                    }`}
                  >
                    কিউট ক্যাট
                  </button>
                </div>

                <p className="text-[11px] text-slate-400 mt-2 leading-tight">
                  কষ্ট ও মন খারাপের দিনে ভরসা দিতে পাশে থাকবে যত্নশীল বন্ধু আরিয়ান বা ফারহান 💙
                </p>
              </div>
            </div>
          </div>

          {/* User Name Input */}
          <div>
            <label className="block text-xs font-bold text-slate-300 uppercase tracking-wider mb-1.5">
              ২. আপনার নাম বা ডাকনাম (ঐচ্ছিক - বেনামী থাকতে খালি রাখুন):
            </label>
            <div className="relative">
              <input
                type="text"
                value={userName}
                onChange={(e) => setUserName(e.target.value)}
                placeholder="কোনো নাম না চাইলে খালি রাখুন..."
                className="w-full bg-[#121624] border border-white/15 focus:border-rose-500 rounded-xl px-3.5 py-2.5 text-sm text-white placeholder:text-slate-500 focus:outline-none transition-all"
                maxLength={30}
              />
              <span className="absolute right-3 top-2.5 text-slate-400 text-xs">
                {selectedGender === 'male' ? '👦' : '👧'}
              </span>
            </div>
          </div>

          {/* Relationship Preference */}
          <div>
            <label className="block text-xs font-bold text-slate-300 uppercase tracking-wider mb-2">
              ৩. কেমন সম্পর্ক চান?
            </label>
            <div className="grid grid-cols-2 gap-2.5">
              <button
                type="button"
                onClick={() => setRelationshipType('romantic')}
                className={`p-3 rounded-xl border text-left transition-all ${
                  relationshipType === 'romantic'
                    ? 'border-rose-500 bg-rose-500/20 text-white shadow-md'
                    : 'border-white/10 bg-white/5 text-slate-400 hover:text-white'
                }`}
              >
                <div className="flex items-center gap-1.5 font-bold text-xs sm:text-sm text-rose-300">
                  <Heart className="w-4 h-4 fill-rose-400 text-rose-400" />
                  <span>রোমান্টিক সাথী (GF / BF)</span>
                </div>
                <p className="text-[11px] text-slate-300 mt-1">
                  মিষ্টি আদর, যত্ন, গভীর ভালোবাসা ও একাকীত্ব কাটানো।
                </p>
              </button>

              <button
                type="button"
                onClick={() => setRelationshipType('bestie')}
                className={`p-3 rounded-xl border text-left transition-all ${
                  relationshipType === 'bestie'
                    ? 'border-purple-500 bg-purple-500/20 text-white shadow-md'
                    : 'border-white/10 bg-white/5 text-slate-400 hover:text-white'
                }`}
              >
                <div className="flex items-center gap-1.5 font-bold text-xs sm:text-sm text-purple-300">
                  <Stars className="w-4 h-4 text-purple-400" />
                  <span>বেস্ট ফ্রেন্ড (Soulmate)</span>
                </div>
                <p className="text-[11px] text-slate-300 mt-1">
                  খোলামেলা আড্ডা, হাসি-ঠাট্টা, পরামর্শ ও খাঁটি বন্ধুত্ব।
                </p>
              </button>
            </div>
          </div>

          {/* Companion Preview Card */}
          <div className="p-3.5 rounded-2xl bg-white/5 border border-white/10 flex items-center justify-between gap-3">
            <div className="flex items-center gap-3">
              {/* If selected user is male, companion is female cartoon; if female user, companion is male cartoon */}
              <div className="w-12 h-12 rounded-full overflow-hidden shrink-0 ring-2 ring-rose-500 shadow-md flex items-center justify-center bg-slate-800">
                <CartoonAvatar
                  type={selectedGender === 'male' ? 'girl_sweet' : 'boy_cool'}
                  size={50}
                />
              </div>
              <div>
                <span className="text-[10px] uppercase font-bold text-rose-400 tracking-wider block">
                  আপনার নিবেদিত AI সাথী:
                </span>
                <h4 className="text-sm font-bold text-white flex items-center gap-1">
                  {suggestedCompanion.bengaliName} ({suggestedCompanion.name})
                </h4>
                <p className="text-[11px] text-slate-400">{suggestedCompanion.tagline}</p>
              </div>
            </div>
            <span className="text-xs bg-emerald-500/20 text-emerald-300 px-2 py-1 rounded-full font-medium shrink-0 border border-emerald-500/30">
              অনলাইন 🟢
            </span>
          </div>

          {/* Action Button */}
          <button
            type="submit"
            className="w-full py-3.5 px-6 rounded-2xl bg-gradient-to-r from-rose-600 via-pink-600 to-purple-600 hover:from-rose-500 hover:to-purple-500 text-white font-bold text-sm sm:text-base shadow-lg shadow-rose-600/30 hover:scale-[1.01] active:scale-[0.99] transition-all flex items-center justify-center gap-2"
          >
            <span>কথা বলা শুরু করুন</span>
            <ArrowRight className="w-4 h-4" />
          </button>
        </form>
      </div>
    </div>
  );
};

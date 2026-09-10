import React, { useState } from 'react';
import { Sparkles, Heart, Check, ArrowRight, X, Users } from 'lucide-react';
import { UserGender, RelationshipType, Companion } from '../types';
import { COMPANIONS } from '../data/companions';
import { CartoonAvatar } from './CartoonAvatars';

interface CartoonOnboardingModalProps {
  isOpen: boolean;
  onClose: () => void;
  onComplete: (
    gender: UserGender,
    name: string,
    relationType?: RelationshipType,
    companion?: Companion
  ) => void;
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

  if (!isOpen) return null;

  // Selected companion based on user gender & relationship type
  const targetCompanion =
    COMPANIONS.find(
      (c) => c.targetUserGender === selectedGender && c.relationshipType === relationshipType
    ) ||
    COMPANIONS.find((c) => c.targetUserGender === selectedGender) ||
    COMPANIONS[0];

  const handleStart = (e?: React.FormEvent) => {
    if (e) e.preventDefault();
    const finalName = userName.trim();
    onComplete(selectedGender, finalName, relationshipType, targetCompanion);
  };

  return (
    <div
      id="onboarding-modal-backdrop"
      className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-md animate-in fade-in duration-200"
      onClick={(e) => {
        if (e.target === e.currentTarget) {
          onClose();
        }
      }}
    >
      <div
        id="onboarding-modal-card"
        className="relative w-full max-w-md bg-[#0f1322] border border-white/15 rounded-3xl shadow-2xl overflow-hidden animate-in zoom-in-95 duration-200"
      >
        {/* Ambient background glow */}
        <div className="absolute -top-12 -right-12 w-40 h-40 bg-rose-500/15 rounded-full blur-2xl pointer-events-none" />
        <div className="absolute -bottom-12 -left-12 w-40 h-40 bg-indigo-500/15 rounded-full blur-2xl pointer-events-none" />

        {/* Top Header & Close Button */}
        <div className="relative pt-6 pb-3 px-6 text-center">
          <button
            type="button"
            id="onboarding-close-btn"
            onClick={onClose}
            className="absolute top-4 right-4 w-8 h-8 rounded-full bg-white/5 hover:bg-white/10 text-slate-400 hover:text-white flex items-center justify-center transition-colors cursor-pointer"
            title="বন্ধ করুন"
          >
            <X className="w-4 h-4" />
          </button>

          <div className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full bg-rose-500/15 border border-rose-500/25 text-rose-300 text-[11px] font-semibold mb-2">
            <Sparkles className="w-3 h-3 text-rose-400" />
            <span>মনের সাথী</span>
          </div>

          <h2 className="text-xl font-bold text-white tracking-tight">
            সাথী নির্বাচন করুন
          </h2>
          <p className="text-xs text-slate-400 mt-0.5">
            কার সাথে কথা বলতে চান বেছে নিন
          </p>
        </div>

        {/* Minimal Form */}
        <form onSubmit={handleStart} className="px-6 pb-6 space-y-4">
          {/* Gender / Companion Card Selection */}
          <div className="grid grid-cols-2 gap-3 pt-1">
            {/* BOY Choice -> AI is Female (Ananya) */}
            <button
              type="button"
              id="select-male-user"
              onClick={() => setSelectedGender('male')}
              className={`relative p-3 rounded-2xl border text-center transition-all cursor-pointer flex flex-col items-center ${
                selectedGender === 'male'
                  ? 'border-rose-500 bg-rose-500/15 shadow-lg shadow-rose-500/20 ring-1 ring-rose-500/50 scale-[1.02]'
                  : 'border-white/10 bg-white/[0.03] hover:bg-white/[0.07] hover:border-white/20'
              }`}
            >
              {selectedGender === 'male' && (
                <span className="absolute top-2 right-2 w-4 h-4 rounded-full bg-rose-500 text-white flex items-center justify-center shadow">
                  <Check className="w-2.5 h-2.5 stroke-[3]" />
                </span>
              )}
              <div className="w-16 h-16 rounded-full overflow-hidden bg-slate-800 p-0.5 ring-2 ring-rose-500/40 mb-2 flex items-center justify-center">
                <CartoonAvatar type="girl_sweet" size={60} />
              </div>
              <span className="text-sm font-bold text-white block">আমি ছেলে 👦</span>
              <span className="text-[11px] text-rose-300 font-medium mt-0.5">
                AI সাথী: অনন্যা 🌸
              </span>
            </button>

            {/* GIRL Choice -> AI is Male (Ayaan) */}
            <button
              type="button"
              id="select-female-user"
              onClick={() => setSelectedGender('female')}
              className={`relative p-3 rounded-2xl border text-center transition-all cursor-pointer flex flex-col items-center ${
                selectedGender === 'female'
                  ? 'border-sky-500 bg-sky-500/15 shadow-lg shadow-sky-500/20 ring-1 ring-sky-500/50 scale-[1.02]'
                  : 'border-white/10 bg-white/[0.03] hover:bg-white/[0.07] hover:border-white/20'
              }`}
            >
              {selectedGender === 'female' && (
                <span className="absolute top-2 right-2 w-4 h-4 rounded-full bg-sky-500 text-white flex items-center justify-center shadow">
                  <Check className="w-2.5 h-2.5 stroke-[3]" />
                </span>
              )}
              <div className="w-16 h-16 rounded-full overflow-hidden bg-slate-800 p-0.5 ring-2 ring-sky-500/40 mb-2 flex items-center justify-center">
                <CartoonAvatar type="boy_cool" size={60} />
              </div>
              <span className="text-sm font-bold text-white block">আমি মেয়ে 👧</span>
              <span className="text-[11px] text-sky-300 font-medium mt-0.5">
                AI সাথী: আরিয়ান 💙
              </span>
            </button>
          </div>

          {/* Relationship Preference Toggle */}
          <div className="bg-white/[0.03] border border-white/10 p-1 rounded-xl flex items-center gap-1">
            <button
              type="button"
              id="relation-romantic"
              onClick={() => setRelationshipType('romantic')}
              className={`flex-1 py-1.5 px-2 rounded-lg text-xs font-semibold flex items-center justify-center gap-1.5 transition-all cursor-pointer ${
                relationshipType === 'romantic'
                  ? 'bg-rose-500 text-white shadow-sm'
                  : 'text-slate-400 hover:text-white'
              }`}
            >
              <Heart className="w-3 h-3 fill-current" />
              <span>রোমান্টিক</span>
            </button>
            <button
              type="button"
              id="relation-bestie"
              onClick={() => setRelationshipType('bestie')}
              className={`flex-1 py-1.5 px-2 rounded-lg text-xs font-semibold flex items-center justify-center gap-1.5 transition-all cursor-pointer ${
                relationshipType === 'bestie'
                  ? 'bg-purple-600 text-white shadow-sm'
                  : 'text-slate-400 hover:text-white'
              }`}
            >
              <Users className="w-3 h-3" />
              <span>বেস্ট ফ্রেন্ড</span>
            </button>
          </div>

          {/* Name Input (Minimal) */}
          <div>
            <input
              type="text"
              id="user-name-input"
              value={userName}
              onChange={(e) => setUserName(e.target.value)}
              placeholder="আপনার নাম বা ডাকনাম (ঐচ্ছিক)"
              className="w-full bg-white/[0.04] border border-white/10 focus:border-rose-500/60 rounded-xl px-3.5 py-2.5 text-xs text-white placeholder:text-slate-500 focus:outline-none transition-all"
              maxLength={25}
            />
          </div>

          {/* Primary Action Button */}
          <button
            type="submit"
            id="start-chat-btn"
            className="w-full py-3 px-4 rounded-xl bg-gradient-to-r from-rose-600 to-pink-600 hover:from-rose-500 hover:to-pink-500 text-white font-bold text-sm shadow-lg shadow-rose-600/30 hover:scale-[1.01] active:scale-[0.98] transition-all flex items-center justify-center gap-2 cursor-pointer"
          >
            <span>চ্যাট শুরু করুন</span>
            <ArrowRight className="w-4 h-4" />
          </button>
        </form>
      </div>
    </div>
  );
};

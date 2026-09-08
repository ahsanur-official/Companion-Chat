import React, { useState } from 'react';
import { X, Heart, Users, Sparkles, Check, Smile } from 'lucide-react';
import { Companion, RelationshipType, UserGender } from '../types';
import { COMPANIONS } from '../data/companions';

interface CompanionSelectorModalProps {
  isOpen: boolean;
  onClose: () => void;
  currentCompanion: Companion;
  userGender: UserGender;
  onSelectCompanion: (companion: Companion, userGender: UserGender) => void;
}

export const CompanionSelectorModal: React.FC<CompanionSelectorModalProps> = ({
  isOpen,
  onClose,
  currentCompanion,
  userGender,
  onSelectCompanion,
}) => {
  const [selectedGender, setSelectedGender] = useState<UserGender>(userGender);
  const [selectedRelation, setSelectedRelation] = useState<RelationshipType>(currentCompanion.relationshipType);

  if (!isOpen) return null;

  // Filter companions:
  // If user is 'male', AI must be 'female'
  // If user is 'female', AI must be 'male'
  const availableCompanions = COMPANIONS.filter(
    (c) => c.targetUserGender === selectedGender
  );

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-4 bg-black/80 backdrop-blur-sm animate-in fade-in duration-200">
      <div className="relative w-full max-w-2xl bg-[#121624] border border-white/10 rounded-2xl shadow-2xl overflow-hidden flex flex-col max-h-[90vh]">
        {/* Header with romantic gradient */}
        <div className="relative p-5 sm:p-6 bg-gradient-to-r from-rose-900/40 via-purple-900/30 to-indigo-900/40 border-b border-white/10">
          <button
            onClick={onClose}
            className="absolute top-4 right-4 p-1.5 text-slate-400 hover:text-white rounded-full bg-white/5 hover:bg-white/10 transition-all"
          >
            <X className="w-5 h-5" />
          </button>
          <div className="flex items-center gap-2 text-rose-400 text-xs font-semibold uppercase tracking-wider mb-1">
            <Sparkles className="w-3.5 h-3.5" />
            <span>AI সাথী কনফিগারেশন</span>
          </div>
          <h2 className="text-xl sm:text-2xl font-bold text-white tracking-tight">
            আপনার মনের মতো সঙ্গী নির্বাচন করুন
          </h2>
          <p className="text-xs sm:text-sm text-slate-300 mt-1">
            আপনি ছেলে হলে AI মিষ্টি মেয়ে হয়ে কথা বলবে, আর আপনি মেয়ে হলে AI যত্নশীল ছেলে হয়ে সঙ্গ দেবে।
          </p>
        </div>

        <div className="p-5 sm:p-6 overflow-y-auto space-y-6">
          {/* Step 1: Who are you? */}
          <div>
            <label className="text-xs font-semibold text-slate-300 uppercase tracking-wider block mb-2">
              ১. আপনার পরিচয় নির্বাচন করুন (Who are you?):
            </label>
            <div className="grid grid-cols-2 gap-3">
              <button
                type="button"
                onClick={() => setSelectedGender('male')}
                className={`p-3.5 rounded-xl border flex items-center justify-between text-left transition-all ${
                  selectedGender === 'male'
                    ? 'bg-rose-500/15 border-rose-500 text-white shadow-lg shadow-rose-500/10 ring-1 ring-rose-500'
                    : 'bg-white/5 border-white/10 text-slate-400 hover:bg-white/10'
                }`}
              >
                <div>
                  <div className="font-semibold text-sm sm:text-base flex items-center gap-1.5 text-white">
                    <span>👨 আমি ছেলে (Male)</span>
                  </div>
                  <div className="text-[11px] text-rose-300 mt-0.5">
                    AI মেয়ে সাথী (Girlfriend / Bestie) পাবে
                  </div>
                </div>
                {selectedGender === 'male' && <Check className="w-5 h-5 text-rose-400" />}
              </button>

              <button
                type="button"
                onClick={() => setSelectedGender('female')}
                className={`p-3.5 rounded-xl border flex items-center justify-between text-left transition-all ${
                  selectedGender === 'female'
                    ? 'bg-blue-500/15 border-blue-500 text-white shadow-lg shadow-blue-500/10 ring-1 ring-blue-500'
                    : 'bg-white/5 border-white/10 text-slate-400 hover:bg-white/10'
                }`}
              >
                <div>
                  <div className="font-semibold text-sm sm:text-base flex items-center gap-1.5 text-white">
                    <span>👩 আমি মেয়ে (Female)</span>
                  </div>
                  <div className="text-[11px] text-blue-300 mt-0.5">
                    AI ছেলে সাথী (Boyfriend / Bestie) পাবে
                  </div>
                </div>
                {selectedGender === 'female' && <Check className="w-5 h-5 text-blue-400" />}
              </button>
            </div>
          </div>

          {/* Step 2: Relationship vibe */}
          <div>
            <label className="text-xs font-semibold text-slate-300 uppercase tracking-wider block mb-2">
              ২. সম্পর্কের ধরণ নির্বাচন করুন (Relationship Dynamic):
            </label>
            <div className="grid grid-cols-2 gap-3">
              <button
                type="button"
                onClick={() => setSelectedRelation('romantic')}
                className={`p-3 rounded-xl border flex items-center gap-2.5 transition-all ${
                  selectedRelation === 'romantic'
                    ? 'bg-gradient-to-r from-rose-500/20 to-pink-500/20 border-rose-500 text-white ring-1 ring-rose-500'
                    : 'bg-white/5 border-white/10 text-slate-400 hover:bg-white/10'
                }`}
              >
                <Heart className={`w-4 h-4 ${selectedRelation === 'romantic' ? 'text-rose-400 fill-rose-400' : ''}`} />
                <div className="text-left">
                  <div className="font-semibold text-xs sm:text-sm text-white">প্রেমিকা / প্রেমিক (GF / BF)</div>
                  <div className="text-[10px] text-slate-400">রোমান্টিক যত্ন, মিষ্টি ভালোবাসা</div>
                </div>
              </button>

              <button
                type="button"
                onClick={() => setSelectedRelation('bestie')}
                className={`p-3 rounded-xl border flex items-center gap-2.5 transition-all ${
                  selectedRelation === 'bestie'
                    ? 'bg-gradient-to-r from-purple-500/20 to-indigo-500/20 border-purple-500 text-white ring-1 ring-purple-500'
                    : 'bg-white/5 border-white/10 text-slate-400 hover:bg-white/10'
                }`}
              >
                <Users className={`w-4 h-4 ${selectedRelation === 'bestie' ? 'text-purple-400' : ''}`} />
                <div className="text-left">
                  <div className="font-semibold text-xs sm:text-sm text-white">বেস্ট ফ্রেন্ড (Best Friend)</div>
                  <div className="text-[10px] text-slate-400">খাঁটি বন্ধুত্ব, আড্ডা ও পরামর্শ</div>
                </div>
              </button>
            </div>
          </div>

          {/* Step 3: Available Companions List */}
          <div>
            <label className="text-xs font-semibold text-slate-300 uppercase tracking-wider block mb-2">
              ৩. আপনার পছন্দের ব্যক্তিত্ব বেছে নিন:
            </label>
            <div className="space-y-3">
              {availableCompanions.map((comp) => {
                const isSelected = currentCompanion.id === comp.id && selectedGender === userGender;
                return (
                  <div
                    key={comp.id}
                    onClick={() => {
                      onSelectCompanion(comp, selectedGender);
                      onClose();
                    }}
                    className={`p-3.5 sm:p-4 rounded-xl border cursor-pointer transition-all flex items-start gap-3.5 sm:gap-4 hover:scale-[1.01] ${
                      isSelected
                        ? 'bg-gradient-to-r from-rose-500/20 via-purple-500/15 to-transparent border-rose-500/80 shadow-md ring-1 ring-rose-500'
                        : 'bg-white/5 border-white/10 hover:bg-white/10'
                    }`}
                  >
                    <img
                      src={comp.avatar}
                      alt={comp.name}
                      className="w-14 h-14 sm:w-16 sm:h-16 rounded-full object-cover ring-2 ring-rose-500/40 shrink-0"
                    />
                    <div className="flex-1 min-w-0">
                      <div className="flex items-center justify-between gap-2">
                        <div className="flex items-center gap-2">
                          <h4 className="text-base font-bold text-white truncate">
                            {comp.bengaliName} ({comp.name})
                          </h4>
                          <span className="text-[10px] font-medium px-2 py-0.5 rounded-full bg-white/10 text-rose-300 border border-white/5">
                            {comp.roleTitleBengali}
                          </span>
                        </div>
                        {isSelected && (
                          <span className="text-xs font-medium text-emerald-400 flex items-center gap-1">
                            <Check className="w-3.5 h-3.5" /> নির্বাচিত
                          </span>
                        )}
                      </div>
                      <p className="text-xs text-rose-300/90 font-medium italic mt-0.5">
                        "{comp.tagline}"
                      </p>
                      <p className="text-xs text-slate-400 mt-1 line-clamp-2">
                        {comp.bio}
                      </p>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
        </div>

        {/* Footer */}
        <div className="p-4 bg-[#0d0f17] border-t border-white/10 flex items-center justify-end">
          <button
            onClick={onClose}
            className="px-5 py-2 rounded-xl bg-white/10 hover:bg-white/15 text-white text-xs font-medium transition-all"
          >
            বন্ধ করুন
          </button>
        </div>
      </div>
    </div>
  );
};

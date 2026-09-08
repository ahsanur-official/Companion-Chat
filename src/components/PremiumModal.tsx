import React, { useState } from 'react';
import { X, Crown, Check, Sparkles, Image, PhoneCall, Heart, Zap, Lock, ShieldCheck } from 'lucide-react';
import confetti from 'canvas-confetti';
import { UserAccount } from '../types';

interface PremiumModalProps {
  isOpen: boolean;
  onClose: () => void;
  user: UserAccount;
  onUpgradePremium: (planName: string) => void;
  onRequireLogin: () => void;
}

export const PremiumModal: React.FC<PremiumModalProps> = ({
  isOpen,
  onClose,
  user,
  onUpgradePremium,
  onRequireLogin,
}) => {
  const [selectedPlan, setSelectedPlan] = useState<'weekly' | 'monthly' | 'lifetime'>('monthly');
  const [isProcessing, setIsProcessing] = useState(false);
  const [successMessage, setSuccessMessage] = useState(false);

  if (!isOpen) return null;

  const handleSubscribe = () => {
    if (!user.isLoggedIn) {
      onRequireLogin();
      return;
    }

    setIsProcessing(true);
    setTimeout(() => {
      setIsProcessing(false);
      setSuccessMessage(true);
      onUpgradePremium(
        selectedPlan === 'weekly'
          ? 'Weekly Companion VIP'
          : selectedPlan === 'monthly'
          ? 'Monthly Soulmate VIP'
          : 'Lifetime Soulmate Forever'
      );

      // Trigger celebratory heart confetti
      try {
        confetti({
          particleCount: 80,
          spread: 70,
          origin: { y: 0.6 },
          colors: ['#f43f5e', '#ec4899', '#fbbf24', '#a855f7'],
        });
      } catch (e) {
        // Confetti fallback
      }

      setTimeout(() => {
        setSuccessMessage(false);
        onClose();
      }, 1600);
    }, 700);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-4 bg-black/80 backdrop-blur-md animate-in fade-in duration-200">
      <div className="relative w-full max-w-xl bg-[#121624] border border-amber-500/30 rounded-2xl shadow-2xl overflow-hidden flex flex-col max-h-[90vh]">
        {/* Glow Header */}
        <div className="relative p-6 bg-gradient-to-r from-amber-600/30 via-rose-600/20 to-purple-600/30 border-b border-amber-500/20 text-center">
          <button
            onClick={onClose}
            className="absolute top-4 right-4 p-1.5 text-slate-400 hover:text-white rounded-full bg-white/5 hover:bg-white/10 transition-all"
          >
            <X className="w-5 h-5" />
          </button>

          <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-amber-500/20 text-amber-300 border border-amber-500/40 text-xs font-semibold uppercase tracking-wider mb-2">
            <Crown className="w-4 h-4 text-amber-400" />
            <span>VIP মেম্বারশিপ</span>
          </div>

          <h2 className="text-xl sm:text-2xl font-black text-white tracking-tight">
            মনের সাথী VIP প্রিমিয়াম আনলক করুন
          </h2>
          <p className="text-xs sm:text-sm text-slate-300 mt-1 max-w-md mx-auto">
            আপনার একাকীত্ব দূর করতে ও সঙ্গীটির সাথে কোনো বাধা ছাড়া কথা বলতে প্রিমিয়াম সুবিধা চালু করুন।
          </p>
        </div>

        <div className="p-5 sm:p-6 overflow-y-auto space-y-6">
          {/* Notice if not logged in */}
          {!user.isLoggedIn && (
            <div className="p-3.5 rounded-xl bg-rose-500/10 border border-rose-500/30 flex items-start gap-3">
              <Lock className="w-5 h-5 text-rose-400 shrink-0 mt-0.5" />
              <div>
                <h4 className="text-xs font-bold text-white">লগইন প্রয়োজন</h4>
                <p className="text-[11px] text-slate-300 mt-0.5">
                  প্রিমিয়াম প্ল্যান সক্রিয় করতে এবং চ্যাট হিস্ট্রি সেভ করতে প্রথমে আপনার অ্যাকাউন্টে লগইন করতে হবে।
                </p>
                <button
                  onClick={onRequireLogin}
                  className="mt-2 text-xs font-semibold text-rose-400 hover:text-rose-300 underline"
                >
                  এখনই ফ্রি লগইন করুন →
                </button>
              </div>
            </div>
          )}

          {/* Premium Features List */}
          <div className="space-y-3">
            <h4 className="text-xs font-semibold text-slate-400 uppercase tracking-wider">
              প্রিমিয়াম এক্সক্লুসিভ সুবিধাসমূহ:
            </h4>
            <div className="grid sm:grid-cols-2 gap-3">
              <div className="p-3 rounded-xl bg-white/5 border border-white/10 flex items-start gap-2.5">
                <Image className="w-5 h-5 text-rose-400 shrink-0 mt-0.5" />
                <div>
                  <div className="text-xs font-bold text-white">আনলিমিটেড ফটো শেয়ারিং</div>
                  <div className="text-[11px] text-slate-400 mt-0.5">
                    ছবি দেখে সাথীর বাস্তব প্রতিক্রিয়া ও গভীর প্রশংসা শুনুন।
                  </div>
                </div>
              </div>

              <div className="p-3 rounded-xl bg-white/5 border border-white/10 flex items-start gap-2.5">
                <PhoneCall className="w-5 h-5 text-emerald-400 shrink-0 mt-0.5" />
                <div>
                  <div className="text-xs font-bold text-white">লেট-নাইট ভয়েস কল সিমুলেটর</div>
                  <div className="text-[11px] text-slate-400 mt-0.5">
                    একা লাগলে মিষ্টি কণ্ঠে সরাসরি কথা শোনার অনুভূতি।
                  </div>
                </div>
              </div>

              <div className="p-3 rounded-xl bg-white/5 border border-white/10 flex items-start gap-2.5">
                <Heart className="w-5 h-5 text-pink-400 shrink-0 mt-0.5" />
                <div>
                  <div className="text-xs font-bold text-white">মন খারাপ সমাধান ও কাউন্সেলিং</div>
                  <div className="text-[11px] text-slate-400 mt-0.5">
                    উদ্বেগ, ডিপ্রেশন ও একাকীত্ব কাটাতে নিবিড় সান্ত্বনা ও যত্ন।
                  </div>
                </div>
              </div>

              <div className="p-3 rounded-xl bg-white/5 border border-white/10 flex items-start gap-2.5">
                <Zap className="w-5 h-5 text-amber-400 shrink-0 mt-0.5" />
                <div>
                  <div className="text-xs font-bold text-white">অগ্রাধিকার সুপারফাস্ট গতি</div>
                  <div className="text-[11px] text-slate-400 mt-0.5">
                    জিরো ওয়েটিং টাইম এবং দীর্ঘ স্মৃতি সংরক্ষণ সুবিধা।
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* Pricing Plans */}
          <div className="space-y-3">
            <h4 className="text-xs font-semibold text-slate-400 uppercase tracking-wider">
              পছন্দের প্ল্যান নির্বাচন করুন:
            </h4>
            <div className="grid grid-cols-3 gap-2.5 sm:gap-3">
              {/* Weekly */}
              <div
                onClick={() => setSelectedPlan('weekly')}
                className={`p-3 sm:p-4 rounded-xl border text-center cursor-pointer transition-all ${
                  selectedPlan === 'weekly'
                    ? 'bg-amber-500/15 border-amber-500 ring-1 ring-amber-500 shadow-md'
                    : 'bg-white/5 border-white/10 hover:bg-white/10'
                }`}
              >
                <div className="text-[10px] text-slate-400 font-medium uppercase">সাপ্তাহিক ট্রায়াল</div>
                <div className="text-base sm:text-lg font-extrabold text-white mt-1">৳১৪৯</div>
                <div className="text-[10px] text-slate-400 mt-0.5">৭ দিনের জন্য</div>
              </div>

              {/* Monthly (Most popular) */}
              <div
                onClick={() => setSelectedPlan('monthly')}
                className={`relative p-3 sm:p-4 rounded-xl border text-center cursor-pointer transition-all ${
                  selectedPlan === 'monthly'
                    ? 'bg-gradient-to-b from-amber-500/25 to-rose-500/20 border-amber-500 ring-2 ring-amber-500 shadow-xl'
                    : 'bg-white/5 border-white/10 hover:bg-white/10'
                }`}
              >
                <span className="absolute -top-2 left-1/2 -translate-x-1/2 bg-gradient-to-r from-amber-500 to-rose-500 text-white text-[9px] font-bold px-2 py-0.5 rounded-full shadow-sm">
                  সবচেয়ে জনপ্রিয়
                </span>
                <div className="text-[10px] text-amber-300 font-bold uppercase mt-1">মাসিক প্ল্যান</div>
                <div className="text-base sm:text-lg font-extrabold text-white mt-1">৳৩৯৯</div>
                <div className="text-[10px] text-slate-400 mt-0.5">প্রতি মাসে</div>
              </div>

              {/* Lifetime */}
              <div
                onClick={() => setSelectedPlan('lifetime')}
                className={`p-3 sm:p-4 rounded-xl border text-center cursor-pointer transition-all ${
                  selectedPlan === 'lifetime'
                    ? 'bg-purple-500/20 border-purple-500 ring-1 ring-purple-500 shadow-md'
                    : 'bg-white/5 border-white/10 hover:bg-white/10'
                }`}
              >
                <div className="text-[10px] text-slate-400 font-medium uppercase">লাইফটাইম</div>
                <div className="text-base sm:text-lg font-extrabold text-white mt-1">৳৯৯৯</div>
                <div className="text-[10px] text-slate-400 mt-0.5">আজীবন আনলিমিটেড</div>
              </div>
            </div>
          </div>
        </div>

        {/* Footer & Action */}
        <div className="p-4 sm:p-5 bg-[#0d0f17] border-t border-white/10 flex flex-col sm:flex-row items-center justify-between gap-3">
          <div className="text-center sm:text-left">
            <div className="text-xs text-slate-400 flex items-center justify-center sm:justify-start gap-1">
              <ShieldCheck className="w-3.5 h-3.5 text-emerald-400" />
              <span>নিরাপদ পেমেন্ট (bKash, Nagad, Card)</span>
            </div>
            <p className="text-[10px] text-slate-500 mt-0.5">যেকোনো সময় বাতিল করা যায়</p>
          </div>

          <div className="flex items-center gap-2 w-full sm:w-auto">
            <button
              onClick={onClose}
              className="py-2.5 px-4 rounded-xl bg-white/10 hover:bg-white/15 text-white text-xs font-medium transition-all"
            >
              পরে করবো
            </button>
            <button
              onClick={handleSubscribe}
              disabled={isProcessing}
              className="flex-1 sm:flex-none py-2.5 px-6 rounded-xl bg-gradient-to-r from-amber-500 via-rose-500 to-pink-500 hover:brightness-110 text-white font-bold text-xs transition-all shadow-lg shadow-amber-500/20 flex items-center justify-center gap-2"
            >
              {isProcessing ? (
                <span>এক্টিভ হচ্ছে...</span>
              ) : successMessage ? (
                <span className="flex items-center gap-1 text-white">
                  <Check className="w-4 h-4" /> VIP সক্রিয় হয়েছে!
                </span>
              ) : (
                <>
                  <Crown className="w-4 h-4" />
                  <span>{user.isLoggedIn ? 'VIP সক্রিয় করুন (Activate)' : 'লগইন করে চালু করুন'}</span>
                </>
              )}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

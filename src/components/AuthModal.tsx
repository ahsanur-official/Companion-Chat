import React, { useState } from 'react';
import { X, Image as ImageIcon, Lock, LogIn, UserPlus, Sparkles, CheckCircle2, ShieldCheck, Heart, Coins, Crown } from 'lucide-react';
import { UserAccount } from '../types';

interface AuthModalProps {
  isOpen: boolean;
  onClose: () => void;
  user: UserAccount;
  onLogin: (userData: Partial<UserAccount>) => void;
  onLogout: () => void;
  triggerReason?: 'photo_upload' | 'premium_feature' | 'tokens_exhausted' | 'general';
}

export const AuthModal: React.FC<AuthModalProps> = ({
  isOpen,
  onClose,
  user,
  onLogin,
  onLogout,
  triggerReason = 'general',
}) => {
  const [isRegistering, setIsRegistering] = useState(false);
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');

  if (!isOpen) return null;

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!email.trim()) {
      setError('অনুগ্রহ করে আপনার সঠিক ইমেইল প্রদান করুন');
      return;
    }
    if (!password || password.length < 4) {
      setError('পাসওয়ার্ড কমপক্ষে ৪ অক্ষরের হতে হবে');
      return;
    }

    const displayName = name.trim() || email.split('@')[0];

    onLogin({
      name: displayName,
      email: email.trim(),
      isLoggedIn: true,
    });
    setError('');
    onClose();
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-4 bg-black/80 backdrop-blur-md animate-in fade-in duration-200">
      <div className="relative w-full max-w-md bg-[#121624] border border-white/10 rounded-2xl shadow-2xl overflow-hidden">
        {/* Header decoration */}
        <div className="p-6 bg-gradient-to-r from-rose-900/40 via-purple-900/30 to-indigo-900/40 border-b border-white/10 relative">
          <button
            onClick={onClose}
            className="absolute top-4 right-4 p-1.5 text-slate-400 hover:text-white rounded-full bg-white/5 hover:bg-white/10 transition-all"
          >
            <X className="w-5 h-5" />
          </button>

          {triggerReason === 'photo_upload' ? (
            <div className="flex items-center gap-2 mb-2 text-rose-400 text-xs font-semibold uppercase tracking-wider">
              <ImageIcon className="w-4 h-4" />
              <span>ছবি পাঠানোর জন্য লগইন আবশ্যক</span>
            </div>
          ) : triggerReason === 'tokens_exhausted' ? (
            <div className="flex items-center gap-2 mb-2 text-amber-400 text-xs font-semibold uppercase tracking-wider">
              <Coins className="w-4 h-4" />
              <span>ফ্রি চ্যাট লিমিট শেষ • ২৫০টি SMS লিমিট নিন 🎁</span>
            </div>
          ) : triggerReason === 'premium_feature' ? (
            <div className="flex items-center gap-2 mb-2 text-amber-400 text-xs font-semibold uppercase tracking-wider">
              <Sparkles className="w-4 h-4" />
              <span>প্রিমিয়াম VIP অ্যাক্সেস</span>
            </div>
          ) : (
            <div className="flex items-center gap-2 mb-2 text-rose-400 text-xs font-semibold uppercase tracking-wider">
              <Heart className="w-4 h-4" />
              <span>মনের সাথী একাউন্ট</span>
            </div>
          )}

          <h2 className="text-xl font-bold text-white tracking-tight">
            {user.isLoggedIn
              ? 'আপনার মনের সাথী প্রোফাইল'
              : triggerReason === 'tokens_exhausted'
              ? 'লগইন করে ২৫০টি SMS লিমিট নিন 🎁'
              : triggerReason === 'photo_upload'
              ? 'ছবি পাঠাতে অ্যাকাউন্ট লগইন করুন 📸'
              : isRegistering
              ? 'নতুন অ্যাকাউন্ট তৈরি করুন'
              : 'অ্যাকাউন্টে লগইন করুন'}
          </h2>

          <p className="text-xs text-slate-300 mt-1 leading-relaxed">
            {triggerReason === 'tokens_exhausted'
              ? 'আপনার ফ্রি ৫০টি SMS লিমিট শেষ হয়েছে। অ্যাকাউন্টে লগইন বা রেজিস্ট্রেশন করলেই পেয়ে যাবেন মোট ২৫০টি SMS লিমিট!'
              : triggerReason === 'photo_upload'
              ? 'আপনার AI প্রেমিকা বা বন্ধুকে নিজের ছবি বা সেলফি দেখাতে একটি অ্যাকাউন্ট দিয়ে লগইন করুন।'
              : 'লগইন করলে আপনার চ্যাট হিস্ট্রি সুরক্ষিত থাকবে এবং মোট ২৫০টি SMS লিমিট সুবিধা পাবেন।'}
          </p>
        </div>

        <div className="p-6 space-y-4">
          {user.isLoggedIn ? (
            <div className="space-y-4 text-center py-2">
              <div className="w-16 h-16 rounded-full bg-rose-500/20 border-2 border-rose-500 mx-auto flex items-center justify-center text-rose-300 text-2xl font-bold">
                {user.name ? user.name.charAt(0).toUpperCase() : '👤'}
              </div>
              <div>
                <h3 className="text-lg font-bold text-white">{user.name || 'সম্মানিত সদস্য'}</h3>
                <p className="text-xs text-slate-400">{user.email || 'বেনামী অ্যাকাউন্ট'}</p>
                <div className="inline-flex items-center gap-1 mt-2 px-2.5 py-1 rounded-full bg-emerald-500/20 text-emerald-300 text-xs font-medium border border-emerald-500/30">
                  <CheckCircle2 className="w-3.5 h-3.5" /> লগইন করা আছে
                </div>
              </div>

              <div className="bg-white/5 rounded-xl p-3 text-left border border-white/5 space-y-2 text-xs text-slate-300">
                <div className="flex justify-between">
                  <span>সদস্যপদ স্ট্যাটাস:</span>
                  <span className={user.isPremium ? 'text-amber-400 font-bold' : 'text-slate-300'}>
                    {user.isPremium ? '👑 VIP Soulmate' : 'সাধারণ সদস্য (২৫০ SMS)'}
                  </span>
                </div>
                <div className="flex justify-between">
                  <span>টোকেন ব্যালেন্স:</span>
                  <span className="text-amber-400 font-bold flex items-center gap-1">
                    <Coins className="w-3.5 h-3.5" />
                    {user.isPremium ? '👑 VIP আনলিমিটেড' : `${user.tokens ?? 250}/250 SMS`}
                  </span>
                </div>
                <div className="flex justify-between">
                  <span>ছবি শেয়ারিং পারমিশন:</span>
                  <span className="text-emerald-400 font-medium">সক্রিয় (Unlocked)</span>
                </div>
              </div>

              <div className="flex gap-2 pt-2">
                <button
                  onClick={onClose}
                  className="flex-1 py-2.5 rounded-xl bg-rose-600 hover:bg-rose-500 text-white font-medium text-xs transition-all shadow-md"
                >
                  কথা চালিয়ে যান
                </button>
                <button
                  onClick={() => {
                    onLogout();
                    onClose();
                  }}
                  className="py-2.5 px-4 rounded-xl bg-white/10 hover:bg-white/15 text-slate-300 hover:text-white font-medium text-xs transition-all"
                >
                  লগআউট
                </button>
              </div>
            </div>
          ) : (
            <>
              <form onSubmit={handleSubmit} className="space-y-3">
                {isRegistering && (
                  <div>
                    <label className="block text-xs text-slate-300 mb-1 font-medium">আপনার নাম</label>
                    <input
                      type="text"
                      value={name}
                      onChange={(e) => setName(e.target.value)}
                      placeholder="আপনার সুন্দর নামটি লিখুন"
                      className="w-full px-3.5 py-2.5 rounded-xl bg-white/5 border border-white/10 text-white text-xs placeholder:text-slate-500 focus:outline-none focus:border-rose-500 transition-colors"
                    />
                  </div>
                )}

                <div>
                  <label className="block text-xs text-slate-300 mb-1 font-medium">ইমেইল ঠিকানা (Email)</label>
                  <input
                    type="email"
                    required
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    placeholder="example@gmail.com"
                    className="w-full px-3.5 py-2.5 rounded-xl bg-white/5 border border-white/10 text-white text-xs placeholder:text-slate-500 focus:outline-none focus:border-rose-500 transition-colors"
                  />
                </div>

                <div>
                  <label className="block text-xs text-slate-300 mb-1 font-medium">পাসওয়ার্ড (Password)</label>
                  <input
                    type="password"
                    required
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    placeholder="••••••••"
                    className="w-full px-3.5 py-2.5 rounded-xl bg-white/5 border border-white/10 text-white text-xs placeholder:text-slate-500 focus:outline-none focus:border-rose-500 transition-colors"
                  />
                </div>

                {error && (
                  <p className="text-xs text-rose-400 bg-rose-500/10 p-2 rounded-lg border border-rose-500/20">
                    {error}
                  </p>
                )}

                <button
                  type="submit"
                  className="w-full py-2.5 rounded-xl bg-gradient-to-r from-rose-600 to-pink-600 hover:from-rose-500 hover:to-pink-500 text-white font-semibold text-xs transition-all shadow-md shadow-rose-600/20 flex items-center justify-center gap-1.5 cursor-pointer"
                >
                  {isRegistering ? <UserPlus className="w-4 h-4" /> : <LogIn className="w-4 h-4" />}
                  <span>{isRegistering ? 'রেজিস্ট্রেশন সম্পূর্ণ করুন (২৫০ SMS)' : 'লগইন করুন (২৫০ SMS লিমিট)'}</span>
                </button>
              </form>

              <div className="text-center pt-1">
                <button
                  type="button"
                  onClick={() => {
                    setIsRegistering(!isRegistering);
                    setError('');
                  }}
                  className="text-xs text-slate-400 hover:text-rose-400 transition-colors cursor-pointer"
                >
                  {isRegistering
                    ? 'আগের অ্যাকাউন্ট আছে? লগইন করুন'
                    : 'নতুন অ্যাকাউন্ট চান? এখানে রেজিস্ট্রেশন করুন'}
                </button>
              </div>
            </>
          )}
        </div>
      </div>
    </div>
  );
};

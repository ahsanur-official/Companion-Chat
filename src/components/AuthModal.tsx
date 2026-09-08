import React, { useState } from 'react';
import { X, Image as ImageIcon, Lock, LogIn, UserPlus, Sparkles, CheckCircle2, ShieldCheck, Heart } from 'lucide-react';
import { UserAccount } from '../types';

interface AuthModalProps {
  isOpen: boolean;
  onClose: () => void;
  user: UserAccount;
  onLogin: (userData: Partial<UserAccount>) => void;
  onLogout: () => void;
  triggerReason?: 'photo_upload' | 'premium_feature' | 'general';
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
    if (!email) {
      setError('অনুগ্রহ করে আপনার ইমেইল প্রদান করুন');
      return;
    }

    onLogin({
      name: name.trim(),
      email: email.trim(),
      isLoggedIn: true,
    });
    setError('');
    onClose();
  };

  const handleQuickDemoLogin = () => {
    onLogin({
      name: '',
      email: '',
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
              : triggerReason === 'photo_upload'
              ? 'ছবি পাঠাতে এখনই লগইন করুন 📸'
              : 'লগইন বা রেজিস্ট্রেশন করুন'}
          </h2>

          <p className="text-xs text-slate-300 mt-1 leading-relaxed">
            {triggerReason === 'photo_upload'
              ? 'আপনার AI প্রেমিকা বা বন্ধুকে নিজের ছবি বা সেলফি দেখাতে একটি ফ্রি অ্যাকাউন্ট দিয়ে লগইন করুন।'
              : 'লগইন করলে আপনার চ্যাট হিস্ট্রি সুরক্ষিত থাকবে এবং বিশেষ সব সুবিধা উপভোগ করতে পারবেন।'}
          </p>
        </div>

        <div className="p-6 space-y-4">
          {user.isLoggedIn ? (
            <div className="space-y-4 text-center py-2">
              <div className="w-16 h-16 rounded-full bg-rose-500/20 border-2 border-rose-500 mx-auto flex items-center justify-center text-rose-300 text-2xl font-bold">
                {user.name ? user.name.charAt(0).toUpperCase() : '👤'}
              </div>
              <div>
                <h3 className="text-lg font-bold text-white">{user.name || 'বেনামী সাথী (Anonymous)'}</h3>
                <p className="text-xs text-slate-400">{user.email || 'বেনামী অ্যাকাউন্ট'}</p>
                <div className="inline-flex items-center gap-1 mt-2 px-2.5 py-1 rounded-full bg-emerald-500/20 text-emerald-300 text-xs font-medium border border-emerald-500/30">
                  <CheckCircle2 className="w-3.5 h-3.5" /> লগইন করা আছে
                </div>
              </div>

              <div className="bg-white/5 rounded-xl p-3 text-left border border-white/5 space-y-2 text-xs text-slate-300">
                <div className="flex justify-between">
                  <span>সদস্যপদ স্ট্যাটাস:</span>
                  <span className={user.isPremium ? 'text-amber-400 font-bold' : 'text-slate-300'}>
                    {user.isPremium ? '👑 VIP Soulmate' : 'বিনামূল্যে (Free)'}
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
              {/* Quick 1-Click login shortcut */}
              <button
                type="button"
                onClick={handleQuickDemoLogin}
                className="w-full py-2.5 px-4 rounded-xl bg-gradient-to-r from-emerald-600 to-teal-600 hover:from-emerald-500 hover:to-teal-500 text-white font-semibold text-xs transition-all shadow-md flex items-center justify-center gap-2"
              >
                <ShieldCheck className="w-4 h-4" />
                <span>দ্রুত ১-ক্লিকে ফ্রি লগইন করুন (Instant Test Login)</span>
              </button>

              <div className="relative flex items-center justify-center my-3">
                <div className="border-t border-white/10 w-full" />
                <span className="bg-[#121624] px-3 text-[11px] text-slate-400 uppercase tracking-wider shrink-0">
                  অথবা ইমেইল দিয়ে
                </span>
                <div className="border-t border-white/10 w-full" />
              </div>

              <form onSubmit={handleSubmit} className="space-y-3">
                {isRegistering && (
                  <div>
                    <label className="block text-xs text-slate-300 mb-1">আপনার নাম (ঐচ্ছিক)</label>
                    <input
                      type="text"
                      value={name}
                      onChange={(e) => setName(e.target.value)}
                      placeholder="নাম না রাখতে চাইলে খালি রাখুন"
                      className="w-full px-3.5 py-2.5 rounded-xl bg-white/5 border border-white/10 text-white text-xs placeholder:text-slate-500 focus:outline-none focus:border-rose-500 transition-colors"
                    />
                  </div>
                )}

                <div>
                  <label className="block text-xs text-slate-300 mb-1">ইমেইল ঠিকানা (Email)</label>
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
                  <label className="block text-xs text-slate-300 mb-1">পাসওয়ার্ড (Password)</label>
                  <input
                    type="password"
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
                  className="w-full py-2.5 rounded-xl bg-gradient-to-r from-rose-600 to-pink-600 hover:from-rose-500 hover:to-pink-500 text-white font-semibold text-xs transition-all shadow-md shadow-rose-600/20 flex items-center justify-center gap-1.5"
                >
                  {isRegistering ? <UserPlus className="w-4 h-4" /> : <LogIn className="w-4 h-4" />}
                  <span>{isRegistering ? 'রেজিস্ট্রেশন সম্পূর্ণ করুন' : 'লগইন করুন'}</span>
                </button>
              </form>

              <div className="text-center pt-1">
                <button
                  type="button"
                  onClick={() => setIsRegistering(!isRegistering)}
                  className="text-xs text-slate-400 hover:text-rose-400 transition-colors"
                >
                  {isRegistering
                    ? 'আগের অ্যাকাউন্ট আছে? লগইন করুন'
                    : 'নতুন ব্যবহারকারী? ফ্রি রেজিস্ট্রেশন করুন'}
                </button>
              </div>
            </>
          )}
        </div>
      </div>
    </div>
  );
};

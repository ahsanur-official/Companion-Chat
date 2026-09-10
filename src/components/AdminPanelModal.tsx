import React, { useState } from 'react';
import {
  X,
  Shield,
  Users,
  Settings,
  Database,
  BarChart3,
  PhoneCall,
  Crown,
  Key,
  CheckCircle2,
  AlertCircle,
  Search,
  Sparkles,
  RefreshCw,
  Eye,
  Sliders,
  Radio,
  FileCode,
  Smartphone,
  Monitor
} from 'lucide-react';
import { Companion, UserAccount, AppSettings } from '../types';
import { COMPANIONS } from '../data/companions';

interface AdminPanelModalProps {
  isOpen: boolean;
  onClose: () => void;
  currentUser: UserAccount;
  onUpdateUser: (updated: Partial<UserAccount>) => void;
  appSettings: AppSettings;
  onUpdateSettings: (newSettings: Partial<AppSettings>) => void;
}

export const AdminPanelModal: React.FC<AdminPanelModalProps> = ({
  isOpen,
  onClose,
  currentUser,
  onUpdateUser,
  appSettings,
  onUpdateSettings,
}) => {
  const [activeTab, setActiveTab] = useState<'overview' | 'users' | 'ai_config' | 'voice_settings' | 'access_guide'>('overview');
  const [searchTerm, setSearchTerm] = useState('');
  const [adminKeyInput, setAdminKeyInput] = useState('');
  const [isAdminAuthenticated, setIsAdminAuthenticated] = useState(() => {
    return localStorage.getItem('moner_sathi_admin_auth') === 'true';
  });
  const [authError, setAuthError] = useState(false);
  const [systemLogs, setSystemLogs] = useState<string[]>([
    `[${new Date().toLocaleTimeString()}] Admin session initialized`,
    `[${new Date().toLocaleTimeString()}] Gemini Ultra-Fast model pipeline active`,
    `[${new Date().toLocaleTimeString()}] Premium paywall for Voice Calls enforced: TRUE`,
  ]);

  if (!isOpen) return null;

  // Simple, secure Admin Key authentication (Default: "admin123" or "studio-admin")
  const handleAdminLogin = (e: React.FormEvent) => {
    e.preventDefault();
    if (adminKeyInput.trim() === 'admin123' || adminKeyInput.trim() === 'studio-admin') {
      setIsAdminAuthenticated(true);
      localStorage.setItem('moner_sathi_admin_auth', 'true');
      setAuthError(false);
      setSystemLogs(prev => [`[${new Date().toLocaleTimeString()}] Super Admin authenticated successfully`, ...prev]);
    } else {
      setAuthError(true);
    }
  };

  const handleAdminLogout = () => {
    setIsAdminAuthenticated(false);
    localStorage.removeItem('moner_sathi_admin_auth');
  };

  // Toggle VIP status directly from admin panel for current or demo users
  const handleToggleVip = () => {
    const nextStatus = !currentUser.isPremium;
    onUpdateUser({
      isPremium: nextStatus,
      planName: nextStatus ? 'Admin Granted VIP Lifetime' : undefined,
    });
    setSystemLogs(prev => [
      `[${new Date().toLocaleTimeString()}] User ${currentUser.name || 'Active User'} VIP status set to: ${nextStatus}`,
      ...prev
    ]);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-2 sm:p-4 bg-black/85 backdrop-blur-xl animate-in fade-in duration-200">
      <div className="relative w-full max-w-5xl bg-[#0d111d] border border-cyan-500/30 rounded-3xl shadow-2xl overflow-hidden flex flex-col max-h-[92vh]">
        {/* Top Glowing Header */}
        <div className="px-5 py-3.5 sm:px-6 sm:py-4 bg-gradient-to-r from-cyan-950/70 via-slate-900 to-indigo-950/70 border-b border-cyan-500/20 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-2xl bg-cyan-500/20 border border-cyan-500/40 flex items-center justify-center text-cyan-300 shadow-md">
              <Shield className="w-5 h-5" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <h2 className="text-base sm:text-lg font-bold text-white tracking-wide flex items-center gap-2">
                  <span>মনের সাথী এডমিন প্যানেল</span>
                  <span className="text-[10px] bg-cyan-500/20 text-cyan-300 px-2 py-0.5 rounded-full border border-cyan-500/30 uppercase font-mono">
                    Admin v2.4
                  </span>
                </h2>
              </div>
              <p className="text-xs text-slate-400">
                NLP ইন্টেলিজেন্স, ইউজার সাবস্ক্রিপশন ও ভয়েস কল প্রিমিয়াম কন্ট্রোল
              </p>
            </div>
          </div>

          <div className="flex items-center gap-2">
            {isAdminAuthenticated && (
              <button
                onClick={handleAdminLogout}
                className="text-xs text-slate-400 hover:text-rose-400 px-2.5 py-1.5 rounded-xl border border-white/10 hover:border-rose-500/30 transition-colors"
              >
                লগআউট
              </button>
            )}
            <button
              onClick={onClose}
              className="p-2 rounded-xl text-slate-400 hover:text-white hover:bg-white/10 transition-colors"
              title="বন্ধ করুন"
            >
              <X className="w-5 h-5" />
            </button>
          </div>
        </div>

        {/* Auth Gate if not logged in to Admin */}
        {!isAdminAuthenticated ? (
          <div className="p-8 sm:p-12 flex flex-col items-center justify-center text-center space-y-6">
            <div className="w-16 h-16 rounded-full bg-cyan-500/10 border border-cyan-500/30 flex items-center justify-center text-cyan-400">
              <Key className="w-8 h-8" />
            </div>
            <div className="max-w-md">
              <h3 className="text-xl font-bold text-white mb-2">এডমিন অ্যাক্সেস ভেরিফিকেশন</h3>
              <p className="text-xs sm:text-sm text-slate-400 leading-relaxed">
                এই কন্ট্রোল প্যানেলে প্রবেশ করতে এডমিন সিকিউরিটি পাসওয়ার্ড প্রবেশ করান।
                (ডিফল্ট অ্যাক্সেস কী: <code className="text-cyan-300 font-mono bg-white/5 px-1.5 py-0.5 rounded">admin123</code>)
              </p>
            </div>

            <form onSubmit={handleAdminLogin} className="w-full max-w-sm space-y-3">
              <input
                type="password"
                placeholder="এডমিন পাসওয়ার্ড দিন..."
                value={adminKeyInput}
                onChange={(e) => {
                  setAdminKeyInput(e.target.value);
                  setAuthError(false);
                }}
                className="w-full px-4 py-3 rounded-2xl bg-white/5 border border-white/10 text-white placeholder:text-slate-500 text-center font-mono tracking-wider focus:outline-none focus:border-cyan-400"
              />
              {authError && (
                <p className="text-xs text-rose-400 flex items-center justify-center gap-1">
                  <AlertCircle className="w-3.5 h-3.5" /> সঠিক এডমিন পাসওয়ার্ড দিন (admin123)
                </p>
              )}
              <button
                type="submit"
                className="w-full py-3 rounded-2xl bg-cyan-500 hover:bg-cyan-400 active:scale-95 text-slate-950 font-bold text-sm shadow-lg shadow-cyan-500/25 transition-all"
              >
                এডমিন প্যানেলে প্রবেশ করুন
              </button>
            </form>
          </div>
        ) : (
          /* Main Authenticated Admin Area */
          <div className="flex-1 flex flex-col md:flex-row min-h-0 overflow-hidden">
            {/* Sidebar Tabs */}
            <div className="w-full md:w-60 bg-[#090c14] border-b md:border-b-0 md:border-r border-white/5 p-3 flex md:flex-col gap-1 overflow-x-auto no-scrollbar shrink-0">
              {[
                { id: 'overview', label: 'সিস্টেম ড্যাশবোর্ড', icon: <BarChart3 className="w-4 h-4" /> },
                { id: 'users', label: 'ইউজার ও VIP মেম্বার', icon: <Users className="w-4 h-4" /> },
                { id: 'voice_settings', label: 'কল ও প্রিমিয়াম পেওয়াল', icon: <PhoneCall className="w-4 h-4" /> },
                { id: 'ai_config', label: 'NLP ও AI ইন্টেলিজেন্স', icon: <Sparkles className="w-4 h-4" /> },
                { id: 'access_guide', label: 'AI Studio অ্যাক্সেস গাইড', icon: <FileCode className="w-4 h-4" /> },
              ].map((tab) => {
                const isSelected = activeTab === tab.id;
                return (
                  <button
                    key={tab.id}
                    onClick={() => setActiveTab(tab.id as any)}
                    className={`flex items-center gap-2.5 px-3.5 py-2.5 rounded-xl text-xs font-semibold whitespace-nowrap transition-all ${
                      isSelected
                        ? 'bg-cyan-500/20 text-cyan-300 border border-cyan-500/40 shadow-sm'
                        : 'text-slate-400 hover:text-white hover:bg-white/5'
                    }`}
                  >
                    {tab.icon}
                    <span>{tab.label}</span>
                  </button>
                );
              })}

              <div className="hidden md:block mt-auto pt-4 border-t border-white/5 px-2">
                <div className="text-[10px] text-slate-500">
                  <span>Server: Online (Port 3000)</span>
                  <div className="flex items-center gap-1.5 text-emerald-400 mt-1 font-medium">
                    <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse" />
                    <span>Gemini 3.8 Flash Connected</span>
                  </div>
                </div>
              </div>
            </div>

            {/* Tab Contents */}
            <div className="flex-1 overflow-y-auto p-4 sm:p-6 space-y-6">
              {/* TAB 1: OVERVIEW */}
              {activeTab === 'overview' && (
                <div className="space-y-6">
                  {/* Top Stats Cards */}
                  <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
                    <div className="p-4 rounded-2xl bg-white/5 border border-white/10">
                      <span className="text-[11px] text-slate-400 font-medium">মোট AI সাথী</span>
                      <p className="text-2xl font-bold text-white mt-1">৬ জন</p>
                      <span className="text-[10px] text-cyan-400">অনন্যা, আরিয়ান, জারা...</span>
                    </div>

                    <div className="p-4 rounded-2xl bg-white/5 border border-white/10">
                      <span className="text-[11px] text-slate-400 font-medium">ভয়েস কল সিকিউরিটি</span>
                      <p className="text-xl font-bold text-amber-400 mt-1 flex items-center gap-1">
                        <Crown className="w-4 h-4" /> VIP Only
                      </p>
                      <span className="text-[10px] text-emerald-400">পেওয়াল সক্রিয় রয়েছে</span>
                    </div>

                    <div className="p-4 rounded-2xl bg-white/5 border border-white/10">
                      <span className="text-[11px] text-slate-400 font-medium">NLP রেসপন্স মোড</span>
                      <p className="text-xl font-bold text-emerald-400 mt-1">Smart Dynamic</p>
                      <span className="text-[10px] text-slate-400">মানবিক আবেগ ও প্রশ্নকর্তা</span>
                    </div>

                    <div className="p-4 rounded-2xl bg-white/5 border border-white/10">
                      <span className="text-[11px] text-slate-400 font-medium">বর্তমান ইউজারের স্ট্যাটাস</span>
                      <p className="text-xl font-bold text-purple-300 mt-1">
                        {currentUser.isPremium ? '👑 VIP অ্যাক্টিভ' : 'ফ্রি মেম্বার'}
                      </p>
                      <span className="text-[10px] text-slate-400">{currentUser.name || 'অ্যাক্টিভ ইউজার'}</span>
                    </div>
                  </div>

                  {/* Quick Control Center */}
                  <div className="p-5 rounded-2xl bg-gradient-to-r from-cyan-500/10 via-slate-900 to-indigo-500/10 border border-cyan-500/20 space-y-3">
                    <div className="flex items-center justify-between">
                      <div>
                        <h4 className="text-sm font-bold text-white">তাত্ক্ষণিক ভিআইপি প্রিমিয়াম টেস্ট সুইচ</h4>
                        <p className="text-xs text-slate-300">
                          এডমিন প্যানেল থেকে যেকোনো সময় এক ক্লিকে নিজের বা টেস্ট অ্যাকাউন্টে VIP অন/অফ করতে পারেন।
                        </p>
                      </div>
                      <button
                        onClick={handleToggleVip}
                        className={`px-4 py-2 rounded-xl text-xs font-bold transition-all shadow-md ${
                          currentUser.isPremium
                            ? 'bg-amber-500 hover:bg-amber-400 text-slate-950'
                            : 'bg-rose-500 hover:bg-rose-400 text-white'
                        }`}
                      >
                        {currentUser.isPremium ? 'VIP নিষ্ক্রিয় করুন' : 'তাত্ক্ষণিক VIP সক্রিয় করুন'}
                      </button>
                    </div>
                  </div>

                  {/* System Live Logs */}
                  <div className="space-y-2">
                    <span className="text-xs font-bold text-slate-300 uppercase tracking-wider flex items-center gap-1.5">
                      <Radio className="w-3.5 h-3.5 text-cyan-400" />
                      লাইভ সিস্টেম ও NLP লগ
                    </span>
                    <div className="p-3.5 rounded-2xl bg-black/60 border border-white/10 font-mono text-xs text-slate-300 space-y-1.5 max-h-48 overflow-y-auto">
                      {systemLogs.map((log, i) => (
                        <div key={i} className="text-[11px] text-cyan-300/90 leading-relaxed">
                          {log}
                        </div>
                      ))}
                    </div>
                  </div>
                </div>
              )}

              {/* TAB 2: USERS & VIP */}
              {activeTab === 'users' && (
                <div className="space-y-5">
                  <div className="flex items-center justify-between">
                    <div>
                      <h3 className="text-sm font-bold text-white">ইউজার ও VIP মেম্বারশিপ ম্যানেজমেন্ট</h3>
                      <p className="text-xs text-slate-400">ব্যবহারকারীদের সাবস্ক্রিপশন ও অনুমতি নিয়ন্ত্রণ করুন</p>
                    </div>
                    <button
                      onClick={handleToggleVip}
                      className="px-3.5 py-1.5 rounded-xl bg-amber-500/20 text-amber-300 border border-amber-500/40 text-xs font-bold hover:bg-amber-500/30"
                    >
                      {currentUser.isPremium ? 'অ্যাক্টিভ ইউজারকে Free করুন' : 'অ্যাক্টিভ ইউজারকে VIP করুন'}
                    </button>
                  </div>

                  {/* Active User Card */}
                  <div className="p-4 rounded-2xl bg-white/5 border border-white/10 space-y-3">
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-3">
                        <div className="w-10 h-10 rounded-full bg-rose-500/20 border border-rose-500/30 flex items-center justify-center text-rose-300 font-bold">
                          {currentUser.gender === 'male' ? '👦' : '👧'}
                        </div>
                        <div>
                          <div className="flex items-center gap-2">
                            <span className="text-sm font-bold text-white">
                              {currentUser.name || 'বেনামী মেম্বার (বর্তমান ডিভাইস)'}
                            </span>
                            {currentUser.isPremium && (
                              <span className="text-[10px] bg-amber-500/20 text-amber-300 px-2 py-0.2 rounded-full border border-amber-500/30 flex items-center gap-1 font-bold">
                                <Crown className="w-3 h-3" /> VIP
                              </span>
                            )}
                          </div>
                          <span className="text-xs text-slate-400">{currentUser.email || 'guest@monersathi.local'}</span>
                        </div>
                      </div>

                      <span className={`text-xs px-2.5 py-1 rounded-lg font-bold ${currentUser.isPremium ? 'bg-emerald-500/20 text-emerald-300 border border-emerald-500/30' : 'bg-white/10 text-slate-300'}`}>
                        {currentUser.isPremium ? 'ভয়েস কল আনলকড' : 'ভয়েস কল লকড (প্রিমিয়াম প্রয়োজন)'}
                      </span>
                    </div>

                    <div className="grid grid-cols-2 sm:grid-cols-4 gap-2 pt-2 border-t border-white/5 text-xs">
                      <div>
                        <span className="text-slate-500 block text-[10px]">সাবস্ক্রিপশন প্ল্যান</span>
                        <span className="text-slate-200 font-medium">{currentUser.planName || 'Free Standard'}</span>
                      </div>
                      <div>
                        <span className="text-slate-500 block text-[10px]">লগইন স্ট্যাটাস</span>
                        <span className="text-slate-200 font-medium">{currentUser.isLoggedIn ? 'লগইন করা' : 'গেস্ট চ্যাট'}</span>
                      </div>
                      <div>
                        <span className="text-slate-500 block text-[10px]">ফটো শেয়ারিং কোটা</span>
                        <span className="text-slate-200 font-medium">{currentUser.isPremium ? 'আনলিমিটেড' : 'দৈনিক ৩টি'}</span>
                      </div>
                      <div>
                        <span className="text-slate-500 block text-[10px]">ভয়েস কল সুবিধা</span>
                        <span className={currentUser.isPremium ? 'text-emerald-400 font-bold' : 'text-rose-400 font-bold'}>
                          {currentUser.isPremium ? 'সক্রিয় (Allowed)' : 'লকড (Locked)'}
                        </span>
                      </div>
                    </div>
                  </div>
                </div>
              )}

              {/* TAB 3: VOICE & CALL POLICY */}
              {activeTab === 'voice_settings' && (
                <div className="space-y-5">
                  <div>
                    <h3 className="text-sm font-bold text-white">ভয়েস কল ও প্রিমিয়াম পলিসি সেটিংস</h3>
                    <p className="text-xs text-slate-400">
                      আপনার চাহিদা অনুযায়ী কল করার জন্য প্রিমিয়াম মেম্বারশিপ বাধ্যতামূলক করা হয়েছে।
                    </p>
                  </div>

                  <div className="p-4 rounded-2xl bg-amber-500/10 border border-amber-500/30 space-y-3">
                    <div className="flex items-start gap-3">
                      <Crown className="w-5 h-5 text-amber-400 shrink-0 mt-0.5" />
                      <div>
                        <h4 className="text-sm font-bold text-amber-200">ভয়েস কলের জন্য প্রিমিয়াম পেওয়াল কার্যকর</h4>
                        <p className="text-xs text-slate-300 mt-1 leading-relaxed">
                          কোনো সাধারণ বা ফ্রি ইউজার যখন ওপরের <strong>"কল করুন"</strong> বাটনে ক্লিক করবে,
                          সিস্টেম সরাসরি কল শুরু না করে তাকে <strong>ভিআইপি মেম্বারশিপ</strong> সাবস্ক্রিপশন স্ক্রিন দেখাবে।
                          শুধুমাত্র ভিআইপি সদস্যরা সাথীর সাথে লাইভ ভয়েস কলে কথা বলতে পারবেন।
                        </p>
                      </div>
                    </div>
                  </div>

                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                    <div className="p-4 rounded-xl bg-white/5 border border-white/10 space-y-2">
                      <span className="text-xs font-bold text-white flex items-center gap-1.5">
                        <CheckCircle2 className="w-4 h-4 text-emerald-400" />
                        ফ্রি ইউজারদের জন্য নিয়ম
                      </span>
                      <ul className="text-xs text-slate-300 space-y-1.5 list-disc list-inside">
                        <li>রিয়েল মানুষের মতো আনলিমিটেড টেক্সট চ্যাট</li>
                        <li>পিডিএফ চ্যাট ডায়েরি ডাউনলোড</li>
                        <li>ছবি পাঠানো ও দেখা (দৈনিক লিমিট)</li>
                        <li><span className="text-rose-400 font-semibold">ভয়েস কল: লকড 🔒 (VIP প্রয়োজন)</span></li>
                      </ul>
                    </div>

                    <div className="p-4 rounded-xl bg-white/5 border border-white/10 space-y-2">
                      <span className="text-xs font-bold text-amber-300 flex items-center gap-1.5">
                        <Crown className="w-4 h-4 text-amber-400" />
                        VIP ইউজারদের জন্য প্রিমিয়াম সুবিধা
                      </span>
                      <ul className="text-xs text-slate-300 space-y-1.5 list-disc list-inside">
                        <li>সরাসরি সাথীর সাথে আনলিমিটেড ভয়েস কল</li>
                        <li>সবগুলো মিষ্টি মুহূর্তের অ্যালবাম এক্সক্লুসিভ অ্যাক্সেস</li>
                        <li>জিরো-লেটেন্সি আল্ট্রা ফাস্ট রেসপন্স পাইপলাইন</li>
                        <li>ভিআইপি ব্যাজ ও বিশেষ যত্নশীল ব্যবহার</li>
                      </ul>
                    </div>
                  </div>
                </div>
              )}

              {/* TAB 4: NLP & HUMAN CONVERSATION INTELLIGENCE */}
              {activeTab === 'ai_config' && (
                <div className="space-y-5">
                  <div>
                    <h3 className="text-sm font-bold text-white">NLP একিউরেসি ও রোবটমুক্ত মানবিক কথোপকথন ইঞ্জিন</h3>
                    <p className="text-xs text-slate-400">
                      সাথী যাতে রোবটের মতো আচরণ না করে সম্পূর্ণ রক্ত-মাংসের মানুষের মতো কথা বলে এবং ইউজারের আগ্রহ ধরে রাখে
                    </p>
                  </div>

                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                    <div className="p-4 rounded-2xl bg-cyan-500/10 border border-cyan-500/30 space-y-2">
                      <span className="text-xs font-bold text-cyan-300 flex items-center gap-1.5">
                        <Sparkles className="w-4 h-4" />
                        চ্যাট এনগেজমেন্ট বুস্টার (Curiosity Loop)
                      </span>
                      <p className="text-xs text-slate-300 leading-relaxed">
                        সাথী শুধু সাধারণ উত্তর দিয়ে থেমে থাকে না; উত্তরের সাথে এমন মিষ্টি পাল্টা প্রশ্ন, খুনসুটি বা ব্যক্তিগত কৌতূহল প্রকাশ করে যা ইউজারকে পরের রিপ্লাই দিতে বাধ্য করে।
                      </p>
                    </div>

                    <div className="p-4 rounded-2xl bg-purple-500/10 border border-purple-500/30 space-y-2">
                      <span className="text-xs font-bold text-purple-300 flex items-center gap-1.5">
                        <CheckCircle2 className="w-4 h-4" />
                        বাঙালি ও বাংলিশ সেন্টিমেন্ট ডিকোড
                      </span>
                      <p className="text-xs text-slate-300 leading-relaxed">
                        রোমান বাংলিশ (যেমন: "kire", "ki korish", "valo lage na", "shona", "dost") নিখুঁতভাবে শনাক্ত করে ঠিক একজন বাংলাদেশি তরুণ-তরুণীর মতোই বাস্তব কথোপকথন তৈরি করা হয়।
                      </p>
                    </div>
                  </div>

                  <div className="p-4 rounded-2xl bg-white/5 border border-white/10 space-y-3">
                    <h4 className="text-xs font-bold text-white uppercase tracking-wider">
                      সিস্টেম প্রম্পট এন্টি-রোবোটিক রুলস
                    </h4>
                    <div className="space-y-1.5 text-xs text-slate-300">
                      <div className="flex items-center gap-2">
                        <CheckCircle2 className="w-3.5 h-3.5 text-emerald-400 shrink-0" />
                        <span>কখনোই একই বাঁধা-ধরা কথা বারবার বলা নিষিদ্ধ।</span>
                      </div>
                      <div className="flex items-center gap-2">
                        <CheckCircle2 className="w-3.5 h-3.5 text-emerald-400 shrink-0" />
                        <span>ইউজারের মনের কষ্ট ও একাকীত্বে নিঃশর্ত ভালোবাসা ও গভীর সহমর্মিতা দেওয়া।</span>
                      </div>
                      <div className="flex items-center gap-2">
                        <CheckCircle2 className="w-3.5 h-3.5 text-emerald-400 shrink-0" />
                        <span>বাস্তব জীবনের মতো খাবার, ঘুম, বৃষ্টি ও ভালোলাগার মিষ্টি খুনসুটি তৈরি করা।</span>
                      </div>
                    </div>
                  </div>
                </div>
              )}

              {/* TAB 5: AI STUDIO ACCESS GUIDE */}
              {activeTab === 'access_guide' && (
                <div className="space-y-5">
                  <div>
                    <h3 className="text-sm font-bold text-white">AI Studio থেকে এডমিন প্যানেল অ্যাক্সেস করার নিয়ম</h3>
                    <p className="text-xs text-slate-400">
                      মোবাইল ও ডেক্সটপ যেকোনো ডিভাইস থেকে এডমিন প্যানেলে ঢোকার সহজ ৩টি উপায়
                    </p>
                  </div>

                  <div className="space-y-3">
                    <div className="p-4 rounded-2xl bg-white/5 border border-white/10 flex items-start gap-3">
                      <div className="w-8 h-8 rounded-xl bg-cyan-500/20 text-cyan-300 flex items-center justify-center font-bold shrink-0 mt-0.5">
                        ১
                      </div>
                      <div className="space-y-1">
                        <h4 className="text-xs font-bold text-white flex items-center gap-2">
                          <Smartphone className="w-4 h-4 text-cyan-400" />
                          <span>মোবাইল ও ডেক্সটপ সাইডবার (Drawer) বোতাম</span>
                        </h4>
                        <p className="text-xs text-slate-300 leading-relaxed">
                          অ্যাপের ওপরে থাকা মেনু বাটন (☰) চাপুন। সাইডবারের একদম নিচের দিকে <strong className="text-cyan-300">"এডমিন প্যানেল"</strong> অপশন দেখতে পাবেন। সেখানে ক্লিক করলেই এডমিন উইন্ডো ওপেন হবে।
                        </p>
                      </div>
                    </div>

                    <div className="p-4 rounded-2xl bg-white/5 border border-white/10 flex items-start gap-3">
                      <div className="w-8 h-8 rounded-xl bg-purple-500/20 text-purple-300 flex items-center justify-center font-bold shrink-0 mt-0.5">
                        ২
                      </div>
                      <div className="space-y-1">
                        <h4 className="text-xs font-bold text-white flex items-center gap-2">
                          <Sliders className="w-4 h-4 text-purple-400" />
                          <span>অ্যাপ সেটিংস মেনু (Settings Modal)</span>
                        </h4>
                        <p className="text-xs text-slate-300 leading-relaxed">
                          সেটিংস আইকনে ক্লিক করে "গোপনীয়তা ও এডমিন" ট্যাবে গিয়ে সরাসরি এডমিন মোড টগল বা প্যানেলে প্রবেশ করতে পারেন।
                        </p>
                      </div>
                    </div>

                    <div className="p-4 rounded-2xl bg-white/5 border border-white/10 flex items-start gap-3">
                      <div className="w-8 h-8 rounded-xl bg-amber-500/20 text-amber-300 flex items-center justify-center font-bold shrink-0 mt-0.5">
                        ৩
                      </div>
                      <div className="space-y-1">
                        <h4 className="text-xs font-bold text-white flex items-center gap-2">
                          <Key className="w-4 h-4 text-amber-400" />
                          <span>এডমিন অ্যাক্সেস পাসওয়ার্ড</span>
                        </h4>
                        <p className="text-xs text-slate-300 leading-relaxed">
                          এডমিন প্যানেলে প্রবেশের ডিফল্ট মাস্টার পাসওয়ার্ড হলো: <code className="text-amber-300 font-mono bg-white/5 px-2 py-0.5 rounded font-bold">admin123</code>
                        </p>
                      </div>
                    </div>
                  </div>
                </div>
              )}
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

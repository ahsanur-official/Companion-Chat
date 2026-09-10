import React, { useState, useRef } from 'react';
import {
  X,
  Image as ImageIcon,
  Check,
  Upload,
  RotateCcw,
  Sparkles,
  Sliders,
  Eye,
} from 'lucide-react';
import { AppSettings } from '../types';
import { WALLPAPER_PRESETS, WallpaperPreset } from '../data/wallpapers';

interface WallpaperModalProps {
  isOpen: boolean;
  onClose: () => void;
  settings: AppSettings;
  onUpdateSettings: (newSettings: Partial<AppSettings>) => void;
}

export const WallpaperModal: React.FC<WallpaperModalProps> = ({
  isOpen,
  onClose,
  settings,
  onUpdateSettings,
}) => {
  const fileInputRef = useRef<HTMLInputElement>(null);
  const [customUrlInput, setCustomUrlInput] = useState(settings.customWallpaperUrl || '');
  const [previewError, setPreviewError] = useState(false);

  if (!isOpen) return null;

  const currentWallpaperId = settings.wallpaperId || 'default';
  const currentDim = settings.wallpaperDim ?? 50;
  const currentBlur = settings.wallpaperBlur ?? 2;

  const handleSelectPreset = (preset: WallpaperPreset) => {
    onUpdateSettings({
      wallpaperId: preset.id,
      customWallpaperUrl: undefined,
    });
  };

  const handleFileUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    // Check size limit (< 6MB)
    if (file.size > 6 * 1024 * 1024) {
      alert('ছবির সাইজ ৬MB এর কম হতে হবে!');
      return;
    }

    const reader = new FileReader();
    reader.onload = (event) => {
      const dataUrl = event.target?.result as string;
      if (dataUrl) {
        onUpdateSettings({
          wallpaperId: 'custom',
          customWallpaperUrl: dataUrl,
        });
      }
    };
    reader.readAsDataURL(file);
  };

  const handleApplyCustomUrl = (e: React.FormEvent) => {
    e.preventDefault();
    if (!customUrlInput.trim()) return;
    onUpdateSettings({
      wallpaperId: 'custom',
      customWallpaperUrl: customUrlInput.trim(),
    });
  };

  const handleReset = () => {
    onUpdateSettings({
      wallpaperId: 'default',
      customWallpaperUrl: undefined,
      wallpaperDim: 50,
      wallpaperBlur: 2,
    });
  };

  // Find active wallpaper image URL for mini preview
  const activePreset = WALLPAPER_PRESETS.find((p) => p.id === currentWallpaperId);
  const activeBgImage =
    currentWallpaperId === 'custom' && settings.customWallpaperUrl
      ? settings.customWallpaperUrl
      : activePreset?.fullUrl || WALLPAPER_PRESETS[0].fullUrl;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-4 bg-black/80 backdrop-blur-md animate-in fade-in duration-200">
      <div
        className="relative w-full max-w-2xl bg-[#0f1322] border border-white/10 rounded-3xl shadow-2xl overflow-hidden flex flex-col max-h-[92vh]"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Header */}
        <div className="p-4 sm:p-5 border-b border-white/10 flex items-center justify-between bg-gradient-to-r from-rose-900/20 via-purple-900/20 to-transparent shrink-0">
          <div className="flex items-center gap-2.5">
            <div className="w-10 h-10 rounded-2xl bg-rose-500/20 border border-rose-500/30 flex items-center justify-center text-rose-300 shadow-sm">
              <ImageIcon className="w-5 h-5" />
            </div>
            <div>
              <h2 className="text-base sm:text-lg font-bold text-white flex items-center gap-2">
                চ্যাট ব্যাকগ্রাউন্ড ও ওয়ালপেপার
                <span className="text-xs px-2 py-0.5 rounded-full bg-rose-500/20 text-rose-300 font-normal border border-rose-500/30">
                  রোমান্টিক থিম
                </span>
              </h2>
              <p className="text-xs text-slate-400">
                আপনার পছন্দের ব্যাকগ্রাউন্ড দিয়ে চ্যাটিংয়ের অনুভূতি আরও মিষ্টি করুন
              </p>
            </div>
          </div>

          <button
            onClick={onClose}
            className="w-8 h-8 rounded-full bg-white/5 hover:bg-white/10 text-slate-400 hover:text-white flex items-center justify-center transition-colors border border-white/5"
          >
            <X className="w-4 h-4" />
          </button>
        </div>

        {/* Scrollable Content */}
        <div className="flex-1 overflow-y-auto p-4 sm:p-6 space-y-6 no-scrollbar">
          {/* Live Preview Box */}
          <div className="relative rounded-2xl overflow-hidden border border-white/15 h-36 sm:h-44 shadow-inner flex flex-col justify-end p-4">
            {/* Background layer */}
            <div
              className="absolute inset-0 bg-cover bg-center transition-all duration-300"
              style={{
                backgroundImage: `url(${activeBgImage})`,
                filter: `blur(${currentBlur}px)`,
                transform: 'scale(1.05)',
              }}
            />
            {/* Dim Overlay */}
            <div
              className="absolute inset-0 bg-black transition-opacity duration-200"
              style={{ opacity: currentDim / 100 }}
            />

            {/* Mock Message overlay for testing readability */}
            <div className="relative z-10 space-y-2">
              <div className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full bg-black/60 backdrop-blur-md border border-white/15 text-[11px] text-white">
                <Eye className="w-3.5 h-3.5 text-rose-400" />
                <span>লাইভ প্রিভিউ (টেক্সট পড়ার সুবিধা নিশ্চিত করুন)</span>
              </div>
              <div className="max-w-xs p-2.5 rounded-2xl rounded-tl-sm bg-[#151928]/90 border border-white/10 text-xs text-slate-100 shadow-md backdrop-blur-sm">
                <p className="leading-snug">
                  "তোমার সাথে কথা বলতে আমার ভীষণ ভালো লাগে সোনা! ❤️"
                </p>
                <span className="text-[9px] text-white/50 block mt-1">সাথীর বার্তা</span>
              </div>
            </div>
          </div>

          {/* Preset Wallpapers Grid */}
          <div className="space-y-3">
            <div className="flex items-center justify-between">
              <h3 className="text-xs font-bold uppercase tracking-wider text-slate-300 flex items-center gap-1.5">
                <Sparkles className="w-3.5 h-3.5 text-rose-400" />
                <span>পছন্দের রোমান্টিক ওয়ালপেপারসমূহ</span>
              </h3>
              <button
                type="button"
                onClick={handleReset}
                className="text-[11px] text-rose-400 hover:text-rose-300 hover:underline flex items-center gap-1"
              >
                <RotateCcw className="w-3 h-3" />
                <span>ডিফল্ট থিমে ফিরুন</span>
              </button>
            </div>

            <div className="grid grid-cols-2 sm:grid-cols-3 gap-3">
              {WALLPAPER_PRESETS.map((preset) => {
                const isSelected = currentWallpaperId === preset.id;
                return (
                  <button
                    key={preset.id}
                    type="button"
                    onClick={() => handleSelectPreset(preset)}
                    className={`relative rounded-2xl overflow-hidden border transition-all text-left group h-24 sm:h-28 flex flex-col justify-end p-2.5 ${
                      isSelected
                        ? 'border-rose-500 ring-2 ring-rose-500/50 scale-[1.02] shadow-lg shadow-rose-950/40'
                        : 'border-white/10 hover:border-white/25 hover:scale-[1.01]'
                    }`}
                  >
                    <img
                      src={preset.previewUrl}
                      alt={preset.bengaliName}
                      className="absolute inset-0 w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                    />
                    <div className="absolute inset-0 bg-gradient-to-t from-black/90 via-black/40 to-transparent" />

                    {isSelected && (
                      <div className="absolute top-2 right-2 w-5 h-5 rounded-full bg-rose-600 text-white flex items-center justify-center shadow-md">
                        <Check className="w-3 h-3 stroke-[3]" />
                      </div>
                    )}

                    <div className="relative z-10">
                      <span className="text-[10px] text-rose-300 font-semibold block">
                        {preset.mood}
                      </span>
                      <h4 className="text-xs font-bold text-white truncate drop-shadow-sm">
                        {preset.bengaliName}
                      </h4>
                    </div>
                  </button>
                );
              })}
            </div>
          </div>

          {/* Custom Wallpaper Section */}
          <div className="p-4 rounded-2xl bg-white/[0.03] border border-white/10 space-y-3">
            <h3 className="text-xs font-bold text-slate-200 flex items-center gap-2">
              <Upload className="w-3.5 h-3.5 text-purple-400" />
              <span>নিজের ছবি বা কাস্টম ওয়ালপেপার যোগ করুন</span>
            </h3>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-2.5">
              {/* File Upload from Device */}
              <div>
                <input
                  type="file"
                  ref={fileInputRef}
                  accept="image/*"
                  onChange={handleFileUpload}
                  className="hidden"
                />
                <button
                  type="button"
                  onClick={() => fileInputRef.current?.click()}
                  className="w-full py-2.5 px-3 rounded-xl bg-purple-500/15 hover:bg-purple-500/25 border border-purple-500/30 text-purple-200 text-xs font-semibold flex items-center justify-center gap-2 transition-colors active:scale-95"
                >
                  <Upload className="w-4 h-4 text-purple-400" />
                  <span>ডিভাইস থেকে ছবি আপলোড করুন</span>
                </button>
              </div>

              {/* Online Image URL */}
              <form onSubmit={handleApplyCustomUrl} className="flex gap-1.5">
                <input
                  type="url"
                  placeholder="ছবির লিংক (URL) দিন..."
                  value={customUrlInput}
                  onChange={(e) => setCustomUrlInput(e.target.value)}
                  className="flex-1 bg-black/40 border border-white/10 rounded-xl px-2.5 py-1.5 text-xs text-white placeholder-slate-500 focus:outline-none focus:border-rose-500"
                />
                <button
                  type="submit"
                  disabled={!customUrlInput.trim()}
                  className="px-3 py-1.5 bg-rose-600 hover:bg-rose-500 disabled:opacity-40 text-white text-xs font-semibold rounded-xl transition-colors"
                >
                  সেট
                </button>
              </form>
            </div>
          </div>

          {/* Adjustments: Dim Darkness & Blur */}
          <div className="p-4 rounded-2xl bg-white/[0.03] border border-white/10 space-y-4">
            <div className="flex items-center justify-between">
              <span className="text-xs font-bold text-slate-200 flex items-center gap-2">
                <Sliders className="w-3.5 h-3.5 text-rose-400" />
                <span>ডিসপ্লে ও পড়ার সুবিধা নিয়ন্ত্রণ</span>
              </span>
              <span className="text-[10px] text-slate-400">
                লেখা স্পষ্ট রাখতে অন্ধকার লেভেল বাড়ান
              </span>
            </div>

            {/* Dark Dim Slider */}
            <div className="space-y-1.5">
              <div className="flex items-center justify-between text-xs">
                <span className="text-slate-300">অন্ধকার লেভেল (ডিম ওভারলে)</span>
                <span className="font-bold text-rose-300">{currentDim}%</span>
              </div>
              <input
                type="range"
                min={20}
                max={85}
                step={5}
                value={currentDim}
                onChange={(e) =>
                  onUpdateSettings({ wallpaperDim: Number(e.target.value) })
                }
                className="w-full accent-rose-500 cursor-pointer h-1.5 bg-white/10 rounded-lg appearance-none"
              />
              <div className="flex justify-between text-[10px] text-slate-500">
                <span>হালকা (২০%)</span>
                <span>প্রস্তাবিত (৫০%)</span>
                <span>খুব গাঢ় (৮৫%)</span>
              </div>
            </div>

            {/* Blur Slider */}
            <div className="space-y-1.5 pt-2 border-t border-white/5">
              <div className="flex items-center justify-between text-xs">
                <span className="text-slate-300">ব্যাকগ্রাউন্ড সফট ব্লার</span>
                <span className="font-bold text-purple-300">{currentBlur}px</span>
              </div>
              <input
                type="range"
                min={0}
                max={10}
                step={1}
                value={currentBlur}
                onChange={(e) =>
                  onUpdateSettings({ wallpaperBlur: Number(e.target.value) })
                }
                className="w-full accent-purple-500 cursor-pointer h-1.5 bg-white/10 rounded-lg appearance-none"
              />
              <div className="flex justify-between text-[10px] text-slate-500">
                <span>স্পষ্ট (০px)</span>
                <span>মৃদু (২px)</span>
                <span>অধিক ব্লার (১০px)</span>
              </div>
            </div>
          </div>
        </div>

        {/* Footer */}
        <div className="p-4 border-t border-white/10 bg-[#0c0f1b] flex items-center justify-between shrink-0">
          <div className="text-xs text-slate-400">
            বর্তমানে সক্রিয়:{' '}
            <span className="text-rose-300 font-semibold">
              {currentWallpaperId === 'custom'
                ? 'কাস্টম ছবি'
                : activePreset?.bengaliName || 'ডিফল্ট'}
            </span>
          </div>

          <button
            type="button"
            onClick={onClose}
            className="px-5 py-2 rounded-xl bg-gradient-to-r from-rose-600 to-pink-600 hover:from-rose-500 hover:to-pink-500 text-white text-xs font-bold transition-all shadow-md active:scale-95"
          >
            সম্পন্ন
          </button>
        </div>
      </div>
    </div>
  );
};

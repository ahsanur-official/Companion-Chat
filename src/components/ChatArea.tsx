import React, { useEffect, useRef, useState } from 'react';
import { Volume2, VolumeX, Heart, User, Copy, Check, Sparkles, Maximize2, X, ThumbsUp, SmilePlus } from 'lucide-react';
import ReactMarkdown from 'react-markdown';
import { AppSettings, ChatMessage, Companion, QuickPrompt } from '../types';
import { WALLPAPER_PRESETS } from '../data/wallpapers';

const REACTION_OPTIONS = [
  { emoji: '❤️', label: 'ভালোবাসা (Heart)' },
  { emoji: '👍', label: 'পছন্দ (Thumbs Up)' },
  { emoji: '🥰', label: 'আদুরে (Sweet)' },
  { emoji: '😊', label: 'হাসি (Smile)' },
  { emoji: '✨', label: 'চমৎকার (Sparkles)' },
  { emoji: '🌸', label: 'সুন্দর (Flower)' },
  { emoji: '🥺', label: 'ইমোশনাল (Touched)' },
  { emoji: '👏', label: 'প্রশংসা (Clap)' },
];

interface ChatAreaProps {
  messages: ChatMessage[];
  currentCompanion: Companion;
  isLoading: boolean;
  onSendPrompt: (text: string) => void;
  quickPrompts?: QuickPrompt[];
  settings: AppSettings;
  onReactMessage?: (messageId: string, emoji: string) => void;
}

export const ChatArea: React.FC<ChatAreaProps> = ({
  messages,
  currentCompanion,
  isLoading,
  settings,
  onReactMessage,
}) => {
  const chatContainerRef = useRef<HTMLDivElement>(null);
  const scrollEndRef = useRef<HTMLDivElement>(null);
  const isUserScrolledUpRef = useRef<boolean>(false);
  const prevMessagesLengthRef = useRef<number>(messages.length);

  const [speakingMessageId, setSpeakingMessageId] = useState<string | null>(null);
  const [copiedMessageId, setCopiedMessageId] = useState<string | null>(null);
  const [fullPhotoUrl, setFullPhotoUrl] = useState<string | null>(null);
  const [activePickerMessageId, setActivePickerMessageId] = useState<string | null>(null);
  const [floatingReaction, setFloatingReaction] = useState<{ id: string; emoji: string } | null>(null);

  // Close reaction picker on outside click
  useEffect(() => {
    const handleClickOutside = (e: MouseEvent) => {
      if (activePickerMessageId && !(e.target as HTMLElement).closest('.reaction-picker-container')) {
        setActivePickerMessageId(null);
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, [activePickerMessageId]);

  const handleToggleReaction = (messageId: string, emoji: string) => {
    if (onReactMessage) {
      onReactMessage(messageId, emoji);
    }
    setFloatingReaction({ id: messageId, emoji });
    setTimeout(() => {
      setFloatingReaction((prev) => (prev?.id === messageId ? null : prev));
    }, 900);
    setActivePickerMessageId(null);
  };

  // User scroll listener: detect if user scrolled up to read earlier history
  const handleScroll = () => {
    if (!chatContainerRef.current) return;
    const { scrollTop, scrollHeight, clientHeight } = chatContainerRef.current;
    const distanceToBottom = scrollHeight - scrollTop - clientHeight;
    isUserScrolledUpRef.current = distanceToBottom > 150;
  };

  // Silky smooth, jitter-free auto scroll (avoids repeated conflicting smooth-scroll loops during streaming)
  useEffect(() => {
    if (!chatContainerRef.current) return;

    const isNewMessage = messages.length > prevMessagesLengthRef.current;
    prevMessagesLengthRef.current = messages.length;

    if (isUserScrolledUpRef.current && !isNewMessage) {
      return;
    }

    if (isNewMessage) {
      // Clean single smooth scroll when a new message bubble appears
      chatContainerRef.current.scrollTo({
        top: chatContainerRef.current.scrollHeight,
        behavior: 'smooth',
      });
    } else {
      // Direct scroll synchronized to refresh cycle (60/120fps) to eliminate jitter
      requestAnimationFrame(() => {
        if (chatContainerRef.current && !isUserScrolledUpRef.current) {
          chatContainerRef.current.scrollTop = chatContainerRef.current.scrollHeight;
        }
      });
    }
  }, [messages, isLoading]);

  // Speech synthesis with user speechRate
  const handleSpeak = (messageId: string, text: string) => {
    if (!('speechSynthesis' in window)) return;

    if (speakingMessageId === messageId) {
      window.speechSynthesis.cancel();
      setSpeakingMessageId(null);
      return;
    }

    window.speechSynthesis.cancel();
    const cleanText = text.replace(/[*_#`~]/g, '');
    const utterance = new SpeechSynthesisUtterance(cleanText);

    const voices = window.speechSynthesis.getVoices();
    const bengaliVoice = voices.find((v) => v.lang.includes('bn'));
    if (bengaliVoice) {
      utterance.voice = bengaliVoice;
    } else {
      utterance.pitch = currentCompanion.gender === 'female' ? 1.15 : 0.95;
    }

    utterance.rate = settings.speechRate || 1.0;

    utterance.onend = () => setSpeakingMessageId(null);
    utterance.onerror = () => setSpeakingMessageId(null);

    setSpeakingMessageId(messageId);
    window.speechSynthesis.speak(utterance);
  };

  const handleCopy = (messageId: string, text: string) => {
    navigator.clipboard.writeText(text);
    setCopiedMessageId(messageId);
    setTimeout(() => setCopiedMessageId(null), 2000);
  };

  // Text size classes based on settings ("text boro thakbe")
  const getTextSizeClasses = () => {
    switch (settings.fontSize) {
      case 'xlarge':
        return 'text-[18px] sm:text-[19px] leading-[1.8]';
      case 'large':
        return 'text-[16px] sm:text-[17px] leading-[1.75]';
      case 'normal':
      default:
        return 'text-[15px] sm:text-[16px] leading-[1.7]';
    }
  };

  // Filter out any placeholder messages without text/media yet
  const visibleMessages = messages.filter(
    (msg) => (msg.text && msg.text.trim().length > 0) || msg.image || msg.companionPhoto
  );

  // Check if companion has already started streaming text
  const isActivelyStreaming = messages.some(
    (msg) => msg.role === 'assistant' && msg.isStreaming && msg.text && msg.text.trim().length > 0
  );

  // Show visual typing indicator when isLoading is true and streamed content hasn't taken over
  const showTypingIndicator = isLoading && !isActivelyStreaming;

  // Active Wallpaper Resolution
  const wallpaperId = settings?.wallpaperId || 'default';
  const wallpaperDim = settings?.wallpaperDim ?? 50;
  const wallpaperBlur = settings?.wallpaperBlur ?? 2;

  const activePreset = WALLPAPER_PRESETS.find((p) => p.id === wallpaperId);
  const wallpaperImageUrl =
    wallpaperId === 'custom' && settings?.customWallpaperUrl
      ? settings.customWallpaperUrl
      : activePreset && activePreset.id !== 'default'
      ? activePreset.fullUrl
      : null;

  return (
    <div className="relative flex-1 flex flex-col min-h-0 overflow-hidden">
      {/* Dynamic Atmospheric Chat Wallpaper Layer */}
      {wallpaperImageUrl && (
        <div className="absolute inset-0 pointer-events-none z-0 overflow-hidden">
          <div
            className="absolute inset-0 bg-cover bg-center transition-all duration-500 scale-105"
            style={{
              backgroundImage: `url(${wallpaperImageUrl})`,
              filter: `blur(${wallpaperBlur}px)`,
            }}
          />
          <div
            className="absolute inset-0 bg-[#070913] transition-opacity duration-300"
            style={{ opacity: wallpaperDim / 100 }}
          />
        </div>
      )}

      {/* Scrollable Messages Container */}
      <div
        ref={chatContainerRef}
        onScroll={handleScroll}
        className="relative z-10 flex-1 overflow-y-auto overscroll-y-contain px-2.5 sm:px-6 lg:px-10 py-3 sm:py-5 min-h-0"
      >
        {/* Clean, Minimalist Companion Header - Only if no messages yet */}
      {messages.length === 0 ? (
        <div className="max-w-md mx-auto text-center py-6 px-4 rounded-2xl bg-white/[0.02] border border-white/5 space-y-2 my-auto">
          <div className="relative inline-block">
            <img
              src={currentCompanion.avatar}
              alt={currentCompanion.name}
              className="w-14 h-14 rounded-full object-cover ring-2 ring-rose-500/30 mx-auto shadow-md"
            />
            <span className="absolute bottom-0 right-0 w-3 h-3 bg-emerald-500 border-2 border-[#0b0e19] rounded-full" />
          </div>

          <div>
            <h3 className="text-base font-bold text-white tracking-wide">
              {settings?.language === 'bn' ? currentCompanion.bengaliName : currentCompanion.name}
            </h3>
            <p className="text-xs text-rose-300 font-medium">
              {settings?.language === 'bn' ? currentCompanion.roleTitleBengali : currentCompanion.roleTitle}
            </p>
          </div>

          <p className="text-xs text-slate-400 italic leading-relaxed px-4">
            "{currentCompanion.tagline}"
          </p>

          <div className="pt-1 inline-flex items-center justify-center gap-1.5 px-3 py-1 rounded-full bg-white/5 border border-white/5 text-[10px] text-slate-400">
            <Sparkles className="w-3 h-3 text-amber-400" />
            <span>
              {settings?.language === 'bn'
                ? '১০০% বেনামী ও নিরাপদ ব্যক্তিগত কথোপকথন'
                : '100% Anonymous & Secure Private Conversation'}
            </span>
          </div>
        </div>
      ) : (
        <div className="text-center my-1 select-none">
          <span className="inline-flex items-center gap-1.5 px-3 py-0.5 rounded-full bg-white/[0.03] border border-white/5 text-[10px] sm:text-[11px] text-slate-400 font-normal">
            <span className="w-1.5 h-1.5 rounded-full bg-emerald-400/80" />
            <span>
              {settings?.language === 'bn'
                ? `${currentCompanion.bengaliName}-এর সাথে নিরাপদ ও ব্যক্তিগত কথোপকথন`
                : `Secure & private conversation with ${currentCompanion.name}`}
            </span>
          </span>
        </div>
      )}

      {/* Messages Feed - Generously Enlarged on Desktop */}
      <div className="w-full max-w-7xl 2xl:max-w-[1600px] mx-auto space-y-3.5 sm:space-y-4">
        {visibleMessages.map((msg) => {
          const isUser = msg.role === 'user';
          const isSpeaking = speakingMessageId === msg.id;
          const isCopied = copiedMessageId === msg.id;

          return (
            <div
              key={msg.id}
              className={`flex items-start gap-2 sm:gap-3 ${
                isUser ? 'justify-end' : 'justify-start'
              }`}
            >
              {/* Assistant Avatar */}
              {!isUser && (
                <img
                  src={currentCompanion.avatar}
                  alt={currentCompanion.name}
                  className="w-7 h-7 sm:w-8 sm:h-8 rounded-full object-cover ring-1 ring-rose-500/30 shrink-0 mt-1 shadow-sm"
                />
              )}

              {/* Message Bubble */}
              <div
                className={`group relative max-w-[90%] sm:max-w-[82%] lg:max-w-[75%] xl:max-w-[70%] rounded-2xl p-3 sm:p-4 shadow-sm transition-colors ${
                  isUser
                    ? 'bg-gradient-to-r from-rose-600 to-pink-600 text-white rounded-tr-sm shadow-rose-950/20'
                    : 'bg-[#151928] border border-white/10 text-slate-100 rounded-tl-sm'
                }`}
              >
                {/* User Attached Image (if any) */}
                {msg.image && (
                  <div className="mb-3 rounded-xl overflow-hidden border border-white/10 bg-black/40">
                    <img
                      src={msg.image.previewUrl}
                      alt="User upload"
                      className="max-h-64 w-auto rounded-lg object-contain cursor-pointer"
                      onClick={() => setFullPhotoUrl(msg.image?.previewUrl || null)}
                    />
                  </div>
                )}

                {/* Sweet Realistic Romantic Photo Moment (Sent by Companion) */}
                {msg.companionPhoto && (
                  <div className="mb-3 rounded-2xl overflow-hidden border border-rose-500/30 bg-black/50 shadow-lg">
                    <div
                      className="relative cursor-pointer group/img overflow-hidden"
                      onClick={() => setFullPhotoUrl(msg.companionPhoto?.url || null)}
                    >
                      <img
                        src={msg.companionPhoto.url}
                        alt={msg.companionPhoto.momentTitle || 'বাস্তব মিষ্টি মুহূর্ত'}
                        referrerPolicy="no-referrer"
                        className="w-full max-h-80 sm:max-h-96 object-cover transition-transform duration-500 group-hover/img:scale-105"
                      />

                      {/* Realistic Moment Badge */}
                      <div className="absolute top-2.5 left-2.5 px-2.5 py-0.5 rounded-full bg-black/70 backdrop-blur-md border border-white/20 text-[10px] sm:text-[11px] text-rose-200 font-semibold flex items-center gap-1.5 shadow-md">
                        <Sparkles className="w-3 h-3 text-rose-400 animate-pulse" />
                        <span>
                          {msg.companionPhoto.badge ||
                            (settings?.language === 'bn' ? 'বাস্তব মুহূর্ত' : 'Realistic Moment')}
                        </span>
                      </div>

                      {/* Expand Button */}
                      <div className="absolute top-2.5 right-2.5 p-1.5 rounded-full bg-black/70 backdrop-blur-md text-white/90 hover:bg-black/90 transition-all shadow-md">
                        <Maximize2 className="w-3.5 h-3.5" />
                      </div>

                      {/* Gradient Caption Overlay */}
                      <div className="absolute inset-0 bg-gradient-to-t from-black/90 via-black/30 to-transparent flex items-end p-3.5 sm:p-4">
                        <div>
                          <span className="text-[11px] sm:text-xs font-bold text-rose-300 flex items-center gap-1.5">
                            <Heart className="w-3.5 h-3.5 fill-rose-400 text-rose-400" />
                            {msg.companionPhoto.momentTitle ||
                              (settings?.language === 'bn' ? 'মধুর মুহূর্ত' : 'Sweet Moment')}
                          </span>
                          <p className="text-xs sm:text-sm text-white/95 mt-1 leading-snug font-medium">
                            {msg.companionPhoto.caption}
                          </p>
                        </div>
                      </div>
                    </div>
                  </div>
                )}

                {/* Text Content with Large, Comfortable Typography */}
                <div
                  className={`break-words text-left ${getTextSizeClasses()} select-text tracking-wide [&_p]:mb-1.5 [&_p:last-child]:mb-0 [&_ul]:my-1 [&_ol]:my-1`}
                >
                  {msg.text && <ReactMarkdown>{msg.text}</ReactMarkdown>}
                </div>

                {/* Streaming Typing Cursor when streaming text */}
                {msg.isStreaming && msg.text && (
                  <span className="inline-block w-2 h-4 ml-1 bg-rose-400 animate-pulse align-middle rounded-sm" />
                )}

                {/* Floating Micro-Reaction Animation */}
                {floatingReaction?.id === msg.id && (
                  <div className="absolute -top-3 right-4 pointer-events-none z-30 animate-float-reaction text-2xl select-none filter drop-shadow-md">
                    {floatingReaction.emoji}
                  </div>
                )}

                {/* Active Appreciation Reaction Badges */}
                {msg.reactions && msg.reactions.length > 0 && (
                  <div className="flex flex-wrap items-center gap-1.5 mt-2.5 pt-2 border-t border-white/5">
                    {msg.reactions.map((emoji) => {
                      const preset = REACTION_OPTIONS.find((r) => r.emoji === emoji);
                      return (
                        <button
                          key={emoji}
                          type="button"
                          onClick={() => handleToggleReaction(msg.id, emoji)}
                          className="inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full bg-white/[0.07] hover:bg-white/[0.14] border border-white/10 hover:border-rose-400/40 text-xs text-slate-200 transition-all duration-150 hover:scale-105 active:scale-95 shadow-sm backdrop-blur-sm group/react cursor-pointer select-none"
                          title={`${preset?.label || emoji} (মুছে ফেলতে ক্লিক করুন)`}
                        >
                          <span className="text-sm leading-none transition-transform duration-150 group-hover/react:scale-125">{emoji}</span>
                          <span className="text-[11px] font-semibold text-slate-300 group-hover/react:text-white leading-none font-sans">১</span>
                        </button>
                      );
                    })}
                    {!isUser && (
                      <button
                        type="button"
                        onClick={() => setActivePickerMessageId(activePickerMessageId === msg.id ? null : msg.id)}
                        className="w-5 h-5 rounded-full inline-flex items-center justify-center bg-white/[0.04] hover:bg-white/[0.12] border border-white/10 text-white/50 hover:text-white transition-all text-xs cursor-pointer active:scale-90"
                        title={settings?.language === 'bn' ? 'প্রতিক্রিয়া যোগ করুন' : 'Add reaction'}
                      >
                        <SmilePlus className="w-3 h-3" />
                      </button>
                    )}
                  </div>
                )}

                {/* Footer Controls: Timestamp, Reaction Badges & Subtle Actions */}
                <div className="mt-2 pt-1 flex items-center justify-between gap-2 text-[11px] text-white/50 border-t border-white/5">
                  <div className="flex items-center gap-1.5 min-w-0">
                    <span className="text-[11px] text-slate-400/80 font-medium tabular-nums tracking-wide shrink-0">
                      {msg.timestamp}
                    </span>

                    {/* Emoji Reaction Trigger for AI Messages */}
                    {!isUser && (
                      <div className="relative reaction-picker-container flex items-center opacity-0 group-hover:opacity-100 transition-opacity">
                        <button
                          type="button"
                          onClick={() =>
                            setActivePickerMessageId(activePickerMessageId === msg.id ? null : msg.id)
                          }
                          className="w-5 h-5 rounded-full flex items-center justify-center text-slate-400 hover:text-rose-300 hover:bg-white/10 transition-all cursor-pointer"
                          title={settings?.language === 'bn' ? 'প্রতিক্রিয়া দিন' : 'React to message'}
                        >
                          <SmilePlus className="w-3 h-3" />
                        </button>

                        {/* Floating iOS / Telegram-style Reaction Palette */}
                        {activePickerMessageId === msg.id && (
                          <div className="absolute -top-11 left-0 z-40 flex items-center gap-1 px-2.5 py-1 rounded-full bg-[#0d1222]/95 border border-white/15 shadow-[0_12px_32px_rgba(0,0,0,0.65)] backdrop-blur-xl animate-in fade-in zoom-in-95 duration-150">
                            {REACTION_OPTIONS.map(({ emoji, label }) => {
                              const isSelected = msg.reactions?.includes(emoji);
                              return (
                                <button
                                  key={emoji}
                                  type="button"
                                  onClick={() => handleToggleReaction(msg.id, emoji)}
                                  className={`w-6 h-6 sm:w-7 sm:h-7 flex items-center justify-center rounded-full text-base transition-transform duration-150 hover:scale-125 active:scale-95 cursor-pointer ${
                                    isSelected
                                      ? 'bg-rose-500/25 ring-1 ring-rose-400/50 scale-110'
                                      : 'hover:bg-white/10'
                                  }`}
                                  title={label}
                                >
                                  {emoji}
                                </button>
                              );
                            })}
                          </div>
                        )}
                      </div>
                    )}
                  </div>

                  <div className="flex items-center gap-1 text-slate-400 opacity-0 group-hover:opacity-100 transition-opacity shrink-0">
                    {!isUser && (
                      <button
                        onClick={() => handleSpeak(msg.id, msg.text)}
                        className="w-5 h-5 rounded-full flex items-center justify-center hover:text-white hover:bg-white/10 transition-colors cursor-pointer"
                        title={
                          isSpeaking
                            ? (settings?.language === 'bn' ? 'থামুন' : 'Stop')
                            : (settings?.language === 'bn' ? 'কণ্ঠে শুনুন' : 'Listen with Voice')
                        }
                      >
                        {isSpeaking ? (
                          <VolumeX className="w-3 h-3 text-rose-300 animate-pulse" />
                        ) : (
                          <Volume2 className="w-3 h-3" />
                        )}
                      </button>
                    )}

                    <button
                      onClick={() => handleCopy(msg.id, msg.text)}
                      className="w-5 h-5 rounded-full flex items-center justify-center hover:text-white hover:bg-white/10 transition-colors cursor-pointer"
                      title={settings?.language === 'bn' ? 'কপি করুন' : 'Copy'}
                    >
                      {isCopied ? (
                        <Check className="w-3 h-3 text-emerald-300" />
                      ) : (
                        <Copy className="w-3 h-3" />
                      )}
                    </button>
                  </div>
                </div>
              </div>

              {/* User Avatar */}
              {isUser && (
                <div className="w-8 h-8 sm:w-9 sm:h-9 rounded-full bg-slate-700 border border-white/10 flex items-center justify-center shrink-0 mt-1 text-white shadow-sm">
                  <User className="w-4 h-4 text-slate-300" />
                </div>
              )}
            </div>
          );
        })}

        {/* Clean, Minimal In-Stream Typing Bubble */}
        {showTypingIndicator && (
          <div className="flex items-center gap-2.5 justify-start py-1">
            <div className="relative shrink-0">
              <img
                src={currentCompanion.avatar}
                alt={currentCompanion.name}
                className="w-7 h-7 sm:w-8 sm:h-8 rounded-full object-cover ring-1 ring-rose-500/40"
              />
              <span className="absolute -bottom-0.5 -right-0.5 w-2 h-2 bg-emerald-400 border border-[#0b0e18] rounded-full" />
            </div>

            <div className="bg-[#151928] border border-white/10 rounded-2xl rounded-tl-none px-3.5 py-2 flex items-center gap-2.5 shadow-sm">
              <div className="flex items-center gap-1">
                <span className="w-1.5 h-1.5 rounded-full bg-rose-400 animate-bounce [animation-delay:-0.32s]" />
                <span className="w-1.5 h-1.5 rounded-full bg-rose-400/80 animate-bounce [animation-delay:-0.16s]" />
                <span className="w-1.5 h-1.5 rounded-full bg-rose-400/60 animate-bounce" />
              </div>
              <span className="text-xs text-slate-300 font-medium whitespace-nowrap">
                {settings?.language === 'bn'
                  ? `${currentCompanion.bengaliName} লিখছে...`
                  : `${currentCompanion.name} is typing...`}
              </span>
            </div>
          </div>
        )}

        <div ref={scrollEndRef} />
      </div>
      </div>

      {/* Full Photo Modal */}
      {fullPhotoUrl && (
        <div
          className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/92 backdrop-blur-md"
          onClick={() => setFullPhotoUrl(null)}
        >
          <div
            className="relative max-w-3xl max-h-[90vh] flex flex-col items-center"
            onClick={(e) => e.stopPropagation()}
          >
            <img
              src={fullPhotoUrl}
              alt="Full view"
              referrerPolicy="no-referrer"
              className="max-h-[80vh] w-auto rounded-2xl object-contain border border-white/20 shadow-2xl"
            />
            <div className="mt-3 flex items-center gap-3">
              <a
                href={fullPhotoUrl}
                target="_blank"
                rel="noreferrer"
                download="romantic-moment.jpg"
                className="px-4 py-2 rounded-xl bg-white/10 hover:bg-white/20 text-white text-xs font-semibold flex items-center gap-2 border border-white/20 transition-colors shadow-lg"
              >
                <span>{settings?.language === 'bn' ? 'ছবিটি ডাউনলোড করুন' : 'Download Photo'}</span>
              </a>
              <button
                onClick={() => setFullPhotoUrl(null)}
                className="px-4 py-2 rounded-xl bg-rose-600 hover:bg-rose-500 text-white text-xs font-semibold transition-colors shadow-lg"
              >
                {settings?.language === 'bn' ? 'বন্ধ করুন' : 'Close'}
              </button>
            </div>
            <button
              onClick={() => setFullPhotoUrl(null)}
              className="absolute top-3 right-3 p-2 rounded-full bg-black/70 text-white hover:bg-black/90 transition-colors border border-white/20"
              title="বন্ধ করুন"
            >
              <X className="w-5 h-5" />
            </button>
          </div>
        </div>
      )}
    </div>
  );
};

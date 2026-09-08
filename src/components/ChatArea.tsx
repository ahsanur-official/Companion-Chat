import React, { useEffect, useRef, useState } from 'react';
import { Volume2, VolumeX, Heart, Sparkles, User, AlertCircle, Copy, Check, MessageSquareHeart } from 'lucide-react';
import ReactMarkdown from 'react-markdown';
import { ChatMessage, Companion, QuickPrompt } from '../types';

interface ChatAreaProps {
  messages: ChatMessage[];
  currentCompanion: Companion;
  isLoading: boolean;
  onSendPrompt: (text: string) => void;
  quickPrompts: QuickPrompt[];
}

export const ChatArea: React.FC<ChatAreaProps> = ({
  messages,
  currentCompanion,
  isLoading,
  onSendPrompt,
  quickPrompts,
}) => {
  const scrollEndRef = useRef<HTMLDivElement>(null);
  const [speakingMessageId, setSpeakingMessageId] = useState<string | null>(null);
  const [copiedMessageId, setCopiedMessageId] = useState<string | null>(null);

  // Auto scroll to bottom
  useEffect(() => {
    scrollEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages, isLoading]);

  // Speech synthesis
  const handleSpeak = (messageId: string, text: string) => {
    if (!('speechSynthesis' in window)) {
      return;
    }

    if (speakingMessageId === messageId) {
      window.speechSynthesis.cancel();
      setSpeakingMessageId(null);
      return;
    }

    window.speechSynthesis.cancel();
    const cleanText = text.replace(/[*_#`~]/g, '');
    const utterance = new SpeechSynthesisUtterance(cleanText);

    // Pick voice if available
    const voices = window.speechSynthesis.getVoices();
    // Try to find matching gender voice or Bengali voice
    const bengaliVoice = voices.find((v) => v.lang.includes('bn'));
    if (bengaliVoice) {
      utterance.voice = bengaliVoice;
    } else {
      utterance.rate = 0.95;
      utterance.pitch = currentCompanion.gender === 'female' ? 1.15 : 0.9;
    }

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

  return (
    <div className="flex-1 overflow-y-auto p-3 sm:p-6 space-y-4 sm:space-y-6">
      {/* Intro Banner for Companion */}
      <div className="max-w-2xl mx-auto text-center py-4 px-3 rounded-2xl bg-gradient-to-b from-white/5 to-transparent border border-white/5">
        <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-rose-500/10 border border-rose-500/20 text-rose-300 text-xs font-medium mb-2">
          <Heart className="w-3.5 h-3.5 fill-rose-400 text-rose-400" />
          <span>{currentCompanion.roleTitleBengali}</span>
        </div>
        <h3 className="text-base sm:text-lg font-bold text-white">
          {currentCompanion.bengaliName} ({currentCompanion.name}) এর সাথে চ্যাট
        </h3>
        <p className="text-xs text-slate-400 max-w-md mx-auto mt-1 italic">
          "{currentCompanion.tagline}"
        </p>
      </div>

      {/* Message List */}
      <div className="max-w-3xl mx-auto space-y-4">
        {messages.map((msg) => {
          const isUser = msg.role === 'user';
          const isSpeaking = speakingMessageId === msg.id;
          const isCopied = copiedMessageId === msg.id;

          return (
            <div
              key={msg.id}
              className={`flex items-start gap-2.5 sm:gap-3.5 ${
                isUser ? 'justify-end' : 'justify-start'
              }`}
            >
              {/* Companion Avatar for Assistant */}
              {!isUser && (
                <img
                  src={currentCompanion.avatar}
                  alt={currentCompanion.name}
                  className="w-8 h-8 sm:w-9 sm:h-9 rounded-full object-cover ring-2 ring-rose-500/40 shrink-0 mt-0.5"
                />
              )}

              <div
                className={`group relative max-w-[85%] sm:max-w-[78%] rounded-2xl p-3 sm:p-4 text-xs sm:text-sm leading-relaxed ${
                  isUser
                    ? 'bg-gradient-to-br from-rose-600 via-rose-700 to-pink-700 text-white rounded-tr-none shadow-md shadow-rose-900/20'
                    : 'bg-[#151928] border border-white/10 text-slate-100 rounded-tl-none shadow-sm'
                }`}
              >
                {/* Attached Image if any */}
                {msg.image && (
                  <div className="mb-2.5 rounded-xl overflow-hidden border border-white/10 bg-black/40">
                    <img
                      src={msg.image.previewUrl}
                      alt="Uploaded"
                      className="max-h-60 w-auto rounded-lg object-contain"
                    />
                  </div>
                )}

                {/* Text Content */}
                <div className="break-words space-y-1">
                  <ReactMarkdown>{msg.text}</ReactMarkdown>
                </div>

                {/* Streaming Indicator */}
                {msg.isStreaming && (
                  <span className="inline-block w-2 h-4 ml-1 bg-rose-400 animate-pulse align-middle" />
                )}

                {/* Footer Controls & Timestamp */}
                <div className="mt-2 pt-1 flex items-center justify-between gap-3 text-[10px] text-white/60 border-t border-white/5">
                  <span>{msg.timestamp}</span>

                  <div className="flex items-center gap-1.5 opacity-80 group-hover:opacity-100 transition-opacity">
                    {!isUser && (
                      <button
                        onClick={() => handleSpeak(msg.id, msg.text)}
                        className="p-1 hover:text-white rounded hover:bg-white/10 transition-colors"
                        title={isSpeaking ? 'বন্ধ করুন' : 'কণ্ঠে শুনুন (Voice read aloud)'}
                      >
                        {isSpeaking ? (
                          <VolumeX className="w-3.5 h-3.5 text-rose-300" />
                        ) : (
                          <Volume2 className="w-3.5 h-3.5" />
                        )}
                      </button>
                    )}

                    <button
                      onClick={() => handleCopy(msg.id, msg.text)}
                      className="p-1 hover:text-white rounded hover:bg-white/10 transition-colors"
                      title="কপি করুন"
                    >
                      {isCopied ? (
                        <Check className="w-3.5 h-3.5 text-emerald-300" />
                      ) : (
                        <Copy className="w-3.5 h-3.5" />
                      )}
                    </button>
                  </div>
                </div>
              </div>

              {/* User Avatar */}
              {isUser && (
                <div className="w-8 h-8 sm:w-9 sm:h-9 rounded-full bg-slate-700/80 border border-white/10 flex items-center justify-center shrink-0 mt-0.5 text-white text-xs font-semibold">
                  <User className="w-4 h-4 text-slate-300" />
                </div>
              )}
            </div>
          );
        })}

        {/* Loading / Typing Indicator */}
        {isLoading && !messages.some((m) => m.isStreaming) && (
          <div className="flex items-start gap-3 justify-start">
            <img
              src={currentCompanion.avatar}
              alt={currentCompanion.name}
              className="w-8 h-8 rounded-full object-cover ring-2 ring-rose-500/40 shrink-0"
            />
            <div className="bg-[#151928] border border-white/10 rounded-2xl rounded-tl-none px-4 py-3 text-slate-400 text-xs flex items-center gap-2">
              <span className="w-2 h-2 rounded-full bg-rose-400 animate-bounce" />
              <span className="w-2 h-2 rounded-full bg-rose-400 animate-bounce [animation-delay:0.2s]" />
              <span className="w-2 h-2 rounded-full bg-rose-400 animate-bounce [animation-delay:0.4s]" />
              <span className="text-rose-300 ml-1.5">{currentCompanion.bengaliName} ভাবছে ও টাইপ করছে...</span>
            </div>
          </div>
        )}

        <div ref={scrollEndRef} />
      </div>

      {/* Quick Prompts Helper */}
      {messages.length <= 3 && (
        <div className="max-w-2xl mx-auto pt-2">
          <div className="flex items-center gap-1.5 text-xs text-slate-400 mb-2">
            <MessageSquareHeart className="w-3.5 h-3.5 text-rose-400" />
            <span>মনের কথা সহজে বলতে ট্যাপ করুন:</span>
          </div>
          <div className="flex flex-wrap gap-2">
            {quickPrompts.map((item) => (
              <button
                key={item.id}
                onClick={() => onSendPrompt(item.bengali)}
                className="px-3 py-1.5 rounded-full bg-white/5 hover:bg-rose-500/15 border border-white/10 hover:border-rose-500/40 text-slate-300 hover:text-white text-xs transition-all text-left"
              >
                {item.bengali}
              </button>
            ))}
          </div>
        </div>
      )}
    </div>
  );
};

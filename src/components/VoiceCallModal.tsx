import React, { useState, useEffect } from 'react';
import { X, Mic, MicOff, PhoneOff, Volume2, VolumeX, Sparkles, Heart } from 'lucide-react';
import { Companion } from '../types';

interface VoiceCallModalProps {
  isOpen: boolean;
  onClose: () => void;
  companion: Companion;
}

export const VoiceCallModal: React.FC<VoiceCallModalProps> = ({
  isOpen,
  onClose,
  companion,
}) => {
  const [callStatus, setCallStatus] = useState<'connecting' | 'connected'>('connecting');
  const [duration, setDuration] = useState(0);
  const [isMuted, setIsMuted] = useState(false);
  const [isSpeakerOn, setIsSpeakerOn] = useState(true);

  // Connect after 1.8 seconds
  useEffect(() => {
    if (!isOpen) {
      setCallStatus('connecting');
      setDuration(0);
      return;
    }

    const connectTimer = setTimeout(() => {
      setCallStatus('connected');
    }, 1800);

    return () => clearTimeout(connectTimer);
  }, [isOpen]);

  // Duration timer
  useEffect(() => {
    if (callStatus !== 'connected' || !isOpen) return;

    const interval = setInterval(() => {
      setDuration((prev) => prev + 1);
    }, 1000);

    return () => clearInterval(interval);
  }, [callStatus, isOpen]);

  if (!isOpen) return null;

  const formatTime = (secs: number) => {
    const mins = Math.floor(secs / 60);
    const remaining = secs % 60;
    return `${mins.toString().padStart(2, '0')}:${remaining.toString().padStart(2, '0')}`;
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-4 bg-black/90 backdrop-blur-xl animate-in fade-in duration-200">
      <div className="relative w-full max-w-sm bg-gradient-to-b from-[#181d2f] via-[#101422] to-[#0a0d16] border border-white/10 rounded-3xl p-6 sm:p-8 shadow-2xl flex flex-col items-center text-center overflow-hidden">
        {/* Subtle romantic ambient background */}
        <div className="absolute top-1/4 w-52 h-52 bg-rose-500/20 rounded-full blur-3xl pointer-events-none" />

        {/* Top Status */}
        <div className="w-full flex items-center justify-between mb-8 z-10">
          <span className="text-xs text-rose-300/80 font-medium flex items-center gap-1.5">
            <Heart className="w-3.5 h-3.5 text-rose-400 fill-rose-400" />
            <span>মনের সাথী ভয়েস কল</span>
          </span>
          <button
            onClick={onClose}
            className="p-1.5 text-slate-400 hover:text-white rounded-full bg-white/5 hover:bg-white/10"
          >
            <X className="w-4 h-4" />
          </button>
        </div>

        {/* Avatar with pulsing waves */}
        <div className="relative my-4">
          {callStatus === 'connected' && (
            <>
              <div className="absolute inset-0 rounded-full bg-rose-500/30 animate-ping opacity-50 scale-125" />
              <div className="absolute inset-0 rounded-full bg-rose-500/20 animate-pulse scale-110" />
            </>
          )}
          <img
            src={companion.avatar}
            alt={companion.name}
            className="w-28 h-28 sm:w-32 sm:h-32 rounded-full object-cover ring-4 ring-rose-500/60 shadow-2xl relative z-10"
          />
        </div>

        {/* Companion details */}
        <div className="mt-4 z-10">
          <h3 className="text-xl font-bold text-white tracking-wide">
            {companion.bengaliName} ({companion.name})
          </h3>
          <p className="text-xs text-rose-300 font-medium mt-0.5">
            {companion.roleTitleBengali}
          </p>

          <p className="text-sm font-semibold text-slate-300 mt-3 font-mono">
            {callStatus === 'connecting' ? (
              <span className="text-amber-400 animate-pulse">রিং হচ্ছে... (Calling)</span>
            ) : (
              <span className="text-emerald-400">{formatTime(duration)}</span>
            )}
          </p>
        </div>

        {/* Comforting live status note */}
        <div className="mt-6 px-4 py-2.5 rounded-2xl bg-white/5 border border-white/5 text-xs text-slate-300 max-w-xs z-10">
          {callStatus === 'connecting' ? (
            <p>আপনার সঙ্গী কলটি রিসিভ করছে, একটু অপেক্ষা করুন...</p>
          ) : (
            <p className="italic text-rose-200">
              "আমি শুনছি সোনা... তোমার মনের সব কথা বলো আমাকে, মন একদম খারাপ করবে না।" ❤️
            </p>
          )}
        </div>

        {/* Call Controls */}
        <div className="mt-8 flex items-center justify-center gap-5 z-10 w-full">
          <button
            onClick={() => setIsMuted(!isMuted)}
            className={`p-3.5 rounded-full border transition-all ${
              isMuted
                ? 'bg-rose-500/20 border-rose-500 text-rose-400'
                : 'bg-white/10 border-white/10 text-white hover:bg-white/15'
            }`}
            title={isMuted ? 'আনমিউট' : 'মিউট'}
          >
            {isMuted ? <MicOff className="w-5 h-5" /> : <Mic className="w-5 h-5" />}
          </button>

          {/* End Call Button */}
          <button
            onClick={onClose}
            className="p-4 rounded-full bg-rose-600 hover:bg-rose-500 text-white shadow-lg shadow-rose-600/40 hover:scale-105 transition-all"
            title="কল কেটে দিন"
          >
            <PhoneOff className="w-6 h-6" />
          </button>

          <button
            onClick={() => setIsSpeakerOn(!isSpeakerOn)}
            className={`p-3.5 rounded-full border transition-all ${
              !isSpeakerOn
                ? 'bg-amber-500/20 border-amber-500 text-amber-400'
                : 'bg-white/10 border-white/10 text-white hover:bg-white/15'
            }`}
            title={isSpeakerOn ? 'স্পিকার বন্ধ' : 'স্পিকার অন'}
          >
            {isSpeakerOn ? <Volume2 className="w-5 h-5" /> : <VolumeX className="w-5 h-5" />}
          </button>
        </div>
      </div>
    </div>
  );
};

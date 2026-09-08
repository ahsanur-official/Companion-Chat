/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState, useEffect } from 'react';
import { Navbar } from './components/Navbar';
import { LeftSidebar } from './components/LeftSidebar';
import { ChatArea } from './components/ChatArea';
import { ChatInput } from './components/ChatInput';
import { CompanionSelectorModal } from './components/CompanionSelectorModal';
import { CartoonOnboardingModal } from './components/CartoonOnboardingModal';
import { AuthModal } from './components/AuthModal';
import { PremiumModal } from './components/PremiumModal';
import { VoiceCallModal } from './components/VoiceCallModal';
import { LonelynessCareModal } from './components/LonelynessCareModal';
import { COMPANIONS, QUICK_PROMPTS } from './data/companions';
import {
  Companion,
  ChatMessage,
  UserAccount,
  UserGender,
  ChatSession,
  UserMood,
  RelationshipType,
} from './types';
import { Heart, Sparkles, PhoneCall, Wind, Menu } from 'lucide-react';

const STORAGE_USER_KEY = 'moner_sathi_user_v2';
const STORAGE_COMPANION_KEY = 'moner_sathi_active_companion_v2';
const STORAGE_SESSIONS_KEY = 'moner_sathi_sessions_v2';
const STORAGE_ACTIVE_SESSION_KEY = 'moner_sathi_active_session_id_v2';

export default function App() {
  // 1. User state
  const [user, setUser] = useState<UserAccount>(() => {
    const saved = localStorage.getItem(STORAGE_USER_KEY);
    if (saved) {
      try {
        const parsed = JSON.parse(saved);
        if (parsed.name && /ahsanur|আহসানুর/i.test(parsed.name)) {
          parsed.name = '';
        }
        if (parsed.email && /ahsanur/i.test(parsed.email)) {
          parsed.email = '';
        }
        return parsed;
      } catch (e) {
        // fallback
      }
    }
    return {
      id: 'guest-' + Math.random().toString(36).substring(2, 9),
      name: '',
      email: '',
      gender: 'male', // default male -> AI is female
      isLoggedIn: false,
      isPremium: false,
      photoCredits: 3,
      onboardingCompleted: false, // will trigger cartoon modal on first visit
      currentMood: 'lonely',
    };
  });

  // 2. Active Companion state
  const [currentCompanion, setCurrentCompanion] = useState<Companion>(() => {
    const savedId = localStorage.getItem(STORAGE_COMPANION_KEY);
    if (savedId) {
      const found = COMPANIONS.find((c) => c.id === savedId);
      if (found) return found;
    }
    return COMPANIONS[0]; // Ananya
  });

  // 3. Chat Sessions list & Active Session
  const [sessions, setSessions] = useState<ChatSession[]>(() => {
    const saved = localStorage.getItem(STORAGE_SESSIONS_KEY);
    if (saved) {
      try {
        const parsed = JSON.parse(saved);
        if (Array.isArray(parsed) && parsed.length > 0) return parsed;
      } catch (e) {
        // fallback
      }
    }
    const initialSession: ChatSession = {
      id: 'session-init-' + Date.now(),
      companionId: currentCompanion.id,
      title: 'মনের প্রথম কথা 💖',
      preview: currentCompanion.initialMessage.slice(0, 40) + '...',
      updatedAt: 'এখন',
      messages: [
        {
          id: 'msg-init',
          role: 'assistant',
          text: currentCompanion.initialMessage,
          timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
        },
      ],
    };
    return [initialSession];
  });

  const [activeSessionId, setActiveSessionId] = useState<string>(() => {
    const savedId = localStorage.getItem(STORAGE_ACTIVE_SESSION_KEY);
    if (savedId && sessions.some((s) => s.id === savedId)) {
      return savedId;
    }
    return sessions[0]?.id || 'session-init';
  });

  // Current active messages
  const activeSession = sessions.find((s) => s.id === activeSessionId) || sessions[0];
  const messages = activeSession ? activeSession.messages : [];

  const setMessages = (
    updater: ChatMessage[] | ((prev: ChatMessage[]) => ChatMessage[])
  ) => {
    setSessions((prevSessions) => {
      return prevSessions.map((session) => {
        if (session.id === activeSessionId) {
          const newMessages =
            typeof updater === 'function' ? updater(session.messages) : updater;
          const lastMsg = newMessages[newMessages.length - 1];
          const previewText = lastMsg ? lastMsg.text.slice(0, 40) : session.preview;
          return {
            ...session,
            messages: newMessages,
            preview: previewText || 'কথোপকথন চলছে...',
            updatedAt: new Date().toLocaleTimeString([], {
              hour: '2-digit',
              minute: '2-digit',
            }),
          };
        }
        return session;
      });
    });
  };

  const [isLoading, setIsLoading] = useState(false);

  // Modals & Sliders
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);
  const [isCartoonModalOpen, setIsCartoonModalOpen] = useState(!user.onboardingCompleted);
  const [isCompanionModalOpen, setIsCompanionModalOpen] = useState(false);
  const [isAuthModalOpen, setIsAuthModalOpen] = useState(false);
  const [authTriggerReason, setAuthTriggerReason] = useState<'photo_upload' | 'premium_feature' | 'general'>('general');
  const [isPremiumModalOpen, setIsPremiumModalOpen] = useState(false);
  const [isCallModalOpen, setIsCallModalOpen] = useState(false);
  const [isCareModalOpen, setIsCareModalOpen] = useState(false);

  // Persist user
  useEffect(() => {
    localStorage.setItem(STORAGE_USER_KEY, JSON.stringify(user));
  }, [user]);

  // Persist companion
  useEffect(() => {
    localStorage.setItem(STORAGE_COMPANION_KEY, currentCompanion.id);
  }, [currentCompanion]);

  // Persist sessions
  useEffect(() => {
    localStorage.setItem(STORAGE_SESSIONS_KEY, JSON.stringify(sessions));
  }, [sessions]);

  // Persist active session id
  useEffect(() => {
    localStorage.setItem(STORAGE_ACTIVE_SESSION_KEY, activeSessionId);
  }, [activeSessionId]);

  // Handle Complete Onboarding from Cartoon Modal
  const handleCompleteOnboarding = (
    gender: UserGender,
    name: string,
    relationType: RelationshipType,
    companion: Companion
  ) => {
    const updatedUser: UserAccount = {
      ...user,
      gender,
      name,
      onboardingCompleted: true,
    };
    setUser(updatedUser);
    setCurrentCompanion(companion);
    setIsCartoonModalOpen(false);

    // Create a new session with welcoming personalized message
    const welcomeText =
      gender === 'male'
        ? `হ্যালো! আমি তোমার ${companion.bengaliName}। তুমি আমার সাথে যুক্ত হয়েছ জেনে আমার মনটা আনন্দে ভরে গেছে। বলো, আজ তোমার দিন কেমন কাটল? ❤️`
        : `হ্যালো! আমি তোমার ${companion.bengaliName}। তোমার পাশে থাকতে পেরে খুব ভালো লাগছে। মন কেমন আছে আজ তোমার? 💙`;

    const newSession: ChatSession = {
      id: 'session-' + Date.now(),
      companionId: companion.id,
      title: `${companion.bengaliName}-এর সাথে চ্যাট`,
      preview: welcomeText.slice(0, 40) + '...',
      updatedAt: 'এখন',
      messages: [
        {
          id: 'msg-init-' + Date.now(),
          role: 'assistant',
          text: welcomeText,
          timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
        },
      ],
    };

    setSessions((prev) => [newSession, ...prev]);
    setActiveSessionId(newSession.id);
  };

  // Create a brand new chat session (+ New Chat)
  const handleNewChat = () => {
    const newSessionId = 'session-' + Date.now();
    const newSession: ChatSession = {
      id: newSessionId,
      companionId: currentCompanion.id,
      title: `${currentCompanion.bengaliName}-এর সাথে নতুন আলাপ ✨`,
      preview: currentCompanion.initialMessage.slice(0, 40) + '...',
      updatedAt: 'এখন',
      messages: [
        {
          id: 'msg-init-' + Date.now(),
          role: 'assistant',
          text: currentCompanion.initialMessage,
          timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
        },
      ],
    };

    setSessions((prev) => [newSession, ...prev]);
    setActiveSessionId(newSessionId);
  };

  // Delete a chat session
  const handleDeleteSession = (sessionId: string, e: React.MouseEvent) => {
    e.stopPropagation();
    if (sessions.length <= 1) {
      handleNewChat();
      return;
    }

    const filtered = sessions.filter((s) => s.id !== sessionId);
    setSessions(filtered);
    if (activeSessionId === sessionId) {
      setActiveSessionId(filtered[0].id);
    }
  };

  // Select an existing session
  const handleSelectSession = (sessionId: string) => {
    setActiveSessionId(sessionId);
    const targetSession = sessions.find((s) => s.id === sessionId);
    if (targetSession) {
      const matchComp = COMPANIONS.find((c) => c.id === targetSession.companionId);
      if (matchComp) {
        setCurrentCompanion(matchComp);
      }
    }
  };

  // If user changes gender from quick toggle
  const handleToggleUserGender = (gender: UserGender) => {
    setUser((prev) => ({ ...prev, gender }));
    const targetComp = COMPANIONS.find((c) => c.targetUserGender === gender) || COMPANIONS[0];
    switchCompanion(targetComp, gender);
  };

  // Switch companion
  const switchCompanion = (comp: Companion, targetGender: UserGender) => {
    setCurrentCompanion(comp);
    setUser((prev) => ({ ...prev, gender: targetGender }));

    // Start or attach to a session with this companion
    const existing = sessions.find((s) => s.companionId === comp.id);
    if (existing) {
      setActiveSessionId(existing.id);
    } else {
      const newSession: ChatSession = {
        id: 'session-' + Date.now(),
        companionId: comp.id,
        title: `${comp.bengaliName}-এর সাথে আলাপ 💕`,
        preview: comp.initialMessage.slice(0, 40) + '...',
        updatedAt: 'এখন',
        messages: [
          {
            id: 'msg-init-' + Date.now(),
            role: 'assistant',
            text: comp.initialMessage,
            timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
          },
        ],
      };
      setSessions((prev) => [newSession, ...prev]);
      setActiveSessionId(newSession.id);
    }
  };

  // Login handler
  const handleLogin = (userData: Partial<UserAccount>) => {
    setUser((prev) => ({
      ...prev,
      ...userData,
      isLoggedIn: true,
    }));
  };

  const handleLogout = () => {
    setUser((prev) => ({
      ...prev,
      name: '',
      email: '',
      isLoggedIn: false,
      isPremium: false,
    }));
  };

  // Upgrade to Premium
  const handleUpgradePremium = (planName: string) => {
    setUser((prev) => ({
      ...prev,
      isPremium: true,
      planName,
    }));
  };

  // Require Login prompt trigger
  const handleRequireLogin = (reason: 'photo_upload' | 'premium_feature' | 'general') => {
    setAuthTriggerReason(reason);
    setIsAuthModalOpen(true);
  };

  // Mood selection handler
  const handleSelectMood = (mood: UserMood, promptText: string) => {
    setUser((prev) => ({ ...prev, currentMood: mood }));
    handleSendMessage(promptText);
  };

  // Send message
  const handleSendMessage = async (
    text: string,
    imageAttachment?: { mimeType: string; data: string; previewUrl: string }
  ) => {
    if ((!text && !imageAttachment) || isLoading) return;

    const userMessageId = 'msg-' + Date.now();
    const timestamp = new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });

    const newUserMessage: ChatMessage = {
      id: userMessageId,
      role: 'user',
      text: text || (imageAttachment ? '📸 [ছবি পাঠানো হয়েছে]' : ''),
      timestamp,
      image: imageAttachment,
    };

    const assistantMessageId = 'msg-ai-' + (Date.now() + 1);
    const initialAiMessage: ChatMessage = {
      id: assistantMessageId,
      role: 'assistant',
      text: '',
      timestamp,
      isStreaming: true,
    };

    const updatedMessages = [...messages, newUserMessage, initialAiMessage];
    setMessages(updatedMessages);

    // Auto update session title if it's currently a default title
    if (activeSession && (activeSession.title.includes('মনের প্রথম কথা') || activeSession.title.includes('নতুন আলাপ'))) {
      const newTitle = text ? text.slice(0, 24) + (text.length > 24 ? '...' : '') : 'ছবি শেয়ারিং চ্যাট 📸';
      setSessions((prev) =>
        prev.map((s) => (s.id === activeSessionId ? { ...s, title: newTitle } : s))
      );
    }

    setIsLoading(true);

    try {
      // Stream response from server with fast Gemini 3.8 Flash
      const response = await fetch('/api/chat', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          messages: updatedMessages.slice(0, -1), // send history up to user message
          userGender: user.gender,
          relationshipType: currentCompanion.relationshipType,
          companionName: currentCompanion.name,
          userName: user.name || '',
          currentMood: user.currentMood || 'neutral',
          isPremium: user.isPremium,
          imageData: imageAttachment
            ? { mimeType: imageAttachment.mimeType, data: imageAttachment.data }
            : undefined,
        }),
      });

      if (!response.ok) {
        throw new Error('সার্ভারের সাথে সংযোগ বিচ্ছিন্ন হয়েছে। অনুগ্রহ করে আবার চেষ্টা করুন।');
      }

      const reader = response.body?.getReader();
      if (!reader) throw new Error('No readable stream');

      const decoder = new TextDecoder('utf-8');
      let streamedReply = '';

      while (true) {
        const { value, done } = await reader.read();
        if (done) break;

        const rawText = decoder.decode(value, { stream: true });
        const lines = rawText.split('\n');

        for (const line of lines) {
          if (line.startsWith('data: ')) {
            const dataStr = line.slice(6).trim();
            if (!dataStr) continue;

            try {
              const data = JSON.parse(dataStr);
              if (data.chunk) {
                streamedReply += data.chunk;
                setMessages((prev) =>
                  prev.map((m) =>
                    m.id === assistantMessageId
                      ? { ...m, text: streamedReply, isStreaming: true }
                      : m
                  )
                );
              }
              if (data.done) {
                setMessages((prev) =>
                  prev.map((m) =>
                    m.id === assistantMessageId
                      ? { ...m, text: data.fullReply || streamedReply, isStreaming: false }
                      : m
                  )
                );
              }
            } catch (e) {
              // Ignore partial JSON parse errors
            }
          }
        }
      }

      setMessages((prev) =>
        prev.map((m) =>
          m.id === assistantMessageId ? { ...m, isStreaming: false } : m
        )
      );
    } catch (error: any) {
      console.error('Chat failed:', error);
      const contextualFailover = `${currentCompanion.bengaliName}: প্রিয়, তোমার কথাটি আরেকবার বলবে কি? আমি গভীর মনোযোগ দিয়ে শুনছি। ❤️`;
      setMessages((prev) =>
        prev.map((m) =>
          m.id === assistantMessageId
            ? {
                ...m,
                text: m.text || contextualFailover,
                isStreaming: false,
                error: true,
              }
            : m
        )
      );
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="flex flex-col h-screen bg-[#0d0f17] text-white overflow-hidden selection:bg-rose-500 selection:text-white">
      {/* Top Navigation */}
      <Navbar
        currentCompanion={currentCompanion}
        user={user}
        onOpenSidebar={() => setIsSidebarOpen(true)}
        onOpenCompanionModal={() => setIsCompanionModalOpen(true)}
        onOpenCartoonModal={() => setIsCartoonModalOpen(true)}
        onOpenAuthModal={() => {
          setAuthTriggerReason('general');
          setIsAuthModalOpen(true);
        }}
        onOpenPremiumModal={() => setIsPremiumModalOpen(true)}
        onOpenCallModal={() => setIsCallModalOpen(true)}
        onNewChat={handleNewChat}
        onToggleUserGender={handleToggleUserGender}
      />

      {/* Floating Gentle Lonelyness & Care Helper Banner */}
      <div className="bg-gradient-to-r from-rose-950/40 via-purple-950/30 to-indigo-950/40 border-b border-white/5 px-3 py-1.5 flex items-center justify-between text-xs text-slate-300">
        <div className="max-w-7xl mx-auto w-full flex items-center justify-between">
          <div className="flex items-center gap-2 truncate">
            <button
              onClick={() => setIsSidebarOpen(true)}
              className="text-slate-400 hover:text-white flex items-center gap-1 text-[11px] p-0.5 rounded hover:bg-white/10 transition-colors"
              title="মেনু খুলুন"
            >
              <Menu className="w-3.5 h-3.5 text-rose-400" />
              <span className="hidden xs:inline">স্লাইডার</span>
            </button>
            <span className="text-white/20 hidden xs:inline">•</span>
            <span className="flex h-2 w-2 rounded-full bg-rose-500 animate-gentle-pulse shrink-0" />
            <span className="truncate">
              {user.gender === 'male'
                ? `ছেলে হিসেবে আপনার জন্য মিষ্টি AI প্রেমিকা (${currentCompanion.bengaliName}) প্রস্তুত ❤️`
                : `মেয়ে হিসেবে আপনার জন্য যত্নশীল AI প্রেমিক (${currentCompanion.bengaliName}) প্রস্তুত 💙`}
            </span>
          </div>

          <div className="flex items-center gap-3 shrink-0">
            <button
              onClick={() => setIsCareModalOpen(true)}
              className="text-rose-300 hover:text-white flex items-center gap-1 text-[11px] font-medium transition-colors"
            >
              <Wind className="w-3.5 h-3.5" />
              <span className="hidden sm:inline">মন ভালো করার শ্বাস-ব্যায়াম</span>
              <span className="sm:hidden">কেয়ার</span>
            </button>
          </div>
        </div>
      </div>

      {/* Main Chat Flow */}
      <main className="flex-1 flex flex-col min-h-0 relative">
        {/* Background ambient lighting */}
        <div className="absolute top-12 left-1/2 -translate-x-1/2 w-96 h-96 bg-rose-500/10 rounded-full blur-3xl pointer-events-none" />
        <div className="absolute bottom-12 right-12 w-80 h-80 bg-purple-500/10 rounded-full blur-3xl pointer-events-none" />

        <ChatArea
          messages={messages}
          currentCompanion={currentCompanion}
          isLoading={isLoading}
          onSendPrompt={(prompt) => handleSendMessage(prompt)}
          quickPrompts={QUICK_PROMPTS}
        />

        {/* Input Dock */}
        <ChatInput
          onSendMessage={handleSendMessage}
          isLoading={isLoading}
          user={user}
          onRequireLogin={handleRequireLogin}
          companionName={currentCompanion.bengaliName}
        />
      </main>

      {/* Left Slider Drawer Component */}
      <LeftSidebar
        isOpen={isSidebarOpen}
        onClose={() => setIsSidebarOpen(false)}
        sessions={sessions}
        activeSessionId={activeSessionId}
        onSelectSession={handleSelectSession}
        onNewChat={handleNewChat}
        onDeleteSession={handleDeleteSession}
        currentCompanion={currentCompanion}
        onSelectCompanion={switchCompanion}
        user={user}
        onOpenCartoonModal={() => {
          setIsSidebarOpen(false);
          setIsCartoonModalOpen(true);
        }}
        onOpenAuthModal={() => {
          setIsSidebarOpen(false);
          setAuthTriggerReason('general');
          setIsAuthModalOpen(true);
        }}
        onOpenPremiumModal={() => {
          setIsSidebarOpen(false);
          setIsPremiumModalOpen(true);
        }}
        onOpenCallModal={() => {
          setIsSidebarOpen(false);
          setIsCallModalOpen(true);
        }}
        onOpenCareModal={() => {
          setIsSidebarOpen(false);
          setIsCareModalOpen(true);
        }}
        onSelectMood={handleSelectMood}
      />

      {/* First-Visit / Change Cartoon Onboarding Modal */}
      <CartoonOnboardingModal
        isOpen={isCartoonModalOpen}
        onClose={() => setIsCartoonModalOpen(false)}
        onComplete={handleCompleteOnboarding}
        initialGender={user.gender}
        initialName={user.name || ''}
      />

      {/* Companion Selector Modal */}
      <CompanionSelectorModal
        isOpen={isCompanionModalOpen}
        onClose={() => setIsCompanionModalOpen(false)}
        currentCompanion={currentCompanion}
        userGender={user.gender}
        onSelectCompanion={switchCompanion}
      />

      {/* Auth Modal (Triggered when trying to send photo, or access VIP, or clicking login) */}
      <AuthModal
        isOpen={isAuthModalOpen}
        onClose={() => setIsAuthModalOpen(false)}
        user={user}
        onLogin={handleLogin}
        onLogout={handleLogout}
        triggerReason={authTriggerReason}
      />

      {/* Premium VIP Modal */}
      <PremiumModal
        isOpen={isPremiumModalOpen}
        onClose={() => setIsPremiumModalOpen(false)}
        user={user}
        onUpgradePremium={handleUpgradePremium}
        onRequireLogin={() => {
          setIsPremiumModalOpen(false);
          handleRequireLogin('premium_feature');
        }}
      />

      {/* Simulated Voice Call Modal */}
      <VoiceCallModal
        isOpen={isCallModalOpen}
        onClose={() => setIsCallModalOpen(false)}
        companion={currentCompanion}
      />

      {/* Lonelyness & Relaxation Care Modal */}
      <LonelynessCareModal
        isOpen={isCareModalOpen}
        onClose={() => setIsCareModalOpen(false)}
        companion={currentCompanion}
        messages={messages}
      />
    </div>
  );
}

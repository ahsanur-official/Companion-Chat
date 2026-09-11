/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState, useEffect } from 'react';
import { Navbar } from './components/Navbar';
import { LeftSidebar } from './components/LeftSidebar';
import { ChatArea } from './components/ChatArea';
import { ChatInput } from './components/ChatInput';
import { SettingsModal } from './components/SettingsModal';
import { CompanionSelectorModal } from './components/CompanionSelectorModal';
import { CartoonOnboardingModal } from './components/CartoonOnboardingModal';
import { AuthModal } from './components/AuthModal';
import { PremiumModal } from './components/PremiumModal';
import { VoiceCallModal } from './components/VoiceCallModal';
import { LonelynessCareModal } from './components/LonelynessCareModal';
import { PdfExportModal } from './components/PdfExportModal';
import { AdminPanelModal } from './components/AdminPanelModal';
import { CustomCompanionModal } from './components/CustomCompanionModal';
import { MorningGreetingModal } from './components/MorningGreetingModal';
import { EmotionTrackerModal } from './components/EmotionTrackerModal';
import { WallpaperModal } from './components/WallpaperModal';
import { MemoryBookModal } from './components/MemoryBookModal';
import { LoveMeterModal } from './components/LoveMeterModal';
import { COMPANIONS, QUICK_PROMPTS } from './data/companions';
import {
  getRomanticMomentForContext,
  getImageMomentCaptions,
} from './data/romanticMoments';
import {
  Companion,
  ChatMessage,
  UserAccount,
  UserGender,
  RelationshipType,
  ChatSession,
  UserMood,
  AppSettings,
  EmotionType,
  MorningGreetingConfig,
  BrowserQuotaState,
} from './types';
import {
  generatePersonalizedMorningGreeting,
  sendBrowserWebNotification,
} from './utils/morningGreeting';
import { getBrowserQuota, consumeBrowserQuota } from './utils/browserQuota';
import { Heart, Sparkles, PhoneCall, Wind, Sliders, Sun } from 'lucide-react';

const STORAGE_USER_KEY = 'moner_sathi_user_v2';
const STORAGE_COMPANION_KEY = 'moner_sathi_active_companion_v2';
const STORAGE_CUSTOM_COMPANION_KEY = 'moner_sathi_custom_companion_data_v2';
const STORAGE_SESSIONS_KEY = 'moner_sathi_sessions_v2';
const STORAGE_ACTIVE_SESSION_KEY = 'moner_sathi_active_session_id_v2';
const STORAGE_SETTINGS_KEY = 'moner_sathi_settings_v2';
const STORAGE_LAST_ACTIVE_KEY = 'moner_sathi_last_active_ts_v2';
const STORAGE_MORNING_CONFIG_KEY = 'moner_sathi_morning_config_v2';
const STORAGE_LAST_MORNING_GREETING_DATE_KEY = 'moner_sathi_last_greeting_date_v2';

const DEFAULT_MORNING_CONFIG: MorningGreetingConfig = {
  enabled: true,
  preferredTime: '08:00',
  browserNotificationsEnabled: false,
};

const DEFAULT_SETTINGS: AppSettings = {
  language: 'en', // Primary language is English as requested!
  replyLength: 'medium', // Default to medium as user requested!
  fontSize: 'large', // Default to large as user requested "text boro thakbe"!
  theme: 'obsidian',
  enableRomanticPics: true,
  companionTone: 'sweet',
  endearmentNick: 'sweetheart',
  speechRate: 1.0,
  autoSpeak: false,
  soundEnabled: true,
};

export default function App() {
  // 1. Settings state
  const [settings, setSettings] = useState<AppSettings>(() => {
    const saved = localStorage.getItem(STORAGE_SETTINGS_KEY);
    if (saved) {
      try {
        const parsed = JSON.parse(saved);
        return {
          ...DEFAULT_SETTINGS,
          ...parsed,
          language: parsed.language || 'en',
        };
      } catch (e) {
        // fallback
      }
    }
    return DEFAULT_SETTINGS;
  });

  const handleUpdateSettings = (newPartial: Partial<AppSettings>) => {
    setSettings((prev) => {
      const updated = { ...prev, ...newPartial };
      localStorage.setItem(STORAGE_SETTINGS_KEY, JSON.stringify(updated));
      return updated;
    });
  };

  // 2. User state
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
        if (parsed.tokens === undefined || parsed.maxFreeTokens === 8 || (parsed.isLoggedIn && parsed.maxFreeTokens <= 50)) {
          parsed.tokens = parsed.isLoggedIn ? 250 : 50;
          parsed.maxFreeTokens = parsed.isLoggedIn ? 250 : 50;
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
      tokens: 50,
      maxFreeTokens: 50,
      onboardingCompleted: false,
      currentMood: 'lonely',
    };
  });

  // 3. Active Companion state
  const [currentCompanion, setCurrentCompanion] = useState<Companion>(() => {
    const savedCustom = localStorage.getItem(STORAGE_CUSTOM_COMPANION_KEY);
    if (savedCustom) {
      try {
        const parsed = JSON.parse(savedCustom);
        if (parsed && parsed.id && parsed.name) return parsed;
      } catch (e) {
        // fallback
      }
    }
    const savedId = localStorage.getItem(STORAGE_COMPANION_KEY);
    if (savedId) {
      const found = COMPANIONS.find((c) => c.id === savedId);
      if (found) return found;
    }
    return COMPANIONS[0]; // Ananya
  });

  // 4. Chat Sessions list & Active Session
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
      title: 'মনের প্রথম আলাপ 💖',
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
          const newMessages = typeof updater === 'function' ? updater(session.messages) : updater;
          const lastMsg = newMessages[newMessages.length - 1];
          return {
            ...session,
            messages: newMessages,
            preview: lastMsg ? lastMsg.text.slice(0, 40) + '...' : session.preview,
            updatedAt: 'এখন',
          };
        }
        return session;
      });
    });
  };

  // Toggle emoji reaction (e.g. ❤️, 👍) on assistant messages
  const handleReactMessage = (messageId: string, emoji: string) => {
    setMessages((prev) =>
      prev.map((msg) => {
        if (msg.id === messageId) {
          const currentReactions = msg.reactions || [];
          const exists = currentReactions.includes(emoji);
          const updatedReactions = exists
            ? currentReactions.filter((r) => r !== emoji)
            : [...currentReactions, emoji];
          return {
            ...msg,
            reactions: updatedReactions,
          };
        }
        return msg;
      })
    );
  };

  // Modals visibility state
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);
  const [sidebarInitialTab, setSidebarInitialTab] = useState<'chats' | 'all' | 'companions' | 'care'>('chats');
  const [isSettingsModalOpen, setIsSettingsModalOpen] = useState(false);
  const [isCompanionModalOpen, setIsCompanionModalOpen] = useState(false);
  const [isCartoonModalOpen, setIsCartoonModalOpen] = useState(false);
  const [isAuthModalOpen, setIsAuthModalOpen] = useState(false);
  const [authTriggerReason, setAuthTriggerReason] = useState<'photo_upload' | 'premium_feature' | 'tokens_exhausted' | 'general'>('general');
  const [isPremiumModalOpen, setIsPremiumModalOpen] = useState(false);
  const [isCallModalOpen, setIsCallModalOpen] = useState(false);
  const [isCareModalOpen, setIsCareModalOpen] = useState(false);
  const [isPdfModalOpen, setIsPdfModalOpen] = useState(false);
  const [isAdminModalOpen, setIsAdminModalOpen] = useState(false);
  const [isCustomModalOpen, setIsCustomModalOpen] = useState(false);
  const [companionToEdit, setCompanionToEdit] = useState<Companion>(currentCompanion);
  const [isLoading, setIsLoading] = useState(false);

  // Scheduled Morning Greeting & Emotion Tracker state
  const [morningConfig, setMorningConfig] = useState<MorningGreetingConfig>(() => {
    try {
      const saved = localStorage.getItem(STORAGE_MORNING_CONFIG_KEY);
      if (saved) return { ...DEFAULT_MORNING_CONFIG, ...JSON.parse(saved) };
    } catch (e) {}
    return DEFAULT_MORNING_CONFIG;
  });
  const [isMorningGreetingOpen, setIsMorningGreetingOpen] = useState(false);
  const [hoursPassedAway, setHoursPassedAway] = useState(24);
  const [isEmotionTrackerOpen, setIsEmotionTrackerOpen] = useState(false);
  const [isWallpaperModalOpen, setIsWallpaperModalOpen] = useState(false);
  const [isMemoryBookModalOpen, setIsMemoryBookModalOpen] = useState(false);
  const [isLoveMeterModalOpen, setIsLoveMeterModalOpen] = useState(false);

  // Browser-Local Quota State (6-hour reset cycle per browser)
  const [browserQuota, setBrowserQuota] = useState<BrowserQuotaState>(() =>
    getBrowserQuota(user.isLoggedIn, user.isPremium, settings.language || 'en')
  );

  // Keep browser quota synchronized and countdown timer ticking every second
  useEffect(() => {
    const updateQuota = () => {
      setBrowserQuota(getBrowserQuota(user.isLoggedIn, user.isPremium, settings.language || 'en'));
    };
    updateQuota();
    const timer = setInterval(updateQuota, 1000);
    return () => clearInterval(timer);
  }, [user.isLoggedIn, user.isPremium, settings.language]);

  const handleOpenCustomModal = (comp?: Companion) => {
    setCompanionToEdit(comp || currentCompanion);
    setIsCustomModalOpen(true);
  };

  const handleSaveCustomCompanion = (updatedCompanion: Companion) => {
    setCurrentCompanion(updatedCompanion);
    setSessions((prevSessions) =>
      prevSessions.map((session) => {
        if (session.id === activeSessionId || session.companionId === updatedCompanion.id) {
          return {
            ...session,
            title: `${updatedCompanion.bengaliName}-এর সাথে আলাপ 💕`,
          };
        }
        return session;
      })
    );
  };

  // Update User Mood from Emotion Tracker
  const handleUpdateUserMood = (mood: EmotionType) => {
    setUser((prev) => ({
      ...prev,
      currentMood: mood as UserMood,
    }));
  };

  // Check 24-hour absence and scheduled Morning Greeting
  useEffect(() => {
    const lastActiveStr = localStorage.getItem(STORAGE_LAST_ACTIVE_KEY);
    const now = Date.now();
    const todayDateStr = new Date().toDateString();
    const lastGreetingDate = localStorage.getItem(STORAGE_LAST_MORNING_GREETING_DATE_KEY);

    if (lastActiveStr) {
      const lastActiveTs = Number(lastActiveStr);
      const diffMs = now - lastActiveTs;
      const hoursDiff = diffMs / (1000 * 60 * 60);

      // If user hasn't opened the app in 24 hours, trigger personalized morning greeting!
      if (hoursDiff >= 24 && lastGreetingDate !== todayDateStr && morningConfig.enabled) {
        setHoursPassedAway(Math.round(hoursDiff));
        setIsMorningGreetingOpen(true);
        localStorage.setItem(STORAGE_LAST_MORNING_GREETING_DATE_KEY, todayDateStr);

        // Fire native web notification if allowed
        if (morningConfig.browserNotificationsEnabled) {
          const payload = generatePersonalizedMorningGreeting(currentCompanion, hoursDiff);
          sendBrowserWebNotification(payload);
        }
      }
    }

    // Save current active timestamp
    localStorage.setItem(STORAGE_LAST_ACTIVE_KEY, String(now));

    // Keep active timestamp fresh while user is interacting
    const updateActive = () => {
      localStorage.setItem(STORAGE_LAST_ACTIVE_KEY, String(Date.now()));
    };

    window.addEventListener('focus', updateActive);
    document.addEventListener('visibilitychange', updateActive);
    const interval = setInterval(updateActive, 60000);

    return () => {
      window.removeEventListener('focus', updateActive);
      document.removeEventListener('visibilitychange', updateActive);
      clearInterval(interval);
    };
  }, [morningConfig.enabled, morningConfig.browserNotificationsEnabled, currentCompanion]);

  useEffect(() => {
    localStorage.setItem(STORAGE_MORNING_CONFIG_KEY, JSON.stringify(morningConfig));
  }, [morningConfig]);

  // Gated Voice Call Handler: Must be VIP / Premium
  const handleInitiateVoiceCall = () => {
    if (!user.isPremium) {
      // User is not premium -> Show Premium VIP Paywall
      setIsPremiumModalOpen(true);
    } else {
      // User is premium -> Connect Call
      setIsCallModalOpen(true);
    }
  };

  // Persistence effects
  useEffect(() => {
    localStorage.setItem(STORAGE_USER_KEY, JSON.stringify(user));
  }, [user]);

  useEffect(() => {
    localStorage.setItem(STORAGE_COMPANION_KEY, currentCompanion.id);
    localStorage.setItem(STORAGE_CUSTOM_COMPANION_KEY, JSON.stringify(currentCompanion));
  }, [currentCompanion]);

  useEffect(() => {
    localStorage.setItem(STORAGE_SESSIONS_KEY, JSON.stringify(sessions));
  }, [sessions]);

  useEffect(() => {
    localStorage.setItem(STORAGE_ACTIVE_SESSION_KEY, activeSessionId);
  }, [activeSessionId]);

  // Open cartoon selection on first visit
  useEffect(() => {
    if (!user.onboardingCompleted) {
      setIsCartoonModalOpen(true);
    }
  }, [user.onboardingCompleted]);

  const handleCloseOnboarding = () => {
    setIsCartoonModalOpen(false);
    setUser((prev) => {
      const updated = { ...prev, onboardingCompleted: true };
      try {
        localStorage.setItem(STORAGE_USER_KEY, JSON.stringify(updated));
      } catch (e) {}
      return updated;
    });
  };

  const handleCompleteOnboarding = (
    gender: UserGender,
    name: string,
    relationType?: RelationshipType,
    companion?: Companion
  ) => {
    setIsCartoonModalOpen(false);

    const cleanName = name.trim();
    const updatedUser: UserAccount = {
      ...user,
      gender,
      name: cleanName || user.name,
      onboardingCompleted: true,
    };
    setUser(updatedUser);
    try {
      localStorage.setItem(STORAGE_USER_KEY, JSON.stringify(updatedUser));
    } catch (e) {}

    const appropriateCompanion =
      companion ||
      (gender === 'male'
        ? COMPANIONS.find((c) => c.targetUserGender === 'male' && (relationType ? c.relationshipType === relationType : true)) || COMPANIONS[0]
        : COMPANIONS.find((c) => c.targetUserGender === 'female' && (relationType ? c.relationshipType === relationType : true)) || COMPANIONS[3]);

    setCurrentCompanion(appropriateCompanion);
    try {
      localStorage.setItem(STORAGE_COMPANION_KEY, appropriateCompanion.id);
      localStorage.setItem(STORAGE_CUSTOM_COMPANION_KEY, JSON.stringify(appropriateCompanion));
    } catch (e) {}

    const welcomeText = appropriateCompanion.initialMessage;

    const newSessionId = 'session-' + Date.now();
    const newSession: ChatSession = {
      id: newSessionId,
      companionId: appropriateCompanion.id,
      title: `${appropriateCompanion.bengaliName}-এর সাথে আলাপ 💕`,
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
    setActiveSessionId(newSessionId);
    try {
      localStorage.setItem(STORAGE_ACTIVE_SESSION_KEY, newSessionId);
    } catch (e) {}
  };

  // Create a brand new chat session
  const handleNewChat = () => {
    const newSessionId = 'session-' + Date.now();
    const today = new Date().toISOString().split('T')[0];
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
          date: today,
          createdAt: Date.now(),
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

  // Clear current active chat
  const handleClearCurrentChat = () => {
    const today = new Date().toISOString().split('T')[0];
    const resetMessage: ChatMessage = {
      id: 'msg-init-' + Date.now(),
      role: 'assistant',
      text: `${currentCompanion.bengaliName}: চ্যাট ক্লিয়ার করা হয়েছে। নতুন করে বলো, কেমন আছো তুমি? ❤️`,
      timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
      date: today,
      createdAt: Date.now(),
    };
    setMessages([resetMessage]);
  };

  // Reset all chats
  const handleClearAllChats = () => {
    const today = new Date().toISOString().split('T')[0];
    const initialSession: ChatSession = {
      id: 'session-' + Date.now(),
      companionId: currentCompanion.id,
      title: `${currentCompanion.bengaliName}-এর সাথে আলাপ 💕`,
      preview: currentCompanion.initialMessage.slice(0, 40) + '...',
      updatedAt: 'এখন',
      messages: [
        {
          id: 'msg-init-' + Date.now(),
          role: 'assistant',
          text: currentCompanion.initialMessage,
          timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
          date: today,
          createdAt: Date.now(),
        },
      ],
    };
    setSessions([initialSession]);
    setActiveSessionId(initialSession.id);
  };

  // Export chat transcript - Opens the date-grouped PDF & export modal
  const handleExportChat = () => {
    setIsPdfModalOpen(true);
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

  // Gender toggle
  const handleToggleUserGender = (gender: UserGender) => {
    setUser((prev) => ({ ...prev, gender }));
    const targetComp = COMPANIONS.find((c) => c.targetUserGender === gender) || COMPANIONS[0];
    switchCompanion(targetComp, gender);
  };

  // Switch companion
  const switchCompanion = (comp: Companion, targetGender: UserGender) => {
    setCurrentCompanion(comp);
    setUser((prev) => ({ ...prev, gender: targetGender }));

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
            date: new Date().toISOString().split('T')[0],
            createdAt: Date.now(),
          },
        ],
      };
      setSessions((prev) => [newSession, ...prev]);
      setActiveSessionId(newSession.id);
    }
  };

  // Login handler
  const handleLogin = (userData: Partial<UserAccount>) => {
    setUser((prev) => {
      // Free guest limit is 50, after login limit is 250
      const loginLimit = 250;
      return {
        ...prev,
        ...userData,
        isLoggedIn: true,
        tokens: loginLimit,
        maxFreeTokens: loginLimit,
      };
    });
  };

  const handleLogout = () => {
    setUser((prev) => ({
      ...prev,
      name: '',
      email: '',
      isLoggedIn: false,
      isPremium: false,
      tokens: 50,
      maxFreeTokens: 50,
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
  const handleRequireLogin = (reason: 'photo_upload' | 'premium_feature' | 'tokens_exhausted' | 'general') => {
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
    imageAttachment?: { mimeType: string; data: string; previewUrl: string },
    moodContext?: UserMood
  ) => {
    if ((!text && !imageAttachment) || isLoading) return;

    // Check Browser-Local Quota limit (Free chat 6-hour cooldown)
    if (!user.isPremium) {
      const quotaResult = consumeBrowserQuota(user.isLoggedIn, user.isPremium, settings.language || 'en');
      setBrowserQuota(quotaResult.state);

      if (!quotaResult.allowed) {
        if (!user.isLoggedIn) {
          handleRequireLogin('tokens_exhausted');
        } else {
          setIsPremiumModalOpen(true);
        }
        return;
      }
    }

    // Deduct 1 token/SMS for non-premium users
    if (!user.isPremium) {
      setUser((prev) => ({
        ...prev,
        tokens: Math.max(0, (prev.tokens ?? 50) - 1),
        ...(moodContext ? { currentMood: moodContext } : {}),
      }));
    } else if (moodContext) {
      setUser((prev) => ({ ...prev, currentMood: moodContext }));
    }

    const userMessageId = 'msg-' + Date.now();
    const timestamp = new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
    const today = new Date().toISOString().split('T')[0];
    const now = Date.now();

    const newUserMessage: ChatMessage = {
      id: userMessageId,
      role: 'user',
      text: text || (imageAttachment ? '📸 [ছবি পাঠানো হয়েছে]' : ''),
      timestamp,
      date: today,
      createdAt: now,
      image: imageAttachment,
    };

    const assistantMessageId = 'msg-ai-' + (now + 1);
    const initialAiMessage: ChatMessage = {
      id: assistantMessageId,
      role: 'assistant',
      text: '',
      timestamp,
      date: today,
      createdAt: now + 1,
      isStreaming: true,
    };

    const updatedMessages = [...messages, newUserMessage, initialAiMessage];
    setMessages(updatedMessages);

    // Auto update session title if default
    if (activeSession && (activeSession.title.includes('মনের প্রথম আলাপ') || activeSession.title.includes('নতুন আলাপ'))) {
      const newTitle = text ? text.slice(0, 24) + (text.length > 24 ? '...' : '') : 'ছবি শেয়ারিং চ্যাট 📸';
      setSessions((prev) =>
        prev.map((s) => (s.id === activeSessionId ? { ...s, title: newTitle } : s))
      );
    }

    setIsLoading(true);

    try {
      const response = await fetch('/api/chat', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          messages: updatedMessages.slice(0, -1),
          userGender: user.gender,
          relationshipType: currentCompanion.relationshipType,
          companionName: currentCompanion.name,
          companionBengaliName: currentCompanion.bengaliName,
          companionGender: currentCompanion.gender,
          companionPersonality: currentCompanion.personality,
          userName: user.name || '',
          currentMood: moodContext || user.currentMood || 'neutral',
          isPremium: user.isPremium,
          replyLength: settings.replyLength,
          endearmentNick: settings.endearmentNick,
          language: settings.language || 'en',
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
      let streamBuffer = '';

      while (true) {
        const { value, done } = await reader.read();
        if (done) break;

        streamBuffer += decoder.decode(value, { stream: true });
        const lines = streamBuffer.split('\n');
        // Keep incomplete trailing line in streamBuffer
        streamBuffer = lines.pop() || '';

        let batchChunk = '';
        let streamDonePayload: any = null;

        for (const line of lines) {
          const trimmed = line.trim();
          if (trimmed.startsWith('data: ')) {
            const dataStr = trimmed.slice(6).trim();
            if (!dataStr) continue;

            try {
              const data = JSON.parse(dataStr);
              if (data.chunk) {
                batchChunk += data.chunk;
              }
              if (data.done) {
                streamDonePayload = data;
              }
            } catch (e) {
              // Ignore partial JSON
            }
          }
        }

        if (batchChunk) {
          streamedReply += batchChunk;
          setMessages((prev) =>
            prev.map((m) =>
              m.id === assistantMessageId
                ? { ...m, text: streamedReply, isStreaming: true }
                : m
            )
          );
        }

        if (streamDonePayload) {
          const finalReply = streamDonePayload.fullReply || streamedReply;

          // Check if we should attach a sweet realistic love picture moment
          let matchedPhotoMoment = undefined;
          const isExplicitPicRequest = /ছবি|pic|photo|image|selfie|chobi|dekhao|pathao|দেখাও|পাঠাও|দেখি|মুহূর্ত|পিক|ফটো/i.test(
            `${text} ${finalReply}`
          );
          if (settings.enableRomanticPics !== false || isExplicitPicRequest) {
            const moment = getRomanticMomentForContext(text, finalReply);
            if (moment) {
              const captions = getImageMomentCaptions(moment, text, settings.language);
              matchedPhotoMoment = {
                url: moment.url,
                caption: captions.caption,
                momentTitle: captions.momentTitle,
                badge: captions.badge,
              };
            }
          }

          setMessages((prev) =>
            prev.map((m) =>
              m.id === assistantMessageId
                ? {
                    ...m,
                    text: finalReply,
                    isStreaming: false,
                    companionPhoto: matchedPhotoMoment,
                  }
                : m
            )
          );
        }
      }

      // Check final safety update for romantic photo moment if not set
      const isExplicitPicRequest = /ছবি|pic|photo|image|selfie|chobi|dekhao|pathao|দেখাও|পাঠাও|দেখি|মুহূর্ত|পিক|ফটো/i.test(
        `${text} ${streamedReply}`
      );
      if (settings.enableRomanticPics !== false || isExplicitPicRequest) {
        const moment = getRomanticMomentForContext(text, streamedReply);
        if (moment) {
          const captions = getImageMomentCaptions(moment, text, settings.language);
          setMessages((prev) =>
            prev.map((m) =>
              m.id === assistantMessageId && !m.companionPhoto
                ? {
                    ...m,
                    isStreaming: false,
                    companionPhoto: {
                      url: moment.url,
                      caption: captions.caption,
                      momentTitle: captions.momentTitle,
                      badge: captions.badge,
                    },
                  }
                : m
            )
          );
        }
      }

      setMessages((prev) =>
        prev.map((m) =>
          m.id === assistantMessageId ? { ...m, isStreaming: false } : m
        )
      );
    } catch (error: any) {
      console.error('Chat failed:', error);
      const isEnglish = settings.language === 'en';
      const contextualFailover = isEnglish
        ? `${currentCompanion.name}: Sweetheart, could you say that again? I am listening to you with all my heart. ❤️`
        : `${currentCompanion.bengaliName}: প্রিয়, তোমার কথাটি আরেকবার বলবে কি? আমি গভীর মনোযোগ দিয়ে শুনছি। ❤️`;
      setMessages((prev) =>
        prev.map((m) =>
          m.id === assistantMessageId
            ? {
                ...m,
                text: m.text || contextualFailover,
                isStreaming: false,
                error: false,
              }
            : m
        )
      );
    } finally {
      setIsLoading(false);
    }
  };

  // Theme container styling
  const getThemeWrapperClass = () => {
    switch (settings.theme) {
      case 'rose':
        return 'bg-[#120910] text-rose-50';
      case 'amethyst':
        return 'bg-[#0f0b18] text-purple-50';
      case 'obsidian':
      default:
        return 'bg-[#0b0e19] text-slate-100';
    }
  };

  return (
    <div
      className={`flex flex-col h-[100dvh] max-h-[100dvh] w-full ${getThemeWrapperClass()} overflow-hidden selection:bg-rose-500 selection:text-white fixed inset-0`}
    >
      {/* Top Navigation */}
      <Navbar
        currentCompanion={currentCompanion}
        user={user}
        settings={settings}
        onUpdateSettings={handleUpdateSettings}
        isSidebarOpen={isSidebarOpen}
        onOpenSidebar={() => {
          setSidebarInitialTab('chats');
          setIsSidebarOpen(true);
        }}
        onOpenChatsSlider={() => {
          setSidebarInitialTab('chats');
          setIsSidebarOpen(true);
        }}
        chatCount={sessions.length}
        onOpenCompanionModal={() => setIsCompanionModalOpen(true)}
        onOpenCustomCompanionModal={() => handleOpenCustomModal(currentCompanion)}
        onOpenMorningGreetingModal={() => setIsMorningGreetingOpen(true)}
        onOpenEmotionTrackerModal={() => setIsEmotionTrackerOpen(true)}
        onOpenCallModal={handleInitiateVoiceCall}
        onNewChat={handleNewChat}
        onOpenAuthModal={() => {
          setAuthTriggerReason(user.tokens <= 0 ? 'tokens_exhausted' : 'general');
          setIsAuthModalOpen(true);
        }}
        onOpenPremiumModal={() => setIsPremiumModalOpen(true)}
        onOpenWallpaperModal={() => setIsWallpaperModalOpen(true)}
        onOpenMemoryBookModal={() => setIsMemoryBookModalOpen(true)}
        onOpenLoveMeterModal={() => setIsLoveMeterModalOpen(true)}
      />

      {/* Main Chat Flow */}
      <main
        className={`flex-1 flex flex-col min-h-0 w-full relative overflow-hidden transition-[padding] duration-300 ease-in-out ${
          isSidebarOpen ? 'lg:pl-80' : 'lg:pl-0'
        }`}
      >
        {/* Subtle Ambient Glow */}
        <div className="absolute top-10 left-1/2 -translate-x-1/2 w-96 h-96 bg-rose-500/5 rounded-full blur-3xl pointer-events-none" />
        <div className="absolute bottom-10 right-10 w-80 h-80 bg-purple-500/5 rounded-full blur-3xl pointer-events-none" />

        <ChatArea
          messages={messages}
          currentCompanion={currentCompanion}
          isLoading={isLoading}
          onSendPrompt={(prompt) => handleSendMessage(prompt)}
          settings={settings}
          onReactMessage={handleReactMessage}
        />

        {/* Input Dock */}
        <ChatInput
          onSendMessage={handleSendMessage}
          isLoading={isLoading}
          user={user}
          language={settings.language || 'en'}
          browserQuota={browserQuota}
          onRequireLogin={handleRequireLogin}
          onOpenPremium={() => setIsPremiumModalOpen(true)}
          companionName={
            settings.language === 'bn'
              ? currentCompanion.bengaliName
              : currentCompanion.name
          }
        />
      </main>

      {/* Advanced Left Slider Drawer Component */}
      <LeftSidebar
        isOpen={isSidebarOpen}
        onClose={() => setIsSidebarOpen(false)}
        initialTab={sidebarInitialTab}
        sessions={sessions}
        activeSessionId={activeSessionId}
        onSelectSession={handleSelectSession}
        onNewChat={handleNewChat}
        onDeleteSession={handleDeleteSession}
        onClearAllChats={handleClearAllChats}
        onExportChat={handleExportChat}
        currentCompanion={currentCompanion}
        onSelectCompanion={switchCompanion}
        user={user}
        browserQuota={browserQuota}
        onToggleUserGender={handleToggleUserGender}
        onOpenCartoonModal={() => {
          setIsSidebarOpen(false);
          setIsCartoonModalOpen(true);
        }}
        onOpenCustomModal={() => {
          handleOpenCustomModal(currentCompanion);
        }}
        onOpenMorningGreetingModal={() => {
          setIsSidebarOpen(false);
          setIsMorningGreetingOpen(true);
        }}
        onOpenEmotionTrackerModal={() => {
          setIsSidebarOpen(false);
          setIsEmotionTrackerOpen(true);
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
          handleInitiateVoiceCall();
        }}
        onOpenCareModal={() => {
          setIsSidebarOpen(false);
          setIsCareModalOpen(true);
        }}
        onOpenSettingsModal={() => {
          setIsSidebarOpen(false);
          setIsSettingsModalOpen(true);
        }}
        onSelectMood={handleSelectMood}
        settings={settings}
        onUpdateSettings={handleUpdateSettings}
        onOpenWallpaperModal={() => {
          setIsSidebarOpen(false);
          setIsWallpaperModalOpen(true);
        }}
        onOpenMemoryBookModal={() => {
          setIsSidebarOpen(false);
          setIsMemoryBookModalOpen(true);
        }}
        onOpenLoveMeterModal={() => {
          setIsSidebarOpen(false);
          setIsLoveMeterModalOpen(true);
        }}
      />

      {/* Unified Settings & Typography Modal */}
      <SettingsModal
        isOpen={isSettingsModalOpen}
        onClose={() => setIsSettingsModalOpen(false)}
        settings={settings}
        onUpdateSettings={handleUpdateSettings}
        onClearCurrentChat={handleClearCurrentChat}
        onClearAllChats={handleClearAllChats}
        onExportChat={handleExportChat}
        companionName={currentCompanion.bengaliName}
        onOpenAdminModal={() => {
          setIsSettingsModalOpen(false);
          setIsAdminModalOpen(true);
        }}
      />

      {/* First-Visit / Change Cartoon Onboarding Modal */}
      <CartoonOnboardingModal
        isOpen={isCartoonModalOpen}
        onClose={handleCloseOnboarding}
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
        onOpenCustomModal={(comp) => handleOpenCustomModal(comp || currentCompanion)}
      />

      {/* Custom Companion (Name & Picture Edit) Modal */}
      <CustomCompanionModal
        isOpen={isCustomModalOpen}
        onClose={() => setIsCustomModalOpen(false)}
        currentCompanion={companionToEdit}
        onSaveCompanion={handleSaveCustomCompanion}
      />

      {/* Auth Modal */}
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

      {/* Loneliness & Care Modal */}
      <LonelynessCareModal
        isOpen={isCareModalOpen}
        onClose={() => setIsCareModalOpen(false)}
        companion={currentCompanion}
        messages={messages}
      />

      {/* Date-Grouped PDF Export Modal */}
      <PdfExportModal
        isOpen={isPdfModalOpen}
        onClose={() => setIsPdfModalOpen(false)}
        messages={messages}
        currentCompanion={currentCompanion}
        user={user}
        sessionTitle={activeSession?.title}
      />

      {/* Scheduled Morning Greeting Modal (24h Absence & Personality-Based) */}
      <MorningGreetingModal
        isOpen={isMorningGreetingOpen}
        onClose={() => setIsMorningGreetingOpen(false)}
        companion={currentCompanion}
        hoursPassed={hoursPassedAway}
        config={morningConfig}
        onUpdateConfig={setMorningConfig}
        onSendToChat={handleSendMessage}
      />

      {/* Emotion Tracker & Mood Journal Modal */}
      <EmotionTrackerModal
        isOpen={isEmotionTrackerOpen}
        onClose={() => setIsEmotionTrackerOpen(false)}
        companion={currentCompanion}
        user={user}
        onUpdateUserMood={handleUpdateUserMood}
        onSendToChat={handleSendMessage}
      />

      {/* Admin Panel Modal (Mobile & Desktop ready with VIP, NLP & Voice Controls) */}
      <AdminPanelModal
        isOpen={isAdminModalOpen}
        onClose={() => setIsAdminModalOpen(false)}
        currentUser={user}
        onUpdateUser={(updated) => setUser((prev) => ({ ...prev, ...updated }))}
        appSettings={settings}
        onUpdateSettings={handleUpdateSettings}
      />

      {/* Atmospheric Wallpaper Modal */}
      <WallpaperModal
        isOpen={isWallpaperModalOpen}
        onClose={() => setIsWallpaperModalOpen(false)}
        settings={settings}
        onUpdateSettings={handleUpdateSettings}
      />

      {/* Relationship Memory Book & Diary Modal */}
      <MemoryBookModal
        isOpen={isMemoryBookModalOpen}
        onClose={() => setIsMemoryBookModalOpen(false)}
        currentCompanion={currentCompanion}
        onSendToChat={(text) => handleSendMessage(text)}
      />

      {/* Love Meter & Chemistry Quiz Modal */}
      <LoveMeterModal
        isOpen={isLoveMeterModalOpen}
        onClose={() => setIsLoveMeterModalOpen(false)}
        currentCompanion={currentCompanion}
        onSendToChat={(text) => handleSendMessage(text)}
      />
    </div>
  );
}

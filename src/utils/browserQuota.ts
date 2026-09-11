import { BrowserQuotaState } from '../types';

const STORAGE_KEY = 'moner_sathi_browser_quota';
const COOLDOWN_DURATION_MS = 6 * 60 * 60 * 1000; // 6 hours

interface StoredQuota {
  usedCount: number;
  cooldownEndTimestamp: number | null;
  limitCap?: number;
}

function getStoredData(): StoredQuota {
  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    if (raw) {
      const parsed = JSON.parse(raw);
      return {
        usedCount: typeof parsed.usedCount === 'number' ? parsed.usedCount : 0,
        cooldownEndTimestamp: typeof parsed.cooldownEndTimestamp === 'number' ? parsed.cooldownEndTimestamp : null,
      };
    }
  } catch (e) {
    // Ignore storage parse errors
  }
  return { usedCount: 0, cooldownEndTimestamp: null };
}

function saveStoredData(data: StoredQuota) {
  try {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(data));
  } catch (e) {
    // Ignore storage write errors
  }
}

export function formatTimeLeft(ms: number, lang: 'en' | 'bn' = 'en'): string {
  if (ms <= 0) return lang === 'bn' ? '০ মি' : '0m';
  const totalSeconds = Math.floor(ms / 1000);
  const hours = Math.floor(totalSeconds / 3600);
  const minutes = Math.floor((totalSeconds % 3600) / 60);
  const seconds = totalSeconds % 60;

  if (lang === 'bn') {
    const bnNum = (n: number) => n.toLocaleString('bn-BD');
    if (hours > 0) {
      return `${bnNum(hours)} ঘণ্টা ${bnNum(minutes)} মিনিট`;
    }
    if (minutes > 0) {
      return `${bnNum(minutes)} মিনিট ${bnNum(seconds)} সেকেন্ড`;
    }
    return `${bnNum(seconds)} সেকেন্ড`;
  }

  if (hours > 0) {
    return `${hours}h ${minutes}m ${seconds}s`;
  }
  if (minutes > 0) {
    return `${minutes}m ${seconds}s`;
  }
  return `${seconds}s`;
}

export function formatReopenTime(timestamp: number | null, lang: 'en' | 'bn' = 'en'): string {
  if (!timestamp) return '';
  const date = new Date(timestamp);
  return date.toLocaleTimeString(lang === 'bn' ? 'bn-BD' : 'en-US', {
    hour: 'numeric',
    minute: '2-digit',
    hour12: true,
  });
}

/**
 * Calculates current browser-local quota state.
 * Automatic 6-hour reset when timer elapses.
 */
export function getBrowserQuota(isLoggedIn: boolean, isPremium: boolean, lang: 'en' | 'bn' = 'en'): BrowserQuotaState {
  if (isPremium) {
    return {
      usedCount: 0,
      maxLimit: 999999,
      percentage: 100,
      isCooldownActive: false,
      cooldownEndTimestamp: null,
      reopenTimeFormatted: '',
      timeLeftFormatted: '',
    };
  }

  const maxLimit = isLoggedIn ? 250 : 50;
  let stored = getStoredData();
  const now = Date.now();

  // Check if cooldown has expired -> automatically reset quota back to 100%
  if (stored.cooldownEndTimestamp && now >= stored.cooldownEndTimestamp) {
    stored = { usedCount: 0, cooldownEndTimestamp: null };
    saveStoredData(stored);
  }

  const isCooldownActive = stored.cooldownEndTimestamp !== null && now < stored.cooldownEndTimestamp;
  const remaining = isCooldownActive ? 0 : Math.max(0, maxLimit - stored.usedCount);
  const percentage = isCooldownActive ? 0 : Math.max(0, Math.min(100, Math.round((remaining / maxLimit) * 100)));

  const timeLeftMs = stored.cooldownEndTimestamp ? Math.max(0, stored.cooldownEndTimestamp - now) : 0;

  return {
    usedCount: stored.usedCount,
    maxLimit,
    percentage,
    isCooldownActive,
    cooldownEndTimestamp: stored.cooldownEndTimestamp,
    reopenTimeFormatted: formatReopenTime(stored.cooldownEndTimestamp, lang),
    timeLeftFormatted: formatTimeLeft(timeLeftMs, lang),
  };
}

/**
 * Consumes 1 message quota from the browser-local instance.
 * When limit is hit (remaining reaches 0), begins the 6-hour countdown.
 */
export function consumeBrowserQuota(
  isLoggedIn: boolean,
  isPremium: boolean,
  lang: 'en' | 'bn' = 'en'
): { allowed: boolean; state: BrowserQuotaState } {
  if (isPremium) {
    return { allowed: true, state: getBrowserQuota(isLoggedIn, true, lang) };
  }

  const maxLimit = isLoggedIn ? 250 : 50;
  let stored = getStoredData();
  const now = Date.now();

  // Reset if cooldown has passed
  if (stored.cooldownEndTimestamp && now >= stored.cooldownEndTimestamp) {
    stored = { usedCount: 0, cooldownEndTimestamp: null };
  }

  // If cooldown is active, reject
  if (stored.cooldownEndTimestamp && now < stored.cooldownEndTimestamp) {
    saveStoredData(stored);
    return { allowed: false, state: getBrowserQuota(isLoggedIn, isPremium, lang) };
  }

  // Deduct 1
  stored.usedCount += 1;

  // Check if limit is exhausted
  if (stored.usedCount >= maxLimit) {
    stored.cooldownEndTimestamp = now + COOLDOWN_DURATION_MS;
  }

  saveStoredData(stored);

  return {
    allowed: true,
    state: getBrowserQuota(isLoggedIn, isPremium, lang),
  };
}

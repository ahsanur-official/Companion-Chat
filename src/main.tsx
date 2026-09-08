// Ensure window.fetch is safely assignable in sandboxed environments
try {
  const originalFetch = typeof window !== 'undefined' && window.fetch ? window.fetch.bind(window) : undefined;
  let customFetch = originalFetch;
  if (typeof window !== 'undefined') {
    Object.defineProperty(window, 'fetch', {
      get: () => customFetch || originalFetch,
      set: (fn) => {
        customFetch = fn;
      },
      configurable: true,
      enumerable: true,
    });
  }
} catch (e) {
  // Ignore if already configured
}

import {StrictMode} from 'react';
import {createRoot} from 'react-dom/client';
import App from './App.tsx';
import './index.css';

createRoot(document.getElementById('root')!).render(
  <StrictMode>
    <App />
  </StrictMode>,
);

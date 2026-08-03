// Simple client-side event tracking utility
import { auth } from './firebase';

const ANALYTICS_API = '/api/analytics/log';

// Helper to get or create a session ID
function getSessionId(): string {
  let sessionId = sessionStorage.getItem('printalarm_session_id');
  if (!sessionId) {
    sessionId = 'sess_' + Math.random().toString(36).substring(2, 15) + '_' + Date.now();
    sessionStorage.setItem('printalarm_session_id', sessionId);
  }
  return sessionId;
}

export interface UserEventMeta {
  templateId?: number | string;
  templateTitle?: string;
  quantity?: number;
  price?: number;
  clickTarget?: string;
  errorMessage?: string;
  step?: string | number;
  [key: string]: any;
}

let gaInitialized = false;

/**
 * Dynamically initialize Google Analytics GA4 script
 */
export function initGoogleAnalytics(measurementId: string) {
  if (!measurementId || gaInitialized || typeof window === 'undefined') return;

  try {
    const script = document.createElement('script');
    script.async = true;
    script.src = `https://www.googletagmanager.com/gtag/js?id=${measurementId}`;
    document.head.appendChild(script);

    (window as any).dataLayer = (window as any).dataLayer || [];
    function gtag(...args: any[]) {
      (window as any).dataLayer.push(args);
    }
    (window as any).gtag = gtag;

    gtag('js', new Date());
    gtag('config', measurementId, {
      send_page_view: true,
    });

    gaInitialized = true;
    if (import.meta.env.DEV) {
      console.log(`[Google Analytics] Initialized with ID: ${measurementId}`);
    }
  } catch (err) {
    console.error('Failed to initialize Google Analytics:', err);
  }
}

/**
 * Log a user interaction event to the backend and Google Analytics
 */
export async function logUserEvent(eventName: string, meta?: UserEventMeta) {
  try {
    const sessionId = getSessionId();
    const currentPath = window.location.pathname;
    const currentUser = auth.currentUser;
    const userId = currentUser ? currentUser.uid : null;

    const urlParams = new URLSearchParams(window.location.search);
    const utmSource = urlParams.get('utm_source');
    const utmMedium = urlParams.get('utm_medium');
    const utmCampaign = urlParams.get('utm_campaign');

    const enrichedMeta = {
      ...(meta || {}),
      ...(utmSource && { utm_source: utmSource }),
      ...(utmMedium && { utm_medium: utmMedium }),
      ...(utmCampaign && { utm_campaign: utmCampaign }),
      deviceType: /Mobi|Android|iPhone/i.test(navigator.userAgent) ? 'Mobile' : /Tablet|iPad/i.test(navigator.userAgent) ? 'Tablet' : 'Desktop',
      timezone: Intl.DateTimeFormat().resolvedOptions().timeZone,
    };

    // 1. Send to custom backend log
    fetch(ANALYTICS_API, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        eventName,
        path: currentPath,
        sessionId,
        userId,
        meta: enrichedMeta,
      }),
    }).catch(err => {
      if (import.meta.env.DEV) {
        console.warn('Failed to log event to backend:', err);
      }
    });

    // 2. Forward event to Google Analytics (gtag) if connected
    if (typeof window !== 'undefined' && (window as any).gtag) {
      (window as any).gtag('event', eventName, enrichedMeta);
    }

    // 3. Log to console in development
    if (import.meta.env.DEV) {
      console.log(`[Event Tracked] ${eventName} on ${currentPath}:`, {
        sessionId,
        userId,
        meta: enrichedMeta,
      });
    }
  } catch (error) {
    console.error('Analytics tracking error:', error);
  }
}

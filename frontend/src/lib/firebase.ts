import { initializeApp, getApps, type FirebaseApp } from 'firebase/app';
import {
  getAuth,
  signInWithEmailAndPassword,
  createUserWithEmailAndPassword,
  signInWithPopup,
  GoogleAuthProvider,
  signOut as firebaseSignOut,
  sendPasswordResetEmail,
  updateProfile,
  RecaptchaVerifier,
  signInWithPhoneNumber,
  type Auth,
  type User,
} from 'firebase/auth';

const apiKey = import.meta.env.VITE_FIREBASE_API_KEY;

const firebaseConfig = {
  apiKey: apiKey || 'AIzaSyDummyKeyForFallbackInit123456789',
  authDomain: import.meta.env.VITE_FIREBASE_AUTH_DOMAIN || '',
  projectId: import.meta.env.VITE_FIREBASE_PROJECT_ID || '',
  storageBucket: import.meta.env.VITE_FIREBASE_STORAGE_BUCKET || '',
  messagingSenderId: import.meta.env.VITE_FIREBASE_MESSAGING_SENDER_ID || '',
  appId: import.meta.env.VITE_FIREBASE_APP_ID || '',
};

let app: FirebaseApp | null = null;
let authInstance: Auth | null = null;
export let isFirebaseConfigured = false;

try {
  if (apiKey && apiKey !== 'AIzaSyDummyKeyForFallbackInit123456789') {
    app = getApps().length ? getApps()[0] : initializeApp(firebaseConfig);
    authInstance = getAuth(app);
    isFirebaseConfigured = true;
  } else {
    console.warn('[Firebase] VITE_FIREBASE_API_KEY is not configured or is empty. Auth features will run in offline fallback mode.');
  }
} catch (err) {
  console.warn('[Firebase] Failed to initialize Firebase:', err);
}

// Fallback dummy auth object for safe component mounting when Firebase key is absent
const mockAuth: any = {
  currentUser: null,
  onAuthStateChanged: (callback: (user: User | null) => void) => {
    setTimeout(() => callback(null), 0);
    return () => {};
  },
};

export const auth: Auth = (authInstance || mockAuth) as Auth;
export const googleProvider = new GoogleAuthProvider();

if (authInstance) {
  try {
    googleProvider.addScope('email');
    googleProvider.addScope('profile');
  } catch (e) {
    // Ignore scope addition errors on fallback
  }
}

/** Helper to check auth before performing operations */
function ensureAuth() {
  if (!isFirebaseConfigured || !authInstance) {
    throw new Error('Firebase Authentication is not configured. Please set VITE_FIREBASE_API_KEY in your environment variables.');
  }
}

/** Sign in with email and password */
export function loginWithEmail(email: string, password: string) {
  ensureAuth();
  return signInWithEmailAndPassword(authInstance!, email, password);
}

/** Register with email and password */
export async function registerWithEmail(email: string, password: string, displayName: string) {
  ensureAuth();
  const cred = await createUserWithEmailAndPassword(authInstance!, email, password);
  await updateProfile(cred.user, { displayName });
  return cred;
}

/** Sign in with Google popup */
export function loginWithGoogle() {
  ensureAuth();
  return signInWithPopup(authInstance!, googleProvider);
}

/** Sign out */
export function signOut() {
  if (!isFirebaseConfigured || !authInstance) {
    return Promise.resolve();
  }
  return firebaseSignOut(authInstance);
}

/** Send password reset email */
export function resetPassword(email: string) {
  ensureAuth();
  return sendPasswordResetEmail(authInstance!, email);
}

/** Get the current user's ID token for API calls (waits for auth state if refreshing page) */
export async function getIdToken(): Promise<string | null> {
  if (!isFirebaseConfigured || !authInstance) {
    return null;
  }
  if (authInstance.currentUser) {
    return authInstance.currentUser.getIdToken();
  }
  return new Promise((resolve) => {
    const unsubscribe = authInstance!.onAuthStateChanged(async (user) => {
      unsubscribe();
      if (user) {
        try {
          const token = await user.getIdToken();
          resolve(token);
        } catch {
          resolve(null);
        }
      } else {
        resolve(null);
      }
    });
    setTimeout(() => resolve(null), 2000);
  });
}

export type { User };

/** Create invisible Recaptcha Verifier */
export function createRecaptchaVerifier(elementId: string) {
  ensureAuth();
  return new RecaptchaVerifier(authInstance!, elementId, {
    size: 'invisible',
    callback: () => {
      // reCAPTCHA solved
    },
    'expired-callback': () => {
      // reCAPTCHA expired, user must solve it again
    },
  });
}

/** Sign in/up with phone number (sends SMS OTP) */
export function loginWithPhone(phoneNumber: string, appVerifier: RecaptchaVerifier) {
  ensureAuth();
  return signInWithPhoneNumber(authInstance!, phoneNumber, appVerifier);
}


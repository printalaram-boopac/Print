import { initializeApp } from 'firebase/app';
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
  type User,
} from 'firebase/auth';

const firebaseConfig = {
  apiKey: import.meta.env.VITE_FIREBASE_API_KEY,
  authDomain: import.meta.env.VITE_FIREBASE_AUTH_DOMAIN,
  projectId: import.meta.env.VITE_FIREBASE_PROJECT_ID,
  storageBucket: import.meta.env.VITE_FIREBASE_STORAGE_BUCKET,
  messagingSenderId: import.meta.env.VITE_FIREBASE_MESSAGING_SENDER_ID,
  appId: import.meta.env.VITE_FIREBASE_APP_ID,
};

const app = initializeApp(firebaseConfig);
export const auth = getAuth(app);
export const googleProvider = new GoogleAuthProvider();

// Add scopes for Google sign-in
googleProvider.addScope('email');
googleProvider.addScope('profile');

/** Sign in with email and password */
export function loginWithEmail(email: string, password: string) {
  return signInWithEmailAndPassword(auth, email, password);
}

/** Register with email and password */
export async function registerWithEmail(email: string, password: string, displayName: string) {
  const cred = await createUserWithEmailAndPassword(auth, email, password);
  await updateProfile(cred.user, { displayName });
  return cred;
}

/** Sign in with Google popup */
export function loginWithGoogle() {
  return signInWithPopup(auth, googleProvider);
}

/** Sign out */
export function signOut() {
  return firebaseSignOut(auth);
}

/** Send password reset email */
export function resetPassword(email: string) {
  return sendPasswordResetEmail(auth, email);
}

/** Get the current user's ID token for API calls */
export async function getIdToken(): Promise<string | null> {
  const user = auth.currentUser;
  if (!user) return null;
  return user.getIdToken();
}

export type { User };

/** Create invisible Recaptcha Verifier */
export function createRecaptchaVerifier(elementId: string) {
  return new RecaptchaVerifier(auth, elementId, {
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
  return signInWithPhoneNumber(auth, phoneNumber, appVerifier);
}

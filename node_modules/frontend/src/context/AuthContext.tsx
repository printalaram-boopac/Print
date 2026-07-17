import { createContext, useContext, useEffect, useState, useCallback, type ReactNode } from 'react';
import { onAuthStateChanged, updateProfile, RecaptchaVerifier, type ConfirmationResult } from 'firebase/auth';
import {
  auth,
  loginWithEmail,
  registerWithEmail,
  loginWithGoogle,
  signOut as firebaseSignOut,
  resetPassword,
  loginWithPhone,
  type User,
} from '@/lib/firebase';
import { syncUser } from '@/lib/api';

export interface DbUser {
  id: string;
  firebaseUid: string;
  email: string;
  name: string;
  role: 'CUSTOMER' | 'DESIGNER' | 'PRINTER' | 'ADMIN';
  phone: string | null;
  address: string | null;
  avatarUrl: string | null;
  shippingName: string | null;
  shippingPhone: string | null;
  city: string | null;
  state: string | null;
  pincode: string | null;
  lastLoginAt: string | null;
  createdAt: string;
}

interface AuthContextType {
  firebaseUser: User | null;
  dbUser: DbUser | null;
  loading: boolean;
  error: string | null;
  isAdmin: boolean;
  login: (email: string, password: string) => Promise<void>;
  register: (email: string, password: string, name: string) => Promise<void>;
  googleLogin: () => Promise<void>;
  logout: () => Promise<void>;
  forgotPassword: (email: string) => Promise<void>;
  clearError: () => void;
  sendOtpCode: (phoneNumber: string, verifier: RecaptchaVerifier) => Promise<ConfirmationResult>;
  confirmOtpCode: (confirmationResult: ConfirmationResult, code: string, name?: string) => Promise<void>;
}

const AuthContext = createContext<AuthContextType | null>(null);

export function AuthProvider({ children }: { children: ReactNode }) {
  const [firebaseUser, setFirebaseUser] = useState<User | null>(null);
  const [dbUser, setDbUser] = useState<DbUser | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  // Sync Firebase user with backend database
  const syncWithBackend = useCallback(async (user: User) => {
    try {
      const result = await syncUser({
        name: user.displayName || undefined,
        phone: user.phoneNumber || undefined,
        avatarUrl: user.photoURL || undefined,
      });
      setDbUser(result.user);
    } catch (err: any) {
      console.error('[AuthContext] Backend sync failed:', err);
      // Don't block auth if backend is down — set a basic dbUser from Firebase
      setDbUser({
        id: '',
        firebaseUid: user.uid,
        email: user.email || '',
        name: user.displayName || user.email?.split('@')[0] || 'User',
        role: 'CUSTOMER',
        phone: null,
        address: null,
        avatarUrl: user.photoURL,
        shippingName: null,
        shippingPhone: null,
        city: null,
        state: null,
        pincode: null,
        lastLoginAt: null,
        createdAt: new Date().toISOString(),
      });
    }
  }, []);

  // Listen for Firebase auth state changes
  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, async (user) => {
      setFirebaseUser(user);
      if (user) {
        await syncWithBackend(user);
      } else {
        setDbUser(null);
      }
      setLoading(false);
    });
    return () => unsubscribe();
  }, [syncWithBackend]);

  const login = useCallback(async (email: string, password: string) => {
    try {
      setError(null);
      setLoading(true);
      await loginWithEmail(email, password);
    } catch (err: any) {
      setError(getFirebaseErrorMessage(err.code));
      setLoading(false);
      throw err;
    }
  }, []);

  const register = useCallback(async (email: string, password: string, name: string) => {
    try {
      setError(null);
      setLoading(true);
      await registerWithEmail(email, password, name);
    } catch (err: any) {
      setError(getFirebaseErrorMessage(err.code));
      setLoading(false);
      throw err;
    }
  }, []);

  const googleLogin = useCallback(async () => {
    try {
      setError(null);
      setLoading(true);
      await loginWithGoogle();
    } catch (err: any) {
      setError(getFirebaseErrorMessage(err.code));
      setLoading(false);
      throw err;
    }
  }, []);

  const logout = useCallback(async () => {
    await firebaseSignOut();
    setDbUser(null);
  }, []);

  const forgotPassword = useCallback(async (email: string) => {
    try {
      setError(null);
      await resetPassword(email);
    } catch (err: any) {
      setError(getFirebaseErrorMessage(err.code));
      throw err;
    }
  }, []);

  const sendOtpCode = useCallback(async (phoneNumber: string, verifier: RecaptchaVerifier) => {
    try {
      setError(null);
      setLoading(true);
      const confirmationResult = await loginWithPhone(phoneNumber, verifier);
      setLoading(false);
      return confirmationResult;
    } catch (err: any) {
      setError(getFirebaseErrorMessage(err.code));
      setLoading(false);
      throw err;
    }
  }, []);

  const confirmOtpCode = useCallback(async (confirmationResult: ConfirmationResult, code: string, name?: string) => {
    try {
      setError(null);
      setLoading(true);
      const credential = await confirmationResult.confirm(code);
      if (name && credential.user) {
        await updateProfile(credential.user, { displayName: name });
        // Manually trigger sync with backend to ensure the name is registered
        await syncWithBackend(credential.user);
      }
    } catch (err: any) {
      setError(getFirebaseErrorMessage(err.code));
      setLoading(false);
      throw err;
    }
  }, [syncWithBackend]);

  const clearError = useCallback(() => setError(null), []);

  const isAdmin = dbUser?.role === 'ADMIN';

  return (
    <AuthContext.Provider
      value={{
        firebaseUser,
        dbUser,
        loading,
        error,
        isAdmin,
        login,
        register,
        googleLogin,
        logout,
        forgotPassword,
        clearError,
        sendOtpCode,
        confirmOtpCode,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  const ctx = useContext(AuthContext);
  if (!ctx) throw new Error('useAuth must be used within AuthProvider');
  return ctx;
}

/** Map Firebase error codes to user-friendly messages */
function getFirebaseErrorMessage(code: string): string {
  const map: Record<string, string> = {
    'auth/user-not-found': 'No account found with this email address.',
    'auth/wrong-password': 'Incorrect password. Please try again.',
    'auth/invalid-credential': 'Invalid email or password. Please check and try again.',
    'auth/email-already-in-use': 'An account with this email already exists.',
    'auth/weak-password': 'Password must be at least 6 characters long.',
    'auth/invalid-email': 'Please enter a valid email address.',
    'auth/too-many-requests': 'Too many attempts. Please try again later.',
    'auth/popup-closed-by-user': 'Google sign-in was cancelled.',
    'auth/network-request-failed': 'Network error. Please check your connection.',
    'auth/invalid-phone-number': 'Invalid phone number format. Please include country code (e.g. +91).',
    'auth/missing-phone-number': 'Please enter a phone number.',
    'auth/quota-exceeded': 'SMS quota exceeded. Please try again later.',
    'auth/captcha-check-failed': 'reCAPTCHA verification failed. Please try again.',
    'auth/invalid-verification-code': 'Invalid OTP code. Please enter the correct code.',
    'auth/missing-verification-code': 'Please enter the verification code.',
  };
  return map[code] || `An unexpected authentication error occurred (${code || 'unknown'}). Please try again.`;
}

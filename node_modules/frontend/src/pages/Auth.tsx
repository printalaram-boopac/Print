import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import { useAuth } from '@/context/AuthContext';
import { createRecaptchaVerifier } from '@/lib/firebase';

export default function Auth() {
  const navigate = useNavigate();
  const {
    firebaseUser,
    loading,
    error,
    login,
    register,
    googleLogin,
    forgotPassword,
    clearError,
    sendOtpCode,
    confirmOtpCode
  } = useAuth();

  const [mode, setMode] = useState<'login' | 'register' | 'forgot'>('login');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [name, setName] = useState('');
  const [submitting, setSubmitting] = useState(false);
  const [resetSent, setResetSent] = useState(false);

  // Phone Authentication State
  const [authMethod, setAuthMethod] = useState<'email' | 'phone'>('email');
  const [phoneNumber, setPhoneNumber] = useState('+91');
  const [otpCode, setOtpCode] = useState('');
  const [otpSent, setOtpSent] = useState(false);
  const [confirmationResult, setConfirmationResult] = useState<any>(null);
  const [recaptchaVerifier, setRecaptchaVerifier] = useState<any>(null);

  // If already logged in, redirect
  useEffect(() => {
    if (!loading && firebaseUser) navigate('/dashboard', { replace: true });
  }, [loading, firebaseUser, navigate]);

  // Clean up reCAPTCHA on unmount
  useEffect(() => {
    return () => {
      if (recaptchaVerifier) {
        try {
          recaptchaVerifier.clear();
        } catch {}
      }
    };
  }, [recaptchaVerifier]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    clearError();
    setSubmitting(true);
    try {
      if (mode === 'login') {
        await login(email, password);
      } else if (mode === 'register') {
        await register(email, password, name);
      } else {
        await forgotPassword(email);
        setResetSent(true);
      }
    } catch {
      // error is set by context
    } finally {
      setSubmitting(false);
    }
  };

  const handleSendOtp = async (e: React.FormEvent) => {
    e.preventDefault();
    clearError();
    setSubmitting(true);
    let verifier = recaptchaVerifier;
    try {
      if (!verifier) {
        verifier = createRecaptchaVerifier('recaptcha-container');
        setRecaptchaVerifier(verifier);
      }
      let formattedPhone = phoneNumber.replace(/[\s()-]/g, '');
      if (!formattedPhone.startsWith('+')) {
        formattedPhone = '+91' + formattedPhone;
      }
      const result = await sendOtpCode(formattedPhone, verifier);
      setConfirmationResult(result);
      setOtpSent(true);
    } catch (err: any) {
      console.error(err);
      if (verifier) {
        try {
          verifier.clear();
        } catch {}
      }
      setRecaptchaVerifier(null);
    } finally {
      setSubmitting(false);
    }
  };

  const handleVerifyOtp = async (e: React.FormEvent) => {
    e.preventDefault();
    clearError();
    setSubmitting(true);
    try {
      if (!confirmationResult) {
        throw new Error('No verification session found. Please request OTP again.');
      }
      const displayName = mode === 'register' ? name : undefined;
      await confirmOtpCode(confirmationResult, otpCode, displayName);
    } catch (err: any) {
      console.error(err);
    } finally {
      setSubmitting(false);
    }
  };

  const handleGoogleLogin = async () => {
    clearError();
    setSubmitting(true);
    try {
      await googleLogin();
    } catch {
      // error is set by context
    } finally {
      setSubmitting(false);
    }
  };

  const switchMode = (m: 'login' | 'register' | 'forgot') => {
    clearError();
    setResetSent(false);
    setOtpSent(false);
    setOtpCode('');
    setConfirmationResult(null);
    setMode(m);
  };

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-luxury-black">
        <div className="w-10 h-10 border-2 border-luxury-gold border-t-transparent rounded-full animate-spin" />
      </div>
    );
  }

  return (
    <div className="min-h-screen flex items-center justify-center bg-luxury-black text-luxury-accent px-4 relative overflow-hidden pt-12">
      {/* Background decoration */}
      <div className="aurora-bg">
        <div className="aurora-blob" style={{ width: 400, height: 400, top: '20%', left: '10%', background: 'radial-gradient(circle, #D4AF37, transparent)' }} />
        <div className="aurora-blob" style={{ width: 300, height: 300, bottom: '10%', right: '15%', background: 'radial-gradient(circle, #3D1E30, transparent)', animationDelay: '3s' }} />
      </div>

      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="w-full max-w-md glass-panel p-8 rounded-lg space-y-6 relative z-10"
      >
        {/* Header */}
        <div className="text-center space-y-2">
          <h2 className="text-3xl font-display text-gold-gradient font-bold">
            {mode === 'login' ? 'Welcome Back' : mode === 'register' ? 'Join PrintAlarm' : 'Reset Password'}
          </h2>
          <p className="text-xs text-gray-500">
            {mode === 'login'
              ? 'Sign in to access your customized Shagun covers and dashboard'
              : mode === 'register'
                ? 'Create an account to start designing custom luxury covers'
                : 'Enter your email to receive a password reset link'}
          </p>
        </div>

        {/* Error */}
        <AnimatePresence>
          {error && (
            <motion.div
              initial={{ opacity: 0, y: -10 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0 }}
              className="p-3 bg-red-50 border border-red-200 text-red-700 text-xs rounded flex items-center gap-2"
            >
              <span>⚠️</span> {error}
            </motion.div>
          )}
          {resetSent && (
            <motion.div
              initial={{ opacity: 0, y: -10 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0 }}
              className="p-3 bg-green-50 border border-green-200 text-green-700 text-xs rounded"
            >
              ✓ Password reset email sent! Check your inbox.
            </motion.div>
          )}
        </AnimatePresence>

        {/* Auth Method Selector */}
        {mode !== 'forgot' && (
          <div className="grid grid-cols-2 p-1 bg-luxury-black/60 border border-luxury-accent/10 rounded-sm bg-opacity-60 backdrop-blur-md">
            <button
              onClick={() => { setAuthMethod('email'); clearError(); }}
              className={`py-2 text-xs font-semibold tracking-wider transition-all uppercase cursor-pointer rounded-sm ${authMethod === 'email' ? 'bg-luxury-gold text-luxury-black font-bold' : 'text-gray-400 hover:text-luxury-accent'}`}
            >
              Email & Google
            </button>
            <button
              onClick={() => { setAuthMethod('phone'); clearError(); }}
              className={`py-2 text-xs font-semibold tracking-wider transition-all uppercase cursor-pointer rounded-sm ${authMethod === 'phone' ? 'bg-luxury-gold text-luxury-black font-bold' : 'text-gray-400 hover:text-luxury-accent'}`}
            >
              Phone Number
            </button>
          </div>
        )}

        {/* Google Sign-In Button */}
        {mode !== 'forgot' && authMethod === 'email' && (
          <button
            onClick={handleGoogleLogin}
            disabled={submitting}
            className="w-full flex items-center justify-center gap-3 py-3 bg-white border border-gray-200 text-gray-700 font-medium text-sm rounded-sm hover:bg-gray-50 hover:border-gray-300 transition-all cursor-pointer disabled:opacity-50"
          >
            <svg width="18" height="18" viewBox="0 0 18 18" xmlns="http://www.w3.org/2000/svg">
              <path d="M17.64 9.2c0-.637-.057-1.251-.164-1.84H9v3.481h4.844a4.14 4.14 0 01-1.796 2.716v2.259h2.908c1.702-1.567 2.684-3.875 2.684-6.615z" fill="#4285F4" />
              <path d="M9 18c2.43 0 4.467-.806 5.956-2.18l-2.908-2.259c-.806.54-1.837.86-3.048.86-2.344 0-4.328-1.584-5.036-3.711H.957v2.332A8.997 8.997 0 009 18z" fill="#34A853" />
              <path d="M3.964 10.71A5.41 5.41 0 013.682 9c0-.593.102-1.17.282-1.71V4.958H.957A8.996 8.996 0 000 9c0 1.452.348 2.827.957 4.042l3.007-2.332z" fill="#FBBC05" />
              <path d="M9 3.58c1.321 0 2.508.454 3.44 1.345l2.582-2.58C13.463.891 11.426 0 9 0A8.997 8.997 0 00.957 4.958L3.964 7.29C4.672 5.163 6.656 3.58 9 3.58z" fill="#EA4335" />
            </svg>
            {submitting ? 'Signing in...' : 'Continue with Google'}
          </button>
        )}

        {/* Divider */}
        {mode !== 'forgot' && authMethod === 'email' && (
          <div className="flex items-center gap-3">
            <div className="flex-1 h-px bg-gray-200" />
            <span className="text-[10px] text-gray-400 uppercase tracking-widest">or</span>
            <div className="flex-1 h-px bg-gray-200" />
          </div>
        )}

        {/* Forms */}
        {authMethod === 'email' || mode === 'forgot' ? (
          <form className="space-y-4" onSubmit={handleSubmit}>
            {mode === 'register' && (
              <div className="space-y-1">
                <label className="text-[10px] uppercase tracking-widest text-luxury-accent/80 font-bold">Full Name</label>
                <input type="text" required value={name} onChange={(e) => setName(e.target.value)}
                  placeholder="Enter your name"
                  className="w-full bg-luxury-black border border-luxury-accent/20 p-2.5 text-sm text-luxury-accent focus:outline-none focus:border-luxury-gold transition-colors placeholder:text-gray-400 rounded-sm" />
              </div>
            )}

            <div className="space-y-1">
              <label className="text-[10px] uppercase tracking-widest text-luxury-accent/80 font-bold">Email Address</label>
              <input type="email" required value={email} onChange={(e) => setEmail(e.target.value)}
                placeholder="name@example.com"
                className="w-full bg-luxury-black border border-luxury-accent/20 p-2.5 text-sm text-luxury-accent focus:outline-none focus:border-luxury-gold transition-colors placeholder:text-gray-400 rounded-sm" />
            </div>

            {mode !== 'forgot' && (
              <div className="space-y-1">
                <div className="flex justify-between items-center">
                  <label className="text-[10px] uppercase tracking-widest text-luxury-accent/80 font-bold">Password</label>
                  {mode === 'login' && (
                    <button type="button" onClick={() => switchMode('forgot')}
                      className="text-[10px] text-luxury-gold hover:underline cursor-pointer">Forgot?</button>
                  )}
                </div>
                <input type="password" required minLength={6} value={password} onChange={(e) => setPassword(e.target.value)}
                  placeholder="••••••••"
                  className="w-full bg-luxury-black border border-luxury-accent/20 p-2.5 text-sm text-luxury-accent focus:outline-none focus:border-luxury-gold transition-colors placeholder:text-gray-400 rounded-sm" />
              </div>
            )}

            <button
              type="submit"
              disabled={submitting}
              className="w-full py-3 bg-luxury-accent text-white font-semibold tracking-wider text-xs gold-glow cursor-pointer hover:bg-luxury-accent/90 transition-colors uppercase rounded-sm disabled:opacity-50"
            >
              {submitting ? (
                <span className="flex items-center justify-center gap-2">
                  <span className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                  Processing...
                </span>
              ) : mode === 'login' ? 'SIGN IN' : mode === 'register' ? 'CREATE ACCOUNT' : 'SEND RESET LINK'}
            </button>
          </form>
        ) : (
          <form className="space-y-4" onSubmit={otpSent ? handleVerifyOtp : handleSendOtp}>
            {!otpSent ? (
              <>
                {mode === 'register' && (
                  <div className="space-y-1">
                    <label className="text-[10px] uppercase tracking-widest text-luxury-accent/80 font-bold">Full Name</label>
                    <input type="text" required value={name} onChange={(e) => setName(e.target.value)}
                      placeholder="Enter your name"
                      className="w-full bg-luxury-black border border-luxury-accent/20 p-2.5 text-sm text-luxury-accent focus:outline-none focus:border-luxury-gold transition-colors placeholder:text-gray-400 rounded-sm" />
                  </div>
                )}
                <div className="space-y-1">
                  <label className="text-[10px] uppercase tracking-widest text-luxury-accent/80 font-bold">Phone Number</label>
                  <input type="tel" required value={phoneNumber} onChange={(e) => setPhoneNumber(e.target.value)}
                    placeholder="+91 98765 43210"
                    className="w-full bg-luxury-black border border-luxury-accent/20 p-2.5 text-sm text-luxury-accent focus:outline-none focus:border-luxury-gold transition-colors placeholder:text-gray-400 rounded-sm" />
                  <p className="text-[10px] text-gray-500 mt-1">Please include country code (e.g. +91 for India)</p>
                </div>
                <button
                  type="submit"
                  disabled={submitting}
                  className="w-full py-3 bg-luxury-accent text-white font-semibold tracking-wider text-xs gold-glow cursor-pointer hover:bg-luxury-accent/90 transition-colors uppercase rounded-sm disabled:opacity-50"
                >
                  {submitting ? (
                    <span className="flex items-center justify-center gap-2">
                      <span className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                      Sending OTP...
                    </span>
                  ) : 'SEND OTP'}
                </button>
              </>
            ) : (
              <>
                <div className="space-y-1 text-center py-2">
                  <p className="text-sm text-gray-400">
                    OTP sent to <span className="text-luxury-gold font-medium">{phoneNumber}</span>
                  </p>
                  <button type="button" onClick={() => { setOtpSent(false); setOtpCode(''); }}
                    className="text-xs text-luxury-gold hover:underline cursor-pointer">
                    Change Phone Number
                  </button>
                </div>
                <div className="space-y-1">
                  <label className="text-[10px] uppercase tracking-widest text-luxury-accent/80 font-bold">Verification Code (OTP)</label>
                  <input type="text" required maxLength={6} pattern="[0-9]{6}" value={otpCode} onChange={(e) => setOtpCode(e.target.value)}
                    placeholder="123456"
                    className="w-full bg-luxury-black border border-luxury-accent/20 p-2.5 text-sm text-luxury-accent focus:outline-none focus:border-luxury-gold transition-colors placeholder:text-gray-400 rounded-sm text-center tracking-widest text-lg font-bold" />
                </div>
                <button
                  type="submit"
                  disabled={submitting}
                  className="w-full py-3 bg-luxury-accent text-white font-semibold tracking-wider text-xs gold-glow cursor-pointer hover:bg-luxury-accent/90 transition-colors uppercase rounded-sm disabled:opacity-50"
                >
                  {submitting ? (
                    <span className="flex items-center justify-center gap-2">
                      <span className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                      Verifying...
                    </span>
                  ) : 'VERIFY & SIGN IN'}
                </button>
              </>
            )}
          </form>
        )}

        {/* ReCAPTCHA container for Phone Auth */}
        <div id="recaptcha-container"></div>

        {/* Toggle links */}
        <div className="text-center pt-2 space-y-2">
          {mode === 'login' && (
            <button onClick={() => switchMode('register')}
              className="text-xs text-gray-500 hover:text-luxury-gold transition-colors cursor-pointer block mx-auto">
              Don't have an account? <span className="text-luxury-gold font-medium">Sign Up</span>
            </button>
          )}
          {mode === 'register' && (
            <button onClick={() => switchMode('login')}
              className="text-xs text-gray-500 hover:text-luxury-gold transition-colors cursor-pointer block mx-auto">
              Already have an account? <span className="text-luxury-gold font-medium">Sign In</span>
            </button>
          )}
          {mode === 'forgot' && (
            <button onClick={() => switchMode('login')}
              className="text-xs text-gray-500 hover:text-luxury-gold transition-colors cursor-pointer block mx-auto">
              ← Back to <span className="text-luxury-gold font-medium">Sign In</span>
            </button>
          )}
        </div>
      </motion.div>
    </div>
  );
}

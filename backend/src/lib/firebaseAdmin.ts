import admin from 'firebase-admin';
import dotenv from 'dotenv';

dotenv.config();

// Initialize Firebase Admin SDK
// In production, use service account credentials from environment variables
const serviceAccount = {
  projectId: process.env.FIREBASE_PROJECT_ID,
  clientEmail: process.env.FIREBASE_CLIENT_EMAIL,
  // The private key comes as a string with escaped newlines from .env
  privateKey: process.env.FIREBASE_PRIVATE_KEY?.replace(/\\n/g, '\n'),
};

if (!admin.apps.length) {
  try {
    if (serviceAccount.projectId && serviceAccount.privateKey) {
      admin.initializeApp({
        credential: admin.credential.cert(serviceAccount as admin.ServiceAccount),
      });
    } else {
      admin.initializeApp();
    }
  } catch (err) {
    console.warn('[Firebase Admin] Initialization fallback warning:', err);
  }
}

export const firebaseAuth = admin.auth();

/**
 * Verify a Firebase ID token and return the decoded claims
 */
export async function verifyIdToken(idToken: string) {
  try {
    const decoded = await firebaseAuth.verifyIdToken(idToken);
    return decoded;
  } catch (error) {
    console.error('[Firebase Admin] Token verification failed:', error);
    throw error;
  }
}

export default admin;

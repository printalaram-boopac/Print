"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.firebaseAuth = void 0;
exports.verifyIdToken = verifyIdToken;
const firebase_admin_1 = __importDefault(require("firebase-admin"));
const dotenv_1 = __importDefault(require("dotenv"));
dotenv_1.default.config();
// Initialize Firebase Admin SDK
// In production, use service account credentials from environment variables
const serviceAccount = {
    projectId: process.env.FIREBASE_PROJECT_ID,
    clientEmail: process.env.FIREBASE_CLIENT_EMAIL,
    // The private key comes as a string with escaped newlines from .env
    privateKey: process.env.FIREBASE_PRIVATE_KEY?.replace(/\\n/g, '\n'),
};
if (!firebase_admin_1.default.apps.length) {
    firebase_admin_1.default.initializeApp({
        credential: firebase_admin_1.default.credential.cert(serviceAccount),
    });
}
exports.firebaseAuth = firebase_admin_1.default.auth();
/**
 * Verify a Firebase ID token and return the decoded claims
 */
async function verifyIdToken(idToken) {
    try {
        const decoded = await exports.firebaseAuth.verifyIdToken(idToken);
        return decoded;
    }
    catch (error) {
        console.error('[Firebase Admin] Token verification failed:', error);
        throw error;
    }
}
exports.default = firebase_admin_1.default;

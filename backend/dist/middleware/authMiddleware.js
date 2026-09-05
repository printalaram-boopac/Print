"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.authenticate = authenticate;
exports.requireAdmin = requireAdmin;
const firebaseAdmin_1 = require("../lib/firebaseAdmin");
const prisma_1 = __importDefault(require("../lib/prisma"));
/**
 * Middleware: Authenticate requests using Firebase ID token
 * Extracts Bearer token from Authorization header and verifies with Firebase Admin
 */
async function authenticate(req, res, next) {
    try {
        const authHeader = req.headers.authorization;
        if (!authHeader || !authHeader.startsWith('Bearer ')) {
            return res.status(401).json({
                status: 'error',
                message: 'Missing or invalid Authorization header. Expected: Bearer <token>',
            });
        }
        const idToken = authHeader.split('Bearer ')[1];
        const decoded = await (0, firebaseAdmin_1.verifyIdToken)(idToken);
        // Allow phone authenticated users (who do not have an email address)
        const firebaseEmail = decoded.email || `phone-${decoded.uid}@printalarm.com`;
        // Attach Firebase user info to the request
        req.firebaseUser = {
            uid: decoded.uid,
            email: firebaseEmail,
            phoneNumber: decoded.phone_number,
        };
        // Look up the database user
        const dbUser = await prisma_1.default.user.findUnique({
            where: { firebaseUid: decoded.uid },
        });
        if (dbUser) {
            req.dbUser = dbUser;
        }
        next();
    }
    catch (error) {
        console.error('[Auth Middleware] Authentication failed:', error.message);
        return res.status(401).json({
            status: 'error',
            message: 'Invalid or expired authentication token',
        });
    }
}
/**
 * Middleware: Require the authenticated user to have the ADMIN role
 * Must be used AFTER the `authenticate` middleware
 */
function requireAdmin(req, res, next) {
    if (!req.dbUser) {
        return res.status(401).json({
            status: 'error',
            message: 'User not found in database. Please login again.',
        });
    }
    if (req.dbUser.role !== 'ADMIN') {
        return res.status(403).json({
            status: 'error',
            message: 'Access denied. Admin privileges required.',
        });
    }
    next();
}

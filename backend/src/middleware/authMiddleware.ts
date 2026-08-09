import { Request, Response, NextFunction } from 'express';
import { verifyIdToken } from '../lib/firebaseAdmin';
import { Role } from '@prisma/client';
import prisma from '../lib/prisma';

// Extend Express Request to include authenticated user info
declare global {
  namespace Express {
    interface Request {
      firebaseUser?: {
        uid: string;
        email: string;
        phoneNumber?: string;
      };
      dbUser?: {
        id: string;
        firebaseUid: string;
        email: string;
        name: string;
        role: Role;
        phone: string | null;
        address: string | null;
        avatarUrl: string | null;
        shippingName: string | null;
        shippingPhone: string | null;
        city: string | null;
        state: string | null;
        pincode: string | null;
      };
    }
  }
}

/**
 * Middleware: Authenticate requests using Firebase ID token
 * Extracts Bearer token from Authorization header and verifies with Firebase Admin
 */
export async function authenticate(req: Request, res: Response, next: NextFunction) {
  try {
    const authHeader = req.headers.authorization;

    if (!authHeader || !authHeader.startsWith('Bearer ')) {
      return res.status(401).json({
        status: 'error',
        message: 'Missing or invalid Authorization header. Expected: Bearer <token>',
      });
    }

    const idToken = authHeader.split('Bearer ')[1];
    const decoded = await verifyIdToken(idToken);

    // Allow phone authenticated users (who do not have an email address)
    const firebaseEmail = decoded.email || `phone-${decoded.uid}@printalarm.com`;

    // Attach Firebase user info to the request
    req.firebaseUser = {
      uid: decoded.uid,
      email: firebaseEmail,
      phoneNumber: decoded.phone_number,
    };

    // Look up the database user
    const dbUser = await prisma.user.findUnique({
      where: { firebaseUid: decoded.uid },
    });

    if (dbUser) {
      req.dbUser = dbUser;
    }

    next();
  } catch (error: any) {
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
export function requireAdmin(req: Request, res: Response, next: NextFunction) {
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

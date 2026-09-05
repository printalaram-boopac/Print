"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = require("express");
const authMiddleware_1 = require("../middleware/authMiddleware");
const prisma_1 = __importDefault(require("../lib/prisma"));
const router = (0, express_1.Router)();
// List of admin emails from environment config
const ADMIN_EMAILS = (process.env.ADMIN_EMAILS || 'admin@printalarm.com')
    .split(',')
    .map((e) => e.trim().toLowerCase());
/**
 * POST /api/auth/sync
 * Syncs a Firebase authenticated user with the Supabase/Prisma database.
 * Creates the user on first login, updates lastLoginAt on subsequent logins.
 * Returns the full user profile including role.
 */
router.post('/sync', authMiddleware_1.authenticate, async (req, res) => {
    try {
        const { uid, email, phoneNumber } = req.firebaseUser;
        const { name, phone, avatarUrl } = req.body;
        const finalPhone = phone || phoneNumber || null;
        // Check if user already exists
        let user = await prisma_1.default.user.findUnique({
            where: { firebaseUid: uid },
        });
        if (user) {
            // Update last login and any provided profile fields
            user = await prisma_1.default.user.update({
                where: { firebaseUid: uid },
                data: {
                    lastLoginAt: new Date(),
                    ...(name && { name }),
                    ...(finalPhone && { phone: finalPhone }),
                    ...(avatarUrl && { avatarUrl }),
                },
            });
        }
        else {
            // Determine role — check if email is in admin list
            const isAdmin = ADMIN_EMAILS.includes(email.toLowerCase());
            const role = isAdmin ? 'ADMIN' : 'CUSTOMER';
            // Create new user record
            user = await prisma_1.default.user.create({
                data: {
                    firebaseUid: uid,
                    email: email,
                    name: name || finalPhone || email.split('@')[0],
                    phone: finalPhone,
                    avatarUrl: avatarUrl || null,
                    role,
                    lastLoginAt: new Date(),
                },
            });
            // Log the new user creation
            await prisma_1.default.auditLog.create({
                data: {
                    userId: user.id,
                    action: 'USER_REGISTERED',
                    details: `New ${role} user registered: ${email}`,
                    ipAddress: req.ip || 'unknown',
                },
            });
        }
        return res.status(200).json({
            status: 'ok',
            user: {
                id: user.id,
                firebaseUid: user.firebaseUid,
                email: user.email,
                name: user.name,
                role: user.role,
                phone: user.phone,
                address: user.address,
                avatarUrl: user.avatarUrl,
                shippingName: user.shippingName,
                shippingPhone: user.shippingPhone,
                city: user.city,
                state: user.state,
                pincode: user.pincode,
                lastLoginAt: user.lastLoginAt,
                createdAt: user.createdAt,
            },
        });
    }
    catch (error) {
        console.error('[Auth Sync] Error:', error);
        return res.status(500).json({
            status: 'error',
            message: error.message || 'Failed to sync user',
        });
    }
});
/**
 * GET /api/auth/me
 * Returns the current authenticated user's profile
 */
router.get('/me', authMiddleware_1.authenticate, async (req, res) => {
    try {
        if (!req.dbUser) {
            return res.status(404).json({
                status: 'error',
                message: 'User not found. Please sync first.',
            });
        }
        // Fetch full user data including new fields
        const fullUser = await prisma_1.default.user.findUnique({
            where: { id: req.dbUser.id },
            select: {
                id: true, firebaseUid: true, email: true, name: true, role: true,
                phone: true, address: true, avatarUrl: true,
                shippingName: true, shippingPhone: true, city: true, state: true, pincode: true,
                lastLoginAt: true, createdAt: true, updatedAt: true,
                _count: { select: { orders: true, designs: true, reviews: true } },
            },
        });
        return res.status(200).json({
            status: 'ok',
            user: fullUser,
        });
    }
    catch (error) {
        return res.status(500).json({
            status: 'error',
            message: error.message || 'Failed to fetch profile',
        });
    }
});
/**
 * PATCH /api/auth/profile
 * Update current user's profile fields including structured shipping address
 */
router.patch('/profile', authMiddleware_1.authenticate, async (req, res) => {
    try {
        if (!req.dbUser) {
            return res.status(404).json({ status: 'error', message: 'User not found' });
        }
        const { name, phone, address, shippingName, shippingPhone, city, state, pincode, avatarUrl } = req.body;
        const updated = await prisma_1.default.user.update({
            where: { id: req.dbUser.id },
            data: {
                ...(name !== undefined && { name }),
                ...(phone !== undefined && { phone }),
                ...(address !== undefined && { address }),
                ...(shippingName !== undefined && { shippingName }),
                ...(shippingPhone !== undefined && { shippingPhone }),
                ...(city !== undefined && { city }),
                ...(state !== undefined && { state }),
                ...(pincode !== undefined && { pincode }),
                ...(avatarUrl !== undefined && { avatarUrl }),
            },
        });
        return res.status(200).json({ status: 'ok', user: updated });
    }
    catch (error) {
        return res.status(500).json({
            status: 'error',
            message: error.message || 'Failed to update profile',
        });
    }
});
/**
 * GET /api/auth/profile/orders
 * Get current user's full order history with design details
 */
router.get('/profile/orders', authMiddleware_1.authenticate, async (req, res) => {
    try {
        if (!req.dbUser) {
            return res.status(404).json({ status: 'error', message: 'User not found' });
        }
        const orders = await prisma_1.default.order.findMany({
            where: { userId: req.dbUser.id },
            include: {
                design: {
                    select: {
                        id: true, title: true, previewUrl: true, theme: true, occasion: true,
                        photoUrl: true, coupleName: true, familyName: true, greetingText: true,
                    },
                },
                payments: { select: { id: true, status: true, amount: true, createdAt: true } },
            },
            orderBy: { createdAt: 'desc' },
        });
        return res.status(200).json({ status: 'ok', orders });
    }
    catch (error) {
        return res.status(500).json({ status: 'error', message: error.message });
    }
});
/**
 * GET /api/auth/profile/designs
 * Get current user's design gallery
 */
router.get('/profile/designs', authMiddleware_1.authenticate, async (req, res) => {
    try {
        if (!req.dbUser) {
            return res.status(404).json({ status: 'error', message: 'User not found' });
        }
        const designs = await prisma_1.default.coverDesign.findMany({
            where: { userId: req.dbUser.id },
            include: {
                template: { select: { id: true, title: true, thumbnail: true, category: true } },
            },
            orderBy: { createdAt: 'desc' },
        });
        return res.status(200).json({ status: 'ok', designs });
    }
    catch (error) {
        return res.status(500).json({ status: 'error', message: error.message });
    }
});
exports.default = router;

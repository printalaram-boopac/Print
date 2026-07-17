"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = require("express");
const client_1 = require("@prisma/client");
const authMiddleware_1 = require("../middleware/authMiddleware");
const router = (0, express_1.Router)();
const prisma = new client_1.PrismaClient();
/**
 * GET /api/payments
 * Admin: all payments | Customer: own order payments
 */
router.get('/', authMiddleware_1.authenticate, async (req, res) => {
    try {
        if (!req.dbUser)
            return res.status(401).json({ status: 'error', message: 'User not found' });
        const { status, page = '1', limit = '20' } = req.query;
        const skip = (parseInt(page) - 1) * parseInt(limit);
        const where = {};
        if (req.dbUser.role !== 'ADMIN')
            where.order = { userId: req.dbUser.id };
        if (status && status !== 'ALL')
            where.status = status;
        const [payments, total] = await Promise.all([
            prisma.payment.findMany({
                where,
                include: {
                    order: {
                        select: { id: true, customerName: true, totalAmount: true, status: true,
                            user: { select: { name: true, email: true } } },
                    },
                },
                orderBy: { createdAt: 'desc' }, skip, take: parseInt(limit),
            }),
            prisma.payment.count({ where }),
        ]);
        return res.json({
            status: 'ok', payments,
            pagination: { page: parseInt(page), limit: parseInt(limit), total,
                totalPages: Math.ceil(total / parseInt(limit)) },
        });
    }
    catch (error) {
        return res.status(500).json({ status: 'error', message: error.message });
    }
});
exports.default = router;

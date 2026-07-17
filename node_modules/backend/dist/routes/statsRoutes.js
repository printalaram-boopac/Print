"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = require("express");
const client_1 = require("@prisma/client");
const authMiddleware_1 = require("../middleware/authMiddleware");
const router = (0, express_1.Router)();
const prisma = new client_1.PrismaClient();
/** GET /api/stats — Admin dashboard aggregate stats */
router.get('/', authMiddleware_1.authenticate, authMiddleware_1.requireAdmin, async (req, res) => {
    try {
        const [totalUsers, totalOrders, totalTemplates, pendingOrders, inProductionOrders, deliveredOrders, recentOrders, allOrderAmounts,] = await Promise.all([
            prisma.user.count(),
            prisma.order.count(),
            prisma.coverTemplate.count(),
            prisma.order.count({ where: { status: 'PENDING' } }),
            prisma.order.count({ where: { status: 'IN_PRODUCTION' } }),
            prisma.order.count({ where: { status: 'DELIVERED' } }),
            prisma.order.findMany({ orderBy: { createdAt: 'desc' }, take: 5,
                select: { id: true, customerName: true, totalAmount: true, status: true, createdAt: true } }),
            prisma.order.findMany({ where: { status: { not: 'CANCELLED' } }, select: { totalAmount: true } }),
        ]);
        const totalRevenue = allOrderAmounts.reduce((s, o) => s + o.totalAmount, 0);
        return res.json({
            status: 'ok',
            stats: {
                totalUsers, totalOrders, totalTemplates, totalRevenue,
                pendingOrders, inProductionOrders, deliveredOrders,
                recentOrders,
            },
        });
    }
    catch (error) {
        return res.status(500).json({ status: 'error', message: error.message });
    }
});
exports.default = router;

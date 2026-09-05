"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = require("express");
const authMiddleware_1 = require("../middleware/authMiddleware");
const prisma_1 = __importDefault(require("../lib/prisma"));
const router = (0, express_1.Router)();
/** GET /api/stats — Admin dashboard aggregate stats */
router.get('/', authMiddleware_1.authenticate, authMiddleware_1.requireAdmin, async (req, res) => {
    try {
        const [totalUsers, totalOrders, totalTemplates, pendingOrders, inProductionOrders, deliveredOrders, recentOrders, allOrderAmounts,] = await Promise.all([
            prisma_1.default.user.count(),
            prisma_1.default.order.count(),
            prisma_1.default.coverTemplate.count(),
            prisma_1.default.order.count({ where: { status: 'PENDING' } }),
            prisma_1.default.order.count({ where: { status: 'IN_PRODUCTION' } }),
            prisma_1.default.order.count({ where: { status: 'DELIVERED' } }),
            prisma_1.default.order.findMany({ orderBy: { createdAt: 'desc' }, take: 5,
                select: { id: true, customerName: true, totalAmount: true, status: true, createdAt: true } }),
            prisma_1.default.order.findMany({ where: { status: { not: 'CANCELLED' } }, select: { totalAmount: true } }),
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

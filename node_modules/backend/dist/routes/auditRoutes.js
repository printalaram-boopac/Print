"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = require("express");
const client_1 = require("@prisma/client");
const authMiddleware_1 = require("../middleware/authMiddleware");
const router = (0, express_1.Router)();
const prisma = new client_1.PrismaClient();
/** GET /api/audit-logs — Admin only */
router.get('/', authMiddleware_1.authenticate, authMiddleware_1.requireAdmin, async (req, res) => {
    try {
        const { page = '1', limit = '30' } = req.query;
        const skip = (parseInt(page) - 1) * parseInt(limit);
        const [logs, total] = await Promise.all([
            prisma.auditLog.findMany({
                include: { user: { select: { name: true, email: true } } },
                orderBy: { createdAt: 'desc' }, skip, take: parseInt(limit),
            }),
            prisma.auditLog.count(),
        ]);
        return res.json({
            status: 'ok', logs,
            pagination: { page: parseInt(page), limit: parseInt(limit), total,
                totalPages: Math.ceil(total / parseInt(limit)) },
        });
    }
    catch (error) {
        return res.status(500).json({ status: 'error', message: error.message });
    }
});
exports.default = router;

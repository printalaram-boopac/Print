import { Router, Request, Response } from 'express';
import { authenticate, requireAdmin } from '../middleware/authMiddleware';
import prisma from '../lib/prisma';

const router = Router();

/** GET /api/stats — Admin dashboard aggregate stats */
router.get('/', authenticate, requireAdmin, async (req: Request, res: Response) => {
  try {
    const [
      totalUsers, totalOrders, totalTemplates,
      pendingOrders, inProductionOrders, deliveredOrders,
      recentOrders, allOrderAmounts,
    ] = await Promise.all([
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
  } catch (error: any) {
    return res.status(500).json({ status: 'error', message: error.message });
  }
});

export default router;

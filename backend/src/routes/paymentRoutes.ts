import { Router, Request, Response } from 'express';
import { authenticate, requireAdmin } from '../middleware/authMiddleware';
import prisma from '../lib/prisma';

const router = Router();

/**
 * GET /api/payments
 * Admin: all payments | Customer: own order payments
 */
router.get('/', authenticate, async (req: Request, res: Response) => {
  try {
    if (!req.dbUser) return res.status(401).json({ status: 'error', message: 'User not found' });

    const { status, page = '1', limit = '20' } = req.query;
    const skip = (parseInt(page as string) - 1) * parseInt(limit as string);
    const where: any = {};

    if (req.dbUser.role !== 'ADMIN') where.order = { userId: req.dbUser.id };
    if (status && status !== 'ALL') where.status = status;

    const [payments, total] = await Promise.all([
      prisma.payment.findMany({
        where,
        include: {
          order: {
            select: { id: true, customerName: true, totalAmount: true, status: true,
              user: { select: { name: true, email: true } } },
          },
        },
        orderBy: { createdAt: 'desc' }, skip, take: parseInt(limit as string),
      }),
      prisma.payment.count({ where }),
    ]);

    return res.json({
      status: 'ok', payments,
      pagination: { page: parseInt(page as string), limit: parseInt(limit as string), total,
        totalPages: Math.ceil(total / parseInt(limit as string)) },
    });
  } catch (error: any) {
    return res.status(500).json({ status: 'error', message: error.message });
  }
});

export default router;

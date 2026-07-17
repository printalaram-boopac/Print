import { Router, Request, Response } from 'express';
import { PrismaClient } from '@prisma/client';
import { authenticate, requireAdmin } from '../middleware/authMiddleware';

const router = Router();
const prisma = new PrismaClient();

/** GET /api/audit-logs — Admin only */
router.get('/', authenticate, requireAdmin, async (req: Request, res: Response) => {
  try {
    const { page = '1', limit = '30' } = req.query;
    const skip = (parseInt(page as string) - 1) * parseInt(limit as string);

    const [logs, total] = await Promise.all([
      prisma.auditLog.findMany({
        include: { user: { select: { name: true, email: true } } },
        orderBy: { createdAt: 'desc' }, skip, take: parseInt(limit as string),
      }),
      prisma.auditLog.count(),
    ]);

    return res.json({
      status: 'ok', logs,
      pagination: { page: parseInt(page as string), limit: parseInt(limit as string), total,
        totalPages: Math.ceil(total / parseInt(limit as string)) },
    });
  } catch (error: any) {
    return res.status(500).json({ status: 'error', message: error.message });
  }
});

export default router;

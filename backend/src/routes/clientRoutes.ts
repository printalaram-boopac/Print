import { Router, Request, Response } from 'express';
import { authenticate, requireAdmin } from '../middleware/authMiddleware';
import prisma from '../lib/prisma';

const router = Router();

/**
 * GET /api/clients
 * Admin-only: list all registered clients with order stats
 */
router.get('/', authenticate, requireAdmin, async (req: Request, res: Response) => {
  try {
    const { search, page = '1', limit = '20' } = req.query;
    const pageNum = parseInt(page as string, 10);
    const limitNum = parseInt(limit as string, 10);
    const skip = (pageNum - 1) * limitNum;

    const where: any = {};

    if (search) {
      where.OR = [
        { name: { contains: search as string, mode: 'insensitive' } },
        { email: { contains: search as string, mode: 'insensitive' } },
        { phone: { contains: search as string, mode: 'insensitive' } },
      ];
    }

    const [clients, total] = await Promise.all([
      prisma.user.findMany({
        where,
        select: {
          id: true,
          firebaseUid: true,
          email: true,
          name: true,
          phone: true,
          address: true,
          avatarUrl: true,
          role: true,
          shippingName: true,
          shippingPhone: true,
          city: true,
          state: true,
          pincode: true,
          lastLoginAt: true,
          createdAt: true,
          _count: {
            select: { orders: true, designs: true, reviews: true },
          },
          orders: {
            select: { totalAmount: true, status: true },
          },
        },
        orderBy: { createdAt: 'desc' },
        skip,
        take: limitNum,
      }),
      prisma.user.count({ where }),
    ]);

    // Compute aggregated stats for each client
    const clientsWithStats = clients.map((client) => {
      const totalSpent = client.orders.reduce((sum, o) => sum + o.totalAmount, 0);
      const activeOrders = client.orders.filter(
        (o) => !['DELIVERED', 'CANCELLED'].includes(o.status)
      ).length;

      return {
        id: client.id,
        email: client.email,
        name: client.name,
        phone: client.phone,
        address: client.address,
        avatarUrl: client.avatarUrl,
        role: client.role,
        shippingName: client.shippingName,
        shippingPhone: client.shippingPhone,
        city: client.city,
        state: client.state,
        pincode: client.pincode,
        lastLoginAt: client.lastLoginAt,
        createdAt: client.createdAt,
        totalOrders: client._count.orders,
        totalDesigns: client._count.designs,
        totalReviews: client._count.reviews,
        totalSpent,
        activeOrders,
      };
    });

    return res.status(200).json({
      status: 'ok',
      clients: clientsWithStats,
      pagination: {
        page: pageNum,
        limit: limitNum,
        total,
        totalPages: Math.ceil(total / limitNum),
      },
    });
  } catch (error: any) {
    console.error('[Clients] Fetch error:', error);
    return res.status(500).json({ status: 'error', message: error.message });
  }
});

/**
 * GET /api/clients/:id
 * Admin-only: get detailed client profile with full order history
 */
router.get('/:id', authenticate, requireAdmin, async (req: Request, res: Response) => {
  try {
    const client = await prisma.user.findUnique({
      where: { id: req.params.id },
      include: {
        orders: {
          include: {
            design: {
              select: {
                id: true, title: true, previewUrl: true, theme: true,
                occasion: true, photoUrl: true, coupleName: true,
                familyName: true, greetingText: true,
              },
            },
            payments: { select: { status: true, amount: true } },
          },
          orderBy: { createdAt: 'desc' },
        },
        designs: {
          select: {
            id: true, title: true, previewUrl: true, theme: true,
            occasion: true, coupleName: true, familyName: true,
            greetingText: true, createdAt: true,
          },
        },
        reviews: true,
        referrals: true,
      },
    });

    if (!client) {
      return res.status(404).json({ status: 'error', message: 'Client not found' });
    }

    return res.status(200).json({ status: 'ok', client });
  } catch (error: any) {
    return res.status(500).json({ status: 'error', message: error.message });
  }
});

/**
 * PATCH /api/clients/:id
 * Admin-only: update a client's profile fields
 */
router.patch('/:id', authenticate, requireAdmin, async (req: Request, res: Response) => {
  try {
    const { name, phone, address, role, shippingName, shippingPhone, city, state, pincode } = req.body;

    // Validate role if provided
    if (role && !['CUSTOMER', 'DESIGNER', 'PRINTER', 'ADMIN'].includes(role)) {
      return res.status(400).json({ status: 'error', message: 'Invalid role' });
    }

    const updated = await prisma.user.update({
      where: { id: req.params.id },
      data: {
        ...(name !== undefined && { name }),
        ...(phone !== undefined && { phone }),
        ...(address !== undefined && { address }),
        ...(role !== undefined && { role }),
        ...(shippingName !== undefined && { shippingName }),
        ...(shippingPhone !== undefined && { shippingPhone }),
        ...(city !== undefined && { city }),
        ...(state !== undefined && { state }),
        ...(pincode !== undefined && { pincode }),
      },
    });

    // Audit log
    await prisma.auditLog.create({
      data: {
        userId: req.dbUser!.id,
        action: 'UPDATE_CLIENT',
        details: `Client ${updated.email} updated by admin ${req.dbUser!.email}`,
        ipAddress: req.ip || 'unknown',
      },
    });

    return res.status(200).json({ status: 'ok', client: updated });
  } catch (error: any) {
    return res.status(500).json({ status: 'error', message: error.message });
  }
});

/**
 * PATCH /api/clients/:id/role
 * Admin-only: update a client's role
 */
router.patch('/:id/role', authenticate, requireAdmin, async (req: Request, res: Response) => {
  try {
    const { role } = req.body;

    if (!role || !['CUSTOMER', 'DESIGNER', 'PRINTER', 'ADMIN'].includes(role)) {
      return res.status(400).json({ status: 'error', message: 'Invalid role' });
    }

    const updated = await prisma.user.update({
      where: { id: req.params.id },
      data: { role },
    });

    // Audit log
    await prisma.auditLog.create({
      data: {
        userId: req.dbUser!.id,
        action: 'UPDATE_USER_ROLE',
        details: `User ${updated.email} role changed to ${role} by admin ${req.dbUser!.email}`,
        ipAddress: req.ip || 'unknown',
      },
    });

    return res.status(200).json({ status: 'ok', client: updated });
  } catch (error: any) {
    return res.status(500).json({ status: 'error', message: error.message });
  }
});

/**
 * DELETE /api/clients/:id
 * Admin-only: delete a client and all their data
 */
router.delete('/:id', authenticate, requireAdmin, async (req: Request, res: Response) => {
  try {
    const client = await prisma.user.findUnique({ where: { id: req.params.id } });
    if (!client) {
      return res.status(404).json({ status: 'error', message: 'Client not found' });
    }

    // Prevent deleting yourself
    if (client.id === req.dbUser!.id) {
      return res.status(400).json({ status: 'error', message: 'Cannot delete your own account' });
    }

    await prisma.user.delete({ where: { id: req.params.id } });

    await prisma.auditLog.create({
      data: {
        userId: req.dbUser!.id,
        action: 'DELETE_CLIENT',
        details: `Client ${client.email} deleted by admin ${req.dbUser!.email}`,
        ipAddress: req.ip || 'unknown',
      },
    });

    return res.status(200).json({ status: 'ok', message: 'Client deleted' });
  } catch (error: any) {
    return res.status(500).json({ status: 'error', message: error.message });
  }
});

export default router;

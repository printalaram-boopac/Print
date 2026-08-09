import { Router, Request, Response } from 'express';
import { authenticate, requireAdmin } from '../middleware/authMiddleware';
import prisma from '../lib/prisma';

const router = Router();

/**
 * GET /api/orders
 * Admin: returns ALL orders with user + design relations
 * Customer: returns only THEIR orders
 */
router.get('/', authenticate, async (req: Request, res: Response) => {
  try {
    if (!req.dbUser) {
      return res.status(401).json({ status: 'error', message: 'User not found' });
    }

    const { status, search, page = '1', limit = '20' } = req.query;
    const pageNum = parseInt(page as string, 10);
    const limitNum = parseInt(limit as string, 10);
    const skip = (pageNum - 1) * limitNum;

    // Build where clause
    const where: any = {};

    // Non-admin users can only see their own orders
    if (req.dbUser.role !== 'ADMIN') {
      where.userId = req.dbUser.id;
    }

    // Filter by status
    if (status && status !== 'ALL') {
      where.status = status;
    }

    // Search by order ID, customer name, or couple name
    if (search) {
      where.OR = [
        { id: { contains: search as string, mode: 'insensitive' } },
        { customerName: { contains: search as string, mode: 'insensitive' } },
        { coupleName: { contains: search as string, mode: 'insensitive' } },
      ];
    }

    const [orders, total] = await Promise.all([
      prisma.order.findMany({
        where,
        include: {
          user: { select: { id: true, name: true, email: true, phone: true, address: true, city: true, state: true, pincode: true } },
          design: { select: { id: true, title: true, previewUrl: true, theme: true, occasion: true, photoUrl: true, coupleName: true, familyName: true, greetingText: true } },
          payments: { select: { id: true, status: true, amount: true } },
        },
        orderBy: { createdAt: 'desc' },
        skip,
        take: limitNum,
      }),
      prisma.order.count({ where }),
    ]);

    return res.status(200).json({
      status: 'ok',
      orders,
      pagination: {
        page: pageNum,
        limit: limitNum,
        total,
        totalPages: Math.ceil(total / limitNum),
      },
    });
  } catch (error: any) {
    console.error('[Orders] Fetch error:', error);
    return res.status(500).json({ status: 'error', message: error.message });
  }
});

/**
 * GET /api/orders/:id
 * Get a single order by ID with full details
 */
router.get('/:id', authenticate, async (req: Request, res: Response) => {
  try {
    if (!req.dbUser) {
      return res.status(401).json({ status: 'error', message: 'User not found' });
    }

    const order = await prisma.order.findUnique({
      where: { id: req.params.id },
      include: {
        user: {
          select: {
            id: true, name: true, email: true, phone: true,
            address: true, city: true, state: true, pincode: true,
            shippingName: true, shippingPhone: true, avatarUrl: true,
          },
        },
        design: true,
        payments: true,
      },
    });

    if (!order) {
      return res.status(404).json({ status: 'error', message: 'Order not found' });
    }

    // Non-admin users can only view their own orders
    if (req.dbUser.role !== 'ADMIN' && order.userId !== req.dbUser.id) {
      return res.status(403).json({ status: 'error', message: 'Access denied' });
    }

    return res.status(200).json({ status: 'ok', order });
  } catch (error: any) {
    return res.status(500).json({ status: 'error', message: error.message });
  }
});

/**
 * POST /api/orders
 * Create a new order (customer action)
 * Also auto-creates a CoverDesign record if designId is not provided
 * Saves shipping address to user profile if not already saved
 */
router.post('/', authenticate, async (req: Request, res: Response) => {
  try {
    if (!req.dbUser) {
      return res.status(401).json({ status: 'error', message: 'User not found' });
    }

    const {
      designId, templateId, quantity, unitPrice, shippingAddress, phone,
      customerName, coupleName, familyName, greetingText, isExpress,
      theme, occasion, photoUrl, designTitle, shippingName, city, state, pincode,
    } = req.body;

    if (!quantity || !unitPrice || !shippingAddress || !phone) {
      return res.status(400).json({
        status: 'error',
        message: 'Missing required fields: quantity, unitPrice, shippingAddress, phone',
      });
    }

    const totalAmount = quantity * unitPrice;

    // Auto-create CoverDesign if no designId provided
    let finalDesignId = designId || null;
    if (!designId) {
      const design = await prisma.coverDesign.create({
        data: {
          userId: req.dbUser.id,
          templateId: templateId || null,
          title: designTitle || `${occasion || 'Custom'} Cover - ${new Date().toLocaleDateString('en-IN')}`,
          customText: greetingText || null,
          configJson: JSON.stringify({ theme, occasion, coupleName, familyName, greetingText }),
          previewUrl: null,
          theme: theme || null,
          occasion: occasion || null,
          photoUrl: photoUrl || null,
          coupleName: coupleName || null,
          familyName: familyName || null,
          greetingText: greetingText || null,
        },
      });
      finalDesignId = design.id;
    }

    const order = await prisma.order.create({
      data: {
        userId: req.dbUser.id,
        designId: finalDesignId,
        quantity,
        unitPrice,
        totalAmount,
        shippingAddress,
        phone,
        customerName: customerName || req.dbUser.name,
        coupleName: coupleName || null,
        familyName: familyName || null,
        greetingText: greetingText || null,
        occasion: occasion || null,
        theme: theme || null,
        isExpress: isExpress || false,
      },
      include: {
        user: { select: { id: true, name: true, email: true } },
        design: { select: { id: true, title: true, previewUrl: true, theme: true, occasion: true } },
      },
    });

    // Auto-save shipping address to user profile if not already saved
    if (!req.dbUser.address || !req.dbUser.phone) {
      await prisma.user.update({
        where: { id: req.dbUser.id },
        data: {
          ...(shippingAddress && !req.dbUser.address && { address: shippingAddress }),
          ...(phone && !req.dbUser.phone && { phone }),
          ...(shippingName && { shippingName }),
          ...(city && { city }),
          ...(state && { state }),
          ...(pincode && { pincode }),
          ...(phone && { shippingPhone: phone }),
        },
      });
    }

    // Audit log
    await prisma.auditLog.create({
      data: {
        userId: req.dbUser.id,
        action: 'ORDER_CREATED',
        details: `Order ${order.id} created by ${req.dbUser.email}. Qty: ${quantity}, Total: ₹${totalAmount}`,
        ipAddress: req.ip || 'unknown',
      },
    });

    return res.status(201).json({ status: 'ok', order });
  } catch (error: any) {
    console.error('[Orders] Create error:', error);
    return res.status(500).json({ status: 'error', message: error.message });
  }
});

/**
 * PATCH /api/orders/:id/status
 * Update order status (admin only)
 */
router.patch('/:id/status', authenticate, requireAdmin, async (req: Request, res: Response) => {
  try {
    const { status, trackingNumber, notes } = req.body;

    if (!status) {
      return res.status(400).json({ status: 'error', message: 'Status is required' });
    }

    const order = await prisma.order.update({
      where: { id: req.params.id },
      data: {
        status,
        ...(trackingNumber !== undefined && { trackingNumber }),
        ...(notes !== undefined && { notes }),
      },
      include: {
        user: { select: { id: true, name: true, email: true } },
      },
    });

    // Audit log
    await prisma.auditLog.create({
      data: {
        userId: req.dbUser!.id,
        action: 'ORDER_STATUS_UPDATED',
        details: `Order ${order.id} status changed to ${status} by admin ${req.dbUser!.email}`,
        ipAddress: req.ip || 'unknown',
      },
    });

    return res.status(200).json({ status: 'ok', order });
  } catch (error: any) {
    return res.status(500).json({ status: 'error', message: error.message });
  }
});

/**
 * DELETE /api/orders/:id
 * Delete an order (admin only)
 */
router.delete('/:id', authenticate, requireAdmin, async (req: Request, res: Response) => {
  try {
    await prisma.order.delete({ where: { id: req.params.id } });

    await prisma.auditLog.create({
      data: {
        userId: req.dbUser!.id,
        action: 'ORDER_DELETED',
        details: `Order ${req.params.id} deleted by admin ${req.dbUser!.email}`,
        ipAddress: req.ip || 'unknown',
      },
    });

    return res.status(200).json({ status: 'ok', message: 'Order deleted' });
  } catch (error: any) {
    return res.status(500).json({ status: 'error', message: error.message });
  }
});

export default router;

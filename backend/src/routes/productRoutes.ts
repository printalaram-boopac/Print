import { Router, Request, Response } from 'express';
import { PrismaClient } from '@prisma/client';
import { authenticate, requireAdmin } from '../middleware/authMiddleware';

const router = Router();
const prisma = new PrismaClient();

/**
 * GET /api/products
 * Public: list all products/templates with optional filters
 */
router.get('/', async (req: Request, res: Response) => {
  try {
    const { category, featured, search, page = '1', limit = '20' } = req.query;
    const pageNum = parseInt(page as string, 10);
    const limitNum = parseInt(limit as string, 10);
    const skip = (pageNum - 1) * limitNum;

    const where: any = {};
    if (category) where.category = category;
    if (featured === 'true') where.isFeatured = true;
    if (search) {
      where.OR = [
        { title: { contains: search as string, mode: 'insensitive' } },
        { description: { contains: search as string, mode: 'insensitive' } },
        { category: { contains: search as string, mode: 'insensitive' } },
      ];
    }

    const [products, total] = await Promise.all([
      prisma.coverTemplate.findMany({
        where,
        orderBy: { createdAt: 'desc' },
        skip,
        take: limitNum,
      }),
      prisma.coverTemplate.count({ where }),
    ]);

    return res.status(200).json({
      status: 'ok',
      products,
      pagination: {
        page: pageNum,
        limit: limitNum,
        total,
        totalPages: Math.ceil(total / limitNum),
      },
    });
  } catch (error: any) {
    return res.status(500).json({ status: 'error', message: error.message });
  }
});

/**
 * GET /api/products/:id
 * Public: get a single product/template
 */
router.get('/:id', async (req: Request, res: Response) => {
  try {
    const product = await prisma.coverTemplate.findUnique({
      where: { id: req.params.id },
      include: {
        designs: {
          select: { id: true, title: true, previewUrl: true },
          take: 5,
        },
      },
    });

    if (!product) {
      return res.status(404).json({ status: 'error', message: 'Product not found' });
    }

    return res.status(200).json({ status: 'ok', product });
  } catch (error: any) {
    return res.status(500).json({ status: 'error', message: error.message });
  }
});

/**
 * POST /api/products
 * Admin-only: create a new product/template
 */
router.post('/', authenticate, requireAdmin, async (req: Request, res: Response) => {
  try {
    const { title, description, category, price, thumbnail, configJson, isFeatured } = req.body;

    if (!title || !category || price === undefined || !thumbnail) {
      return res.status(400).json({
        status: 'error',
        message: 'Missing required fields: title, category, price, thumbnail',
      });
    }

    const product = await prisma.coverTemplate.create({
      data: {
        title,
        description: description || null,
        category,
        price: parseFloat(price),
        thumbnail,
        configJson: configJson || '{}',
        isFeatured: isFeatured || false,
      },
    });

    await prisma.auditLog.create({
      data: {
        userId: req.dbUser!.id,
        action: 'PRODUCT_CREATED',
        details: `Product "${title}" created by admin ${req.dbUser!.email}`,
        ipAddress: req.ip || 'unknown',
      },
    });

    return res.status(201).json({ status: 'ok', product });
  } catch (error: any) {
    return res.status(500).json({ status: 'error', message: error.message });
  }
});

/**
 * PATCH /api/products/:id
 * Admin-only: update a product/template
 */
router.patch('/:id', authenticate, requireAdmin, async (req: Request, res: Response) => {
  try {
    const { title, description, category, price, thumbnail, configJson, isFeatured } = req.body;

    const product = await prisma.coverTemplate.update({
      where: { id: req.params.id },
      data: {
        ...(title !== undefined && { title }),
        ...(description !== undefined && { description }),
        ...(category !== undefined && { category }),
        ...(price !== undefined && { price: parseFloat(price) }),
        ...(thumbnail !== undefined && { thumbnail }),
        ...(configJson !== undefined && { configJson }),
        ...(isFeatured !== undefined && { isFeatured }),
      },
    });

    await prisma.auditLog.create({
      data: {
        userId: req.dbUser!.id,
        action: 'PRODUCT_UPDATED',
        details: `Product "${product.title}" updated by admin ${req.dbUser!.email}`,
        ipAddress: req.ip || 'unknown',
      },
    });

    return res.status(200).json({ status: 'ok', product });
  } catch (error: any) {
    return res.status(500).json({ status: 'error', message: error.message });
  }
});

/**
 * DELETE /api/products/:id
 * Admin-only: delete a product/template
 */
router.delete('/:id', authenticate, requireAdmin, async (req: Request, res: Response) => {
  try {
    const product = await prisma.coverTemplate.findUnique({ where: { id: req.params.id } });
    if (!product) {
      return res.status(404).json({ status: 'error', message: 'Product not found' });
    }

    await prisma.coverTemplate.delete({ where: { id: req.params.id } });

    await prisma.auditLog.create({
      data: {
        userId: req.dbUser!.id,
        action: 'PRODUCT_DELETED',
        details: `Product "${product.title}" deleted by admin ${req.dbUser!.email}`,
        ipAddress: req.ip || 'unknown',
      },
    });

    return res.status(200).json({ status: 'ok', message: 'Product deleted' });
  } catch (error: any) {
    return res.status(500).json({ status: 'error', message: error.message });
  }
});

export default router;

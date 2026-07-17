"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = require("express");
const client_1 = require("@prisma/client");
const authMiddleware_1 = require("../middleware/authMiddleware");
const router = (0, express_1.Router)();
const prisma = new client_1.PrismaClient();
/**
 * GET /api/templates
 * Public: list all templates (for browsing)
 * Supports filtering by category and featured status
 */
router.get('/', async (req, res) => {
    try {
        const { category, featured } = req.query;
        const where = {};
        if (category)
            where.category = category;
        if (featured === 'true')
            where.isFeatured = true;
        const templates = await prisma.coverTemplate.findMany({
            where,
            orderBy: { createdAt: 'desc' },
        });
        return res.status(200).json({ status: 'ok', templates });
    }
    catch (error) {
        return res.status(500).json({ status: 'error', message: error.message });
    }
});
/**
 * GET /api/templates/:id
 */
router.get('/:id', async (req, res) => {
    try {
        const template = await prisma.coverTemplate.findUnique({
            where: { id: req.params.id },
        });
        if (!template) {
            return res.status(404).json({ status: 'error', message: 'Template not found' });
        }
        return res.status(200).json({ status: 'ok', template });
    }
    catch (error) {
        return res.status(500).json({ status: 'error', message: error.message });
    }
});
/**
 * POST /api/templates
 * Admin-only: create a new template
 */
router.post('/', authMiddleware_1.authenticate, authMiddleware_1.requireAdmin, async (req, res) => {
    try {
        const { title, description, category, price, thumbnail, configJson, isFeatured } = req.body;
        if (!title || !category || price === undefined || !thumbnail) {
            return res.status(400).json({
                status: 'error',
                message: 'Missing required fields: title, category, price, thumbnail',
            });
        }
        const template = await prisma.coverTemplate.create({
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
                userId: req.dbUser.id,
                action: 'TEMPLATE_CREATED',
                details: `Template "${title}" created by admin ${req.dbUser.email}`,
                ipAddress: req.ip || 'unknown',
            },
        });
        return res.status(201).json({ status: 'ok', template });
    }
    catch (error) {
        return res.status(500).json({ status: 'error', message: error.message });
    }
});
/**
 * PATCH /api/templates/:id
 * Admin-only: update a template
 */
router.patch('/:id', authMiddleware_1.authenticate, authMiddleware_1.requireAdmin, async (req, res) => {
    try {
        const { title, description, category, price, thumbnail, configJson, isFeatured } = req.body;
        const template = await prisma.coverTemplate.update({
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
                userId: req.dbUser.id,
                action: 'TEMPLATE_UPDATED',
                details: `Template "${template.title}" updated by admin ${req.dbUser.email}`,
                ipAddress: req.ip || 'unknown',
            },
        });
        return res.status(200).json({ status: 'ok', template });
    }
    catch (error) {
        return res.status(500).json({ status: 'error', message: error.message });
    }
});
/**
 * DELETE /api/templates/:id
 * Admin-only: delete a template
 */
router.delete('/:id', authMiddleware_1.authenticate, authMiddleware_1.requireAdmin, async (req, res) => {
    try {
        const template = await prisma.coverTemplate.findUnique({ where: { id: req.params.id } });
        if (!template) {
            return res.status(404).json({ status: 'error', message: 'Template not found' });
        }
        await prisma.coverTemplate.delete({ where: { id: req.params.id } });
        await prisma.auditLog.create({
            data: {
                userId: req.dbUser.id,
                action: 'TEMPLATE_DELETED',
                details: `Template "${template.title}" deleted by admin ${req.dbUser.email}`,
                ipAddress: req.ip || 'unknown',
            },
        });
        return res.status(200).json({ status: 'ok', message: 'Template deleted' });
    }
    catch (error) {
        return res.status(500).json({ status: 'error', message: error.message });
    }
});
exports.default = router;

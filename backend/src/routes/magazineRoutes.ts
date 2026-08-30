import { Router, Request, Response } from 'express';
import { authenticate } from '../middleware/authMiddleware';
import prisma from '../lib/prisma';

const router = Router();

/**
 * Saved magazine designs for the magazine editor.
 *
 * The whole design travels as a JSON document (`documentJson`) so the editor's
 * data model can evolve without a migration per field. Every route is scoped to
 * the authenticated user — a design is only ever readable by its owner.
 */

router.use(authenticate);

function requireUser(req: Request, res: Response): string | null {
  if (!req.dbUser) {
    res.status(401).json({ status: 'error', message: 'Please sign in again to sync your magazines.' });
    return null;
  }
  return req.dbUser.id;
}

/**
 * GET /api/magazines
 * List the signed-in user's magazines, newest first. Omits `documentJson` so
 * the listing stays small.
 */
router.get('/', async (req: Request, res: Response) => {
  const userId = requireUser(req, res);
  if (!userId) return;

  try {
    const magazines = await prisma.magazineDesign.findMany({
      where: { userId },
      orderBy: { updatedAt: 'desc' },
      select: {
        id: true,
        title: true,
        templateId: true,
        pageCount: true,
        createdAt: true,
        updatedAt: true,
      },
    });

    return res.status(200).json({ status: 'ok', magazines });
  } catch (error: any) {
    return res.status(500).json({ status: 'error', message: error.message });
  }
});

/**
 * GET /api/magazines/:id
 * Full document for one magazine.
 */
router.get('/:id', async (req: Request, res: Response) => {
  const userId = requireUser(req, res);
  if (!userId) return;

  try {
    const magazine = await prisma.magazineDesign.findFirst({
      where: { id: req.params.id, userId },
    });

    if (!magazine) {
      return res.status(404).json({ status: 'error', message: 'Magazine not found' });
    }

    return res.status(200).json({ status: 'ok', magazine });
  } catch (error: any) {
    return res.status(500).json({ status: 'error', message: error.message });
  }
});

/**
 * PUT /api/magazines
 * Create or update by client-generated id. The editor autosaves repeatedly, so
 * an idempotent upsert avoids duplicate rows and needless round trips.
 */
router.put('/', async (req: Request, res: Response) => {
  const userId = requireUser(req, res);
  if (!userId) return;

  const { id, title, templateId, pageCount, schemaVersion, documentJson } = req.body ?? {};

  if (typeof id !== 'string' || !id) {
    return res.status(400).json({ status: 'error', message: 'A magazine id is required.' });
  }
  if (typeof documentJson !== 'string' || !documentJson) {
    return res.status(400).json({ status: 'error', message: 'A magazine document is required.' });
  }

  try {
    // Guard against writing over another account's design that happens to
    // share an id.
    const existing = await prisma.magazineDesign.findUnique({ where: { id } });
    if (existing && existing.userId !== userId) {
      return res.status(403).json({ status: 'error', message: 'That magazine belongs to another account.' });
    }

    const data = {
      title: typeof title === 'string' && title.trim() ? title.trim() : 'Untitled magazine',
      templateId: typeof templateId === 'string' ? templateId : null,
      pageCount: Number.isFinite(pageCount) ? Number(pageCount) : 0,
      schemaVersion: Number.isFinite(schemaVersion) ? Number(schemaVersion) : 1,
      documentJson,
    };

    const magazine = await prisma.magazineDesign.upsert({
      where: { id },
      create: { id, userId, ...data },
      update: data,
      select: {
        id: true,
        title: true,
        templateId: true,
        pageCount: true,
        createdAt: true,
        updatedAt: true,
      },
    });

    return res.status(200).json({ status: 'ok', magazine });
  } catch (error: any) {
    return res.status(500).json({ status: 'error', message: error.message });
  }
});

/**
 * DELETE /api/magazines/:id
 */
router.delete('/:id', async (req: Request, res: Response) => {
  const userId = requireUser(req, res);
  if (!userId) return;

  try {
    const result = await prisma.magazineDesign.deleteMany({
      where: { id: req.params.id, userId },
    });

    if (result.count === 0) {
      return res.status(404).json({ status: 'error', message: 'Magazine not found' });
    }

    return res.status(200).json({ status: 'ok' });
  } catch (error: any) {
    return res.status(500).json({ status: 'error', message: error.message });
  }
});

export default router;

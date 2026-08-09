import express, { Request, Response, NextFunction } from 'express';
import cors from 'cors';
import path from 'path';
import dotenv from 'dotenv';
import { createServer as createViteServer } from 'vite';

import authRoutes from './backend/src/routes/authRoutes';
import orderRoutes from './backend/src/routes/orderRoutes';
import clientRoutes from './backend/src/routes/clientRoutes';
import templateRoutes from './backend/src/routes/templateRoutes';
import productRoutes from './backend/src/routes/productRoutes';
import paymentRoutes from './backend/src/routes/paymentRoutes';
import auditRoutes from './backend/src/routes/auditRoutes';
import statsRoutes from './backend/src/routes/statsRoutes';
import aiRoutes from './backend/src/routes/aiRoutes';
import prisma from './backend/src/lib/prisma';

dotenv.config();

const PORT = Number(process.env.PORT) || 3000;

async function startServer() {
  const app = express();

  app.use(cors({ origin: true, credentials: true }));
  app.use(express.json({ limit: '10mb' }));
  app.use(express.urlencoded({ extended: true, limit: '10mb' }));

  // Health check
  app.get('/api/health', async (req: Request, res: Response) => {
    let databaseStatus = 'unknown';
    try {
      await prisma.$executeRawUnsafe('SELECT 1');
      databaseStatus = 'connected';
    } catch {
      databaseStatus = 'disconnected';
    }
    res.json({
      status: 'ok',
      service: 'printalarm-app',
      timestamp: new Date().toISOString(),
      database: databaseStatus,
      uptime: process.uptime(),
    });
  });

  // API routes
  app.use('/api/auth', authRoutes);
  app.use('/api/orders', orderRoutes);
  app.use('/api/clients', clientRoutes);
  app.use('/api/templates', templateRoutes);
  app.use('/api/products', productRoutes);
  app.use('/api/payments', paymentRoutes);
  app.use('/api/audit-logs', auditRoutes);
  app.use('/api/stats', statsRoutes);
  app.use('/api/ai', aiRoutes);

  // Centralized API Error Handler
  app.use('/api', (err: any, req: Request, res: Response, next: NextFunction) => {
    console.error('[API Error]:', err);
    res.status(err.status || 500).json({
      status: 'error',
      message: err.message || 'An unexpected error occurred on the server',
    });
  });

  // Serve Frontend
  if (process.env.NODE_ENV !== 'production') {
    const vite = await createViteServer({
      root: path.resolve(process.cwd(), 'frontend'),
      server: {
        middlewareMode: true,
        host: '0.0.0.0',
        port: PORT,
      },
      appType: 'spa',
    });
    app.use(vite.middlewares);
  } else {
    const distPath = path.resolve(process.cwd(), 'frontend/dist');
    app.use(express.static(distPath));
    app.get('*', (req: Request, res: Response) => {
      res.sendFile(path.resolve(distPath, 'index.html'));
    });
  }

  app.listen(PORT, '0.0.0.0', () => {
    console.log(`[server]: PrintAlarm full-stack server running at http://0.0.0.0:${PORT}`);
  });
}

startServer();

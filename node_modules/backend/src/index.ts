import express, { Request, Response, NextFunction } from 'express';
import cors from 'cors';
import dotenv from 'dotenv';
import { PrismaClient } from '@prisma/client';

// Route imports
import authRoutes from './routes/authRoutes';
import orderRoutes from './routes/orderRoutes';
import clientRoutes from './routes/clientRoutes';
import templateRoutes from './routes/templateRoutes';
import productRoutes from './routes/productRoutes';
import paymentRoutes from './routes/paymentRoutes';
import auditRoutes from './routes/auditRoutes';
import statsRoutes from './routes/statsRoutes';

// Load environment variables
dotenv.config();

const app = express();
const port = process.env.PORT || 5000;
const prisma = new PrismaClient();

// Configure CORS to permit requests from local frontend (Vite defaults to port 3000)
app.use(cors({
  origin: ['http://localhost:3000', 'http://127.0.0.1:3000'],
  credentials: true,
}));

// Body parsing middleware
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Health Check Endpoint
app.get('/api/health', async (req: Request, res: Response) => {
  try {
    // Basic ping to ensure database is online (only if connection string is configured and working)
    // We swallow database connection check errors to avoid crashing healthcheck in local offline states
    let databaseStatus = 'unknown';
    try {
      await prisma.$executeRawUnsafe('SELECT 1');
      databaseStatus = 'connected';
    } catch (e) {
      databaseStatus = 'disconnected';
    }

    res.status(200).json({
      status: 'ok',
      service: 'printalarm-backend',
      timestamp: new Date().toISOString(),
      database: databaseStatus,
      uptime: process.uptime(),
    });
  } catch (error: any) {
    res.status(500).json({
      status: 'error',
      message: error.message || 'Internal health check failure',
    });
  }
});

// ─── API Routes ───
app.use('/api/auth', authRoutes);
app.use('/api/orders', orderRoutes);
app.use('/api/clients', clientRoutes);
app.use('/api/templates', templateRoutes);
app.use('/api/products', productRoutes);
app.use('/api/payments', paymentRoutes);
app.use('/api/audit-logs', auditRoutes);
app.use('/api/stats', statsRoutes);

// Centralized Error Handling Middleware
app.use((err: any, req: Request, res: Response, next: NextFunction) => {
  console.error('Unhandled Server Error:', err);
  res.status(err.status || 500).json({
    status: 'error',
    message: err.message || 'An unexpected error occurred on the server',
    errors: err.errors || undefined,
  });
});

// Start listening for connections
app.listen(port, () => {
  console.log(`[server]: PrintAlarm backend is running at http://localhost:${port}`);
});

// Graceful shutdown handling
process.on('SIGINT', async () => {
  await prisma.$disconnect();
  console.log('[server]: Disconnected database client. Exiting.');
  process.exit(0);
});

"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const cors_1 = __importDefault(require("cors"));
const dotenv_1 = __importDefault(require("dotenv"));
const client_1 = require("@prisma/client");
// Route imports
const authRoutes_1 = __importDefault(require("./routes/authRoutes"));
const orderRoutes_1 = __importDefault(require("./routes/orderRoutes"));
const clientRoutes_1 = __importDefault(require("./routes/clientRoutes"));
const templateRoutes_1 = __importDefault(require("./routes/templateRoutes"));
const productRoutes_1 = __importDefault(require("./routes/productRoutes"));
const paymentRoutes_1 = __importDefault(require("./routes/paymentRoutes"));
const auditRoutes_1 = __importDefault(require("./routes/auditRoutes"));
const statsRoutes_1 = __importDefault(require("./routes/statsRoutes"));
const aiRoutes_1 = __importDefault(require("./routes/aiRoutes"));
// Load environment variables
dotenv_1.default.config();
const app = (0, express_1.default)();
const port = process.env.PORT || 5000;
const prisma = new client_1.PrismaClient();
// Configure CORS to permit requests from local frontend (Vite defaults to port 3000)
app.use((0, cors_1.default)({
    origin: ['http://localhost:3000', 'http://127.0.0.1:3000'],
    credentials: true,
}));
// Body parsing middleware
app.use(express_1.default.json());
app.use(express_1.default.urlencoded({ extended: true }));
// Health Check Endpoint
app.get('/api/health', async (req, res) => {
    try {
        // Basic ping to ensure database is online (only if connection string is configured and working)
        // We swallow database connection check errors to avoid crashing healthcheck in local offline states
        let databaseStatus = 'unknown';
        try {
            await prisma.$executeRawUnsafe('SELECT 1');
            databaseStatus = 'connected';
        }
        catch (e) {
            databaseStatus = 'disconnected';
        }
        res.status(200).json({
            status: 'ok',
            service: 'printalarm-backend',
            timestamp: new Date().toISOString(),
            database: databaseStatus,
            uptime: process.uptime(),
        });
    }
    catch (error) {
        res.status(500).json({
            status: 'error',
            message: error.message || 'Internal health check failure',
        });
    }
});
// ─── API Routes ───
app.use('/api/auth', authRoutes_1.default);
app.use('/api/orders', orderRoutes_1.default);
app.use('/api/clients', clientRoutes_1.default);
app.use('/api/templates', templateRoutes_1.default);
app.use('/api/products', productRoutes_1.default);
app.use('/api/payments', paymentRoutes_1.default);
app.use('/api/audit-logs', auditRoutes_1.default);
app.use('/api/stats', statsRoutes_1.default);
app.use('/api/ai', aiRoutes_1.default);
// Centralized Error Handling Middleware
app.use((err, req, res, next) => {
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

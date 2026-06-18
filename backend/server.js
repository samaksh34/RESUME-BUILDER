import 'dotenv/config';
import express from 'express';
import cookieParser from 'cookie-parser';
import rateLimit from 'express-rate-limit';
import mongoose from 'mongoose';
import connectDB from './config/db.js';
import errorHandler from './middleware/errorHandler.js';
import authRoutes from './routes/authRoutes.js';
import resumeRoutes from './routes/resumeRoutes.js';
import aiRoutes from './routes/aiRoutes.js';


const app = express();
const PORT = process.env.PORT || 5000;

// ── Connect to MongoDB ──────────────────────────────────────────────
connectDB();

// ── Global Middleware (Manual CORS) ────────────────────────────────
app.use((req, res, next) => {
    const origin = req.headers.origin;
    const clientUrls = process.env.CLIENT_URL ? process.env.CLIENT_URL.split(',') : [];
    const allowedOrigins = [
        'http://localhost:5173',
        'http://localhost:5174',
        'https://resume-builder-eight-ochre.vercel.app',
        ...clientUrls
    ];
    
    if (allowedOrigins.includes(origin) || !origin) {
        res.setHeader('Access-Control-Allow-Origin', origin || '*');
    }
    
    res.setHeader('Access-Control-Allow-Methods', 'GET, POST, PUT, DELETE, OPTIONS');
    res.setHeader('Access-Control-Allow-Headers', 'Content-Type, Authorization');
    res.setHeader('Access-Control-Allow-Credentials', 'true');

    if (req.method === 'OPTIONS') {
        return res.status(200).end();
    }
    next();
});

app.use(express.json({ limit: '10mb' }));
app.use(express.urlencoded({ extended: true }));
app.use(cookieParser());

// ── Database Connectivity Middleware ───────────────────────────────
app.use(async (req, res, next) => {
    try {
        await connectDB();
        next();
    } catch (error) {
        console.error('Database connection error:', error);
        res.status(503).json({ success: false, message: 'Database unavailable' });
    }
});

// ── Routes ──────────────────────────────────────────────────────────
app.get('/', (req, res) => {
    res.status(200).json({
        success: true,
        message: '👋 Welcome to the Resume Builder API',
        status: 'online',
    });
});

app.get('/api/health', async (req, res) => {
    await connectDB();
    const dbStatus = mongoose.connection.readyState;
    const dbStatusMap = { 0: 'disconnected', 1: 'connected', 2: 'connecting', 3: 'disconnecting' };
    
    res.status(200).json({
        success: true,
        database: { status: dbStatusMap[dbStatus] || 'unknown', connected: dbStatus === 1 },
        timestamp: new Date().toISOString(),
    });
});

app.use('/api/auth', authRoutes);
app.use('/api/resumes', resumeRoutes);
app.use('/api/ai', aiRoutes);


// ── 404 Handler ─────────────────────────────────────────────────────
app.use((req, res) => {
    res.status(404).json({
        success: false,
        message: `Route ${req.originalUrl} not found`,
    });
});

// ── Global Error Handler ────────────────────────────────────────────
app.use(errorHandler);

// ── Start Server ────────────────────────────────────────────────────
// Only start the server if we're not running in a Vercel environment
if (process.env.NODE_ENV !== 'production' && !process.env.VERCEL) {
    app.listen(PORT, () => {
        console.log('');
        console.log('╔══════════════════════════════════════════════╗');
        console.log(`║  🚀 Server running on http://localhost:${PORT}    ║`);
        console.log(`║  📦 Environment: ${(process.env.NODE_ENV || 'development').padEnd(27)}║`);
        console.log('╚══════════════════════════════════════════════╝');
        console.log('');
    });
}

export default app;

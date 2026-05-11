import 'dotenv/config';
import express from 'express';
import cors from 'cors';
import cookieParser from 'cookie-parser';
import rateLimit from 'express-rate-limit';
import mongoose from 'mongoose';
import connectDB from './config/db.js';
import errorHandler from './middleware/errorHandler.js';
import authRoutes from './routes/authRoutes.js';
import resumeRoutes from './routes/resumeRoutes.js';

const app = express();
const PORT = process.env.PORT || 5000;

// ── Connect to MongoDB ──────────────────────────────────────────────
connectDB();

// ── Global Middleware ───────────────────────────────────────────────
app.use(cors({
    origin: 'https://resume-builder-eight-ochre.vercel.app',
    credentials: true,
}));

app.use(express.json({ limit: '10mb' }));
app.use(express.urlencoded({ extended: true }));
app.use(cookieParser());

// ── Routes ──────────────────────────────────────────────────────────
app.get('/', (req, res) => {
    res.status(200).json({
        success: true,
        message: '👋 Welcome to the Resume Builder API',
        status: 'online',
    });
});

app.get('/api/health', async (req, res) => {
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

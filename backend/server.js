import 'dotenv/config';
import express from 'express';
import cors from 'cors';
import cookieParser from 'cookie-parser';
import rateLimit from 'express-rate-limit';
import connectDB from './config/db.js';
import errorHandler from './middleware/errorHandler.js';
import authRoutes from './routes/authRoutes.js';

const app = express();
const PORT = process.env.PORT || 5000;

// ── Connect to MongoDB ──────────────────────────────────────────────
connectDB();

// ── Global Middleware ───────────────────────────────────────────────
app.use(cors({
    origin: process.env.CLIENT_URL || 'http://localhost:5173',
    credentials: true, // Allow cookies
}));

app.use(express.json({ limit: '10mb' }));
app.use(express.urlencoded({ extended: true }));
app.use(cookieParser());

// ── Rate Limiting (auth routes) ─────────────────────────────────────
const authLimiter = rateLimit({
    windowMs: 15 * 60 * 1000, // 15 minutes
    max: 20, // 20 requests per window per IP
    message: {
        success: false,
        message: 'Too many requests — please try again after 15 minutes',
    },
    standardHeaders: true,
    legacyHeaders: false,
});

// ── Routes ──────────────────────────────────────────────────────────
app.get('/api/health', (req, res) => {
    res.status(200).json({
        success: true,
        message: '🚀 Resume Builder API is running',
        timestamp: new Date().toISOString(),
    });
});

app.use('/api/auth', authLimiter, authRoutes);

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
app.listen(PORT, () => {
    console.log('');
    console.log('╔══════════════════════════════════════════════╗');
    console.log(`║  🚀 Server running on http://localhost:${PORT}    ║`);
    console.log(`║  📦 Environment: ${(process.env.NODE_ENV || 'development').padEnd(27)}║`);
    console.log('╚══════════════════════════════════════════════╝');
    console.log('');
});

import 'dotenv/config';
import express from 'express';
import cors from 'cors';
import cookieParser from 'cookie-parser';
import rateLimit from 'express-rate-limit';
import connectDB from './config/db.js';
import errorHandler from './middleware/errorHandler.js';
import authRoutes from './routes/authRoutes.js';
import resumeRoutes from './routes/resumeRoutes.js';

const app = express();
const PORT = process.env.PORT || 5000;

// ── Connect to MongoDB ──────────────────────────────────────────────
connectDB();

// ── Global Middleware ───────────────────────────────────────────────
const allowedOrigins = process.env.CLIENT_URL ? process.env.CLIENT_URL.split(',') : ['http://localhost:5173'];

app.use(cors({
    origin: (origin, callback) => {
        // Allow requests with no origin (like mobile apps or curl)
        if (!origin) return callback(null, true);
        if (allowedOrigins.indexOf(origin) === -1) {
            const msg = 'The CORS policy for this site does not allow access from the specified Origin.';
            return callback(new Error(msg), false);
        }
        return callback(null, true);
    },
    credentials: true, // Allow cookies
}));

app.use(express.json({ limit: '10mb' }));
app.use(express.urlencoded({ extended: true }));
app.use(cookieParser());

// ── Rate Limiting (auth routes) ─────────────────────────────────────
const authLimiter = rateLimit({
    windowMs: 15 * 60 * 1000, // 15 minutes
    max: 100, // Increased to 100 requests for smoother development
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
if (process.env.NODE_ENV !== 'production') {
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

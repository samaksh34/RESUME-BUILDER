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
// ── Global Middleware ───────────────────────────────────────────────
const allowedOrigins = process.env.CLIENT_URL 
    ? process.env.CLIENT_URL.split(',').map(url => {
        try {
            const parsed = new URL(url.trim());
            return `${parsed.protocol}//${parsed.host}`;
        } catch (e) {
            // Fallback for non-standard or malformed URLs
            return url.trim().replace(/\/$/, '');
        }
    })
    : ['http://localhost:5173', 'http://localhost:5174'];

app.use(cors({
    origin: (origin, callback) => {
        // Allow requests with no origin (like mobile apps or curl)
        if (!origin) return callback(null, true);
        
        // Normalize the origin by removing trailing slashes
        const normalizedOrigin = origin.replace(/\/$/, '');
        
        if (allowedOrigins.indexOf(normalizedOrigin) !== -1) {
            return callback(null, true);
        }
        
        // Log the blocked origin for easier debugging in Vercel
        console.error('--------------------------------------------------');
        console.error(`❌ CORS BLOCK: ${origin}`);
        console.error(`✅ ALLOWED: ${allowedOrigins.join(', ')}`);
        console.error('--------------------------------------------------');
        
        return callback(new Error('Not allowed by CORS'), false); 
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
// ── Root Route ──────────────────────────────────────────────────────
app.get('/', (req, res) => {
    res.status(200).json({
        success: true,
        message: '👋 Welcome to the Resume Builder API',
        status: 'online',
        endpoints: {
            health: '/api/health',
            auth: '/api/auth',
            resumes: '/api/resumes'
        }
    });
});

app.get('/api/health', async (req, res) => {
    // Force a connection attempt if not connected
    await connectDB();
    
    const dbStatus = mongoose.connection.readyState;
    const dbStatusMap = {
        0: 'disconnected',
        1: 'connected',
        2: 'connecting',
        3: 'disconnecting'
    };
    
    res.status(200).json({
        success: true,
        message: '🚀 Resume Builder API is running',
        database: {
            status: dbStatusMap[dbStatus] || 'unknown',
            host: mongoose.connection.host || 'none',
            connected: dbStatus === 1
        },
        environment: process.env.NODE_ENV,
        vercel: !!process.env.VERCEL,
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

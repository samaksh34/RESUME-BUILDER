import express from 'express';
import rateLimit from 'express-rate-limit';
import { protect } from '../middleware/auth.js';
import { 
    handleAnalyzeResume, 
    handleOptimizeBullet, 
    handleGenerateCoverLetter 
} from '../controllers/aiController.js';

const router = express.Router();

// Rate limiter specifically for AI services to protect against API key cost spikes
const aiLimiter = rateLimit({
    windowMs: 10 * 60 * 1000, // 10 minutes
    max: 20, // Limit each IP to 20 AI requests per 10 minutes
    message: {
        success: false,
        message: 'Too many requests to AI features. Please try again in 10 minutes.'
    },
    standardHeaders: true,
    legacyHeaders: false,
});

// Protect all AI routes with JWT authentication
router.use(protect);
router.use(aiLimiter);

router.post('/analyze', handleAnalyzeResume);
router.post('/optimize-bullet', handleOptimizeBullet);
router.post('/generate-cover-letter', handleGenerateCoverLetter);

export default router;

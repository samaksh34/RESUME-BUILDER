import express from 'express';
import { protect, validate } from '../middleware/auth.js';
import {
    register,
    verifyOTP,
    login,
    refreshAccessToken,
    forgotPassword,
    resetPassword,
    resendOTP,
    logout,
    getMe,
} from '../controllers/authController.js';
import {
    registerSchema,
    loginSchema,
    verifyOTPSchema,
    forgotPasswordSchema,
    resetPasswordSchema,
    resendOTPSchema,
} from '../utils/validators.js';

const router = express.Router();

// Public routes
router.post('/register', validate(registerSchema), register);
router.post('/verify-otp', validate(verifyOTPSchema), verifyOTP);
router.post('/login', validate(loginSchema), login);
router.post('/refresh', refreshAccessToken);
router.post('/forgot-password', validate(forgotPasswordSchema), forgotPassword);
router.post('/reset-password', validate(resetPasswordSchema), resetPassword);
router.post('/resend-otp', validate(resendOTPSchema), resendOTP);

// Protected routes
router.post('/logout', protect, logout);
router.get('/me', protect, getMe);

export default router;

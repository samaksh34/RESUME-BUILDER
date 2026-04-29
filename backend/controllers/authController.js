import User from '../models/User.js';
import { generateAccessToken, generateRefreshToken, verifyRefreshToken } from '../utils/generateToken.js';
import { sendOTPEmail } from '../services/emailService.js';

/**
 * @desc    Register a new user
 * @route   POST /api/auth/register
 * @access  Public
 */
export const register = async (req, res, next) => {
    try {
        const { name, email, password } = req.body;

        // Check if user already exists
        const existingUser = await User.findOne({ email });
        if (existingUser) {
            // If user exists but isn't verified, allow re-registration with new OTP
            if (!existingUser.isVerified) {
                existingUser.name = name;
                existingUser.password = password;
                const otp = await existingUser.generateOTP('verification');
                await existingUser.save();
                await sendOTPEmail(email, otp, 'verification');

                return res.status(200).json({
                    success: true,
                    message: 'OTP resent to your email. Please verify your account.',
                    data: { email },
                });
            }
            return res.status(400).json({
                success: false,
                message: 'An account with this email already exists',
            });
        }

        // Create user
        const user = new User({ name, email, password });
        const otp = await user.generateOTP('verification');
        await user.save();

        // Send OTP email
        await sendOTPEmail(email, otp, 'verification');

        res.status(201).json({
            success: true,
            message: 'Account created! Please check your email for the verification OTP.',
            data: { email },
        });
    } catch (error) {
        next(error);
    }
};

/**
 * @desc    Verify email with OTP
 * @route   POST /api/auth/verify-otp
 * @access  Public
 */
export const verifyOTP = async (req, res, next) => {
    try {
        const { email, otp } = req.body;

        const user = await User.findOne({ email }).select('+otp.code +otp.expiresAt +otp.purpose');
        if (!user) {
            return res.status(404).json({
                success: false,
                message: 'No account found with this email',
            });
        }

        if (!(await user.verifyOTP(otp, 'verification'))) {
            return res.status(400).json({
                success: false,
                message: 'Invalid or expired OTP',
            });
        }

        // Mark user as verified
        user.isVerified = true;
        user.clearOTP();
        await user.save();

        // Generate tokens and log them in
        const accessToken = generateAccessToken(user._id);
        const refreshToken = generateRefreshToken(user._id);

        // Store refresh token
        const userWithTokens = await User.findById(user._id).select('+refreshTokens');
        userWithTokens.refreshTokens.push(refreshToken);
        await userWithTokens.save();

        // Set refresh token as httpOnly cookie
        res.cookie('refreshToken', refreshToken, {
            httpOnly: true,
            secure: process.env.NODE_ENV === 'production',
            sameSite: process.env.NODE_ENV === 'production' ? 'strict' : 'lax',
            maxAge: 7 * 24 * 60 * 60 * 1000, // 7 days
        });

        res.status(200).json({
            success: true,
            message: 'Email verified successfully!',
            data: {
                user: {
                    id: user._id,
                    name: user.name,
                    email: user.email,
                    avatar: user.avatar,
                    isVerified: true,
                },
                accessToken,
            },
        });
    } catch (error) {
        next(error);
    }
};

/**
 * @desc    Login user
 * @route   POST /api/auth/login
 * @access  Public
 */
export const login = async (req, res, next) => {
    try {
        const { email, password } = req.body;

        // Find user with password field included
        const user = await User.findOne({ email }).select('+password +refreshTokens');
        if (!user) {
            return res.status(401).json({
                success: false,
                message: 'Invalid email or password',
            });
        }

        // Check password
        const isMatch = await user.comparePassword(password);
        if (!isMatch) {
            return res.status(401).json({
                success: false,
                message: 'Invalid email or password',
            });
        }

        // Check if verified
        if (!user.isVerified) {
            // Resend OTP
            const userWithOTP = await User.findById(user._id).select('+otp.code +otp.expiresAt +otp.purpose');
            const otp = await userWithOTP.generateOTP('verification');
            await userWithOTP.save();
            await sendOTPEmail(email, otp, 'verification');

            return res.status(403).json({
                success: false,
                message: 'Account not verified. We\'ve sent a new OTP to your email.',
                code: 'NOT_VERIFIED',
                data: { email },
            });
        }

        // Generate tokens
        const accessToken = generateAccessToken(user._id);
        const refreshToken = generateRefreshToken(user._id);

        // Store refresh token (keep max 5 sessions)
        user.refreshTokens.push(refreshToken);
        if (user.refreshTokens.length > 5) {
            user.refreshTokens = user.refreshTokens.slice(-5);
        }
        await user.save();

        // Set refresh token as httpOnly cookie
        res.cookie('refreshToken', refreshToken, {
            httpOnly: true,
            secure: process.env.NODE_ENV === 'production',
            sameSite: process.env.NODE_ENV === 'production' ? 'strict' : 'lax',
            maxAge: 7 * 24 * 60 * 60 * 1000,
        });

        res.status(200).json({
            success: true,
            message: 'Login successful!',
            data: {
                user: {
                    id: user._id,
                    name: user.name,
                    email: user.email,
                    avatar: user.avatar,
                    isVerified: user.isVerified,
                },
                accessToken,
            },
        });
    } catch (error) {
        next(error);
    }
};

/**
 * @desc    Refresh access token using refresh token cookie
 * @route   POST /api/auth/refresh
 * @access  Public (requires valid refresh token cookie)
 */
export const refreshAccessToken = async (req, res, next) => {
    try {
        const { refreshToken } = req.cookies;

        if (!refreshToken) {
            return res.status(401).json({
                success: false,
                message: 'No refresh token — please login again',
            });
        }

        // Verify refresh token
        let decoded;
        try {
            decoded = verifyRefreshToken(refreshToken);
        } catch {
            return res.status(401).json({
                success: false,
                message: 'Invalid refresh token — please login again',
            });
        }

        // Check if token exists in user's stored tokens
        const user = await User.findById(decoded.userId).select('+refreshTokens');
        if (!user) {
            return res.status(401).json({
                success: false,
                message: 'User not found',
            });
        }

        if (!user.refreshTokens.includes(refreshToken)) {
            // Token reuse detected — clear all tokens (security measure)
            user.refreshTokens = [];
            await user.save();
            res.clearCookie('refreshToken');
            return res.status(401).json({
                success: false,
                message: 'Token reuse detected — all sessions revoked. Please login again.',
            });
        }

        // Rotate: remove old token, issue new pair
        user.refreshTokens = user.refreshTokens.filter((t) => t !== refreshToken);
        const newAccessToken = generateAccessToken(user._id);
        const newRefreshToken = generateRefreshToken(user._id);
        user.refreshTokens.push(newRefreshToken);
        await user.save();

        // Set new refresh token cookie
        res.cookie('refreshToken', newRefreshToken, {
            httpOnly: true,
            secure: process.env.NODE_ENV === 'production',
            sameSite: process.env.NODE_ENV === 'production' ? 'strict' : 'lax',
            maxAge: 7 * 24 * 60 * 60 * 1000,
        });

        res.status(200).json({
            success: true,
            data: {
                accessToken: newAccessToken,
            },
        });
    } catch (error) {
        next(error);
    }
};

/**
 * @desc    Forgot password — send OTP
 * @route   POST /api/auth/forgot-password
 * @access  Public
 */
export const forgotPassword = async (req, res, next) => {
    try {
        const { email } = req.body;

        const user = await User.findOne({ email }).select('+otp.code +otp.expiresAt +otp.purpose');
        if (!user) {
            // Don't reveal if user exists or not (security)
            return res.status(200).json({
                success: true,
                message: 'If an account with that email exists, we\'ve sent a password reset OTP.',
                data: { email },
            });
        }

        const otp = await user.generateOTP('password-reset');
        await user.save();
        await sendOTPEmail(email, otp, 'password-reset');

        res.status(200).json({
            success: true,
            message: 'If an account with that email exists, we\'ve sent a password reset OTP.',
            data: { email },
        });
    } catch (error) {
        next(error);
    }
};

/**
 * @desc    Reset password with OTP
 * @route   POST /api/auth/reset-password
 * @access  Public
 */
export const resetPassword = async (req, res, next) => {
    try {
        const { email, otp, newPassword } = req.body;

        const user = await User.findOne({ email }).select('+otp.code +otp.expiresAt +otp.purpose +refreshTokens');
        if (!user) {
            return res.status(400).json({
                success: false,
                message: 'Invalid or expired OTP',
            });
        }

        if (!(await user.verifyOTP(otp, 'password-reset'))) {
            return res.status(400).json({
                success: false,
                message: 'Invalid or expired OTP',
            });
        }

        // Update password and clear OTP
        user.password = newPassword;
        user.clearOTP();
        // Revoke all sessions for security
        user.refreshTokens = [];
        await user.save();

        res.clearCookie('refreshToken');

        res.status(200).json({
            success: true,
            message: 'Password reset successfully! Please login with your new password.',
        });
    } catch (error) {
        next(error);
    }
};

/**
 * @desc    Resend OTP
 * @route   POST /api/auth/resend-otp
 * @access  Public
 */
export const resendOTP = async (req, res, next) => {
    try {
        const { email, purpose } = req.body;

        const user = await User.findOne({ email }).select('+otp.code +otp.expiresAt +otp.purpose');
        if (!user) {
            return res.status(200).json({
                success: true,
                message: 'If an account with that email exists, we\'ve sent a new OTP.',
            });
        }

        const otp = await user.generateOTP(purpose);
        await user.save();
        await sendOTPEmail(email, otp, purpose);

        res.status(200).json({
            success: true,
            message: 'A new OTP has been sent to your email.',
            data: { email },
        });
    } catch (error) {
        next(error);
    }
};

/**
 * @desc    Logout — clear refresh token
 * @route   POST /api/auth/logout
 * @access  Private
 */
export const logout = async (req, res, next) => {
    try {
        const { refreshToken } = req.cookies;

        if (refreshToken) {
            // Remove this specific refresh token
            const user = await User.findById(req.user._id).select('+refreshTokens');
            if (user) {
                user.refreshTokens = user.refreshTokens.filter((t) => t !== refreshToken);
                await user.save();
            }
        }

        res.clearCookie('refreshToken');

        res.status(200).json({
            success: true,
            message: 'Logged out successfully',
        });
    } catch (error) {
        next(error);
    }
};

/**
 * @desc    Get current user profile
 * @route   GET /api/auth/me
 * @access  Private
 */
export const getMe = async (req, res, next) => {
    try {
        res.status(200).json({
            success: true,
            data: {
                user: {
                    id: req.user._id,
                    name: req.user.name,
                    email: req.user.email,
                    avatar: req.user.avatar,
                    isVerified: req.user.isVerified,
                    createdAt: req.user.createdAt,
                },
            },
        });
    } catch (error) {
        next(error);
    }
};

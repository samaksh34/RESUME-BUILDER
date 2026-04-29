import mongoose from 'mongoose';
import bcrypt from 'bcryptjs';

const userSchema = new mongoose.Schema(
    {
        name: {
            type: String,
            required: [true, 'Name is required'],
            trim: true,
            minlength: [2, 'Name must be at least 2 characters'],
            maxlength: [50, 'Name cannot exceed 50 characters'],
        },
        email: {
            type: String,
            required: [true, 'Email is required'],
            unique: true,
            lowercase: true,
            trim: true,
            match: [/^\S+@\S+\.\S+$/, 'Please enter a valid email'],
        },
        password: {
            type: String,
            required: [true, 'Password is required'],
            minlength: [6, 'Password must be at least 6 characters'],
            select: false, // Never return password in queries by default
        },
        avatar: {
            type: String,
            default: '',
        },
        isVerified: {
            type: Boolean,
            default: false,
        },
        otp: {
            code: { type: String, select: false },
            expiresAt: { type: Date, select: false },
            purpose: { type: String, enum: ['verification', 'password-reset'], select: false },
        },
        refreshTokens: {
            type: [String],
            select: false, // Array of valid refresh tokens (supports multiple devices)
        },
    },
    {
        timestamps: true,
    }
);

// Hash password before saving
userSchema.pre('save', async function (next) {
    if (!this.isModified('password')) return next();
    const salt = await bcrypt.genSalt(12);
    this.password = await bcrypt.hash(this.password, salt);
    next();
});

// Compare entered password with hashed password
userSchema.methods.comparePassword = async function (enteredPassword) {
    return await bcrypt.compare(enteredPassword, this.password);
};

// Generate a 6-digit OTP (hash it before storing)
userSchema.methods.generateOTP = async function (purpose) {
    const otp = Math.floor(100000 + Math.random() * 900000).toString();
    const salt = await bcrypt.genSalt(10);
    const hashedOTP = await bcrypt.hash(otp, salt);
    this.otp = {
        code: hashedOTP,
        expiresAt: new Date(Date.now() + 10 * 60 * 1000), // 10 minutes
        purpose,
    };
    return otp; // Return plain OTP (to send via email), store hashed version
};

// Verify OTP (compare with hashed version)
userSchema.methods.verifyOTP = async function (enteredOTP, purpose) {
    if (!this.otp || !this.otp.code) return false;
    if (this.otp.purpose !== purpose) return false;
    if (new Date() > this.otp.expiresAt) return false;
    return await bcrypt.compare(enteredOTP, this.otp.code);
};

// Clear OTP after use
userSchema.methods.clearOTP = function () {
    this.otp = { code: undefined, expiresAt: undefined, purpose: undefined };
};

const User = mongoose.model('User', userSchema);

export default User;

import React, { useState, useContext, useEffect, useRef } from 'react';
import { Link, useNavigate, useLocation } from 'react-router-dom';
import { AuthContext } from '../context/AuthContext';
import { Lock, Eye, EyeOff, Loader2, ShieldCheck } from 'lucide-react';

const ResetPassword = () => {
    const navigate = useNavigate();
    const location = useLocation();
    const { resetPassword } = useContext(AuthContext);

    const email = location.state?.email;

    const [otp, setOtp] = useState(['', '', '', '', '', '']);
    const [newPassword, setNewPassword] = useState('');
    const [confirmPassword, setConfirmPassword] = useState('');
    const [showPassword, setShowPassword] = useState(false);
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState('');
    const [success, setSuccess] = useState(false);
    const inputRefs = useRef([]);

    useEffect(() => {
        if (!email) navigate('/forgot-password');
    }, [email, navigate]);

    const handleOtpChange = (index, value) => {
        if (!/^\d*$/.test(value)) return;
        const newOtp = [...otp];
        newOtp[index] = value.slice(-1);
        setOtp(newOtp);
        setError('');
        if (value && index < 5) {
            inputRefs.current[index + 1]?.focus();
        }
    };

    const handleKeyDown = (index, e) => {
        if (e.key === 'Backspace' && !otp[index] && index > 0) {
            inputRefs.current[index - 1]?.focus();
        }
    };

    const handlePaste = (e) => {
        e.preventDefault();
        const pasted = e.clipboardData.getData('text').replace(/\D/g, '').slice(0, 6);
        if (pasted.length > 0) {
            const newOtp = [...otp];
            for (let i = 0; i < 6; i++) newOtp[i] = pasted[i] || '';
            setOtp(newOtp);
            const focusIndex = Math.min(pasted.length, 5);
            inputRefs.current[focusIndex]?.focus();
        }
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        setError('');

        const otpString = otp.join('');
        if (otpString.length !== 6) {
            setError('Please enter all 6 digits');
            return;
        }
        if (newPassword.length < 6) {
            setError('Password must be at least 6 characters');
            return;
        }
        if (newPassword !== confirmPassword) {
            setError('Passwords do not match');
            return;
        }

        setLoading(true);
        try {
            await resetPassword(email, otpString, newPassword);
            setSuccess(true);
            setTimeout(() => navigate('/login'), 3000);
        } catch (err) {
            setError(err.response?.data?.message || 'Failed to reset password');
        } finally {
            setLoading(false);
        }
    };

    if (!email) return null;

    if (success) {
        return (
            <div className="min-h-screen bg-background flex items-center justify-center px-6">
                <div className="text-center max-w-sm">
                    <div className="w-12 h-12 bg-green-50 border border-green-100 rounded-full flex items-center justify-center mb-6 mx-auto">
                        <ShieldCheck className="text-green-600" size={24} />
                    </div>
                    <h1 className="text-xl font-bold text-heading tracking-tight mb-2">Password Reset!</h1>
                    <p className="text-[11px] text-subtext mb-8">Your professional identity has been recovered. Redirecting to sign in...</p>
                    <Link
                        to="/login"
                        className="btn-primary w-full py-2.5"
                    >
                        Return to Sign In
                    </Link>
                </div>
            </div>
        );
    }

    return (
        <div className="min-h-screen bg-background flex flex-col items-center justify-center px-6 py-12 text-text">
            <div className="w-full max-w-sm">
                {/* Brand Logo */}
                <div className="flex flex-col items-center mb-10">
                    <Link to="/" className="flex items-center gap-2 mb-4">
                        <div className="w-8 h-8 bg-primary rounded flex items-center justify-center text-white">
                            <Lock size={16} />
                        </div>
                        <span className="text-xs font-bold text-heading uppercase tracking-widest">ResumeCraft</span>
                    </Link>
                    <h1 className="text-xl font-bold text-heading tracking-tight">Identity Recovery</h1>
                    <p className="text-[11px] text-subtext mt-1 text-center">
                        Enter the code sent to <span className="text-heading font-bold">{email}</span>.
                    </p>
                </div>

                {/* Form Wrapper */}
                <div className="space-y-6">
                    {error && (
                        <div className="p-3 bg-red-50 border border-red-100 rounded text-red-600 text-[11px] font-bold uppercase tracking-tight flex items-center gap-2">
                            <div className="w-1.5 h-1.5 rounded-full bg-red-600" />
                            {error}
                        </div>
                    )}

                    <form onSubmit={handleSubmit} className="space-y-6">
                        {/* OTP */}
                        <div>
                            <label className="block text-[10px] font-bold text-subtext uppercase tracking-tight mb-3 text-center">Verification Code</label>
                            <div className="flex gap-2 justify-center" onPaste={handlePaste}>
                                {otp.map((digit, index) => (
                                    <input
                                        key={index}
                                        ref={(el) => (inputRefs.current[index] = el)}
                                        type="text"
                                        inputMode="numeric"
                                        maxLength={1}
                                        value={digit}
                                        onChange={(e) => handleOtpChange(index, e.target.value)}
                                        onKeyDown={(e) => handleKeyDown(index, e)}
                                        className="w-10 h-12 text-center text-lg font-bold rounded border border-border bg-input-bg text-heading focus:border-primary outline-none transition-all"
                                        autoFocus={index === 0}
                                    />
                                ))}
                            </div>
                        </div>

                        {/* New Password */}
                        <div className="space-y-4">
                            <div>
                                <label className="block text-[10px] font-bold text-subtext uppercase tracking-tight mb-2">New Password</label>
                                <div className="relative">
                                    <input
                                        type={showPassword ? 'text' : 'password'}
                                        value={newPassword}
                                        onChange={(e) => { setNewPassword(e.target.value); setError(''); }}
                                        className="input-base pr-10"
                                        placeholder="Min. 6 characters"
                                        required
                                        minLength={6}
                                    />
                                    <button
                                        type="button"
                                        onClick={() => setShowPassword(!showPassword)}
                                        className="absolute right-3 top-1/2 -translate-y-1/2 text-subtext hover:text-heading"
                                    >
                                        {showPassword ? <EyeOff size={14} /> : <Eye size={14} />}
                                    </button>
                                </div>
                            </div>

                            <div>
                                <label className="block text-[10px] font-bold text-subtext uppercase tracking-tight mb-2">Confirm Identity</label>
                                <input
                                    type={showPassword ? 'text' : 'password'}
                                    value={confirmPassword}
                                    onChange={(e) => { setConfirmPassword(e.target.value); setError(''); }}
                                    className="input-base"
                                    placeholder="••••••••"
                                    required
                                />
                            </div>
                        </div>

                        <button
                            type="submit"
                            disabled={loading}
                            className="btn-primary w-full py-2.5 mt-2"
                        >
                            {loading ? <Loader2 className="animate-spin" size={16} /> : <span>Update Identity</span>}
                        </button>
                    </form>

                    <div className="pt-6 border-t border-border flex items-center justify-center">
                        <Link to="/login" className="text-[11px] font-bold text-subtext uppercase tracking-tight hover:text-heading">
                            ← Back to Sign In
                        </Link>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default ResetPassword;

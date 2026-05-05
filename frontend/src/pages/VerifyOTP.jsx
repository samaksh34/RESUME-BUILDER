import React, { useState, useContext, useEffect, useRef } from 'react';
import { Link, useNavigate, useLocation } from 'react-router-dom';
import { AuthContext } from '../context/AuthContext';
import { ShieldCheck, Loader2, RotateCcw } from 'lucide-react';

const VerifyOTP = () => {
    const navigate = useNavigate();
    const location = useLocation();
    const { verifyOTP, resendOTP } = useContext(AuthContext);

    const email = location.state?.email;
    const purpose = location.state?.purpose || 'verification';

    const [otp, setOtp] = useState(['', '', '', '', '', '']);
    const [loading, setLoading] = useState(false);
    const [resending, setResending] = useState(false);
    const [error, setError] = useState('');
    const [success, setSuccess] = useState('');
    const [countdown, setCountdown] = useState(60);
    const inputRefs = useRef([]);

    // Redirect if no email in state
    useEffect(() => {
        if (!email) {
            navigate('/register');
        }
    }, [email, navigate]);

    // Countdown timer for resend
    useEffect(() => {
        if (countdown <= 0) return;
        const timer = setInterval(() => {
            setCountdown((prev) => prev - 1);
        }, 1000);
        return () => clearInterval(timer);
    }, [countdown]);

    const handleChange = (index, value) => {
        if (!/^\d*$/.test(value)) return; // Only allow digits

        const newOtp = [...otp];
        newOtp[index] = value.slice(-1); // Take only last char
        setOtp(newOtp);
        setError('');

        // Auto-focus next input
        if (value && index < 5) {
            inputRefs.current[index + 1]?.focus();
        }
    };

    const handleKeyDown = (index, e) => {
        // Move back on backspace if current is empty
        if (e.key === 'Backspace' && !otp[index] && index > 0) {
            inputRefs.current[index - 1]?.focus();
        }
    };

    const handlePaste = (e) => {
        e.preventDefault();
        const pasted = e.clipboardData.getData('text').replace(/\D/g, '').slice(0, 6);
        if (pasted.length > 0) {
            const newOtp = [...otp];
            for (let i = 0; i < 6; i++) {
                newOtp[i] = pasted[i] || '';
            }
            setOtp(newOtp);
            // Focus last filled or the next empty
            const focusIndex = Math.min(pasted.length, 5);
            inputRefs.current[focusIndex]?.focus();
        }
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        const otpString = otp.join('');
        if (otpString.length !== 6) {
            setError('Please enter all 6 digits');
            return;
        }

        setLoading(true);
        setError('');
        try {
            await verifyOTP(email, otpString);
            const from = location.state?.from || '/editor';
            navigate(from);
        } catch (err) {
            setError(err.response?.data?.message || 'Invalid OTP. Please try again.');
        } finally {
            setLoading(false);
        }
    };

    const handleResend = async () => {
        setResending(true);
        setError('');
        try {
            await resendOTP(email, purpose);
            setSuccess('A new OTP has been sent to your email!');
            setCountdown(60);
            setOtp(['', '', '', '', '', '']);
            inputRefs.current[0]?.focus();
            setTimeout(() => setSuccess(''), 4000);
        } catch (err) {
            setError(err.response?.data?.message || 'Failed to resend OTP');
        } finally {
            setResending(false);
        }
    };

    if (!email) return null;

    return (
        <div className="min-h-screen bg-background flex flex-col items-center justify-center px-6 py-12 text-text">
            <div className="w-full max-w-sm">
                {/* Brand Logo */}
                <div className="flex flex-col items-center mb-10">
                    <Link to="/" className="flex items-center gap-2 mb-4">
                        <div className="w-8 h-8 bg-primary rounded flex items-center justify-center text-white">
                            <ShieldCheck size={18} />
                        </div>
                        <span className="text-xs font-bold text-heading uppercase tracking-widest">ResumeCraft</span>
                    </Link>
                    <h1 className="text-xl font-bold text-heading tracking-tight">Identity Verification</h1>
                    <p className="text-[11px] text-subtext mt-1 text-center">
                        A 6-digit code was sent to <span className="text-heading font-bold">{email}</span>.
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

                    {success && (
                        <div className="p-3 bg-green-50 border border-green-100 rounded text-green-600 text-[11px] font-bold uppercase tracking-tight flex items-center gap-2">
                            <div className="w-1.5 h-1.5 rounded-full bg-green-600" />
                            {success}
                        </div>
                    )}

                    <form onSubmit={handleSubmit}>
                        {/* OTP Input Grid */}
                        <div className="flex gap-2 justify-center mb-8" onPaste={handlePaste}>
                            {otp.map((digit, index) => (
                                <input
                                    key={index}
                                    ref={(el) => (inputRefs.current[index] = el)}
                                    type="text"
                                    inputMode="numeric"
                                    maxLength={1}
                                    value={digit}
                                    onChange={(e) => handleChange(index, e.target.value)}
                                    onKeyDown={(e) => handleKeyDown(index, e)}
                                    className="w-10 h-12 text-center text-lg font-bold rounded border border-border bg-input-bg text-heading focus:border-primary outline-none transition-all"
                                    autoFocus={index === 0}
                                />
                            ))}
                        </div>

                        <button
                            type="submit"
                            disabled={loading || otp.join('').length !== 6}
                            className="btn-primary w-full py-2.5"
                        >
                            {loading ? <Loader2 className="animate-spin" size={16} /> : <span>Verify Identity</span>}
                        </button>
                    </form>

                    <div className="pt-6 border-t border-border flex flex-col items-center gap-4">
                        {countdown > 0 ? (
                            <p className="text-[10px] font-bold text-subtext uppercase tracking-widest">
                                Resend available in {countdown}s
                            </p>
                        ) : (
                            <button
                                onClick={handleResend}
                                disabled={resending}
                                className="text-[10px] font-bold text-primary uppercase tracking-widest hover:text-primary-dark inline-flex items-center gap-2"
                            >
                                {resending ? <Loader2 className="animate-spin" size={10} /> : <RotateCcw size={10} />}
                                Resend Code
                            </button>
                        )}
                        <Link to="/login" className="text-[11px] font-bold text-subtext uppercase tracking-tight hover:text-heading">
                            ← Return to Sign In
                        </Link>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default VerifyOTP;

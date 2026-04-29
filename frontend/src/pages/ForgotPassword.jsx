import React, { useState, useContext } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { AuthContext } from '../context/AuthContext';
import { Mail, ArrowRight, Loader2, KeyRound, FileText } from 'lucide-react';

const ForgotPassword = () => {
    const navigate = useNavigate();
    const { forgotPassword } = useContext(AuthContext);

    const [email, setEmail] = useState('');
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState('');
    const [sent, setSent] = useState(false);

    const handleSubmit = async (e) => {
        e.preventDefault();
        setLoading(true);
        setError('');
        try {
            await forgotPassword(email);
            setSent(true);
        } catch (err) {
            setError(err.response?.data?.message || 'Something went wrong');
        } finally {
            setLoading(false);
        }
    };

    const handleContinue = () => {
        navigate('/reset-password', { state: { email } });
    };

    return (
        <div className="min-h-screen bg-background flex flex-col items-center justify-center px-6 py-12 text-text">
            <div className="w-full max-w-sm">
                {/* Brand Logo */}
                <div className="flex flex-col items-center mb-10">
                    <Link to="/" className="flex items-center gap-2 mb-4">
                        <div className="w-8 h-8 bg-primary rounded flex items-center justify-center text-white">
                            <FileText size={18} />
                        </div>
                        <span className="text-xs font-bold text-heading uppercase tracking-widest">ResumeCraft</span>
                    </Link>
                    <h1 className="text-xl font-bold text-heading tracking-tight">Recover Identity</h1>
                    <p className="text-xs text-subtext mt-1 text-center">
                        {sent
                            ? `Reset instructions sent to ${email}`
                            : "Provide your email to receive recovery steps."
                        }
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

                    {!sent ? (
                        <form onSubmit={handleSubmit} className="space-y-4">
                            <div>
                                <label className="block text-[10px] font-bold text-subtext uppercase tracking-tight mb-2">Email Address</label>
                                <input
                                    type="email"
                                    value={email}
                                    onChange={(e) => { setEmail(e.target.value); setError(''); }}
                                    className="input-base"
                                    placeholder="name@company.com"
                                    required
                                    autoFocus
                                />
                            </div>

                            <button
                                type="submit"
                                disabled={loading}
                                className="btn-primary w-full py-2.5 mt-2"
                            >
                                {loading ? <Loader2 className="animate-spin" size={16} /> : <span>Send Recovery Code</span>}
                            </button>
                        </form>
                    ) : (
                        <div className="space-y-4">
                            <div className="p-4 bg-surface-highlight border border-border rounded text-[11px] text-subtext text-center italic">
                                If an account exists, you will receive a 6-digit recovery code shortly.
                            </div>
                            <button
                                onClick={handleContinue}
                                className="btn-primary w-full py-2.5"
                            >
                                <span>Enter Recovery Code</span>
                            </button>
                        </div>
                    )}

                    <div className="pt-6 border-t border-border flex items-center justify-center">
                        <Link to="/login" className="text-[11px] font-bold text-subtext uppercase tracking-tight hover:text-heading">
                            ← Return to Sign In
                        </Link>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default ForgotPassword;

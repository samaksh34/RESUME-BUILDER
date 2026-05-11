import React, { useState, useContext } from 'react';
import { Link, useNavigate, useLocation } from 'react-router-dom';
import { AuthContext } from '../context/AuthContext';
import api from '../services/api';
import { Mail, Lock, Eye, EyeOff, ArrowRight, Loader2, FileText } from 'lucide-react';

const Login = () => {
    const navigate = useNavigate();
    const location = useLocation();
    const { login } = useContext(AuthContext);

    const from = location.state?.from?.pathname || '/editor';

    const [formData, setFormData] = useState({ email: '', password: '' });
    const [showPassword, setShowPassword] = useState(false);
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState('');

    const handleChange = (e) => {
        setFormData({ ...formData, [e.target.name]: e.target.value });
        setError('');
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        setLoading(true);
        setError('');
        try {
            await login(formData.email, formData.password);
            navigate(from, { replace: true });
        } catch (err) {
            console.error('Login error:', err);
            const data = err.response?.data;
            
            if (data?.code === 'NOT_VERIFIED') {
                navigate('/verify-otp', { state: { email: formData.email, purpose: 'verification' } });
                return;
            }

            // More descriptive error messages for debugging
            if (!err.response) {
                setError(`Connection Error: Unreachable at ${api.defaults.baseURL}. Check VITE_API_URL.`);
            } else {
                setError(data?.message || 'Login failed. Please try again.');
            }
        } finally {
            setLoading(false);
        }
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
                    <h1 className="text-xl font-bold text-heading tracking-tight">Welcome back</h1>
                    <p className="text-xs text-subtext mt-1">Sign in to manage your professional identity.</p>
                </div>

                {/* Form Wrapper */}
                <div className="space-y-6">
                    {error && (
                        <div className="p-3 bg-red-50 border border-red-100 rounded text-red-600 text-[11px] font-bold uppercase tracking-tight flex items-center gap-2">
                            <div className="w-1.5 h-1.5 rounded-full bg-red-600" />
                            {error}
                        </div>
                    )}

                    <form onSubmit={handleSubmit} className="space-y-4">
                        <div>
                            <label className="block text-[10px] font-bold text-subtext uppercase tracking-tight mb-2">Email Address</label>
                            <input
                                type="email"
                                name="email"
                                value={formData.email}
                                onChange={handleChange}
                                className="input-base"
                                placeholder="name@company.com"
                                required
                            />
                        </div>

                        <div>
                            <div className="flex items-center justify-between mb-2">
                                <label className="block text-[10px] font-bold text-subtext uppercase tracking-tight">Password</label>
                                <Link to="/forgot-password" title="Recover Password" className="text-[10px] font-bold text-primary uppercase tracking-tight hover:text-primary-dark">
                                    Forgot?
                                </Link>
                            </div>
                            <div className="relative">
                                <input
                                    type={showPassword ? 'text' : 'password'}
                                    name="password"
                                    value={formData.password}
                                    onChange={handleChange}
                                    className="input-base pr-10"
                                    placeholder="••••••••"
                                    required
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

                        <button
                            type="submit"
                            disabled={loading}
                            className="btn-primary w-full py-2.5 mt-2"
                        >
                            {loading ? <Loader2 className="animate-spin" size={16} /> : <span>Sign In</span>}
                        </button>
                    </form>

                    <div className="pt-6 border-t border-border flex items-center justify-center">
                        <p className="text-[11px] text-subtext font-medium">
                            No account?{' '}
                            <Link to="/register" className="text-primary font-bold hover:text-primary-dark uppercase tracking-tight">
                                Create Identity
                            </Link>
                        </p>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default Login;

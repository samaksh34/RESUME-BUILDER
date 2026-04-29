import React, { useState, useContext } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { AuthContext } from '../context/AuthContext';
import { Mail, Lock, User, Eye, EyeOff, ArrowRight, Loader2, CheckCircle2, FileText } from 'lucide-react';

const Register = () => {
    const navigate = useNavigate();
    const { register } = useContext(AuthContext);

    const [formData, setFormData] = useState({ name: '', email: '', password: '', confirmPassword: '' });
    const [showPassword, setShowPassword] = useState(false);
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState('');

    const handleChange = (e) => {
        setFormData({ ...formData, [e.target.name]: e.target.value });
        setError('');
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        setError('');

        if (formData.password !== formData.confirmPassword) {
            setError('Passwords do not match');
            return;
        }

        setLoading(true);
        try {
            await register(formData.name, formData.email, formData.password);
            navigate('/verify-otp', { state: { email: formData.email, purpose: 'verification' } });
        } catch (err) {
            console.error('Registration error:', err);
            const message = err.response?.data?.message || err.message || 'Registration failed. Please try again.';
            setError(message);
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
                    <h1 className="text-xl font-bold text-heading tracking-tight">Create your identity</h1>
                    <p className="text-xs text-subtext mt-1">Start building your professional resume today.</p>
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
                            <label className="block text-[10px] font-bold text-subtext uppercase tracking-tight mb-2">Full Name</label>
                            <input
                                type="text"
                                name="name"
                                value={formData.name}
                                onChange={handleChange}
                                className="input-base"
                                placeholder="John Doe"
                                required
                            />
                        </div>

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
                            <label className="block text-[10px] font-bold text-subtext uppercase tracking-tight mb-2">Password</label>
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

                        <div>
                            <label className="block text-[10px] font-bold text-subtext uppercase tracking-tight mb-2">Confirm Password</label>
                            <input
                                type={showPassword ? 'text' : 'password'}
                                name="confirmPassword"
                                value={formData.confirmPassword}
                                onChange={handleChange}
                                className="input-base"
                                placeholder="••••••••"
                                required
                            />
                        </div>

                        <button
                            type="submit"
                            disabled={loading}
                            className="btn-primary w-full py-2.5 mt-2"
                        >
                            {loading ? <Loader2 className="animate-spin" size={16} /> : <span>Create Account</span>}
                        </button>
                    </form>

                    <div className="pt-6 border-t border-border flex items-center justify-center">
                        <p className="text-[11px] text-subtext font-medium">
                            Have an identity?{' '}
                            <Link to="/login" className="text-primary font-bold hover:text-primary-dark uppercase tracking-tight">
                                Sign In
                            </Link>
                        </p>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default Register;

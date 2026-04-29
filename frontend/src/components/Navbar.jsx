import React, { useContext, useState, useRef, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { FileText, Sparkles, Download, Sun, Moon, LogOut, User, ChevronDown } from 'lucide-react';
import { useTheme } from '../context/ThemeContext';
import { AuthContext } from '../context/AuthContext';

const Navbar = () => {
    const { theme, toggleTheme } = useTheme();
    const { user, isAuthenticated, logout } = useContext(AuthContext);
    const navigate = useNavigate();
    const [showDropdown, setShowDropdown] = useState(false);
    const dropdownRef = useRef(null);

    // Close dropdown on outside click
    useEffect(() => {
        const handleClickOutside = (e) => {
            if (dropdownRef.current && !dropdownRef.current.contains(e.target)) {
                setShowDropdown(false);
            }
        };
        document.addEventListener('mousedown', handleClickOutside);
        return () => document.removeEventListener('mousedown', handleClickOutside);
    }, []);

    const handleLogout = async () => {
        setShowDropdown(false);
        await logout();
        navigate('/login');
    };

    return (
        <nav className="h-14 border-b border-border bg-background sticky top-0 z-50">
            <div className="max-w-[1400px] mx-auto px-4 h-full flex items-center justify-between">
                {/* Logo */}
                <Link to="/" className="flex items-center gap-2 group">
                    <FileText size={20} className="text-primary" strokeWidth={2.5} />
                    <h1 className="font-bold text-sm tracking-tight text-heading uppercase">ResumeCraft</h1>
                </Link>

                {/* Actions */}
                <div className="flex items-center gap-2">
                    {isAuthenticated ? (
                        <div className="flex items-center gap-4">
                            <Link to="/editor" className="text-xs font-semibold text-subtext hover:text-heading transition-colors uppercase tracking-tight">Editor</Link>
                            <Link to="/templates" className="text-xs font-semibold text-subtext hover:text-heading transition-colors uppercase tracking-tight">Templates</Link>
                            
                            <div className="w-px h-4 bg-border"></div>
                            
                            {/* User Dropdown */}
                            <div className="relative" ref={dropdownRef}>
                                <button
                                    onClick={() => setShowDropdown(!showDropdown)}
                                    className="flex items-center gap-2 py-1 px-2 rounded-md hover:bg-surface-highlight transition-all"
                                >
                                    <div className="w-6 h-6 rounded bg-primary flex items-center justify-center text-white text-[10px] font-bold">
                                        {user?.name?.charAt(0)?.toUpperCase() || 'U'}
                                    </div>
                                    <ChevronDown
                                        size={12}
                                        className={`text-subtext transition-transform ${showDropdown ? 'rotate-180' : ''}`}
                                    />
                                </button>

                                {showDropdown && (
                                    <div className="absolute right-0 mt-2 w-48 bg-background border border-border rounded-md shadow-md py-1 z-50">
                                        <div className="px-3 py-2 border-b border-border">
                                            <p className="text-xs font-bold text-heading truncate">{user?.name}</p>
                                            <p className="text-[10px] text-subtext truncate">{user?.email}</p>
                                        </div>
                                        <button
                                            onClick={handleLogout}
                                            className="w-full flex items-center gap-2 px-3 py-2 text-xs text-red-500 hover:bg-red-50 transition-colors text-left"
                                        >
                                            <LogOut size={14} />
                                            Sign Out
                                        </button>
                                    </div>
                                )}
                            </div>
                        </div>
                    ) : (
                        <div className="flex items-center gap-2">
                            <Link
                                to="/login"
                                className="px-3 py-1.5 text-xs font-bold text-subtext hover:text-heading transition-all"
                            >
                                Sign In
                            </Link>
                            <Link
                                to="/register"
                                className="btn-primary px-4 py-1.5 text-xs font-bold"
                            >
                                Get Started
                            </Link>
                        </div>
                    )}
                    
                    <div className="w-px h-4 bg-border mx-2"></div>
                    
                    <button
                        onClick={toggleTheme}
                        className="p-1.5 text-subtext hover:text-heading hover:bg-surface-highlight rounded-md transition-all"
                    >
                        {theme === 'light' ? <Moon size={16} /> : <Sun size={16} />}
                    </button>
                </div>
            </div>
        </nav>
    );
};

export default Navbar;

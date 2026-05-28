import React, { useContext, useState, useRef, useEffect } from 'react';
import { Link, useNavigate, useLocation } from 'react-router-dom';
import { FileText, Sun, Moon, LogOut, ChevronDown, Plus } from 'lucide-react';
import { useTheme } from '../context/ThemeContext';
import { AuthContext } from '../context/AuthContext';

const NavLink = ({ to, children, active }) => (
    <Link 
        to={to} 
        className={`text-[11px] font-bold uppercase tracking-[0.15em] transition-all duration-300 relative px-2 py-1 group ${
            active ? 'text-primary' : 'text-subtext hover:text-heading'
        }`}
    >
        {children}
        <span className={`absolute bottom-0 left-2 right-2 h-[1px] bg-primary transition-transform duration-300 origin-left ${
            active ? 'scale-x-100' : 'scale-x-0 group-hover:scale-x-100'
        }`} />
    </Link>
);

const Navbar = () => {
    const { theme, toggleTheme } = useTheme();
    const { user, isAuthenticated, logout } = useContext(AuthContext);
    const navigate = useNavigate();
    const location = useLocation();
    const [showDropdown, setShowDropdown] = useState(false);
    const dropdownRef = useRef(null);

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
        navigate('/');
    };

    return (
        <nav className="h-16 bg-background/80 backdrop-blur-xl sticky top-0 z-50 border-b border-border/60 selection:bg-primary/20">
            <div className="max-w-[1400px] mx-auto px-6 h-full flex items-center justify-between">
                {/* Brand Logo */}
                <Link to="/" className="flex items-center gap-3 group">
                    <div className="w-8 h-8 bg-heading text-background flex items-center justify-center rounded-none group-hover:bg-primary transition-colors duration-500">
                        <FileText size={16} strokeWidth={2.5} />
                    </div>
                    <div className="flex flex-col">
                        <h1 className="font-bold text-xs tracking-[0.2em] text-heading uppercase leading-none">ResumeCraft</h1>
                        <span className="text-[8px] font-black text-primary uppercase tracking-[0.3em] mt-1 opacity-0 group-hover:opacity-100 transition-opacity duration-500">Engineered</span>
                    </div>
                </Link>

                {/* Main Navigation */}
                <div className="hidden md:flex items-center gap-6">
                    <NavLink to="/templates" active={location.pathname === '/templates'}>Templates</NavLink>
                    {isAuthenticated && (
                        <NavLink to="/dashboard" active={location.pathname === '/dashboard'}>Dashboard</NavLink>
                    )}
                    <NavLink to="/editor" active={location.pathname === '/editor'}>Editor</NavLink>
                </div>

                {/* Right Side Actions */}
                <div className="flex items-center gap-4">
                    <button
                        onClick={toggleTheme}
                        className="p-2 text-subtext hover:text-heading transition-colors"
                        title={theme === 'light' ? 'Switch to Dark Mode' : 'Switch to Light Mode'}
                    >
                        {theme === 'light' ? <Moon size={16} /> : <Sun size={16} />}
                    </button>

                    <div className="w-px h-4 bg-border/60"></div>

                    {isAuthenticated ? (
                        <div className="flex items-center gap-4">
                            <Link 
                                to="/editor" 
                                className="hidden sm:flex items-center gap-2 px-4 py-2 bg-primary text-white text-[10px] font-bold uppercase tracking-widest hover:bg-primary-dark transition-all"
                            >
                                <Plus size={14} />
                                New Resume
                            </Link>
                            
                            <div className="relative" ref={dropdownRef}>
                                <button
                                    onClick={() => setShowDropdown(!showDropdown)}
                                    className="flex items-center gap-2 pl-2 group"
                                >
                                    <div className="w-8 h-8 bg-surface-highlight border border-border/60 flex items-center justify-center text-heading text-[10px] font-bold uppercase group-hover:border-primary/40 transition-colors">
                                        {user?.name?.charAt(0)?.toUpperCase() || 'U'}
                                    </div>
                                    <ChevronDown
                                        size={12}
                                        className={`text-subtext transition-transform duration-300 ${showDropdown ? 'rotate-180' : ''}`}
                                    />
                                </button>

                                {showDropdown && (
                                    <div className="absolute right-0 mt-3 w-56 bg-background border border-border shadow-2xl p-1 z-50">
                                        <div className="px-4 py-3 border-b border-border mb-1">
                                            <p className="text-[10px] font-black text-heading uppercase tracking-widest truncate">{user?.name}</p>
                                            <p className="text-[9px] text-subtext truncate mt-1">{user?.email}</p>
                                        </div>
                                        <button
                                            onClick={handleLogout}
                                            className="w-full flex items-center gap-3 px-4 py-2.5 text-[10px] font-bold uppercase tracking-widest text-red-500 hover:bg-red-50 transition-colors text-left"
                                        >
                                            <LogOut size={14} />
                                            Sign Out
                                        </button>
                                    </div>
                                )}
                            </div>
                        </div>
                    ) : (
                        <div className="flex items-center gap-4">
                            <Link
                                to="/login"
                                className="text-[10px] font-bold text-subtext hover:text-heading uppercase tracking-widest transition-colors"
                            >
                                Sign In
                            </Link>
                            <Link
                                to="/register"
                                className="px-6 py-2 bg-primary text-white text-[10px] font-bold uppercase tracking-widest hover:bg-primary-dark transition-all"
                            >
                                Get Started
                            </Link>
                        </div>
                    )}
                </div>
            </div>
        </nav>
    );
};

export default Navbar;

import React from 'react';
import { Link } from 'react-router-dom';
import { FileText, Sparkles, Download, Sun, Moon } from 'lucide-react';
import { useTheme } from '../context/ThemeContext';

const Navbar = () => {
    const { theme, toggleTheme } = useTheme();

    return (
        <nav className="h-16 border-b border-border bg-background/80 backdrop-blur-md sticky top-0 z-50">
            <div className="max-w-8xl mx-auto px-6 h-full flex items-center justify-between">
                {/* Logo */}
                <Link to="/" className="flex items-center gap-3 group">
                    <div className="w-10 h-10 bg-gradient-to-br from-primary to-primary-light rounded-xl flex items-center justify-center text-white shadow-glow group-hover:shadow-glow-cyan transition-all duration-300">
                        <FileText size={22} strokeWidth={2.5} />
                    </div>
                    <div>
                        <h1 className="font-bold text-lg leading-tight text-heading">ResumeCraft</h1>
                        <p className="text-xs text-subtext group-hover:text-primary transition-colors">Build. Export. Land.</p>
                    </div>
                </Link>

                {/* Actions */}
                <div className="flex items-center gap-3 ml-auto">
                    {/* Theme Toggle */}
                    <button
                        onClick={toggleTheme}
                        className="flex items-center justify-center w-10 h-10 text-subtext hover:text-heading hover:bg-gray-100 dark:hover:bg-white/5 rounded-lg transition-all"
                        aria-label="Toggle theme"
                    >
                        {theme === 'light' ? (
                            <Moon size={20} className="transition-transform duration-200" />
                        ) : (
                            <Sun size={20} className="transition-transform duration-200" />
                        )}
                    </button>

                    {/* AI Optimize */}
                    <button className="hidden sm:flex items-center gap-2 px-4 py-2 text-sm font-medium text-primary hover:bg-primary/10 rounded-lg transition-all">
                        <Sparkles size={16} />
                        <span>AI Optimize</span>
                    </button>

                    {/* Export */}
                    <button className="hidden sm:flex items-center gap-2 px-4 py-2 text-sm font-medium text-subtext hover:text-heading hover:bg-gray-100 dark:hover:bg-white/5 rounded-lg transition-all">
                        <Download size={16} />
                        <span>Export</span>
                    </button>

                    {/* Generate Resume CTA */}
                    <button className="btn-cta text-white px-5 py-2.5 text-sm font-semibold">
                        <FileText size={16} />
                        <span>Generate Resume</span>
                    </button>
                </div>
            </div>
        </nav>
    );
};

export default Navbar;

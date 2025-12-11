import React from 'react';
import { Link } from 'react-router-dom';
import { FileText, Sparkles, Download, Sun } from 'lucide-react';

const Navbar = () => {
    return (
        <nav className="h-16 border-b border-border bg-white/70 backdrop-blur-md sticky top-0 z-50">
            <div className="max-w-8xl mx-auto px-6 h-full flex items-center justify-between">
                {/* Logo */}
                <Link to="/" className="flex items-center gap-3">
                    <div className="w-10 h-10 bg-gradient-to-br from-primary to-indigo-600 rounded-xl flex items-center justify-center text-white shadow-sm">
                        <FileText size={22} strokeWidth={2.5} />
                    </div>
                    <div>
                        <h1 className="font-bold text-lg leading-tight text-heading">ResumeCraft</h1>
                        <p className="text-xs text-subtext">Build. Export. Land.</p>
                    </div>
                </Link>

                {/* Actions */}
                <div className="flex items-center gap-3 ml-auto">
                    {/* Theme Toggle */}
                    <button className="hidden sm:flex items-center justify-center w-10 h-10 text-subtext hover:text-heading hover:bg-gray-100 rounded-lg transition-all">
                        <Sun size={20} />
                    </button>

                    {/* AI Optimize */}
                    <button className="hidden sm:flex items-center gap-2 px-4 py-2 text-sm font-medium text-primary hover:bg-primary/5 rounded-lg transition-all">
                        <Sparkles size={16} />
                        <span>AI Optimize</span>
                    </button>

                    {/* Export */}
                    <button className="hidden sm:flex items-center gap-2 px-4 py-2 text-sm font-medium text-subtext hover:text-heading hover:bg-gray-100 rounded-lg transition-all">
                        <Download size={16} />
                        <span>Export</span>
                    </button>

                    {/* Generate Resume CTA */}
                    <button className="btn-accent flex items-center gap-2 px-5 py-2.5 text-sm font-semibold">
                        <FileText size={16} />
                        <span>Generate Resume</span>
                    </button>
                </div>
            </div>
        </nav>
    );
};

export default Navbar;

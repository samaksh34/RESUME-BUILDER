import React from 'react';
import { Link } from 'react-router-dom';
import { ArrowRight, FileText, Sparkles, CheckCircle } from 'lucide-react';
import Navbar from '../components/Navbar';

const Home = () => {
    return (
        <div className="min-h-screen bg-background font-sans">
            <Navbar />

            <main className="max-w-screen-xl mx-auto px-4 pt-20 pb-16 text-center">
                <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-primary/10 text-primary font-medium text-sm mb-8 animate-fade-in-up">
                    <Sparkles size={16} />
                    <span>AI-Powered Resume Builder</span>
                </div>

                <h1 className="text-5xl md:text-7xl font-bold text-slate-900 tracking-tight mb-6 leading-tight">
                    Build a <span className="text-transparent bg-clip-text bg-gradient-to-r from-primary to-secondary">Professional</span> <br />
                    Resume in Minutes
                </h1>

                <p className="text-xl text-slate-600 max-w-2xl mx-auto mb-10 leading-relaxed">
                    Create an ATS-optimized resume with our modern builder. Choose from premium templates and let AI help you land your dream job.
                </p>

                <div className="flex flex-col sm:flex-row items-center justify-center gap-4 mb-20">
                    <Link
                        to="/editor"
                        className="btn-primary text-lg px-8 py-4 h-auto"
                    >
                        Create My Resume
                        <ArrowRight size={20} />
                    </Link>
                    <button className="btn-secondary text-lg px-8 py-4 h-auto">
                        View Templates
                    </button>
                </div>

                {/* Features / Preview */}
                <div className="relative max-w-5xl mx-auto">
                    <div className="absolute -inset-4 bg-gradient-to-r from-primary/20 to-secondary/20 rounded-3xl blur-3xl opacity-30 -z-10"></div>
                    <div className="glass-card p-4 rounded-2xl border-4 border-white/50 shadow-2xl">
                        <img
                            src="https://images.unsplash.com/photo-1586281380349-632531db7ed4?q=80&w=2070&auto=format&fit=crop"
                            alt="Resume Builder Interface"
                            className="rounded-xl w-full h-auto object-cover shadow-inner"
                        />
                    </div>
                </div>
            </main>

            <footer className="border-t border-slate-200 py-12 bg-white">
                <div className="max-w-screen-xl mx-auto px-4 flex flex-col md:flex-row items-center justify-between gap-6">
                    <div className="flex items-center gap-2 text-slate-900 font-bold">
                        <div className="w-8 h-8 bg-primary rounded-lg flex items-center justify-center text-white">
                            <FileText size={18} />
                        </div>
                        ATS Resume Builder
                    </div>
                    <div className="text-slate-500 text-sm">
                        © 2024 ATS Resume Builder. All rights reserved.
                    </div>
                </div>
            </footer>
        </div>
    );
};

export default Home;

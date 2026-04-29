import React from 'react';
import { Link } from 'react-router-dom';
import { FileText, Sparkles, Wand2, LayoutGrid, Download, PlayCircle, ShieldCheck } from 'lucide-react';
import Navbar from '../components/Navbar';

const Home = () => {
    return (
        <div className="min-h-screen bg-background font-sans text-text overflow-x-hidden">
            <Navbar />

            <main className="max-w-[1200px] mx-auto px-6">
                {/* Hero Section */}
                <section className="pt-24 pb-20 border-b border-border">
                    <div className="max-w-[800px]">
                        <div className="inline-flex items-center gap-2 px-2 py-1 rounded bg-surface-highlight border border-border mb-8 animate-fade-in">
                            <span className="text-[10px] font-bold text-primary uppercase tracking-widest">Version 2.0</span>
                            <span className="w-px h-3 bg-border"></span>
                            <span className="text-[10px] font-bold text-subtext uppercase tracking-widest">Production Ready</span>
                        </div>

                        <h1 className="text-5xl md:text-6xl font-bold text-heading tracking-tight leading-[1.1] mb-6">
                            Professional Resumes.<br />
                            <span className="text-subtext/40">Technical Accuracy.</span>
                        </h1>
                        
                        <p className="text-lg text-subtext max-w-xl mb-10 leading-relaxed">
                            A high-density builder for engineers and product teams. 
                            Built for ATS compatibility and surgical precision.
                        </p>

                        <div className="flex flex-wrap items-center gap-3">
                            <Link to="/editor" className="btn-primary px-8 py-3 text-sm">
                                Create New Resume
                            </Link>
                            <Link to="/templates" className="btn-secondary px-8 py-3 text-sm border-transparent hover:border-border">
                                Browse Templates
                            </Link>
                        </div>
                    </div>
                </section>

                {/* Trust Strip */}
                <section className="py-12 border-b border-border flex flex-wrap items-center justify-between gap-8 opacity-40 grayscale pointer-events-none">
                    <span className="text-xs font-bold uppercase tracking-[0.2em] text-subtext mr-4">Trusted by candidates at</span>
                    <div className="flex flex-wrap items-center gap-12 text-sm font-bold tracking-tighter text-heading">
                        <span>METAFRAME</span>
                        <span>LINEARSYS</span>
                        <span>VERCELA</span>
                        <span>RAYCASTER</span>
                        <span>STRIPELX</span>
                    </div>
                </section>

                {/* Features Grid */}
                <section className="py-24 grid md:grid-cols-3 gap-12">
                    {[
                        { 
                            title: 'ATS Compliance', 
                            desc: 'Schema-first formatting that ensures your resume is parsed correctly by enterprise tracking systems.',
                            icon: ShieldCheck
                        },
                        { 
                            title: 'Utilitarian Design', 
                            desc: 'Neutral, professional templates that prioritize information density over decorative flourishes.',
                            icon: LayoutGrid
                        },
                        { 
                            title: 'Rapid Export', 
                            desc: 'Instant PDF generation with vectorized text and perfect alignment. Ready for production.',
                            icon: Download
                        }
                    ].map((feature) => (
                        <div key={feature.title} className="space-y-4">
                            <div className="w-10 h-10 rounded bg-surface-highlight border border-border flex items-center justify-center text-primary">
                                <feature.icon size={20} />
                            </div>
                            <h3 className="text-sm font-bold text-heading uppercase tracking-widest">{feature.title}</h3>
                            <p className="text-sm text-subtext leading-relaxed">{feature.desc}</p>
                        </div>
                    ))}
                </section>

                {/* Workflow Section */}
                <section className="py-24 border-t border-border">
                    <div className="grid lg:grid-cols-2 gap-20">
                        <div className="space-y-6">
                            <h2 className="text-2xl font-bold text-heading tracking-tight">The Technical Workflow</h2>
                            <p className="text-sm text-subtext leading-relaxed max-w-md">
                                Most resume builders focus on aesthetics. We focus on the data. 
                                Our system converts your professional history into a structured document 
                                designed for human readability and machine parsing.
                            </p>
                            <div className="space-y-4 pt-4">
                                {[
                                    'Standardized schema-based data entry',
                                    'Real-time vectorized output preview',
                                    'ATS-validated PDF structure',
                                    'Surgical control over layout density'
                                ].map((item) => (
                                    <div key={item} className="flex items-center gap-3 text-xs font-medium text-heading">
                                        <div className="w-1 h-1 rounded-full bg-primary" />
                                        {item}
                                    </div>
                                ))}
                            </div>
                        </div>
                        <div className="bg-surface border border-border rounded-lg p-8 shadow-sm">
                            <div className="flex items-center justify-between mb-8">
                                <div className="flex gap-1.5">
                                    <div className="w-2 h-2 rounded-full bg-border" />
                                    <div className="w-2 h-2 rounded-full bg-border" />
                                    <div className="w-2 h-2 rounded-full bg-border" />
                                </div>
                                <div className="text-[10px] font-bold text-subtext uppercase tracking-widest">Builder.sys</div>
                            </div>
                            <div className="space-y-4">
                                <div className="h-4 w-1/2 bg-surface-highlight rounded border border-border/50" />
                                <div className="h-4 w-3/4 bg-surface-highlight rounded border border-border/50" />
                                <div className="h-4 w-2/3 bg-surface-highlight rounded border border-border/50" />
                                <div className="h-20 w-full bg-surface-highlight rounded border border-border/50" />
                            </div>
                        </div>
                    </div>
                </section>
            </main>

            <footer className="border-t border-border py-12 bg-background mt-20">
                <div className="max-w-[1200px] mx-auto px-6 flex flex-col md:flex-row items-center justify-between gap-6">
                    <div className="flex items-center gap-3">
                        <div className="w-6 h-6 bg-primary rounded flex items-center justify-center text-white">
                            <FileText size={14} />
                        </div>
                        <span className="text-xs font-bold text-heading uppercase tracking-widest">ResumeCraft</span>
                    </div>
                    <div className="text-[10px] font-bold text-subtext uppercase tracking-[0.2em]">
                        © 2024 ResumeCraft. Open Source. Utilitarian.
                    </div>
                </div>
            </footer>
        </div>
    );
};

export default Home;

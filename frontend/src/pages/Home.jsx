import React from 'react';
import { Link } from 'react-router-dom';
import { FileText, Sparkles, Wand2, LayoutGrid, Download, PlayCircle, ShieldCheck } from 'lucide-react';
import Navbar from '../components/Navbar';

const Home = () => {
    return (
        <div className="min-h-screen bg-background font-sans selection:bg-primary/30 dark:selection:text-white text-text">
            <Navbar />

            <main className="max-w-screen-xl mx-auto px-4 pt-16 pb-20 space-y-14">
                <section className="relative overflow-hidden rounded-4xl bg-white dark:bg-[rgba(255,255,255,0.02)] backdrop-blur-xl border border-gray-200 dark:border-[rgba(255,255,255,0.05)] shadow-xl dark:shadow-[0_25px_80px_rgba(0,0,0,0.5)] px-6 md:px-12 py-16">


                    <div className="relative flex flex-col gap-10">
                        <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-primary/10 text-primary font-medium text-sm w-fit animate-fade-in-up border border-primary/20">
                            <Sparkles size={16} />
                            <span>AI-Powered Resume Builder</span>
                        </div>

                        <div className="grid lg:grid-cols-11 gap-10 items-center">
                            <div className="lg:col-span-7 space-y-6">
                                <div className="space-y-4">
                                    <p className="uppercase tracking-[0.3rem] text-xs font-bold text-subtext">Premium · ATS-Ready · Fast</p>
                                    <h1 className="text-4xl sm:text-5xl lg:text-6xl font-black leading-tight text-heading">
                                        Build a <span className="text-primary">Professional</span> Resume in Minutes
                                    </h1>
                                    <p className="text-lg sm:text-xl text-subtext max-w-2xl font-light">
                                        Create an ATS-optimized resume with modern templates and AI polish. Clean, minimal, and recruiter-approved.
                                    </p>
                                </div>

                                <div className="flex flex-wrap items-center gap-4">
                                    <Link
                                        to="/editor"
                                        className="btn-primary text-lg h-auto"
                                    >
                                        <PlayCircle size={20} />
                                        Create My Resume
                                    </Link>
                                    <Link
                                        to="/templates"
                                        className="btn-secondary text-lg h-auto"
                                    >
                                        <LayoutGrid size={18} />
                                        View Templates
                                    </Link>
                                </div>

                                <div className="flex items-center gap-3 text-xs sm:text-sm text-subtext flex-wrap">
                                    <div className="px-4 py-2 rounded-full bg-surface-highlight border border-border shadow-sm flex items-center gap-2">
                                        <Wand2 size={14} className="text-primary" />
                                        AI phrasing improvements
                                    </div>
                                    <div className="px-4 py-2 rounded-full bg-surface-highlight border border-border shadow-sm flex items-center gap-2">
                                        <ShieldCheck size={14} className="text-secondary" />
                                        ATS-friendly formatting
                                    </div>
                                    <div className="px-4 py-2 rounded-full bg-surface-highlight border border-border shadow-sm flex items-center gap-2">
                                        <Download size={14} className="text-secondary" />
                                        One-click PDF export
                                    </div>
                                </div>
                            </div>

                            <div className="lg:col-span-4">
                                <div className="relative group">

                                    <div className="relative rounded-3xl bg-surface border border-border shadow-2xl p-8 space-y-5">
                                        <div className="space-y-2">
                                            <p className="text-xs font-semibold uppercase tracking-[0.2rem] text-primary">Trusted by candidates</p>
                                            <h3 className="text-2xl font-bold text-heading">Sleek, ATS-ready layouts</h3>
                                            <p className="text-sm text-subtext">Streamlined sections, crisp typography, and recruiter-friendly spacing.</p>
                                        </div>
                                        <div className="grid grid-cols-2 gap-3 text-sm">
                                            {[
                                                { label: 'Templates', value: '20+ Premium' },
                                                { label: 'Exports', value: 'PDF / DOCX' },
                                                { label: 'Optimization', value: 'AI-powered' },
                                                { label: 'Readiness', value: 'ATS proofed' },
                                            ].map((stat) => (
                                                <div key={stat.label} className="p-3 rounded-xl border border-border bg-surface-highlight">
                                                    <p className="text-xs text-subtext">{stat.label}</p>
                                                    <p className="text-lg font-semibold text-heading">{stat.value}</p>
                                                </div>
                                            ))}
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                </section>

                <section className="mt-4">
                    <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-4">
                        {[
                            { icon: Wand2, title: 'AI-Powered Optimization', desc: 'Refine bullets, verbs, and keywords automatically.' },
                            { icon: LayoutGrid, title: '20+ Professional Templates', desc: 'Clean, ATS-friendly layouts with balanced spacing.' },
                            { icon: Download, title: 'One-Click PDF Export', desc: 'Export instantly to PDF with preserved formatting.' },
                            { icon: ShieldCheck, title: 'ATS-Friendly Formatting', desc: 'Structured sections that pass screenings reliably.' },
                        ].map((item) => (
                            <div key={item.title} className="p-6 rounded-2xl bg-surface-highlight border border-border shadow-lg hover:-translate-y-1 hover:shadow-glow hover:border-primary/20 transition-all duration-300 group">
                                <div className="w-11 h-11 rounded-xl bg-primary/10 text-primary flex items-center justify-center mb-4 group-hover:bg-primary group-hover:text-white transition-colors">
                                    <item.icon size={20} />
                                </div>
                                <h3 className="text-lg font-semibold text-heading mb-2">{item.title}</h3>
                                <p className="text-sm text-subtext leading-relaxed">{item.desc}</p>
                            </div>
                        ))}
                    </div>
                </section>

                <section className="mt-6 rounded-3xl bg-white dark:bg-[rgba(255,255,255,0.02)] border border-border shadow-xl p-8 grid lg:grid-cols-3 gap-6 relative overflow-hidden">

                    {[
                        { title: 'Pick a template', desc: 'Choose a premium ATS-ready layout that fits your role.', accent: '01' },
                        { title: 'Fill & optimize', desc: 'Add your details; let AI tune bullet points and keywords.', accent: '02' },
                        { title: 'Export & apply', desc: 'Download polished PDF/DOCX and send with confidence.', accent: '03' },
                    ].map((step) => (
                        <div key={step.title} className="rounded-2xl border border-border bg-surface-highlight p-6 shadow-sm hover:border-primary/30 transition-colors duration-300">
                            <div className="flex items-center justify-between mb-3">
                                <span className="text-xs font-semibold uppercase tracking-[0.2rem] text-subtext">Step</span>
                                <span className="text-sm font-bold text-primary">{step.accent}</span>
                            </div>
                            <h3 className="text-xl font-semibold text-heading mb-2">{step.title}</h3>
                            <p className="text-sm text-subtext leading-relaxed">{step.desc}</p>
                        </div>
                    ))}
                </section>
            </main>

            <footer className="border-t border-border py-10 bg-background">
                <div className="max-w-screen-xl mx-auto px-4 flex flex-col md:flex-row items-center justify-between gap-6">
                    <div className="flex items-center gap-2 text-heading font-bold">
                        <div className="w-8 h-8 bg-gradient-to-br from-primary to-primary-light rounded-lg flex items-center justify-center text-white">
                            <FileText size={18} />
                        </div>
                        ATS Resume Builder
                    </div>
                    <div className="text-subtext text-sm">
                        © 2024 ATS Resume Builder. All rights reserved.
                    </div>
                </div>
            </footer>
        </div>
    );
};

export default Home;

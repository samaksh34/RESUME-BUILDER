import React from 'react';
import { Link } from 'react-router-dom';
import { FileText, Sparkles, Wand2, LayoutGrid, Download, PlayCircle, ShieldCheck } from 'lucide-react';
import Navbar from '../components/Navbar';

const Home = () => {
    return (
        <div className="min-h-screen bg-gradient-to-br from-[#eef2ff] via-[#f8f9ff] to-white font-sans">
            <Navbar />

            <main className="max-w-screen-xl mx-auto px-4 pt-16 pb-20 space-y-14">
                <section className="relative overflow-hidden rounded-4xl bg-white/85 backdrop-blur-xl border border-slate-200 shadow-[0_25px_80px_rgba(15,23,42,0.14)] px-6 md:px-12 py-16">
                    <div className="absolute inset-0 pointer-events-none">
                        <div className="absolute w-80 h-80 bg-primary/12 blur-3xl top-[-90px] right-[-70px]" />
                        <div className="absolute w-72 h-72 bg-indigo-300/15 blur-3xl bottom-[-70px] left-[-50px]" />
                        <div className="absolute inset-0 bg-gradient-to-r from-white/70 via-white/50 to-white/80" />
                    </div>

                    <div className="relative flex flex-col gap-10">
                        <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-primary/10 text-primary font-medium text-sm w-fit animate-fade-in-up border border-primary/15 shadow-sm">
                            <Sparkles size={16} />
                            <span>AI-Powered Resume Builder</span>
                        </div>

                        <div className="grid lg:grid-cols-11 gap-10 items-center">
                            <div className="lg:col-span-7 space-y-6">
                                <div className="space-y-4">
                                    <p className="uppercase tracking-[0.3rem] text-xs font-semibold text-primary/80">Premium · ATS-Ready · Fast</p>
                                    <h1 className="text-4xl sm:text-5xl lg:text-6xl font-black leading-tight text-slate-900">
                                        Build a <span className="text-transparent bg-clip-text bg-gradient-to-r from-primary to-indigo-500">Professional</span> Resume in Minutes
                                    </h1>
                                    <p className="text-lg sm:text-xl text-slate-600 max-w-2xl">
                                        Create an ATS-optimized resume with modern templates and AI polish. Clean, minimal, and recruiter-approved.
                                    </p>
                                </div>

                                <div className="flex flex-wrap items-center gap-4">
                                    <Link
                                        to="/editor"
                                        className="btn-primary text-lg px-6 py-3 h-auto shadow-lg shadow-primary/20 hover:shadow-xl hover:shadow-primary/30"
                                    >
                                        <PlayCircle size={20} />
                                        Create My Resume
                                    </Link>
                                    <Link
                                        to="/templates"
                                        className="btn-secondary text-lg px-6 py-3 h-auto border-primary/20 hover:border-primary/40 hover:bg-primary/5"
                                    >
                                        <LayoutGrid size={18} />
                                        View Templates
                                    </Link>
                                </div>

                                <div className="flex items-center gap-3 text-xs sm:text-sm text-slate-600 flex-wrap">
                                    <div className="px-4 py-2 rounded-full bg-slate-100 border border-slate-200 shadow-inner flex items-center gap-2">
                                        <Wand2 size={14} className="text-primary" />
                                        AI phrasing & bullet improvements
                                    </div>
                                    <div className="px-4 py-2 rounded-full bg-slate-100 border border-slate-200 shadow-inner flex items-center gap-2">
                                        <ShieldCheck size={14} className="text-indigo-500" />
                                        ATS-friendly formatting
                                    </div>
                                    <div className="px-4 py-2 rounded-full bg-slate-100 border border-slate-200 shadow-inner flex items-center gap-2">
                                        <Download size={14} className="text-indigo-500" />
                                        One-click PDF export
                                    </div>
                                </div>
                            </div>

                            <div className="lg:col-span-4">
                                <div className="relative">
                                    <div className="absolute -inset-8 bg-gradient-to-br from-primary/18 via-indigo-200/25 to-white rounded-3xl blur-2xl" />
                                    <div className="relative rounded-3xl bg-white/90 border border-slate-200 shadow-2xl p-8 space-y-5">
                                        <div className="space-y-2">
                                            <p className="text-xs font-semibold uppercase tracking-[0.2rem] text-primary/70">Trusted by candidates</p>
                                            <h3 className="text-2xl font-bold text-slate-900">Sleek, ATS-ready layouts</h3>
                                            <p className="text-sm text-slate-600">Streamlined sections, crisp typography, and recruiter-friendly spacing.</p>
                                        </div>
                                        <div className="grid grid-cols-2 gap-3 text-sm">
                                            <div className="p-3 rounded-xl border border-slate-200 bg-slate-50/70">
                                                <p className="text-xs text-slate-500">Templates</p>
                                                <p className="text-lg font-semibold text-slate-900">20+ Premium</p>
                                            </div>
                                            <div className="p-3 rounded-xl border border-slate-200 bg-slate-50/70">
                                                <p className="text-xs text-slate-500">Exports</p>
                                                <p className="text-lg font-semibold text-slate-900">PDF / DOCX</p>
                                            </div>
                                            <div className="p-3 rounded-xl border border-slate-200 bg-slate-50/70">
                                                <p className="text-xs text-slate-500">Optimization</p>
                                                <p className="text-lg font-semibold text-slate-900">AI-powered</p>
                                            </div>
                                            <div className="p-3 rounded-xl border border-slate-200 bg-slate-50/70">
                                                <p className="text-xs text-slate-500">Readiness</p>
                                                <p className="text-lg font-semibold text-slate-900">ATS proofed</p>
                                            </div>
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
                            { icon: Download, title: 'One-Click PDF Export', desc: 'Export instantly to PDF or DOCX without losing formatting.' },
                            { icon: ShieldCheck, title: 'ATS-Friendly Formatting', desc: 'Structured sections that pass screenings reliably.' },
                        ].map((item) => (
                            <div key={item.title} className="p-6 rounded-2xl bg-white/85 border border-slate-200 shadow-[0_12px_40px_rgba(15,23,42,0.08)] hover:-translate-y-1 transition">
                                <div className="w-11 h-11 rounded-xl bg-primary/10 text-primary flex items-center justify-center mb-4">
                                    <item.icon size={20} />
                                </div>
                                <h3 className="text-lg font-semibold text-slate-900 mb-2">{item.title}</h3>
                                <p className="text-sm text-slate-600 leading-relaxed">{item.desc}</p>
                            </div>
                        ))}
                    </div>
                </section>

                <section className="mt-6 rounded-3xl bg-white/85 border border-slate-200 shadow-[0_18px_60px_rgba(15,23,42,0.1)] p-8 grid lg:grid-cols-3 gap-6">
                    {[
                        { title: 'Pick a template', desc: 'Choose a premium ATS-ready layout that fits your role.', accent: '01' },
                        { title: 'Fill & optimize', desc: 'Add your details; let AI tune bullet points and keywords.', accent: '02' },
                        { title: 'Export & apply', desc: 'Download polished PDF/DOCX and send with confidence.', accent: '03' },
                    ].map((step) => (
                        <div key={step.title} className="rounded-2xl border border-slate-200 bg-gradient-to-br from-white via-white to-slate-50/60 p-6 shadow-sm">
                            <div className="flex items-center justify-between mb-3">
                                <span className="text-xs font-semibold uppercase tracking-[0.2rem] text-primary/70">Step</span>
                                <span className="text-sm font-bold text-primary">{step.accent}</span>
                            </div>
                            <h3 className="text-xl font-semibold text-slate-900 mb-2">{step.title}</h3>
                            <p className="text-sm text-slate-600 leading-relaxed">{step.desc}</p>
                        </div>
                    ))}
                </section>
            </main>

            <footer className="border-t border-slate-200 py-10 bg-white/70 backdrop-blur">
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

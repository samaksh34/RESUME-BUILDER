import React, { useContext } from 'react';
import { Link } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import { 
    FileText, 
    Sparkles, 
    LayoutGrid, 
    Download, 
    ShieldCheck, 
    Zap, 
    CheckCircle2, 
    MousePointer2,
    Layers
} from 'lucide-react';
import Navbar from '../components/Navbar';
import DotGrid from '../components/DotGrid';
import ResumeCollage from '../components/ResumeCollage';
import { AuthContext } from '../context/AuthContext';

const Home = () => {
    const { isAuthenticated } = useContext(AuthContext);
    const [textIndex, setTextIndex] = React.useState(0);
    const phrases = [
        "Engineer your next opportunity.",
        "Build resumes that get shortlisted.",
        "Precision-crafted resumes for modern hiring.",
        "Resume building, engineered properly."
    ];

    React.useEffect(() => {
        const timer = setInterval(() => {
            setTextIndex((prev) => (prev + 1) % phrases.length);
        }, 3000);
        return () => clearInterval(timer);
    }, []);

    const fadeIn = {
        initial: { opacity: 0, y: 20 },
        animate: { opacity: 1, y: 0 },
        transition: { duration: 0.6 }
    };

    const stagger = {
        animate: {
            transition: {
                staggerChildren: 0.1
            }
        }
    };

    return (
        <div className="min-h-screen bg-background font-sans text-text overflow-x-hidden">
            <Navbar />

            <main>
                {/* Hero Section */}
                <section className="relative w-full overflow-hidden bg-background border-b border-border/10 pt-10 md:pt-16 pb-20 md:pb-28">
                    {/* Interactive Background */}
                    <div className="absolute inset-0 z-0 opacity-40">
                        <DotGrid 
                            dotSize={2} 
                            gap={24} 
                            baseColor="#3F3F46" 
                            activeColor="#4F46E5" 
                            proximity={140}
                            shockRadius={200}
                            returnDuration={0.8}
                            shape="square"
                        />
                    </div>

                    {/* Gradient Glows */}
                    <div className="absolute top-1/4 -left-20 w-[500px] h-[500px] glow-bg z-0 pointer-events-none opacity-20" />
                    <div className="absolute bottom-1/4 -right-20 w-[500px] h-[500px] glow-bg z-0 pointer-events-none opacity-10" />

                    <div className="max-w-[1400px] mx-auto px-6 py-2 relative z-10 w-full">
                        <div className="grid lg:grid-cols-2 gap-12 items-start pt-4 md:pt-8">
                            <motion.div 
                                initial="initial"
                                animate="animate"
                                variants={stagger}
                                className="max-w-[700px] py-6"
                            >
                                <motion.div 
                                    variants={fadeIn} 
                                    className="inline-flex items-center gap-2.5 px-3.5 py-1.5 bg-surface-highlight/30 hover:bg-surface-highlight/60 border border-border/40 rounded-full text-[10px] font-semibold tracking-wide text-heading select-none cursor-pointer transition-all duration-300 mb-8 group"
                                >
                                    <span>Built for ATS-first resumes</span>
                                    <span className="text-[10px] text-subtext/60 group-hover:text-heading transition-colors ml-0.5 transition-transform duration-300 transform group-hover:translate-x-0.5">→</span>
                                </motion.div>

                                <div className="relative w-full mb-6 h-[180px] sm:h-[140px] md:h-[240px] lg:h-[220px] xl:h-[200px] flex items-start">
                                    <AnimatePresence mode="wait">
                                        <motion.h1 
                                            key={textIndex}
                                            initial={{ opacity: 0, x: 40 }}
                                            animate={{ opacity: 1, x: 0 }}
                                            exit={{ opacity: 0, x: -40 }}
                                            transition={{ duration: 0.5, ease: "circOut" }}
                                            className="text-4xl sm:text-5xl md:text-6xl lg:text-5xl xl:text-7xl font-bold text-heading tracking-tighter leading-[1.1] text-balance w-full"
                                        >
                                            {phrases[textIndex].split(' ').map((word, i) => (
                                                <span key={i} className={i >= phrases[textIndex].split(' ').length - 2 ? 'text-primary' : ''}>
                                                    {word}{' '}
                                                </span>
                                            ))}
                                        </motion.h1>
                                    </AnimatePresence>
                                </div>
                                
                                <motion.p variants={fadeIn} className="text-xl text-subtext max-w-xl mb-10 leading-relaxed">
                                    Build clean, ATS-friendly resumes with structured layouts, smart formatting, and real-time editing.
                                </motion.p>

                                <motion.div variants={fadeIn} className="flex flex-wrap items-center gap-4">
                                    <Link to="/editor" className="btn-primary px-10 py-4 text-sm font-bold rounded-xl group">
                                        Start Building
                                        <Zap size={16} className="group-hover:fill-current transition-all" />
                                    </Link>
                                    <Link to="/templates" className="btn-secondary px-10 py-4 text-sm font-bold rounded-xl border-border hover:bg-surface">
                                        Browse Templates
                                    </Link>
                                </motion.div>
                            </motion.div>

                            {/* Hero Collage */}
                            <motion.div 
                                initial={{ opacity: 0, scale: 0.9, x: 50 }}
                                animate={{ opacity: 1, scale: 1, x: -60 }}
                                transition={{ duration: 0.8, delay: 0.2 }}
                                className="relative hidden lg:flex justify-center items-center h-[500px] w-full overflow-visible translate-y-[-90px]"
                            >
                                <ResumeCollage />
                            </motion.div>
                        </div>
                    </div>
                </section>

                <div className="max-w-[1400px] mx-auto px-6">
                    {/* Features Bento Grid */}
                    <section className="py-24">
                        <div className="max-w-2xl mx-auto text-center mb-20">
                            <motion.h2 
                                initial={{ opacity: 0, y: 20 }}
                                whileInView={{ opacity: 1, y: 0 }}
                                viewport={{ once: true }}
                                className="text-4xl font-bold text-heading tracking-tight mb-6"
                            >
                                Built for precision. Optimized for hiring.
                            </motion.h2>
                            <motion.p 
                                initial={{ opacity: 0, y: 20 }}
                                whileInView={{ opacity: 1, y: 0 }}
                                viewport={{ once: true }}
                                transition={{ delay: 0.1 }}
                                className="text-subtext text-lg"
                            >
                                Structured editing, optimized layouts, and export-ready formatting built for professional resumes.
                            </motion.p>
                        </div>

                        <div className="grid md:grid-cols-3 gap-6">
                            {/* Card 1: ATS Optimized */}
                            <motion.div 
                                whileHover={{ y: -4 }} 
                                className="bg-surface border border-border border-l-2 border-l-primary p-8 rounded-none flex flex-col justify-between min-h-[270px] transition-all duration-300 hover:border-primary/40 hover:border-l-primary select-none group"
                            >
                                <div>
                                    <div className="flex items-center justify-between mb-6">
                                        <span className="text-sm sm:text-base font-mono text-primary font-black tracking-wider">1 ATS SYSTEM</span>
                                        <ShieldCheck size={16} className="text-subtext/40 group-hover:text-primary transition-colors" />
                                    </div>
                                    <h3 className="text-lg font-bold text-heading mb-3 uppercase tracking-wider">ATS OPTIMIZED</h3>
                                    <p className="text-subtext text-sm leading-relaxed font-medium">Structured resume formatting designed to improve ATS readability and consistency.</p>
                                </div>
                                <div className="flex justify-end mt-4">
                                    <span className="text-[8px] font-mono text-subtext/40 font-bold uppercase tracking-widest">[ ATS // OPTIMIZED ]</span>
                                </div>
                            </motion.div>

                            {/* Card 2: Modern Templates */}
                            <motion.div 
                                whileHover={{ y: -4 }} 
                                className="bg-surface border border-border border-l-2 border-l-primary p-8 rounded-none flex flex-col justify-between min-h-[270px] transition-all duration-300 hover:border-primary/40 hover:border-l-primary select-none group"
                            >
                                <div>
                                    <div className="flex items-center justify-between mb-6">
                                        <span className="text-sm sm:text-base font-mono text-primary font-black tracking-wider">2 LAYOUT</span>
                                        <LayoutGrid size={16} className="text-subtext/40 group-hover:text-primary transition-colors" />
                                    </div>
                                    <h3 className="text-lg font-bold text-heading mb-3 uppercase tracking-wider">MODERN TEMPLATES</h3>
                                    <p className="text-subtext text-sm leading-relaxed font-medium">Minimal templates focused on readability, spacing, and professional presentation.</p>
                                </div>
                                <div className="flex justify-end mt-4">
                                    <span className="text-[8px] font-mono text-subtext/40 font-bold uppercase tracking-widest">[ LAYOUT // OPTIMIZED ]</span>
                                </div>
                            </motion.div>

                            {/* Card 3: PDF Export */}
                            <motion.div 
                                whileHover={{ y: -4 }} 
                                className="bg-surface border border-border border-l-2 border-l-primary p-8 rounded-none flex flex-col justify-between min-h-[270px] transition-all duration-300 hover:border-primary/40 hover:border-l-primary select-none group"
                            >
                                <div>
                                    <div className="flex items-center justify-between mb-6">
                                        <span className="text-sm sm:text-base font-mono text-primary font-black tracking-wider">3 EXPORT</span>
                                        <Download size={16} className="text-subtext/40 group-hover:text-primary transition-colors" />
                                    </div>
                                    <h3 className="text-lg font-bold text-heading mb-3 uppercase tracking-wider">PDF EXPORT</h3>
                                    <p className="text-subtext text-sm leading-relaxed font-medium">Export sharp, print-ready PDF resumes with consistent formatting across devices.</p>
                                </div>
                                <div className="flex justify-end mt-4">
                                    <span className="text-[8px] font-mono text-subtext/40 font-bold uppercase tracking-widest">[ PDF // READY ]</span>
                                </div>
                            </motion.div>
                        </div>
                    </section>

                    {/* Combined Feedback & Final CTA Section */}
                    <section className="py-24 border-t border-border">
                        <div className="grid lg:grid-cols-2 gap-20 items-center">
                            {/* Left: Feedback */}
                            <div className="max-w-xl">
                                <div className="flex items-center gap-2 mb-6">
                                    <div className="w-6 h-[1px] bg-primary" />
                                    <span className="text-[10px] font-bold text-primary uppercase tracking-[0.3em]">FEEDBACK</span>
                                </div>
                                <h2 className="text-3xl font-bold text-heading mb-6 tracking-tight">Help us improve ResumeCraft.</h2>
                                <p className="text-subtext text-sm mb-8 leading-relaxed">
                                    Have suggestions or ideas? Share feedback to help improve the ResumeCraft experience.
                                </p>
                                <form className="flex gap-2">
                                    <input 
                                        type="text" 
                                        placeholder="Share your feedback..." 
                                        className="flex-1 bg-surface border border-border px-4 py-3 text-[10px] font-bold uppercase tracking-widest outline-none focus:border-primary transition-colors placeholder:text-subtext/40"
                                    />
                                    <button className="px-6 py-3 bg-heading text-white text-[10px] font-bold uppercase tracking-widest hover:bg-zinc-800 transition-all whitespace-nowrap">
                                        Send
                                    </button>
                                </form>
                            </div>

                            {/* Right: Final CTA */}
                            <div className="relative p-6 sm:p-10 md:p-16 overflow-hidden bg-surface border border-border">
                                {/* Decorative Background for CTA */}
                                <div className="absolute inset-0 opacity-[0.03] pointer-events-none">
                                    <DotGrid dotSize={1} gap={20} baseColor="#000000" activeColor="#4F46E5" />
                                </div>
                                
                                <div className="relative z-10">
                                    <div className="flex items-center gap-2 mb-6">
                                        <div className="w-6 h-[1px] bg-primary" />
                                        <span className="text-[10px] font-bold text-primary uppercase tracking-[0.3em]">GET STARTED</span>
                                    </div>
                                    <h2 className="text-3xl md:text-4xl font-bold text-heading mb-6 tracking-tighter">
                                        Ready to build your <span className="text-primary">next resume?</span>
                                    </h2>
                                    <div className="flex flex-col sm:flex-row items-center gap-4">
                                        <Link to="/editor" className="w-full sm:w-auto px-8 py-3 bg-primary text-white text-[10px] font-bold uppercase tracking-widest hover:bg-primary-dark transition-all text-center">
                                            Start Building
                                        </Link>
                                        <Link to="/templates" className="w-full sm:w-auto px-8 py-3 border border-border text-heading text-[10px] font-bold uppercase tracking-widest hover:bg-surface-highlight transition-all text-center">
                                            Browse Templates
                                        </Link>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </section>
                </div>
            </main>

            <footer className="border-t border-border py-16 bg-surface/30">
                <div className="max-w-[1400px] mx-auto px-6">
                    <div className="grid md:grid-cols-4 gap-12 mb-16">
                        <div className="col-span-1 md:col-span-1">
                            <div className="flex items-center gap-3 mb-6">
                                <div className="w-7 h-7 bg-heading text-background flex items-center justify-center">
                                    <FileText size={14} />
                                </div>
                                <span className="text-sm font-bold text-heading uppercase tracking-[0.2em]">ResumeCraft</span>
                            </div>
                            <p className="text-[11px] text-subtext leading-relaxed font-medium">
                                Modern resume building focused on clarity, structure, and ATS-ready formatting.
                            </p>
                        </div>
                        <div>
                            <h5 className="font-bold text-heading mb-6 uppercase tracking-widest text-[10px]">Product</h5>
                            <ul className="space-y-3 text-[11px] text-subtext font-bold uppercase tracking-widest">
                                <li><Link to="/editor" className="hover:text-primary transition-colors">Editor</Link></li>
                                <li><Link to="/templates" className="hover:text-primary transition-colors">Templates</Link></li>
                                <li><Link to="/dashboard" className="hover:text-primary transition-colors">Dashboard</Link></li>
                            </ul>
                        </div>
                        <div>
                            <h5 className="font-bold text-heading mb-6 uppercase tracking-widest text-[10px]">Resources</h5>
                            <ul className="space-y-3 text-[11px] text-subtext font-bold uppercase tracking-widest">
                                <li><a href="#" className="hover:text-primary transition-colors">Resume Guide</a></li>
                                <li><a href="#" className="hover:text-primary transition-colors">Documentation</a></li>
                                <li><a href="#" className="hover:text-primary transition-colors">Tips & Best Practices</a></li>
                            </ul>
                        </div>
                        <div>
                            <h5 className="font-bold text-heading mb-6 uppercase tracking-widest text-[10px]">Legal</h5>
                            <ul className="space-y-3 text-[11px] text-subtext font-bold uppercase tracking-widest">
                                <li><a href="#" className="hover:text-primary transition-colors">Privacy</a></li>
                                <li><a href="#" className="hover:text-primary transition-colors">Terms</a></li>
                            </ul>
                        </div>
                    </div>
                    <div className="pt-8 border-t border-border flex flex-col md:flex-row items-center justify-between gap-6">
                        <div className="text-[9px] font-bold text-subtext/60 uppercase tracking-[0.3em]">
                            © 2024 ResumeCraft. Built for modern professionals.
                        </div>
                        <div className="flex items-center gap-6 opacity-40">
                            <Zap size={14} className="text-heading" />
                            <Sparkles size={14} className="text-heading" />
                            <LayoutGrid size={14} className="text-heading" />
                        </div>
                    </div>
                </div>
            </footer>


        </div>
    );
};

export default Home;

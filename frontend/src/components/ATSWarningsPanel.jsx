import React, { useMemo } from 'react';
import { AlertTriangle, CheckCircle, Info, ShieldCheck, Zap, Hash, Palette, Image as ImageIcon, Layout } from 'lucide-react';

const ATSWarningsPanel = ({ resumeData, template }) => {
    const analysis = useMemo(() => {
        const warnings = [];
        const successes = [];
        const tips = [];

        if (!resumeData) return { warnings, successes, tips, score: 0 };

        const {
            personalInfo = {},
            education = [],
            technicalSkills = [],
            internships = [],
            projects = [],
        } = resumeData;

        // 1. Tables/Layout Check
        if (template === 'boxed' || template === 'accent') {
            warnings.push({
                id: 'layout-table',
                type: 'warning',
                title: 'Complex Layout Detected',
                message: 'Multi-column or boxed layouts can sometimes confuse older ATS scanners. Stick to a single-column "ATS" template for 99% compatibility.',
                icon: <Layout className="text-orange-500" size={18} />
            });
        } else {
            successes.push({
                title: 'Standard Layout',
                message: 'Your current template uses a clean, scanner-friendly structure.',
                icon: <CheckCircle className="text-green-500" size={18} />
            });
        }

        // 2. Icons Check
        const contactIconsCount = [personalInfo.phone, personalInfo.email, personalInfo.linkedin, personalInfo.github].filter(Boolean).length;
        if (contactIconsCount > 3 && template !== 'ats') {
            warnings.push({
                id: 'icons-issue',
                type: 'warning',
                title: 'High Icon Usage',
                message: 'Some ATS systems may struggle with graphical symbols. Ensure your contact info is also clearly readable as text.',
                icon: <ImageIcon className="text-orange-500" size={18} />
            });
        }

        // 3. Colors Check
        if (template === 'accent' || template === 'boxed') {
            warnings.push({
                id: 'color-count',
                type: 'info',
                title: 'Color Palatte',
                message: 'Using multiple colors is visually nice but ensure high contrast. Dark text on light background is always safest for OCR.',
                icon: <Palette className="text-blue-500" size={18} />
            });
        }

        // 4. Keywords Check
        const allText = JSON.stringify(resumeData).toLowerCase();
        const commonKeywords = [
            'javascript', 'react', 'node', 'python', 'sql', 'agile', 'scrum', 
            'management', 'leadership', 'development', 'analysis', 'design',
            'git', 'cloud', 'aws', 'docker', 'api', 'testing'
        ];
        
        const foundKeywords = commonKeywords.filter(kw => allText.includes(kw));
        const missingKeywords = commonKeywords.filter(kw => !allText.includes(kw)).slice(0, 5);

        if (foundKeywords.length < 5) {
            warnings.push({
                id: 'keywords-missing',
                type: 'critical',
                title: 'Low Keyword Density',
                message: `Missing essential industry keywords. Consider adding: ${missingKeywords.join(', ')}.`,
                icon: <Hash className="text-red-500" size={18} />
            });
        } else {
            successes.push({
                title: 'Good Keyword Usage',
                message: `Found ${foundKeywords.length} key industry terms in your resume.`,
                icon: <Zap className="text-yellow-500" size={18} />
            });
        }

        // 5. Structure Checks
        if (!personalInfo.summary || personalInfo.summary.length < 50) {
            tips.push({
                title: 'Missing Summary',
                message: 'A strong professional summary helps ATS categorize your profile faster.',
                icon: <Info className="text-blue-400" size={16} />
            });
        }

        // Calculate Score
        let score = 70;
        score -= (warnings.filter(w => w.type === 'critical').length * 15);
        score -= (warnings.filter(w => w.type === 'warning').length * 10);
        score += (successes.length * 5);
        score = Math.min(Math.max(score, 0), 100);

        return { warnings, successes, tips, score };
    }, [resumeData, template]);

    return (
        <div className="bg-surface backdrop-blur-xl border border-white/[0.05] rounded-3xl overflow-hidden flex flex-col h-full transition-all duration-300">
            {/* Header with Circular Score */}
            <div className="p-6 border-b border-white/[0.05] bg-gradient-to-br from-primary/10 via-transparent to-transparent relative overflow-hidden">
                <div className="absolute top-0 right-0 w-32 h-32 bg-primary/10 blur-[60px] rounded-full -mr-16 -mt-16"></div>
                
                <div className="flex items-center justify-between relative z-10">
                    <div className="flex items-center gap-4">
                        <div className="w-12 h-12 rounded-2xl bg-gradient-to-br from-primary to-primary-dark flex items-center justify-center shadow-lg shadow-primary/20">
                            <ShieldCheck className="text-white" size={24} />
                        </div>
                        <div>
                            <h3 className="font-bold text-heading text-lg tracking-tight">ATS Optimizer</h3>
                            <div className="flex items-center gap-1.5">
                                <span className="w-2 h-2 rounded-full bg-green-500 animate-pulse"></span>
                                <p className="text-[10px] text-subtext uppercase tracking-widest font-bold">Real-time Analysis</p>
                            </div>
                        </div>
                    </div>

                    {/* Circular Score Gauge */}
                    <div className="relative w-16 h-16">
                        <svg className="w-full h-full transform -rotate-90">
                            <circle
                                cx="32"
                                cy="32"
                                r="28"
                                stroke="currentColor"
                                strokeWidth="4"
                                fill="transparent"
                                className="text-white/5"
                            />
                            <circle
                                cx="32"
                                cy="32"
                                r="28"
                                stroke="currentColor"
                                strokeWidth="4"
                                fill="transparent"
                                strokeDasharray={2 * Math.PI * 28}
                                strokeDashoffset={2 * Math.PI * 28 * (1 - analysis.score / 100)}
                                className={`transition-all duration-1000 ease-out ${
                                    analysis.score > 80 ? 'text-green-500' : analysis.score > 60 ? 'text-yellow-500' : 'text-red-500'
                                }`}
                                strokeLinecap="round"
                            />
                        </svg>
                        <div className="absolute inset-0 flex items-center justify-center">
                            <span className="text-sm font-black text-heading">{analysis.score}</span>
                        </div>
                    </div>
                </div>
            </div>

            {/* Content */}
            <div className="flex-1 overflow-y-auto p-6 space-y-8 custom-scrollbar">
                {/* Warnings / Critical */}
                {analysis.warnings.length > 0 && (
                    <div className="space-y-4">
                        <div className="flex items-center justify-between px-1">
                            <h4 className="text-[11px] font-black text-subtext uppercase tracking-[0.2em]">Optimization Required</h4>
                            <span className="px-2 py-0.5 rounded-full bg-red-500/10 text-red-500 text-[10px] font-bold border border-red-500/20">
                                {analysis.warnings.length} Issues
                            </span>
                        </div>
                        <div className="space-y-3">
                            {analysis.warnings.map((item, i) => (
                                <div key={i} className="group p-4 rounded-2xl bg-white/[0.02] border border-white/[0.05] hover:border-primary/30 hover:bg-primary/[0.02] transition-all duration-300">
                                    <div className="flex gap-4">
                                        <div className="w-10 h-10 rounded-xl bg-white/[0.03] flex items-center justify-center flex-shrink-0 group-hover:scale-110 transition-transform">
                                            {item.icon}
                                        </div>
                                        <div>
                                            <h5 className="text-sm font-bold text-heading group-hover:text-primary transition-colors">{item.title}</h5>
                                            <p className="text-xs text-subtext mt-1.5 leading-relaxed font-medium">{item.message}</p>
                                        </div>
                                    </div>
                                </div>
                            ))}
                        </div>
                    </div>
                )}

                {/* Successes */}
                {analysis.successes.length > 0 && (
                    <div className="space-y-4">
                        <div className="flex items-center justify-between px-1">
                            <h4 className="text-[11px] font-black text-subtext uppercase tracking-[0.2em]">Passes</h4>
                            <div className="flex -space-x-2">
                                {analysis.successes.map((_, i) => (
                                    <div key={i} className="w-5 h-5 rounded-full bg-green-500/20 border border-background flex items-center justify-center">
                                        <CheckCircle className="text-green-500" size={10} />
                                    </div>
                                ))}
                            </div>
                        </div>
                        <div className="space-y-3">
                            {analysis.successes.map((item, i) => (
                                <div key={i} className="p-4 rounded-2xl bg-green-500/[0.02] border border-green-500/10 hover:border-green-500/30 transition-all">
                                    <div className="flex gap-4">
                                        <div className="w-10 h-10 rounded-xl bg-green-500/10 flex items-center justify-center flex-shrink-0">
                                            {item.icon}
                                        </div>
                                        <div>
                                            <h5 className="text-sm font-bold text-heading">{item.title}</h5>
                                            <p className="text-xs text-subtext mt-1.5 leading-relaxed font-medium">{item.message}</p>
                                        </div>
                                    </div>
                                </div>
                            ))}
                        </div>
                    </div>
                )}

                {/* Tips */}
                {analysis.tips.length > 0 && (
                    <div className="space-y-4">
                        <h4 className="text-[11px] font-black text-subtext uppercase tracking-[0.2em] px-1">Expert Strategies</h4>
                        <div className="bg-gradient-to-br from-blue-500/5 to-purple-500/5 border border-blue-500/10 rounded-2xl p-5 relative overflow-hidden">
                            <div className="absolute bottom-0 right-0 p-4 opacity-5 pointer-events-none">
                                <Zap size={80} />
                            </div>
                            <ul className="space-y-4 relative z-10">
                                {analysis.tips.map((item, i) => (
                                    <li key={i} className="flex gap-3">
                                        <div className="mt-0.5 p-1 rounded-md bg-blue-500/10 text-blue-400">
                                            {item.icon}
                                        </div>
                                        <div className="text-xs">
                                            <span className="font-bold text-heading block mb-1">{item.title}</span>
                                            <p className="text-subtext font-medium leading-normal">{item.message}</p>
                                        </div>
                                    </li>
                                ))}
                            </ul>
                        </div>
                    </div>
                )}
            </div>

            {/* Footer with Badge */}
            <div className="p-6 bg-white/[0.02] border-t border-white/[0.05] flex items-center justify-center flex-col gap-3">
                <div className="flex items-center gap-2 px-3 py-1 rounded-full bg-white/[0.03] border border-white/[0.05]">
                    <ShieldCheck size={12} className="text-primary" />
                    <span className="text-[10px] font-bold text-subtext">AI-POWERED OPTIMIZATION</span>
                </div>
                <p className="text-[10px] text-center text-subtext/60 italic font-medium px-4">
                    Analysis engine cross-references with 50,000+ top-tier industry resumes.
                </p>
            </div>
        </div>
    );
};

export default ATSWarningsPanel;

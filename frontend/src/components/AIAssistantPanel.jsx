import React, { useState, useMemo, useRef, useEffect } from 'react';
import { 
    ShieldCheck, 
    Sparkles, 
    FileText, 
    CheckCircle, 
    AlertTriangle, 
    Info, 
    Palette, 
    Layout, 
    Image as ImageIcon, 
    Hash, 
    Zap, 
    Copy, 
    Check, 
    ArrowRight, 
    ListChecks, 
    UserCheck,
    Cpu
} from 'lucide-react';
import { aiAPI } from '../services/api';

const AIAssistantPanel = ({ resumeData, template }) => {
    const [activeTab, setActiveTab] = useState('rules'); // 'rules' | 'analyzer' | 'coverletter'
    const [jobDescription, setJobDescription] = useState(() => {
        return localStorage.getItem('target_job_description') || '';
    });
    
    // Persist Job Description locally for convenience
    useEffect(() => {
        localStorage.setItem('target_job_description', jobDescription);
    }, [jobDescription]);

    // AI Analyzer States
    const [analyzing, setAnalyzing] = useState(false);
    const [analysisError, setAnalysisError] = useState(null);
    const [aiAnalysis, setAiAnalysis] = useState(() => {
        try {
            const cached = localStorage.getItem('ai_analysis_cache');
            return cached ? JSON.parse(cached) : null;
        } catch {
            return null;
        }
    });

    // Cover Letter States
    const [generatingLetter, setGeneratingLetter] = useState(false);
    const [coverLetterText, setCoverLetterText] = useState('');
    const [letterError, setLetterError] = useState(null);
    const [copied, setCopied] = useState(false);

    // ── Tab 1: Static Rules Code (From ATSWarningsPanel.jsx) ─────────────
    const staticAnalysis = useMemo(() => {
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

        // 1. Layout Check
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

        // 2. Contact Icons Check
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

        // 3. Color Check
        if (template === 'accent' || template === 'boxed') {
            warnings.push({
                id: 'color-count',
                type: 'info',
                title: 'Color Palette Contrast',
                message: 'Using multiple colors is visually nice but ensure high contrast. Dark text on light background is always safest for OCR.',
                icon: <Palette className="text-blue-500" size={18} />
            });
        }

        // 4. Basic Keyword Density Check (Fallback when AI is off)
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

        // 5. Structure Check
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

    // ── AI Analyzer Execution ──────────────────────────────────────────
    const handleAIAnalyze = async () => {
        if (!jobDescription.trim()) return;
        setAnalyzing(true);
        setAnalysisError(null);

        try {
            const response = await aiAPI.analyze(resumeData, jobDescription);
            if (response.data.success) {
                const analysisResult = response.data.analysis;
                setAiAnalysis(analysisResult);
                localStorage.setItem('ai_analysis_cache', JSON.stringify(analysisResult));
            } else {
                throw new Error(response.data.message || 'AI Analysis failed.');
            }
        } catch (err) {
            console.error('AI Analysis error:', err);
            const errMsg = err.response?.data?.message || err.message || 'Failed to complete AI analysis.';
            setAnalysisError({
                message: errMsg,
                isConfigError: err.response?.data?.isConfigError || errMsg.includes('GEMINI_API_KEY')
            });
        } finally {
            setAnalyzing(false);
        }
    };

    // ── AI Cover Letter Streaming Execution ────────────────────────────
    const handleGenerateCoverLetter = () => {
        if (!jobDescription.trim()) return;
        setGeneratingLetter(true);
        setLetterError(null);
        setCoverLetterText('');

        aiAPI.generateCoverLetterStream(
            resumeData,
            jobDescription,
            // onChunk
            (chunk) => {
                setCoverLetterText(prev => prev + chunk);
            },
            // onError
            (err) => {
                console.error('Stream error:', err);
                setGeneratingLetter(false);
                setLetterError({
                    message: err.message || 'Error streaming cover letter.',
                    isConfigError: err.message.includes('GEMINI_API_KEY')
                });
            },
            // onDone
            () => {
                setGeneratingLetter(false);
            }
        );
    };

    // ── Utility: Copy Letter ───────────────────────────────────────────
    const handleCopyLetter = () => {
        navigator.clipboard.writeText(coverLetterText);
        setCopied(true);
        setTimeout(() => setCopied(false), 2000);
    };

    return (
        <div className="bg-surface border border-border rounded-3xl overflow-hidden flex flex-col h-full transition-all duration-300">
            {/* Header */}
            <div className="p-4 border-b border-border bg-surface-highlight/30 flex items-center justify-between">
                <div className="flex items-center gap-3">
                    <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-primary to-primary-dark flex items-center justify-center shadow-lg shadow-primary/20">
                        <Cpu className="text-white" size={20} />
                    </div>
                    <div>
                        <h3 className="font-bold text-heading text-base tracking-tight">AI Assistant & Optimizer</h3>
                        <p className="text-[9px] text-subtext uppercase tracking-widest font-bold">Real-time Copilot</p>
                    </div>
                </div>
            </div>

            {/* Premium Tab Bar */}
            <div className="flex border-b border-border bg-white/[0.01] p-1 gap-1">
                <button
                    onClick={() => setActiveTab('rules')}
                    className={`flex-1 py-2 px-1 text-[10px] font-black uppercase tracking-wider rounded-xl transition-all flex items-center justify-center gap-1.5 ${
                        activeTab === 'rules' 
                            ? 'bg-surface-highlight text-primary border border-border/60 shadow-sm' 
                            : 'text-subtext hover:text-heading'
                    }`}
                >
                    <ListChecks size={12} /> Local Audit
                </button>
                <button
                    onClick={() => setActiveTab('analyzer')}
                    className={`flex-1 py-2 px-1 text-[10px] font-black uppercase tracking-wider rounded-xl transition-all flex items-center justify-center gap-1.5 ${
                        activeTab === 'analyzer' 
                            ? 'bg-surface-highlight text-primary border border-border/60 shadow-sm' 
                            : 'text-subtext hover:text-heading'
                    }`}
                >
                    <Sparkles size={12} /> AI Job Matcher
                </button>
                <button
                    onClick={() => setActiveTab('coverletter')}
                    className={`flex-1 py-2 px-1 text-[10px] font-black uppercase tracking-wider rounded-xl transition-all flex items-center justify-center gap-1.5 ${
                        activeTab === 'coverletter' 
                            ? 'bg-surface-highlight text-primary border border-border/60 shadow-sm' 
                            : 'text-subtext hover:text-heading'
                    }`}
                >
                    <FileText size={12} /> AI Cover Letter
                </button>
            </div>

            {/* Content Pane */}
            <div className="flex-1 overflow-y-auto p-5 space-y-6 custom-scrollbar">
                
                {/* ── TAB 1: LOCAL RULES ── */}
                {activeTab === 'rules' && (
                    <div className="space-y-6">
                        {/* Score Gauge */}
                        <div className="flex items-center justify-between p-4 rounded-2xl bg-white/[0.01] border border-border">
                            <div>
                                <h4 className="font-bold text-heading text-sm">Static Audit Score</h4>
                                <p className="text-[10px] text-subtext mt-0.5">Quick structural & keyword validation rules</p>
                            </div>
                            <div className="relative w-14 h-14 flex items-center justify-center">
                                <svg className="w-full h-full transform -rotate-90 absolute">
                                    <circle cx="28" cy="28" r="24" stroke="currentColor" strokeWidth="4" fill="transparent" className="text-white/5" />
                                    <circle
                                        cx="28"
                                        cy="28"
                                        r="24"
                                        stroke="currentColor"
                                        strokeWidth="4"
                                        fill="transparent"
                                        strokeDasharray={2 * Math.PI * 24}
                                        strokeDashoffset={2 * Math.PI * 24 * (1 - staticAnalysis.score / 100)}
                                        className={`transition-all duration-1000 ease-out ${
                                            staticAnalysis.score > 80 ? 'text-green-500' : staticAnalysis.score > 60 ? 'text-yellow-500' : 'text-red-500'
                                        }`}
                                        strokeLinecap="round"
                                    />
                                </svg>
                                <span className="text-xs font-black text-heading z-10">{staticAnalysis.score}</span>
                            </div>
                        </div>

                        {/* Local Warnings */}
                        {staticAnalysis.warnings.length > 0 && (
                            <div className="space-y-3">
                                <h5 className="text-[9px] font-black text-subtext uppercase tracking-widest">Fix Recommendations</h5>
                                {staticAnalysis.warnings.map((item, idx) => (
                                    <div key={idx} className="p-4 rounded-2xl bg-white/[0.02] border border-border/40 hover:border-primary/20 transition-all flex gap-3">
                                        <div className="mt-0.5 flex-shrink-0">{item.icon}</div>
                                        <div>
                                            <h6 className="text-xs font-bold text-heading">{item.title}</h6>
                                            <p className="text-[11px] text-subtext leading-relaxed mt-1">{item.message}</p>
                                        </div>
                                    </div>
                                ))}
                            </div>
                        )}

                        {/* Local Successes */}
                        {staticAnalysis.successes.length > 0 && (
                            <div className="space-y-3">
                                <h5 className="text-[9px] font-black text-subtext uppercase tracking-widest">Successful Passing Elements</h5>
                                {staticAnalysis.successes.map((item, idx) => (
                                    <div key={idx} className="p-4 rounded-2xl bg-green-500/[0.01] border border-green-500/10 flex gap-3">
                                        <div className="mt-0.5 flex-shrink-0">{item.icon}</div>
                                        <div>
                                            <h6 className="text-xs font-bold text-heading">{item.title}</h6>
                                            <p className="text-[11px] text-subtext leading-relaxed mt-1">{item.message}</p>
                                        </div>
                                    </div>
                                ))}
                            </div>
                        )}

                        {/* Local Tips */}
                        {staticAnalysis.tips.length > 0 && (
                            <div className="p-4 rounded-2xl bg-blue-500/[0.01] border border-blue-500/10 space-y-3">
                                <h5 className="text-[9px] font-black text-blue-500 uppercase tracking-widest flex items-center gap-1">
                                    <Info size={12} /> Pro Tip
                                </h5>
                                {staticAnalysis.tips.map((item, idx) => (
                                    <p key={idx} className="text-[11px] text-subtext leading-relaxed">
                                        <span className="font-bold text-heading">{item.title}:</span> {item.message}
                                    </p>
                                ))}
                            </div>
                        )}
                    </div>
                )}

                {/* ── TAB 2: AI JOB MATCH ANALYZER ── */}
                {activeTab === 'analyzer' && (
                    <div className="space-y-6">
                        {/* Job Description Text Area */}
                        <div className="space-y-2">
                            <label className="text-[10px] font-black text-subtext uppercase tracking-widest">Target Job Description</label>
                            <textarea
                                value={jobDescription}
                                onChange={(e) => setJobDescription(e.target.value)}
                                placeholder="Paste the job description or role requirements here to run AI matching..."
                                className="w-full h-32 p-3 text-xs bg-white/[0.02] border border-border focus:border-primary/40 focus:ring-0 rounded-2xl resize-none outline-none font-medium text-heading transition-all"
                            />
                            <button
                                disabled={analyzing || !jobDescription.trim()}
                                onClick={handleAIAnalyze}
                                className={`w-full py-2.5 rounded-xl font-bold text-xs flex items-center justify-center gap-2 transition-all ${
                                    jobDescription.trim() && !analyzing
                                        ? 'bg-primary text-white hover:opacity-90 shadow-md shadow-primary/10'
                                        : 'bg-zinc-200 dark:bg-zinc-800 text-zinc-400 cursor-not-allowed'
                                }`}
                            >
                                {analyzing ? 'Running AI ATS Audit...' : 'Analyze ATS Matching with AI'}
                                <Sparkles size={14} />
                            </button>
                        </div>

                        {/* Error Handling */}
                        {analysisError && (
                            <div className="p-4 rounded-2xl bg-red-500/[0.02] border border-red-500/20 text-center space-y-3">
                                <AlertTriangle className="text-red-500 mx-auto" size={20} />
                                <h5 className="text-xs font-bold text-heading">{analysisError.isConfigError ? 'Gemini API Key Required' : 'Analysis Failed'}</h5>
                                <p className="text-[11px] text-subtext leading-relaxed">{analysisError.message}</p>
                            </div>
                        )}

                        {/* AI Results */}
                        {aiAnalysis && !analyzing && (
                            <div className="space-y-6">
                                {/* Score Ring */}
                                <div className="flex items-center justify-between p-4 rounded-2xl bg-gradient-to-br from-primary/[0.02] to-primary-dark/[0.02] border border-primary/20">
                                    <div>
                                        <h4 className="font-bold text-heading text-sm flex items-center gap-1.5">
                                            AI ATS Score <UserCheck size={14} className="text-primary" />
                                        </h4>
                                        <p className="text-[10px] text-subtext mt-0.5">Semantic relevance and keyword density</p>
                                    </div>
                                    <div className="relative w-16 h-16 flex items-center justify-center">
                                        <svg className="w-full h-full transform -rotate-90 absolute">
                                            <circle cx="32" cy="32" r="28" stroke="currentColor" strokeWidth="4.5" fill="transparent" className="text-white/5" />
                                            <circle
                                                cx="32"
                                                cy="32"
                                                r="28"
                                                stroke="currentColor"
                                                strokeWidth="4.5"
                                                fill="transparent"
                                                strokeDasharray={2 * Math.PI * 28}
                                                strokeDashoffset={2 * Math.PI * 28 * (1 - aiAnalysis.score / 100)}
                                                className={`transition-all duration-1000 ease-out ${
                                                    aiAnalysis.score > 80 ? 'text-green-500' : aiAnalysis.score > 60 ? 'text-yellow-500' : 'text-red-500'
                                                }`}
                                                strokeLinecap="round"
                                            />
                                        </svg>
                                        <span className="text-sm font-black text-heading z-10">{aiAnalysis.score}%</span>
                                    </div>
                                </div>

                                {/* Keywords */}
                                <div className="space-y-3">
                                    <h5 className="text-[9px] font-black text-subtext uppercase tracking-widest">Matched Keywords</h5>
                                    <div className="flex flex-wrap gap-1.5">
                                        {aiAnalysis.matchedKeywords?.length > 0 ? (
                                            aiAnalysis.matchedKeywords.map((kw, i) => (
                                                <span key={i} className="px-2.5 py-1 rounded-lg bg-green-500/10 border border-green-500/20 text-green-500 text-[10px] font-bold">
                                                    {kw}
                                                </span>
                                            ))
                                        ) : (
                                            <span className="text-xs text-subtext italic">No matched keywords found yet.</span>
                                        )}
                                    </div>
                                </div>

                                <div className="space-y-3">
                                    <h5 className="text-[9px] font-black text-subtext uppercase tracking-widest">Missing Keywords (Add these!)</h5>
                                    <div className="flex flex-wrap gap-1.5">
                                        {aiAnalysis.missingKeywords?.length > 0 ? (
                                            aiAnalysis.missingKeywords.map((kw, i) => (
                                                <span key={i} className="px-2.5 py-1 rounded-lg bg-red-500/10 border border-red-500/20 text-red-500 text-[10px] font-bold">
                                                    {kw}
                                                </span>
                                            ))
                                        ) : (
                                            <span className="text-xs text-subtext italic">No missing keywords found. Great job!</span>
                                        )}
                                    </div>
                                </div>

                                {/* Semantic Synonyms (The Recruiter Wow) */}
                                {aiAnalysis.semanticSynonyms?.length > 0 && (
                                    <div className="space-y-3">
                                        <h5 className="text-[9px] font-black text-subtext uppercase tracking-widest">Semantic Syntactic Equivalency</h5>
                                        <div className="space-y-2">
                                            {aiAnalysis.semanticSynonyms.map((syn, idx) => (
                                                <div key={idx} className="p-3.5 rounded-xl border border-border bg-white/[0.01] space-y-2">
                                                    <div className="flex items-center gap-1.5 text-xs">
                                                        <span className="font-bold text-red-500 bg-red-500/5 px-1.5 py-0.5 rounded border border-red-500/10">JD:</span>
                                                        <span className="font-semibold text-heading truncate max-w-[100px]">{syn.jobRequirement}</span>
                                                        <ArrowRight size={10} className="text-zinc-400 flex-shrink-0" />
                                                        <span className="font-bold text-green-500 bg-green-500/5 px-1.5 py-0.5 rounded border border-green-500/10">Resume:</span>
                                                        <span className="font-semibold text-heading truncate max-w-[100px]">{syn.resumeMatch}</span>
                                                    </div>
                                                    <p className="text-[10px] text-subtext leading-relaxed font-medium">
                                                        {syn.explanation}
                                                    </p>
                                                </div>
                                            ))}
                                        </div>
                                    </div>
                                )}

                                {/* Recommendations */}
                                {aiAnalysis.recommendations?.length > 0 && (
                                    <div className="space-y-3">
                                        <h5 className="text-[9px] font-black text-subtext uppercase tracking-widest">Optimization Audit Checklist</h5>
                                        <ul className="space-y-2.5">
                                            {aiAnalysis.recommendations.map((rec, i) => (
                                                <li key={i} className="flex gap-2 text-[11px] text-subtext font-medium leading-relaxed">
                                                    <span className="text-primary font-bold mt-0.5">•</span>
                                                    <span>{rec}</span>
                                                </li>
                                            ))}
                                        </ul>
                                    </div>
                                )}
                            </div>
                        )}
                    </div>
                )}

                {/* ── TAB 3: STREAMING COVER LETTER ── */}
                {activeTab === 'coverletter' && (
                    <div className="space-y-6">
                        {/* Prompt Info */}
                        <div className="p-4 rounded-2xl bg-white/[0.01] border border-border text-center space-y-2">
                            <FileText className="text-primary mx-auto" size={20} />
                            <h4 className="font-bold text-heading text-sm">Tailored Cover Letter Generator</h4>
                            <p className="text-[10px] text-subtext leading-relaxed px-4">
                                Automatically align your accomplishments to the job description in a professionally structured cover letter.
                            </p>
                        </div>

                        {/* Action buttons */}
                        <div className="space-y-2">
                            <label className="text-[10px] font-black text-subtext uppercase tracking-widest">Target Job Description Context</label>
                            <textarea
                                value={jobDescription}
                                onChange={(e) => setJobDescription(e.target.value)}
                                placeholder="Paste the job description here before generating..."
                                className="w-full h-24 p-3 text-xs bg-white/[0.02] border border-border focus:border-primary/40 focus:ring-0 rounded-2xl resize-none outline-none font-medium text-heading transition-all"
                            />
                            <button
                                disabled={generatingLetter || !jobDescription.trim()}
                                onClick={handleGenerateCoverLetter}
                                className={`w-full py-2.5 rounded-xl font-bold text-xs flex items-center justify-center gap-2 transition-all ${
                                    jobDescription.trim() && !generatingLetter
                                        ? 'bg-primary text-white hover:opacity-90 shadow-md shadow-primary/10'
                                        : 'bg-zinc-200 dark:bg-zinc-800 text-zinc-400 cursor-not-allowed'
                                }`}
                            >
                                {generatingLetter ? 'Streaming Cover Letter...' : 'Generate Streamed Cover Letter'}
                                <Cpu size={14} />
                            </button>
                        </div>

                        {/* Error Handling */}
                        {letterError && (
                            <div className="p-4 rounded-2xl bg-red-500/[0.02] border border-red-500/20 text-center space-y-3">
                                <AlertTriangle className="text-red-500 mx-auto" size={20} />
                                <h5 className="text-xs font-bold text-heading">{letterError.isConfigError ? 'Gemini API Key Required' : 'Generation Failed'}</h5>
                                <p className="text-[11px] text-subtext leading-relaxed">{letterError.message}</p>
                            </div>
                        )}

                        {/* Display Area for Streaming Content */}
                        {(coverLetterText || generatingLetter) && (
                            <div className="space-y-3 relative">
                                <div className="flex justify-between items-center px-1">
                                    <h5 className="text-[9px] font-black text-subtext uppercase tracking-widest flex items-center gap-1.5">
                                        Cover Letter Output
                                        {generatingLetter && (
                                            <span className="w-2 h-2 rounded-full bg-primary animate-ping" />
                                        )}
                                    </h5>
                                    {coverLetterText && (
                                        <button
                                            onClick={handleCopyLetter}
                                            className="p-1.5 rounded-lg border border-border bg-white hover:bg-surface-highlight text-subtext hover:text-heading transition-all flex items-center gap-1 text-[10px] font-bold"
                                            title="Copy to Clipboard"
                                        >
                                            {copied ? <Check size={10} className="text-green-500" /> : <Copy size={10} />}
                                            {copied ? 'Copied' : 'Copy'}
                                        </button>
                                    )}
                                </div>
                                <div className="p-4 rounded-2xl bg-white/[0.02] border border-border text-xs text-heading font-medium leading-relaxed max-h-96 overflow-y-auto custom-scrollbar font-mono whitespace-pre-wrap whitespace-pre-line text-left">
                                    {coverLetterText || 'Awaiting stream chunk inputs...'}
                                </div>
                            </div>
                        )}
                    </div>
                )}
            </div>

            {/* Footer */}
            <div className="p-4 bg-white/[0.02] border-t border-border/60 flex items-center justify-center gap-2">
                <ShieldCheck size={14} className="text-primary" />
                <span className="text-[9px] font-bold text-subtext uppercase tracking-widest">AI Audit System Active</span>
            </div>
        </div>
    );
};

export default AIAssistantPanel;

import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { X, Sparkles, AlertTriangle, ArrowRight, Zap, Target, Flame } from 'lucide-react';
import { aiAPI } from '../services/api';

const BulletOptimizerModal = ({ isOpen, onClose, bulletText, jobDescription = '', onApply }) => {
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState(null);
    const [optimizations, setOptimizations] = useState(null);
    const [selectedOption, setSelectedOption] = useState(null);

    useEffect(() => {
        if (isOpen && bulletText) {
            fetchOptimizations();
        }
    }, [isOpen, bulletText]);

    const fetchOptimizations = async () => {
        setLoading(true);
        setError(null);
        setOptimizations(null);
        setSelectedOption(null);
        try {
            const response = await aiAPI.optimizeBullet(bulletText, jobDescription);
            if (response.data.success) {
                setOptimizations(response.data.optimization);
            } else {
                throw new Error(response.data.message || 'Failed to optimize bullet point.');
            }
        } catch (err) {
            console.error('Error optimizing bullet:', err);
            const errMsg = err.response?.data?.message || err.message || 'An error occurred while generating suggestions.';
            setError({
                message: errMsg,
                isConfigError: err.response?.data?.isConfigError || errMsg.includes('GEMINI_API_KEY')
            });
        } finally {
            setLoading(false);
        }
    };

    if (!isOpen) return null;

    return (
        <AnimatePresence>
            <div className="fixed inset-0 bg-heading/40 backdrop-blur-md flex items-center justify-center z-[110] p-4">
                <motion.div
                    initial={{ opacity: 0, scale: 0.95, y: 20 }}
                    animate={{ opacity: 1, scale: 1, y: 0 }}
                    exit={{ opacity: 0, scale: 0.95, y: 20 }}
                    transition={{ type: 'spring', duration: 0.5 }}
                    className="bg-surface border border-border rounded-3xl w-full max-w-2xl overflow-hidden shadow-2xl flex flex-col max-h-[90vh]"
                >
                    {/* Header */}
                    <div className="p-6 border-b border-border bg-surface-highlight/30 flex justify-between items-center flex-shrink-0">
                        <div className="flex items-center gap-3">
                            <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-primary to-primary-dark flex items-center justify-center shadow-lg shadow-primary/20">
                                <Sparkles className="text-white" size={20} />
                            </div>
                            <div>
                                <h3 className="font-bold text-heading text-lg tracking-tight">AI Bullet Optimizer</h3>
                                <p className="text-[10px] text-subtext uppercase tracking-widest font-bold">STAR Methodology Enhancer</p>
                            </div>
                        </div>
                        <button
                            onClick={onClose}
                            className="p-2 text-subtext hover:text-heading hover:bg-surface-highlight rounded-xl transition-all"
                        >
                            <X size={18} />
                        </button>
                    </div>

                    {/* Content */}
                    <div className="flex-1 overflow-y-auto p-6 space-y-6 custom-scrollbar">
                        {/* Original Bullet */}
                        <div className="space-y-2">
                            <h4 className="text-[10px] font-black text-subtext uppercase tracking-[0.2em]">Original Bullet Point</h4>
                            <div className="p-4 rounded-2xl bg-white/[0.02] border border-border text-sm text-heading font-medium leading-relaxed italic">
                                "{bulletText}"
                            </div>
                        </div>

                        {/* Loading State */}
                        {loading && (
                            <div className="space-y-4 py-8">
                                <div className="flex flex-col items-center justify-center text-center gap-4">
                                    <div className="relative w-12 h-12">
                                        <div className="absolute inset-0 rounded-full border-2 border-primary/20"></div>
                                        <div className="absolute inset-0 rounded-full border-2 border-primary border-t-transparent animate-spin"></div>
                                    </div>
                                    <div>
                                        <p className="text-sm font-bold text-heading">Analyzing & Restructuring...</p>
                                        <p className="text-xs text-subtext mt-1">Applying STAR component engineering & metrics</p>
                                    </div>
                                </div>
                            </div>
                        )}

                        {/* Error State */}
                        {error && (
                            <div className="p-6 rounded-2xl bg-red-500/[0.02] border border-red-500/20 text-center space-y-4">
                                <div className="w-12 h-12 rounded-full bg-red-500/10 text-red-500 flex items-center justify-center mx-auto">
                                    <AlertTriangle size={24} />
                                </div>
                                <div className="space-y-2 max-w-md mx-auto">
                                    <h4 className="font-bold text-heading text-base">
                                        {error.isConfigError ? 'Gemini API Key Required' : 'Optimization Failed'}
                                    </h4>
                                    <p className="text-xs text-subtext leading-relaxed">
                                        {error.message}
                                    </p>
                                </div>
                                {error.isConfigError && (
                                    <div className="inline-block bg-white/[0.03] border border-border rounded-xl px-4 py-2 font-mono text-[10px] text-left text-subtext">
                                        1. Open <code className="text-heading">backend/.env</code><br/>
                                        2. Set <code className="text-primary">GEMINI_API_KEY=your_key_here</code><br/>
                                        3. Restart the backend server.
                                    </div>
                                )}
                            </div>
                        )}

                        {/* Optimizations */}
                        {optimizations && (
                            <div className="space-y-4">
                                <h4 className="text-[10px] font-black text-subtext uppercase tracking-[0.2em]">Select an AI Optimization</h4>
                                <div className="space-y-4">
                                    {/* Option 1: Metric Focused */}
                                    <div
                                        onClick={() => setSelectedOption('metricFocused')}
                                        className={`group p-5 rounded-2xl border transition-all cursor-pointer ${
                                            selectedOption === 'metricFocused'
                                                ? 'border-primary bg-primary/[0.02] ring-1 ring-primary'
                                                : 'border-border bg-white/[0.01] hover:border-primary/30 hover:bg-primary/[0.01]'
                                        }`}
                                    >
                                        <div className="flex items-start gap-4">
                                            <div className="w-10 h-10 rounded-xl bg-orange-500/10 text-orange-500 flex items-center justify-center flex-shrink-0">
                                                <Target size={18} />
                                            </div>
                                            <div className="space-y-2 flex-1">
                                                <div className="flex items-center justify-between">
                                                    <span className="text-[10px] font-black text-orange-500 uppercase tracking-widest">Metric Focused</span>
                                                    {selectedOption === 'metricFocused' && (
                                                        <span className="w-2 h-2 rounded-full bg-primary" />
                                                    )}
                                                </div>
                                                <p className="text-sm font-semibold text-heading leading-relaxed">
                                                    {optimizations.metricFocused.text}
                                                </p>
                                                <p className="text-xs text-subtext leading-relaxed font-medium bg-black/[0.02] p-2.5 rounded-xl border border-black/[0.04]">
                                                    <span className="font-bold text-[10px] text-zinc-400 uppercase tracking-wider block mb-1">STAR Component Analysis</span>
                                                    {optimizations.metricFocused.explanation}
                                                </p>
                                            </div>
                                        </div>
                                    </div>

                                    {/* Option 2: Action Focused */}
                                    <div
                                        onClick={() => setSelectedOption('actionFocused')}
                                        className={`group p-5 rounded-2xl border transition-all cursor-pointer ${
                                            selectedOption === 'actionFocused'
                                                ? 'border-primary bg-primary/[0.02] ring-1 ring-primary'
                                                : 'border-border bg-white/[0.01] hover:border-primary/30 hover:bg-primary/[0.01]'
                                        }`}
                                    >
                                        <div className="flex items-start gap-4">
                                            <div className="w-10 h-10 rounded-xl bg-blue-500/10 text-blue-500 flex items-center justify-center flex-shrink-0">
                                                <Zap size={18} />
                                            </div>
                                            <div className="space-y-2 flex-1">
                                                <div className="flex items-center justify-between">
                                                    <span className="text-[10px] font-black text-blue-500 uppercase tracking-widest">Action & Leadership</span>
                                                    {selectedOption === 'actionFocused' && (
                                                        <span className="w-2 h-2 rounded-full bg-primary" />
                                                    )}
                                                </div>
                                                <p className="text-sm font-semibold text-heading leading-relaxed">
                                                    {optimizations.actionFocused.text}
                                                </p>
                                                <p className="text-xs text-subtext leading-relaxed font-medium bg-black/[0.02] p-2.5 rounded-xl border border-black/[0.04]">
                                                    <span className="font-bold text-[10px] text-zinc-400 uppercase tracking-wider block mb-1">STAR Component Analysis</span>
                                                    {optimizations.actionFocused.explanation}
                                                </p>
                                            </div>
                                        </div>
                                    </div>

                                    {/* Option 3: Concise */}
                                    <div
                                        onClick={() => setSelectedOption('concise')}
                                        className={`group p-5 rounded-2xl border transition-all cursor-pointer ${
                                            selectedOption === 'concise'
                                                ? 'border-primary bg-primary/[0.02] ring-1 ring-primary'
                                                : 'border-border bg-white/[0.01] hover:border-primary/30 hover:bg-primary/[0.01]'
                                        }`}
                                    >
                                        <div className="flex items-start gap-4">
                                            <div className="w-10 h-10 rounded-xl bg-purple-500/10 text-purple-500 flex items-center justify-center flex-shrink-0">
                                                <Flame size={18} />
                                            </div>
                                            <div className="space-y-2 flex-1">
                                                <div className="flex items-center justify-between">
                                                    <span className="text-[10px] font-black text-purple-500 uppercase tracking-widest">High Density / Concise</span>
                                                    {selectedOption === 'concise' && (
                                                        <span className="w-2 h-2 rounded-full bg-primary" />
                                                    )}
                                                </div>
                                                <p className="text-sm font-semibold text-heading leading-relaxed">
                                                    {optimizations.concise.text}
                                                </p>
                                                <p className="text-xs text-subtext leading-relaxed font-medium bg-black/[0.02] p-2.5 rounded-xl border border-black/[0.04]">
                                                    <span className="font-bold text-[10px] text-zinc-400 uppercase tracking-wider block mb-1">STAR Component Analysis</span>
                                                    {optimizations.concise.explanation}
                                                </p>
                                            </div>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        )}
                    </div>

                    {/* Footer */}
                    <div className="p-6 border-t border-border bg-surface-highlight/30 flex justify-between items-center flex-shrink-0">
                        <button
                            onClick={onClose}
                            className="px-5 py-2.5 rounded-xl border border-border text-xs font-bold text-heading hover:bg-surface-highlight transition-all"
                        >
                            Cancel
                        </button>
                        <button
                            disabled={!selectedOption}
                            onClick={() => {
                                if (selectedOption && optimizations) {
                                    onApply(optimizations[selectedOption].text);
                                    onClose();
                                }
                            }}
                            className={`px-6 py-2.5 rounded-xl text-xs font-bold transition-all flex items-center gap-2 ${
                                selectedOption
                                    ? 'bg-primary text-white hover:opacity-90 shadow-lg shadow-primary/20 cursor-pointer'
                                    : 'bg-zinc-200 dark:bg-zinc-800 text-zinc-400 cursor-not-allowed'
                            }`}
                        >
                            Apply Optimization <ArrowRight size={14} />
                        </button>
                    </div>
                </motion.div>
            </div>
        </AnimatePresence>
    );
};

export default BulletOptimizerModal;

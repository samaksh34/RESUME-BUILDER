import React from 'react';
import { X, Sparkles } from 'lucide-react';
import AIAssistantPanel from './AIAssistantPanel';

const AISidebar = ({ isOpen, onClose, resumeData, template }) => {
    if (!isOpen) return null;

    return (
        <div className="fixed inset-0 z-[100] flex justify-end">
            {/* Backdrop */}
            <div 
                className="absolute inset-0 bg-heading/40 backdrop-blur-sm transition-opacity" 
                onClick={onClose}
            />
            
            {/* Sidebar */}
            <div className="relative w-full max-w-lg bg-background border-l border-border shadow-2xl flex flex-col animate-slide-in-right h-full">
                {/* Header */}
                <div className="p-6 border-b border-border flex items-center justify-between bg-surface-highlight/30 flex-shrink-0">
                    <div>
                        <h3 className="text-xs font-black text-heading uppercase tracking-[0.2em] flex items-center gap-1.5">
                            <Sparkles className="text-primary animate-pulse" size={14} /> AI Copilot Workspace
                        </h3>
                        <p className="text-[10px] text-subtext mt-1 uppercase tracking-widest font-bold">ATS Audit & Document Generation</p>
                    </div>
                    <button 
                        onClick={onClose}
                        className="p-2 text-subtext hover:text-heading transition-colors"
                    >
                        <X size={20} />
                    </button>
                </div>

                {/* Content */}
                <div className="flex-grow min-h-0">
                    <AIAssistantPanel resumeData={resumeData} template={template} />
                </div>
            </div>
        </div>
    );
};

export default AISidebar;

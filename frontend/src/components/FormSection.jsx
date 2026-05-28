import React, { useState } from 'react';
import { ChevronDown, ChevronRight, Plus, Trash2, Type, AlignLeft } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import { useResumeData } from '../hooks/useResumeData';

const FormSection = ({
    title,
    children,
    onAdd,
    items = [],
    renderItem,
    defaultOpen = false,
    icon: Icon,
    summary,
    sectionKey
}) => {
    const [isOpen, setIsOpen] = useState(defaultOpen);
    const { resumeData, updateLayoutConfig } = useResumeData();

    const sectionConfig = resumeData.layoutConfig?.sections?.[sectionKey] || {};
    const globalFontSize = resumeData.layoutConfig?.fontSize || 10;
    const globalLineHeight = resumeData.layoutConfig?.lineHeight || 1.2;

    const currentFontSize = sectionConfig.fontSize !== undefined ? sectionConfig.fontSize : globalFontSize;
    const currentLineHeight = sectionConfig.lineHeight !== undefined ? sectionConfig.lineHeight : globalLineHeight;

    const handleSectionUpdate = (field, value) => {
        const newSections = { ...(resumeData.layoutConfig?.sections || {}) };
        newSections[sectionKey] = { ...sectionConfig, [field]: value };
        updateLayoutConfig({ sections: newSections });
    };

    return (
        <div className={`accordion-card ${isOpen ? 'ring-1 ring-primary/20 shadow-lg' : ''} rounded-lg sm:rounded-xl mb-1.5 sm:mb-4 bg-surface border border-border`}>
            <div 
                onClick={() => setIsOpen(!isOpen)}
                className={`accordion-card-header p-1.5 sm:p-4 group cursor-pointer select-none transition-all`}
            >
                <div className="flex items-center gap-2 sm:gap-4">
                    <div className={`w-6 h-6 sm:w-8 sm:h-8 rounded sm:rounded-lg flex items-center justify-center transition-colors ${isOpen ? 'bg-primary text-white' : 'bg-surface-highlight text-subtext group-hover:text-heading'}`}>
                        {Icon ? <Icon size={12} className="sm:w-[18px] sm:h-[18px]" /> : <Plus size={12} className="sm:w-[18px] sm:h-[18px]" />}
                    </div>
                    <div>
                        <h3 className="text-[10px] sm:text-sm font-bold text-heading uppercase tracking-wider leading-tight">{title}</h3>
                        {summary && !isOpen && (
                            <p className="text-[8px] sm:text-[10px] text-subtext mt-0.5 truncate max-w-[80px] sm:max-w-none">{summary}</p>
                        )}
                    </div>
                </div>
                
                <div className="flex items-center gap-1.5 sm:gap-3">
                    {items.length > 0 && !isOpen && (
                        <span className="status-badge bg-primary/10 text-primary px-1.5 py-0.5 sm:px-2 sm:py-0.5 text-[8px] sm:text-[10px]">
                            {items.length} {items.length === 1 ? 'Item' : 'Items'}
                        </span>
                    )}
                    <div className={`text-subtext transition-transform duration-300 ${isOpen ? 'rotate-180' : ''}`}>
                        <ChevronDown size={12} className="sm:w-[18px] sm:h-[18px]" />
                    </div>
                </div>
            </div>

            <AnimatePresence>
                {isOpen && (
                    <motion.div 
                        initial={{ height: 0, opacity: 0 }}
                        animate={{ height: 'auto', opacity: 1 }}
                        exit={{ height: 0, opacity: 0 }}
                        transition={{ duration: 0.3, ease: 'easeInOut' }}
                    >
                        <div className="accordion-card-content pt-6">
                            {/* Section-Specific Layout Controls */}
                            {sectionKey && (
                                <div className="mb-8 p-4 bg-zinc-50 dark:bg-zinc-800/30 rounded-2xl border border-zinc-200/60 dark:border-zinc-700/30 flex flex-wrap gap-x-8 gap-y-4">
                                    <div className="flex-1 min-w-[140px] space-y-2">
                                        <div className="flex justify-between items-center">
                                            <div className="flex items-center gap-1.5 text-zinc-400">
                                                <Type size={12} />
                                                <label className="text-[9px] font-black uppercase tracking-widest">Section Font</label>
                                            </div>
                                            <span className="text-[10px] font-mono font-bold text-primary">{currentFontSize}pt</span>
                                        </div>
                                        <input 
                                            type="range" min="8" max="14" step="0.5" 
                                            value={currentFontSize} 
                                            onChange={(e) => handleSectionUpdate('fontSize', parseFloat(e.target.value))}
                                            className="w-full h-1 bg-zinc-200 dark:bg-zinc-700 rounded-lg appearance-none cursor-pointer accent-primary"
                                        />
                                    </div>
                                    <div className="flex-1 min-w-[140px] space-y-2">
                                        <div className="flex justify-between items-center">
                                            <div className="flex items-center gap-1.5 text-zinc-400">
                                                <AlignLeft size={12} />
                                                <label className="text-[9px] font-black uppercase tracking-widest">Section Line</label>
                                            </div>
                                            <span className="text-[10px] font-mono font-bold text-primary">{currentLineHeight}</span>
                                        </div>
                                        <input 
                                            type="range" min="1.0" max="1.8" step="0.05" 
                                            value={currentLineHeight} 
                                            onChange={(e) => handleSectionUpdate('lineHeight', parseFloat(e.target.value))}
                                            className="w-full h-1 bg-zinc-200 dark:bg-zinc-700 rounded-lg appearance-none cursor-pointer accent-primary"
                                        />
                                    </div>
                                    <button 
                                        onClick={(e) => {
                                            e.stopPropagation();
                                            const newSections = { ...(resumeData.layoutConfig?.sections || {}) };
                                            delete newSections[sectionKey];
                                            updateLayoutConfig({ sections: newSections });
                                        }}
                                        className="px-3 py-1 bg-zinc-100 dark:bg-zinc-700/50 hover:bg-zinc-200 dark:hover:bg-zinc-600 rounded-lg text-[9px] font-black text-zinc-500 hover:text-primary uppercase tracking-widest transition-colors self-end"
                                    >
                                        Use Global
                                    </button>
                                </div>
                            )}

                            {/* Static content (like personal info fields) */}
                            {children && <div className="mb-6">{children}</div>}

                            {/* List items (like experience, education) */}
                            {items.length > 0 && (
                                <div className="space-y-6">
                                    {items.map((item, index) => (
                                        <div key={item.id || index} className="relative group/item animate-fade-in">
                                            <div className="flex items-center gap-2 mb-4">
                                                <div className="w-6 h-px bg-border flex-1" />
                                                <span className="text-[10px] font-bold text-subtext uppercase tracking-widest px-2">
                                                    Entry #{index + 1}
                                                </span>
                                                <div className="w-6 h-px bg-border flex-1" />
                                                
                                                {onAdd && (
                                                    <button
                                                        onClick={(e) => {
                                                            e.stopPropagation();
                                                            onAdd('remove', item.id || index);
                                                        }}
                                                        className="p-1.5 text-subtext hover:text-red-500 hover:bg-red-50 rounded-md transition-all"
                                                    >
                                                        <Trash2 size={14} />
                                                    </button>
                                                )}
                                            </div>
                                            
                                            <div className="pl-2 border-l-2 border-transparent hover:border-primary/20 transition-all">
                                                {renderItem(item, index)}
                                            </div>
                                        </div>
                                    ))}
                                </div>
                            )}

                            {onAdd && (
                                <button
                                    onClick={(e) => {
                                        e.stopPropagation();
                                        onAdd('add');
                                    }}
                                    className="w-full mt-4 py-2 sm:py-3 border-2 border-dashed border-border rounded-lg sm:rounded-xl text-[10px] sm:text-xs font-bold text-subtext hover:text-primary hover:border-primary/30 hover:bg-primary/5 transition-all flex items-center justify-center gap-2"
                                >
                                    <Plus size={12} className="sm:w-3.5 sm:h-3.5" /> Add {title}
                                </button>
                            )}
                        </div>
                    </motion.div>
                )}
            </AnimatePresence>
        </div>
    );
};

export default FormSection;

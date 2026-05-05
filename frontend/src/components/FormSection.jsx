import React, { useState } from 'react';
import { ChevronDown, ChevronRight, Plus, Trash2, GripVertical } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';

const FormSection = ({
    title,
    children,
    onAdd,
    items = [],
    renderItem,
    defaultOpen = false,
    icon: Icon,
    summary
}) => {
    const [isOpen, setIsOpen] = useState(defaultOpen);

    return (
        <div className={`accordion-card ${isOpen ? 'ring-1 ring-primary/20 shadow-lg' : ''}`}>
            <div 
                onClick={() => setIsOpen(!isOpen)}
                className="accordion-card-header group"
            >
                <div className="flex items-center gap-4">
                    <div className={`w-8 h-8 rounded-lg flex items-center justify-center transition-colors ${isOpen ? 'bg-primary text-white' : 'bg-surface-highlight text-subtext group-hover:text-heading'}`}>
                        {Icon ? <Icon size={18} /> : <Plus size={18} />}
                    </div>
                    <div>
                        <h3 className="text-sm font-bold text-heading uppercase tracking-wider">{title}</h3>
                        {summary && !isOpen && (
                            <p className="text-[10px] text-subtext mt-0.5">{summary}</p>
                        )}
                    </div>
                </div>
                
                <div className="flex items-center gap-3">
                    {items.length > 0 && !isOpen && (
                        <span className="status-badge bg-primary/10 text-primary">
                            {items.length} {items.length === 1 ? 'Item' : 'Items'}
                        </span>
                    )}
                    <div className={`text-subtext transition-transform duration-300 ${isOpen ? 'rotate-180' : ''}`}>
                        <ChevronDown size={18} />
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
                                    className="w-full mt-6 py-3 border-2 border-dashed border-border rounded-xl text-xs font-bold text-subtext hover:text-primary hover:border-primary/30 hover:bg-primary/5 transition-all flex items-center justify-center gap-2"
                                >
                                    <Plus size={14} /> Add {title}
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

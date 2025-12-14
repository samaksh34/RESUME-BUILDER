import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import SectionHeading from './SectionHeading';
import { Plus, Trash2 } from 'lucide-react';

const FormSection = ({
    title,
    icon,
    children,
    onAdd,
    items = [],
    renderItem,
    defaultOpen = false
}) => {
    const [isOpen, setIsOpen] = useState(defaultOpen);

    return (
        <div className="section-card">
            <SectionHeading
                title={title}
                icon={icon}
                isOpen={isOpen}
                onToggle={() => setIsOpen(!isOpen)}
            />

            <AnimatePresence>
                {isOpen && (
                    <motion.div
                        initial={{ height: 0, opacity: 0 }}
                        animate={{ height: 'auto', opacity: 1 }}
                        exit={{ height: 0, opacity: 0 }}
                        transition={{ duration: 0.3, ease: 'easeInOut' }}
                        className="overflow-hidden"
                    >
                        <div className="pt-4 space-y-6">
                            {/* Static Content (like Personal Info) */}
                            {children}

                            {/* Dynamic List Items */}
                            {items.length > 0 && (
                                <div className="space-y-4">
                                    {items.map((item, index) => (
                                        <div key={item.id || index} className="relative group bg-input-bg p-5 rounded-lg border border-border hover:border-primary/30 transition-all">
                                            {renderItem(item, index)}
                                            {onAdd && (
                                                <button
                                                    onClick={() => onAdd('remove', item.id)}
                                                    className="absolute top-3 right-3 p-2 text-subtext hover:text-red-500 hover:bg-red-500/10 rounded-lg transition-all opacity-0 group-hover:opacity-100"
                                                >
                                                    <Trash2 size={16} />
                                                </button>
                                            )}
                                        </div>
                                    ))}
                                </div>
                            )}

                            {/* Add Button */}
                            {onAdd && (
                                <button
                                    onClick={() => onAdd('add')}
                                    className="w-full py-3 flex items-center justify-center gap-2 text-primary font-medium text-sm bg-primary/5 hover:bg-primary/10 rounded-lg border border-dashed border-primary/30 hover:border-primary/50 transition-all"
                                >
                                    <Plus size={18} />
                                    Add {title}
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

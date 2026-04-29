import React, { useState } from 'react';
import { ChevronDown, ChevronRight, Plus, Trash2 } from 'lucide-react';

const FormSection = ({
    title,
    children,
    onAdd,
    items = [],
    renderItem,
    defaultOpen = false
}) => {
    const [isOpen, setIsOpen] = useState(defaultOpen);

    return (
        <div className="border-b border-border last:border-0">
            <button
                onClick={() => setIsOpen(!isOpen)}
                className="w-full py-4 flex items-center justify-between group"
            >
                <div className="flex items-center gap-3">
                    <span className="text-subtext group-hover:text-heading transition-colors">
                        {isOpen ? <ChevronDown size={18} /> : <ChevronRight size={18} />}
                    </span>
                    <h3 className="text-sm font-bold uppercase tracking-tight text-heading">
                        {title}
                    </h3>
                </div>
                {onAdd && (
                    <button
                        onClick={(e) => {
                            e.stopPropagation();
                            onAdd('add');
                            setIsOpen(true);
                        }}
                        className="p-1.5 text-primary hover:bg-primary/5 rounded transition-all"
                    >
                        <Plus size={18} />
                    </button>
                )}
            </button>

            {isOpen && (
                <div className="pb-8 space-y-6 animate-fade-in">
                    {/* Static Content */}
                    {children}

                    {/* Dynamic List Items */}
                    {items.length > 0 && (
                        <div className="space-y-4">
                            {items.map((item, index) => (
                                <div key={item.id || index} className="relative bg-surface rounded-md border border-border p-4">
                                    {renderItem(item, index)}
                                    {onAdd && (
                                        <button
                                            onClick={() => onAdd('remove', item.id)}
                                            className="absolute top-2 right-2 p-1.5 text-subtext hover:text-red-500 hover:bg-red-50 rounded transition-all"
                                        >
                                            <Trash2 size={14} />
                                        </button>
                                    )}
                                </div>
                            ))}
                        </div>
                    )}
                </div>
            )}
        </div>
    );
};

export default FormSection;

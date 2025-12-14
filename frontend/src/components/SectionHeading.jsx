import React from 'react';
import { ChevronDown, ChevronUp } from 'lucide-react';
import clsx from 'clsx';

const SectionHeading = ({ title, isOpen, onToggle, icon: Icon }) => {
    return (
        <button
            onClick={onToggle}
            className={clsx(
                "w-full flex items-center justify-between p-4 rounded-lg transition-all duration-200",
                isOpen ? "bg-surface-highlight shadow-glow border border-primary/20" : "hover:bg-surface-highlight/50 border border-transparent"
            )}
        >
            <div className="flex items-center gap-3">
                {Icon && <Icon size={20} className="text-primary" />}
                <h3 className="font-semibold text-text">{title}</h3>
            </div>
            <div className={clsx(
                "text-subtext transition-transform duration-200",
                isOpen && "rotate-180"
            )}>
                <ChevronDown size={20} />
            </div>
        </button>
    );
};

export default SectionHeading;

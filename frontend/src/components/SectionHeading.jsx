import React from 'react';
import { ChevronDown, ChevronUp } from 'lucide-react';
import clsx from 'clsx';

const SectionHeading = ({ title, isOpen, onToggle, icon: Icon }) => {
    return (
        <button
            onClick={onToggle}
            className={clsx(
                "w-full flex items-center justify-between p-4 rounded-lg transition-all duration-200",
                isOpen ? "bg-white shadow-sm" : "hover:bg-white/50"
            )}
        >
            <div className="flex items-center gap-3">
                {Icon && <Icon size={20} className="text-primary" />}
                <h3 className="font-semibold text-slate-700">{title}</h3>
            </div>
            <div className={clsx(
                "text-slate-400 transition-transform duration-200",
                isOpen && "rotate-180"
            )}>
                <ChevronDown size={20} />
            </div>
        </button>
    );
};

export default SectionHeading;

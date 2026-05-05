import React, { useMemo, useState } from 'react';
import { Link } from 'react-router-dom';
import Navbar from '../components/Navbar';
import { Sparkles, Grid, Palette, ShieldCheck, Wand2, LayoutGrid, Download, ArrowRight } from 'lucide-react';

const templatesData = [
    {
        id: 'modern-ats',
        name: 'Modern ATS',
        category: 'Modern',
        description: 'ATS Friendly · Clean Layout',
        image: 'https://images.unsplash.com/photo-1523475472560-d2df97ec485c?auto=format&fit=crop&w=900&q=80',
        badges: ['ATS optimized', 'Crisp spacing', 'Clean typography']
    },
    {
        id: 'minimal-classic',
        name: 'Minimal Classic',
        category: 'Minimal',
        description: 'Simple · Legible · Balanced',
        image: 'https://images.unsplash.com/photo-1483478550801-ceba5fe50e8e?auto=format&fit=crop&w=900&q=80',
        badges: ['Readable', 'Subtle dividers', 'Calm palette']
    },
    {
        id: 'executive-pro',
        name: 'Executive Pro',
        category: 'Executive / Senior',
        description: 'Executive presence · Strong hierarchy',
        image: 'https://images.unsplash.com/photo-1521791055366-0d553872125f?auto=format&fit=crop&w=900&q=80',
        badges: ['Bold headings', 'Role focused', 'ATS aligned']
    },
    {
        id: 'creative-bright',
        name: 'Creative Bright',
        category: 'Creative',
        description: 'Expressive · Accent color · Structured',
        image: 'https://images.unsplash.com/photo-1503389152951-9f343605f61e?auto=format&fit=crop&w=900&q=80',
        badges: ['Accent color', 'Grid aligned', 'Portfolio ready']
    },
    {
        id: 'corporate-blue',
        name: 'Corporate Blue',
        category: 'Corporate',
        description: 'Formal · Confident · Clear',
        image: 'https://images.unsplash.com/photo-1498050108023-c5249f4df085?auto=format&fit=crop&w=900&q=80',
        badges: ['Hiring friendly', 'Neat columns', 'PDF perfect']
    },
    {
        id: 'student-launch',
        name: 'Student Launch',
        category: 'Student / Fresher',
        description: 'Internships · Projects · Skills forward',
        image: 'https://images.unsplash.com/photo-1521737604893-d14cc237f11d?auto=format&fit=crop&w=900&q=80',
        badges: ['Project first', 'Skills highlights', 'ATS safe']
    },
    {
        id: 'elegant-neutral',
        name: 'Elegant Neutral',
        category: 'Minimal',
        description: 'Soft neutral palette · Airy spacing',
        image: 'https://images.unsplash.com/photo-1517245386807-bb43f82c33c4?auto=format&fit=crop&w=900&q=80',
        badges: ['Soft palette', 'Wide margins', 'Printer friendly']
    },
    {
        id: 'senior-impact',
        name: 'Senior Impact',
        category: 'Executive / Senior',
        description: 'Impactful summary · Achievement led',
        image: 'https://images.unsplash.com/photo-1481277542470-605612bd2d61?auto=format&fit=crop&w=900&q=80',
        badges: ['Results focus', 'Clear metrics', 'ATS tuned']
    },
];

const categories = [
    'All Templates',
    'Modern',
    'Minimal',
    'Corporate',
    'Creative',
    'Student / Fresher',
    'Executive / Senior',
];

const TemplateCard = ({ tpl }) => (
    <div className="group border border-border bg-surface hover:border-primary transition-all duration-200 flex flex-col overflow-hidden">
        {/* Schematic Mockup */}
        <div className="h-48 bg-surface-highlight border-b border-border p-4 overflow-hidden">
            <div className="w-full h-full bg-background border border-border shadow-sm p-3 space-y-2 group-hover:scale-[1.02] transition-transform duration-500">
                <div className="h-2 w-1/3 bg-heading/10 rounded-full" />
                <div className="h-1.5 w-full bg-subtext/5 rounded-full" />
                <div className="h-1.5 w-full bg-subtext/5 rounded-full" />
                <div className="pt-2 flex gap-1">
                    <div className="h-1 w-1/4 bg-primary/20 rounded-full" />
                    <div className="h-1 w-1/4 bg-primary/20 rounded-full" />
                </div>
                <div className="pt-2 space-y-1.5">
                    <div className="h-1 w-full bg-subtext/5 rounded-full" />
                    <div className="h-1 w-full bg-subtext/5 rounded-full" />
                    <div className="h-1 w-2/3 bg-subtext/5 rounded-full" />
                </div>
            </div>
        </div>
        
        <div className="p-4 flex-1 flex flex-col">
            <div className="flex items-start justify-between mb-1">
                <h3 className="text-xs font-bold text-heading uppercase tracking-widest">{tpl.name}</h3>
                <span className="text-[10px] font-bold text-subtext uppercase tracking-tighter">{tpl.category}</span>
            </div>
            <p className="text-[10px] text-subtext/80 font-medium mb-4">{tpl.description}</p>
            
            <div className="mt-auto pt-4 border-t border-border flex items-center justify-between">
                <div className="flex gap-1">
                    {tpl.badges.slice(0, 2).map(b => (
                        <div key={b} className="w-1 h-1 rounded-full bg-primary/40" title={b} />
                    ))}
                </div>
                <Link to="/editor" className="text-[10px] font-bold text-primary uppercase tracking-widest hover:text-primary-light inline-flex items-center gap-1">
                    Select <ArrowRight size={10} />
                </Link>
            </div>
        </div>
    </div>
);

const Templates = () => {
    const [activeCategory, setActiveCategory] = useState('All Templates');

    const filteredTemplates = useMemo(() => {
        if (activeCategory === 'All Templates') return templatesData;
        return templatesData.filter(t => t.category === activeCategory);
    }, [activeCategory]);

    return (
        <div className="min-h-screen bg-background font-sans text-text">
            <Navbar />

            <main className="max-w-[1200px] mx-auto px-6 py-16">
                <header className="mb-16">
                    <div className="flex items-center gap-2 mb-6">
                        <div className="w-6 h-[1px] bg-primary" />
                        <span className="text-[10px] font-bold text-primary uppercase tracking-[0.3em]">Gallery</span>
                    </div>
                    <h1 className="text-4xl font-bold text-heading tracking-tight mb-4">Professional Templates.</h1>
                    <p className="text-sm text-subtext max-w-xl leading-relaxed">
                        Optimized for ATS systems and human readability. 
                        Each template is surgically crafted to maximize information density 
                        while maintaining professional restraint.
                    </p>
                </header>

                <div className="flex flex-col md:flex-row gap-12">
                    {/* Sidebar Filters */}
                    <aside className="w-full md:w-48 flex-shrink-0">
                        <div className="sticky top-24 space-y-8">
                            <div>
                                <h3 className="text-[10px] font-bold text-heading uppercase tracking-widest mb-6">Categories</h3>
                                <div className="space-y-2">
                                    {categories.map((cat) => (
                                        <button
                                            key={cat}
                                            onClick={() => setActiveCategory(cat)}
                                            className={`block w-full text-left text-[11px] font-bold uppercase tracking-widest transition-colors ${
                                                activeCategory === cat ? 'text-primary' : 'text-subtext hover:text-heading'
                                            }`}
                                        >
                                            {cat}
                                        </button>
                                    ))}
                                </div>
                            </div>

                            <div className="pt-8 border-t border-border">
                                <h3 className="text-[10px] font-bold text-heading uppercase tracking-widest mb-4">Architecture</h3>
                                <div className="space-y-3">
                                    <div className="flex items-center gap-2 text-[10px] text-subtext font-medium">
                                        <ShieldCheck size={12} /> ATS Compatible
                                    </div>
                                    <div className="flex items-center gap-2 text-[10px] text-subtext font-medium">
                                        <Download size={12} /> PDF Standard
                                    </div>
                                </div>
                            </div>
                        </div>
                    </aside>

                    {/* Template Grid */}
                    <div className="flex-1">
                        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-px bg-border border border-border">
                            {filteredTemplates.map((tpl) => (
                                <TemplateCard key={tpl.id} tpl={tpl} />
                            ))}
                        </div>

                        {/* Empty State */}
                        {filteredTemplates.length === 0 && (
                            <div className="py-20 text-center border border-dashed border-border">
                                <p className="text-xs font-bold text-subtext uppercase tracking-widest">No templates found in this category.</p>
                            </div>
                        )}
                    </div>
                </div>
            </main>

            <footer className="border-t border-border py-12 mt-20">
                <div className="max-w-[1200px] mx-auto px-6 text-center">
                    <p className="text-[10px] font-bold text-subtext uppercase tracking-[0.4em]">Optimized for Production</p>
                </div>
            </footer>
        </div>
    );
};

export default Templates;





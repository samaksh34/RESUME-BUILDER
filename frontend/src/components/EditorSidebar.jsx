import React from 'react';
import { 
    User, 
    GraduationCap, 
    Briefcase, 
    Code2, 
    FolderGit2, 
    Trophy, 
    Award, 
    Globe2,
    Palette,
    Settings
} from 'lucide-react';

const EditorSidebar = ({ activeCategory, setActiveCategory }) => {
    const categories = [
        { id: 'personal', icon: User, label: 'Personal Info' },
        { id: 'education', icon: GraduationCap, label: 'Education' },
        { id: 'experience', icon: Briefcase, label: 'Work Experience' },
        { id: 'skills', icon: Code2, label: 'Skills' },
        { id: 'projects', icon: FolderGit2, label: 'Projects' },
        { id: 'achievements', icon: Trophy, label: 'Achievements' },
        { id: 'certificates', icon: Award, label: 'Certificates' },
        { id: 'languages', icon: Globe2, label: 'Languages' },
    ];

    const bottomCategories = [
        { id: 'theme', icon: Palette, label: 'Theme & Style' },
        { id: 'settings', icon: Settings, label: 'Settings' },
    ];

    return (
        <aside className="w-16 border-r border-border bg-background flex flex-col items-center py-6 gap-4 z-20">
            {categories.map((cat) => (
                <button
                    key={cat.id}
                    onClick={() => setActiveCategory(cat.id)}
                    className={`editor-sidebar-item group ${activeCategory === cat.id ? 'editor-sidebar-item-active' : ''}`}
                    title={cat.label}
                >
                    <cat.icon size={20} strokeWidth={activeCategory === cat.id ? 2.5 : 2} />
                    
                    {/* Tooltip */}
                    <div className="absolute left-full ml-3 px-2 py-1 bg-heading text-white text-[10px] font-bold rounded opacity-0 group-hover:opacity-100 pointer-events-none transition-opacity whitespace-nowrap z-50">
                        {cat.label}
                        <div className="absolute top-1/2 -left-1 -translate-y-1/2 border-4 border-transparent border-r-heading" />
                    </div>
                </button>
            ))}

            <div className="mt-auto flex flex-col gap-4">
                {bottomCategories.map((cat) => (
                    <button
                        key={cat.id}
                        onClick={() => setActiveCategory(cat.id)}
                        className={`editor-sidebar-item group ${activeCategory === cat.id ? 'editor-sidebar-item-active' : ''}`}
                        title={cat.label}
                    >
                        <cat.icon size={20} strokeWidth={activeCategory === cat.id ? 2.5 : 2} />
                        
                        <div className="absolute left-full ml-3 px-2 py-1 bg-heading text-white text-[10px] font-bold rounded opacity-0 group-hover:opacity-100 pointer-events-none transition-opacity whitespace-nowrap z-50">
                            {cat.label}
                            <div className="absolute top-1/2 -left-1 -translate-y-1/2 border-4 border-transparent border-r-heading" />
                        </div>
                    </button>
                ))}
            </div>
        </aside>
    );
};

export default EditorSidebar;

import React from 'react';
import { User, GraduationCap, Code, Briefcase, FolderGit2, Trophy, Award, Users, Languages } from 'lucide-react';

const HorizontalSectionsNav = ({ activeSection, onSectionChange }) => {
    const sections = [
        { id: 'personalInfo', label: 'Personal', icon: User },
        { id: 'education', label: 'Education', icon: GraduationCap },
        { id: 'skills', label: 'Skills', icon: Code },
        { id: 'internships', label: 'Internships', icon: Briefcase },
        { id: 'projects', label: 'Projects', icon: FolderGit2 },
        { id: 'achievements', label: 'Achievements', icon: Trophy },
        { id: 'certificates', label: 'Certificates', icon: Award },
        { id: 'extracurricular', label: 'Extracurricular', icon: Users },
        { id: 'languages', label: 'Languages', icon: Languages },
    ];

    return (
        <nav className="bg-white border-b border-border sticky top-16 z-40">
            <div className="max-w-8xl mx-auto px-6 py-3">
                <div className="flex items-center gap-2 overflow-x-auto scrollbar-hide">
                    {sections.map((section) => {
                        const Icon = section.icon;
                        const isActive = activeSection === section.id;

                        return (
                            <button
                                key={section.id}
                                onClick={() => onSectionChange(section.id)}
                                className={`
                                    nav-pill flex-shrink-0
                                    ${isActive ? 'nav-pill-active' : 'nav-pill-inactive'}
                                `}
                            >
                                <Icon size={16} />
                                <span className="hidden sm:inline">{section.label}</span>
                            </button>
                        );
                    })}
                </div>
            </div>
        </nav>
    );
};

export default HorizontalSectionsNav;

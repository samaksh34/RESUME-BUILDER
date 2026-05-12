import React from 'react';

/**
 * Modern Template
 * Professional "Boxed" layout with primary color accents.
 * Optimized for modern tech roles and designers.
 */
const ModernTemplate = ({ data, config }) => {
    const {
        personalInfo = {},
        education = [],
        technicalSkills = [],
        internships = [],
        projects = [],
    } = data;

    return (
        <div 
            className="w-full flex gap-8"
            style={{ fontFamily: config.fontFamily, lineHeight: config.lineHeight }}
        >
            {/* Sidebar with Accents */}
            <aside className="w-1/3 space-y-6">
                <div className="bg-primary/5 p-4 rounded-lg border-l-4 border-primary">
                    <h1 className="text-2xl font-bold text-primary uppercase tracking-tight leading-none mb-4">
                        {personalInfo?.fullName || 'Your Name'}
                    </h1>
                    <div className="space-y-2 text-[9pt] text-gray-600">
                        <div className="font-bold text-black uppercase tracking-widest text-[8pt]">Contact</div>
                        <div>{personalInfo?.phone}</div>
                        <div className="truncate">{personalInfo?.email}</div>
                        <div className="truncate text-primary italic font-medium">{personalInfo?.linkedin}</div>
                    </div>
                </div>

                {/* Skills in Sidebar */}
                {technicalSkills?.length > 0 && (
                    <div className="space-y-4 px-2">
                        <h2 className="text-[10pt] font-bold uppercase tracking-widest text-primary border-b border-primary/20 pb-1">Skills</h2>
                        <div className="space-y-3">
                            {technicalSkills.map((skill, idx) => (
                                <div key={idx}>
                                    <div className="text-[9pt] font-bold text-gray-800">{skill.category}</div>
                                    <div className="text-[8.5pt] text-gray-600 leading-snug">{skill.skills}</div>
                                </div>
                            ))}
                        </div>
                    </div>
                )}
            </aside>

            {/* Main Content Area */}
            <main className="flex-1 space-y-6">
                {/* Experience */}
                {internships?.length > 0 && (
                    <section>
                        <h2 className="text-[11pt] font-bold uppercase tracking-widest text-primary border-b-2 border-primary mb-3">Experience</h2>
                        <div className="space-y-4">
                            {internships.map((intern) => (
                                <div key={intern.id} className="relative pl-4 border-l-2 border-gray-100">
                                    <div className="flex justify-between items-start">
                                        <div className="font-bold text-[10pt] text-gray-900">{intern.role}</div>
                                        <div className="text-[9pt] font-bold text-primary italic">{intern.startDate} - {intern.endDate}</div>
                                    </div>
                                    <div className="text-[9pt] font-medium text-gray-500 mb-2">{intern.company}</div>
                                    {intern.description && (
                                        <ul className="list-disc list-outside ml-3 space-y-1 text-[9pt] text-gray-600">
                                            {intern.description.map((desc, i) => (
                                                <li key={i}>{desc}</li>
                                            ))}
                                        </ul>
                                    )}
                                </div>
                            ))}
                        </div>
                    </section>
                )}

                {/* Education */}
                {education?.length > 0 && (
                    <section>
                        <h2 className="text-[11pt] font-bold uppercase tracking-widest text-primary border-b-2 border-primary mb-3">Education</h2>
                        <div className="space-y-3">
                            {education.map((edu) => (
                                <div key={edu.id}>
                                    <div className="flex justify-between items-baseline">
                                        <div className="font-bold text-[10pt]">{edu.degree}</div>
                                        <div className="text-[9pt] font-medium text-gray-400 italic">{edu.startDate} - {edu.endDate}</div>
                                    </div>
                                    <div className="text-[9pt] text-gray-600 italic">{edu.school}</div>
                                </div>
                            ))}
                        </div>
                    </section>
                )}
            </main>
        </div>
    );
};

export default ModernTemplate;

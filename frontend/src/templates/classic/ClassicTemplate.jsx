import React from 'react';

/**
 * Classic Template
 * Formal, centered, and balanced layout.
 * Best for traditional industries and academic applications.
 */
const ClassicTemplate = ({ data, config }) => {
    const {
        personalInfo = {},
        education = [],
        technicalSkills = [],
        internships = [],
        projects = [],
    } = data;

    return (
        <div 
            className="w-full text-black flex flex-col items-center"
            style={{ fontFamily: config.fontFamily, lineHeight: config.lineHeight }}
        >
            {/* Header: Centered & Formal */}
            <header className="text-center mb-8 w-full border-b-2 border-black pb-4">
                <h1 className="text-3xl font-bold uppercase tracking-widest mb-2">
                    {personalInfo?.fullName || 'Your Name'}
                </h1>
                <div className="flex justify-center gap-4 text-[10pt] text-gray-700 italic">
                    <span>{personalInfo?.address}</span>
                    <span>•</span>
                    <span>{personalInfo?.phone}</span>
                    <span>•</span>
                    <span>{personalInfo?.email}</span>
                </div>
            </header>

            <div className="w-full space-y-8">
                {/* Education */}
                {education?.length > 0 && (
                    <section>
                        <h2 className="text-[12pt] font-bold uppercase tracking-widest border-b border-black mb-3">Academic Background</h2>
                        <div className="space-y-4">
                            {education.map((edu) => (
                                <div key={edu.id} className="flex justify-between items-start">
                                    <div className="space-y-1">
                                        <div className="font-bold text-[11pt]">{edu.school}</div>
                                        <div className="italic text-[10pt] text-gray-600">{edu.degree}</div>
                                    </div>
                                    <div className="text-right font-bold text-[10pt]">
                                        {edu.startDate} – {edu.endDate}
                                    </div>
                                </div>
                            ))}
                        </div>
                    </section>
                )}

                {/* Experience */}
                {internships?.length > 0 && (
                    <section>
                        <h2 className="text-[12pt] font-bold uppercase tracking-widest border-b border-black mb-3">Professional Experience</h2>
                        <div className="space-y-6">
                            {internships.map((intern) => (
                                <div key={intern.id} className="space-y-2">
                                    <div className="flex justify-between items-baseline">
                                        <div className="font-bold text-[11pt]">{intern.company}</div>
                                        <div className="font-bold text-[10pt] italic text-gray-500">{intern.duration}</div>
                                    </div>
                                    <div className="text-[10pt] font-bold text-gray-700 italic">{intern.role}</div>
                                    {intern.description && (
                                        <ul className="list-disc list-outside ml-5 space-y-1 text-[10pt] text-gray-700">
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

                {/* Skills Section */}
                {technicalSkills?.length > 0 && (
                    <section>
                        <h2 className="text-[12pt] font-bold uppercase tracking-widest border-b border-black mb-3">Key Skills</h2>
                        <div className="grid grid-cols-2 gap-x-8 gap-y-2">
                            {technicalSkills.map((skill, idx) => (
                                <div key={idx} className="flex gap-2 text-[10pt]">
                                    <span className="font-bold">{skill.category}:</span>
                                    <span className="text-gray-700">{skill.skills}</span>
                                </div>
                            ))}
                        </div>
                    </section>
                )}
            </div>
        </div>
    );
};

export default ClassicTemplate;

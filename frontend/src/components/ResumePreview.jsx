import React, { forwardRef } from 'react';
import { useResumeData } from '../hooks/useResumeData';
import { Mail, Phone, Linkedin, Github, Globe } from 'lucide-react';

const ResumePreview = forwardRef(({ template = 'classic' }, ref) => {
    const { resumeData } = useResumeData();
    const {
        personalInfo = {},
        education = [],
        technicalSkills = [],
        internships = [],
        projects = [],
        achievements = [],
        certificates = [],
        extracurricular = [],
        languages = [],
    } = resumeData || {};

    const HeaderBlock = ({ align = 'center' }) => (
        <div className={`${align === 'left' ? 'text-left' : 'text-center'} mb-6`}>
            <h1 className="text-3xl font-bold uppercase tracking-wide mb-2 font-sans text-heading">
                {personalInfo?.fullName || 'Your Name'}
            </h1>
            <div className={`text-sm text-subtext flex flex-wrap ${align === 'left' ? 'justify-start' : 'justify-center'} gap-x-4 gap-y-1`}>
                {personalInfo?.address && <span>{personalInfo.address}</span>}
            </div>
            <div className={`text-sm text-subtext flex flex-wrap ${align === 'left' ? 'justify-start' : 'justify-center'} gap-x-4 gap-y-1 mt-1`}>
                <div className="flex items-center gap-1">
                    <Phone size={12} className="text-primary" />
                    <span>{personalInfo?.phone || '1234567890'}</span>
                </div>
                <div className="flex items-center gap-1">
                    <Mail size={12} className="text-primary" />
                    <a href={`mailto:${personalInfo?.email || 'email@example.com'}`} className="hover:text-primary transition-colors">
                        {personalInfo?.email || 'email@example.com'}
                    </a>
                </div>
                <div className="flex items-center gap-1">
                    <Linkedin size={12} className="text-primary" />
                    <a
                        href={personalInfo?.linkedin ? (personalInfo.linkedin.startsWith('http') ? personalInfo.linkedin : `https://${personalInfo.linkedin}`) : '#'}
                        target="_blank"
                        rel="noreferrer"
                        className="hover:text-primary transition-colors"
                    >
                        {personalInfo?.linkedin ? personalInfo.linkedin.replace(/^https?:\/\/(www\.)?/, '') : 'linkedin.com/in/username'}
                    </a>
                </div>
                <div className="flex items-center gap-1">
                    <Github size={12} className="text-primary" />
                    <a
                        href={personalInfo?.github ? (personalInfo.github.startsWith('http') ? personalInfo.github : `https://${personalInfo.github}`) : '#'}
                        target="_blank"
                        rel="noreferrer"
                        className="hover:text-primary transition-colors"
                    >
                        {personalInfo?.github ? personalInfo.github.replace(/^https?:\/\/(www\.)?/, '') : 'github.com/username'}
                    </a>
                </div>
            </div>
        </div>
    );

    const SectionsBlock = ({ headingClass }) => (
        <div className="space-y-4 text-sm">
            {/* Education */}
            {education && education.length > 0 && (
                <section>
                    <h2 className={headingClass}>Education</h2>
                    <div className="space-y-2">
                        {education.map((edu) => (
                            <div key={edu.id} className="grid grid-cols-[1fr_auto] gap-4 items-start">
                                <div className="min-w-0">
                                    <div className="font-bold text-heading truncate-none">{edu.degree}</div>
                                    <div className="italic text-subtext">{edu.school}</div>
                                </div>
                                <div className="text-right flex-shrink-0">
                                    <div className="font-medium text-heading whitespace-nowrap">
                                        {edu.startDate} – {edu.endDate}
                                    </div>
                                    {edu.score && <div className="text-subtext">{edu.score}</div>}
                                </div>
                            </div>
                        ))}
                    </div>
                </section>
            )}

            {/* Technical Skills */}
            {technicalSkills && technicalSkills.length > 0 && (
                <section>
                    <h2 className={headingClass}>Technical Skills</h2>
                    <div className="space-y-1 mt-1">
                        {technicalSkills.map((skill, index) => (
                            <div key={index} className="text-text">
                                <span className="font-bold">{skill.category}:</span> {skill.skills}
                            </div>
                        ))}
                    </div>
                </section>
            )}

            {/* Internships */}
            {internships && internships.length > 0 && (
                <section>
                    <h2 className={headingClass}>Internships</h2>
                    <div className="space-y-3">
                        {internships.map((intern) => (
                            <div key={intern.id}>
                                <div className="grid grid-cols-[1fr_auto] gap-4 items-start mb-1">
                                    <div className="min-w-0">
                                        <span className="font-bold text-heading">{intern.role}</span>
                                        <span className="mx-1 text-subtext">|</span>
                                        <span className="italic text-subtext">{intern.company}</span>
                                    </div>
                                    <div className="text-right flex-shrink-0">
                                        <div className="font-medium text-heading whitespace-nowrap">
                                            {intern.startDate} – {intern.endDate}
                                        </div>
                                        {intern.location && (
                                            <div className="text-xs font-normal text-subtext">{intern.location}</div>
                                        )}
                                    </div>
                                </div>
                                {intern.description && (
                                    <ul className="list-disc list-outside ml-4 text-text space-y-0.5">
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

            {/* Projects */}
            {projects && projects.length > 0 && (
                <section>
                    <h2 className={headingClass}>Projects</h2>
                    <div className="space-y-3">
                        {projects.map((proj) => (
                            <div key={proj.id}>
                                <div className="grid grid-cols-[1fr_auto] gap-4 items-start mb-1">
                                    <div className="font-bold text-heading min-w-0">{proj.title}</div>
                                    <div className="font-medium text-heading whitespace-nowrap text-right">{proj.date}</div>
                                </div>
                                {proj.description && (
                                    <ul className="list-disc list-outside ml-4 text-text space-y-0.5">
                                        {proj.description.map((desc, i) => (
                                            <li key={i}>{desc}</li>
                                        ))}
                                    </ul>
                                )}
                            </div>
                        ))}
                    </div>
                </section>
            )}

            {/* Achievements */}
            {achievements && achievements.length > 0 && (
                <section>
                    <h2 className={headingClass}>Achievements</h2>
                    <ul className="list-disc list-outside ml-4 space-y-0.5 text-text">
                        {achievements.map((ach, index) => (
                            <li key={index}>
                                {ach}
                            </li>
                        ))}
                    </ul>
                </section>
            )}

            {/* Certificates */}
            {certificates && certificates.length > 0 && (
                <section>
                    <h2 className={headingClass}>Certificates</h2>
                    <div className="space-y-1">
                        {certificates.map((cert) => (
                            <div key={cert.id} className="grid grid-cols-[1fr_auto] gap-4 items-start">
                                <div className="min-w-0">
                                    <span className="font-bold text-heading">{cert.name}</span>
                                    <span className="mx-1 text-subtext">-</span>
                                    <span className="italic text-subtext">{cert.issuer}</span>
                                </div>
                                <div className="font-medium text-heading whitespace-nowrap text-right">{cert.date}</div>
                            </div>
                        ))}
                    </div>
                </section>
            )}

            {/* Extracurricular */}
            {extracurricular && extracurricular.length > 0 && (
                <section>
                    <h2 className={headingClass}>Extracurricular</h2>
                    <div className="space-y-2">
                        {extracurricular.map((extra) => (
                            <div key={extra.id}>
                                <div className="grid grid-cols-[1fr_auto] gap-4 items-start mb-1">
                                    <div className="min-w-0">
                                        <span className="font-bold text-heading">{extra.role}</span>
                                        <span className="mx-1 text-subtext">|</span>
                                        <span className="italic text-subtext">{extra.organization}</span>
                                    </div>
                                    <div className="font-medium text-heading whitespace-nowrap text-right">{extra.date}</div>
                                </div>
                                {extra.description && (
                                    <ul className="list-disc list-outside ml-4 text-text space-y-0.5">
                                        {extra.description.map((desc, i) => (
                                            <li key={i}>{desc}</li>
                                        ))}
                                    </ul>
                                )}
                            </div>
                        ))}
                    </div>
                </section>
            )}

            {/* Languages */}
            {languages && languages.length > 0 && (
                <section className="mt-4">
                    <h2 className={headingClass}>Languages</h2>
                    <div className="flex flex-wrap gap-x-3 gap-y-1 mt-1">
                        {languages.map((lang, index) => (
                            <span key={index} className="text-text">
                                {lang}{index < languages.length - 1 ? ',' : ''}
                            </span>
                        ))}
                    </div>
                </section>
            )}
        </div>
    );

    // Classic template: centered name, simple separators
    if (template === 'classic') {
        return (
            <div
                ref={ref}
                id="resume-preview"
                className="bg-surface shadow-[0_0_40px_rgba(0,0,0,0.1)] dark:shadow-[0_0_40px_rgba(0,0,0,0.3)] text-text font-serif relative overflow-hidden mx-auto border border-border dark:border-[rgba(255,255,255,0.05)]"
                style={{ width: '210mm', minHeight: '297mm' }}
            >
                <div className="p-[40px]">
                    <HeaderBlock />
                    <SectionsBlock headingClass="text-sm font-bold uppercase border-b border-border mb-2 tracking-wider font-sans text-heading" />
                </div>
            </div>
        );
    }

    // Accent bar template: colored sidebar with contact, content on right
    if (template === 'accent') {
        return (
            <div
                ref={ref}
                id="resume-preview"
                className="bg-surface shadow-[0_0_40px_rgba(0,0,0,0.1)] dark:shadow-[0_0_40px_rgba(0,0,0,0.3)] text-text font-serif relative overflow-hidden mx-auto flex border border-border dark:border-[rgba(255,255,255,0.05)]"
                style={{ width: '210mm', minHeight: '297mm' }}
            >
                <aside className="w-40 bg-gray-50 dark:bg-[#131315] border-r border-border p-6 flex flex-col gap-4">
                    <div>
                        <h1 className="text-2xl font-bold uppercase tracking-wide font-sans text-primary">
                            {personalInfo?.fullName || 'Your Name'}
                        </h1>
                    </div>
                    <div className="space-y-2 text-xs text-subtext group-hover:text-heading transition-colors">
                        <div>{personalInfo?.address || 'City, Country'}</div>
                        <div className="flex items-center gap-2">
                            <Phone size={12} /> {personalInfo?.phone || '1234567890'}
                        </div>
                        <div className="flex items-center gap-2">
                            <Mail size={12} /> {personalInfo?.email || 'email@example.com'}
                        </div>
                        <div className="flex items-center gap-2">
                            <Linkedin size={12} /> {personalInfo?.linkedin || 'linkedin.com/in/username'}
                        </div>
                        <div className="flex items-center gap-2">
                            <Github size={12} /> {personalInfo?.github || 'github.com/username'}
                        </div>
                    </div>
                </aside>
                <main className="flex-1 p-8">
                    <SectionsBlock headingClass="text-sm font-bold uppercase border-l-4 border-primary pl-3 mb-2 tracking-wider font-sans text-heading" />
                </main>
            </div>
        );
    }

    // Boxed template: soft grey background with white cards for each section
    if (template === 'boxed') {
        return (
            <div
                ref={ref}
                id="resume-preview"
                className="bg-gray-50 dark:bg-[#131315] text-text font-serif relative overflow-hidden mx-auto border border-border dark:border-[rgba(255,255,255,0.05)]"
                style={{ width: '210mm', minHeight: '297mm' }}
            >
                <div className="p-8">
                    <div className="bg-surface rounded-xl shadow-lg border border-border mb-4 p-6">
                        <HeaderBlock align="left" />
                    </div>
                    <div className="space-y-4">
                        {/* Reuse sections but wrap each in a card */}
                        <div className="bg-surface rounded-xl shadow-sm border border-border p-6">
                            <SectionsBlock headingClass="text-sm font-bold uppercase mb-2 tracking-wider font-sans text-primary" />
                        </div>
                    </div>
                </div>
            </div>
        );
    }

    // ATS template: clean, centered, professional serif format (default)
    return (
        <div
            ref={ref}
            id="resume-preview"
            className="bg-white shadow-[0_0_40px_rgba(0,0,0,0.1)] text-black relative overflow-hidden mx-auto"
            style={{ 
                width: '210mm', 
                minHeight: '297mm', 
                padding: '0.5in',
                fontFamily: '"Times New Roman", Times, serif'
            }}
        >
            <div className="flex flex-col items-center">
                {/* Name - LaTeX \LARGE is ~17.28pt for 10pt base */}
                <h1 className="text-[17.28pt] font-bold text-black uppercase tracking-tight mb-1">
                    {personalInfo?.fullName || 'YOUR NAME'}
                </h1>
                
                {/* Contacts - LaTeX \small is ~9pt for 10pt base, but user wants 10pt mostly */}
                <div className="flex flex-wrap justify-center items-center text-[10pt] text-black mb-4 w-full" style={{ gap: '0 1.5rem' }}>
                    <div className="inline-flex items-center gap-1.5 whitespace-nowrap">
                        <Phone size={11} style={{ marginBottom: '-1px' }} />
                        <span>{personalInfo?.phone || '1234567890'}</span>
                    </div>
                    
                    <div className="inline-flex items-center gap-1.5 whitespace-nowrap">
                        <Mail size={11} style={{ marginBottom: '-1px' }} />
                        <a href={`mailto:${personalInfo?.email || 'email@example.com'}`} className="text-black no-underline">
                            {personalInfo?.email || 'email@example.com'}
                        </a>
                    </div>
                    
                    <div className="inline-flex items-center gap-1.5 whitespace-nowrap">
                        <Linkedin size={11} style={{ marginBottom: '-1px' }} />
                        <a 
                            href={personalInfo?.linkedin ? (personalInfo.linkedin.startsWith('http') ? personalInfo.linkedin : `https://${personalInfo.linkedin}`) : '#'}
                            className="text-black no-underline"
                        >
                            {personalInfo?.linkedin ? personalInfo.linkedin.replace(/^https?:\/\/(www\.)?/, '') : 'linkedin.com/in/username'}
                        </a>
                    </div>
                    
                    <div className="inline-flex items-center gap-1.5 whitespace-nowrap">
                        <Github size={11} style={{ marginBottom: '-1px' }} />
                        <a 
                            href={personalInfo?.github ? (personalInfo.github.startsWith('http') ? personalInfo.github : `https://${personalInfo.github}`) : '#'}
                            className="text-black no-underline"
                        >
                            {personalInfo?.github ? personalInfo.github.replace(/^https?:\/\/(www\.)?/, '') : 'github.com/username'}
                        </a>
                    </div>
                </div>
            </div>

            <div className="space-y-2">
                {/* Education */}
                {education && education.length > 0 && (
                    <section className="mt-3">
                        <h2 className="text-[10pt] font-bold uppercase tracking-tight mb-0.5">Education</h2>
                        <div className="border-t border-black mb-1.5" style={{ height: '0.5pt' }}></div>
                        <div className="space-y-1">
                            {education.map((edu) => (
                                <div key={edu.id} className="relative">
                                    <div className="flex justify-between items-baseline">
                                        <span className="font-bold text-[10pt]">{edu.degree}</span>
                                        <span className="font-bold text-[10pt]">{edu.startDate} {edu.endDate ? `– ${edu.endDate}` : ''}</span>
                                    </div>
                                    <div className="text-[10pt] text-black">
                                        {edu.school} {edu.location && ` --- ${edu.location}`} {edu.score && ` --- ${edu.score}`}
                                    </div>
                                </div>
                            ))}
                        </div>
                    </section>
                )}

                {/* Technical Skills */}
                {technicalSkills && technicalSkills.length > 0 && (
                    <section className="mt-3">
                        <h2 className="text-[10pt] font-bold uppercase tracking-tight mb-0.5">Technical Skills</h2>
                        <div className="border-t border-black mb-1.5" style={{ height: '0.5pt' }}></div>
                        <div className="space-y-1 text-[10pt]">
                            {technicalSkills.map((skill, idx) => (
                                <div key={idx} className="leading-tight">
                                    <span className="font-bold">{skill.category}:</span> {skill.skills}
                                </div>
                            ))}
                        </div>
                    </section>
                )}

                {/* Projects */}
                {projects && projects.length > 0 && (
                    <section className="mt-3">
                        <h2 className="text-[10pt] font-bold uppercase tracking-tight mb-0.5">Projects</h2>
                        <div className="border-t border-black mb-1.5" style={{ height: '0.5pt' }}></div>
                        <div className="space-y-2">
                            {projects.map((proj) => (
                                <div key={proj.id} className="relative">
                                    <div className="flex justify-between items-baseline mb-0.5">
                                        <span className="font-bold text-[10pt]">{proj.title}</span>
                                        <span className="font-bold text-[10pt]">{proj.date}</span>
                                    </div>
                                    {proj.description && (
                                        <ul className="list-none ml-2 space-y-0.5 text-[10pt] text-black text-justify leading-tight">
                                            {proj.description.map((desc, i) => (
                                                <li key={i} style={{ textIndent: '-12pt', paddingLeft: '12pt' }}>
                                                    <span className="inline-block w-[12pt] text-center">•</span>
                                                    {desc}
                                                </li>
                                            ))}
                                        </ul>
                                    )}
                                </div>
                            ))}
                        </div>
                    </section>
                )}

                {/* Experience section */}
                {internships && internships.length > 0 && (
                    <section className="mt-3">
                        <h2 className="text-[10pt] font-bold uppercase tracking-tight mb-0.5">Experience</h2>
                        <div className="border-t border-black mb-1.5" style={{ height: '0.5pt' }}></div>
                        <div className="space-y-2">
                            {internships.map((intern) => (
                                <div key={intern.id} className="relative">
                                    <div className="flex justify-between items-baseline mb-0.5">
                                        <span className="font-bold text-[10pt]">{intern.role} | {intern.company}</span>
                                        <span className="font-bold text-[10pt]">{intern.startDate} – {intern.endDate}</span>
                                    </div>
                                    {intern.description && (
                                        <ul className="list-none ml-2 space-y-0.5 text-[10pt] text-black text-justify leading-tight">
                                            {intern.description.map((desc, i) => (
                                                <li key={i} style={{ textIndent: '-12pt', paddingLeft: '12pt' }}>
                                                    <span className="inline-block w-[12pt] text-center">•</span>
                                                    {desc}
                                                </li>
                                            ))}
                                        </ul>
                                    )}
                                </div>
                            ))}
                        </div>
                    </section>
                )}

                {/* Certificates */}
                {certificates && certificates.length > 0 && (
                    <section className="mt-3">
                        <h2 className="text-[10pt] font-bold uppercase tracking-tight mb-0.5">Certificates</h2>
                        <div className="border-t border-black mb-1.5" style={{ height: '0.5pt' }}></div>
                        <div className="space-y-1">
                            {certificates.map((cert) => (
                                <div key={cert.id} className="flex justify-between items-baseline text-[10pt]">
                                    <div>
                                        <span className="font-bold">{cert.name}</span>
                                        {cert.issuer && <span className="text-black ml-1"> --- {cert.issuer}</span>}
                                    </div>
                                    <div className="font-bold">{cert.date}</div>
                                </div>
                            ))}
                        </div>
                    </section>
                )}

                {/* Achievements */}
                {achievements && achievements.length > 0 && (
                    <section className="mt-3">
                        <h2 className="text-[10pt] font-bold uppercase tracking-tight mb-0.5">Achievements</h2>
                        <div className="border-t border-black mb-1.5" style={{ height: '0.5pt' }}></div>
                        <div className="space-y-1">
                            {achievements.map((ach, idx) => (
                                <div key={idx} className="text-[10pt]">
                                    {typeof ach === 'string' ? (
                                        <div className="leading-tight">{ach}</div>
                                    ) : (
                                        <div className="mb-1">
                                            <div className="font-bold mb-0.5">{ach.title}</div>
                                            <p className="text-black leading-snug">{ach.description}</p>
                                        </div>
                                    )}
                                </div>
                            ))}
                        </div>
                    </section>
                )}
            </div>
        </div>
    );
});

ResumePreview.displayName = 'ResumePreview';

export default ResumePreview;

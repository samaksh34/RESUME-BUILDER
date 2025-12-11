import React from 'react';
import { useResumeData } from '../hooks/useResumeData';
import { Mail, Phone, Linkedin, Github, Globe } from 'lucide-react';

const ResumePreview = ({ template = 'classic' }) => {
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

    React.useEffect(() => {
        // #region agent log
        fetch('http://127.0.0.1:7242/ingest/e398cb77-0811-4917-a097-f173ee72c7ad', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({
                sessionId: 'debug-session',
                runId: 'pre-fix',
                hypothesisId: 'C',
                location: 'ResumePreview.jsx:mount',
                message: 'ResumePreview data snapshot',
                data: {
                    hasResumeData: Boolean(resumeData),
                    educationCount: education.length,
                    skillsCount: technicalSkills.length,
                    internshipsCount: internships.length
                },
                timestamp: Date.now()
            })
        }).catch(() => { });
        // #endregion
    }, []);

    const HeaderBlock = ({ align = 'center' }) => (
        <div className={`${align === 'left' ? 'text-left' : 'text-center'} mb-6`}>
            <h1 className="text-3xl font-bold uppercase tracking-wide mb-2 font-sans">
                {personalInfo?.fullName || 'Your Name'}
            </h1>
            <div className="text-sm text-slate-600 flex flex-wrap justify-center gap-x-4 gap-y-1">
                {personalInfo?.address && <span>{personalInfo.address}</span>}
            </div>
            <div className="text-sm text-slate-600 flex flex-wrap justify-center gap-x-4 gap-y-1 mt-1">
                {personalInfo?.phone && (
                    <div className="flex items-center gap-1">
                        <Phone size={12} />
                        <span>{personalInfo.phone}</span>
                    </div>
                )}
                {personalInfo?.email && (
                    <div className="flex items-center gap-1">
                        <Mail size={12} />
                        <a href={`mailto:${personalInfo.email}`} className="hover:text-primary">
                            {personalInfo.email}
                        </a>
                    </div>
                )}
                {personalInfo?.linkedin && (
                    <div className="flex items-center gap-1">
                        <Linkedin size={12} />
                        <a
                            href={`https://${personalInfo.linkedin}`}
                            target="_blank"
                            rel="noreferrer"
                            className="hover:text-primary"
                        >
                            {personalInfo.linkedin}
                        </a>
                    </div>
                )}
                {personalInfo?.github && (
                    <div className="flex items-center gap-1">
                        <Github size={12} />
                        <a
                            href={`https://${personalInfo.github}`}
                            target="_blank"
                            rel="noreferrer"
                            className="hover:text-primary"
                        >
                            {personalInfo.github}
                        </a>
                    </div>
                )}
                {personalInfo?.portfolio && (
                    <div className="flex items-center gap-1">
                        <Globe size={12} />
                        <a
                            href={personalInfo.portfolio.startsWith('http') ? personalInfo.portfolio : `https://${personalInfo.portfolio}`}
                            target="_blank"
                            rel="noreferrer"
                            className="hover:text-primary"
                        >
                            Portfolio
                        </a>
                    </div>
                )}
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
                            <div key={edu.id} className="flex justify-between">
                                <div>
                                    <div className="font-bold">{edu.degree}</div>
                                    <div className="italic">{edu.school}</div>
                                </div>
                                <div className="text-right">
                                    <div className="font-medium">
                                        {edu.startDate} – {edu.endDate}
                                    </div>
                                    {edu.score && <div>{edu.score}</div>}
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
                    <ul className="list-disc list-inside space-y-1">
                        {technicalSkills.map((skill, index) => (
                            <li key={index} className="text-slate-800">
                                {skill}
                            </li>
                        ))}
                    </ul>
                </section>
            )}

            {/* Internships */}
            {internships && internships.length > 0 && (
                <section>
                    <h2 className={headingClass}>Internships</h2>
                    <div className="space-y-3">
                        {internships.map((intern) => (
                            <div key={intern.id}>
                                <div className="flex justify-between mb-1">
                                    <div>
                                        <span className="font-bold">{intern.role}</span>
                                        <span className="mx-1">|</span>
                                        <span className="italic">{intern.company}</span>
                                    </div>
                                    <div className="font-medium text-right">
                                        {intern.startDate} – {intern.endDate}
                                        {intern.location && (
                                            <div className="text-xs font-normal">{intern.location}</div>
                                        )}
                                    </div>
                                </div>
                                {intern.description && (
                                    <ul className="list-disc list-inside text-slate-700 pl-2">
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
                                <div className="flex justify-between mb-1">
                                    <div className="font-bold">{proj.title}</div>
                                    <div className="font-medium">{proj.date}</div>
                                </div>
                                {proj.description && (
                                    <ul className="list-disc list-inside text-slate-700 pl-2">
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
                    <ul className="list-disc list-inside space-y-1">
                        {achievements.map((ach, index) => (
                            <li key={index} className="text-slate-800">
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
                            <div key={cert.id} className="flex justify-between">
                                <div>
                                    <span className="font-bold">{cert.name}</span>
                                    <span className="mx-1">-</span>
                                    <span className="italic">{cert.issuer}</span>
                                </div>
                                <div className="font-medium">{cert.date}</div>
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
                                <div className="flex justify-between mb-1">
                                    <div>
                                        <span className="font-bold">{extra.role}</span>
                                        <span className="mx-1">|</span>
                                        <span className="italic">{extra.organization}</span>
                                    </div>
                                    <div className="font-medium">{extra.date}</div>
                                </div>
                                {extra.description && (
                                    <ul className="list-disc list-inside text-slate-700 pl-2">
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
                    <ul className="list-disc list-inside space-y-1">
                        {languages.map((lang, index) => (
                            <li key={index} className="text-slate-800">
                                {lang}
                            </li>
                        ))}
                    </ul>
                </section>
            )}
        </div>
    );

    // Classic template: centered name, simple separators
    if (template === 'classic') {
        return (
            <div
                className="bg-white shadow-2xl shadow-slate-200/50 text-slate-900 font-serif relative overflow-hidden mx-auto"
                style={{ width: '210mm', minHeight: '297mm' }}
            >
                <div className="p-[40px]">
                    <HeaderBlock />
                    <SectionsBlock headingClass="text-sm font-bold uppercase border-b border-slate-900 mb-2 tracking-wider font-sans" />
                </div>
            </div>
        );
    }

    // Accent bar template: colored sidebar with contact, content on right
    if (template === 'accent') {
        return (
            <div
                className="bg-white shadow-2xl shadow-slate-200/50 text-slate-900 font-serif relative overflow-hidden mx-auto flex"
                style={{ width: '210mm', minHeight: '297mm' }}
            >
                <aside className="w-40 bg-primary text-white p-6 flex flex-col gap-4">
                    <div>
                        <h1 className="text-2xl font-bold uppercase tracking-wide font-sans">
                            {personalInfo?.fullName || 'Your Name'}
                        </h1>
                    </div>
                    <div className="space-y-2 text-xs">
                        {personalInfo?.address && <div>{personalInfo.address}</div>}
                        {personalInfo?.phone && (
                            <div className="flex items-center gap-2">
                                <Phone size={12} /> {personalInfo.phone}
                            </div>
                        )}
                        {personalInfo?.email && (
                            <div className="flex items-center gap-2">
                                <Mail size={12} /> {personalInfo.email}
                            </div>
                        )}
                        {personalInfo?.linkedin && (
                            <div className="flex items-center gap-2">
                                <Linkedin size={12} /> {personalInfo.linkedin}
                            </div>
                        )}
                        {personalInfo?.github && (
                            <div className="flex items-center gap-2">
                                <Github size={12} /> {personalInfo.github}
                            </div>
                        )}
                    </div>
                </aside>
                <main className="flex-1 p-8">
                    <SectionsBlock headingClass="text-sm font-bold uppercase border-l-4 border-primary pl-3 mb-2 tracking-wider font-sans" />
                </main>
            </div>
        );
    }

    // Boxed template: soft grey background with white cards for each section
    if (template === 'boxed') {
        return (
            <div
                className="bg-slate-100 text-slate-900 font-serif relative overflow-hidden mx-auto"
                style={{ width: '210mm', minHeight: '297mm' }}
            >
                <div className="p-8">
                    <div className="bg-white rounded-xl shadow-md border border-slate-200 mb-4 p-6">
                        <HeaderBlock align="left" />
                    </div>
                    <div className="space-y-4">
                        {/* Reuse sections but wrap each in a card */}
                        <SectionsBlock headingClass="text-sm font-bold uppercase mb-2 tracking-wider font-sans" />
                    </div>
                </div>
            </div>
        );
    }

    // ATS template: clean, simple, ATS-friendly format (default)
    return (
        <div
            className="bg-white shadow-2xl shadow-slate-200/50 text-black font-sans relative overflow-hidden mx-auto"
            style={{ width: '210mm', minHeight: '297mm' }}
        >
            <div className="p-[30px]">
                {/* Header - Name and Contact */}
                <div className="text-center mb-6">
                    <h1 className="text-2xl font-bold uppercase tracking-wide mb-2">
                        {personalInfo?.fullName || 'ABC XYZ'}
                    </h1>
                    <div className="text-xs text-black">
                        {personalInfo?.address && <div>{personalInfo.address}</div>}
                    </div>
                    <div className="text-xs text-black flex flex-wrap justify-center gap-x-3 mt-1">
                        {personalInfo?.phone && <span>☎ {personalInfo.phone}</span>}
                        {personalInfo?.email && <span>✉ {personalInfo.email}</span>}
                        {personalInfo?.linkedin && <span>🔗 {personalInfo.linkedin}</span>}
                        {personalInfo?.github && <span>⚡ {personalInfo.github}</span>}
                        {personalInfo?.portfolio && <span>🌐 Portfolio Link</span>}
                    </div>
                </div>

                <div className="space-y-4 text-xs">
                    {/* Education */}
                    {education && education.length > 0 && (
                        <section>
                            <h2 className="text-sm font-bold uppercase border-b border-black pb-1 mb-2">EDUCATION</h2>
                            <div className="space-y-2">
                                {education.map((edu) => (
                                    <div key={edu.id}>
                                        <div className="flex justify-between items-start">
                                            <div>
                                                <div className="font-bold">{edu.degree}</div>
                                                <div className="italic">{edu.school}</div>
                                            </div>
                                            <div className="text-right">
                                                <div>{edu.startDate} – {edu.endDate}</div>
                                                {edu.score && <div>{edu.score}</div>}
                                            </div>
                                        </div>
                                    </div>
                                ))}
                            </div>
                        </section>
                    )}

                    {/* Technical Skills */}
                    {technicalSkills && technicalSkills.length > 0 && (
                        <section>
                            <h2 className="text-sm font-bold uppercase border-b border-black pb-1 mb-2">TECHNICAL SKILLS</h2>
                            <div className="space-y-1">
                                {technicalSkills.map((skill, index) => (
                                    <div key={index}>{skill}</div>
                                ))}
                            </div>
                        </section>
                    )}

                    {/* Internships */}
                    {internships && internships.length > 0 && (
                        <section>
                            <h2 className="text-sm font-bold uppercase border-b border-black pb-1 mb-2">INTERNSHIPS</h2>
                            <div className="space-y-3">
                                {internships.map((intern) => (
                                    <div key={intern.id}>
                                        <div className="flex justify-between items-start mb-1">
                                            <div>
                                                <span className="font-bold">{intern.role}</span>
                                                {intern.company && (
                                                    <>
                                                        <span className="mx-1">@</span>
                                                        <span className="font-bold">{intern.company}</span>
                                                    </>
                                                )}
                                            </div>
                                            <div className="text-right">
                                                <div>{intern.startDate} – {intern.endDate}</div>
                                                {intern.location && <div className="italic text-[10px]">{intern.location}</div>}
                                            </div>
                                        </div>
                                        {intern.description && (
                                            <ul className="list-disc list-outside ml-4 space-y-0.5">
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
                            <h2 className="text-sm font-bold uppercase border-b border-black pb-1 mb-2">PROJECTS</h2>
                            <div className="space-y-3">
                                {projects.map((proj) => (
                                    <div key={proj.id}>
                                        <div className="flex justify-between items-start mb-1">
                                            <div className="font-bold">{proj.title}</div>
                                            <div>{proj.date}</div>
                                        </div>
                                        {proj.description && (
                                            <ul className="list-disc list-outside ml-4 space-y-0.5">
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

                    {/* Achievement */}
                    {achievements && achievements.length > 0 && (
                        <section>
                            <h2 className="text-sm font-bold uppercase border-b border-black pb-1 mb-2">ACHIEVEMENT</h2>
                            <ul className="list-disc list-outside ml-4 space-y-0.5">
                                {achievements.map((ach, index) => (
                                    <li key={index}>{ach}</li>
                                ))}
                            </ul>
                        </section>
                    )}

                    {/* Certificates */}
                    {certificates && certificates.length > 0 && (
                        <section>
                            <h2 className="text-sm font-bold uppercase border-b border-black pb-1 mb-2">CERTIFICATES</h2>
                            <div className="space-y-1">
                                {certificates.map((cert) => (
                                    <div key={cert.id} className="flex justify-between">
                                        <div>
                                            <span className="font-bold">{cert.name}</span>
                                            {cert.issuer && (
                                                <>
                                                    <span className="mx-1">-</span>
                                                    <span className="italic">{cert.issuer}</span>
                                                </>
                                            )}
                                        </div>
                                        <div>{cert.date}</div>
                                    </div>
                                ))}
                            </div>
                        </section>
                    )}

                    {/* Extracurricular */}
                    {extracurricular && extracurricular.length > 0 && (
                        <section>
                            <h2 className="text-sm font-bold uppercase border-b border-black pb-1 mb-2">EXTRACURRICULAR</h2>
                            <div className="space-y-2">
                                {extracurricular.map((extra) => (
                                    <div key={extra.id}>
                                        <div className="flex justify-between items-start mb-1">
                                            <div>
                                                <span className="font-bold">{extra.role}</span>
                                                {extra.organization && (
                                                    <>
                                                        <span className="mx-1">-</span>
                                                        <span className="font-bold">{extra.organization}</span>
                                                    </>
                                                )}
                                            </div>
                                            <div>{extra.date}</div>
                                        </div>
                                        {extra.description && (
                                            <ul className="list-disc list-outside ml-4 space-y-0.5">
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
                </div>
            </div>
        </div>
    );
};

export default ResumePreview;

import React from 'react';
import { Mail, Phone, Linkedin, Github } from 'lucide-react';

/**
 * ATS Overleaf Template (Jake's Resume Style)
 * Pixel-perfect match to sam_resume.pdf reference
 */
const ATSOverleaf = ({ data, config }) => {
    const {
        personalInfo = {},
        education = [],
        technicalSkills = [],
        internships = [],
        projects = [],
        achievements = [],
        certificates = [],
    } = data;

    /* ── Shared inline style constants ── */
    const sectionHeadingStyle = {
        fontSize: '11.5pt',
        fontWeight: 700,
        marginBottom: '0pt',
        lineHeight: 1.1,
        letterSpacing: '0.02em',
        textTransform: 'none', // Overleaf/Jake's usually isn't uppercase but user had it, looking at sam_resume.pdf it is "Education" (Title Case)
    };

    const hrStyle = {
        borderTop: '0.4pt solid black',
        width: '100%',
        marginTop: '1.5pt',
        marginBottom: '5pt',
    };

    const getSectionStyle = (sectionKey) => {
        const sectionConfig = config.sections?.[sectionKey] || {};
        return {
            marginTop: config.sectionSpacing,
            fontSize: sectionConfig.fontSize ? `${sectionConfig.fontSize}pt` : config.baseFontSize,
            lineHeight: sectionConfig.lineHeight || config.lineHeight
        };
    };

    const entryTitleRowStyle = {
        display: 'flex',
        justifyContent: 'space-between',
        alignItems: 'baseline',
        fontWeight: 700,
        fontSize: 'inherit',
        lineHeight: 'inherit',
    };

    const entrySubRowStyle = {
        fontSize: 'inherit',
        fontWeight: 400,
        lineHeight: 'inherit',
        marginBottom: '2pt',
    };

    const bulletListStyle = {
        listStyle: 'none',
        margin: '1pt 0 2pt 0',
        padding: 0,
    };

    const bulletItemStyle = {
        position: 'relative',
        paddingLeft: '14pt',
        fontSize: 'inherit',
        fontWeight: 400,
        lineHeight: 'inherit',
        marginBottom: '2pt',
        textAlign: 'justify',
    };

    const bulletDotStyle = {
        position: 'absolute',
        left: '2pt',
        top: '0.5pt',
        fontSize: '5pt',
        lineHeight: 1.3,
    };

    return (
        <div 
            className="w-full text-black" 
            style={{ 
                lineHeight: config.lineHeight,
                fontFamily: config.fontFamily,
                color: '#000',
                fontSize: config.baseFontSize,
                letterSpacing: '-0.01em',
                fontWeight: 400,
                fontFeatureSettings: '"kern" 1, "liga" 1, "clig" 1',
                WebkitFontSmoothing: 'antialiased',
            }}
        >
            {/* ─── HEADER ─── */}
            <header style={{ textAlign: 'center', marginBottom: '6pt' }}>
                <h1 style={{
                    fontSize: '22pt',
                    fontWeight: 800,
                    textTransform: 'uppercase',
                    letterSpacing: '0.04em',
                    lineHeight: 1.1,
                    margin: '0 0 3pt 0',
                    padding: 0,
                }}>
                    {personalInfo?.fullName || 'SAMAKSH SAXENA'}
                </h1>
                
                <div style={{
                    display: 'flex',
                    flexWrap: 'wrap',
                    justifyContent: 'center',
                    alignItems: 'center',
                    fontSize: config.sections?.personalInfo?.fontSize ? `${config.sections.personalInfo.fontSize}pt` : '10pt',
                    lineHeight: config.sections?.personalInfo?.lineHeight || 1.2,
                    fontWeight: 400,
                    gap: '0 12pt',
                    marginTop: '2pt',
                }}>
                    {personalInfo?.phone && (
                        <span style={{ display: 'inline-flex', alignItems: 'center', gap: '3pt' }}>
                            <Phone size={9} strokeWidth={2.5} />
                            {personalInfo.phone}
                        </span>
                    )}
                    <span style={{ display: 'inline-flex', alignItems: 'center', gap: '3pt' }}>
                        <Mail size={9} strokeWidth={2.5} />
                        <span>{personalInfo?.email || 'your.email@example.com'}</span>
                    </span>
                    
                    {personalInfo?.linkedin && (
                        <span style={{ display: 'inline-flex', alignItems: 'center', gap: '3pt' }}>
                            <Linkedin size={9} strokeWidth={2.5} />
                            <span>{personalInfo.linkedin.replace(/^https?:\/\/(www\.)?/, '')}</span>
                        </span>
                    )}
                    
                    {personalInfo?.github && (
                        <span style={{ display: 'inline-flex', alignItems: 'center', gap: '3pt' }}>
                            <Github size={9} strokeWidth={2.5} />
                            <span>{personalInfo.github.replace(/^https?:\/\/(www\.)?/, '')}</span>
                        </span>
                    )}
                </div>
            </header>

            {/* ─── EDUCATION ─── */}
            {education?.length > 0 && (
                <section style={getSectionStyle('education')}>
                    <h2 style={sectionHeadingStyle}>Education</h2>
                    <div style={hrStyle}></div>
                    <div style={{ display: 'flex', flexDirection: 'column', gap: '4pt' }}>
                        {education.map((edu) => (
                            <div key={edu.id}>
                                <div style={entryTitleRowStyle}>
                                    <span>{edu.degree || 'Degree'}</span>
                                    <span style={{ fontWeight: 400 }}>{edu.startDate}{edu.endDate ? ` – ${edu.endDate}` : ''}</span>
                                </div>
                                <div style={entrySubRowStyle}>
                                    {edu.school}{edu.score ? ` — CGPA: ${edu.score}` : ''}
                                </div>
                            </div>
                        ))}
                    </div>
                </section>
            )}

            {/* ─── TECHNICAL SKILLS ─── */}
            {technicalSkills?.length > 0 && (
                <section style={getSectionStyle('technicalSkills')}>
                    <h2 style={sectionHeadingStyle}>Technical Skills</h2>
                    <div style={hrStyle}></div>
                    <div style={{ display: 'flex', flexDirection: 'column', gap: '1.5pt', fontSize: 'inherit' }}>
                        {technicalSkills.map((skill, idx) => (
                            <div key={idx} style={{ lineHeight: 'inherit' }}>
                                <span style={{ fontWeight: 700 }}>{skill.category}:</span>{' '}
                                <span style={{ fontWeight: 400 }}>{skill.skills}</span>
                            </div>
                        ))}
                    </div>
                </section>
            )}

            {/* ─── PROJECTS ─── */}
            {projects?.length > 0 && (
                <section style={getSectionStyle('projects')}>
                    <h2 style={sectionHeadingStyle}>Projects</h2>
                    <div style={hrStyle}></div>
                    <div style={{ display: 'flex', flexDirection: 'column', gap: '6pt' }}>
                        {projects.map((proj) => (
                            <div key={proj.id}>
                                <div style={entryTitleRowStyle}>
                                    <span>{proj.title}</span>
                                    <span style={{ fontWeight: 400 }}>{proj.date}</span>
                                </div>
                                {proj.description && (
                                    <ul style={bulletListStyle}>
                                        {proj.description.map((desc, i) => (
                                            <li key={i} style={bulletItemStyle}>
                                                <span style={bulletDotStyle}>●</span>
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

            {/* ─── EXPERIENCE ─── */}
            {internships?.length > 0 && (
                <section style={getSectionStyle('internships')}>
                    <h2 style={sectionHeadingStyle}>Experience</h2>
                    <div style={hrStyle}></div>
                    <div style={{ display: 'flex', flexDirection: 'column', gap: '6pt' }}>
                        {internships.map((intern) => (
                            <div key={intern.id}>
                                <div style={entryTitleRowStyle}>
                                    <span>{intern.role || 'Job Role'} | {intern.company || 'Company'}</span>
                                    <span style={{ fontWeight: 400 }}>
                                        {intern.startDate} – {intern.endDate}
                                    </span>
                                </div>
                                {intern.description && (
                                    <ul style={bulletListStyle}>
                                        {intern.description.map((desc, i) => (
                                            <li key={i} style={bulletItemStyle}>
                                                <span style={bulletDotStyle}>●</span>
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

            {/* ─── CERTIFICATES ─── */}
            {certificates?.length > 0 && (
                <section style={getSectionStyle('certificates')}>
                    <h2 style={sectionHeadingStyle}>Certificates</h2>
                    <div style={hrStyle}></div>
                    <div style={{ display: 'flex', flexDirection: 'column', gap: '2pt' }}>
                        {certificates.map((cert) => (
                            <div key={cert.id} style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'baseline', fontSize: 'inherit' }}>
                                <div>
                                    <span style={{ fontWeight: 700 }}>{cert.name}</span>
                                    {cert.issuer && <span style={{ fontWeight: 400 }}> — {cert.issuer}</span>}
                                </div>
                                <div style={{ fontWeight: 400 }}>{cert.date}</div>
                            </div>
                        ))}
                    </div>
                </section>
            )}

            {/* ─── ACHIEVEMENTS ─── */}
            {achievements?.length > 0 && (
                <section style={getSectionStyle('achievements')}>
                    <h2 style={sectionHeadingStyle}>Achievements</h2>
                    <div style={hrStyle}></div>
                    <div style={{ display: 'flex', flexDirection: 'column', gap: '4pt' }}>
                        {achievements.map((ach, idx) => (
                            <div key={idx} style={{ fontSize: 'inherit', fontWeight: 400 }}>
                                {typeof ach === 'string' ? (
                                    <div>{ach}</div>
                                ) : (
                                    <div>
                                        <div style={{ fontWeight: 700 }}>{ach.title}</div>
                                        {ach.description && <div style={{ textAlign: 'justify', marginTop: '1pt' }}>{ach.description}</div>}
                                    </div>
                                )}
                            </div>
                        ))}
                    </div>
                </section>
            )}
        </div>
    );
};

export default ATSOverleaf;

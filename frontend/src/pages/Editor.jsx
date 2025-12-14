import React, { useState, useRef, useEffect } from 'react';
import { useResumeData } from '../hooks/useResumeData';
import ResumePreview from '../components/ResumePreview';
import FormSection from '../components/FormSection';
import InputField from '../components/InputField';
import Navbar from '../components/Navbar';
import HorizontalSectionsNav from '../components/HorizontalSectionsNav';
import { Plus, Trash2, ZoomIn, ZoomOut, RotateCcw } from 'lucide-react';

const Editor = () => {
    const { resumeData, updateResumeData } = useResumeData();
    const [activeSection, setActiveSection] = useState('personal');
    const [zoom, setZoom] = useState(100);
    const [template, setTemplate] = useState('ats');

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

    // Refs for scrolling to sections
    const sectionRefs = {
        personal: useRef(null),
        education: useRef(null),
        skills: useRef(null),
        experience: useRef(null),
        projects: useRef(null),
        achievements: useRef(null),
        certificates: useRef(null),
        extracurricular: useRef(null),
        languages: useRef(null),
    };

    // Scroll to section when activeSection changes
    useEffect(() => {
        if (sectionRefs[activeSection]?.current) {
            sectionRefs[activeSection].current.scrollIntoView({ behavior: 'smooth', block: 'start' });
        }
    }, [activeSection]);

    const handleInputChange = (section, field, value) => {
        const existing = (resumeData && resumeData[section]) || {};
        updateResumeData(section, { ...existing, [field]: value });
    };

    const handleArrayChange = (section, index, field, value) => {
        const currentArray = Array.isArray(resumeData?.[section]) ? resumeData[section] : [];
        const newArray = [...currentArray];
        newArray[index] = { ...newArray[index], [field]: value };
        updateResumeData(section, newArray);
    };

    const addItem = (section, initialData) => {
        const currentArray = Array.isArray(resumeData?.[section]) ? resumeData[section] : [];
        updateResumeData(section, [...currentArray, initialData]);
    };

    const removeItem = (section, index) => {
        const currentArray = Array.isArray(resumeData?.[section]) ? resumeData[section] : [];
        const newArray = currentArray.filter((_, i) => i !== index);
        updateResumeData(section, newArray);
    };

    const handleZoomIn = () => setZoom(prev => Math.min(prev + 10, 150));
    const handleZoomOut = () => setZoom(prev => Math.max(prev - 10, 50));
    const handleResetZoom = () => setZoom(100);

    useEffect(() => {
        // #region agent log
        fetch('http://127.0.0.1:7242/ingest/e398cb77-0811-4917-a097-f173ee72c7ad', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({
                sessionId: 'debug-session',
                runId: 'pre-fix',
                hypothesisId: 'A',
                location: 'Editor.jsx:mount',
                message: 'Editor mounted with context snapshot',
                data: {
                    hasResumeData: Boolean(resumeData),
                    personalInfoKeys: resumeData ? Object.keys(resumeData.personalInfo || {}) : null,
                    updateResumeDataType: typeof updateResumeData
                },
                timestamp: Date.now()
            })
        }).catch(() => { });
        // #endregion
    }, []);

    return (
        <div className="h-screen bg-background flex flex-col overflow-hidden text-text">
            <Navbar />
            <HorizontalSectionsNav activeSection={activeSection} onSectionChange={setActiveSection} />

            <div className="flex-1 min-h-0 overflow-hidden">
                <div className="max-w-8xl mx-auto px-6 py-4 h-full">
                    <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 h-full">
                        {/* Left: Editor Form - 40% - ALL SECTIONS STACKED */}
                        <div className="lg:col-span-5 flex flex-col h-full min-h-0">
                            <div className="mb-4 flex-shrink-0">
                                <h2 className="text-xl font-bold text-heading">Editor</h2>
                                <p className="text-xs text-subtext mt-0.5">Build your perfect resume</p>
                            </div>

                            <div className="flex-1 min-h-0 overflow-y-auto custom-scrollbar pr-2 space-y-4">
                                {/* Personal Info */}
                                <div ref={sectionRefs.personal} className="scroll-mt-4">
                                    <FormSection title="Personal Information" icon={null} isOpen={true}>
                                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                            <InputField label="Full Name" value={personalInfo.fullName || ''} onChange={(e) => handleInputChange('personalInfo', 'fullName', e.target.value)} placeholder="John Doe" />
                                            <InputField label="Job Title" value={personalInfo.jobTitle || ''} onChange={(e) => handleInputChange('personalInfo', 'jobTitle', e.target.value)} placeholder="Software Engineer" />
                                            <InputField label="Email" value={personalInfo.email || ''} onChange={(e) => handleInputChange('personalInfo', 'email', e.target.value)} placeholder="john@example.com" />
                                            <InputField label="Phone" value={personalInfo.phone || ''} onChange={(e) => handleInputChange('personalInfo', 'phone', e.target.value)} placeholder="+1 234 567 890" />
                                            <InputField label="Address" value={personalInfo.address || ''} onChange={(e) => handleInputChange('personalInfo', 'address', e.target.value)} placeholder="City, Country" />
                                            <InputField label="LinkedIn" value={personalInfo.linkedin || ''} onChange={(e) => handleInputChange('personalInfo', 'linkedin', e.target.value)} placeholder="linkedin.com/in/johndoe" />
                                            <InputField label="GitHub" value={personalInfo.github || ''} onChange={(e) => handleInputChange('personalInfo', 'github', e.target.value)} placeholder="github.com/johndoe" />
                                            <InputField label="Portfolio" value={personalInfo.portfolio || ''} onChange={(e) => handleInputChange('personalInfo', 'portfolio', e.target.value)} placeholder="johndoe.com" />
                                        </div>
                                        <div className="mt-4">
                                            <label className="block text-xs font-medium text-subtext mb-1.5">Professional Summary</label>
                                            <textarea
                                                className="input-base min-h-[100px] resize-y"
                                                value={personalInfo.summary || ''}
                                                onChange={(e) => handleInputChange('personalInfo', 'summary', e.target.value)}
                                                placeholder="Briefly describe your professional background and key achievements..."
                                            />
                                        </div>
                                    </FormSection>
                                </div>

                                {/* Education */}
                                <div ref={sectionRefs.education} className="scroll-mt-4">
                                    <FormSection title="Education" icon={null} isOpen={true}>
                                        {education.map((edu, index) => (
                                            <div key={index} className="mb-6 p-4 bg-gray-50 dark:bg-input-bg rounded-lg border border-border relative group hover:border-primary/30 transition-all">
                                                <button onClick={() => removeItem('education', index)} className="absolute top-2 right-2 text-subtext hover:text-red-500 opacity-0 group-hover:opacity-100 transition-opacity p-1 hover:bg-red-500/10 rounded">
                                                    <Trash2 size={16} />
                                                </button>
                                                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                                    <InputField label="School/University" value={edu.school} onChange={(e) => handleArrayChange('education', index, 'school', e.target.value)} />
                                                    <InputField label="Degree" value={edu.degree} onChange={(e) => handleArrayChange('education', index, 'degree', e.target.value)} />
                                                    <InputField label="Start Date" value={edu.startDate} onChange={(e) => handleArrayChange('education', index, 'startDate', e.target.value)} type="month" />
                                                    <InputField label="End Date" value={edu.endDate} onChange={(e) => handleArrayChange('education', index, 'endDate', e.target.value)} type="month" />
                                                    <InputField label="Score/GPA" value={edu.score} onChange={(e) => handleArrayChange('education', index, 'score', e.target.value)} />
                                                    <InputField label="Location" value={edu.location} onChange={(e) => handleArrayChange('education', index, 'location', e.target.value)} />
                                                </div>
                                            </div>
                                        ))}
                                        <button onClick={() => addItem('education', { school: '', degree: '', startDate: '', endDate: '', score: '', location: '' })} className="btn-secondary w-full py-2 text-sm bg-primary/5 hover:bg-primary/10 border-primary/20 text-primary">
                                            <Plus size={16} /> Add Education
                                        </button>
                                    </FormSection>
                                </div>

                                {/* Technical Skills */}
                                <div ref={sectionRefs.skills} className="scroll-mt-4">
                                    <FormSection title="Technical Skills" icon={null} isOpen={true}>
                                        <div className="space-y-3">
                                            {technicalSkills.map((skill, index) => (
                                                <div key={index} className="flex gap-2">
                                                    <input
                                                        type="text"
                                                        className="input-base"
                                                        value={skill}
                                                        onChange={(e) => {
                                                            const newSkills = [...technicalSkills];
                                                            newSkills[index] = e.target.value;
                                                            updateResumeData('technicalSkills', newSkills);
                                                        }}
                                                        placeholder="e.g. JavaScript, React, Node.js"
                                                    />
                                                    <button onClick={() => {
                                                        const newSkills = technicalSkills.filter((_, i) => i !== index);
                                                        updateResumeData('technicalSkills', newSkills);
                                                    }} className="text-subtext hover:text-red-500 p-2 hover:bg-red-500/10 rounded-lg transition-colors">
                                                        <Trash2 size={18} />
                                                    </button>
                                                </div>
                                            ))}
                                            <button onClick={() => updateResumeData('technicalSkills', [...technicalSkills, ''])} className="btn-secondary w-full py-2 text-sm bg-primary/5 hover:bg-primary/10 border-primary/20 text-primary">
                                                <Plus size={16} /> Add Skill
                                            </button>
                                        </div>
                                    </FormSection>
                                </div>

                                {/* Experience / Internships */}
                                <div ref={sectionRefs.experience} className="scroll-mt-4">
                                    <FormSection title="Internships & Experience" icon={null} isOpen={true}>
                                        {internships.map((intern, index) => (
                                            <div key={index} className="mb-6 p-4 bg-gray-50 dark:bg-input-bg rounded-lg border border-border relative group hover:border-primary/30 transition-all">
                                                <button onClick={() => removeItem('internships', index)} className="absolute top-2 right-2 text-subtext hover:text-red-500 opacity-0 group-hover:opacity-100 transition-opacity p-1 hover:bg-red-500/10 rounded">
                                                    <Trash2 size={16} />
                                                </button>
                                                <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
                                                    <InputField label="Job Title" value={intern.role} onChange={(e) => handleArrayChange('internships', index, 'role', e.target.value)} />
                                                    <InputField label="Company" value={intern.company} onChange={(e) => handleArrayChange('internships', index, 'company', e.target.value)} />
                                                    <InputField label="Start Date" value={intern.startDate} onChange={(e) => handleArrayChange('internships', index, 'startDate', e.target.value)} type="month" />
                                                    <InputField label="End Date" value={intern.endDate} onChange={(e) => handleArrayChange('internships', index, 'endDate', e.target.value)} type="month" />
                                                    <InputField label="Location" value={intern.location} onChange={(e) => handleArrayChange('internships', index, 'location', e.target.value)} />
                                                </div>
                                                <div>
                                                    <label className="block text-xs font-medium text-subtext mb-1.5">Description (Bullet points)</label>
                                                    {(intern.description || []).map((desc, i) => (
                                                        <div key={i} className="flex gap-2 mb-2">
                                                            <input
                                                                type="text"
                                                                className="input-base text-sm"
                                                                value={desc}
                                                                onChange={(e) => {
                                                                    const newInterns = [...internships];
                                                                    newInterns[index].description[i] = e.target.value;
                                                                    updateResumeData('internships', newInterns);
                                                                }}
                                                                placeholder="• Achieved X by doing Y..."
                                                            />
                                                            <button onClick={() => {
                                                                const newInterns = [...internships];
                                                                newInterns[index].description = newInterns[index].description.filter((_, dIndex) => dIndex !== i);
                                                                updateResumeData('internships', newInterns);
                                                            }} className="text-subtext hover:text-red-500 p-2 hover:bg-red-500/10 rounded-lg">
                                                                <Trash2 size={16} />
                                                            </button>
                                                        </div>
                                                    ))}
                                                    <button onClick={() => {
                                                        const newInterns = [...internships];
                                                        if (!newInterns[index].description) newInterns[index].description = [];
                                                        newInterns[index].description.push('');
                                                        updateResumeData('internships', newInterns);
                                                    }} className="text-xs text-primary font-medium hover:text-primary-light flex items-center gap-1 mt-2">
                                                        <Plus size={12} /> Add Bullet Point
                                                    </button>
                                                </div>
                                            </div>
                                        ))}
                                        <button onClick={() => addItem('internships', { role: '', company: '', startDate: '', endDate: '', location: '', description: [''] })} className="btn-secondary w-full py-2 text-sm bg-primary/5 hover:bg-primary/10 border-primary/20 text-primary">
                                            <Plus size={16} /> Add Experience
                                        </button>
                                    </FormSection>
                                </div>

                                {/* Projects */}
                                <div ref={sectionRefs.projects} className="scroll-mt-4">
                                    <FormSection title="Projects" icon={null} isOpen={true}>
                                        {projects.map((proj, index) => (
                                            <div key={index} className="mb-6 p-4 bg-gray-50 dark:bg-input-bg rounded-lg border border-border relative group hover:border-primary/30 transition-all">
                                                <button onClick={() => removeItem('projects', index)} className="absolute top-2 right-2 text-subtext hover:text-red-500 opacity-0 group-hover:opacity-100 transition-opacity p-1 hover:bg-red-500/10 rounded">
                                                    <Trash2 size={16} />
                                                </button>
                                                <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
                                                    <InputField label="Project Title" value={proj.title} onChange={(e) => handleArrayChange('projects', index, 'title', e.target.value)} />
                                                    <InputField label="Date" value={proj.date} onChange={(e) => handleArrayChange('projects', index, 'date', e.target.value)} />
                                                    <InputField label="Link" value={proj.link} onChange={(e) => handleArrayChange('projects', index, 'link', e.target.value)} />
                                                </div>
                                                <div>
                                                    <label className="block text-xs font-medium text-subtext mb-1.5">Description</label>
                                                    {(proj.description || []).map((desc, i) => (
                                                        <div key={i} className="flex gap-2 mb-2">
                                                            <input
                                                                type="text"
                                                                className="input-base text-sm"
                                                                value={desc}
                                                                onChange={(e) => {
                                                                    const newProjects = [...projects];
                                                                    newProjects[index].description[i] = e.target.value;
                                                                    updateResumeData('projects', newProjects);
                                                                }}
                                                                placeholder="• Key feature or technology used..."
                                                            />
                                                            <button onClick={() => {
                                                                const newProjects = [...projects];
                                                                newProjects[index].description = newProjects[index].description.filter((_, dIndex) => dIndex !== i);
                                                                updateResumeData('projects', newProjects);
                                                            }} className="text-subtext hover:text-red-500 p-2 hover:bg-red-500/10 rounded-lg">
                                                                <Trash2 size={16} />
                                                            </button>
                                                        </div>
                                                    ))}
                                                    <button onClick={() => {
                                                        const newProjects = [...projects];
                                                        if (!newProjects[index].description) newProjects[index].description = [];
                                                        newProjects[index].description.push('');
                                                        updateResumeData('projects', newProjects);
                                                    }} className="text-xs text-primary font-medium hover:text-primary-light flex items-center gap-1 mt-2">
                                                        <Plus size={12} /> Add Bullet Point
                                                    </button>
                                                </div>
                                            </div>
                                        ))}
                                        <button onClick={() => addItem('projects', { title: '', date: '', link: '', description: [''] })} className="btn-secondary w-full py-2 text-sm bg-primary/5 hover:bg-primary/10 border-primary/20 text-primary">
                                            <Plus size={16} /> Add Project
                                        </button>
                                    </FormSection>
                                </div>

                                {/* Achievements */}
                                <div ref={sectionRefs.achievements} className="scroll-mt-4">
                                    <FormSection title="Achievements" icon={null} isOpen={true}>
                                        <div className="space-y-3">
                                            {achievements.map((ach, index) => (
                                                <div key={index} className="flex gap-2">
                                                    <input
                                                        type="text"
                                                        className="input-base"
                                                        value={ach}
                                                        onChange={(e) => {
                                                            const newAch = [...achievements];
                                                            newAch[index] = e.target.value;
                                                            updateResumeData('achievements', newAch);
                                                        }}
                                                        placeholder="e.g. 1st Place in Hackathon"
                                                    />
                                                    <button onClick={() => {
                                                        const newAch = achievements.filter((_, i) => i !== index);
                                                        updateResumeData('achievements', newAch);
                                                    }} className="text-subtext hover:text-red-500 p-2 hover:bg-red-500/10 rounded-lg transition-colors">
                                                        <Trash2 size={18} />
                                                    </button>
                                                </div>
                                            ))}
                                            <button onClick={() => updateResumeData('achievements', [...achievements, ''])} className="btn-secondary w-full py-2 text-sm bg-primary/5 hover:bg-primary/10 border-primary/20 text-primary">
                                                <Plus size={16} /> Add Achievement
                                            </button>
                                        </div>
                                    </FormSection>
                                </div>

                                {/* Certificates */}
                                <div ref={sectionRefs.certificates} className="scroll-mt-4">
                                    <FormSection title="Certificates" icon={null} isOpen={true}>
                                        {certificates.map((cert, index) => (
                                            <div key={index} className="mb-6 p-4 bg-gray-50 dark:bg-input-bg rounded-lg border border-border relative group hover:border-primary/30 transition-all">
                                                <button onClick={() => removeItem('certificates', index)} className="absolute top-2 right-2 text-subtext hover:text-red-500 opacity-0 group-hover:opacity-100 transition-opacity p-1 hover:bg-red-500/10 rounded">
                                                    <Trash2 size={16} />
                                                </button>
                                                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                                    <InputField label="Certificate Name" value={cert.name} onChange={(e) => handleArrayChange('certificates', index, 'name', e.target.value)} />
                                                    <InputField label="Issuer" value={cert.issuer} onChange={(e) => handleArrayChange('certificates', index, 'issuer', e.target.value)} />
                                                    <InputField label="Date" value={cert.date} onChange={(e) => handleArrayChange('certificates', index, 'date', e.target.value)} />
                                                </div>
                                            </div>
                                        ))}
                                        <button onClick={() => addItem('certificates', { name: '', issuer: '', date: '' })} className="btn-secondary w-full py-2 text-sm bg-primary/5 hover:bg-primary/10 border-primary/20 text-primary">
                                            <Plus size={16} /> Add Certificate
                                        </button>
                                    </FormSection>
                                </div>

                                {/* Extracurricular */}
                                <div ref={sectionRefs.extracurricular} className="scroll-mt-4">
                                    <FormSection title="Extracurricular" icon={null} isOpen={true}>
                                        {extracurricular.map((extra, index) => (
                                            <div key={index} className="mb-6 p-4 bg-gray-50 dark:bg-input-bg rounded-lg border border-border relative group hover:border-primary/30 transition-all">
                                                <button onClick={() => removeItem('extracurricular', index)} className="absolute top-2 right-2 text-subtext hover:text-red-500 opacity-0 group-hover:opacity-100 transition-opacity p-1 hover:bg-red-500/10 rounded">
                                                    <Trash2 size={16} />
                                                </button>
                                                <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
                                                    <InputField label="Role" value={extra.role} onChange={(e) => handleArrayChange('extracurricular', index, 'role', e.target.value)} />
                                                    <InputField label="Organization" value={extra.organization} onChange={(e) => handleArrayChange('extracurricular', index, 'organization', e.target.value)} />
                                                    <InputField label="Date" value={extra.date} onChange={(e) => handleArrayChange('extracurricular', index, 'date', e.target.value)} />
                                                </div>
                                                <div>
                                                    <label className="block text-xs font-medium text-subtext mb-1.5">Description</label>
                                                    {(extra.description || []).map((desc, i) => (
                                                        <div key={i} className="flex gap-2 mb-2">
                                                            <input
                                                                type="text"
                                                                className="input-base text-sm"
                                                                value={desc}
                                                                onChange={(e) => {
                                                                    const newExtra = [...extracurricular];
                                                                    newExtra[index].description[i] = e.target.value;
                                                                    updateResumeData('extracurricular', newExtra);
                                                                }}
                                                                placeholder="• Description..."
                                                            />
                                                            <button onClick={() => {
                                                                const newExtra = [...extracurricular];
                                                                newExtra[index].description = newExtra[index].description.filter((_, dIndex) => dIndex !== i);
                                                                updateResumeData('extracurricular', newExtra);
                                                            }} className="text-subtext hover:text-red-500 p-2 hover:bg-red-500/10 rounded-lg">
                                                                <Trash2 size={16} />
                                                            </button>
                                                        </div>
                                                    ))}
                                                    <button onClick={() => {
                                                        const newExtra = [...extracurricular];
                                                        if (!newExtra[index].description) newExtra[index].description = [];
                                                        newExtra[index].description.push('');
                                                        updateResumeData('extracurricular', newExtra);
                                                    }} className="text-xs text-primary font-medium hover:text-primary-light flex items-center gap-1 mt-2">
                                                        <Plus size={12} /> Add Bullet Point
                                                    </button>
                                                </div>
                                            </div>
                                        ))}
                                        <button onClick={() => addItem('extracurricular', { role: '', organization: '', date: '', description: [''] })} className="btn-secondary w-full py-2 text-sm bg-primary/5 hover:bg-primary/10 border-primary/20 text-primary">
                                            <Plus size={16} /> Add Activity
                                        </button>
                                    </FormSection>
                                </div>

                                {/* Languages */}
                                <div ref={sectionRefs.languages} className="scroll-mt-4">
                                    <FormSection title="Languages" icon={null} isOpen={true}>
                                        <div className="space-y-3">
                                            {languages.map((lang, index) => (
                                                <div key={index} className="flex gap-2">
                                                    <input
                                                        type="text"
                                                        className="input-base"
                                                        value={lang}
                                                        onChange={(e) => {
                                                            const newLangs = [...languages];
                                                            newLangs[index] = e.target.value;
                                                            updateResumeData('languages', newLangs);
                                                        }}
                                                        placeholder="e.g. English (Native)"
                                                    />
                                                    <button onClick={() => {
                                                        const newLangs = languages.filter((_, i) => i !== index);
                                                        updateResumeData('languages', newLangs);
                                                    }} className="text-subtext hover:text-red-500 p-2 hover:bg-red-500/10 rounded-lg transition-colors">
                                                        <Trash2 size={18} />
                                                    </button>
                                                </div>
                                            ))}
                                            <button onClick={() => updateResumeData('languages', [...languages, ''])} className="btn-secondary w-full py-2 text-sm bg-primary/5 hover:bg-primary/10 border-primary/20 text-primary">
                                                <Plus size={16} /> Add Language
                                            </button>
                                        </div>
                                    </FormSection>
                                </div>
                            </div>
                        </div>

                        {/* Right: Live Preview - 60% */}
                        <div className="lg:col-span-7 flex flex-col h-full min-h-0">
                            <div className="mb-4 flex-shrink-0 flex items-center justify-between">
                                <div>
                                    <h2 className="text-xl font-bold text-heading">Live Preview</h2>
                                    <p className="text-xs text-subtext mt-0.5">Real-time resume preview</p>
                                </div>
                                <div className="flex items-center gap-3">
                                    {/* Template Selector */}
                                    <div className="inline-flex items-center rounded-lg bg-gray-100 dark:bg-surface-highlight p-0.5 text-xs border border-border">
                                        <button
                                            onClick={() => setTemplate('ats')}
                                            className={`px-3 py-1.5 rounded-md font-medium transition-all ${template === 'ats' ? 'bg-white dark:bg-[#0F0F11] text-heading shadow-sm border border-border' : 'text-subtext hover:text-heading'
                                                }`}
                                        >
                                            ATS
                                        </button>
                                        <button
                                            onClick={() => setTemplate('classic')}
                                            className={`px-3 py-1.5 rounded-md font-medium transition-all ${template === 'classic' ? 'bg-white dark:bg-[#0F0F11] text-heading shadow-sm border border-border' : 'text-subtext hover:text-heading'
                                                }`}
                                        >
                                            Classic
                                        </button>
                                        <button
                                            onClick={() => setTemplate('accent')}
                                            className={`px-3 py-1.5 rounded-md font-medium transition-all ${template === 'accent' ? 'bg-white dark:bg-[#0F0F11] text-heading shadow-sm border border-border' : 'text-subtext hover:text-heading'
                                                }`}
                                        >
                                            Accent
                                        </button>
                                        <button
                                            onClick={() => setTemplate('boxed')}
                                            className={`px-3 py-1.5 rounded-md font-medium transition-all ${template === 'boxed' ? 'bg-white dark:bg-[#0F0F11] text-heading shadow-sm border border-border' : 'text-subtext hover:text-heading'
                                                }`}
                                        >
                                            Boxed
                                        </button>
                                    </div>
                                    {/* Zoom Controls */}
                                    <div className="flex items-center gap-1 bg-gray-100 dark:bg-surface-highlight rounded-lg p-0.5 border border-border">
                                        <button
                                            onClick={handleZoomOut}
                                            className="p-1.5 hover:bg-white dark:hover:bg-[#0F0F11] rounded-md transition-all text-subtext hover:text-heading"
                                            disabled={zoom <= 50}
                                        >
                                            <ZoomOut size={16} />
                                        </button>
                                        <span className="text-xs font-medium text-heading min-w-[2.5rem] text-center">{zoom}%</span>
                                        <button
                                            onClick={handleZoomIn}
                                            className="p-1.5 hover:bg-white dark:hover:bg-[#0F0F11] rounded-md transition-all text-subtext hover:text-heading"
                                            disabled={zoom >= 150}
                                        >
                                            <ZoomIn size={16} />
                                        </button>
                                        <div className="w-px h-4 bg-border mx-0.5"></div>
                                        <button
                                            onClick={handleResetZoom}
                                            className="p-1.5 hover:bg-white dark:hover:bg-[#0F0F11] rounded-md transition-all text-subtext hover:text-heading"
                                            title="Reset to 100%"
                                        >
                                            <RotateCcw size={16} />
                                        </button>
                                    </div>
                                </div>
                            </div>

                            <div className="flex-1 min-h-0 overflow-auto custom-scrollbar flex justify-center items-start pt-6">
                                <div
                                    className="origin-top transition-transform duration-200 shadow-2xl"
                                    style={{ transform: `scale(${zoom / 100})` }}
                                >
                                    <ResumePreview template={template} />
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default Editor;

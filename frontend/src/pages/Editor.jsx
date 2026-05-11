import React, { useState, useRef, useEffect, useCallback } from 'react';
import { useResumeData } from '../hooks/useResumeData';
import ResumePreview from '../components/ResumePreview';
import FormSection from '../components/FormSection';
import InputField from '../components/InputField';
import Navbar from '../components/Navbar';
import { 
    Plus, 
    Trash2, 
    ZoomIn, 
    ZoomOut, 
    RotateCcw, 
    Download, 
    FileText, 
    Loader2, 
    X, 
    CheckCircle2,
    Save,
    User,
    Briefcase,
    GraduationCap,
    Code2,
    FolderGit2,
    Award,
    Trophy,
    Globe2,
    Type,
    ArrowLeft,
    Clock
} from 'lucide-react';
import { Link } from 'react-router-dom';
import HistorySidebar from '../components/HistorySidebar';
import { resumeAPI } from '../services/api';

const Editor = () => {
    const { 
        resumeData, 
        updateResumeData, 
        activeResumeTitle, 
        updateResumeTitle,
        activeResumeId
    } = useResumeData();
    const [zoom, setZoom] = useState(100);
    const [template, setTemplate] = useState('ats');
    const resumeRef = useRef(null);
    const [exporting, setExporting] = useState(false);
    const [showExportModal, setShowExportModal] = useState(false);
    const [exportSuccess, setExportSuccess] = useState(false);
    const [exportFilename, setExportFilename] = useState('my-resume');
    const [isSaving, setIsSaving] = useState(false);
    const [showHistory, setShowHistory] = useState(false);
    const [localTitle, setLocalTitle] = useState(activeResumeTitle);

    // Template-specific field configuration
    const TEMPLATE_CONFIG = {
        ats: ['personalInfo', 'education', 'technicalSkills', 'projects', 'internships', 'certificates', 'achievements'],
        classic: ['personalInfo', 'summary', 'education', 'technicalSkills', 'projects', 'internships', 'achievements'],
        modern: ['personalInfo', 'summary', 'education', 'technicalSkills', 'projects', 'internships', 'certificates', 'languages', 'achievements']
    };

    const isFieldVisible = (field) => {
        return TEMPLATE_CONFIG[template]?.includes(field);
    };

    // Sync local title when active resume changes
    useEffect(() => {
        setLocalTitle(activeResumeTitle);
    }, [activeResumeId]);

    // Sync export filename with resume title
    useEffect(() => {
        if (activeResumeTitle) {
            setExportFilename(activeResumeTitle.replace(/\s+/g, '_'));
        }
    }, [activeResumeTitle]);

    const {
        personalInfo = {},
        education = [],
        technicalSkills = [],
        internships = [],
        projects = [],
        achievements = [],
        certificates = [],
        languages = [],
    } = resumeData || {};

    const handleInputChange = (section, field, value) => {
        const existing = (resumeData && resumeData[section]) || {};
        updateResumeData(section, { ...existing, [field]: value });
        simulateAutoSave();
    };

    const handleArrayChange = (section, index, field, value) => {
        const currentArray = Array.isArray(resumeData?.[section]) ? resumeData[section] : [];
        const newArray = [...currentArray];
        newArray[index] = { ...newArray[index], [field]: value };
        updateResumeData(section, newArray);
        simulateAutoSave();
    };

    const addItem = (section, initialData) => {
        const currentArray = Array.isArray(resumeData?.[section]) ? resumeData[section] : [];
        updateResumeData(section, [...currentArray, initialData]);
    };

    const removeItem = (section, indexOrId) => {
        const currentArray = Array.isArray(resumeData?.[section]) ? resumeData[section] : [];
        const newArray = currentArray.filter((item, i) => {
            if (typeof indexOrId === 'number') return i !== indexOrId;
            return item.id !== indexOrId;
        });
        updateResumeData(section, newArray);
    };

    const simulateAutoSave = () => {
        setIsSaving(true);
        setTimeout(() => setIsSaving(false), 800);
    };

    const handleZoomIn = () => setZoom(prev => Math.min(prev + 10, 150));
    const handleZoomOut = () => setZoom(prev => Math.max(prev - 10, 50));

    const handleExportPDF = useCallback(async () => {
        if (!resumeRef.current || exporting) return;
        setExporting(true);
        
        try {
            const element = resumeRef.current;
            
            // 1. Get the full HTML (outerHTML preserves the root div's classes and styles)
            const resumeHtml = element.outerHTML;
            
            // 2. Wrap in a full document with necessary styles
            const fullHtml = `
                <!DOCTYPE html>
                <html>
                <head>
                    <meta charset="utf-8">
                    <title>${activeResumeTitle || 'Resume'}</title>
                    <script src="https://cdn.tailwindcss.com"></script>
                    <link href="https://fonts.googleapis.com/css2?family=Inter:wght@400;500;600;700&display=swap" rel="stylesheet">
                    <style>
                        :root {
                            --color-heading: 15 23 42;
                            --color-text: 51 65 85;
                            --color-subtext: 71 85 105;
                            --color-border: 203 213 225;
                            --primary: #4F46E5;
                        }

                        body { 
                            margin: 0; 
                            padding: 0; 
                            -webkit-print-color-adjust: exact;
                            background-color: white;
                        }

                        /* Helper classes to resolve CSS variables in Tailwind */
                        .text-heading { color: rgb(var(--color-heading)); }
                        .text-text { color: rgb(var(--color-text)); }
                        .text-subtext { color: rgb(var(--color-subtext)); }
                        .border-border { border-color: rgb(var(--color-border)); }
                        .text-primary { color: var(--primary); }
                        .bg-primary { background-color: var(--primary); }

                        /* Ensure the preview container looks right in PDF */
                        #resume-preview {
                            box-shadow: none !important;
                            margin: 0 auto !important;
                            border: none !important;
                        }

                        @media print {
                            @page {
                                size: A4;
                                margin: 0;
                            }
                        }
                    </style>
                </head>
                <body>
                    ${resumeHtml}
                </body>
                </html>
            `;

            // 3. Send to backend for Playwright conversion
            const response = await resumeAPI.exportPDF(fullHtml);
            
            // 4. Trigger download
            const blob = new Blob([response.data], { type: 'application/pdf' });
            const url = window.URL.createObjectURL(blob);
            const link = document.createElement('a');
            link.href = url;
            link.setAttribute('download', `${(exportFilename.trim() || 'resume')}.pdf`);
            document.body.appendChild(link);
            link.click();
            link.remove();
            window.URL.revokeObjectURL(url);
            
            setExportSuccess(true);
            setTimeout(() => {
                setExportSuccess(false);
                setShowExportModal(false);
            }, 2000);
        } catch (error) {
            console.error('Playwright PDF export failed:', error);
            alert('Export failed. Please try again.');
        } finally {
            setExporting(false);
        }
    }, [exporting, exportFilename, activeResumeTitle]);



    return (
        <div className="h-screen bg-background flex flex-col overflow-hidden text-text selection:bg-primary/20">
            <Navbar />
            
            {/* Professional Sub-Header */}
            <div className="h-14 border-b border-border bg-background px-6 flex items-center justify-between flex-shrink-0 z-30">
                <div className="flex items-center gap-6">
                    <Link to="/" className="text-subtext hover:text-heading transition-colors">
                        <ArrowLeft size={18} />
                    </Link>
                    <div className="w-px h-6 bg-border" />
                    <div className="flex flex-col">
                        <span className="text-[10px] font-black text-subtext uppercase tracking-widest leading-tight">Resume Name</span>
                        <input 
                            className="bg-transparent border-none p-0 text-sm font-bold text-heading focus:ring-0 w-48 hover:bg-surface-highlight rounded px-1 transition-colors outline-none cursor-text"
                            value={localTitle}
                            onChange={(e) => {
                                setLocalTitle(e.target.value);
                                updateResumeTitle(e.target.value);
                            }}
                            placeholder="Untitled Resume"
                            title="Click to rename"
                        />
                    </div>
                    {isSaving ? (
                        <div className="flex items-center gap-2 text-[10px] font-bold text-primary uppercase tracking-widest bg-primary/5 px-3 py-1 rounded-full border border-primary/10">
                            <div className="w-1.5 h-1.5 rounded-full bg-primary animate-pulse" />
                            Saving to cloud
                        </div>
                    ) : (
                        <div className="flex items-center gap-2 text-[10px] font-bold text-subtext uppercase tracking-widest bg-surface-highlight px-3 py-1 rounded-full border border-border">
                            <CheckCircle2 size={12} className="text-green-500" />
                            All changes saved
                        </div>
                    )}
                    
                    <button 
                        onClick={() => setShowHistory(true)}
                        className="flex items-center gap-2 text-[10px] font-bold text-heading uppercase tracking-widest bg-background hover:bg-surface-highlight px-3 py-1.5 rounded-lg border border-border transition-all ml-2"
                    >
                        <Clock size={12} className="text-primary" />
                        Drafts History
                    </button>
                </div>
                
                <div className="flex items-center gap-4">
                    <div className="flex items-center gap-1 bg-surface-highlight border border-border p-1 rounded-lg">
                        {['ats', 'classic', 'modern'].map((t) => (
                            <button
                                key={t}
                                onClick={() => setTemplate(t)}
                                className={`px-3 py-1 text-[10px] font-black uppercase tracking-widest rounded-md transition-all ${template === t ? 'bg-background shadow-sm text-primary border border-border' : 'text-subtext hover:text-heading'}`}
                            >
                                {t}
                            </button>
                        ))}
                    </div>
                    <button 
                        onClick={() => setShowExportModal(true)} 
                        className="btn-primary py-2 px-6 text-xs font-bold shadow-lg shadow-primary/20"
                    >
                        <Download size={16} /> Export Resume
                    </button>
                </div>
            </div>

            <div className="flex-1 flex min-h-0 overflow-hidden bg-surface-highlight">
                {/* 1. Form Pane (Left) */}
                <main className="flex-1 max-w-2xl mx-auto xl:max-w-3xl overflow-y-auto custom-scrollbar p-8 space-y-4">
                    
                    {/* Personal Info */}
                    <FormSection title="Personal Information" icon={User} defaultOpen={true}>
                        <div className="grid grid-cols-2 gap-6">
                            <InputField label="Full Name" value={personalInfo.fullName || ''} onChange={(e) => handleInputChange('personalInfo', 'fullName', e.target.value)} placeholder="e.g. John Doe" />
                            <InputField label="Professional Title" value={personalInfo.jobTitle || ''} onChange={(e) => handleInputChange('personalInfo', 'jobTitle', e.target.value)} placeholder="e.g. Senior Software Engineer" />
                            <InputField label="Email Address" value={personalInfo.email || ''} onChange={(e) => handleInputChange('personalInfo', 'email', e.target.value)} placeholder="john@example.com" />
                            <InputField label="Phone Number" value={personalInfo.phone || ''} onChange={(e) => handleInputChange('personalInfo', 'phone', e.target.value)} placeholder="+1 234 567 890" />
                            <InputField label="Location" value={personalInfo.address || ''} onChange={(e) => handleInputChange('personalInfo', 'address', e.target.value)} placeholder="City, Country" className="col-span-2" />
                            <InputField label="LinkedIn" value={personalInfo.linkedin || ''} onChange={(e) => handleInputChange('personalInfo', 'linkedin', e.target.value)} placeholder="linkedin.com/in/username" />
                            <InputField label="Portfolio/GitHub" value={personalInfo.github || ''} onChange={(e) => handleInputChange('personalInfo', 'github', e.target.value)} placeholder="github.com/username" />
                        </div>
                    </FormSection>

                    {/* Summary */}
                    {isFieldVisible('summary') && (
                        <FormSection title="Professional Summary" icon={Type}>
                            <InputField 
                                label="Summary" 
                                multiline 
                                value={personalInfo.summary || ''} 
                                onChange={(e) => handleInputChange('personalInfo', 'summary', e.target.value)} 
                                placeholder="Experienced engineer with a focus on..." 
                            />
                        </FormSection>
                    )}

                    {/* Experience */}
                    {isFieldVisible('internships') && (
                        <FormSection 
                            title="Work Experience" 
                            icon={Briefcase} 
                            items={internships}
                            onAdd={(action, id) => action === 'add' ? addItem('internships', { company: '', role: '', duration: '', location: '', description: [''] }) : removeItem('internships', id)}
                            renderItem={(exp, index) => (
                                <div className="space-y-6">
                                    <div className="grid grid-cols-2 gap-6">
                                        <InputField label="Organization" value={exp.company} onChange={(e) => handleArrayChange('internships', index, 'company', e.target.value)} placeholder="Company Name" />
                                        <InputField label="Job Title" value={exp.role} onChange={(e) => handleArrayChange('internships', index, 'role', e.target.value)} placeholder="Your Role" />
                                        <InputField label="Period" value={exp.duration} onChange={(e) => handleArrayChange('internships', index, 'duration', e.target.value)} placeholder="Jan 2022 — Present" />
                                        <InputField label="Location" value={exp.location} onChange={(e) => handleArrayChange('internships', index, 'location', e.target.value)} placeholder="Remote / City" />
                                    </div>
                                    <div className="space-y-3">
                                        <label className="text-[10px] font-black text-subtext uppercase tracking-widest">Key Responsibilities</label>
                                        {(exp.description || []).map((bullet, bIndex) => (
                                            <div key={bIndex} className="flex gap-2 group/bullet">
                                                <input 
                                                    className="input-base text-xs flex-1" 
                                                    value={bullet} 
                                                    onChange={(e) => {
                                                        const newExp = [...internships];
                                                        newExp[index].description[bIndex] = e.target.value;
                                                        updateResumeData('internships', newExp);
                                                    }}
                                                    placeholder="• Achieved X result using Y technology..."
                                                />
                                                <button 
                                                    onClick={() => {
                                                        const newExp = [...internships];
                                                        newExp[index].description = newExp[index].description.filter((_, i) => i !== bIndex);
                                                        updateResumeData('internships', newExp);
                                                    }}
                                                    className="p-2 text-subtext hover:text-red-500 opacity-0 group-hover/bullet:opacity-100"
                                                >
                                                    <X size={14} />
                                                </button>
                                            </div>
                                        ))}
                                        <button 
                                            onClick={() => {
                                                const newExp = [...internships];
                                                newExp[index].description = [...(newExp[index].description || []), ''];
                                                updateResumeData('internships', newExp);
                                            }}
                                            className="text-[10px] font-black text-primary uppercase mt-2 hover:underline inline-flex items-center gap-1"
                                        >
                                            + Add Achievement
                                        </button>
                                    </div>
                                </div>
                            )}
                        />
                    )}

                    {/* Education */}
                    {isFieldVisible('education') && (
                        <FormSection 
                            title="Education" 
                            icon={GraduationCap} 
                            items={education}
                            onAdd={(action, id) => action === 'add' ? addItem('education', { school: '', degree: '', startDate: '', endDate: '', score: '', location: '' }) : removeItem('education', id)}
                            renderItem={(edu, index) => (
                                <div className="grid grid-cols-2 gap-6">
                                    <InputField label="Institution" value={edu.school} onChange={(e) => handleArrayChange('education', index, 'school', e.target.value)} placeholder="e.g. University of Technology" />
                                    <InputField label="Degree / Major" value={edu.degree} onChange={(e) => handleArrayChange('education', index, 'degree', e.target.value)} placeholder="e.g. B.Tech in CS" />
                                    <InputField label="Start Date" value={edu.startDate} onChange={(e) => handleArrayChange('education', index, 'startDate', e.target.value)} placeholder="e.g. 2020" />
                                    <InputField label="End Date / Completion" value={edu.endDate} onChange={(e) => handleArrayChange('education', index, 'endDate', e.target.value)} placeholder="e.g. 2024" />
                                    <InputField label="GPA / Distinction" value={edu.score} onChange={(e) => handleArrayChange('education', index, 'score', e.target.value)} placeholder="e.g. 8.5 CGPA" />
                                    <InputField label="Location" value={edu.location} onChange={(e) => handleArrayChange('education', index, 'location', e.target.value)} placeholder="e.g. Ghaziabad, India" />
                                </div>
                            )}
                        />
                    )}

                    {/* Skills */}
                    {isFieldVisible('technicalSkills') && (
                        <FormSection 
                            title="Expertise & Tools" 
                            icon={Code2} 
                            items={technicalSkills}
                            onAdd={(action, id) => action === 'add' ? addItem('technicalSkills', { category: '', skills: '' }) : removeItem('technicalSkills', id)}
                            renderItem={(skill, index) => (
                                <div className="grid grid-cols-2 gap-6">
                                    <InputField label="Skill Group" value={skill.category} onChange={(e) => handleArrayChange('technicalSkills', index, 'category', e.target.value)} placeholder="e.g. Languages" />
                                    <InputField label="Expertise" value={skill.skills} onChange={(e) => handleArrayChange('technicalSkills', index, 'skills', e.target.value)} placeholder="e.g. Python, JS, C++" />
                                </div>
                            )}
                        />
                    )}

                    {/* Projects */}
                    {isFieldVisible('projects') && (
                        <FormSection 
                            title="Key Projects" 
                            icon={FolderGit2} 
                            items={projects}
                            onAdd={(action, id) => action === 'add' ? addItem('projects', { title: '', date: '', description: [''] }) : removeItem('projects', id)}
                            renderItem={(proj, index) => (
                                <div className="space-y-6">
                                    <div className="grid grid-cols-2 gap-6">
                                        <InputField label="Project Name" value={proj.title} onChange={(e) => handleArrayChange('projects', index, 'title', e.target.value)} />
                                        <InputField label="Period / Date" value={proj.date} onChange={(e) => handleArrayChange('projects', index, 'date', e.target.value)} />
                                    </div>
                                    <div className="space-y-3">
                                        <label className="text-[10px] font-black text-subtext uppercase tracking-widest">Impact Bullets</label>
                                        {(proj.description || []).map((bullet, bIndex) => (
                                            <div key={bIndex} className="flex gap-2 group/bullet">
                                                <input 
                                                    className="input-base text-xs flex-1" 
                                                    value={bullet} 
                                                    onChange={(e) => {
                                                        const newProj = [...projects];
                                                        newProj[index].description[bIndex] = e.target.value;
                                                        updateResumeData('projects', newProj);
                                                    }}
                                                    placeholder="• Developed X to solve Y..."
                                                />
                                                <button 
                                                    onClick={() => {
                                                        const newProj = [...projects];
                                                        newProj[index].description = newProj[index].description.filter((_, i) => i !== bIndex);
                                                        updateResumeData('projects', newProj);
                                                    }}
                                                    className="p-2 text-subtext hover:text-red-500 opacity-0 group-hover/bullet:opacity-100"
                                                >
                                                    <X size={14} />
                                                </button>
                                            </div>
                                        ))}
                                        <button 
                                            onClick={() => {
                                                const newProj = [...projects];
                                                newProj[index].description = [...(newProj[index].description || []), ''];
                                                updateResumeData('projects', newProj);
                                            }}
                                            className="text-[10px] font-black text-primary uppercase mt-2 hover:underline inline-flex items-center gap-1"
                                        >
                                            + Add Detail
                                        </button>
                                    </div>
                                </div>
                            )}
                        />
                    )}

                    {/* Certifications */}
                    {isFieldVisible('certificates') && (
                        <FormSection 
                            title="Certifications" 
                            icon={Award} 
                            items={certificates}
                            onAdd={(action, id) => action === 'add' ? addItem('certificates', { name: '', issuer: '', date: '' }) : removeItem('certificates', id)}
                            renderItem={(cert, index) => (
                                <div className="grid grid-cols-3 gap-4">
                                    <InputField label="Title" value={cert.name} onChange={(e) => handleArrayChange('certificates', index, 'name', e.target.value)} />
                                    <InputField label="Issuer" value={cert.issuer} onChange={(e) => handleArrayChange('certificates', index, 'issuer', e.target.value)} />
                                    <InputField label="Date" value={cert.date} onChange={(e) => handleArrayChange('certificates', index, 'date', e.target.value)} />
                                </div>
                            )}
                        />
                    )}

                    {/* Languages */}
                    {isFieldVisible('languages') && (
                        <FormSection 
                            title="Languages" 
                            icon={Globe2} 
                            items={languages}
                            onAdd={(action, id) => action === 'add' ? addItem('languages', { name: '', proficiency: '' }) : removeItem('languages', id)}
                            renderItem={(lang, index) => (
                                <div className="grid grid-cols-2 gap-6">
                                    <InputField label="Language" value={lang.name} onChange={(e) => handleArrayChange('languages', index, 'name', e.target.value)} placeholder="e.g. English" />
                                    <InputField label="Proficiency" value={lang.proficiency} onChange={(e) => handleArrayChange('languages', index, 'proficiency', e.target.value)} placeholder="e.g. Native / Fluent" />
                                </div>
                            )}
                        />
                    )}

                    {/* Achievements */}
                    {isFieldVisible('achievements') && (
                        <FormSection 
                            title="Achievements" 
                            icon={Trophy} 
                            items={achievements}
                            onAdd={(action, id) => action === 'add' ? addItem('achievements', { title: '', description: '' }) : removeItem('achievements', id)}
                            renderItem={(ach, index) => (
                                <div className="space-y-4">
                                    <InputField label="Achievement Title" value={ach.title} onChange={(e) => handleArrayChange('achievements', index, 'title', e.target.value)} placeholder="e.g. Dean's List" />
                                    <InputField label="Description" value={ach.description} onChange={(e) => handleArrayChange('achievements', index, 'description', e.target.value)} multiline placeholder="Describe the achievement..." />
                                </div>
                            )}
                        />
                    )}
                </main>

                {/* 2. Preview Pane (Right) */}
                <section className="hidden lg:flex flex-1 flex-col border-l border-border relative">
                    {/* View Controls Overlay */}
                    <div className="absolute top-6 right-6 z-40 flex flex-col gap-2">
                        <div className="flex items-center gap-1 bg-background border border-border p-1 rounded-full shadow-xl">
                            <button onClick={handleZoomOut} className="p-2 hover:bg-surface-highlight rounded-full text-subtext">
                                <ZoomOut size={16} />
                            </button>
                            <div className="w-12 text-center text-[10px] font-black text-heading">{zoom}%</div>
                            <button onClick={handleZoomIn} className="p-2 hover:bg-surface-highlight rounded-full text-subtext">
                                <ZoomIn size={16} />
                            </button>
                        </div>
                        <button onClick={() => setZoom(100)} className="w-full flex items-center justify-center p-2 bg-background border border-border rounded-full shadow-xl text-subtext hover:text-heading">
                            <RotateCcw size={16} />
                        </button>
                    </div>

                    <div className="flex-1 overflow-y-auto custom-scrollbar p-12 bg-zinc-200 dark:bg-zinc-900/50 flex justify-center items-start">
                        <div 
                            className="bg-white shadow-[0_32px_64px_-16px_rgba(0,0,0,0.2)] origin-top transition-transform duration-300"
                            style={{ transform: `scale(${zoom / 100})` }}
                        >
                            <ResumePreview ref={resumeRef} template={template} />
                        </div>
                    </div>
                </section>
            </div>

            {/* Export Modal */}
            {showExportModal && (
                <div className="fixed inset-0 bg-heading/60 backdrop-blur-md flex items-center justify-center z-[100] p-4">
                    <div className="bg-background border border-border rounded-3xl p-10 w-full max-w-md shadow-[0_0_100px_rgba(0,0,0,0.1)] animate-fade-in">
                        {exportSuccess ? (
                            <div className="text-center py-10">
                                <div className="inline-flex items-center justify-center w-20 h-20 rounded-full bg-green-500/10 text-green-500 mb-8">
                                    <CheckCircle2 size={40} />
                                </div>
                                <h3 className="text-2xl font-bold text-heading mb-3 tracking-tight">Export Successful</h3>
                                <p className="text-subtext text-sm max-w-[240px] mx-auto">Your professional resume has been downloaded to your local device.</p>
                            </div>
                        ) : (
                            <>
                                <div className="flex items-center justify-between mb-10">
                                    <h3 className="text-xs font-black text-heading uppercase tracking-[0.3em]">Export Pipeline</h3>
                                    <button onClick={() => setShowExportModal(false)} className="text-subtext hover:text-heading transition-colors">
                                        <X size={24} />
                                    </button>
                                </div>

                                <div className="space-y-10">
                                    <div>
                                        <label className="text-[10px] font-black text-subtext uppercase tracking-[0.2em] block mb-4">Output Filename</label>
                                        <div className="flex items-center gap-3">
                                            <input
                                                type="text"
                                                className="input-base text-base font-bold py-4"
                                                value={exportFilename}
                                                onChange={(e) => setExportFilename(e.target.value)}
                                                placeholder="Professional_Resume_2024"
                                            />
                                            <span className="text-xs font-black text-subtext uppercase tracking-widest">.pdf</span>
                                        </div>
                                    </div>

                                    <div className="grid grid-cols-2 gap-4">
                                        <div className="p-5 bg-surface-highlight rounded-2xl border border-border">
                                            <span className="text-[10px] font-bold text-subtext uppercase tracking-widest block mb-2">Template</span>
                                            <span className="text-xs font-black text-heading uppercase">{template}</span>
                                        </div>
                                        <div className="p-5 bg-surface-highlight rounded-2xl border border-border">
                                            <span className="text-[10px] font-bold text-subtext uppercase tracking-widest block mb-2">Quality</span>
                                            <span className="text-xs font-black text-heading uppercase">Vector PDF</span>
                                        </div>
                                    </div>

                                    <button
                                        onClick={handleExportPDF}
                                        disabled={exporting}
                                        className="btn-primary w-full py-5 text-sm font-black rounded-2xl shadow-2xl shadow-primary/30"
                                    >
                                        {exporting ? (
                                            <div className="flex items-center gap-3">
                                                <Loader2 className="animate-spin" size={20} />
                                                Processing Capture...
                                            </div>
                                        ) : (
                                            <div className="flex items-center gap-3">
                                                <Download size={20} />
                                                Generate & Download
                                            </div>
                                        )}
                                    </button>
                                </div>
                            </>
                        )}
                    </div>
                </div>
            )}
            {/* History Sidebar */}
            <HistorySidebar 
                isOpen={showHistory} 
                onClose={() => setShowHistory(false)} 
            />
        </div>
    );
};

export default Editor;

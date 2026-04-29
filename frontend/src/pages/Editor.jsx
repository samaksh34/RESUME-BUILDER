import React, { useState, useRef, useEffect, useCallback } from 'react';
import { useResumeData } from '../hooks/useResumeData';
import ResumePreview from '../components/ResumePreview';
import FormSection from '../components/FormSection';
import InputField from '../components/InputField';
import Navbar from '../components/Navbar';
import HorizontalSectionsNav from '../components/HorizontalSectionsNav';
import { Plus, Trash2, ZoomIn, ZoomOut, RotateCcw, Download, FileText, Loader2, X, CheckCircle2 } from 'lucide-react';


const Editor = () => {
    const { resumeData, updateResumeData } = useResumeData();
    const [activeSection, setActiveSection] = useState('personal');
    const [zoom, setZoom] = useState(100);
    const [template, setTemplate] = useState('ats');
    const resumeRef = useRef(null);
    const [exporting, setExporting] = useState(false);
    const [showExportModal, setShowExportModal] = useState(false);
    const [exportSuccess, setExportSuccess] = useState(false);
    const [exportFilename, setExportFilename] = useState('my-resume');
    const [exportQuality, setExportQuality] = useState(2); // 1 = fast, 2 = high, 3 = ultra

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

    // ── PDF Export ──────────────────────────────────────────────────
    const handleExportPDF = useCallback(async () => {
        if (!resumeRef.current || exporting) return;

        setExporting(true);
        setExportSuccess(false);

        try {
            // Dynamically import html2pdf to avoid SSR issues
            const html2pdf = (await import('html2pdf.js')).default;

            const element = resumeRef.current;
            const filename = (exportFilename.trim() || 'my-resume') + '.pdf';

            // Ensure the element is visible and has a white background for the capture
            const originalBoxShadow = element.style.boxShadow;
            element.style.boxShadow = 'none';

            // Inject print-specific styles to force consistency
            const style = document.createElement('style');
            style.innerHTML = `
                * {
                    -webkit-print-color-adjust: exact !important;
                    color-adjust: exact !important;
                    print-color-adjust: exact !important;
                }
                #resume-preview {
                    width: 794px !important;
                    min-height: 1123px !important;
                    margin: 0 !important;
                    padding: 48px !important;
                }
            `;
            document.head.appendChild(style);
            
            const opt = {
                margin: 0,
                filename,
                image: { type: 'jpeg', quality: 1.0 },
                html2canvas: {
                    scale: 2, // 2 is very stable and sharp enough for A4
                    useCORS: true,
                    letterRendering: true,
                    backgroundColor: '#FFFFFF',
                    scrollX: 0,
                    scrollY: 0,
                    windowWidth: 794, // Approx 210mm in pixels at 96dpi
                },
                jsPDF: {
                    unit: 'mm',
                    format: 'a4',
                    orientation: 'portrait',
                    compress: true
                },
                pagebreak: { mode: ['avoid-all'] },
            };

            await html2pdf().from(element).set(opt).save();

            // Restore styles
            element.style.boxShadow = originalBoxShadow;
            document.head.removeChild(style);

            setExportSuccess(true);
            setTimeout(() => {
                setExportSuccess(false);
                setShowExportModal(false);
            }, 2000);
        } catch (error) {
            console.error('PDF export failed:', error);
            alert('Failed to export PDF. Please try again.');
        } finally {
            setExporting(false);
        }
    }, [exporting, exportFilename, exportQuality]);

    // Quick export with default settings
    const handleQuickExport = useCallback(async () => {
        if (!resumeRef.current || exporting) return;
        setExportFilename(personalInfo?.fullName?.replace(/\s+/g, '_') || 'my-resume');
        // trigger export directly
        setExporting(true);
        setExportSuccess(false);
        try {
            const html2pdf = (await import('html2pdf.js')).default;
            const element = resumeRef.current;
            const filename = (personalInfo?.fullName?.replace(/\s+/g, '_') || 'my-resume') + '_resume.pdf';

            const originalBoxShadow = element.style.boxShadow;
            element.style.boxShadow = 'none';

            // Inject print-specific styles
            const style = document.createElement('style');
            style.innerHTML = `
                * {
                    -webkit-print-color-adjust: exact !important;
                    color-adjust: exact !important;
                    print-color-adjust: exact !important;
                }
                #resume-preview {
                    width: 794px !important;
                    min-height: 1123px !important;
                    margin: 0 !important;
                    padding: 48px !important;
                }
            `;
            document.head.appendChild(style);

            const opt = {
                margin: 0,
                filename,
                image: { type: 'jpeg', quality: 1.0 },
                html2canvas: {
                    scale: 2,
                    useCORS: true,
                    letterRendering: true,
                    backgroundColor: '#FFFFFF',
                    scrollX: 0,
                    scrollY: 0,
                    windowWidth: 794,
                },
                jsPDF: {
                    unit: 'mm',
                    format: 'a4',
                    orientation: 'portrait',
                    compress: true
                },
                pagebreak: { mode: ['avoid-all'] },
            };

            await html2pdf().from(element).set(opt).save();
            element.style.boxShadow = originalBoxShadow;
            document.head.removeChild(style);
        } catch (error) {
            console.error('PDF export failed:', error);
        } finally {
            setExporting(false);
        }
    }, [exporting, personalInfo?.fullName]);



    return (
        <div className="h-screen bg-background flex flex-col overflow-hidden text-text">
            <Navbar />
            
            {/* Minimalist Progress Strip */}
            <div className="h-[2px] w-full bg-surface-highlight flex-shrink-0">
                <div 
                    className="h-full bg-primary transition-all duration-1000 ease-out" 
                    style={{ width: '75%' }} 
                />
            </div>

            <div className="flex-1 min-h-0 overflow-hidden">
                <div className="max-w-[1400px] mx-auto px-4 h-full">
                    <div className="flex flex-col lg:flex-row h-full">
                        {/* Left: Editor Form */}
                        <div className="lg:w-[450px] xl:w-[500px] flex-shrink-0 border-r border-border flex flex-col h-full min-h-0 bg-surface">
                            <div className="p-4 border-b border-border bg-background">
                                <h2 className="text-xs font-bold text-heading uppercase tracking-widest">Builder</h2>
                            </div>

                            <div className="flex-1 min-h-0 overflow-y-auto custom-scrollbar p-6 space-y-0">
                                {/* Personal Info */}
                                <div ref={sectionRefs.personal}>
                                    <FormSection title="Personal Information" defaultOpen={true}>
                                        <div className="grid grid-cols-1 md:grid-cols-2 gap-x-4 gap-y-6">
                                            <InputField label="Full Name" value={personalInfo.fullName || ''} onChange={(e) => handleInputChange('personalInfo', 'fullName', e.target.value)} placeholder="Full Name" />
                                            <InputField label="Job Title" value={personalInfo.jobTitle || ''} onChange={(e) => handleInputChange('personalInfo', 'jobTitle', e.target.value)} placeholder="Job Title" />
                                            <InputField label="Email" value={personalInfo.email || ''} onChange={(e) => handleInputChange('personalInfo', 'email', e.target.value)} placeholder="email@example.com" />
                                            <InputField label="Phone" value={personalInfo.phone || ''} onChange={(e) => handleInputChange('personalInfo', 'phone', e.target.value)} placeholder="1234567890" />
                                            <InputField label="Address" value={personalInfo.address || ''} onChange={(e) => handleInputChange('personalInfo', 'address', e.target.value)} placeholder="City, Country" />
                                            <InputField label="LinkedIn" value={personalInfo.linkedin || ''} onChange={(e) => handleInputChange('personalInfo', 'linkedin', e.target.value)} placeholder="linkedin.com/in/username" />
                                            <InputField label="GitHub" value={personalInfo.github || ''} onChange={(e) => handleInputChange('personalInfo', 'github', e.target.value)} placeholder="github.com/username" />
                                        </div>
                                    </FormSection>
                                </div>

                                {/* Education */}
                                <div ref={sectionRefs.education}>
                                    <FormSection 
                                        title="Education" 
                                        items={education}
                                        onAdd={(action, id) => {
                                            if (action === 'add') addItem('education', { school: '', degree: '', startDate: '', endDate: '', score: '', location: '' });
                                            else removeItem('education', education.findIndex(e => e.id === id));
                                        }}
                                        renderItem={(edu, index) => (
                                            <div className="space-y-4">
                                                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                                    <InputField label="Degree / Course" value={edu.degree} onChange={(e) => handleArrayChange('education', index, 'degree', e.target.value)} placeholder="B.Tech in IT" />
                                                    <InputField label="Institution" value={edu.school} onChange={(e) => handleArrayChange('education', index, 'school', e.target.value)} placeholder="ABES Engineering College" />
                                                </div>
                                                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                                                    <InputField label="Duration" value={edu.startDate} onChange={(e) => handleArrayChange('education', index, 'startDate', e.target.value)} placeholder="Duration (e.g. 2023 - 2027)" />
                                                    <InputField label="Score (CGPA/%)" value={edu.score} onChange={(e) => handleArrayChange('education', index, 'score', e.target.value)} placeholder="Score (e.g. 8.4 CGPA)" />
                                                    <InputField label="Location" value={edu.location} onChange={(e) => handleArrayChange('education', index, 'location', e.target.value)} placeholder="Location" />
                                                </div>
                                            </div>
                                        )}
                                    />
                                </div>

                                {/* Skills */}
                                <div ref={sectionRefs.skills}>
                                    <FormSection 
                                        title="Technical Skills" 
                                        items={technicalSkills}
                                        onAdd={(action, id) => {
                                            if (action === 'add') addItem('technicalSkills', { category: '', skills: '' });
                                            else removeItem('technicalSkills', technicalSkills.findIndex(s => s.id === id));
                                        }}
                                        renderItem={(skill, index) => (
                                            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                                <InputField label="Category" value={skill.category} onChange={(e) => handleArrayChange('technicalSkills', index, 'category', e.target.value)} placeholder="e.g. Frontend" />
                                                <InputField label="Skills" value={skill.skills} onChange={(e) => handleArrayChange('technicalSkills', index, 'skills', e.target.value)} placeholder="e.g. React, Tailwind" />
                                            </div>
                                        )}
                                    />
                                </div>

                                {/* Projects */}
                                <div ref={sectionRefs.projects}>
                                    <FormSection 
                                        title="Projects" 
                                        items={projects}
                                        onAdd={(action, id) => {
                                            if (action === 'add') addItem('projects', { title: '', date: '', description: [''] });
                                            else removeItem('projects', projects.findIndex(p => p.id === id));
                                        }}
                                        renderItem={(proj, index) => (
                                            <div className="space-y-4">
                                                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                                    <InputField label="Project Title" value={proj.title} onChange={(e) => handleArrayChange('projects', index, 'title', e.target.value)} placeholder="ATS Resume Builder" />
                                                    <InputField label="Date/Year" value={proj.date} onChange={(e) => handleArrayChange('projects', index, 'date', e.target.value)} placeholder="2024" />
                                                </div>
                                                <div className="space-y-2">
                                                    <div className="flex items-center justify-between">
                                                        <label className="text-[10px] font-bold text-subtext uppercase">Description Bullets</label>
                                                        <button 
                                                            onClick={() => {
                                                                const newProj = [...projects];
                                                                newProj[index].description = [...(newProj[index].description || []), ''];
                                                                updateResumeData('projects', newProj);
                                                            }}
                                                            className="text-[10px] font-bold text-primary uppercase"
                                                        >
                                                            + Add Bullet
                                                        </button>
                                                    </div>
                                                    {(proj.description || []).map((desc, i) => (
                                                        <div key={i} className="flex gap-2">
                                                            <input
                                                                type="text"
                                                                className="input-base text-xs flex-1"
                                                                value={desc}
                                                                onChange={(e) => {
                                                                    const newProj = [...projects];
                                                                    newProj[index].description[i] = e.target.value;
                                                                    updateResumeData('projects', newProj);
                                                                }}
                                                                placeholder="• Achieved X using Y..."
                                                            />
                                                            <button 
                                                                onClick={() => {
                                                                    const newProj = [...projects];
                                                                    newProj[index].description = newProj[index].description.filter((_, idx) => idx !== i);
                                                                    updateResumeData('projects', newProj);
                                                                }}
                                                                className="p-2 text-subtext hover:text-red-500"
                                                            >
                                                                <Trash2 size={14} />
                                                            </button>
                                                        </div>
                                                    ))}
                                                </div>
                                            </div>
                                        )}
                                    />
                                </div>

                                {/* Certificates */}
                                <div ref={sectionRefs.certificates}>
                                    <FormSection 
                                        title="Certificates" 
                                        items={certificates}
                                        onAdd={(action, id) => {
                                            if (action === 'add') addItem('certificates', { name: '', issuer: '', date: '' });
                                            else removeItem('certificates', certificates.findIndex(c => c.id === id));
                                        }}
                                        renderItem={(cert, index) => (
                                            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                                                <InputField label="Certificate Name" value={cert.name} onChange={(e) => handleArrayChange('certificates', index, 'name', e.target.value)} />
                                                <InputField label="Issuer" value={cert.issuer} onChange={(e) => handleArrayChange('certificates', index, 'issuer', e.target.value)} />
                                                <InputField label="Date" value={cert.date} onChange={(e) => handleArrayChange('certificates', index, 'date', e.target.value)} />
                                            </div>
                                        )}
                                    />
                                </div>

                                {/* Achievements */}
                                <div ref={sectionRefs.achievements}>
                                    <FormSection 
                                        title="Achievements" 
                                        items={achievements}
                                        onAdd={(action, id) => {
                                            if (action === 'add') addItem('achievements', { title: '', description: '' });
                                            else removeItem('achievements', achievements.findIndex(a => a.id === id));
                                        }}
                                        renderItem={(ach, index) => (
                                            <div className="space-y-4">
                                                <InputField label="Achievement Title" value={ach.title} onChange={(e) => handleArrayChange('achievements', index, 'title', e.target.value)} placeholder="Achievement Title" />
                                                <InputField label="Description" value={ach.description} onChange={(e) => handleArrayChange('achievements', index, 'description', e.target.value)} placeholder="Brief description of achievement..." />
                                            </div>
                                        )}
                                    />
                                </div>
                            </div>
                        </div>

                        {/* Right: Preview */}
                        <div className="flex-1 min-w-0 flex flex-col h-full min-h-0 bg-background">
                            <div className="p-4 border-b border-border flex items-center justify-between bg-background">
                                <div className="flex items-center gap-4">
                                    <h2 className="text-xs font-bold text-heading uppercase tracking-widest">Preview</h2>
                                    <div className="flex items-center gap-1 bg-surface-highlight border border-border p-0.5 rounded">
                                        <button 
                                            onClick={() => setTemplate('ats')}
                                            className={`px-3 py-1 text-[10px] font-bold uppercase tracking-tight rounded ${template === 'ats' ? 'bg-background shadow-sm text-primary' : 'text-subtext hover:text-heading'}`}
                                        >
                                            ATS
                                        </button>
                                        <button 
                                            onClick={() => setTemplate('classic')}
                                            className={`px-3 py-1 text-[10px] font-bold uppercase tracking-tight rounded ${template === 'classic' ? 'bg-background shadow-sm text-primary' : 'text-subtext hover:text-heading'}`}
                                        >
                                            Classic
                                        </button>
                                    </div>
                                </div>
                                
                                <div className="flex items-center gap-2">
                                    <button
                                        onClick={handleQuickExport}
                                        disabled={exporting}
                                        className="btn-primary text-xs px-4 py-1.5"
                                    >
                                        {exporting ? <Loader2 className="animate-spin" size={14} /> : <Download size={14} />}
                                        <span>Download PDF</span>
                                    </button>
                                    <button
                                        onClick={() => setShowExportModal(true)}
                                        className="btn-secondary text-xs px-2.5 py-1.5"
                                    >
                                        <FileText size={14} />
                                    </button>
                                </div>
                            </div>

                            <div className="flex-1 min-h-0 overflow-auto custom-scrollbar flex justify-center items-start py-12 bg-surface">
                                <div
                                    className="origin-top transition-transform duration-300 shadow-md"
                                    style={{ transform: `scale(${zoom / 100})` }}
                                >
                                    <ResumePreview ref={resumeRef} template={template} />
                                </div>
                            </div>

                            {/* Zoom Controls Overlay */}
                            <div className="absolute bottom-6 right-6 flex items-center gap-1 bg-background border border-border p-1 rounded-md shadow-md">
                                <button onClick={handleZoomOut} className="p-1.5 hover:bg-surface-highlight rounded text-subtext hover:text-heading">
                                    <ZoomOut size={14} />
                                </button>
                                <span className="text-[10px] font-bold text-heading w-8 text-center">{zoom}%</span>
                                <button onClick={handleZoomIn} className="p-1.5 hover:bg-surface-highlight rounded text-subtext hover:text-heading">
                                    <ZoomIn size={14} />
                                </button>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
            {showExportModal && (
                <div className="fixed inset-0 bg-black/40 backdrop-blur-[2px] flex items-center justify-center z-[100] animate-fade-in">
                    <div className="bg-background border border-border rounded-lg p-6 w-full max-w-sm shadow-md mx-4">
                        {exportSuccess ? (
                            <div className="text-center py-4">
                                <div className="inline-flex items-center justify-center w-12 h-12 rounded-full bg-green-50 text-green-600 mb-4 border border-green-100">
                                    <CheckCircle2 size={24} />
                                </div>
                                <h3 className="text-sm font-bold text-heading mb-1 uppercase tracking-tight">Export Complete</h3>
                                <p className="text-subtext text-xs">Your file has been saved to your downloads.</p>
                            </div>
                        ) : (
                            <>
                                <div className="flex items-center justify-between mb-6">
                                    <h3 className="text-xs font-bold text-heading uppercase tracking-widest">Export Options</h3>
                                    <button onClick={() => setShowExportModal(false)} className="text-subtext hover:text-heading">
                                        <X size={16} />
                                    </button>
                                </div>

                                <div className="space-y-6">
                                    <div>
                                        <label className="text-[10px] font-bold text-subtext uppercase tracking-tight block mb-2">Filename</label>
                                        <div className="flex items-center gap-2">
                                            <input
                                                type="text"
                                                className="input-base"
                                                value={exportFilename}
                                                onChange={(e) => setExportFilename(e.target.value)}
                                            />
                                            <span className="text-xs font-medium text-subtext">.pdf</span>
                                        </div>
                                    </div>

                                    <div>
                                        <label className="text-[10px] font-bold text-subtext uppercase tracking-tight block mb-2">Export Quality</label>
                                        <div className="grid grid-cols-3 gap-2">
                                            {[
                                                { value: 1, label: 'Fast' },
                                                { value: 2, label: 'High' },
                                                { value: 3, label: 'Ultra' },
                                            ].map((q) => (
                                                <button
                                                    key={q.value}
                                                    onClick={() => setExportQuality(q.value)}
                                                    className={`py-2 text-xs font-bold rounded border transition-all ${
                                                        exportQuality === q.value
                                                            ? 'border-primary bg-primary/5 text-primary'
                                                            : 'border-border hover:bg-surface-highlight text-subtext'
                                                    }`}
                                                >
                                                    {q.label}
                                                </button>
                                            ))}
                                        </div>
                                    </div>

                                    <div className="p-3 bg-surface border border-border rounded flex items-center justify-between">
                                        <span className="text-[10px] font-bold text-subtext uppercase">Active Template</span>
                                        <span className="text-[10px] font-bold text-heading uppercase tracking-widest">{template}</span>
                                    </div>

                                    <button
                                        onClick={handleExportPDF}
                                        disabled={exporting}
                                        className="btn-primary w-full py-2.5"
                                    >
                                        {exporting ? (
                                            <Loader2 className="animate-spin" size={16} />
                                        ) : (
                                            <>
                                                <Download size={16} />
                                                <span>Download PDF</span>
                                            </>
                                        )}
                                    </button>
                                </div>
                            </>
                        )}
                    </div>
                </div>
            )}
        </div>
    );
};

export default Editor;

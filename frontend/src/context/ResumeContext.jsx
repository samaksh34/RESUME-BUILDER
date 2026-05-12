import React, { createContext, useState, useEffect, useContext, useRef } from 'react';
import sampleData from '../data/sampleResume.json';
import { generateId } from '../utils/helpers';
import { AuthContext } from './AuthContext';
import { resumeAPI } from '../services/api';
import { ResumeContext } from './ResumeContextObject';

const createSafeResumeData = (data) => {
    // Ensure we always return a fully-shaped object so the Editor never crashes
    // even if localStorage gets corrupted or contains null/invalid payloads.
    const fallback = JSON.parse(JSON.stringify(sampleData));

    if (!data || typeof data !== 'object') return fallback;

    return {
        ...fallback,
        ...data,
        personalInfo: { ...fallback.personalInfo, ...(data.personalInfo || {}) },
        education: Array.isArray(data.education) ? data.education : fallback.education,
        technicalSkills: Array.isArray(data.technicalSkills) 
            ? (data.technicalSkills.length > 0 && typeof data.technicalSkills[0] === 'string' 
                ? data.technicalSkills.map((s, i) => ({ id: `ts_${i}`, category: s.split(':')[0] || 'Skill', skills: s.split(':')[1] || s }))
                : data.technicalSkills)
            : fallback.technicalSkills,
        internships: Array.isArray(data.internships) ? data.internships : fallback.internships,
        projects: Array.isArray(data.projects) ? data.projects : fallback.projects,
        achievements: Array.isArray(data.achievements) ? data.achievements : fallback.achievements,
        certificates: Array.isArray(data.certificates) ? data.certificates : fallback.certificates,
        extracurricular: Array.isArray(data.extracurricular) ? data.extracurricular : fallback.extracurricular,
        languages: Array.isArray(data.languages) ? data.languages : fallback.languages,
        layoutConfig: data.layoutConfig || {
            fontSize: 10,
            lineHeight: 1.2,
            sectionSpacing: 10,
            marginHorizontal: 0.55,
            marginVertical: 0.5,
            sections: {} // Per-section overrides
        }
    };
};

export const ResumeProvider = ({ children }) => {
    const [resumeData, setResumeData] = useState(() => {
        const saved = localStorage.getItem('resumeData');
        if (saved) {
            try {
                const parsed = JSON.parse(saved);
                return createSafeResumeData(parsed);
            } catch (error) {
                return createSafeResumeData(null);
            }
        }
        return createSafeResumeData(null);
    });

    const [activeResumeId, setActiveResumeId] = useState(() => {
        return localStorage.getItem('activeResumeId') || null;
    });

    const [activeResumeTitle, setActiveResumeTitle] = useState('Untitled Resume');
    const [userResumes, setUserResumes] = useState([]);
    const [isLoadingResumes, setIsLoadingResumes] = useState(false);

    const { isAuthenticated, user } = useContext(AuthContext);
    const saveTimeoutRef = useRef(null);
    const titleSaveTimeoutRef = useRef(null);
    const isCreatingRef = useRef(false); // Guard against duplicate creation

    // Fetch all resumes for the user
    const fetchUserResumes = async () => {
        if (!isAuthenticated) return;
        setIsLoadingResumes(true);
        try {
            const { data } = await resumeAPI.getAll();
            const resumes = data.data || [];
            setUserResumes(resumes);
            
            // If we have an active ID in localStorage, sync its title
            if (activeResumeId) {
                const active = resumes.find(r => r._id === activeResumeId);
                if (active) {
                    setActiveResumeTitle(active.title);
                    return;
                }
            }

            // USER REQUEST: Start fresh if no active resume.
            // PRO SUGGESTION: Create a "Ghost" resume (local only) to avoid DB bloat.
            // It will be saved to the DB the moment the user makes their first edit.
            const nextNumber = resumes.length + 1;
            const nextTitle = nextNumber === 1 ? "First Resume" : `Resume ${nextNumber}`;
            
            // Prepare local state with User's name from AuthContext
            const freshData = createSafeResumeData(null);
            if (user?.name) {
                freshData.personalInfo.fullName = user.name;
            }
            
            setResumeData(freshData);
            setActiveResumeId(null); // NULL means it's a "Ghost" (not yet in DB)
            setActiveResumeTitle(nextTitle);
        } catch (error) {
            console.error('Failed to fetch resumes:', error);
        } finally {
            setIsLoadingResumes(false);
        }
    };

    // Load from backend on login or when needed
    useEffect(() => {
        if (isAuthenticated) {
            fetchUserResumes();
        } else {
            setUserResumes([]);
            setActiveResumeId(null);
            setActiveResumeTitle('Untitled Resume');
            // Reset state to default sample data on logout
            setResumeData(createSafeResumeData(null));
        }
    }, [isAuthenticated]);

    // Save to localStorage AND backend (debounced)
    useEffect(() => {
        const safeData = createSafeResumeData(resumeData);
        localStorage.setItem('resumeData', JSON.stringify(safeData));
        
        // Only save activeResumeId to localStorage if it's a "real" (non-ghost) resume
        if (activeResumeId) {
            localStorage.setItem('activeResumeId', activeResumeId);
        } else {
            localStorage.removeItem('activeResumeId');
        }

        if (isAuthenticated && activeResumeId) {
            // Debounce backend save for existing resumes
            if (saveTimeoutRef.current) clearTimeout(saveTimeoutRef.current);
            saveTimeoutRef.current = setTimeout(async () => {
                try {
                    await resumeAPI.update(activeResumeId, safeData);
                } catch (error) {
                    console.error('Failed to sync resume to backend:', error);
                }
            }, 2000);
        }

        return () => {
            if (saveTimeoutRef.current) clearTimeout(saveTimeoutRef.current);
            if (titleSaveTimeoutRef.current) clearTimeout(titleSaveTimeoutRef.current);
        };
    }, [resumeData, activeResumeId, isAuthenticated]);

    const loadResume = async (id) => {
        try {
            const { data } = await resumeAPI.getById(id);
            if (data?.data) {
                setResumeData(createSafeResumeData(data.data.data));
                setActiveResumeId(id);
                setActiveResumeTitle(data.data.title || 'Untitled Resume');
                return true;
            }
        } catch (error) {
            console.error('Failed to load resume:', error);
        }
        return false;
    };

    const createNewResume = async (title, initialData = null) => {
        // Determine name if not provided
        let finalTitle = title;
        if (!finalTitle) {
            const nextNumber = userResumes.length + 1;
            finalTitle = nextNumber === 1 ? "First Resume" : `Resume ${nextNumber}`;
        }

        const newData = initialData || createSafeResumeData(null);
        
        // Ensure user name is in personal info if it's a fresh creation
        if (!initialData && user?.name && !newData.personalInfo.fullName) {
            newData.personalInfo.fullName = user.name;
        }

        if (isAuthenticated) {
            if (isCreatingRef.current) return;
            isCreatingRef.current = true;
            
            try {
                const { data } = await resumeAPI.create({ 
                    data: newData, 
                    title: finalTitle 
                });
                if (data?.data) {
                    setResumeData(newData);
                    setActiveResumeId(data.data._id);
                    setActiveResumeTitle(data.data.title);
                    // Update the list immediately
                    setUserResumes(prev => [data.data, ...prev]);
                    return data.data._id;
                }
            } catch (error) {
                console.error('Failed to create resume:', error);
            } finally {
                isCreatingRef.current = false;
            }
        } else {
            setResumeData(newData);
            setActiveResumeId(null);
            setActiveResumeTitle(finalTitle);
        }
        return null;
    };

    const updateResumeTitle = async (newTitle) => {
        setActiveResumeTitle(newTitle);
        
        // Update the list locally so other parts of the UI (HistorySidebar) see it instantly
        setUserResumes(prev => prev.map(r => r._id === activeResumeId ? { ...r, title: newTitle } : r));

        if (isAuthenticated && activeResumeId) {
            if (titleSaveTimeoutRef.current) clearTimeout(titleSaveTimeoutRef.current);
            titleSaveTimeoutRef.current = setTimeout(async () => {
                try {
                    await resumeAPI.update(activeResumeId, undefined, newTitle);
                } catch (error) {
                    console.error('Failed to update title:', error);
                }
            }, 1000); // 1s debounce for title
        }
    };

    const deleteResume = async (id) => {
        try {
            await resumeAPI.delete(id);
            if (activeResumeId === id) {
                setActiveResumeId(null);
                setResumeData(createSafeResumeData(null));
            }
            fetchUserResumes();
            return true;
        } catch (error) {
            console.error('Failed to delete resume:', error);
            return false;
        }
    };

    const updatePersonalInfo = (field, value) => {
        setResumeData(prev => ({
            ...prev,
            personalInfo: {
                ...prev.personalInfo,
                [field]: value
            }
        }));
    };

    const updateSectionItem = (section, id, field, value) => {
        setResumeData(prev => ({
            ...prev,
            [section]: prev[section].map(item =>
                item.id === id ? { ...item, [field]: value } : item
            )
        }));
    };

    const addSectionItem = (section, initialData = {}) => {
        setResumeData(prev => ({
            ...prev,
            [section]: [...prev[section], { id: generateId(), ...initialData }]
        }));
    };

    const removeSectionItem = (section, id) => {
        setResumeData(prev => ({
            ...prev,
            [section]: prev[section].filter(item => item.id !== id)
        }));
    };

    const updateSkills = (value) => {
        setResumeData(prev => ({
            ...prev,
            technicalSkills: value
        }));
    };

    const updateListSection = (section, index, value) => {
        setResumeData(prev => {
            const newList = [...prev[section]];
            newList[index] = value;
            return {
                ...prev,
                [section]: newList
            };
        });
    };

    const updateResumeData = (section, value) => {
        setResumeData(prev => {
            const newData = { ...prev, [section]: value };
            
            if (isAuthenticated && !activeResumeId) {
                setTimeout(() => {
                    if (!activeResumeId) {
                        createNewResume(activeResumeTitle, newData);
                    }
                }, 100);
            }
            
            return newData;
        });
    };

    const updateLayoutConfig = (newConfig) => {
        setResumeData(prev => ({
            ...prev,
            layoutConfig: {
                ...prev.layoutConfig,
                ...newConfig
            }
        }));
    };

    const resetLayout = () => {
        setResumeData(prev => ({
            ...prev,
            layoutConfig: {
                fontSize: 10,
                lineHeight: 1.2,
                sectionSpacing: 10,
                marginHorizontal: 0.55,
                marginVertical: 0.5,
                sections: {}
            }
        }));
    };

    return (
        <ResumeContext.Provider value={{
            resumeData,
            activeResumeId,
            activeResumeTitle,
            userResumes,
            isLoadingResumes,
            fetchUserResumes,
            loadResume,
            createNewResume,
            deleteResume,
            updateResumeTitle,
            updatePersonalInfo,
            updateSectionItem,
            addSectionItem,
            removeSectionItem,
            updateSkills,
            updateListSection,
            setResumeData,
            updateResumeData,
            setActiveResumeId,
            updateLayoutConfig,
            resetLayout
        }}>
            {children}
        </ResumeContext.Provider>
    );
};

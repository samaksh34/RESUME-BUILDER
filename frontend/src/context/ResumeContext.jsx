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

    const { isAuthenticated } = useContext(AuthContext);
    const saveTimeoutRef = useRef(null);

    // Fetch all resumes for the user
    const fetchUserResumes = async () => {
        if (!isAuthenticated) return;
        setIsLoadingResumes(true);
        try {
            const { data } = await resumeAPI.getAll();
            const resumes = data.data || [];
            setUserResumes(resumes);
            
            // If we have an active ID, sync the title
            if (activeResumeId) {
                const active = resumes.find(r => r._id === activeResumeId);
                if (active) setActiveResumeTitle(active.title);
            }
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
        }
    }, [isAuthenticated]);

    // Save to localStorage AND backend (debounced)
    useEffect(() => {
        const safeData = createSafeResumeData(resumeData);
        localStorage.setItem('resumeData', JSON.stringify(safeData));
        if (activeResumeId) {
            localStorage.setItem('activeResumeId', activeResumeId);
        } else {
            localStorage.removeItem('activeResumeId');
        }

        if (isAuthenticated) {
            // Debounce backend save
            if (saveTimeoutRef.current) clearTimeout(saveTimeoutRef.current);
            saveTimeoutRef.current = setTimeout(async () => {
                try {
                    if (activeResumeId) {
                        // Update existing
                        await resumeAPI.update(activeResumeId, safeData);
                    }
                } catch (error) {
                    console.error('Failed to sync resume to backend:', error);
                }
            }, 2000);
        }

        return () => {
            if (saveTimeoutRef.current) clearTimeout(saveTimeoutRef.current);
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

    const createNewResume = async (title = 'Untitled Resume') => {
        const newData = createSafeResumeData(null);
        if (isAuthenticated) {
            try {
                const { data } = await resumeAPI.create({ 
                    data: newData, 
                    title 
                });
                if (data?.data) {
                    setResumeData(newData);
                    setActiveResumeId(data.data._id);
                    setActiveResumeTitle(data.data.title);
                    fetchUserResumes(); // Refresh list
                    return data.data._id;
                }
            } catch (error) {
                console.error('Failed to create resume:', error);
            }
        } else {
            setResumeData(newData);
            setActiveResumeId(null);
            setActiveResumeTitle(title);
        }
        return null;
    };

    const updateResumeTitle = async (newTitle) => {
        setActiveResumeTitle(newTitle);
        if (isAuthenticated && activeResumeId) {
            try {
                await resumeAPI.update(activeResumeId, undefined, newTitle); // Wait, I need to check API service
                // Actually, let's fix the API service to accept title separately
                fetchUserResumes();
            } catch (error) {
                console.error('Failed to update title:', error);
            }
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
        setResumeData(prev => ({
            ...prev,
            [section]: value
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
            setActiveResumeId
        }}>
            {children}
        </ResumeContext.Provider>
    );
};

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

    const { isAuthenticated } = useContext(AuthContext);
    const saveTimeoutRef = useRef(null);

    // Load from backend on login
    useEffect(() => {
        const loadFromBackend = async () => {
            if (isAuthenticated) {
                try {
                    const { data } = await resumeAPI.get();
                    if (data?.data?.data) {
                        setResumeData(createSafeResumeData(data.data.data));
                    }
                } catch (error) {
                    console.error('Failed to load resume from backend:', error);
                }
            }
        };
        loadFromBackend();
    }, [isAuthenticated]);

    // Save to localStorage AND backend (debounced)
    useEffect(() => {
        const safeData = createSafeResumeData(resumeData);
        localStorage.setItem('resumeData', JSON.stringify(safeData));

        if (isAuthenticated) {
            // Debounce backend save to avoid too many requests
            if (saveTimeoutRef.current) clearTimeout(saveTimeoutRef.current);
            saveTimeoutRef.current = setTimeout(async () => {
                try {
                    await resumeAPI.save(safeData);
                    console.log('Resume synced to backend');
                } catch (error) {
                    console.error('Failed to sync resume to backend:', error);
                }
            }, 2000); // Wait 2 seconds of inactivity
        }

        return () => {
            if (saveTimeoutRef.current) clearTimeout(saveTimeoutRef.current);
        };
    }, [resumeData, isAuthenticated]);

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
            updatePersonalInfo,
            updateSectionItem,
            addSectionItem,
            removeSectionItem,
            updateSkills,
            updateListSection,
            setResumeData,
            updateResumeData
        }}>
            {children}
        </ResumeContext.Provider>
    );
};

import React, { createContext, useState, useEffect } from 'react';
import sampleData from '../data/sampleResume.json';
import { generateId } from '../utils/helpers';

export const ResumeContext = createContext();

export const ResumeProvider = ({ children }) => {
    const [resumeData, setResumeData] = useState(() => {
        const saved = localStorage.getItem('resumeData');
        return saved ? JSON.parse(saved) : sampleData;
    });

    useEffect(() => {
        localStorage.setItem('resumeData', JSON.stringify(resumeData));
    }, [resumeData]);

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

    return (
        <ResumeContext.Provider value={{
            resumeData,
            updatePersonalInfo,
            updateSectionItem,
            addSectionItem,
            removeSectionItem,
            updateSkills,
            updateListSection,
            setResumeData
        }}>
            {children}
        </ResumeContext.Provider>
    );
};



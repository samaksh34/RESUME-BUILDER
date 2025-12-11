import { useContext } from 'react';
import { ResumeContext } from '../context/ResumeContext';
import sampleData from '../data/sampleResume.json';

export const useResumeData = () => {
    const context = useContext(ResumeContext);

    // If the hook is used outside of a provider (unexpected),
    // return a safe fallback so the app doesn't crash with a white screen.
    if (!context) {
        return {
            resumeData: sampleData,
            updatePersonalInfo: () => {},
            updateSectionItem: () => {},
            addSectionItem: () => {},
            removeSectionItem: () => {},
            updateSkills: () => {},
            updateListSection: () => {},
            setResumeData: () => {},
            updateResumeData: () => {},
        };
    }

    return context;
};







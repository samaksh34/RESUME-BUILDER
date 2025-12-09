import { useContext } from 'react';
import { ResumeContext } from '../context/ResumeContext';

export const useResumeData = () => {
    const context = useContext(ResumeContext);
    if (!context) {
        throw new Error('useResumeData must be used within a ResumeProvider');
    }
    return context;
};



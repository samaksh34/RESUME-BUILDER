import React, { forwardRef } from 'react';
import { useResumeData } from '../hooks/useResumeData';
import ResumeRenderer from '../core/engine/ResumeRenderer';

const ResumePreview = forwardRef(({ template = 'ats-overleaf', data: propData, scale = 1 }, ref) => {
    const { resumeData: contextData } = useResumeData();
    const activeData = propData || contextData;

    return (
        <ResumeRenderer 
            ref={ref} 
            templateId={template} 
            data={activeData} 
            scale={scale} 
        />
    );
});

ResumePreview.displayName = 'ResumePreview';

export default ResumePreview;

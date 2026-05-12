/* 
  src/core/engine/TemplateRegistry.js 
  The centralized mapping for all available resume templates.
*/

import ATSOverleaf from '../../templates/ats-overleaf/ATSOverleaf';
import ModernTemplate from '../../templates/modern/ModernTemplate';
import ClassicTemplate from '../../templates/classic/ClassicTemplate';

export const TEMPLATE_REGISTRY = {
    'ats-overleaf': {
        name: 'ATS Overleaf (Flagship)',
        component: ATSOverleaf,
        config: {
            fontFamily: "'EB Garamond', serif",
            baseFontSize: '10pt',
            lineHeight: 1.25,
            sectionSpacing: '8pt',
            dividerWeight: '0.8pt',
            margins: '0.5in 0.55in 0.5in 0.55in',
        }
    },
    'modern': {
        name: 'Modern Professional',
        component: ModernTemplate,
        config: {
            fontFamily: "'Inter', sans-serif",
            baseFontSize: '10pt',
            lineHeight: 1.4,
            sectionSpacing: '16pt',
            margins: '0.75in',
        }
    },
    'classic': {
        name: 'Classic Serif',
        component: ClassicTemplate,
        config: {
            fontFamily: "'Source Serif Pro', serif",
            baseFontSize: '10.5pt',
            lineHeight: 1.3,
            sectionSpacing: '14pt',
            margins: '1in',
        }
    }
};

export const getTemplate = (id) => {
    return TEMPLATE_REGISTRY[id] || TEMPLATE_REGISTRY['ats-overleaf'];
};

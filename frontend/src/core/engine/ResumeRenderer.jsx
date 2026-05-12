import React, { forwardRef } from 'react';
import { getTemplate } from './TemplateRegistry';
import '../print/page.css';
import '../print/typography.css';

/**
 * ResumeRenderer
 * The master entry point for rendering any resume template.
 * Ensures all templates are wrapped in the global A4 engine.
 */
const ResumeRenderer = forwardRef(({ templateId = 'ats-overleaf', data, scale = 1 }, ref) => {
    const templateInfo = getTemplate(templateId);
    const { layoutConfig = {} } = data;

    // Merge template defaults with user layout overrides
    const mergedConfig = {
        ...templateInfo.config,
        baseFontSize: layoutConfig.fontSize ? `${layoutConfig.fontSize}pt` : templateInfo.config.baseFontSize,
        lineHeight: layoutConfig.lineHeight || templateInfo.config.lineHeight,
        sectionSpacing: layoutConfig.sectionSpacing ? `${layoutConfig.sectionSpacing}pt` : templateInfo.config.sectionSpacing,
        margins: (layoutConfig.marginVertical !== undefined && layoutConfig.marginHorizontal !== undefined)
            ? `${layoutConfig.marginVertical}in ${layoutConfig.marginHorizontal}in`
            : templateInfo.config.margins,
        sections: layoutConfig.sections || {}
    };

    const { component: TemplateComponent } = templateInfo;

    // Safety check for template data
    if (!data) return null;

    return (
        <div className="resume-renderer-container overflow-visible flex justify-center">
            <div 
                ref={ref}
                id="resume-preview"
                className="resume-page-root bg-white"
                style={{
                    transform: `scale(${scale})`,
                    transformOrigin: 'top center',
                    fontFamily: mergedConfig.fontFamily,
                    fontSize: mergedConfig.baseFontSize,
                    lineHeight: mergedConfig.lineHeight,
                    color: '#000',
                    padding: mergedConfig.margins, 
                    marginBottom: scale < 1 ? `-${(1 - scale) * 1123}px` : '0px', 
                }}
            >
                {TemplateComponent ? (
                    <TemplateComponent data={data} config={mergedConfig} />
                ) : (
                    <div className="flex items-center justify-center h-full text-subtext uppercase tracking-widest text-[10px]">
                        Template Engine Initializing: {templateInfo.name}
                    </div>
                )}
            </div>
        </div>
    );
});

ResumeRenderer.displayName = 'ResumeRenderer';

export default ResumeRenderer;

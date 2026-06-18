import * as aiService from '../services/aiService.js';

/**
 * Controller to analyze a resume against a target job description.
 */
export const handleAnalyzeResume = async (req, res, next) => {
    try {
        const { resumeData, jobDescription } = req.body;

        if (!jobDescription || typeof jobDescription !== 'string' || jobDescription.trim() === '') {
            return res.status(400).json({ 
                success: false, 
                message: 'Target Job Description is required for analysis.' 
            });
        }

        if (!resumeData) {
            return res.status(400).json({ 
                success: false, 
                message: 'Resume data is required for analysis.' 
            });
        }

        const analysis = await aiService.analyzeResume(resumeData, jobDescription);

        res.status(200).json({
            success: true,
            analysis
        });
    } catch (error) {
        if (error.message.includes('GEMINI_API_KEY')) {
            return res.status(400).json({
                success: false,
                isConfigError: true,
                message: 'Gemini API Key is not configured on the server. Please add GEMINI_API_KEY to your backend .env file to unlock AI features!'
            });
        }
        next(error);
    }
};

/**
 * Controller to optimize a single bullet point using the STAR method.
 */
export const handleOptimizeBullet = async (req, res, next) => {
    try {
        const { bulletPoint, jobDescription } = req.body;

        if (!bulletPoint || typeof bulletPoint !== 'string' || bulletPoint.trim() === '') {
            return res.status(400).json({ 
                success: false, 
                message: 'Bullet point content is required for optimization.' 
            });
        }

        const optimization = await aiService.optimizeBullet(bulletPoint, jobDescription || '');

        res.status(200).json({
            success: true,
            optimization
        });
    } catch (error) {
        if (error.message.includes('GEMINI_API_KEY')) {
            return res.status(400).json({
                success: false,
                isConfigError: true,
                message: 'Gemini API Key is not configured on the server. Please add GEMINI_API_KEY to your backend .env file to unlock AI features!'
            });
        }
        next(error);
    }
};

/**
 * Controller to generate a tailored cover letter and stream it via Server-Sent Events (SSE).
 */
export const handleGenerateCoverLetter = async (req, res, next) => {
    try {
        const { resumeData, jobDescription } = req.body;

        if (!jobDescription || typeof jobDescription !== 'string' || jobDescription.trim() === '') {
            return res.status(400).json({ 
                success: false, 
                message: 'Target Job Description is required to generate a cover letter.' 
            });
        }

        if (!resumeData) {
            return res.status(400).json({ 
                success: false, 
                message: 'Resume data is required to generate a cover letter.' 
            });
        }

        // Establish Server-Sent Events (SSE) connection headers
        res.setHeader('Content-Type', 'text/event-stream');
        res.setHeader('Cache-Control', 'no-cache');
        res.setHeader('Connection', 'keep-alive');
        
        // Handle client connection close
        req.on('close', () => {
            res.end();
        });

        const stream = await aiService.generateCoverLetterStream(resumeData, jobDescription);
        
        for await (const chunk of stream.stream) {
            const chunkText = chunk.text();
            res.write(`data: ${JSON.stringify({ chunk: chunkText })}\n\n`);
        }

        res.write('data: [DONE]\n\n');
        res.end();
    } catch (error) {
        console.error('SSE Cover Letter streaming failed:', error);
        
        // SSE error protocol
        if (error.message.includes('GEMINI_API_KEY')) {
            res.write(`data: ${JSON.stringify({ 
                error: 'Gemini API Key is not configured on the server. Please add GEMINI_API_KEY to your backend .env file.' 
            })}\n\n`);
        } else {
            res.write(`data: ${JSON.stringify({ error: error.message })}\n\n`);
        }
        res.end();
    }
};

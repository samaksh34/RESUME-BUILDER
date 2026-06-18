import { GoogleGenerativeAI } from '@google/generative-ai';

// Initialize Gemini client lazily to prevent server crashes if API key is missing on start
let genAI = null;
const getGenAI = () => {
    const apiKey = process.env.GEMINI_API_KEY;
    if (!apiKey) {
        throw new Error('GEMINI_API_KEY is not configured. Please add it to your backend .env file.');
    }
    if (!genAI) {
        genAI = new GoogleGenerativeAI(apiKey);
    }
    return genAI;
};

/**
 * Helper to retry API calls on transient 503 Service Unavailable errors.
 */
const callWithRetry = async (apiCallFn, retries = 2, delayMs = 1000) => {
    try {
        return await apiCallFn();
    } catch (error) {
        const isTransient = 
            error.message?.includes('503') || 
            error.message?.includes('Service Unavailable') || 
            error.message?.includes('overloaded') ||
            error.status === 503;
            
        if (isTransient && retries > 0) {
            console.warn(`⚠️ [Gemini API] 503 Service Unavailable. Retrying in ${delayMs}ms... (${retries} attempts remaining)`);
            await new Promise(resolve => setTimeout(resolve, delayMs));
            return callWithRetry(apiCallFn, retries - 1, delayMs * 2);
        }
        throw error;
    }
};

/**
 * Analyzes resume data against a target job description and returns structured JSON analysis.
 */
export const analyzeResume = async (resumeData, jobDescription) => {
    const ai = getGenAI();
    const model = ai.getGenerativeModel({ 
        model: 'gemini-2.5-flash',
        generationConfig: {
            responseMimeType: 'application/json'
        }
    });

    const prompt = `
You are an expert ATS (Applicant Tracking System) parser and technical recruiter. 
Analyze the candidate's resume data against the target job description. 
Perform a semantic comparison of skills and experience. Look for direct skill matches, missing keywords, and semantic synonyms (e.g. if the job description mentions "building REST APIs" and the resume has "Express backend endpoints", this is a semantic synonym).

Resume Data:
${JSON.stringify(resumeData, null, 2)}

Target Job Description:
${jobDescription}

Provide the analysis strictly matching this JSON schema structure:
{
  "score": number (0-100 rating of how well this resume aligns with the job description),
  "matchedKeywords": string[] (important skills/keywords from the job description found in the resume),
  "missingKeywords": string[] (crucial keywords/skills from the job description completely missing in the resume),
  "semanticSynonyms": Array of objects:
    {
      "jobRequirement": string (the term/phrase in the job description),
      "resumeMatch": string (the equivalent term/phrase found in the resume),
      "explanation": string (brief explanation of why this counts as a semantic match)
    },
  "recommendations": string[] (3-5 highly actionable, concrete bullet points on what to add, delete, or rephrase to improve compatibility)
}
`;

    const result = await callWithRetry(() => model.generateContent(prompt));
    const text = result.response.text();
    return JSON.parse(text);
};


/**
 * Optimizes a single bullet point using the STAR method (Situation, Task, Action, Result) with metrics.
 */
export const optimizeBullet = async (bulletPoint, jobDescription = '') => {
    const ai = getGenAI();
    const model = ai.getGenerativeModel({
        model: 'gemini-2.5-flash',
        generationConfig: {
            responseMimeType: 'application/json'
        }
    });

    const prompt = `
You are a career coach helping an engineer optimize their resume bullet points.
Take the following resume bullet point and rewrite it into exactly 3 professional variations using the STAR methodology (Situation, Task, Action, Result).
Ensure each variation uses strong active power verbs (e.g., Spearheaded, Orchestrated, Optimized) and integrates realistic, simulated metrics (such as percentage improvements, latency reductions, time saved, or team efficiency gains) that fit the context.

Original Bullet Point:
"${bulletPoint}"

Target Job Description Context (if provided, align the terms/skills to it):
"${jobDescription}"

Provide your output strictly in JSON following this schema:
{
  "metricFocused": {
    "text": "variation concentrating on quantifiable results/efficiency metrics",
    "explanation": "Brief breakdown of the STAR components used here."
  },
  "actionFocused": {
    "text": "variation highlighting leadership, technical architecture, and problem-solving skills",
    "explanation": "Brief breakdown of the action verbs and technology ownership here."
  },
  "concise": {
    "text": "a shorter, punchier version optimized for high density and quick scanning",
    "explanation": "Brief breakdown of why this is high impact."
  }
}
`;

    const result = await callWithRetry(() => model.generateContent(prompt));
    const text = result.response.text();
    return JSON.parse(text);
};


/**
 * Generates a tailored cover letter stream. Returns the streaming object.
 */
export const generateCoverLetterStream = async (resumeData, jobDescription) => {
    const ai = getGenAI();
    const model = ai.getGenerativeModel({ model: 'gemini-2.5-flash' });

    const prompt = `
You are an expert technical resume writer. Write a compelling, highly professional cover letter tailored to the target job description based on the candidate's resume data.

Candidate Resume Data:
${JSON.stringify(resumeData, null, 2)}

Target Job Description:
${jobDescription}

Writing Guidelines:
- Keep the cover letter to 3-4 paragraphs.
- Be professional, eager, and directly address requirements mentioned in the job description using specifics from the candidate's projects/experience.
- Format the cover letter in clean markdown (with headings, paragraphs, and lists if appropriate). Do not include address blocks; start directly with the salutation.
`;

    const resultStream = await callWithRetry(() => model.generateContentStream(prompt));
    return resultStream;
};


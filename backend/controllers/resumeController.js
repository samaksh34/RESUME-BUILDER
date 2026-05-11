import Resume from '../models/Resume.js';
import chromium from '@sparticuz/chromium';
import { chromium as playwright } from 'playwright-core';

/**
 * @desc    Export resume as PDF using Playwright
 * @route   POST /api/resumes/export
 * @access  Public (or Private if you want to restrict)
 */
export const exportPDF = async (req, res, next) => {
    let browser = null;
    try {
        const { html } = req.body;

        if (!html) {
            return res.status(400).json({
                success: false,
                message: 'HTML content is required',
            });
        }

        // 1. Launch Browser (optimized for serverless)
        const isProd = process.env.NODE_ENV === 'production' || !!process.env.VERCEL;
        
        browser = await playwright.launch({
            args: isProd ? chromium.args : [],
            executablePath: isProd ? await chromium.executablePath() : undefined,
            headless: isProd ? chromium.headless : true,
        });

        const context = await browser.newContext();
        const page = await context.newPage();

        // 2. Set content and wait for it to render
        await page.setContent(html, { 
            waitUntil: 'networkidle',
            timeout: 8000 // 8s timeout for rendering
        });

        // 3. Generate PDF
        const pdfBuffer = await page.pdf({
            format: 'A4',
            printBackground: true,
            margin: { top: '0px', right: '0px', bottom: '0px', left: '0px' },
            displayHeaderFooter: false,
            preferCSSPageSize: true
        });

        // 4. Clean up
        await browser.close();

        // 5. Send PDF
        res.setHeader('Content-Type', 'application/pdf');
        res.setHeader('Content-Disposition', 'attachment; filename=resume.pdf');
        res.send(pdfBuffer);

    } catch (error) {
        console.error('PDF Export Error:', error);
        if (browser) await browser.close();
        res.status(500).json({
            success: false,
            message: 'Failed to generate PDF. Please try again.',
            error: error.message
        });
    }
};

/**
 * @desc    Get all user resumes
 * @route   GET /api/resumes
 * @access  Private
 */
export const getResumes = async (req, res, next) => {
    try {
        const resumes = await Resume.find({ user: req.user._id }).sort({ updatedAt: -1 });
        
        res.status(200).json({
            success: true,
            count: resumes.length,
            data: resumes,
        });
    } catch (error) {
        next(error);
    }
};

/**
 * @desc    Get specific resume by ID
 * @route   GET /api/resumes/:id
 * @access  Private
 */
export const getResumeById = async (req, res, next) => {
    try {
        const resume = await Resume.findOne({ _id: req.params.id, user: req.user._id });

        if (!resume) {
            return res.status(404).json({
                success: false,
                message: 'Resume not found',
            });
        }

        res.status(200).json({
            success: true,
            data: resume,
        });
    } catch (error) {
        next(error);
    }
};

/**
 * @desc    Create a new resume
 * @route   POST /api/resumes
 * @access  Private
 */
export const createResume = async (req, res, next) => {
    try {
        const { data, title } = req.body;

        if (!data) {
            return res.status(400).json({
                success: false,
                message: 'Resume data is required',
            });
        }

        const resume = await Resume.create({
            user: req.user._id,
            data,
            title: title || 'Untitled Resume',
        });

        res.status(201).json({
            success: true,
            message: 'Resume created successfully',
            data: resume,
        });
    } catch (error) {
        next(error);
    }
};

/**
 * @desc    Update a resume
 * @route   PUT /api/resumes/:id
 * @access  Private
 */
export const updateResume = async (req, res, next) => {
    try {
        const { data, title } = req.body;
        
        let resume = await Resume.findOne({ _id: req.params.id, user: req.user._id });

        if (!resume) {
            return res.status(404).json({
                success: false,
                message: 'Resume not found',
            });
        }

        if (data) resume.data = data;
        if (title) resume.title = title;
        
        await resume.save();

        res.status(200).json({
            success: true,
            message: 'Resume updated successfully',
            data: resume,
        });
    } catch (error) {
        next(error);
    }
};

/**
 * @desc    Delete a resume
 * @route   DELETE /api/resumes/:id
 * @access  Private
 */
export const deleteResume = async (req, res, next) => {
    try {
        const resume = await Resume.findOneAndDelete({ _id: req.params.id, user: req.user._id });

        if (!resume) {
            return res.status(404).json({
                success: false,
                message: 'Resume not found',
            });
        }

        res.status(200).json({
            success: true,
            message: 'Resume deleted successfully',
        });
    } catch (error) {
        next(error);
    }
};

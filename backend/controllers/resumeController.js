import Resume from '../models/Resume.js';

/**
 * @desc    Get user's resume
 * @route   GET /api/resumes
 * @access  Private
 */
export const getResume = async (req, res, next) => {
    try {
        const resume = await Resume.findOne({ user: req.user._id }).sort({ updatedAt: -1 });
        
        if (!resume) {
            return res.status(200).json({
                success: true,
                data: null,
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
 * @desc    Save or update user's resume
 * @route   POST /api/resumes
 * @access  Private
 */
export const saveResume = async (req, res, next) => {
    try {
        const { data, title } = req.body;

        if (!data) {
            return res.status(400).json({
                success: false,
                message: 'Resume data is required',
            });
        }

        // We only support one resume per user for now
        let resume = await Resume.findOne({ user: req.user._id });

        if (resume) {
            resume.data = data;
            if (title) resume.title = title;
            await resume.save();
        } else {
            resume = await Resume.create({
                user: req.user._id,
                data,
                title: title || 'My Resume',
            });
        }

        res.status(200).json({
            success: true,
            message: 'Resume saved successfully',
            data: resume,
        });
    } catch (error) {
        next(error);
    }
};

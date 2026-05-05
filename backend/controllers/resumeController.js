import Resume from '../models/Resume.js';

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

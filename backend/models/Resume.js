import mongoose from 'mongoose';

const resumeSchema = new mongoose.Schema(
    {
        user: {
            type: mongoose.Schema.Types.ObjectId,
            ref: 'User',
            required: true,
        },
        data: {
            type: Object,
            required: true,
        },
        title: {
            type: String,
            default: 'My Resume',
        },
        isLastModified: {
            type: Boolean,
            default: true,
        }
    },
    {
        timestamps: true,
    }
);

// Index to quickly find a user's resumes
resumeSchema.index({ user: 1 });

const Resume = mongoose.model('Resume', resumeSchema);

export default Resume;

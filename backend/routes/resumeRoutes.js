import express from 'express';
import { protect } from '../middleware/auth.js';
import { 
    getResumes, 
    getResumeById, 
    createResume, 
    updateResume, 
    deleteResume 
} from '../controllers/resumeController.js';

const router = express.Router();

// All resume routes are protected
router.use(protect);

router.get('/', getResumes);
router.get('/:id', getResumeById);
router.post('/', createResume);
router.put('/:id', updateResume);
router.delete('/:id', deleteResume);

export default router;

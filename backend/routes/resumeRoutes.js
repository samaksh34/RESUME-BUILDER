import express from 'express';
import { protect } from '../middleware/auth.js';
import { 
    getResumes, 
    getResumeById, 
    createResume, 
    updateResume, 
    deleteResume,
    exportPDF
} from '../controllers/resumeController.js';

const router = express.Router();

// Publicly accessible export (optional, but usually protected)
router.post('/export', exportPDF);

// All other resume routes are protected
router.use(protect);

router.get('/', getResumes);
router.get('/:id', getResumeById);
router.post('/', createResume);
router.put('/:id', updateResume);
router.delete('/:id', deleteResume);

export default router;

import express from 'express';
import { protect } from '../middleware/auth.js';
import { getResume, saveResume } from '../controllers/resumeController.js';

const router = express.Router();

// All resume routes are protected
router.use(protect);

router.get('/', getResume);
router.post('/', saveResume);

export default router;

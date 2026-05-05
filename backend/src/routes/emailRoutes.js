import express from 'express';
import protect from '../middleware/protect.js';
import emailController from '../controllers/emailController.js';

const router = express.Router();

router.post('/send', protect, emailController.sendCheckIns);

export default router;

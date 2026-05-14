import express from 'express';
import protect from '../middleware/protect.js';
import authController from '../controllers/authController.js';

const router = express.Router();

router.post('/register', authController.register);
router.post('/login', authController.login);
router.get('/logout', protect, authController.logout);
router.get('/authcheck', protect, authController.authcheck);

export default router;

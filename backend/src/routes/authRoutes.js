import express from 'express';
import rateLimit from 'express-rate-limit';
import protect from '../middleware/protect.js';
import authController from '../controllers/authController.js';

const authLimiter = rateLimit({
  windowMs: 15 * 60 * 1000,
  max: 10,
  message: { message: 'Too many login attempts. Please wait and try again.' }
});

const router = express.Router();

router.post('/login', authLimiter, authController.login);
router.get('/logout', protect, authController.logout);
router.get('/authcheck', protect, authController.authcheck);

export default router;

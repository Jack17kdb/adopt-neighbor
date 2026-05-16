import express from 'express';
import rateLimit from 'express-rate-limit';
import mpesaController from '../controllers/mpesaController.js';
import protect from '../middleware/protect.js';
import admin from '../middleware/admin.js';

const stkLimiter = rateLimit({
  windowMs: 60 * 1000,
  max: 3,
  message: { message: 'Too many payment requests. Please wait a moment.' }
});

const router = express.Router();

router.post('/stk-push', stkLimiter, mpesaController.stkPush);

router.post('/callback', mpesaController.mpesaCallback);
router.post('/b2c-result', mpesaController.b2cResult);
router.post('/b2c-timeout', mpesaController.b2cTimeout);

router.get('/balance', protect, admin, mpesaController.getBalance);
router.post('/withdraw', protect, admin, mpesaController.withdraw);

export default router;

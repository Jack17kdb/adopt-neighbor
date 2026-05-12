import express from 'express';
import mpesaController from '../controllers/mpesaController.js';
import protect from '../middleware/protect.js';
import admin from '../middleware/admin.js';

const router = express.Router();

// Public — volunteer contributes
router.post('/stk-push', mpesaController.stkPush);

// Public — Safaricom callbacks (must be reachable by Safaricom servers)
router.post('/callback', mpesaController.mpesaCallback);
router.post('/b2c-result', mpesaController.b2cResult);
router.post('/b2c-timeout', mpesaController.b2cTimeout);

// Admin only — view balance & transactions, initiate withdrawal
router.get('/balance', protect, admin, mpesaController.getBalance);
router.post('/withdraw', protect, admin, mpesaController.withdraw);

export default router;

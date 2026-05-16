import express from 'express';
import paypalController from '../controllers/paypalController.js';

const router = express.Router();

// Public — frontend calls these via PayPal SDK hooks
router.post('/create-order', paypalController.createOrder);
router.post('/capture-order/:orderID', paypalController.captureOrder);

export default router;

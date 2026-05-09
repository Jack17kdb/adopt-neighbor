import express from 'express';
import mpesaController from '../controllers/mpesaController.js';

const router = express.Router();

router.post('/stk-push', mpesaController.stkPush);
router.post('/callback', mpesaController.mpesaCallback);

export default router;

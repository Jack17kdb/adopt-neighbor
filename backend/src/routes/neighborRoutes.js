import express from 'express';
import neighborController from '../controllers/neighborController.js';

const router = express.Router();

router.post('/', neighborController.createNeighbor);

export default router;

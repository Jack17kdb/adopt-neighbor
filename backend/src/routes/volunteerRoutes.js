import express from 'express';
import volunteerController from '../controllers/volunteerController.js';

const router = express.Router();

router.post('/', volunteerController.createVolunteer);

export default router;

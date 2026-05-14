import express from 'express';
import protect from '../middleware/protect.js';
import admin from '../middleware/admin.js';
import adminController from '../controllers/adminController.js';

const router = express.Router();

router.get('/staff', protect, admin, adminController.getStaffMembers);
router.post('/staff', protect, admin, adminController.addStaffMember);
router.get('/volunteers', protect, adminController.getVolunteers);
router.get('/neighbors', protect, adminController.getNeighbors);
router.get('/staff/:staffId', protect, admin, adminController.getStaffMember);
router.get('/volunteers/:volunteerId', protect, adminController.getVolunteer);
router.get('/neighbors/:neighborId', protect, adminController.getNeighbor);

export default router;

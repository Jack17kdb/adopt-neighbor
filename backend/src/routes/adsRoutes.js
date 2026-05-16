import express from 'express';
import multer from 'multer';
import protect from '../middleware/protect.js';
import admin from '../middleware/admin.js';
import adsController from '../controllers/adsController.js';

const upload = multer({ storage: multer.memoryStorage(), limits: { fileSize: 5 * 1024 * 1024 } });

const router = express.Router();

// Public — get active ads for a placement
router.get('/', adsController.getAds);

// Admin only — manage ads
router.post('/', protect, admin, upload.single('image'), adsController.createAd);
router.patch('/:id/toggle', protect, admin, adsController.toggleAd);
router.delete('/:id', protect, admin, adsController.deleteAd);

export default router;

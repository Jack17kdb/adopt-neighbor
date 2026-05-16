import express from 'express';
import multer from 'multer';
import protect from '../middleware/protect.js';
import admin from '../middleware/admin.js';
import adsController from '../controllers/adsController.js';

const ALLOWED_MIME_TYPES = ['image/jpeg', 'image/jpg', 'image/png', 'image/webp', 'image/gif'];

const fileFilter = (req, file, cb) => {
  if (ALLOWED_MIME_TYPES.includes(file.mimetype)) {
    cb(null, true);
  } else {
    cb(new Error(`Invalid file type "${file.mimetype}". Only JPEG, PNG, WebP and GIF images are allowed.`), false);
  }
};

const upload = multer({
  storage: multer.memoryStorage(),
  limits: { fileSize: 5 * 1024 * 1024 },
  fileFilter,
});

const router = express.Router();

// Public — get active ads for a placement
router.get('/', adsController.getAds);

// Admin only — manage ads
router.post('/', protect, admin, upload.single('image'), adsController.createAd);
router.patch('/:id/toggle', protect, admin, adsController.toggleAd);
router.delete('/:id', protect, admin, adsController.deleteAd);

// Handle multer errors (file type / size) before they bubble as 500s
router.use((err, req, res, next) => {
  if (err instanceof multer.MulterError) {
    if (err.code === 'LIMIT_FILE_SIZE') {
      return res.status(400).json({ message: 'File too large. Maximum size is 5MB.' });
    }
    return res.status(400).json({ message: err.message });
  }
  if (err && err.message) {
    return res.status(400).json({ message: err.message });
  }
  next(err);
});

export default router;

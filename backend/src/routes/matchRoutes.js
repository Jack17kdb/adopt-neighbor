import express from 'express';
import protect from '../middleware/protect.js';
import matchController from '../controllers/matchController.js';

const router = express.Router();

router.post('/', protect, matchController.createMatch);
router.get('/', protect, matchController.getMatches);
router.post('/confirm-volunteer', protect, matchController.confirmVolunteer);
router.post('/confirm-neighbor', protect, matchController.confirmNeighbor);
router.put('/rematch/:matchId', protect, matchController.rematch);

export default router;

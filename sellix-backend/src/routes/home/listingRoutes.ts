import { Router } from 'express';
import { getMyListings } from '../../controllers/listingController';
import { verifyToken } from '../../middlewares/authMiddleware';

const router = Router();

router.get('/listing/userId', verifyToken, getMyListings);

export default router;
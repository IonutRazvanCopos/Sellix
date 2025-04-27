import { Router } from 'express';
import { registerUser, loginUser, getMe, updateProfile, getMyListings } from '../controllers/authController';
import { verifyToken } from '../middlewares/authMiddleware';
import prisma from '../config/prisma';

const router = Router();

router.post('/register', registerUser);
router.post('/login', loginUser);
router.get('/profile', verifyToken, getMe);
router.put('/update-profile', verifyToken, updateProfile);
router.get('/my-listings', verifyToken, getMyListings);

export default router;
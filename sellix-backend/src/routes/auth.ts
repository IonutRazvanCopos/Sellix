import { Router } from 'express';
import { registerUser, loginUser, getMe } from '../controllers/authController';
import { verifyToken } from '../middlewares/authMiddleware';

const router = Router();

router.post('/register', registerUser);
router.post('/login', loginUser);
router.get('/me', verifyToken, getMe);

export default router;
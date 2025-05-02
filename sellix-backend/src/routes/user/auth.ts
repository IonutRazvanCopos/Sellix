import { Router } from 'express';
import { registerUser, loginUser, getMe, updateProfile } from '../../controllers/authController';
import { verifyToken } from '../../middlewares/authMiddleware';

const router = Router();

router.post('/user/register', registerUser);
router.post('/user/login', loginUser);
router.get('/user/profile', verifyToken, getMe);
router.put('/update', verifyToken, updateProfile);

export default router;
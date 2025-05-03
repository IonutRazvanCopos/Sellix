import { Router } from 'express';
import { register, login, getMe, updateProfile } from '../../controllers/userController';
import { verifyToken } from '../../middlewares/authMiddleware';

const router = Router();

router.post('/user/register', register);
router.post('/user/login', login);
router.get('/user/profile', verifyToken, getMe);
router.put('/update', verifyToken, updateProfile);

export default router;
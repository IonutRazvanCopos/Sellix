import { Router } from 'express';
import { registerUser, loginUser } from '../controllers/authController';
import { verifyToken } from '../middlewares/authMiddleware';
import prisma from '../config/prisma';

const router = Router();

router.post('/register', registerUser);
router.post('/login', loginUser);

router.get('/me', verifyToken, async (req: any, res) => {
    try {
      const userId = req.user.userId;
  
      const user = await prisma.user.findUnique({
        where: { id: userId },
        select: {
          id: true,
          email: true,
          createdAt: true
        }
      });
  
      if (!user) {
        return res.status(404).json({ message: 'Utilizator inexistent.' });
      }
  
      res.status(200).json({ user });
    } catch (error) {
      console.error(error);
      res.status(500).json({ message: 'Eroare internă.' });
    }
  });  

export default router;
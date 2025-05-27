import express from 'express';
import { PrismaClient } from '@prisma/client';

const router = express.Router();
const prisma = new PrismaClient();

router.get('/:id', async (req, res) => {
  const userId = parseInt(req.params.id);
  try {
    const user = await prisma.user.findUnique({
      where: { id: userId },
      select: {
        username: true,
        city: true,
        county: true,
        avatar: true,
        listings: {
          select: { id: true, title: true, description: true, price: true, currency: true, createdAt: true, images: { select: { url: true } } },
          orderBy: { createdAt: 'desc' }
        }
      }
    });
    if (!user) return res.status(404).json({ message: 'User not found' });
    res.json(user);
  } catch (err) {
    console.error('Error:', err);
    res.status(500).json({ message: 'Internal server error' });
  }
});

export default router;
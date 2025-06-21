import express from 'express';
import { PrismaClient } from '@prisma/client';

const router = express.Router();
const prisma = new PrismaClient();

router.get('/', async (_req, res) => {
  try {
    const categories = await prisma.category.findMany({
      include: { subcategories: true },
      orderBy: { name: 'asc' },
    });
    res.json(categories);
  } catch (error) {
    console.error('Error fetching categories:', error);
    res.status(500).json({ message: 'Could not fetch categories' });
  }
});

router.get('/:id/subcategories', async (req, res) => {
  const categoryId = parseInt(req.params.id);
  try {
    const subcategories = await prisma.subcategory.findMany({
      where: { categoryId },
    });
    res.json(subcategories);
  } catch (error) {
    res.status(500).json({ message: 'Error fetching subcategories' });
  }
});


export default router;

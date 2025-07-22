import express from 'express';
import { PrismaClient } from '@prisma/client';
import { AuthRequest, verifyToken } from '../../middlewares/authMiddleware';
import { createListing, getMyListings } from '../../controllers/listingController';

const router = express.Router();
const prisma = new PrismaClient();

router.get('/', async (req, res) => {
  try {
    const listings = await prisma.listing.findMany({
      where: {
        approved: true,
        visible: true,
      },
      include: {
        user: {
          select: { username: true, id: true, avatar: true },
        },
        category: {
          select: { name: true },
        },
        subcategory: {
          select: { name: true },
        },
        images: true,
      },
      orderBy: { createdAt: 'desc' },
    });

    res.json(listings);
  } catch (error) {
    console.error('Error fetching listings:', error);
    res.status(500).json({ message: 'Something went wrong' });
  }
});


router.get('/profile', verifyToken, async (req: AuthRequest, res) => {
  try {
    const listings = await prisma.listing.findMany({
      where: {
        userId: req.user!.userId,
      },
      include: {
        category: { select: { name: true } },
      },
      orderBy: { createdAt: 'desc' },
    });

    res.json(listings);
  } catch (error) {
    console.error('Error fetching user listings:', error);
    res.status(500).json({ message: 'Something went wrong.' });
  }
});

router.post('/', verifyToken, async (req: AuthRequest, res) => {
  const { title, description, price, currency, type, categoryId, subcategoryId } = req.body;
  const files = req.files?.images;

  if (!title || !description || !price || !currency || !type || !categoryId) {
    return res.status(400).json({ message: 'All fields are required.' });
  }

  try {
    const newListing = await prisma.listing.create({
      data: {
        title,
        description,
        price: Number(price),
        currency,
        type,
        categoryId: Number(categoryId),
        subcategoryId: subcategoryId ? Number(subcategoryId) : null,
        userId: req.user!.userId
      },
    });

    if (files) {
      const imagesArray = Array.isArray(files) ? files : [files];

      for (const img of imagesArray) {
        const filename = `${Date.now()}_${img.name}`;
        const path = `public/uploads/${filename}`;
        await img.mv(path);

        await prisma.image.create({
          data: {
            url: `/uploads/${filename}`,
            listingId: newListing.id,
          },
        });
      }
    }

    res.status(201).json({ message: 'Listing created', listingId: newListing.id });
  } catch (error) {
    console.error('Error creating listing:', error);
    res.status(500).json({ message: 'Failed to create listing.' });
  }
});

router.get('/:id', async (req, res) => {
  const { id } = req.params;
  try {
    const listing = await prisma.listing.findUnique({
      where: { id: Number(id) },
      include: {
        user: { select: { username: true, id: true, avatar: true } },
        category: true,
        subcategory: true,
        images: true,
      },
    });

    if (!listing) return res.status(404).json({ message: 'Listing not found' });
    res.json(listing);
  } catch (error) {
    res.status(500).json({ message: 'Something went wrong' });
  }
});


router.put('/:id', verifyToken, async (req: AuthRequest, res) => {
  const listingId = parseInt(req.params.id);
  const { title, description, price, currency, type, categoryId, subcategoryId } = req.body;

  try {
    const existingListing = await prisma.listing.findUnique({ where: { id: listingId } });

    if (!existingListing || existingListing.userId !== req.user!.userId) {
      return res.status(403).json({ message: 'Not authorized' });
    }

    const updatedListing = await prisma.listing.update({
      where: { id: listingId },
      data: {
        title,
        description,
        price: Number(price),
        currency,
        type,
        categoryId: Number(categoryId),
        subcategoryId: subcategoryId ? Number(subcategoryId) : null,
      },
    });

    res.json(updatedListing);
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Failed to update listing.' });
  }
});

router.post('/create', verifyToken, createListing);
router.get('/me', verifyToken, getMyListings);

export default router;
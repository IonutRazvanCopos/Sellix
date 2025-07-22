import { Request, Response } from 'express';
import { AuthRequest } from '../middlewares/authMiddleware';
import prisma from '../config/prisma';

export async function createListing(req: AuthRequest, res: Response) {
  try {
    const {
      title,
      description,
      price,
      currency,
      type,
      categoryId,
      subcategoryId,
    } = req.body;

    const newListing = await prisma.listing.create({
      data: {
        title,
        description,
        price: parseFloat(price),
        currency,
        type,
        userId: req.user!.userId,
        categoryId: Number(categoryId),
        subcategoryId: subcategoryId ? Number(subcategoryId) : null,
        approved: false,
        visible: true,
      },
    });

    res.status(201).json(newListing);
  } catch (error) {
    console.error('Error creating listing:', error);
    res.status(500).json({ message: 'Internal server error' });
  }
}

export async function getMyListings(req: AuthRequest, res: Response) {
  try {
    const listings = await prisma.listing.findMany({
      where: {
        userId: req.user!.userId,
        visible: true,
      },
      orderBy: {
        createdAt: 'desc',
      },
      include: {
        category: true,
        subcategory: true,
        images: true,
      },
    });

    res.json(listings);
  } catch (error) {
    console.error('Error fetching user listings:', error);
    res.status(500).json({ message: 'Internal server error' });
  }
}
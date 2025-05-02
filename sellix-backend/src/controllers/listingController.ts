import { Request, Response } from 'express';
import { AuthRequest } from '../middlewares/authMiddleware';
import prisma from '../config/prisma';

export async function getMyListings(req: AuthRequest, res: Response) {
  try {
    const listings = await prisma.listing.findMany({
      where: { userId: req.user!.userId },
      orderBy: { createdAt: 'desc' },
    });
    res.json(listings);
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: 'Could not fetch listings' });
  }
}
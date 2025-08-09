import { Request, Response } from 'express';
import prisma from '../config/prisma';
import { AuthRequest } from '../middlewares/authMiddleware';

export async function getPendingListings(req: Request, res: Response) {
  const listings = await prisma.listing.findMany({
    where: { approved: false, visible: true },
    include: { user: true, category: true, subcategory: true, images: true }
  });
  res.json(listings);
}

export async function approveListing(req: Request, res: Response) {
  const { listingId } = req.params;
  await prisma.listing.update({
    where: { id: Number(listingId) },
    data: { approved: true }
  });
  res.json({ message: 'Listing approved.' });
}

export async function hideListing(req: Request, res: Response) {
  const { listingId } = req.params;
  await prisma.listing.update({
    where: { id: Number(listingId) },
    data: { visible: false }
  });
  res.json({ message: 'Listing hidden.' });
}

export async function getHiddenListings(req: Request, res: Response) {
  const listings = await prisma.listing.findMany({
    where: { visible: false },
    include: {
      user: true,
      category: true,
      subcategory: true,
      images: true,
    },
  });
  res.json(listings);
}

export async function unhideListing(req: Request, res: Response) {
  const { listingId } = req.params;
  await prisma.listing.update({
    where: { id: Number(listingId) },
    data: { visible: true },
  });
  res.json({ message: 'Listing is now visible.' });
}

export async function editListing(req: Request, res: Response) {
  const { listingId } = req.params;
  const data = req.body;

  try {
    const updated = await prisma.listing.update({
      where: { id: Number(listingId) },
      data: {
        title: data.title,
        description: data.description,
        price: parseFloat(data.price),
        currency: data.currency,
        type: data.type,
        categoryId: data.categoryId,
        subcategoryId: data.subcategoryId || null,
      },
    });
    res.json(updated);
  } catch (err) {
    res.status(400).json({ message: 'Failed to update listing' });
  }
}

export async function addCategory(req: Request, res: Response) {
  const { name } = req.body;
  const category = await prisma.category.create({ data: { name } });
  res.json(category);
}

export async function addSubcategory(req: Request, res: Response) {
  const { name, categoryId } = req.body;
  const subcategory = await prisma.subcategory.create({
    data: {
      name,
      category: { connect: { id: Number(categoryId) } }
    }
  });
  res.json(subcategory);
}

export async function sendMessageToUser(req: AuthRequest, res: Response) {
  const { receiverId, content } = req.body;

  if (!receiverId || !content) {
    return res.status(400).json({ message: 'Receiver ID and content are required.' });
  }

  try {
    let systemListing = await prisma.listing.findFirst({
      where: {
        userId: req.user!.userId,
        title: "System Message",
      }
    });

    if (!systemListing) {
      systemListing = await prisma.listing.create({
        data: {
          title: "System Message",
          description: "Admin Communication",
          price: 0,
          currency: 'RON',
          type: 'SELL',
          userId: req.user!.userId,
          categoryId: 1,
          approved: true,
          visible: false,
        },
      });
    }

    let conversation = await prisma.conversation.findFirst({
      where: {
        listingId: systemListing.id,
        participants: {
          some: { id: receiverId },
        },
        AND: {
          participants: {
            some: { id: req.user!.userId },
          },
        },
      },
    });

    if (!conversation) {
      conversation = await prisma.conversation.create({
        data: {
          listingId: systemListing.id,
          participants: {
            connect: [{ id: receiverId }, { id: req.user!.userId }],
          },
        },
      });
    }

    const message = await prisma.message.create({
      data: {
        content,
        senderId: req.user!.userId,
        receiverId,
        listingId: systemListing.id,
        conversationId: conversation.id,
      },
    });

    res.status(201).json({ message: "Message sent", data: message });
  } catch (err) {
    console.error("Error sending admin message:", err);
    res.status(500).json({ message: "Failed to send message", error: err });
  }
}
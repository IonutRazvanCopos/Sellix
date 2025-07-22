import express from 'express';
import { PrismaClient } from '@prisma/client';

const router = express.Router();
const prisma = new PrismaClient();

router.get('/:userId', async (req, res) => {
  console.log("✅ [GET] /messages/:userId triggered");
  const userId = parseInt(req.params.userId);
  const listingId = req.query.listingId ? parseInt(req.query.listingId as string) : undefined;

  if (isNaN(userId)) {
    return res.status(400).json({ error: 'ID utilizator invalid' });
  }

  try {
    const conversations = await prisma.conversation.findMany({
      where: {
        participants: {
          some: { id: userId },
        },
        ...(listingId ? { listingId } : {}),
      },
      include: {
        listing: { select: { id: true, title: true, images: true } },
        participants: { select: { id: true, username: true, avatar: true } },
        messages: { orderBy: { timestamp: 'asc' } },
      },
    });

    res.json(conversations);
  } catch (error) {
    console.error("Eroare la get conversatii:", error);
    res.status(500).json({ error: "Eroare la încărcarea conversațiilor." });
  }
});

router.post('/send', async (req, res) => {
  const { senderId, receiverId, content, listingId } = req.body;

  if (!senderId || !receiverId || !content || !listingId) {
    return res.status(400).json({ error: 'Lipsesc datele necesare.' });
  }

  try {
    let conversation = await prisma.conversation.findFirst({
      where: {
        listingId,
        participants: {
          some: { id: senderId },
        },
        AND: {
          participants: {
            some: { id: receiverId },
          },
        },
      },
    });

    if (!conversation) {
      conversation = await prisma.conversation.create({
        data: {
          listing: { connect: { id: listingId } },
          participants: {
            connect: [{ id: senderId }, { id: receiverId }],
          },
        },
      });
    }

    const newMessage = await prisma.message.create({
      data: {
        senderId,
        receiverId,
        content,
        listingId,
        conversationId: conversation.id,
      },
    });

    res.json(newMessage);
  } catch (error) {
    console.error('Eroare la trimiterea mesajului:', error);
    res.status(500).json({ error: 'Eroare la trimiterea mesajului.' });
  }
});

export default router;
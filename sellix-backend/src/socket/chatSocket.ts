import { Server } from 'socket.io';
import { PrismaClient } from '@prisma/client';

interface ChatMessageData {
  roomId: string;
  content: string;
  senderId: number;
  receiverId: number;
  listingId: number;
}

const prisma = new PrismaClient();

export function setupChatSocket(io: Server) {
  io.on('connection', (socket) => {
    console.log(`🟢 User connected: ${socket.id}`);

    socket.on('joinRoom', (roomId: string) => {
      socket.join(roomId);
      console.log(`User ${socket.id} joined room ${roomId}`);
    });

socket.on("chatMessage", async (data: ChatMessageData) => {
  const { roomId, senderId, receiverId, content, listingId } = data;

  if (
    !roomId || !content || !senderId || !receiverId || !listingId
  ) {
    console.error("❌ Date lipsă sau invalide în mesaj:", data);
    return;
  }

  try {
    let conversation = await prisma.conversation.findFirst({
      where: {
        listingId,
        participants: {
          every: { id: { in: [senderId, receiverId] } },
        },
      },
    });

    if (!conversation) {
      conversation = await prisma.conversation.create({
        data: {
          listing: { connect: { id: listingId } },
          participants: { connect: [{ id: senderId }, { id: receiverId }] },
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

    io.to(roomId).emit("receiveMessage", {
      senderId,
      content,
      timestamp: newMessage.timestamp,
    });
  } catch (err) {
    console.error("❌ Eroare la salvarea mesajului:", err);
  }
});

    socket.on('disconnect', () => {
      console.log(`🔴 User disconnected: ${socket.id}`);
    });
  });
}
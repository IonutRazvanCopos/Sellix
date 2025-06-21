"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.setupChatSocket = setupChatSocket;
const client_1 = require("@prisma/client");
const prisma = new client_1.PrismaClient();
function setupChatSocket(io) {
    io.on('connection', (socket) => {
        console.log(`🟢 User connected: ${socket.id}`);
        socket.on('joinRoom', (roomId) => {
            socket.join(roomId);
            console.log(`User ${socket.id} joined room ${roomId}`);
        });
        socket.on("chatMessage", (data) => __awaiter(this, void 0, void 0, function* () {
            const { roomId, senderId, receiverId, content, listingId } = data;
            if (!roomId || !content || !senderId || !receiverId || !listingId) {
                console.error("❌ Date lipsă sau invalide în mesaj:", data);
                return;
            }
            try {
                let conversation = yield prisma.conversation.findFirst({
                    where: {
                        listingId,
                        participants: {
                            every: { id: { in: [senderId, receiverId] } },
                        },
                    },
                });
                if (!conversation) {
                    conversation = yield prisma.conversation.create({
                        data: {
                            listing: { connect: { id: listingId } },
                            participants: { connect: [{ id: senderId }, { id: receiverId }] },
                        },
                    });
                }
                const newMessage = yield prisma.message.create({
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
            }
            catch (err) {
                console.error("❌ Eroare la salvarea mesajului:", err);
            }
        }));
        socket.on('disconnect', () => {
            console.log(`🔴 User disconnected: ${socket.id}`);
        });
    });
}

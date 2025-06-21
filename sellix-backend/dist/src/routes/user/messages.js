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
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const client_1 = require("@prisma/client");
const router = express_1.default.Router();
const prisma = new client_1.PrismaClient();
// ✅ Obține conversațiile pentru un utilizator
router.get('/:userId', (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const userId = parseInt(req.params.userId);
    try {
        const conversations = yield prisma.conversation.findMany({
            where: {
                participants: {
                    some: { id: userId },
                },
            },
            include: {
                participants: true,
                listing: true,
                messages: {
                    orderBy: { timestamp: 'asc' },
                },
            },
        });
        res.json(conversations);
    }
    catch (error) {
        console.error('Eroare la get conversatii:', error);
        res.status(500).json({ error: 'Eroare la încărcarea conversațiilor.' });
    }
}));
// ✅ Creează sau trimite un mesaj într-o conversație legată de un listing
router.post('/send', (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const { senderId, receiverId, content, listingId } = req.body;
    if (!senderId || !receiverId || !content || !listingId) {
        return res.status(400).json({ error: 'Lipsesc datele necesare.' });
    }
    try {
        // ✅ Caută conversația EXISTENTĂ pentru listing + participanți
        let conversation = yield prisma.conversation.findFirst({
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
        // ✅ Dacă nu există conversația, creeaz-o
        if (!conversation) {
            conversation = yield prisma.conversation.create({
                data: {
                    listing: {
                        connect: { id: listingId },
                    },
                    participants: {
                        connect: [{ id: senderId }, { id: receiverId }],
                    },
                },
            });
        }
        // ✅ Salvează mesajul
        const newMessage = yield prisma.message.create({
            data: {
                senderId,
                receiverId,
                content,
                listingId,
                conversationId: conversation.id,
            },
        });
        res.json(newMessage);
    }
    catch (error) {
        console.error('Eroare la trimiterea mesajului:', error);
        res.status(500).json({ error: 'Eroare la trimiterea mesajului.' });
    }
}));
exports.default = router;

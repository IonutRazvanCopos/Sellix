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
const authMiddleware_1 = require("../../middlewares/authMiddleware");
const router = express_1.default.Router();
const prisma = new client_1.PrismaClient();
router.get('/', (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const listings = yield prisma.listing.findMany({
            include: {
                user: {
                    select: { username: true },
                },
                category: {
                    select: { name: true },
                },
                images: true,
            },
            orderBy: { createdAt: 'desc' },
        });
        res.json(listings);
    }
    catch (error) {
        console.error('Error fetching listings:', error);
        res.status(500).json({ message: 'Something went wrong' });
    }
}));
router.get('/profile', authMiddleware_1.verifyToken, (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const listings = yield prisma.listing.findMany({
            where: {
                userId: req.user.userId,
            },
            include: {
                category: { select: { name: true } },
            },
            orderBy: { createdAt: 'desc' },
        });
        res.json(listings);
    }
    catch (error) {
        console.error('Error fetching user listings:', error);
        res.status(500).json({ message: 'Something went wrong.' });
    }
}));
router.post('/', authMiddleware_1.verifyToken, (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    var _a;
    const { title, description, price, currency, type, categoryId } = req.body;
    const files = (_a = req.files) === null || _a === void 0 ? void 0 : _a.images;
    if (!title || !description || !price || !currency || !type || !categoryId) {
        return res.status(400).json({ message: 'All fields are required.' });
    }
    try {
        const newListing = yield prisma.listing.create({
            data: {
                title,
                description,
                price: Number(price),
                currency,
                type,
                categoryId: Number(categoryId),
                userId: req.user.userId,
            },
        });
        if (files) {
            const imagesArray = Array.isArray(files) ? files : [files];
            for (const img of imagesArray) {
                const filename = `${Date.now()}_${img.name}`;
                const path = `public/uploads/${filename}`;
                yield img.mv(path);
                yield prisma.image.create({
                    data: {
                        url: `/uploads/${filename}`,
                        listingId: newListing.id,
                    },
                });
            }
        }
        res.status(201).json({ message: 'Listing created', listingId: newListing.id });
    }
    catch (error) {
        console.error('Error creating listing:', error);
        res.status(500).json({ message: 'Failed to create listing.' });
    }
}));
exports.default = router;

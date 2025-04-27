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
const express_1 = require("express");
const authController_1 = require("../controllers/authController");
const authMiddleware_1 = require("../middlewares/authMiddleware");
const prisma_1 = __importDefault(require("../config/prisma"));
const router = (0, express_1.Router)();
router.post('/register', authController_1.registerUser);
router.post('/login', authController_1.loginUser);
router.get('/profile', authMiddleware_1.verifyToken, authController_1.getMe);
router.put('/update-profile', authMiddleware_1.verifyToken, (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const { username, phone, city, county } = req.body;
        let avatarPath = undefined;
        if (req.files && req.files.avatar) {
            const avatar = req.files.avatar;
            const fileName = `${Date.now()}_${avatar.name}`;
            const uploadPath = `public/uploads/${fileName}`;
            yield avatar.mv(uploadPath);
            avatarPath = `/uploads/${fileName}`;
        }
        yield prisma_1.default.user.update({
            where: { id: req.user.userId },
            data: Object.assign({ username,
                phone,
                city,
                county }, (avatarPath && { avatar: avatarPath })),
        });
        res.json({ message: 'Profile updated successfully' });
    }
    catch (err) {
        console.error(err);
        res.status(500).json({ message: 'Update failed' });
    }
}));
router.get('/my-listings', authMiddleware_1.verifyToken, (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const listings = yield prisma_1.default.listing.findMany({
            where: { userId: req.user.userId },
            orderBy: { createdAt: 'desc' },
        });
        res.json(listings);
    }
    catch (err) {
        console.error(err);
        res.status(500).json({ message: 'Could not fetch listings' });
    }
}));
exports.default = router;

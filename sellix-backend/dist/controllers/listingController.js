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
exports.getMyListings = getMyListings;
const prisma_1 = __importDefault(require("../config/prisma"));
function getMyListings(req, res) {
    return __awaiter(this, void 0, void 0, function* () {
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
    });
}

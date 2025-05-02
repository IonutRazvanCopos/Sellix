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
exports.findUserByEmail = findUserByEmail;
exports.createUser = createUser;
exports.generateToken = generateToken;
exports.comparePasswords = comparePasswords;
exports.getUserProfile = getUserProfile;
exports.updateUserProfile = updateUserProfile;
exports.getUserListings = getUserListings;
const prisma_1 = __importDefault(require("../config/prisma"));
const bcrypt_1 = __importDefault(require("bcrypt"));
const jsonwebtoken_1 = __importDefault(require("jsonwebtoken"));
function findUserByEmail(email) {
    return __awaiter(this, void 0, void 0, function* () {
        return yield prisma_1.default.user.findUnique({ where: { email } });
    });
}
function createUser(email, password) {
    return __awaiter(this, void 0, void 0, function* () {
        const hashedPassword = yield bcrypt_1.default.hash(password, 10);
        return yield prisma_1.default.user.create({
            data: {
                email,
                password: hashedPassword,
            },
        });
    });
}
function generateToken(userId, email) {
    return jsonwebtoken_1.default.sign({ userId, email }, process.env.JWT_SECRET, {
        expiresIn: '1h',
    });
}
function comparePasswords(plain, hash) {
    return __awaiter(this, void 0, void 0, function* () {
        return yield bcrypt_1.default.compare(plain, hash);
    });
}
function getUserProfile(userId) {
    return __awaiter(this, void 0, void 0, function* () {
        return yield prisma_1.default.user.findUnique({
            where: { id: userId },
            select: {
                id: true,
                email: true,
                createdAt: true,
                username: true,
                phone: true,
                city: true,
                county: true,
                avatar: true,
            },
        });
    });
}
function updateUserProfile(userId, data) {
    return __awaiter(this, void 0, void 0, function* () {
        return yield prisma_1.default.user.update({
            where: { id: userId },
            data,
        });
    });
}
function getUserListings(userId) {
    return __awaiter(this, void 0, void 0, function* () {
        return yield prisma_1.default.listing.findMany({
            where: { userId },
            orderBy: { createdAt: 'desc' },
        });
    });
}

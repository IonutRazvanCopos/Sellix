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
exports.registerUser = registerUser;
exports.loginUser = loginUser;
exports.getMe = getMe;
const bcrypt_1 = __importDefault(require("bcrypt"));
const prisma_1 = __importDefault(require("../config/prisma"));
const jsonwebtoken_1 = __importDefault(require("jsonwebtoken"));
const dotenv_1 = __importDefault(require("dotenv"));
dotenv_1.default.config();
function registerUser(req, res) {
    return __awaiter(this, void 0, void 0, function* () {
        try {
            const { email, password } = req.body;
            if (!email || !password) {
                return res.status(400).json({ message: 'Email and password are required.' });
            }
            const existingUser = yield prisma_1.default.user.findUnique({ where: { email } });
            if (existingUser) {
                return res.status(409).json({ message: 'Email already used.' });
            }
            const hashedPassword = yield bcrypt_1.default.hash(password, 10);
            const newUser = yield prisma_1.default.user.create({
                data: {
                    email,
                    password: hashedPassword,
                },
            });
            return res.status(201).json({
                message: 'User successfully registered!',
                userId: newUser.id,
            });
        }
        catch (error) {
            console.error(error);
            return res.status(500).json({ message: 'Internal error.' });
        }
    });
}
function loginUser(req, res) {
    return __awaiter(this, void 0, void 0, function* () {
        const { email, password } = req.body;
        if (!email || !password) {
            return res.status(400).json({ message: 'Email and password are required.' });
        }
        try {
            const user = yield prisma_1.default.user.findUnique({ where: { email } });
            if (!user) {
                return res.status(404).json({ message: 'User does not exist.' });
            }
            const isPasswordValid = yield bcrypt_1.default.compare(password, user.password);
            if (!isPasswordValid) {
                return res.status(401).json({ message: 'Incorrect password.' });
            }
            const token = jsonwebtoken_1.default.sign({ userId: user.id, email: user.email }, process.env.JWT_SECRET, {
                expiresIn: '1h',
            });
            return res.status(200).json({ message: 'Authentication successful!', token });
        }
        catch (error) {
            console.error(error);
            return res.status(500).json({ message: 'Internal error.' });
        }
    });
}
;
function getMe(req, res) {
    return __awaiter(this, void 0, void 0, function* () {
        var _a;
        try {
            const userId = (_a = req.user) === null || _a === void 0 ? void 0 : _a.userId;
            const user = yield prisma_1.default.user.findUnique({
                where: { id: userId },
                select: {
                    id: true,
                    email: true,
                    createdAt: true,
                },
            });
            if (!user) {
                return res.status(404).json({ message: 'User does not exist.' });
            }
            res.status(200).json({ user });
        }
        catch (error) {
            console.error(error);
            res.status(500).json({ message: 'Internal error.' });
        }
    });
}
;

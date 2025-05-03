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
exports.register = register;
exports.login = login;
exports.getMe = getMe;
exports.updateProfile = updateProfile;
exports.getMyListings = getMyListings;
const authHelpers_1 = require("../helpers/authHelpers");
function register(req, res) {
    return __awaiter(this, void 0, void 0, function* () {
        try {
            const { email, password } = req.body;
            if (!email || !password) {
                return res.status(400).json({ message: 'Email and password are required.' });
            }
            const existingUser = yield (0, authHelpers_1.findUserByEmail)(email);
            if (existingUser) {
                return res.status(409).json({ message: 'Email already used.' });
            }
            const newUser = yield (0, authHelpers_1.createUser)(email, password);
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
function login(req, res) {
    return __awaiter(this, void 0, void 0, function* () {
        const { email, password } = req.body;
        if (!email || !password) {
            return res.status(400).json({ message: 'Email and password are required.' });
        }
        try {
            const user = yield (0, authHelpers_1.findUserByEmail)(email);
            if (!user)
                return res.status(404).json({ message: 'User does not exist.' });
            const isPasswordValid = yield (0, authHelpers_1.comparePasswords)(password, user.password);
            if (!isPasswordValid)
                return res.status(401).json({ message: 'Incorrect password.' });
            const token = (0, authHelpers_1.generateToken)(user.id, user.email);
            return res.status(200).json({ message: 'Authentication successful!', token });
        }
        catch (error) {
            console.error(error);
            return res.status(500).json({ message: 'Internal error.' });
        }
    });
}
function getMe(req, res) {
    return __awaiter(this, void 0, void 0, function* () {
        try {
            const user = yield (0, authHelpers_1.getUserProfile)(req.user.userId);
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
function updateProfile(req, res) {
    return __awaiter(this, void 0, void 0, function* () {
        try {
            const { username, phone, city, county } = req.body;
            let avatarPath;
            if (req.files && req.files.avatar) {
                const avatar = req.files.avatar;
                const fileName = `${Date.now()}_${avatar.name}`;
                const uploadPath = `public/uploads/${fileName}`;
                yield avatar.mv(uploadPath);
                avatarPath = `/uploads/${fileName}`;
            }
            const updatedUser = yield (0, authHelpers_1.updateProfile)(req.user.userId, Object.assign({ username,
                phone,
                city,
                county }, (avatarPath && { avatar: avatarPath })));
            res.json({ message: 'Profile updated successfully', updatedUser });
        }
        catch (err) {
            console.error(err);
            res.status(500).json({ message: 'Update failed' });
        }
    });
}
function getMyListings(req, res) {
    return __awaiter(this, void 0, void 0, function* () {
        try {
            const listings = yield (0, authHelpers_1.getUserListings)(req.user.userId);
            res.json(listings);
        }
        catch (err) {
            console.error(err);
            res.status(500).json({ message: 'Could not fetch listings' });
        }
    });
}

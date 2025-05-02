"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = require("express");
const listingController_1 = require("../../controllers/listingController");
const authMiddleware_1 = require("../../middlewares/authMiddleware");
const router = (0, express_1.Router)();
router.get('/listing/userId', authMiddleware_1.verifyToken, listingController_1.getMyListings);
exports.default = router;

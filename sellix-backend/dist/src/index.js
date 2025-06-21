"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const cors_1 = __importDefault(require("cors"));
const express_fileupload_1 = __importDefault(require("express-fileupload"));
const http_1 = require("http");
const socket_io_1 = require("socket.io");
const auth_1 = __importDefault(require("./routes/user/auth"));
const listingRoutes_1 = __importDefault(require("./routes/home/listingRoutes"));
const categoryRoutes_1 = __importDefault(require("./routes/home/categoryRoutes"));
const userRoutes_1 = __importDefault(require("./routes/user/userRoutes"));
const chatSocket_1 = require("./socket/chatSocket");
const messages_1 = __importDefault(require("./routes/messages"));
const app = (0, express_1.default)();
const PORT = 3000;
app.use(express_1.default.json());
app.use((0, cors_1.default)({ origin: 'http://localhost:5173', credentials: true }));
app.use((0, express_fileupload_1.default)());
app.use('/uploads', express_1.default.static('public/uploads'));
app.use('/api', auth_1.default);
app.use('/api/listings', listingRoutes_1.default);
app.use('/api/categories', categoryRoutes_1.default);
app.use('/api/users', userRoutes_1.default);
app.use('/api/messages', messages_1.default);
const httpServer = (0, http_1.createServer)(app);
const io = new socket_io_1.Server(httpServer, {
    cors: {
        origin: 'http://localhost:5173',
        methods: ['GET', 'POST'],
    },
});
(0, chatSocket_1.setupChatSocket)(io);
httpServer.listen(PORT, () => {
    console.log(`✅ Server is running at http://localhost:${PORT}`);
});

import express from 'express';
import cors from 'cors';
import fileUpload from 'express-fileupload';
import { createServer } from 'http';
import { Server } from 'socket.io';

import authRoutes from './routes/user/auth';
import listingRoutes from './routes/home/listingRoutes';
import categoryRoutes from './routes/home/categoryRoutes';
import userRoutes from './routes/user/userRoutes';
import { setupChatSocket } from './socket/chatSocket';
import messageRoutes from './routes/messages';

const app = express();
const PORT = 3000;

app.use(express.json());
app.use(cors({ origin: 'http://localhost:5173', credentials: true }));
app.use(fileUpload());
app.use('/uploads', express.static('public/uploads'));

app.use('/api', authRoutes);
app.use('/api/listings', listingRoutes);
app.use('/api/categories', categoryRoutes);
app.use('/api/users', userRoutes);
app.use('/api/messages', messageRoutes);

const httpServer = createServer(app);

const io = new Server(httpServer, {
  cors: {
    origin: 'http://localhost:5173',
    methods: ['GET', 'POST'],
  },
});

setupChatSocket(io);

httpServer.listen(PORT, () => {
  console.log(`✅ Server is running at http://localhost:${PORT}`);
});
import express from 'express';
import authRoutes from './routes/user/auth';
import path from 'path';
import cors from 'cors';
import fileUpload from 'express-fileupload';
import listingRoutes from './routes/home/listingRoutes';
import categoryRoutes from './routes/home/categoryRoutes';
import userRoutes from './routes/user/userRoutes';


const app = express();
app.use(express.json());
app.use(cors());
app.use(fileUpload());
app.use('/uploads', express.static('public/uploads'));
const PORT = 3000;

app.use('/api', authRoutes);
app.use('/api/listings', listingRoutes);
app.use('/api/categories', categoryRoutes);
app.use('/api/users', userRoutes);

app.listen(PORT);
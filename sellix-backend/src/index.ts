import express from 'express';
import authRoutes from './routes/user/auth';
import path from 'path';
import cors from 'cors';
import fileUpload from 'express-fileupload';
import listingRoutes from './routes/home/listingRoutes';

const app = express();
const PORT = 3000;

app.use(cors());
app.use(fileUpload());
app.use(express.json());
app.use('/uploads', express.static(path.join(__dirname, '../public/uploads')));
app.use('/api', authRoutes, listingRoutes);

app.listen(PORT);
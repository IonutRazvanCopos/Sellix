import express from 'express';
import authRoutes from './routes/auth';
import path from 'path';
import cors from 'cors';
import fileUpload from 'express-fileupload';

const app = express();
const PORT = 3000;

app.use(cors());
app.use(fileUpload());
app.use(express.json());
app.use('/uploads', express.static(path.join(__dirname, '../public/uploads')));
app.use('/api', authRoutes);

app.listen(PORT);
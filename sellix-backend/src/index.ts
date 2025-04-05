import express from 'express';
import authRoutes from './routes/auth';
import cors from 'cors';

const app = express();
const PORT = 3000;

app.use(express.json());
app.use(cors());
app.use('/api', authRoutes);

app.listen(PORT, () => {
  console.log(`Serverul rulează pe http://localhost:${PORT}`);
});
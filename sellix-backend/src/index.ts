import express from 'express';
import authRoutes from './routes/auth';

const app = express();
const PORT = 3000;

app.use(express.json());
app.use('/api', authRoutes);

app.listen(PORT, () => {
  console.log(`Serverul rulează pe http://localhost:${PORT}`);
});
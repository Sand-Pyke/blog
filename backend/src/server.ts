import express from 'express';
import cors from 'cors';
import dotenv from 'dotenv';
import path from 'path';
import authRoutes from './routes/auth.js';
import blogRoutes from './routes/blog.js';
import dailyRoutes from './routes/daily.js';
import skillRoutes from './routes/skills.js';
import uploadRoutes from './routes/upload.js';

dotenv.config();

const app = express();
const PORT = process.env.PORT || 3000;

app.use(cors({
  origin: process.env.ALLOWED_ORIGINS?.split(','),
  credentials: true,
}));

app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// 静态文件服务 — 与 upload 路由使用相同的 UPLOAD_DIR
const uploadDir = process.env.UPLOAD_DIR || 'uploads';
const uploadsPath = path.resolve(process.cwd(), uploadDir);
app.use('/uploads', express.static(uploadsPath));

app.use('/api/auth', authRoutes);
app.use('/api/blog', blogRoutes);
app.use('/api/daily', dailyRoutes);
app.use('/api/skills', skillRoutes);
app.use('/api/upload', uploadRoutes);

app.get('/api/health', (req, res) => {
  res.json({ status: 'ok', timestamp: new Date().toISOString() });
});

app.use((err: any, req: express.Request, res: express.Response, next: express.NextFunction) => {
  console.error(err.stack);
  res.status(500).json({ error: 'Something went wrong!' });
});

app.listen(PORT, () => {
  console.log(`Server running on http://localhost:${PORT}`);
});
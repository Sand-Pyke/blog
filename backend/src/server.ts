import express from 'express';
import cors from 'cors';
import dotenv from 'dotenv';
import path from 'path';
import fs from 'fs';
import pool from './config/db';
import bcrypt from 'bcrypt';
import authRoutes from './routes/auth';
import blogRoutes from './routes/blog';
import dailyRoutes from './routes/daily';
import skillRoutes from './routes/skills';
import uploadRoutes from './routes/upload';

dotenv.config();

const app = express();
const PORT = process.env.PORT || 3000;

app.use(cors({
  origin: process.env.ALLOWED_ORIGINS?.split(',') || '*',
  credentials: true,
}));

app.use(express.json());
app.use(express.urlencoded({ extended: true }));

const uploadDir = process.env.UPLOAD_DIR || 'uploads';
const uploadsPath = path.resolve(process.cwd(), uploadDir);
app.use('/uploads', express.static(uploadsPath));

async function initDatabase() {
  const sqlPath = path.join(__dirname, 'init-database.sql');
  const altPath = path.join(process.cwd(), 'init-database.sql');

  let sqlFilePath: string | null = null;
  if (fs.existsSync(sqlPath)) {
    sqlFilePath = sqlPath;
  } else if (fs.existsSync(altPath)) {
    sqlFilePath = altPath;
  }

  if (sqlFilePath) {
    try {
      const sql = fs.readFileSync(sqlFilePath, 'utf-8');

      const statements = sql
        .split(';')
        .map(s => {
          return s
            .split('\n')
            .filter(line => !line.trim().startsWith('--'))
            .join('\n')
            .trim();
        })
        .filter(s => s.length > 0);

      for (const statement of statements) {
        await pool.query(statement);
      }
    } catch (err: any) {
      console.error('Database initialization error:', err.message);
      process.exit(1);
    }
  }
}

async function createDefaultAdmin() {
  const existing = await pool.query('SELECT id FROM users WHERE username = $1', ['admin']);
  if (existing.rows.length > 0) {
    return;
  }

  const defaultPassword = process.env.ADMIN_PASSWORD || 'wxh2026';
  const hashedPassword = await bcrypt.hash(defaultPassword, 10);

  await pool.query(
    'INSERT INTO users (username, email, password) VALUES ($1, $2, $3)',
    ['admin', 'admin@wxh-blog.com', hashedPassword]
  );
}

app.use('/api/auth', authRoutes);
app.use('/api/blog', blogRoutes);
app.use('/api/daily', dailyRoutes);
app.use('/api/skills', skillRoutes);
app.use('/api/upload', uploadRoutes);

app.get('/api/health', async (req, res) => {
  try {
    await pool.query('SELECT 1');
    res.json({ status: 'ok', db: 'connected', timestamp: new Date().toISOString() });
  } catch {
    res.status(503).json({ status: 'degraded', db: 'disconnected' });
  }
});

initDatabase().then(() => createDefaultAdmin()).then(() => {
  app.listen(PORT, () => {});
});
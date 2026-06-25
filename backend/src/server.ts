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

// 静态文件服务 — 与 upload 路由使用相同的 UPLOAD_DIR
const uploadDir = process.env.UPLOAD_DIR || 'uploads';
const uploadsPath = path.resolve(process.cwd(), uploadDir);
app.use('/uploads', express.static(uploadsPath));

// 应用启动时自动建表
async function initDatabase() {
  const sqlPath = path.join(__dirname, 'init-database.sql');
  // Docker 中文件可能在不同位置
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

      // pg 的 pool.query 使用扩展查询协议，不支持一次执行多条 SQL
      // 需要按分号拆分，逐条执行
      const statements = sql
        .split(';')
        .map(s => {
          // 去掉行首的 -- 注释
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
      console.log('✅ Database tables initialized successfully');
    } catch (err) {
      console.error('❌ Database initialization failed:', err);
    }
  } else {
    console.warn('⚠️ init-database.sql not found, skipping table creation');
  }
}

// 自动创建默认管理员（仅当不存在时）
async function createDefaultAdmin() {
  try {
    const existing = await pool.query('SELECT id FROM users WHERE username = $1', ['admin']);
    if (existing.rows.length > 0) {
      console.log('ℹ️ Admin user already exists, skipping creation');
      return;
    }

    const defaultPassword = process.env.ADMIN_PASSWORD || 'wxh2026';
    const hashedPassword = await bcrypt.hash(defaultPassword, 10);

    await pool.query(
      'INSERT INTO users (username, email, password) VALUES ($1, $2, $3)',
      ['admin', 'admin@wxh-blog.com', hashedPassword]
    );
    console.log('✅ Default admin created: admin / ' + defaultPassword);
  } catch (err) {
    console.error('❌ Failed to create default admin:', err);
  }
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

app.use((err: any, req: express.Request, res: express.Response, next: express.NextFunction) => {
  console.error(err.stack);
  res.status(500).json({ error: 'Internal server error' });
});

// 先建表再创建默认管理员，最后启动监听
initDatabase().then(() => createDefaultAdmin()).then(() => {
  app.listen(PORT, () => {
    console.log(`Server running on http://localhost:${PORT}`);
  });
});
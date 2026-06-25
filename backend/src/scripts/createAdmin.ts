import { Pool } from 'pg';
import bcrypt from 'bcrypt';
import dotenv from 'dotenv';
import * as readline from 'readline';

dotenv.config();

const pool = new Pool({
  host: process.env.DB_HOST,
  port: parseInt(process.env.DB_PORT || '5432'),
  database: process.env.DB_NAME,
  user: process.env.DB_USER,
  password: process.env.DB_PASSWORD,
});

async function createAdmin() {
  const rl = readline.createInterface({ input: process.stdin, output: process.stdout });
  const question = (q: string) => new Promise<string>((resolve) => rl.question(q, resolve));

    const username = (await question('用户�?(默认: admin): ')) || 'admin';
  const email = (await question('邮箱 (默认: admin@wxh-blog.com): ')) || 'admin@wxh-blog.com';
  const password = (await question('密码 (默认: admin123): ')) || 'admin123';

  const hashedPassword = await bcrypt.hash(password, 10);

  try {
    await pool.query(
      'INSERT INTO users (username, email, password) VALUES ($1, $2, $3)',
      [username, email, hashedPassword]
    );
                  } catch (error: any) {
    if (error.code === '23505') {
          } else {
          }
  } finally {
    await pool.end();
    process.exit(0);
  }
}

createAdmin();
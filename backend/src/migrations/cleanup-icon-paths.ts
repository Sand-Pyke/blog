import { Pool } from 'pg';
import dotenv from 'dotenv';

dotenv.config();

const pool = new Pool({
  host: process.env.DB_HOST,
  port: parseInt(process.env.DB_PORT || '5432'),
  database: process.env.DB_NAME,
  user: process.env.DB_USER,
  password: process.env.DB_PASSWORD,
});

async function cleanup() {
  console.log('🔄 Cleaning up icon paths in database...\n');

  try {
    const client = await pool.connect();

    // 获取所有技能
    const result = await client.query('SELECT id, icon FROM skills WHERE icon IS NOT NULL');
    
    for (const skill of result.rows) {
      if (skill.icon) {
        // 提取文件名
        const match = skill.icon.match(/([^/]+\.svg)$/);
        if (match) {
          const fileName = match[1];
          console.log(`Updating skill ${skill.id}: ${skill.icon} -> ${fileName}`);
          await client.query('UPDATE skills SET icon = $1 WHERE id = $2', [fileName, skill.id]);
        }
      }
    }

    await client.release();
    await pool.end();
    
    console.log('\n✅ Cleanup completed successfully!');
    process.exit(0);
  } catch (error) {
    console.error('\n❌ Cleanup error:');
    console.error(error);
    process.exit(1);
  }
}

cleanup();

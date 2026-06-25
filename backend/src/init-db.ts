import { Pool } from 'pg';
import * as fs from 'fs';
import * as path from 'path';
import dotenv from 'dotenv';

dotenv.config();

const pool = new Pool({
  host: process.env.DB_HOST,
  port: parseInt(process.env.DB_PORT || '5432'),
  database: process.env.DB_NAME,
  user: process.env.DB_USER,
  password: process.env.DB_PASSWORD,
});

async function initializeDatabase() {
    try {
    const client = await pool.connect();

    // Read the SQL initialization file
    const sqlFilePath = path.join(__dirname, '../init-database.sql');
    const sql = fs.readFileSync(sqlFilePath, 'utf-8');

        // Execute the entire SQL script at once
    try {
      await client.query(sql);
          } catch (error) {
                  await client.release();
      await pool.end();
      process.exit(1);
    }


    // Verify tables were created
    const tablesResult = await client.query(`
      SELECT table_name 
      FROM information_schema.tables 
      WHERE table_schema = 'public' 
      ORDER BY table_name
    `);

        tablesResult.rows.forEach(row => {
          });

    // Check inserted data
        const categoryCount = await client.query('SELECT COUNT(*) FROM blog_categories');
        const tagCount = await client.query('SELECT COUNT(*) FROM blog_tags');
        await client.release();
    await pool.end();

                    process.exit(0);
  } catch (error) {
            process.exit(1);
  }
}

initializeDatabase();
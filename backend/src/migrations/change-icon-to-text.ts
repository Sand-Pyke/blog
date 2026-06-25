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

async function migrate() {
  console.log('🔄 Running migration: change icon column type to TEXT...\n');

  try {
    const client = await pool.connect();

    // Change icon column from VARCHAR(255) to TEXT
    await client.query(`
      ALTER TABLE skills 
      ALTER COLUMN icon TYPE TEXT
    `);
    console.log('✅ Changed "icon" column type to TEXT.');

    await client.release();
    await pool.end();
    
    console.log('\n✅ Migration completed successfully!');
    process.exit(0);
  } catch (error) {
    console.error('\n❌ Migration error:');
    console.error(error);
    process.exit(1);
  }
}

migrate();

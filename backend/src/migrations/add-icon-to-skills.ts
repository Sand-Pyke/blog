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
  console.log('🔄 Running migration: add icon column to skills table...\n');

  try {
    const client = await pool.connect();

    // Check if icon column exists
    const checkResult = await client.query(`
      SELECT column_name 
      FROM information_schema.columns 
      WHERE table_name = 'skills' AND column_name = 'icon'
    `);

    if (checkResult.rows.length > 0) {
      console.log('✅ Column "icon" already exists in skills table.');
    } else {
      // Add icon column
      await client.query(`
        ALTER TABLE skills 
        ADD COLUMN icon VARCHAR(255) DEFAULT NULL
      `);
      console.log('✅ Added "icon" column to skills table.');
    }

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

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
  console.log('🚀 Starting database initialization...\n');

  try {
    const client = await pool.connect();

    // Read the SQL initialization file
    const sqlFilePath = path.join(__dirname, '../init-database.sql');
    const sql = fs.readFileSync(sqlFilePath, 'utf-8');

    console.log('📝 Executing SQL script...');
    
    // Execute the entire SQL script at once
    try {
      await client.query(sql);
      console.log('✅ All SQL statements executed successfully!');
    } catch (error) {
      console.error('❌ Error executing SQL script:');
      console.error(error);
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

    console.log('\n📋 Tables created:');
    tablesResult.rows.forEach(row => {
      console.log(`  ✓ ${row.table_name}`);
    });

    // Check inserted data
    console.log('\n📊 Checking initial data...');

    const categoryCount = await client.query('SELECT COUNT(*) FROM blog_categories');
    console.log(`  Categories: ${categoryCount.rows[0].count}`);

    const tagCount = await client.query('SELECT COUNT(*) FROM blog_tags');
    console.log(`  Tags: ${tagCount.rows[0].count}`);

    await client.release();
    await pool.end();

    console.log('\n🎉 Database initialization completed successfully!');
    console.log('\nNext steps:');
    console.log('  1. Start the backend server: npm run dev');
    console.log('  2. Connect frontend to backend API');
    
    process.exit(0);
  } catch (error) {
    console.error('\n❌ Database initialization failed:');
    console.error(error);
    process.exit(1);
  }
}

initializeDatabase();
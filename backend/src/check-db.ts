import { Pool } from 'pg';
import dotenv from 'dotenv';
import * as fs from 'fs';

dotenv.config();

const pool = new Pool({
  host: process.env.DB_HOST,
  port: parseInt(process.env.DB_PORT || '5432'),
  database: process.env.DB_NAME,
  user: process.env.DB_USER,
  password: process.env.DB_PASSWORD,
});

async function checkDatabase() {
  console.log('🔍 Checking database structure...\n');

  try {
    const client = await pool.connect();

    // Check tables
    const tablesResult = await client.query(`
      SELECT table_name 
      FROM information_schema.tables 
      WHERE table_schema = 'public' 
      ORDER BY table_name
    `);

    console.log('📋 Existing tables:');
    if (tablesResult.rows.length === 0) {
      console.log('  No tables found in database.');
      console.log('\n⚠️  You need to initialize the database with database.sql');
      console.log('   Run the following command in pgAdmin or psql:');
      console.log('   psql -d blog_db -f database.sql');
    } else {
      tablesResult.rows.forEach(row => {
        console.log(`  ✓ ${row.table_name}`);
      });
    }

    console.log('\n📊 Checking table data...\n');

    // Check data in each table
    const tables = ['users', 'blog_categories', 'blog_tags', 'blog_posts', 'daily_entries', 'skills'];
    
    for (const table of tables) {
      const countResult = await client.query(`SELECT COUNT(*) FROM ${table}`);
      const count = countResult.rows[0].count;
      console.log(`  ${table}: ${count} records`);
    }

    // Show categories
    console.log('\n📂 Blog Categories:');
    const categoriesResult = await client.query('SELECT name, slug FROM blog_categories');
    categoriesResult.rows.forEach(row => {
      console.log(`  • ${row.name} (${row.slug})`);
    });

    // Show tags
    console.log('\n🏷️  Blog Tags:');
    const tagsResult = await client.query('SELECT name, slug FROM blog_tags');
    tagsResult.rows.forEach(row => {
      console.log(`  • ${row.name} (${row.slug})`);
    });

    await client.release();
    await pool.end();
    
    console.log('\n✅ Database check completed successfully!');
    process.exit(0);
  } catch (error) {
    console.error('\n❌ Error checking database:');
    console.error(error);
    process.exit(1);
  }
}

checkDatabase();
import { Pool } from 'pg'
import bcrypt from 'bcrypt'
import dotenv from 'dotenv'

dotenv.config()

const pool = new Pool({
  host: process.env.DB_HOST || 'localhost',
  port: parseInt(process.env.DB_PORT || '5432'),
  database: process.env.DB_NAME || 'wxh_blog',
  user: process.env.DB_USER || 'postgres',
  password: process.env.DB_PASSWORD || 'postgres'
})

// 固定的管理员账号
const ADMIN_USERNAME = 'admin'
const ADMIN_EMAIL = 'admin@wxh-blog.com'
const ADMIN_PASSWORD = 'wxh2024' // 可以修改为你想要的密码

async function createAdminUser() {
  try {
    // 检查是否已存在
    const existingUser = await pool.query(
      'SELECT * FROM users WHERE username = $1 OR email = $2',
      [ADMIN_USERNAME, ADMIN_EMAIL]
    )

    if (existingUser.rows.length > 0) {
      console.log('管理员账号已存在')
      return
    }

    // 加密密码
    const hashedPassword = await bcrypt.hash(ADMIN_PASSWORD, 10)

    // 创建管理员
    const result = await pool.query(
      `INSERT INTO users (username, email, password, bio) 
       VALUES ($1, $2, $3, $4) 
       RETURNING id, username, email, created_at`,
      [ADMIN_USERNAME, ADMIN_EMAIL, hashedPassword, '博客管理员']
    )

    console.log('管理员账号创建成功:')
    console.log({
      id: result.rows[0].id,
      username: ADMIN_USERNAME,
      email: ADMIN_EMAIL,
      password: ADMIN_PASSWORD
    })
    console.log('\n请妥善保管账号密码！')

  } catch (error) {
    console.error('创建管理员账号失败:', error)
  } finally {
    await pool.end()
  }
}

createAdminUser()
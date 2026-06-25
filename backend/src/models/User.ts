import { query } from '../config/db.js';
import { User } from '../types/index.js';
import bcrypt from 'bcrypt';

export const createUser = async (user: Omit<User, 'id' | 'created_at' | 'updated_at'>): Promise<User> => {
  const hashedPassword = await bcrypt.hash(user.password, 10);
  const result = await query(
    'INSERT INTO users (username, email, password, avatar, bio) VALUES ($1, $2, $3, $4, $5) RETURNING *',
    [user.username, user.email, hashedPassword, user.avatar, user.bio]
  );
  return result.rows[0];
};

export const getUserById = async (id: string): Promise<User | null> => {
  const result = await query('SELECT * FROM users WHERE id = $1', [id]);
  return result.rows[0] || null;
};

export const getUserByEmail = async (email: string): Promise<User | null> => {
  const result = await query('SELECT * FROM users WHERE email = $1', [email]);
  return result.rows[0] || null;
};

export const getUserByUsername = async (username: string): Promise<User | null> => {
  const result = await query('SELECT * FROM users WHERE username = $1', [username]);
  return result.rows[0] || null;
};

export const updateUser = async (id: string, user: Partial<Omit<User, 'id' | 'created_at' | 'updated_at'>>): Promise<User | null> => {
  const fields: string[] = [];
  const values: any[] = [];
  let paramIndex = 1;

  if (user.username !== undefined) {
    fields.push(`username = $${paramIndex++}`);
    values.push(user.username);
  }
  if (user.email !== undefined) {
    fields.push(`email = $${paramIndex++}`);
    values.push(user.email);
  }
  if (user.password !== undefined) {
    fields.push(`password = $${paramIndex++}`);
    values.push(await bcrypt.hash(user.password, 10));
  }
  if (user.avatar !== undefined) {
    fields.push(`avatar = $${paramIndex++}`);
    values.push(user.avatar);
  }
  if (user.bio !== undefined) {
    fields.push(`bio = $${paramIndex++}`);
    values.push(user.bio);
  }

  if (fields.length === 0) {
    return await getUserById(id);
  }

  values.push(id);
  const result = await query(
    `UPDATE users SET ${fields.join(', ')}, updated_at = NOW() WHERE id = $${paramIndex} RETURNING *`,
    values
  );
  return result.rows[0] || null;
};

export const deleteUser = async (id: string): Promise<boolean> => {
  const result = await query('DELETE FROM users WHERE id = $1', [id]);
  return (result.rowCount ?? 0) > 0;
};

export const verifyPassword = async (password: string, hashedPassword: string): Promise<boolean> => {
  return bcrypt.compare(password, hashedPassword);
};
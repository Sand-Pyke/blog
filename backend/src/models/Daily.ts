import { query } from '../config/db';
import { DailyEntry, DailyEntryWithAuthor } from '../types';

export const createDailyEntry = async (entry: Omit<DailyEntry, 'id' | 'created_at'>): Promise<DailyEntry> => {
  const result = await query(
    'INSERT INTO daily_entries (content, type, author_id, metadata) VALUES ($1, $2, $3, $4) RETURNING *',
    [entry.content, entry.type, entry.author_id, entry.metadata]
  );
  return result.rows[0];
};

export const getDailyEntryById = async (id: string): Promise<DailyEntry | null> => {
  const result = await query('SELECT * FROM daily_entries WHERE id = $1', [id]);
  return result.rows[0] || null;
};

export const getDailyEntryWithAuthor = async (id: string): Promise<DailyEntryWithAuthor | null> => {
  const result = await query(
    `SELECT 
      de.id,
      de.content,
      de.type,
      de.metadata,
      de.created_at,
      de.author_id,
      u.id as user_id, 
      u.username as author_username, 
      u.email as author_email, 
      u.avatar as author_avatar, 
      u.bio as author_bio
    FROM daily_entries de
    JOIN users u ON de.author_id = u.id
    WHERE de.id = $1`,
    [id]
  );

  if (result.rows.length === 0) return null;

  const row = result.rows[0];
  return {
    id: row.id,
    content: row.content,
    type: row.type,
    author_id: row.author_id,
    metadata: row.metadata,
    created_at: row.created_at,
    author: {
      id: row.user_id,
      username: row.author_username,
      email: row.author_email,
      password: '',
      avatar: row.author_avatar,
      bio: row.author_bio,
      created_at: row.created_at,
      updated_at: row.created_at,
    },
  };
};

export const getAllDailyEntries = async (): Promise<DailyEntry[]> => {
  const result = await query('SELECT * FROM daily_entries ORDER BY created_at DESC');
  return result.rows;
};

export const getDailyEntriesWithAuthor = async (page: number = 1, limit: number = 20): Promise<DailyEntryWithAuthor[]> => {
  const offset = (page - 1) * limit;
  const result = await query(
    `SELECT 
      de.id,
      de.content,
      de.type,
      de.metadata,
      de.created_at,
      de.author_id,
      u.id as user_id, 
      u.username as author_username, 
      u.email as author_email, 
      u.avatar as author_avatar, 
      u.bio as author_bio
    FROM daily_entries de
    JOIN users u ON de.author_id = u.id
    ORDER BY de.created_at DESC
    LIMIT $1 OFFSET $2`,
    [limit, offset]
  );

  return result.rows.map(row => ({
    id: row.id,
    content: row.content,
    type: row.type,
    author_id: row.author_id,
    metadata: row.metadata,
    created_at: row.created_at,
    author: {
      id: row.user_id,
      username: row.author_username,
      email: row.author_email,
      password: '',
      avatar: row.author_avatar,
      bio: row.author_bio,
      created_at: row.created_at,
      updated_at: row.created_at,
    },
  }));
};

export const getDailyEntriesByType = async (type: DailyEntry['type']): Promise<DailyEntry[]> => {
  const result = await query('SELECT * FROM daily_entries WHERE type = $1 ORDER BY created_at DESC', [type]);
  return result.rows;
};

export const getDailyEntriesByAuthor = async (authorId: string): Promise<DailyEntry[]> => {
  const result = await query('SELECT * FROM daily_entries WHERE author_id = $1 ORDER BY created_at DESC', [authorId]);
  return result.rows;
};

export const updateDailyEntry = async (id: string, entry: Partial<Omit<DailyEntry, 'id' | 'author_id' | 'created_at'>>): Promise<DailyEntry | null> => {
  const fields: string[] = [];
  const values: any[] = [];
  let paramIndex = 1;

  if (entry.content !== undefined) {
    fields.push(`content = $${paramIndex++}`);
    values.push(entry.content);
  }
  if (entry.type !== undefined) {
    fields.push(`type = $${paramIndex++}`);
    values.push(entry.type);
  }
  if (entry.metadata !== undefined) {
    fields.push(`metadata = $${paramIndex++}`);
    values.push(entry.metadata);
  }

  if (fields.length === 0) {
    return await getDailyEntryById(id);
  }

  values.push(id);
  const result = await query(
    `UPDATE daily_entries SET ${fields.join(', ')} WHERE id = $${paramIndex} RETURNING *`,
    values
  );
  return result.rows[0] || null;
};

export const deleteDailyEntry = async (id: string): Promise<boolean> => {
  const result = await query('DELETE FROM daily_entries WHERE id = $1', [id]);
  return (result.rowCount ?? 0) > 0;
};

export const countDailyEntries = async (): Promise<number> => {
  const result = await query('SELECT COUNT(*) FROM daily_entries');
  return parseInt(result.rows[0].count, 10);
};
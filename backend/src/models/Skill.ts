import { query } from '../config/db.js';
import { Skill } from '../types/index.js';

export const createSkill = async (skill: Omit<Skill, 'id' | 'created_at'>): Promise<Skill> => {
  const result = await query(
    'INSERT INTO skills (name, category, level, description, icon) VALUES ($1, $2, $3, $4, $5) RETURNING *',
    [skill.name, skill.category, skill.level, skill.description || null, skill.icon || null]
  );
  return result.rows[0];
};

export const getSkillById = async (id: string): Promise<Skill | null> => {
  const result = await query('SELECT * FROM skills WHERE id = $1', [id]);
  return result.rows[0] || null;
};

export const getAllSkills = async (): Promise<Skill[]> => {
  const result = await query('SELECT * FROM skills ORDER BY category, name');
  return result.rows;
};

export const getSkillsByCategory = async (category: string): Promise<Skill[]> => {
  const result = await query('SELECT * FROM skills WHERE category = $1 ORDER BY name', [category]);
  return result.rows;
};

export const updateSkill = async (id: string, skill: Partial<Omit<Skill, 'id' | 'created_at'>>): Promise<Skill | null> => {
  const fields: string[] = [];
  const values: any[] = [];
  let paramIndex = 1;

  if (skill.name !== undefined) {
    fields.push(`name = $${paramIndex++}`);
    values.push(skill.name);
  }
  if (skill.category !== undefined) {
    fields.push(`category = $${paramIndex++}`);
    values.push(skill.category);
  }
  if (skill.level !== undefined) {
    fields.push(`level = $${paramIndex++}`);
    values.push(skill.level);
  }
  if (skill.description !== undefined) {
    fields.push(`description = $${paramIndex++}`);
    values.push(skill.description);
  }
  if (skill.icon !== undefined) {
    fields.push(`icon = $${paramIndex++}`);
    values.push(skill.icon);
  }

  if (fields.length === 0) {
    return await getSkillById(id);
  }

  values.push(id);
  const result = await query(
    `UPDATE skills SET ${fields.join(', ')} WHERE id = $${paramIndex} RETURNING *`,
    values
  );
  return result.rows[0] || null;
};

export const deleteSkill = async (id: string): Promise<boolean> => {
  const result = await query('DELETE FROM skills WHERE id = $1', [id]);
  return (result.rowCount ?? 0) > 0;
};

export const getAllCategories = async (): Promise<string[]> => {
  const result = await query('SELECT DISTINCT category FROM skills ORDER BY category');
  return result.rows.map(row => row.category);
};
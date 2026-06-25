import express from 'express';
import { authenticateToken } from '../middleware/auth';
import {
  createSkill,
  getSkillById,
  getAllSkills,
  getSkillsByCategory,
  updateSkill,
  deleteSkill,
  getAllCategories,
} from '../models/Skill';

const router = express.Router();

router.get('/', async (req, res) => {
  try {
    const { category } = req.query;

    let skills;
    if (category) {
      skills = await getSkillsByCategory(category as string);
    } else {
      skills = await getAllSkills();
    }

    res.json(skills);
  } catch (error) {
        res.status(500).json({ error: 'Internal server error' });
  }
});

router.get('/categories', async (req, res) => {
  try {
    const categories = await getAllCategories();
    res.json(categories);
  } catch (error) {
        res.status(500).json({ error: 'Internal server error' });
  }
});

router.get('/:id', async (req, res) => {
  try {
    const id = req.params.id as string;
    const skill = await getSkillById(id);

    if (!skill) {
      return res.status(404).json({ error: 'Skill not found' });
    }

    res.json(skill);
  } catch (error) {
        res.status(500).json({ error: 'Internal server error' });
  }
});

router.post('/', authenticateToken, async (req, res) => {
  try {
    const { name, category, level, description, icon } = req.body;
        if (!name || !category || level === undefined) {
      return res.status(400).json({ error: 'Name, category, and level are required' });
    }

    const skill = await createSkill({ name, category, level, description: description || null, icon: icon || null });
    res.status(201).json(skill);
  } catch (error: any) {
        res.status(500).json({ error: error.message || 'Internal server error' });
  }
});

router.put('/:id', authenticateToken, async (req, res) => {
  try {
    const id = req.params.id as string;
    const { name, category, level, description, icon } = req.body;

        const updates: any = {};
    if (name) updates.name = name;
    if (category) updates.category = category;
    if (level !== undefined) updates.level = level;
    if (description !== undefined) updates.description = description;
    if (icon !== undefined) updates.icon = icon;

        const skill = await updateSkill(id, updates);
    if (!skill) {
      return res.status(404).json({ error: 'Skill not found' });
    }

    res.json(skill);
  } catch (error) {
        res.status(500).json({ error: 'Internal server error', details: (error as Error).message });
  }
});

router.delete('/:id', authenticateToken, async (req, res) => {
  try {
    const id = req.params.id as string;
    const deleted = await deleteSkill(id);

    if (!deleted) {
      return res.status(404).json({ error: 'Skill not found' });
    }

    res.json({ message: 'Skill deleted successfully' });
  } catch (error) {
        res.status(500).json({ error: 'Internal server error' });
  }
});

export default router;
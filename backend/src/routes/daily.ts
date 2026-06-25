import express from 'express';
import { authenticateToken } from '../middleware/auth';
import {
  createDailyEntry,
  getDailyEntryWithAuthor,
  getAllDailyEntries,
  getDailyEntriesWithAuthor,
  getDailyEntriesByType,
  updateDailyEntry,
  deleteDailyEntry,
  countDailyEntries,
} from '../models/Daily';

const router = express.Router();

router.get('/', async (req, res) => {
  try {
    const { page, limit, type } = req.query;
    
    let entries;
    if (type) {
      entries = await getDailyEntriesByType(type as 'text' | 'image' | 'code' | 'book');
    } else if (page || limit) {
      const pageNum = parseInt(page as string) || 1;
      const limitNum = parseInt(limit as string) || 20;
      entries = await getDailyEntriesWithAuthor(pageNum, limitNum);
    } else {
      entries = await getAllDailyEntries();
    }

    res.json(entries);
  } catch (error) {
        res.status(500).json({ error: 'Internal server error' });
  }
});

router.get('/count', async (req, res) => {
  try {
    const count = await countDailyEntries();
    res.json({ count });
  } catch (error) {
        res.status(500).json({ error: 'Internal server error' });
  }
});

router.get('/:id', async (req, res) => {
  try {
    const { id } = req.params;
    const entry = await getDailyEntryWithAuthor(id);

    if (!entry) {
      return res.status(404).json({ error: 'Entry not found' });
    }

    res.json(entry);
  } catch (error) {
        res.status(500).json({ error: 'Internal server error' });
  }
});

router.post('/', authenticateToken, async (req, res) => {
  try {
    const { content, type, metadata } = req.body;

    if (!content || !type) {
      return res.status(400).json({ error: 'Content and type are required' });
    }

    const entry = await createDailyEntry({
      content,
      type: type as 'text' | 'image' | 'code' | 'book',
      author_id: req.user!.userId,
      metadata,
    });

    res.status(201).json(entry);
  } catch (error) {
        res.status(500).json({ error: 'Internal server error' });
  }
});

router.put('/:id', authenticateToken, async (req, res) => {
  try {
    const id = req.params.id as string;
    const { content, type, metadata } = req.body;

    const updates: any = {};
    if (content) updates.content = content;
    if (type) updates.type = type;
    if (metadata !== undefined) updates.metadata = metadata;

    const entry = await updateDailyEntry(id, updates);
    if (!entry) {
      return res.status(404).json({ error: 'Entry not found' });
    }

    res.json(entry);
  } catch (error) {
        res.status(500).json({ error: 'Internal server error' });
  }
});

router.delete('/:id', authenticateToken, async (req, res) => {
  try {
    const id = req.params.id as string;
    const deleted = await deleteDailyEntry(id);

    if (!deleted) {
      return res.status(404).json({ error: 'Entry not found' });
    }

    res.json({ message: 'Entry deleted successfully' });
  } catch (error) {
        res.status(500).json({ error: 'Internal server error' });
  }
});

export default router;
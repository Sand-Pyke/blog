import express from 'express';
import { authenticateToken } from '../middleware/auth';
import {
  createBlogPost,
  getBlogPostWithRelations,
  getAllBlogPosts,
  getRecentPosts,
  updateBlogPost,
  incrementViews,
  deleteBlogPost,
} from '../models/Blog';

const router = express.Router();

router.get('/posts', async (req, res) => {
  try {
    const { status } = req.query;
    const posts = await getAllBlogPosts(status as string);
    res.json(posts);
  } catch (error) {
    res.status(500).json({ error: 'Internal server error' });
  }
});

router.get('/posts/recent', async (req, res) => {
  try {
    const limit = parseInt(req.query.limit as string) || 5;
    const posts = await getRecentPosts(limit);
    res.json(posts);
  } catch (error) {
    res.status(500).json({ error: 'Internal server error' });
  }
});

router.get('/posts/:slug', async (req, res) => {
  try {
    const { slug } = req.params;
    const post = await getBlogPostWithRelations(slug);

    if (!post) {
      return res.status(404).json({ error: 'Post not found' });
    }

    await incrementViews(post.id);
    res.json(post);
  } catch (error) {
    res.status(500).json({ error: 'Internal server error' });
  }
});

router.post('/posts', authenticateToken, async (req, res) => {
  try {
    const { title, slug, content, excerpt, status, published_at } = req.body;

    if (!title || !slug || !content) {
      return res.status(400).json({ error: 'Title, slug, and content are required' });
    }

    const post = await createBlogPost({
      title,
      slug,
      content,
      excerpt: excerpt || content.substring(0, 200),
      author_id: req.user!.userId,
      status: status || 'draft',
      published_at: status === 'published' ? (published_at || new Date()) : null,
    });

    res.status(201).json(post);
  } catch (error) {
    res.status(500).json({ error: 'Internal server error', details: (error as Error).message });
  }
});

router.put('/posts/:id', authenticateToken, async (req, res) => {
  try {
    const id = req.params.id as string;
    const { title, slug, content, excerpt, status, published_at } = req.body;

    const updates: any = {};
    if (title) updates.title = title;
    if (slug) updates.slug = slug;
    if (content) updates.content = content;
    if (excerpt) updates.excerpt = excerpt;
    if (status) updates.status = status;
    if (published_at) updates.published_at = published_at;
    if (status === 'published' && !published_at) updates.published_at = new Date();

    const post = await updateBlogPost(id, updates);
    if (!post) {
      return res.status(404).json({ error: 'Post not found' });
    }

    res.json(post);
  } catch (error) {
        res.status(500).json({ error: 'Internal server error' });
  }
});

router.delete('/posts/:id', authenticateToken, async (req, res) => {
  try {
    const id = req.params.id as string;
    const deleted = await deleteBlogPost(id);

    if (!deleted) {
      return res.status(404).json({ error: 'Post not found' });
    }

    res.json({ message: 'Post deleted successfully' });
  } catch (error) {
        res.status(500).json({ error: 'Internal server error' });
  }
});

export default router;

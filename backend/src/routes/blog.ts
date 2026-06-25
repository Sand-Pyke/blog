import express from 'express';
import { authenticateToken } from '../middleware/auth';
import {
  createBlogPost,
  getBlogPostWithRelations,
  getAllBlogPosts,
  getBlogPostsByCategory,
  getRecentPosts,
  updateBlogPost,
  incrementViews,
  deleteBlogPost,
  createCategory,
  getAllCategories,
  getCategoryBySlug,
  createTag,
  getAllTags,
  getTagBySlug,
  addPostTags,
  removePostTags,
  getPostsByTag,
  countPostsByCategory,
} from '../models/Blog';

const router = express.Router();

router.get('/posts', async (req, res) => {
  try {
    const { status, category, tag } = req.query;

    let posts;
    if (category) {
      posts = await getBlogPostsByCategory(category as string);
    } else if (tag) {
      posts = await getPostsByTag(tag as string);
    } else {
      posts = await getAllBlogPosts(status as string);
    }

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
    const { title, slug, content, excerpt, category_id, status, published_at, tags } = req.body;

    if (!title || !slug || !content || !category_id) {
      return res.status(400).json({ error: 'Title, slug, content, and category are required' });
    }

    const post = await createBlogPost({
      title,
      slug,
      content,
      excerpt: excerpt || content.substring(0, 200),
      category_id,
      author_id: req.user!.userId,
      status: status || 'draft',
      published_at: status === 'published' ? (published_at || new Date()) : null,
    });

    if (tags && tags.length > 0) {
      await addPostTags(post.id, tags);
    }

    res.status(201).json(post);
  } catch (error) {
    res.status(500).json({ error: 'Internal server error', details: (error as Error).message });
  }
});

router.put('/posts/:id', authenticateToken, async (req, res) => {
  try {
    const id = req.params.id as string;
    const { title, slug, content, excerpt, category_id, status, published_at, tags } = req.body;

    const updates: any = {};
    if (title) updates.title = title;
    if (slug) updates.slug = slug;
    if (content) updates.content = content;
    if (excerpt) updates.excerpt = excerpt;
    if (category_id) updates.category_id = category_id;
    if (status) updates.status = status;
    if (published_at) updates.published_at = published_at;
    if (status === 'published' && !published_at) updates.published_at = new Date();

    const post = await updateBlogPost(id, updates);
    if (!post) {
      return res.status(404).json({ error: 'Post not found' });
    }

    if (tags !== undefined) {
      await removePostTags(id);
      if (tags.length > 0) {
        await addPostTags(id, tags);
      }
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

router.get('/categories', async (req, res) => {
  try {
    const categories = await getAllCategories();
    const counts = await countPostsByCategory();

    const categoriesWithCount = categories.map(cat => ({
      ...cat,
      postCount: counts[cat.slug] || 0,
    }));

    res.json(categoriesWithCount);
  } catch (error) {
        res.status(500).json({ error: 'Internal server error' });
  }
});

router.get('/categories/:slug', async (req, res) => {
  try {
    const { slug } = req.params;
    const category = await getCategoryBySlug(slug);

    if (!category) {
      return res.status(404).json({ error: 'Category not found' });
    }

    res.json(category);
  } catch (error) {
        res.status(500).json({ error: 'Internal server error' });
  }
});

router.post('/categories', authenticateToken, async (req, res) => {
  try {
    const { name, slug, description } = req.body;

    if (!name || !slug) {
      return res.status(400).json({ error: 'Name and slug are required' });
    }

    const category = await createCategory({ name, slug, description });
    res.status(201).json(category);
  } catch (error) {
        res.status(500).json({ error: 'Internal server error' });
  }
});

router.get('/tags', async (req, res) => {
  try {
    const tags = await getAllTags();
    res.json(tags);
  } catch (error) {
        res.status(500).json({ error: 'Internal server error' });
  }
});

router.get('/tags/:slug', async (req, res) => {
  try {
    const { slug } = req.params;
    const tag = await getTagBySlug(slug);

    if (!tag) {
      return res.status(404).json({ error: 'Tag not found' });
    }

    res.json(tag);
  } catch (error) {
        res.status(500).json({ error: 'Internal server error' });
  }
});

router.post('/tags', authenticateToken, async (req, res) => {
  try {
    const { name, slug } = req.body;

    if (!name || !slug) {
      return res.status(400).json({ error: 'Name and slug are required' });
    }

    const tag = await createTag({ name, slug });
    res.status(201).json(tag);
  } catch (error) {
        res.status(500).json({ error: 'Internal server error' });
  }
});

export default router;
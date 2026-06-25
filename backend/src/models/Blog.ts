import { query } from '../config/db.js';
import { BlogPost, BlogCategory, BlogTag, BlogPostWithRelations } from '../types/index.js';

export const createBlogPost = async (post: Omit<BlogPost, 'id' | 'views' | 'created_at' | 'updated_at'>): Promise<BlogPost> => {
  // 处理 slug 重复的情况
  let slug = post.slug;
  let counter = 1;
  
  // 检查 slug 是否已存在，如果存在则添加后缀
  while (true) {
    const existingPost = await getBlogPostBySlug(slug);
    if (!existingPost) {
      break;
    }
    slug = `${post.slug}-${counter}`;
    counter++;
  }
  
  const result = await query(
    'INSERT INTO blog_posts (title, slug, content, excerpt, category_id, author_id, status, published_at) VALUES ($1, $2, $3, $4, $5, $6, $7, $8) RETURNING *',
    [post.title, slug, post.content, post.excerpt, post.category_id, post.author_id, post.status, post.published_at]
  );
  return result.rows[0];
};

export const getBlogPostById = async (id: string): Promise<BlogPost | null> => {
  const result = await query('SELECT * FROM blog_posts WHERE id = $1', [id]);
  return result.rows[0] || null;
};

export const getBlogPostBySlug = async (slug: string): Promise<BlogPost | null> => {
  const result = await query('SELECT * FROM blog_posts WHERE slug = $1', [slug]);
  return result.rows[0] || null;
};

export const getBlogPostWithRelations = async (slug: string): Promise<BlogPostWithRelations | null> => {
  const result = await query(
    `SELECT 
      bp.*,
      bc.id as category_id, bc.name as category_name, bc.slug as category_slug, bc.description as category_description,
      u.id as author_id, u.username as author_username, u.email as author_email, u.avatar as author_avatar, u.bio as author_bio
    FROM blog_posts bp
    JOIN blog_categories bc ON bp.category_id = bc.id
    JOIN users u ON bp.author_id = u.id
    WHERE bp.slug = $1`,
    [slug]
  );

  if (result.rows.length === 0) return null;

  const row = result.rows[0];
  const tags = await getPostTags(row.id);

  return {
    id: row.id,
    title: row.title,
    slug: row.slug,
    content: row.content,
    excerpt: row.excerpt,
    category_id: row.category_id,
    author_id: row.author_id,
    status: row.status,
    published_at: row.published_at,
    views: row.views,
    created_at: row.created_at,
    updated_at: row.updated_at,
    category: {
      id: row.category_id,
      name: row.category_name,
      slug: row.category_slug,
      description: row.category_description,
      created_at: row.created_at,
      updated_at: row.updated_at,
    },
    author: {
      id: row.author_id,
      username: row.author_username,
      email: row.author_email,
      password: '',
      avatar: row.author_avatar,
      bio: row.author_bio,
      created_at: row.created_at,
      updated_at: row.updated_at,
    },
    tags,
  };
};

export const getAllBlogPosts = async (status?: string): Promise<BlogPost[]> => {
  if (status) {
    const result = await query('SELECT * FROM blog_posts WHERE status = $1 ORDER BY published_at DESC', [status]);
    return result.rows;
  }
  const result = await query('SELECT * FROM blog_posts ORDER BY published_at DESC');
  return result.rows;
};

export const getBlogPostsByCategory = async (categorySlug: string): Promise<BlogPost[]> => {
  const result = await query(
    'SELECT bp.* FROM blog_posts bp JOIN blog_categories bc ON bp.category_id = bc.id WHERE bc.slug = $1 ORDER BY bp.published_at DESC',
    [categorySlug]
  );
  return result.rows;
};

export const getRecentPosts = async (limit: number = 5): Promise<BlogPost[]> => {
  const result = await query(
    'SELECT * FROM blog_posts WHERE status = $1 ORDER BY published_at DESC LIMIT $2',
    ['published', limit]
  );
  return result.rows;
};

export const updateBlogPost = async (id: string, post: Partial<Omit<BlogPost, 'id' | 'views' | 'created_at' | 'updated_at'>>): Promise<BlogPost | null> => {
  const fields: string[] = [];
  const values: any[] = [];
  let paramIndex = 1;

  if (post.title !== undefined) {
    fields.push(`title = $${paramIndex++}`);
    values.push(post.title);
  }
  if (post.slug !== undefined) {
    fields.push(`slug = $${paramIndex++}`);
    values.push(post.slug);
  }
  if (post.content !== undefined) {
    fields.push(`content = $${paramIndex++}`);
    values.push(post.content);
  }
  if (post.excerpt !== undefined) {
    fields.push(`excerpt = $${paramIndex++}`);
    values.push(post.excerpt);
  }
  if (post.category_id !== undefined) {
    fields.push(`category_id = $${paramIndex++}`);
    values.push(post.category_id);
  }
  if (post.status !== undefined) {
    fields.push(`status = $${paramIndex++}`);
    values.push(post.status);
  }
  if (post.published_at !== undefined) {
    fields.push(`published_at = $${paramIndex++}`);
    values.push(post.published_at);
  }

  if (fields.length === 0) {
    return await getBlogPostById(id);
  }

  values.push(id);
  const result = await query(
    `UPDATE blog_posts SET ${fields.join(', ')}, updated_at = NOW() WHERE id = $${paramIndex} RETURNING *`,
    values
  );
  return result.rows[0] || null;
};

export const incrementViews = async (id: string): Promise<void> => {
  await query('UPDATE blog_posts SET views = views + 1 WHERE id = $1', [id]);
};

export const deleteBlogPost = async (id: string): Promise<boolean> => {
  const result = await query('DELETE FROM blog_posts WHERE id = $1', [id]);
  return (result.rowCount ?? 0) > 0;
};

export const createCategory = async (category: Omit<BlogCategory, 'id' | 'created_at' | 'updated_at'>): Promise<BlogCategory> => {
  const result = await query(
    'INSERT INTO blog_categories (name, slug, description) VALUES ($1, $2, $3) RETURNING *',
    [category.name, category.slug, category.description]
  );
  return result.rows[0];
};

export const getAllCategories = async (): Promise<BlogCategory[]> => {
  const result = await query('SELECT * FROM blog_categories ORDER BY name');
  return result.rows;
};

export const getCategoryBySlug = async (slug: string): Promise<BlogCategory | null> => {
  const result = await query('SELECT * FROM blog_categories WHERE slug = $1', [slug]);
  return result.rows[0] || null;
};

export const createTag = async (tag: Omit<BlogTag, 'id' | 'created_at'>): Promise<BlogTag> => {
  const result = await query(
    'INSERT INTO blog_tags (name, slug) VALUES ($1, $2) RETURNING *',
    [tag.name, tag.slug]
  );
  return result.rows[0];
};

export const getAllTags = async (): Promise<BlogTag[]> => {
  const result = await query('SELECT * FROM blog_tags ORDER BY name');
  return result.rows;
};

export const getTagBySlug = async (slug: string): Promise<BlogTag | null> => {
  const result = await query('SELECT * FROM blog_tags WHERE slug = $1', [slug]);
  return result.rows[0] || null;
};

export const addPostTags = async (postId: string, tagIds: string[]): Promise<void> => {
  const values = tagIds.map((tagId, index) => `($1, $${index + 2})`).join(', ');
  const params = [postId, ...tagIds];
  await query(`INSERT INTO post_tags (post_id, tag_id) VALUES ${values}`, params);
};

export const removePostTags = async (postId: string): Promise<void> => {
  await query('DELETE FROM post_tags WHERE post_id = $1', [postId]);
};

export const getPostTags = async (postId: string): Promise<BlogTag[]> => {
  const result = await query(
    'SELECT bt.* FROM blog_tags bt JOIN post_tags pt ON bt.id = pt.tag_id WHERE pt.post_id = $1',
    [postId]
  );
  return result.rows;
};

export const getPostsByTag = async (tagSlug: string): Promise<BlogPost[]> => {
  const result = await query(
    `SELECT bp.* FROM blog_posts bp
     JOIN post_tags pt ON bp.id = pt.post_id
     JOIN blog_tags bt ON pt.tag_id = bt.id
     WHERE bt.slug = $1 ORDER BY bp.published_at DESC`,
    [tagSlug]
  );
  return result.rows;
};

export const countPostsByCategory = async (): Promise<Record<string, number>> => {
  const result = await query(
    'SELECT bc.slug, bc.name, COUNT(bp.id) as count FROM blog_categories bc LEFT JOIN blog_posts bp ON bc.id = bp.category_id GROUP BY bc.id, bc.slug, bc.name',
    []
  );
  const counts: Record<string, number> = {};
  result.rows.forEach(row => {
    counts[row.slug] = row.count;
  });
  return counts;
};
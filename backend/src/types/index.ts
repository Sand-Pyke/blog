export interface User {
  id: string;
  username: string;
  email: string;
  password: string;
  avatar: string | null;
  bio: string | null;
  created_at: Date;
  updated_at: Date;
}

export interface BlogPost {
  id: string;
  title: string;
  slug: string;
  content: string;
  excerpt: string;
  category_id: string;
  author_id: string;
  status: 'draft' | 'published';
  published_at: Date | null;
  views: number;
  created_at: Date;
  updated_at: Date;
}

export interface BlogCategory {
  id: string;
  name: string;
  slug: string;
  description: string | null;
  created_at: Date;
  updated_at: Date;
}

export interface BlogTag {
  id: string;
  name: string;
  slug: string;
  created_at: Date;
}

export interface PostTag {
  post_id: string;
  tag_id: string;
}

export interface DailyEntry {
  id: string;
  content: string;
  type: 'text' | 'image' | 'code' | 'book';
  author_id: string;
  metadata: Record<string, any> | null;
  created_at: Date;
}

export interface Skill {
  id: string;
  name: string;
  category: string;
  level: number;
  description: string | null;
  icon: string | null;
  created_at: Date;
}

export interface TokenPayload {
  userId: string;
  username: string;
}

export interface BlogPostWithRelations extends BlogPost {
  category: BlogCategory;
  author: User;
  tags: BlogTag[];
}

export interface DailyEntryWithAuthor extends DailyEntry {
  author: User;
}
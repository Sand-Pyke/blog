// 基础类型定义
export interface BaseEntity {
  id: string;
  createdAt: string;
  updatedAt: string;
}

// 用户信息
export interface User extends BaseEntity {
  name: string;
  username: string;
  email: string;
  avatar: string;
  bio: string;
  socialLinks: {
    github?: string;
    linkedin?: string;
    rss?: string;
  };
}

// 博客文章分类
export interface BlogCategory {
  id: string;
  name: string;
  slug: string;
  color: string;
}

// 博客文章标签
export interface BlogTag {
  id: string;
  name: string;
  slug: string;
}

// 博客文章
export interface BlogPost extends BaseEntity {
  title: string;
  slug: string;
  excerpt: string;
  content: string;
  coverImage?: string;
  author?: User;
  category?: BlogCategory | null;
  tags: (BlogTag | string)[];
  publishedAt: string;
  readingTime: number;
  views: number;
  status: 'draft' | 'published' | 'archived';
}

// 日常分享条目
export interface DailyEntry extends BaseEntity {
  content: string;
  images?: string[];
  tags: any;
  date: string;
  mood?: string;
  location?: string;
  codeSnippet?: string;
  bookCover?: string;
  title?: string;
}

// 技能卡�?
export interface Skill {
  id: string;
  name: string;
  category: string;
  level: number;
  description?: string | null;
  icon?: string | null;
}

// API响应基础类型
export interface ApiResponse<T = any> {
  success: boolean;
  data: T;
  message?: string;
  error?: string;
}

// 分页参数
export interface PaginationParams {
  page: number;
  pageSize: number;
  sortBy?: string;
  sortOrder?: 'asc' | 'desc';
}

// 分页响应
export interface PaginatedResponse<T> {
  items: T[];
  total: number;
  page: number;
  pageSize: number;
  totalPages: number;
}

// 博客文章列表查询参数
export interface BlogPostQuery extends PaginationParams {
  category?: string;
  tag?: string;
  search?: string;
  status?: 'draft' | 'published' | 'archived';
}

// 日常分享查询参数
export interface DailyEntryQuery extends PaginationParams {
  tag?: string;
  search?: string;
  startDate?: string;
  endDate?: string;
}

// 文章编辑器数�?
export interface EditorData {
  id?: string;
  title: string;
  content: string;
  excerpt: string;
  coverImage?: string;
  categoryId: string;
  tagIds: string[];
  status: 'draft' | 'published';
  publishedAt?: string;
}

// 导航菜单�?
export interface NavItem {
  label: string;
  path: string;
  icon?: string;
}
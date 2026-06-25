import type { ApiResponse, PaginatedResponse, BlogPost, BlogPostQuery, DailyEntry, DailyEntryQuery, User } from './index';

// API服务接口定义
export interface BlogService {
  // 获取文章列表
  getPosts(params: BlogPostQuery): Promise<ApiResponse<PaginatedResponse<BlogPost>>>;
  
  // 获取文章详情
  getPost(slug: string): Promise<ApiResponse<BlogPost>>;
  
  // 创建文章
  createPost(data: Partial<BlogPost>): Promise<ApiResponse<BlogPost>>;
  
  // 更新文章
  updatePost(id: string, data: Partial<BlogPost>): Promise<ApiResponse<BlogPost>>;
  
  // 删除文章
  deletePost(id: string): Promise<ApiResponse<void>>;
  
  // 获取分类列表
  getCategories(): Promise<ApiResponse<any[]>>;
  
  // 获取标签列表
  getTags(): Promise<ApiResponse<any[]>>;
}

export interface DailyService {
  // 获取日常分享列表
  getEntries(params: DailyEntryQuery): Promise<ApiResponse<PaginatedResponse<DailyEntry>>>;
  
  // 创建日常分享
  createEntry(data: Partial<DailyEntry>): Promise<ApiResponse<DailyEntry>>;
  
  // 更新日常分享
  updateEntry(id: string, data: Partial<DailyEntry>): Promise<ApiResponse<DailyEntry>>;
  
  // 删除日常分享
  deleteEntry(id: string): Promise<ApiResponse<void>>;
}

export interface UserService {
  // 获取当前用户信息
  getCurrentUser(): Promise<ApiResponse<User>>;
  
  // 更新用户信息
  updateUser(id: string, data: Partial<User>): Promise<ApiResponse<User>>;
  
  // 上传头像
  uploadAvatar(file: File): Promise<ApiResponse<{ url: string }>>;
}

export interface UploadService {
  // 上传图片
  uploadImage(file: File): Promise<ApiResponse<{ url: string }>>;
  
  // 上传文件
  uploadFile(file: File): Promise<ApiResponse<{ url: string }>>;
}

// 统一的API客户端接口
export interface ApiClient {
  blog: BlogService;
  daily: DailyService;
  user: UserService;
  upload: UploadService;
}
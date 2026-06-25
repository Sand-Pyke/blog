# 博客网站前端项目

## 项目概述
基于 Vue 3 + TypeScript + Tailwind CSS 构建的现代化博客网站前端项目。

## 技术栈
- **框架**: Vue 3 (Composition API)
- **语言**: TypeScript
- **样式**: Tailwind CSS
- **路由**: Vue Router
- **构建工具**: Vite
- **开发工具**: Vue DevTools

## 项目结构
```
frontend/
├── src/
│   ├── components/          # 公共组件
│   │   ├── TopNavBar.vue   # 顶部导航栏
│   │   ├── Footer.vue      # 页脚
│   │   ├── ReadingProgress.vue  # 阅读进度条
│   │   ├── SkillCard.vue   # 技能卡片
│   │   ├── BlogPostCard.vue # 博客文章卡片
│   │   └── HeroSection.vue # 英雄区域
│   ├── views/              # 页面组件
│   │   ├── HomeView.vue    # 首页
│   │   ├── BlogView.vue    # 博客列表页
│   │   ├── BlogDetailView.vue # 博客详情页
│   │   ├── DailyView.vue   # 日常分享页
│   │   └── EditorView.vue  # 编辑器页面
│   ├── types/              # TypeScript 类型定义
│   │   ├── index.ts        # 基础类型
│   │   └── api.ts          # API 接口类型
│   ├── router/             # 路由配置
│   │   └── index.ts
│   ├── assets/             # 静态资源
│   │   └── main.css        # 全局样式
│   ├── App.vue             # 根组件
│   └── main.ts             # 入口文件
├── public/                 # 公共资源
├── index.html              # HTML 模板
├── tailwind.config.js      # Tailwind 配置
├── postcss.config.js       # PostCSS 配置
├── vite.config.ts          # Vite 配置
└── package.json            # 项目依赖

## 核心功能

### 1. 首页 (HomeView)
- 个人介绍和英雄区域
- 技术栈展示
- 近期文章列表
- 响应式设计

### 2. 博客列表 (BlogView)
- 文章分类筛选
- 文章列表展示
- 分页功能
- 搜索和过滤

### 3. 博客详情 (BlogDetailView)
- 文章内容展示
- 代码高亮支持
- 作者信息
- 相关文章推荐
- 阅读进度条

### 4. 日常分享 (DailyView)
- 时间线布局
- 多种内容类型支持（文本、图片、代码、书籍）
- 响应式设计
- 无限滚动加载

### 5. 编辑器 (EditorView)
- 富文本编辑器
- 工具栏（加粗、斜体、列表、链接等）
- 文章分类和标签管理
- 自动保存功能
- 键盘快捷键支持

## TypeScript 类型系统

### 基础类型 (`types/index.ts`)
- `User`: 用户信息
- `BlogPost`: 博客文章
- `BlogCategory`: 文章分类
- `BlogTag`: 文章标签
- `DailyEntry`: 日常分享
- `Skill`: 技能信息
- `EditorData`: 编辑器数据

### API 接口类型 (`types/api.ts`)
- `BlogService`: 博客服务接口
- `DailyService`: 日常分享服务接口
- `UserService`: 用户服务接口
- `UploadService`: 上传服务接口
- `ApiClient`: 统一 API 客户端接口

## 样式系统

### Tailwind CSS 配置
- 自定义颜色系统（基于 Material Design 3）
- 自定义间距和字体
- 响应式设计
- 深色模式支持

### 全局样式
- 阅读进度条样式
- 时间线样式
- 编辑器样式
- 自定义滚动条

## 路由配置
```typescript
/                    # 首页
/blog                # 博客列表
/blog/:slug          # 博客详情
/daily               # 日常分享
/editor              # 编辑器
```

## 开发指南

### 安装依赖
```bash
npm install
```

### 启动开发服务器
```bash
npm run dev
```

### 构建生产版本
```bash
npm run build
```

### 类型检查
```bash
npm run type-check
```

## 组件使用说明

### 公共组件
所有公共组件都支持 TypeScript 类型检查，可以通过 props 传入数据。

### 页面组件
每个页面组件都包含完整的布局和功能，可以直接使用。

## 数据管理

当前使用 Mock 数据进行展示，后续需要：
1. 实现后端 API 集成
2. 添加状态管理（Pinia）
3. 实现数据缓存
4. 添加错误处理

## 性能优化

- 路由懒加载
- 组件按需加载
- 图片懒加载
- CSS 优化
- 代码分割

## 浏览器支持
- Chrome (最新版本)
- Firefox (最新版本)
- Safari (最新版本)
- Edge (最新版本)

## 下一步计划

### 后端开发
1. 创建 Node.js + Express 后端项目
2. 实现数据库设计
3. 开发 RESTful API
4. 实现用户认证
5. 文件上传功能

### 前端优化
1. 接入真实 API
2. 添加状态管理
3. 实现搜索功能
4. 添加评论系统
5. 优化 SEO

## 许可证
MIT License
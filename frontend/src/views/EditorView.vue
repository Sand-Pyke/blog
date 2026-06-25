<template>
  <div
    class="bg-gradient-to-b from-surface-container-low to-surface text-on-background font-body-md text-body-md selection:bg-secondary-container selection:text-on-secondary-container min-h-screen">
    <TopNavBar />

    <main class="pt-16 pb-stack-xl max-w-[1400px] mx-auto px-gutter md:px-0">
      <!-- Editor Column -->
      <section class="flex-1 flex flex-col items-center py-stack-lg">
        <div class="w-full max-w-[800px] flex flex-col gap-stack-md">
          <!-- Toolbar -->
          <div class="bg-surface-container-lowest border border-outline-variant/20 rounded-2xl p-3 shadow-sm">
            <div class="flex flex-wrap gap-1">
              <button @click="editor?.chain().focus().toggleBold().run()"
                :disabled="!editor?.can().chain().focus().toggleBold().run()"
                :class="{ 'bg-surface-container': editor?.isActive('bold') }"
                class="p-2 rounded-lg hover:bg-surface-container transition-colors disabled:opacity-50"
                title="加粗 (Ctrl+B)">
                <span class="material-symbols-outlined">format_bold</span>
              </button>
              <button @click="editor?.chain().focus().toggleItalic().run()"
                :disabled="!editor?.can().chain().focus().toggleItalic().run()"
                :class="{ 'bg-surface-container': editor?.isActive('italic') }"
                class="p-2 rounded-lg hover:bg-surface-container transition-colors disabled:opacity-50"
                title="斜体 (Ctrl+I)">
                <span class="material-symbols-outlined">format_italic</span>
              </button>
              <button @click="editor?.chain().focus().toggleStrike().run()"
                :disabled="!editor?.can().chain().focus().toggleStrike().run()"
                :class="{ 'bg-surface-container': editor?.isActive('strike') }"
                class="p-2 rounded-lg hover:bg-surface-container transition-colors disabled:opacity-50" title="删除�?>
                <span class="material-symbols-outlined">strikethrough_s</span>
              </button>
              <button @click="editor?.chain().focus().toggleHeading({ level: 2 }).run()"
                :class="{ 'bg-surface-container': editor?.isActive('heading', { level: 2 }) }"
                class="p-2 rounded-lg hover:bg-surface-container transition-colors" title="标题 H2">
                <span class="material-symbols-outlined text-sm font-bold">H2</span>
              </button>
              <button @click="editor?.chain().focus().toggleHeading({ level: 3 }).run()"
                :class="{ 'bg-surface-container': editor?.isActive('heading', { level: 3 }) }"
                class="p-2 rounded-lg hover:bg-surface-container transition-colors" title="标题 H3">
                <span class="material-symbols-outlined text-sm font-bold">H3</span>
              </button>
              <button @click="editor?.chain().focus().toggleCodeBlock().run()"
                :class="{ 'bg-surface-container-low': editor?.isActive('codeBlock') }"
                class="p-2 rounded hover:bg-surface-container-low transition-colors" title="代码�?>
                <span class="material-symbols-outlined">code</span>
              </button>
              <button @click="setLink" :class="{ 'bg-surface-container-low': editor?.isActive('link') }"
                class="p-2 rounded hover:bg-surface-container-low transition-colors" title="链接">
                <span class="material-symbols-outlined">link</span>
              </button>
              <button @click="triggerImageUpload" :disabled="isUploadingImage"
                class="p-2 rounded hover:bg-surface-container-low transition-colors disabled:opacity-50" title="上传图片">
                <span class="material-symbols-outlined" :class="{ 'animate-spin': isUploadingImage }">
                  {{ isUploadingImage ? 'sync' : 'image' }}
                </span>
              </button>
              <input type="file" ref="imageInput" @change="handleImageUpload" accept="image/*" class="hidden" />
              <button @click="editor?.chain().focus()?.setHorizontalRule().run()"
                class="p-2 rounded hover:bg-surface-container-low transition-colors" title="分割�?>
                <span class="material-symbols-outlined">horizontal_rule</span>
              </button>
              <button @click="editor?.chain().focus().undo().run()"
                :disabled="!editor?.can().chain().focus().undo().run()"
                class="p-2 rounded hover:bg-surface-container-low transition-colors disabled:opacity-50" title="撤销">
                <span class="material-symbols-outlined">undo</span>
              </button>
              <button @click="editor?.chain().focus().redo().run()"
                :disabled="!editor?.can().chain().focus().redo().run()"
                class="p-2 rounded hover:bg-surface-container-low transition-colors disabled:opacity-50" title="重做">
                <span class="material-symbols-outlined">redo</span>
              </button>
            </div>
            <div class="flex-1"></div>
            <div class="flex items-center gap-2 px-3 text-on-surface-variant font-label-xs">
              <span v-if="isUploadingImage" class="flex items-center gap-1">
                <span class="material-symbols-outlined text-[18px] animate-spin">sync</span>
                <span>上传�?..</span>
              </span>
            </div>
          </div>

          <!-- Title Input -->
          <input v-model="title"
            class="w-full bg-surface-container-lowest border border-outline-variant/20 rounded-xl p-4 font-headline-md text-headline-md placeholder:text-outline-variant outline-none focus:border-primary transition-colors shadow-sm"
            placeholder="在此输入文章标题..." type="text" />

          <!-- TipTap Editor -->
          <article
            class="bg-surface-container-lowest rounded-2xl min-h-[600px] shadow-sm border border-outline-variant/20 overflow-hidden">
            <EditorContent :editor="editor" class="prose prose-lg max-w-none p-stack-lg focus:outline-none" />
          </article>
        </div>
      </section>

      <!-- Sidebar - Fixed Position -->
      <aside class="fixed top-16 right-0 w-80 h-[calc(100vh-4rem)] overflow-y-auto p-6 hidden md:block">
        <div class="bg-surface-container-lowest rounded-2xl shadow-sm border border-outline-variant/20 p-4">
          <div class="flex flex-col gap-stack-sm mb-4">
            <h3 class="font-headline-md text-headline-md text-on-surface">发布设置</h3>
            <p class="text-on-surface-variant font-label-xs">管理文章的分类与可见�?/p>
          </div>

          <div class="flex flex-col gap-3 mb-4">
            <label class="font-label-xs text-primary font-bold uppercase tracking-wider">发布�?/label>
            <div class="flex gap-2">
              <button @click="postType = 'blog'" :class="[
                'flex-1 py-3 rounded-lg font-body-md transition-all border',
                postType === 'blog'
                  ? 'bg-primary text-on-primary border-primary shadow-sm'
                  : 'bg-surface-container text-on-surface-variant border-outline hover:border-primary'
              ]">
                博客文章
              </button>
              <button @click="postType = 'daily'" :class="[
                'flex-1 py-3 rounded-lg font-body-md transition-all border',
                postType === 'daily'
                  ? 'bg-primary text-on-primary border-primary shadow-sm'
                  : 'bg-surface-container text-on-surface-variant border-outline hover:border-primary'
              ]">
                日常分享
              </button>
            </div>
          </div>

          <!-- Category (only for blog) -->
          <div v-if="postType === 'blog'" class="flex flex-col gap-3 mb-4">
            <label class="font-label-xs text-primary font-bold uppercase tracking-wider">文章分类</label>
            <el-select :popper-options="{
              strategy: 'fixed'
            }" v-model="categoryId" placeholder="请选择分类" class="w-full">
              <el-option v-for="category in categories" :key="category.id" :label="category.name"
                :value="category.id" />
            </el-select>
          </div>
          <div v-if="postType === 'daily'" class="flex flex-col gap-3 mb-4">
            <label class="font-label-xs text-primary font-bold uppercase tracking-wider">分享类型</label>
            <el-select :popper-options="{
              strategy: 'fixed'
            }" v-model="dailyType" placeholder="请选择类型" class="w-full">
              <el-option label="文字" value="text" />
              <el-option label="图片" value="image" />
              <el-option label="代码片段" value="code" />
              <el-option label="读书笔记" value="book" />
            </el-select>
          </div>

          <!-- Tags -->
          <div class="flex flex-col gap-3 mb-4">
            <label class="font-label-xs text-primary font-bold uppercase tracking-wider">标签</label>
            <div class="flex flex-wrap gap-2">
              <span v-for="(tag, index) in tagIds" :key="index"
                class="px-3 py-1 bg-surface-container-high rounded-full font-code-sm text-on-surface-variant flex items-center gap-1">
                {{ getTagName(tag) }}
                <button @click="removeTag(index)" class="hover:text-error">
                  <span class="material-symbols-outlined text-[14px]">close</span>
                </button>
              </span>
              <button @click="showTagSelector = !showTagSelector"
                class="px-3 py-1 border border-dashed border-outline rounded-full font-code-sm text-on-surface-variant hover:border-primary hover:text-primary transition-colors flex items-center gap-1">
                <span class="material-symbols-outlined text-[14px]">add</span> 添加
              </button>
            </div>
            <!-- Tag Selector Dropdown -->
            <div v-if="showTagSelector"
              class="p-3 bg-surface-container-lowest border border-outline-variant rounded-lg">
              <div class="flex flex-wrap gap-2">
                <button v-for="tag in availableTags.filter(t => !tagIds.includes(t.id))" :key="tag.id"
                  @click="addTag(tag.id)"
                  class="px-2 py-1 text-xs bg-surface-container rounded hover:bg-surface-container-high transition-colors">
                  + {{ tag.name }}
                </button>
              </div>
            </div>
          </div>

          <!-- Error/Success Messages -->
          <div v-if="errorMessage" class="p-3 bg-error-container text-on-error-container rounded-lg text-sm">
            {{ errorMessage }}
          </div>
          <div v-if="successMessage" class="p-3 bg-tertiary-container text-on-tertiary-container rounded-lg text-sm">
            {{ successMessage }}
          </div>

          <div class="mt-auto pt-stack-lg border-t border-outline-variant/30 flex flex-col gap-3">
            <button @click="publishPost" :disabled="isPublishing || !isValidPost"
              class="w-full py-4 bg-primary text-on-primary font-headline-md rounded-xl hover:bg-primary/90 transition-all active:scale-[0.98] shadow-lg shadow-primary/20 disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2">
              <span v-if="isPublishing" class="flex items-center gap-2">
                发布�?..
                <svg class="animate-spin h-4 w-4" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                  <circle class="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" stroke-width="4"></circle>
                  <path class="opacity-75" fill="currentColor"
                    d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z">
                  </path>
                </svg>
              </span>
              <span v-else>发布{{ postType === 'blog' ? '文章' : '日常' }}</span>
            </button>
          </div>
        </div>
      </aside>
    </main>

    <Footer />
  </div>
</template>

<script setup lang="ts">
import { ref, computed, onMounted, onUnmounted, watch, onBeforeUnmount } from 'vue';
import { useRouter } from 'vue-router';
import { useEditor, EditorContent } from '@tiptap/vue-3';
import StarterKit from '@tiptap/starter-kit';
import Placeholder from '@tiptap/extension-placeholder';
import Link from '@tiptap/extension-link';
import Image from '@tiptap/extension-image';
import CodeBlockLowlight from '@tiptap/extension-code-block-lowlight';
import { common, createLowlight } from 'lowlight';
import { useAuthStore } from '../stores/auth';
import TopNavBar from '../components/TopNavBar.vue';
import Footer from '../components/Footer.vue';

const lowlight = createLowlight(common);

const router = useRouter();
const authStore = useAuthStore();

const title = ref('');
const postType = ref<'blog' | 'daily'>('blog');
const categoryId = ref('');
const dailyType = ref<'text' | 'image' | 'code' | 'book'>('text');
const tagIds = ref<string[]>([]);
const showTagSelector = ref(false);
const isPublishing = ref(false);
const errorMessage = ref('');
const successMessage = ref('');
const imageInput = ref<HTMLInputElement | null>(null);
const isUploadingImage = ref(false);

const categories = ref<{ id: string; name: string; slug: string }[]>([]);
const availableTags = ref<{ id: string; name: string; slug: string }[]>([]);

const API_BASE_URL = import.meta.env.VITE_API_URL || '/api';

// TipTap Editor
const editor = useEditor({
  content: '',
  extensions: [
    StarterKit.configure({
      codeBlock: false, // 禁用默认�?code block，使�?lowlight 版本
    }),
    Placeholder.configure({
      placeholder: '开始你的创�?.. 支持 Markdown 语法�?,
    }),
    Link.configure({
      openOnClick: false,
      autolink: true,
      linkOnPaste: true,
      HTMLAttributes: {
        class: 'text-primary underline cursor-pointer',
        target: '_blank',
        rel: 'noopener noreferrer',
      },
    }),
    Image.configure({
      HTMLAttributes: {
        class: 'max-w-full rounded-lg lazyload',
        loading: 'lazy',
        decoding: 'async',
      },
    }),
    CodeBlockLowlight.configure({
      lowlight,
      HTMLAttributes: {
        class: 'bg-surface-container-high rounded-lg p-4 font-code-sm',
      },
    }),
  ],
  editorProps: {
    attributes: {
      class: 'focus:outline-none min-h-[500px]',
    },
  },
});

const userInitials = computed(() => {
  const username = authStore.user?.username || 'U';
  return username.substring(0, 2).toUpperCase();
});

const isValidPost = computed(() => {
  if (!title.value.trim().length > 0) return false;
  if (!editor.value) return false;

  // 检查是否有内容（包括图片）
  const content = editor.value.getHTML();
  const hasText = editor.value.getText().trim().length > 0;
  const hasImages = content.includes('<img');

  return hasText || hasImages;
});

// Fetch categories and tags
const fetchCategories = async () => {
  try {
    const response = await fetch(`${API_BASE_URL}/blog/categories`);
    if (response.ok) {
      categories.value = await response.json();
      if (categories.value.length > 0 && !categoryId.value) {
        categoryId.value = categories.value[0].id;
      }
    }
  } catch (error) {
      }
};

const fetchTags = async () => {
  try {
    const response = await fetch(`${API_BASE_URL}/blog/tags`);
    if (response.ok) {
      availableTags.value = await response.json();
    }
  } catch (error) {
      }
};

// Link handler
const setLink = () => {
  const previousUrl = editor.value?.getAttributes('link').href;
  const url = window.prompt('请输入链接地址', previousUrl);

  // cancelled
  if (url === null) {
    return;
  }

  // empty
  if (url === '') {
    editor.value?.chain().focus().extendMarkRange('link').unsetLink().run();
    return;
  }

  // update link
  editor.value?.chain().focus().extendMarkRange('link').setLink({ href: url }).run();
};

// Image upload handler
const triggerImageUpload = () => {
  imageInput.value?.click();
};

const handleImageUpload = async (event: Event) => {
  const input = event.target as HTMLInputElement;
  const file = input.files?.[0];

  if (!file) return;

  // Validate file type
  if (!file.type.startsWith('image/')) {
    errorMessage.value = '请选择图片文件';
    setTimeout(() => errorMessage.value = '', 3000);
    return;
  }

  // Validate file size (max 5MB)
  if (file.size > 5 * 1024 * 1024) {
    errorMessage.value = '图片大小不能超过 5MB';
    setTimeout(() => errorMessage.value = '', 3000);
    return;
  }

  isUploadingImage.value = true;
  errorMessage.value = '';
  successMessage.value = '';

  try {
    const formData = new FormData();
    formData.append('image', file);

    // 创建超时控制�?
    const timeoutController = new AbortController();
    const timeoutId = setTimeout(() => {
      timeoutController.abort();
    }, 10000); // 10秒超�?

    const response = await fetch(`${API_BASE_URL}/upload/image`, {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${authStore.token}`
      },
      body: formData,
      signal: timeoutController.signal
    });

    clearTimeout(timeoutId);

    if (!response.ok) {
      const data = await response.json();
      throw new Error(data.error || '上传失败');
    }

    const data = await response.json();
    // 使用返回的URL路径
    const imageUrl = data.url;

    if (imageUrl) {
      editor.value?.chain().focus().setImage({ src: imageUrl }).focus().run();
      successMessage.value = '图片上传成功';
      setTimeout(() => successMessage.value = '', 2000);
    }
  } catch (error: any) {
        if (error.name === 'AbortError') {
      errorMessage.value = '上传超时，请重试';
    } else {
      errorMessage.value = error.message || '图片上传失败';
    }
    setTimeout(() => errorMessage.value = '', 3000);
  } finally {
    isUploadingImage.value = false;
    // Clear input
    input.value = '';
  }
};

// Tag handlers
const getTagName = (tagId: string) => {
  const tag = availableTags.value.find(t => t.id === tagId);
  return tag?.name || tagId;
};

const addTag = (tagId: string) => {
  if (!tagIds.value.includes(tagId)) {
    tagIds.value.push(tagId);
  }
  showTagSelector.value = false;
};

const removeTag = (index: number) => {
  tagIds.value.splice(index, 1);
};

// Generate slug from title
const generateSlug = (text: string) => {
  return text
    .toLowerCase()
    .replace(/\s+/g, '-')
    .replace(/[^\w\-\u4e00-\u9fa5]/g, '') // 支持中文
    .substring(0, 50);
};

// Publish post
const publishPost = async () => {
  if (!isValidPost.value) {
    errorMessage.value = '请填写标题和内容';
    return;
  }

  if (postType.value === 'blog' && !categoryId.value) {
    errorMessage.value = '请选择文章分类';
    return;
  }

  isPublishing.value = true;
  errorMessage.value = '';
  successMessage.value = '';

  try {
    const content = editor.value?.getHTML() || '';
    const text = editor.value?.getText().substring(0, 200) || '';

    if (postType.value === 'blog') {
      // Publish to blog
      const slugValue = generateSlug(title.value) || `post-${Date.now()}`;

      const response = await fetch(`${API_BASE_URL}/blog/posts`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${authStore.token}`
        },
        body: JSON.stringify({
          title: title.value,
          slug: slugValue,
          content,
          excerpt: text,
          category_id: categoryId.value,
          tags: tagIds.value,
          status: 'published'
        })
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.error || data.details || '发布失败');
      }

      successMessage.value = '文章发布成功�?;

      // Clear editor and navigate to home
      setTimeout(() => {
        title.value = '';
        editor.value?.commands.setContent('');
        tagIds.value = [];
        successMessage.value = '';
        router.push('/');
      }, 1500);
    } else {
      // Publish to daily
      const response = await fetch(`${API_BASE_URL}/daily`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${authStore.token}`
        },
        body: JSON.stringify({
          content: content || title.value,
          type: dailyType.value,
          metadata: JSON.stringify({
            title: title.value,
            html: content,
            tags: tagIds.value,
            images: []
          })
        })
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.error || '发布失败');
      }

      successMessage.value = '日常分享发布成功�?;

      // Clear editor and navigate to daily page
      setTimeout(() => {
        title.value = '';
        editor.value?.commands.setContent('');
        tagIds.value = [];
        successMessage.value = '';
        router.push('/daily');
      }, 1500);
    }
  } catch (error: any) {
        errorMessage.value = error.message || '发布失败，请稍后重试';
  } finally {
    isPublishing.value = false;
  }
};

// Reset category when switching post type
watch(postType, (newType) => {
  if (newType === 'blog' && categories.value.length > 0 && !categoryId.value) {
    categoryId.value = categories.value[0].id;
  }
});

const handleLogout = () => {
  authStore.logout();
  router.push('/login');
};

onMounted(() => {
  fetchCategories();
  fetchTags();
});

onBeforeUnmount(() => {
  editor.value?.destroy();
});
</script>

<style scoped>
.material-symbols-outlined {
  font-variation-settings: 'FILL' 0, 'wght' 400, 'GRAD' 0, 'opsz' 24;
  display: inline-block;
  vertical-align: middle;
}

/* TipTap Editor Styles */
.prose {
  color: theme('colors.on-surface');
}

.prose h2 {
  color: theme('colors.on-surface');
  font-size: 1.5em;
  font-weight: 700;
  margin-top: 1.5em;
  margin-bottom: 0.5em;
}

.prose h3 {
  color: theme('colors.on-surface');
  font-size: 1.25em;
  font-weight: 600;
  margin-top: 1.25em;
  margin-bottom: 0.5em;
}

.prose p {
  margin-bottom: 1em;
  line-height: 1.75;
}

.prose ul,
.prose ol {
  padding-left: 1.5em;
  margin-bottom: 1em;
}

.prose li {
  margin-bottom: 0.25em;
}

.prose blockquote {
  border-left: 3px solid theme('colors.primary');
  padding-left: 1em;
  color: theme('colors.on-surface-variant');
  font-style: italic;
}

.prose code {
  background: theme('colors.surface-container-high');
  padding: 0.2em 0.4em;
  border-radius: 0.25em;
  font-size: 0.9em;
}

.prose pre {
  background: theme('colors.surface-container-high');
  padding: 1em;
  border-radius: 0.5em;
  overflow-x: auto;
}

.prose pre code {
  background: transparent;
  padding: 0;
}

.prose a {
  color: theme('colors.primary');
  text-decoration: underline;
}

.prose img {
  max-width: 100%;
  border-radius: 0.5em;
  margin: 1em 0;
}

.prose hr {
  border: none;
  border-top: 1px solid theme('colors.outline-variant');
  margin: 2em 0;
}

/* Placeholder */
.prose p.is-editor-empty:first-child::before {
  color: theme('colors.outline');
  content: attr(data-placeholder);
  float: left;
  height: 0;
  pointer-events: none;
}
</style>
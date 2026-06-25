<template>
  <div class="text-on-surface font-body-md selection:bg-primary-fixed selection:text-on-primary-fixed min-h-screen">
    <TopNavBar />

    <!-- Loading State -->
    <main v-if="loading" class="pt-32 pb-stack-xl px-gutter max-w-container-max mx-auto">
      <div class="animate-pulse space-y-6">
        <div class="h-4 w-40 bg-surface-container rounded"></div>
        <div class="h-12 w-3/4 bg-surface-container rounded"></div>
        <div class="h-4 w-full bg-surface-container rounded"></div>
        <div class="h-64 w-full bg-surface-container rounded-xl"></div>
        <div class="h-4 w-full bg-surface-container rounded"></div>
        <div class="h-4 w-5/6 bg-surface-container rounded"></div>
      </div>
    </main>

    <!-- Error State -->
    <main v-else-if="error" class="pt-32 pb-stack-xl px-gutter max-w-container-max mx-auto text-center">
      <p class="text-error text-lg mb-4">{{ error }}</p>
      <router-link to="/blog" class="px-4 py-2 bg-primary text-white rounded-lg hover:bg-primary/90">
        返回博客列表
      </router-link>
    </main>

    <!-- Article Content -->
    <main v-else class="pt-32 pb-stack-xl px-gutter max-w-container-max mx-auto">
      <!-- Article Card -->
      <div class="bg-surface-container-lowest rounded-2xl shadow-sm border border-outline-variant/20 p-6 md:p-8">
        <!-- Article Header -->
        <header class="mb-stack-lg animate-in fade-in slide-in-from-bottom-4 duration-700">
          <div class="flex items-center justify-between mb-stack-sm">
            <div class="flex flex-wrap gap-2">
              <span v-for="tag in post.tags" :key="tag.id"
                class="px-2 py-0.5 bg-surface-container-high rounded-lg font-code-sm text-label-xs text-secondary">
                {{ tag.name?.toUpperCase() || tag.toString().toUpperCase() }}
              </span>
            </div>

            <!-- Delete Button (only for logged in users) -->
            <button v-if="authStore.isAuthenticated" @click="handleDelete" :disabled="isDeleting"
              class="px-3 py-1.5 text-label-xs font-label-xs text-error border border-error/50 rounded-lg hover:bg-error/10 transition-colors disabled:opacity-50 disabled:cursor-not-allowed flex items-center gap-1">
              <span class="material-symbols-outlined text-[16px]">delete</span>
              <span>{{ isDeleting ? '删除中...' : '删除' }}</span>
            </button>
          </div>

          <h1 class="font-display-lg text-display-lg-mobile md:text-display-lg text-on-surface tracking-tight mb-4">
            {{ post.title }}
          </h1>
          <div class="flex items-center gap-4 text-on-surface-variant font-label-xs tracking-wider">
            <time :datetime="post.publishedAt">{{ formatDate(post.publishedAt) }}</time>
            <span class="w-1 h-1 bg-outline-variant rounded-full"></span>
            <span>阅读时长 {{ post.readingTime }} 分钟</span>
            <span class="w-1 h-1 bg-outline-variant rounded-full"></span>
            <span>{{ post.views }} 次阅读</span>
          </div>
        </header>

        <!-- Article Featured Image -->
        <figure v-if="post.coverImage" class="mb-stack-lg">
          <div
            class="relative w-full aspect-video rounded-xl overflow-hidden shadow-sm border border-outline-variant/20">
            <img :src="post.coverImage" :alt="post.title" class="w-full h-full object-cover" />
          </div>
          <figcaption class="mt-stack-sm text-center text-on-surface-variant font-label-xs italic opacity-70">
            图 1：{{ post.title }}
          </figcaption>
        </figure>
        <!-- Article Content -->
        <article
          class="prose prose-slate max-w-none prose-headings:font-headline-md prose-headings:text-on-surface prose-p:text-on-surface-variant prose-p:font-body-lg prose-p:leading-relaxed space-y-stack-md">
          <div v-html="post.content"></div>
        </article>
      </div><!-- End Article Card -->

      <!-- Related Posts -->
      <section v-if="relatedPosts.length > 0" class="mt-stack-xl pt-stack-lg border-t border-outline-variant/30">
        <h2 class="font-headline-md text-headline-md text-on-surface mb-stack-lg">相关文章</h2>
        <div class="grid grid-cols-1 md:grid-cols-2 gap-stack-lg">
          <article v-for="relatedPost in relatedPosts" :key="relatedPost.id" class="group">
            <router-link :to="`/blog/${relatedPost.slug}`" class="block">
              <!-- Cover Image -->
              <div class="aspect-video rounded-lg overflow-hidden mb-3">
                <img v-if="relatedPost.coverImage" :src="relatedPost.coverImage" :alt="relatedPost.title"
                  class="w-full h-full object-cover transition-transform duration-500 group-hover:scale-105" />
              </div>
              <!-- Title and Excerpt -->
              <h3 class="font-headline-md text-headline-md text-on-surface group-hover:text-primary transition-colors mb-2">
                {{ relatedPost.title }}
              </h3>
              <p class="text-on-surface-variant text-sm line-clamp-2">
                {{ relatedPost.excerpt }}
              </p>
            </router-link>
          </article>
        </div>
      </section>
    </main>

    <!-- Delete Confirm Dialog -->
    <DeleteConfirm v-model:visible="showDeleteConfirm" title="删除确认" message="确定要删除这篇文章吗？" sub-message="此操作不可恢复"
      confirm-text="删除" :loading="isDeleting" @confirm="handleDeleteConfirm" @cancel="handleDeleteCancel" />

    <Footer />
  </div>
</template>

<script setup lang="ts">
import { ref, onMounted, computed, watch } from 'vue';
import { useRoute, useRouter } from 'vue-router';
import { ElMessage } from 'element-plus';
import TopNavBar from '../components/TopNavBar.vue';
import Footer from '../components/Footer.vue';
import DeleteConfirm from '../components/DeleteConfirm.vue';
import { api } from '../services/api';
import { useAuthStore } from '../stores/auth';
import { useScrollLock } from '@vueuse/core';
import type { BlogPost } from '../types';

const route = useRoute();
const router = useRouter();
const authStore = useAuthStore();

const loading = ref(true);
const error = ref('');
const isDark = ref(document.documentElement.classList.contains('dark'));
const backgroundColor = computed(() => getComputedStyle(document.documentElement).getPropertyValue('--color-background').trim() || (isDark.value ? '#191c1e' : '#f7f9fb'));

const isDeleting = ref(false);
const showDeleteConfirm = ref(false);
const isLocked = useScrollLock(document.documentElement);

watch(showDeleteConfirm, (val) => {
  isLocked.value = val;
});
const post = ref<any>({
  id: '',
  title: '',
  slug: '',
  excerpt: '',
  content: '',
  coverImage: '',
  author: {},
  category: null,
  tags: [],
  publishedAt: '',
  readingTime: 0,
  views: 0,
  status: 'published',
  createdAt: '',
  updatedAt: ''
});

const relatedPosts = ref<BlogPost[]>([]);

const fetchBlog = async () => {
  const slug = route.params.slug as string;

  try {
    loading.value = true;
    error.value = '';

    const response = await api.getBlogBySlug(slug);

    post.value = {
      id: response.id?.toString() || '',
      title: response.title || '',
      slug: response.slug || slug,
      excerpt: response.excerpt || '',
      content: response.content || '',
      coverImage: response.cover_image || '',
      author: response.author || {},
      category: response.category ? {
        id: response.category.toString(),
        name: response.category,
        slug: response.category,
        color: '#42b883'
      } : null,
      tags: response.tags || [],
      publishedAt: response.created_at || response.publishedAt,
      readingTime: Math.ceil((response.content?.length || 500) / 500),
      views: response.views || 0,
      status: response.status,
      createdAt: response.created_at,
      updatedAt: response.updated_at
    };

    // Fetch related posts
    await fetchRelatedPosts();
  } catch (err: any) {
    error.value = err.message || '文章不存在';
    console.error('Failed to fetch blog:', err);
  } finally {
    loading.value = false;
  }
};

const fetchRelatedPosts = async () => {
  try {
    const response = await api.getBlogs({ status: 'published' });
    const blogsData = Array.isArray(response) ? response : response.blogs || [];

    relatedPosts.value = blogsData
      .filter((blog: any) => blog.slug !== post.value.slug)
      .slice(0, 2)
      .map((blog: any) => ({
        id: blog.id?.toString() || '',
        title: blog.title || '',
        slug: blog.slug || '',
        excerpt: blog.excerpt || '',
        content: blog.content || '',
        // 从 content 中提取图片 src
        coverImage: blog.content?.match(/<img[^>]+src=["']([^"']+)["']/)?.[1] || '',
        author: blog.author || {},
        category: blog.category ? {
          id: blog.category.toString(),
          name: blog.category,
          slug: blog.category,
          color: '#42b883'
        } : null,
        tags: blog.tags || [],
        publishedAt: blog.created_at || blog.publishedAt,
        readingTime: Math.ceil((blog.content?.length || 500) / 500),
        views: blog.views || 0,
        status: blog.status,
        createdAt: blog.created_at,
        updatedAt: blog.updated_at
      }));
  } catch (err) {
    console.error('Failed to fetch related posts:', err);
  }
};

const handleDelete = () => {
  showDeleteConfirm.value = true;
};

const handleDeleteConfirm = async () => {
  isDeleting.value = true;

  try {
    await api.deleteBlog(post.value.id);

    ElMessage.success('文章删除成功');
    showDeleteConfirm.value = false;
    router.push('/blog');
  } catch (err: any) {
    console.error('Failed to delete blog:', err);
    ElMessage.error('删除失败，请重试');
  } finally {
    isDeleting.value = false;
  }
};

const handleDeleteCancel = () => {
  showDeleteConfirm.value = false;
};

const formatDate = (dateString: string) => {
  if (!dateString) return '';
  const date = new Date(dateString);
  return date.toLocaleDateString('zh-CN', {
    year: 'numeric',
    month: 'long',
    day: 'numeric'
  });
};

watch(
  () => route.params.slug,
  () => {
    fetchBlog();
  }
);

onMounted(() => {
  fetchBlog();
});
</script>

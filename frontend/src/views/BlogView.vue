<template>
  <div
    class="font-body-md text-body-md antialiased bg-gradient-to-b from-surface-container-low to-surface min-h-screen">
    <TopNavBar />

    <main class="pt-24 pb-stack-xl max-w-container-max mx-auto px-gutter md:px-0">
      <!-- Page Header -->
      <section class="mb-stack-lg">
        <div class="bg-surface-container-lowest rounded-2xl shadow-sm border border-outline-variant/20 p-6 md:p-8">
          <h1 class="font-display-lg text-display-lg-mobile md:text-display-xl mb-stack-sm">
            Code Review
          </h1>
        </div>
      </section>

      <!-- Loading State -->
      <div v-if="loading" class="space-y-stack-lg">
        <div v-for="i in 5" :key="i"
          class="bg-surface-container-lowest rounded-2xl shadow-sm border border-outline-variant/20 p-6 animate-pulse">
          <div class="grid grid-cols-1 md:grid-cols-[1fr_240px] gap-gutter">
            <div class="order-2 md:order-1">
              <div class="h-4 w-20 bg-surface-container rounded mb-2"></div>
              <div class="h-6 w-3/4 bg-surface-container rounded mb-2"></div>
              <div class="h-4 w-full bg-surface-container rounded mb-1"></div>
              <div class="h-4 w-2/3 bg-surface-container rounded mb-3"></div>
              <div class="h-4 w-1/2 bg-surface-container rounded"></div>
            </div>
            <div class="order-1 md:order-2">
              <div class="w-full aspect-video rounded bg-surface-container"></div>
            </div>
          </div>
        </div>
      </div>

      <!-- Error State -->
      <div v-else-if="error"
        class="bg-surface-container-lowest rounded-2xl shadow-sm border border-outline-variant/20 p-6 text-center py-12">
        <p class="text-error mb-4">{{ error }}</p>
        <button @click="() => fetchBlogs()" class="px-4 py-2 bg-primary text-white rounded-lg hover:bg-primary/90">
          重试
        </button>
      </div>

      <!-- Blog List -->
      <Transition name="fade" mode="out-in">
        <div v-if="filteredPosts.length > 0" key="blog-list"
          class="bg-surface-container-lowest rounded-2xl shadow-sm border border-outline-variant/20 p-6">
          <article v-for="(post, index) in filteredPosts" :key="post.id" class="py-stack-lg group" :class="index < filteredPosts.length - 1
              ? 'border-b border-outline-variant/30'
              : ''
            ">
            <router-link :to="`/blog/${post.slug}`" class="grid gap-gutter items-start" :class="post.coverImage
                ? 'grid-cols-1 md:grid-cols-[1fr_240px]'
                : 'grid-cols-1'
              ">
              <div class="order-2 md:order-1">
                <h2
                  class="font-headline-md text-headline-md text-on-surface group-hover:text-primary transition-colors mb-2">
                  {{ post.title }}
                </h2>
                <time class="text-label-xs font-label-xs text-outline mb-3 block">
                  {{ formatDate(post.publishedAt) }} · 阅读时间
                  {{ post.readingTime }} 分钟
                </time>
                <p class="text-on-surface-variant line-clamp-2 mb-4 leading-relaxed">
                  {{ post.excerpt }}
                </p>
                <div class="flex items-center gap-2 text-primary font-semibold text-label-xs">
                  阅读全文
                  <span class="material-symbols-outlined text-[16px]">arrow_forward</span>
                </div>
              </div>
              <!-- 只有在有图片时才显示图片区域 -->
              <div v-if="post.coverImage" class="order-1 md:order-2">
                <div class="w-full aspect-video rounded overflow-hidden bg-surface-container-highest">
                  <el-image :src="post.coverImage" :alt="post.title" fit="cover"
                    :preview-src-list="[post.coverImage]" />
                </div>
              </div>
            </router-link>
          </article>
        </div>

        <!-- Empty State -->
        <div v-else key="empty-state" class="text-center py-12 text-on-surface-variant">
          暂无文章
        </div>
      </Transition>

      <!-- Pagination -->
      <nav v-if="totalPages > 1" class="mt-stack-xl flex justify-center items-center gap-2">
        <button @click="goToPage(currentPage - 1)"
          class="w-10 h-10 flex items-center justify-center rounded border border-outline-variant text-outline hover:border-primary hover:text-primary transition-colors"
          :disabled="currentPage === 1">
          <span class="material-symbols-outlined">chevron_left</span>
        </button>
        <button v-for="page in displayedPages" :key="page" @click="goToPage(page)"
          class="w-10 h-10 flex items-center justify-center rounded transition-colors" :class="currentPage === page
              ? 'bg-primary text-white font-bold'
              : 'border border-outline-variant text-on-surface hover:border-primary hover:text-primary'
            ">
          {{ page }}
        </button>
        <button @click="goToPage(currentPage + 1)"
          class="w-10 h-10 flex items-center justify-center rounded border border-outline-variant text-outline hover:border-primary hover:text-primary transition-colors"
          :disabled="currentPage === totalPages">
          <span class="material-symbols-outlined">chevron_right</span>
        </button>
      </nav>
    </main>

    <Footer />
  </div>
</template>

<script setup lang="ts">
import { ref, computed, onMounted, watch } from "vue";
import TopNavBar from "../components/TopNavBar.vue";
import Footer from "../components/Footer.vue";
import { api } from "../services/api";
import type { BlogPost } from "../types";

const loading = ref(true);
const error = ref("");
const blogs = ref<BlogPost[]>([]);
const totalPages = ref(1);
const currentPage = ref(1);

// �?HTML 内容中提取第一张图片的 URL
const extractFirstImage = (content: string): string => {
  if (!content) return "";

  const imgRegex = /<img[^>]+src=["']([^"']+)["'][^>]*>/i;
  const match = content.match(imgRegex);

  if (match && match[1]) {
    let src = match[1];
    // 如果是相对路径，添加基础路径
    if (src.startsWith("/")) {
      src = `${window.location.origin}${src}`;
    }
    return src;
  }

  return "";
};

const fetchBlogs = async () => {
  try {
    loading.value = true;
    error.value = "";

    const response = await api.getBlogs({ status: "published" });
    const blogsData = Array.isArray(response) ? response : response.blogs || [];

    blogs.value = blogsData.map((blog: any) => {
      // 优先使用 cover_image 字段，如果没有则从内容中提取
      const coverImage =
        blog.cover_image || extractFirstImage(blog.content || "");

      return {
        id: blog.id?.toString() || "",
        title: blog.title || "",
        slug: blog.slug || "",
        excerpt: blog.excerpt || "",
        content: blog.content || "",
        coverImage: coverImage,
        author: blog.author || {},
        tags: blog.tags || [],
        publishedAt: blog.created_at || blog.publishedAt,
        readingTime: Math.ceil((blog.content?.length || 500) / 500),
        views: blog.views || 0,
        status: blog.status,
        createdAt: blog.created_at,
        updatedAt: blog.updated_at,
      };
    });

    totalPages.value = 1;
  } catch (err: any) {
    error.value = err.message || "加载失败";
  } finally {
    loading.value = false;
  }
};

const goToPage = (page: number) => {
  if (page < 1 || page > totalPages.value) return;
  currentPage.value = page;
  fetchBlogs();
  window.scrollTo({ top: 0, behavior: "smooth" });
};

const filteredPosts = computed(() => {
  return blogs.value;
});

const displayedPages = computed(() => {
  const pages = [];
  const maxVisible = 5;
  let startPage = Math.max(1, currentPage.value - Math.floor(maxVisible / 2));
  let endPage = Math.min(totalPages.value, startPage + maxVisible - 1);

  if (endPage - startPage < maxVisible - 1) {
    startPage = Math.max(1, endPage - maxVisible + 1);
  }

  for (let i = startPage; i <= endPage; i++) {
    pages.push(i);
  }

  return pages;
});

const formatDate = (dateString: string) => {
  if (!dateString) return "";
  const date = new Date(dateString);
  return date.toLocaleDateString("zh-CN", {
    year: "numeric",
    month: "long",
    day: "numeric",
    hour: "2-digit",
    minute: "2-digit",
  });
};

onMounted(() => {
  fetchBlogs();
});
</script>

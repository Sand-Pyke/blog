<template>
  <div
    class="font-body-md text-body-md selection:bg-primary-fixed selection:text-on-primary-fixed bg-gradient-to-b from-surface-container-low to-surface min-h-screen">
    <TopNavBar />

    <main class="pt-24 pb-stack-xl max-w-container-max mx-auto px-gutter md:px-0">
      <!-- Header Section -->
      <section class="mb-stack-xl">
        <div class="bg-surface-container-lowest rounded-2xl shadow-sm border border-outline-variant/20 p-6 md:p-8">
          <h1 class="font-display-lg text-display-lg-mobile md:text-display-xl mb-stack-sm">日常分享</h1>
        </div>
      </section>

      <!-- Loading State -->
      <div v-if="loading" class="space-y-stack-lg">
        <div v-for="i in 4" :key="i"
          class="bg-surface-container-lowest rounded-2xl shadow-sm border border-outline-variant/20 p-6">
          <div class="md:grid md:grid-cols-2 md:gap-16">
            <div class="hidden md:block">
              <div class="h-4 w-24 bg-surface-container rounded animate-pulse"></div>
            </div>
            <div class="bg-surface-container p-stack-md rounded-lg">
              <div class="h-4 w-full bg-surface-container-high rounded mb-2 animate-pulse"></div>
              <div class="h-4 w-3/4 bg-surface-container-high rounded animate-pulse"></div>
            </div>
          </div>
        </div>
      </div>

      <!-- Error State -->
      <div v-else-if="error"
        class="bg-surface-container-lowest rounded-2xl shadow-sm border border-outline-variant/20 p-6 text-center py-12">
        <p class="text-error mb-4">{{ error }}</p>
        <button @click="handleRetry" class="px-4 py-2 bg-primary text-white rounded-lg hover:bg-primary/90">
          重试
        </button>
      </div>

      <!-- Timeline Container -->
      <div v-else-if="dailyEntries.length > 0" class="relative daily-timeline space-y-stack-lg">
        <article v-for="(entry, index) in dailyEntries" :key="entry.id" class="relative pl-12 md:pl-0 group"
          :class="{ 'md:grid-cols-2': index % 2 === 0, 'md:grid-cols-2 md:col-start-2': index % 2 !== 0 }">
          <div
            class="hidden md:block absolute left-1/2 -translate-x-1/2 w-3 h-3 bg-primary rounded-full border-4 border-surface-container-low z-10 top-2">
          </div>

          <div class="md:grid md:grid-cols-2 md:gap-16">
            <div :class="index % 2 === 0 ? 'md:text-right' : 'md:col-start-2'">
              <time class="font-label-xs text-label-xs text-primary uppercase tracking-wider block mb-1">
                {{ formatDate(entry.date) }}
              </time>
              <span v-for="(tag, tagIndex) in entry.tags" :key="tagIndex"
                class="inline-block px-2 py-1 bg-surface-container rounded-lg text-[10px] font-code-sm text-on-surface-variant mb-2">
                #{{ tag.name }}
              </span>
            </div>

            <div :class="index % 2 === 0 ? '' : 'md:row-start-1 md:text-right'" @click="handleCardClick(entry)"
              class="bg-surface-container-lowest rounded-xl p-stack-md border border-outline-variant/20 transition-all hover:border-outline-variant hover:shadow-sm cursor-pointer">
              <div class="text-on-surface mb-4 prose prose-sm max-w-none" v-html="entry.content"></div>

              <!-- Image if available -->
              <div v-if="entry.images && entry.images.length > 0"
                class="aspect-video w-full overflow-hidden rounded-lg mb-4">
                <img :src="entry.images[0]" :alt="entry.content" class="w-full h-full object-cover" />
              </div>

              <!-- Code snippet if available -->
              <div v-if="entry.codeSnippet"
                class="font-code-sm text-code-sm bg-surface-container-highest p-3 rounded-lg overflow-x-auto text-on-primary-container">
                <code v-html="entry.codeSnippet"></code>
              </div>

              <!-- Book cover if available -->
              <div v-if="entry.bookCover" class="flex md:justify-end gap-2">
                <div class="w-16 h-20 bg-outline-variant rounded shadow-sm overflow-hidden">
                  <img :src="entry.bookCover" :alt="entry.content" class="w-full h-full object-cover" />
                </div>
              </div>
            </div>
          </div>
        </article>
      </div>

      <!-- Empty State -->
      <div v-else class="text-center py-12 text-on-surface-variant">
        暂无日常分享
      </div>

      <!-- Load More -->
      <div v-if="hasMore && !loading" class="mt-stack-xl flex justify-center">
        <button @click="handleLoadMore" :disabled="loadingMore"
          class="group relative px-8 py-3 bg-primary text-on-primary font-semibold transition-all hover:bg-primary/90 active:scale-95 disabled:opacity-50">
          <span v-if="loadingMore">加载�?..</span>
          <span v-else>
            加载更多历史记录
            <span class="absolute bottom-0 left-0 w-0 h-0.5 bg-white transition-all group-hover:w-full"></span>
          </span>
        </button>
      </div>
    </main>

    <!-- Detail Dialog -->
    <Teleport to="body">
      <transition name="dialog">
        <div v-if="showDialog" class="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4"
          @click.self="closeDialog">
          <div class="bg-surface-container-lowest rounded-2xl p-6"
            :class="currentWidth === 'mobile' ? 'w-[90%]' : 'w-full max-w-[600px]'">
            <div class="flex items-center justify-between mb-6">
              <h2 class="font-headline-md text-headline-md text-on-surface">
                {{ selectedEntry.title || '日常分享详情' }}
              </h2>
              <button @click="closeDialog"
                class="p-2 text-on-surface-variant hover:text-on-surface hover:bg-surface-container-high rounded-lg">
                <span class="material-symbols-outlined">close</span>
              </button>
            </div>

            <div v-if="selectedEntry" class="space-y-stack-md">
              <!-- Date and Tags -->
              <div class="flex items-center justify-between flex-wrap gap-2">
                <div class="flex items-center gap-2">
                  <time class="font-label-xs text-label-xs text-primary uppercase tracking-wider">
                    {{ formatDate(selectedEntry.date) }}
                  </time>
                  <span v-if="selectedEntry.location" class="text-label-xs text-on-surface-variant">
                    · {{ selectedEntry.location }}
                  </span>
                </div>

                <!-- Delete Button (only for logged in users) -->
                <button v-if="authStore.isAuthenticated" @click.stop="handleDelete" :disabled="isDeleting"
                  class="px-3 py-1.5 text-label-xs font-label-xs text-error border border-error/50 rounded-lg hover:bg-error/10 transition-colors disabled:opacity-50 disabled:cursor-not-allowed flex items-center gap-1">
                  <span class="material-symbols-outlined text-[16px]">delete</span>
                  <span>{{ isDeleting ? '删除�?..' : '删除' }}</span>
                </button>
              </div>

              <!-- Tags -->
              <div v-if="selectedEntry.tags && selectedEntry.tags.length > 0" class="flex flex-wrap gap-2">
                <span v-for="(tag, tagIndex) in selectedEntry.tags" :key="tagIndex"
                  class="inline-block px-2 py-1 bg-surface-container rounded-lg text-[10px] font-code-sm text-on-surface-variant">
                  #{{ tag.name }}
                </span>
              </div>

              <!-- Content -->
              <div class="text-on-surface leading-relaxed whitespace-pre-wrap" v-html="selectedEntry.content"></div>

              <!-- Images -->
              <div v-if="selectedEntry.images && selectedEntry.images.length > 0" class="space-y-2">
                <img v-for="(image, imgIndex) in selectedEntry.images" :key="imgIndex" :src="image"
                  :alt="`Image ${imgIndex + 1}`" class="w-full rounded-lg" />
              </div>

              <!-- Code Snippet -->
              <div v-if="selectedEntry.codeSnippet"
                class="font-code-sm text-code-sm bg-surface-container-highest p-3 rounded-lg overflow-x-auto">
                <code v-html="selectedEntry.codeSnippet"></code>
              </div>

              <!-- Book Cover -->
              <div v-if="selectedEntry.bookCover" class="flex items-center gap-3">
                <div class="w-16 h-20 bg-outline-variant rounded shadow-sm overflow-hidden">
                  <img :src="selectedEntry.bookCover" :alt="selectedEntry.content" class="w-full h-full object-cover" />
                </div>
              </div>
            </div>
          </div>
        </div>
      </transition>
    </Teleport>

    <!-- Delete Confirm Dialog -->
    <DeleteConfirm v-model:visible="showDeleteConfirm" title="删除确认" message="确定要删除这条日常分享吗�? sub-message="此操作不可恢�?
      confirm-text="删除" :loading="isDeleting" @confirm="handleDeleteConfirm" @cancel="handleDeleteCancel" />

    <Footer />
  </div>
</template>

<script setup lang="ts">
import { ref, onMounted, onUnmounted, watch } from 'vue';
import { ElMessage } from 'element-plus';
import TopNavBar from '../components/TopNavBar.vue';
import Footer from '../components/Footer.vue';
import DeleteConfirm from '../components/DeleteConfirm.vue';
import { api } from '../services/api';
import { useAuthStore } from '../stores/auth';
import { useScrollLock } from '@vueuse/core';

import type { DailyEntry } from '../types';

const authStore = useAuthStore();
const currentWidth = ref('desktop');
const loading = ref(true);
const error = ref('');
const dailyEntries = ref<DailyEntry[]>([]);
const currentPage = ref(1);
const totalPages = ref(1);
const hasMore = ref(false);
const loadingMore = ref(false);
const selectedEntry = ref<any>(null);
const showDialog = ref(false);
const isDeleting = ref(false);
const showDeleteConfirm = ref(false);

// 详情弹窗和删除确认弹窗都关闭时才恢复滚动�?const isLocked = useScrollLock(document.documentElement);
const API_BASE_URL = import.meta.env.VITE_API_URL || '/api';

const availableTags = ref<string[]>([]);

watch(showDialog, (val) => {
  isLocked.value = val;
});

const checkWidth = () => {
  currentWidth.value = window.innerWidth < 768 ? 'mobile' : 'desktop';
};

const fetchDailies = async (append = false) => {
  if (append) {
    loadingMore.value = true;
  } else {
    loading.value = true;
  }

  try {
    error.value = '';

    const page = append ? currentPage.value + 1 : 1;
    const response = await api.getDailies({ page, limit: 10 });
    // 后端返回的是数组，不�?{ dailies: [] } 对象
    const dailiesData = Array.isArray(response) ? response : response.dailies || [];

    const mappedEntries: DailyEntry[] = dailiesData.map((daily: any) => {
      // 解析 metadata
      let metadata: any = {};
      if (daily.metadata) {
        try {
          metadata = typeof daily.metadata === 'string' ? JSON.parse(daily.metadata) : daily.metadata;
        } catch (e) {
                  }
      }

      // 解析 tags - 支持多种格式
      let tags: string[] = [];
      if (metadata.tags) {
        if (typeof metadata.tags === 'string') {
          try { tags = JSON.parse(metadata.tags); } catch { tags = [metadata.tags]; }
        } else if (Array.isArray(metadata.tags)) {
          // 过滤�?availableTags 中存在的标签
          const tagsArr = metadata.tags;
                    tags = availableTags.value.filter((tag: any) => tagsArr.includes(tag.id));
        }
      } 

      return {
        id: daily.id?.toString() || '',
        content: daily.content || '',
        tags,
        images: metadata.images || [],
        date: daily.date || daily.created_at,
        mood: daily.mood,
        location: daily.location,
        codeSnippet: daily.code_snippet || daily.codeSnippet || metadata.codeSnippet,
        bookCover: daily.book_cover || daily.bookCover || metadata.bookCover,
        createdAt: daily.created_at,
        updatedAt: daily.updated_at,
        title: daily.metadata?.title || ''
      };
    });

    if (append) {
      dailyEntries.value = [...dailyEntries.value, ...mappedEntries];
    } else {
      dailyEntries.value = mappedEntries;
    }

    totalPages.value = 1; // 后端暂时没有分页信息
    currentPage.value = page;
    hasMore.value = false; // 暂时没有更多数据
  } catch (err: any) {
    error.value = err.message || '加载失败';
      } finally {
    loading.value = false;
    loadingMore.value = false;
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

const loadMore = () => {
  if (hasMore.value && !loadingMore.value) {
    fetchDailies(true);
  }
};

const handleLoadMore = () => {
  loadMore();
};

const handleRetry = () => {
  fetchDailies(false);
};

const handleCardClick = (entry: any) => {
    selectedEntry.value = entry;
  showDialog.value = true;
};

const closeDialog = () => {
  showDialog.value = false;
  selectedEntry.value = null;
};

const handleDelete = () => {
  if (!selectedEntry.value) return;
  showDeleteConfirm.value = true;
};

const handleDeleteConfirm = async () => {
  if (!selectedEntry.value) return;

  isDeleting.value = true;

  try {
    await api.deleteDaily(selectedEntry.value.id);

    // 从列表中移除
    dailyEntries.value = dailyEntries.value.filter(e => e.id !== selectedEntry.value.id);

    ElMessage.success('删除成功');
    showDeleteConfirm.value = false;
    closeDialog();
  } catch (err: any) {
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
    month: '2-digit',
    day: '2-digit'
  }).replace(/\//g, '.');
};

onMounted(() => {
  checkWidth();
  window.addEventListener('resize', checkWidth);
  fetchDailies();
  fetchTags();
});

onUnmounted(() => {
  window.removeEventListener('resize', checkWidth);
});
</script>

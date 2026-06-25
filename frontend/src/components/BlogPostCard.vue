<template>
  <article class="group py-stack-md border-b border-outline-variant/30 last:border-0">
    <div class="flex flex-col md:flex-row md:items-center justify-between gap-2 mb-2">
      <div class="flex items-center gap-3">
        <span 
          v-if="post.category"
          class="font-label-xs text-label-xs px-2 py-0.5 rounded"
          :class="categoryClass"
        >
          {{ post.category?.name }}
        </span>
        <time class="font-label-xs text-label-xs text-outline">
          {{ formatDate(post.publishedAt) }}
        </time>
      </div>
    </div>
    
    <router-link :to="`/blog/${post.slug}`" class="block">
      <h3 class="font-headline-md text-headline-md text-on-surface group-hover:text-primary transition-colors">
        {{ post.title }}
      </h3>
      <p class="text-on-surface-variant mt-2 line-clamp-2 max-w-2xl">
        {{ post.excerpt }}
      </p>
    </router-link>
  </article>
</template>

<script setup lang="ts">
import { computed } from 'vue';
import type { BlogPost } from '../types';

const props = defineProps<{
  post: BlogPost;
}>();

const categoryClass = computed(() => {
  const colorMap: Record<string, string> = {
    'Vue': 'bg-surface-container-high text-on-surface-variant',
    'Performance': 'bg-secondary-container/50 text-on-secondary-container',
    'Design': 'bg-tertiary-fixed/30 text-on-tertiary-fixed-variant',
    'Frontend': 'bg-secondary-fixed-dim bg-secondary-container/50',
    'Daily': 'bg-secondary-fixed-dim bg-secondary-container/50',
    '技术分享': 'bg-surface-container-high text-on-surface-variant',
    '前端技术': 'bg-secondary-container/50 text-on-secondary-container',
    '日常分享': 'bg-secondary-fixed-dim bg-secondary-container/50'
  };
  
  const categoryName = props.post.category?.name || '';
  return colorMap[categoryName] || 'bg-surface-container-high text-on-surface-variant';
});

const formatDate = (dateString: string) => {
  if (!dateString) return '';
  const date = new Date(dateString);
  return date.toLocaleDateString('zh-CN', {
    year: 'numeric',
    month: 'long',
    day: 'numeric'
  });
};
</script>
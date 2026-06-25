<template>
  <div class="bg-surface-container-lowest p-stack-md rounded-xl border border-outline-variant/30 hover:border-primary/30 transition-all group flex items-center gap-3">
    <!-- SVG 图标 -->
    <img 
      v-if="skill.icon && skill.icon.endsWith('.svg')"
      :src="iconUrl"
      :alt="skill.name"
      class="h-8 w-8 object-contain transition-transform group-hover:scale-110 shrink-0"
    />
    <!-- Material Symbols 图标 -->
    <span 
      v-else 
      class="material-symbols-outlined text-primary group-hover:scale-110 transition-transform text-2xl shrink-0"
    >
      {{ skill.icon || 'code' }}
    </span>
    <h3 class="font-semibold text-on-surface">{{ skill.name }}</h3>
  </div>
</template>

<script setup lang="ts">
import { computed } from 'vue';
import type { Skill } from '../types';

const props = defineProps<{
  skill: Skill;
}>();

// SVG 图标路径
const iconUrl = computed(() => {
  if (!props.skill.icon) return '';
  // 如果是 .svg 文件，构建正确的路径
  if (props.skill.icon.endsWith('.svg')) {
    return new URL(`../assets/svg/${props.skill.icon}`, import.meta.url).href;
  }
  return props.skill.icon;
});
</script>

<template>
  <section class="flex flex-col md:flex-row items-center gap-stack-lg">
    <div class="flex-1 space-y-stack-md text-center md:text-left">
      <span class="font-label-xs text-label-xs text-primary uppercase tracking-widest">
        Front-end Developer
      </span>
      <h1 class="font-display-lg-mobile md:font-display-lg text-display-lg-mobile md:text-display-lg text-on-surface">
        {{ user.name }}
      </h1>
      <p class="font-body-lg text-body-lg text-on-surface-variant max-w-xl">
        {{ user.bio }}
      </p>
      <div class="flex flex-wrap gap-stack-sm justify-center md:justify-start pt-stack-sm">
        <button
          class="bg-primary text-on-primary px-6 py-2.5 rounded-lg font-medium transition-all hover:bg-primary/90 active:scale-95"
          @click="showPortfolioDialog = true">
          查看作品
        </button>
      </div>
    </div>

    <div class="relative w-48 h-48 md:w-64 md:h-64 flex-shrink-0 group">
      <div
        class="absolute inset-0 bg-primary-container rounded-full opacity-10 group-hover:scale-105 transition-transform duration-500">
      </div>
      <img :src="user.avatar" :alt="user.name"
        class="w-full h-full object-cover rounded-full border-4 border-surface shadow-xl relative z-10" />
    </div>
  </section>

  <!-- Portfolio Dialog -->
  <Teleport to="body">
    <transition name="dialog">
      <div 
        v-if="showPortfolioDialog" 
        class="fixed inset-0 bg-black/50 flex items-center justify-center z-[60] p-4"
        @click.self="showPortfolioDialog = false"
      >
        <div class="bg-surface-container-lowest rounded-2xl w-full max-w-md p-6">
          <div class="flex items-center justify-between mb-6">
            <h2 class="font-headline-md text-headline-md text-on-surface">
              查看作品
            </h2>
            <button 
              @click="showPortfolioDialog = false"
              class="p-2 text-on-surface-variant hover:text-on-surface hover:bg-surface-container-high rounded-lg"
            >
              <span class="material-symbols-outlined">close</span>
            </button>
          </div>

          <div class="flex items-start gap-4 mb-6">
            <div class="flex-shrink-0 w-12 h-12 rounded-full bg-primary-container flex items-center justify-center">
              <span class="material-symbols-outlined text-on-primary-container text-2xl">code</span>
            </div>
            <div>
              <p class="text-on-surface font-body-md mb-2">跳转到王孝虎的 GitHub 仓库</p>
              <p class="text-on-surface-variant font-body-sm">查看前端项目、开源贡献和技术实践</p>
            </div>
          </div>

          <div class="flex gap-3">
            <button 
              @click="showPortfolioDialog = false"
              class="flex-1 py-3 border border-outline text-on-surface-variant font-body-md rounded-lg hover:bg-surface-container-high transition-all"
            >
              取消
            </button>
            <button 
              @click="goToGithub"
              class="flex-1 py-3 bg-primary text-on-primary font-body-md rounded-lg hover:bg-primary/90 transition-all"
            >
              确认
            </button>
          </div>
        </div>
      </div>
    </transition>
  </Teleport>
</template>

<script setup lang="ts">
import { ref, watch } from 'vue';
import type { User } from '../types';
import { useScrollLock } from '@vueuse/core';

defineProps<{
  user: User;
}>();

const showPortfolioDialog = ref(false);
const isLocked = useScrollLock(document.documentElement);

watch(showPortfolioDialog, (newValue) => {
  isLocked.value = newValue;
});

const goToGithub = () => {
  showPortfolioDialog.value = false;
  window.open('https://github.com/Sand-Pyke?tab=repositories', '_blank');
};
</script>

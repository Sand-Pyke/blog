<template>
  <header class="fixed top-0 w-full z-50 bg-surface-container-lowest/90 backdrop-blur-md border-b border-outline-variant/30">
    <!-- Reading Progress Bar -->
    <div 
      class="absolute bottom-0 top-0 left-0 h-[2px] bg-primary transition-all duration-100"
      :style="{ width: progressPercentage + '%' }"
    />
    
    <div class="flex justify-between items-center px-gutter max-w-container-max mx-auto h-16">
      <router-link to="/" class="font-pacifico text-2xl font-bold text-primary">
        王孝虎的博客
      </router-link>
      
      <nav class="hidden md:flex items-center gap-6">
        <router-link 
          v-for="item in visibleNavItems" 
          :key="item.path"
          :to="item.path"
          class="font-body-md transition-colors border-b-2 pb-1"
          :class="isActive(item.path) ? 'text-primary border-primary font-semibold' : 'text-on-surface-variant border-transparent hover:text-primary hover:border-primary/30'"
        >
          {{ item.label }}
        </router-link>
      </nav>
      
      <div class="flex items-center gap-4">
        <button 
          @click="toggleDarkMode"
          class="text-on-surface-variant hover:text-primary transition-all duration-200 active:scale-95 p-2 rounded-lg hover:bg-surface-container-high"
          :title="isDark ? '切换到浅色模式' : '切换到深色模式'"
        >
          <span class="material-symbols-outlined text-2xl">{{ isDark ? 'light_mode' : 'dark_mode' }}</span>
        </button>
        
        <!-- User Menu -->
        <div v-if="authStore.isAuthenticated" class="relative" ref="userMenuRef">
          <button 
            @click="showUserMenu = !showUserMenu"
            class="flex items-center gap-2 p-1 rounded-full hover:bg-surface-container transition-colors"
          >
            <div class="w-8 h-8 rounded-full bg-primary-container flex items-center justify-center">
              <span class="text-on-primary font-bold text-sm">{{ userInitials }}</span>
            </div>
          </button>
          
          <!-- Dropdown Menu -->
          <div v-if="showUserMenu" class="absolute right-0 mt-2 w-48 bg-surface-container-lowest border border-outline-variant rounded-xl shadow-lg py-2">
            <div class="px-4 py-2 border-b border-outline-variant/30">
              <p class="font-body-md text-on-surface font-medium">{{ authStore.user?.username }}</p>
              <p class="font-label-xs text-on-surface-variant">{{ authStore.user?.email }}</p>
            </div>
            <button 
              @click="handleLogout"
              class="w-full flex items-center gap-2 px-4 py-2 text-on-surface-variant hover:bg-surface-container transition-colors"
            >
              <span class="material-symbols-outlined text-[18px]">logout</span>
              退出登录
            </button>
          </div>
        </div>
        
        <!-- Login Button -->
        <router-link 
          v-if="!authStore.isAuthenticated"
          to="/login"
          class="px-4 py-2 bg-primary text-on-primary rounded-lg hover:bg-primary/90 transition-colors font-body-md"
        >
          登录
        </router-link>
      </div>
    </div>
  </header>
  
  <!-- Logout Confirm Dialog -->
  <Teleport to="body">
    <transition name="dialog">
      <div 
        v-if="showLogoutConfirm" 
        class="fixed inset-0 bg-black/50 flex items-center justify-center z-[60] p-4"
        @click.self="showLogoutConfirm = false"
      >
        <div class="bg-surface-container-lowest rounded-2xl w-full max-w-md p-6">
          <div class="flex items-center justify-between mb-6">
            <h2 class="font-headline-md text-headline-md text-on-surface">
              退出登录确认
            </h2>
            <button 
              @click="showLogoutConfirm = false"
              class="p-2 text-on-surface-variant hover:text-on-surface hover:bg-surface-container-high rounded-lg"
            >
              <span class="material-symbols-outlined">close</span>
            </button>
          </div>

          <div class="flex items-start gap-4 mb-6">
            <div class="flex-shrink-0 w-12 h-12 rounded-full bg-error-container flex items-center justify-center">
              <span class="material-symbols-outlined text-on-error-container text-2xl">logout</span>
            </div>
            <div>
              <p class="text-on-surface font-body-md mb-2">确定要退出登录吗？</p>
              <p class="text-on-surface-variant font-body-sm">退出后需要重新登录才能访问管理功能</p>
            </div>
          </div>

          <div class="flex gap-3">
            <button 
              @click="showLogoutConfirm = false"
              class="flex-1 py-3 border border-outline text-on-surface-variant font-body-md rounded-lg hover:bg-surface-container-high transition-all"
            >
              取消
            </button>
            <button 
              @click="confirmLogout"
              class="flex-1 py-3 bg-error text-on-error font-body-md rounded-lg hover:bg-error/90 transition-all"
            >
              退出登录
            </button>
          </div>
        </div>
      </div>
    </transition>
  </Teleport>
</template>

<script setup lang="ts">
import { ref, computed, onMounted, onUnmounted, watch } from 'vue';
import { useRoute, useRouter } from 'vue-router';
import { useAuthStore } from '../stores/auth';
import type { NavItem } from '../types';
import { useScrollLock } from '@vueuse/core';

const route = useRoute();
const router = useRouter();
const authStore = useAuthStore();
const isDark = ref(false);
const showUserMenu = ref(false);
const userMenuRef = ref<HTMLElement | null>(null);
const showLogoutConfirm = ref(false);
const isLocked = useScrollLock(document.documentElement);

watch(showLogoutConfirm, (val) => {
  isLocked.value = val;
});
// 从 localStorage 恢复主题设置
const initTheme = () => {
  const savedTheme = localStorage.getItem('theme');
  if (savedTheme === 'dark') {
    isDark.value = true;
    document.documentElement.classList.add('dark');
  } else if (savedTheme === 'light') {
    isDark.value = false;
    document.documentElement.classList.remove('dark');
  } else {
    // 默认跟随系统偏好
    isDark.value = window.matchMedia('(prefers-color-scheme: dark)').matches;
    document.documentElement.classList.toggle('dark', isDark.value);
  }
};

// Reading Progress
const progressPercentage = ref(0);

const updateProgress = () => {
  const winScroll = document.body.scrollTop || document.documentElement.scrollTop;
  const height = document.documentElement.scrollHeight - document.documentElement.clientHeight;
  if (height > 0) {
    progressPercentage.value = (winScroll / height) * 100;
  } else {
    progressPercentage.value = 0;
  }
};

onMounted(() => {
  initTheme();
  window.addEventListener('scroll', updateProgress);
});

onUnmounted(() => {
  window.removeEventListener('scroll', updateProgress);
});

const allNavItems: NavItem[] = [
  { label: '首页', path: '/' },
  { label: '博客', path: '/blog' },
  { label: '日常', path: '/daily' }
];

const editorNavItem: NavItem = { label: '写文章', path: '/editor' };
const skillsNavItem: NavItem = { label: '技能管理', path: '/skills' };

const visibleNavItems = computed(() => {
  if (authStore.isAuthenticated) {
    return [...allNavItems, editorNavItem, skillsNavItem];
  }
  return allNavItems;
});

const userInitials = computed(() => {
  const username = authStore.user?.username || 'U';
  return username.substring(0, 2).toUpperCase();
});

const isActive = (path: string) => {
  return route.path === path;
};

const toggleDarkMode = () => {
  isDark.value = !isDark.value;
  document.documentElement.classList.toggle('dark', isDark.value);
  localStorage.setItem('theme', isDark.value ? 'dark' : 'light');
};

const handleLogout = () => {
  showUserMenu.value = false;
  showLogoutConfirm.value = true;
};

const confirmLogout = () => {
  showLogoutConfirm.value = false;
  authStore.logout();
  router.push('/login');
};

// 点击外部关闭用户菜单
const handleClickOutside = (event: MouseEvent) => {
  if (userMenuRef.value && !userMenuRef.value.contains(event.target as Node)) {
    showUserMenu.value = false;
  }
};

onMounted(() => {
  document.addEventListener('click', handleClickOutside);
});

onUnmounted(() => {
  document.removeEventListener('click', handleClickOutside);
});
</script>

<style scoped>
.material-symbols-outlined {
  font-variation-settings: 'FILL' 0, 'wght' 400, 'GRAD' 0, 'opsz' 24;
  display: inline-block;
  vertical-align: middle;
}
</style>

import { createRouter, createWebHistory, type RouteRecordRaw } from 'vue-router'
import { useAuthStore } from '../stores/auth'

const routes: RouteRecordRaw[] = [
  {
    path: '/',
    name: 'home',
    component: () => import('../views/HomeView.vue')
  },
  {
    path: '/login',
    name: 'login',
    component: () => import('../views/LoginView.vue'),
    meta: { guest: true }
  },
  {
    path: '/blog',
    name: 'blog',
    component: () => import('../views/BlogView.vue')
  },
  {
    path: '/blog/:slug',
    name: 'blog-detail',
    component: () => import('../views/BlogDetailView.vue')
  },
  {
    path: '/daily',
    name: 'daily',
    component: () => import('../views/DailyView.vue')
  },
  {
    path: '/editor',
    name: 'editor',
    component: () => import('../views/EditorView.vue'),
    meta: { requiresAuth: true }
  },
  {
    path: '/skills',
    name: 'skills',
    component: () => import('../views/SkillManagerView.vue'),
    meta: { requiresAuth: true }
  },
  {
    path: '/font-gallery',
    name: 'font-gallery',
    component: () => import('../views/FontGalleryView.vue')
  }
]

const router = createRouter({
  history: createWebHistory(import.meta.env.BASE_URL),
  routes
})

// Navigation guard
router.beforeEach(async (to, from) => {
  const authStore = useAuthStore()
  
  // Initialize auth state from localStorage
  if (!authStore.user && localStorage.getItem('token')) {
    await authStore.initAuth()
  }

  const isAuthenticated = authStore.isAuthenticated
  const requiresAuth = to.matched.some(record => record.meta.requiresAuth)
  const isGuestOnly = to.matched.some(record => record.meta.guest)

  if (requiresAuth && !isAuthenticated) {
    // Redirect to login if not authenticated
    return { name: 'login', query: { redirect: to.fullPath } }
  } else if (isGuestOnly && isAuthenticated) {
    // Redirect to home if already authenticated
    return { name: 'home' }
  }
  // Allow navigation by returning nothing (or true)
})

export default router
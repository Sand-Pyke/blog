<template>
  <div class="bg-surface text-on-surface font-body-md min-h-screen flex flex-col">
    <!-- Progress Bar -->
    <div id="progress-bar" ref="progressBar" class="fixed top-0 left-0 h-0.5 bg-primary z-50 transition-all duration-300"></div>

    <main class="flex-grow flex items-center justify-center px-margin-mobile md:px-gutter py-stack-xl relative overflow-hidden">
      <!-- Atmospheric Background -->
      <div class="absolute inset-0 pointer-events-none opacity-20">
        <div class="absolute top-[-10%] right-[-5%] w-[400px] h-[400px] bg-primary/10 rounded-full blur-[100px]" ref="bg1"></div>
        <div class="absolute bottom-[-10%] left-[-5%] w-[300px] h-[300px] bg-secondary-container/30 rounded-full blur-[80px]" ref="bg2"></div>
      </div>

      <!-- Login Container -->
      <div class="w-full max-w-[420px] z-10">
        <!-- Branding -->
        <div class="text-center mb-stack-lg">
          <h1 class="font-display-lg text-headline-md font-bold text-on-surface tracking-tight">
            王孝虎的博客
          </h1>
          <p class="font-label-xs text-label-xs text-on-surface-variant mt-2 uppercase tracking-widest">
            王孝虎的个人博客
          </p>
        </div>

        <!-- Login Card -->
        <div class="bg-surface-container-lowest border border-outline-variant/30 rounded-xl p-8 md:p-10 shadow-sm transition-all duration-500 hover:shadow-md">
          <div class="mb-stack-lg">
            <h2 class="font-headline-md text-headline-md text-on-surface">欢迎回来</h2>
            <p class="font-body-md text-on-surface-variant text-sm mt-1">请登录您的开发者账�?/p>
          </div>

          <!-- Error Message -->
          <div v-if="errorMessage" class="mb-4 p-3 bg-error-container text-on-error-container rounded-lg text-sm">
            {{ errorMessage }}
          </div>

          <form class="space-y-6" @submit.prevent="handleLogin">
            <!-- Email/Username -->
            <div class="space-y-2">
              <label class="font-label-xs text-label-xs text-on-surface-variant block" for="identity">邮箱或用户名</label>
              <div class="relative">
                <span class="material-symbols-outlined absolute left-3 top-1/2 -translate-y-1/2 text-outline text-[20px]">person</span>
                <input
                  v-model="loginForm.identity"
                  class="w-full pl-10 pr-4 py-3 bg-surface-container border rounded-lg font-body-md text-on-surface transition-all placeholder:text-outline/50 focus:border-primary"
                  :class="errors.identity ? 'border-error' : 'border-outline-variant/50'"
                  id="identity"
                  name="identity"
                  placeholder="name@example.com"
                  type="text"
                  @blur="validateField('identity')"
                />
              </div>
              <p v-if="errors.identity" class="font-label-xs text-label-xs text-error mt-1">{{ errors.identity }}</p>
            </div>

            <!-- Password -->
            <div class="space-y-2">
              <div class="flex justify-between items-center">
                <label class="font-label-xs text-label-xs text-on-surface-variant block" for="password">密码</label>
                <a class="font-label-xs text-label-xs text-primary hover:underline underline-offset-4" href="#">忘记密码�?/a>
              </div>
              <div class="relative">
                <span class="material-symbols-outlined absolute left-3 top-1/2 -translate-y-1/2 text-outline text-[20px]">lock</span>
                <input
                  v-model="loginForm.password"
                  class="w-full pl-10 pr-10 py-3 bg-surface-container border rounded-lg font-body-md text-on-surface transition-all focus:border-primary"
                  :class="errors.password ? 'border-error' : 'border-outline-variant/50'"
                  id="password"
                  name="password"
                  :type="showPassword ? 'text' : 'password'"
                  @blur="validateField('password')"
                />
                <button type="button" class="absolute right-3 top-1/2 -translate-y-1/2 text-outline hover:text-on-surface transition-colors" @click="showPassword = !showPassword">
                  <span class="material-symbols-outlined text-[20px]">{{ showPassword ? 'visibility_off' : 'visibility' }}</span>
                </button>
              </div>
              <p v-if="errors.password" class="font-label-xs text-label-xs text-error mt-1">{{ errors.password }}</p>
            </div>

            <!-- Remember Me -->
            <div class="flex items-center gap-2">
              <input v-model="loginForm.remember" class="w-4 h-4 rounded border-outline-variant text-primary focus:ring-primary/20 bg-surface" id="remember" name="remember" type="checkbox"/>
              <label class="font-body-md text-sm text-on-surface-variant select-none" for="remember">保持登录状�?/label>
            </div>

            <!-- Submit Button -->
            <button
              :disabled="isLoading"
              class="w-full bg-primary text-on-primary py-3 px-6 rounded-lg font-headline-md text-base font-semibold hover:bg-primary/90 active:scale-[0.98] transition-all duration-200 disabled:opacity-70 disabled:cursor-not-allowed flex items-center justify-center gap-2"
              type="submit"
            >
              <span v-if="isLoading" class="flex items-center gap-2">
                登录�?..
                <svg class="animate-spin h-4 w-4 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                  <circle class="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" stroke-width="4"></circle>
                  <path class="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                </svg>
              </span>
              <span v-else>登录</span>
            </button>
          </form>

          <!-- Divider -->
          <div class="relative my-stack-lg">
            <div class="absolute inset-0 flex items-center">
              <div class="w-full border-t border-outline-variant/30"></div>
            </div>
          </div>
        </div>

        <!-- Footer Links -->
        <div class="mt-stack-md flex justify-center">
          <a class="font-label-xs text-label-xs text-on-surface-variant hover:text-primary transition-colors" href="#">隐私政策</a>
        </div>
      </div>
    </main>

    <!-- Simple Footer -->
    <footer class="w-full py-stack-md bg-transparent">
      <div class="max-w-container-max mx-auto px-gutter text-center">
        <p class="font-label-xs text-label-xs text-outline/60">
          © 2026 DevLog. Built with precision.
        </p>
      </div>
    </footer>
  </div>
</template>

<script setup lang="ts">
import { ref, reactive, onMounted, onUnmounted } from 'vue'
import { useRouter } from 'vue-router'
import { useAuthStore } from '../stores/auth'

const router = useRouter()
const authStore = useAuthStore()

const progressBar = ref<HTMLElement>()
const bg1 = ref<HTMLElement>()
const bg2 = ref<HTMLElement>()
const showPassword = ref(false)
const isLoading = ref(false)
const errorMessage = ref('')

const errors = reactive({
  identity: '',
  password: ''
})

const loginForm = reactive({
  identity: '',
  password: '',
  remember: false
})

const validateField = (field: 'identity' | 'password') => {
  if (field === 'identity') {
    if (!loginForm.identity.trim()) {
      errors.identity = '请输入邮箱或用户�?
    } else {
      errors.identity = ''
    }
  }
  if (field === 'password') {
    if (!loginForm.password) {
      errors.password = '请输入密�?
    } else if (loginForm.password.length < 6) {
      errors.password = '密码至少6�?
    } else {
      errors.password = ''
    }
  }
}

const validateForm = () => {
  validateField('identity')
  validateField('password')
  return !errors.identity && !errors.password
}

// Progress bar animation on load
const animateProgress = () => {
  if (progressBar.value) {
    progressBar.value.style.width = '30%'
    setTimeout(() => {
      progressBar.value!.style.width = '100%'
      setTimeout(() => {
        progressBar.value!.style.opacity = '0'
      }, 400)
    }, 300)
  }
}

// Subtle parallax effect on background
const handleMouseMove = (e: MouseEvent) => {
  const moveX = (e.clientX - window.innerWidth / 2) * 0.01
  const moveY = (e.clientY - window.innerHeight / 2) * 0.01
  if (bg1.value) {
    bg1.value.style.transform = `translate(${moveX * 2}px, ${moveY * 2}px)`
  }
  if (bg2.value) {
    bg2.value.style.transform = `translate(${moveX * 4}px, ${moveY * 4}px)`
  }
}

const handleLogin = async () => {
  errorMessage.value = ''
  
  // 验证表单
  if (!validateForm()) {
    return
  }
  
  isLoading.value = true

  try {
    const success = await authStore.login({
      email: loginForm.identity,
      password: loginForm.password
    })

    if (success) {
      // Redirect based on remember flag
      if (loginForm.remember) {
        localStorage.setItem('remember', 'true')
      }
      isLoading.value = false
      router.push('/')
    } else {
      errorMessage.value = '用户名或密码错误'
    }
  } catch (error: any) {
    errorMessage.value = error.message || '登录失败，请稍后重试'
    isLoading.value = false
  } finally {
    isLoading.value = false
  }
}

onMounted(() => {
  animateProgress()
  document.addEventListener('mousemove', handleMouseMove)
})

onUnmounted(() => {
  document.removeEventListener('mousemove', handleMouseMove)
})
</script>

<style scoped>
.material-symbols-outlined {
  font-variation-settings: 'FILL' 0, 'wght' 400, 'GRAD' 0, 'opsz' 24;
  display: inline-block;
  vertical-align: middle;
}

input:focus {
  outline: none;
  box-shadow: none;
  border-color: theme('colors.primary');
}
</style>

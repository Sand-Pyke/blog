import { defineStore } from 'pinia'
import { ref, computed } from 'vue'

interface User {
  id: number
  username: string
  email: string
  role: string
}

const API_BASE_URL = import.meta.env.VITE_API_URL || '/api'

export const useAuthStore = defineStore('auth', () => {
  const token = ref<string | null>(localStorage.getItem('token'))
  const user = ref<User | null>(null)
  const isLoading = ref(false)

  const isAuthenticated = computed(() => !!token.value && !!user.value)

  const setToken = (newToken: string) => {
    token.value = newToken
    localStorage.setItem('token', newToken)
  }

  const setUser = (userData: User) => {
    user.value = userData
    localStorage.setItem('user', JSON.stringify(userData))
  }

  const logout = () => {
    token.value = null
    user.value = null
    localStorage.removeItem('token')
    localStorage.removeItem('user')
    localStorage.removeItem('remember')
  }

  const login = async (params: { email: string; password: string }): Promise<boolean> => {
    isLoading.value = true
    try {
      const response = await fetch(`${API_BASE_URL}/auth/login`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({ email: params.email, password: params.password })
      })

      if (!response.ok) {
        const error = await response.json()
        throw new Error(error.message || '登录失败')
      }
      const data = await response.json()
      if (data.token) {
        setToken(data.token)
        setUser(data.user)
        return true
      }
      return false
    } catch (error: any) {
      console.error('Login error:', error)
      throw error
    } finally {
      isLoading.value = false
    }
  }

  const fetchUserInfo = async (): Promise<boolean> => {
    if (!token.value) return false
    try {
      const response = await fetch(`${API_BASE_URL}/auth/me`, {
        headers: {
          'Authorization': `Bearer ${token.value}`
        }
      })

      if (!response.ok) {
        // 接口不可用时不强退，保留 token
        if (response.status === 401 || response.status === 403) {
          logout()
        }
        return false
      }

      const data = await response.json()
      if (data?.user) {
        setUser(data.user)
      } else if (data?.id) {
        // 某些后端直接返回 user 对象而非 { user: ... }
        setUser(data)
      }
      return true
    } catch (error) {
      // 网络错误不强退，保留 token 和 user
      console.error('Fetch user info error:', error)
      return false
    }
  }

  // Initialize user from localStorage
  const initAuth = async () => {
    const storedUser = localStorage.getItem('user')
    if (storedUser && token.value) {
      try {
        if (storedUser !== 'undefined' && storedUser !== 'null') {
          user.value = JSON.parse(storedUser)
        }
        // 尝试验证 token 是否有效（失败不清理状态）
        await fetchUserInfo()
      } catch (error) {
        // 解析失败只清除 user，保留 token
        console.error('Failed to parse stored user:', error)
        localStorage.removeItem('user')
        user.value = null
      }
    }
  }

  return {
    token,
    user,
    isLoading,
    isAuthenticated,
    login,
    logout,
    fetchUserInfo,
    initAuth,
    setToken,
    setUser
  }
})

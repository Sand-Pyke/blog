import { useAuthStore } from '../stores/auth'

const API_BASE_URL = import.meta.env.VITE_API_URL || '/api'

interface ApiOptions {
  method?: 'GET' | 'POST' | 'PUT' | 'DELETE' | 'PATCH'
  body?: any
  headers?: Record<string, string>
  requiresAuth?: boolean
}

class ApiService {
  private getHeaders(additionalHeaders?: Record<string, string>, requiresAuth = false): Record<string, string> {
    const headers: Record<string, string> = {
      'Content-Type': 'application/json',
      ...additionalHeaders
    }

    if (requiresAuth) {
      const authStore = useAuthStore()
      if (authStore.token) {
        headers['Authorization'] = `Bearer ${authStore.token}`
      }
    }

    return headers
  }

  private async request<T>(endpoint: string, options: ApiOptions = {}): Promise<T> {
    const { method = 'GET', body, headers, requiresAuth = false } = options

    const config: RequestInit = {
      method,
      headers: this.getHeaders(headers, requiresAuth),
    }

    if (body && method !== 'GET') {
      config.body = JSON.stringify(body)
    }

    const response = await fetch(`${API_BASE_URL}${endpoint}`, config)

    if (!response.ok) {
      const error = await response.json().catch(() => ({ message: '请求失败' }))
      throw new Error(error.message || `HTTP ${response.status}`)
    }

    return response.json()
  }

  // ============ 博客相关 API ============
  async getBlogs(params?: { page?: number; limit?: number; category?: string; status?: string }) {
    const queryParams = new URLSearchParams()
    if (params?.page) queryParams.set('page', params.page.toString())
    if (params?.limit) queryParams.set('limit', params.limit.toString())
    if (params?.category) queryParams.set('category', params.category)
    if (params?.status) queryParams.set('status', params.status)
    
    const query = queryParams.toString()
    return this.request<{ blogs: any[]; total: number; page: number; totalPages: number }>(
      `/blog/posts${query ? `?${query}` : ''}`
    )
  }

  async getBlogBySlug(slug: string) {
    return this.request<any>(`/blog/posts/${slug}`)
  }

  async getBlogById(id: string) {
    return this.request<any>(`/blog/posts/${id}`)
  }

  async createBlog(data: { title: string; content: string; category: string; tags: string[]; status: string; isPublic?: boolean }) {
    return this.request<any>('/blog/posts', {
      method: 'POST',
      body: data,
      requiresAuth: true
    })
  }

  async updateBlog(id: string, data: Partial<{ title: string; content: string; category: string; tags: string[]; status: string; isPublic: boolean }>) {
    return this.request<any>(`/blog/posts/${id}`, {
      method: 'PUT',
      body: data,
      requiresAuth: true
    })
  }

  async deleteBlog(id: string) {
    return this.request<{ message: string }>(`/blog/posts/${id}`, {
      method: 'DELETE',
      requiresAuth: true
    })
  }


  // ============ 日常分享 API ============
  async getDailies(params?: { page?: number; limit?: number }) {
    const queryParams = new URLSearchParams()
    if (params?.page) queryParams.set('page', params.page.toString())
    if (params?.limit) queryParams.set('limit', params.limit.toString())
    
    const query = queryParams.toString()
    return this.request<{ dailies: any[]; total: number; page: number; totalPages: number }>(
      `/daily${query ? `?${query}` : ''}`
    )
  }

  async getDailyById(id: string) {
    return this.request<any>(`/daily/${id}`)
  }

  async createDaily(data: { content: string; date?: string; mood?: string; location?: string; codeSnippet?: string; bookCover?: string; tags?: string[] }) {
    return this.request<any>('/daily', {
      method: 'POST',
      body: data,
      requiresAuth: true
    })
  }

  async updateDaily(id: string, data: Partial<{ content: string; mood?: string; location?: string; codeSnippet?: string; bookCover?: string }>) {
    return this.request<any>(`/daily/${id}`, {
      method: 'PUT',
      body: data,
      requiresAuth: true
    })
  }

  async deleteDaily(id: string) {
    return this.request<{ message: string }>(`/daily/${id}`, {
      method: 'DELETE',
      requiresAuth: true
    })
  }

  // ============ 技�?API ============
  async getSkills() {
    return this.request<{ skills: any[] }>('/skills')
  }

  async createSkill(data: { name: string; category: string; level: number; description?: string }) {
    return this.request<any>('/skills', {
      method: 'POST',
      body: data,
      requiresAuth: true
    })
  }

  async updateSkill(id: string, data: Partial<{ name: string; category: string; level: number; description?: string }>) {
    return this.request<any>(`/skills/${id}`, {
      method: 'PUT',
      body: data,
      requiresAuth: true
    })
  }

  async deleteSkill(id: string) {
    return this.request<{ message: string }>(`/skills/${id}`, {
      method: 'DELETE',
      requiresAuth: true
    })
  }

  // ============ 分类 API ============
  async getCategories() {
    return this.request<{ categories: any[] }>('/categories')
  }

  async getTags() {
    return this.request<{ tags: any[] }>('/tags')
  }
}

export const api = new ApiService()
export default api

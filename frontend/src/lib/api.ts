import type { Category, Tag, Task, DailyTask, Stats } from '../types'

const API_BASE = import.meta.env.VITE_API_URL || 'http://localhost:8787'

async function fetchAPI<T>(path: string, options?: RequestInit): Promise<T> {
  const res = await fetch(`${API_BASE}${path}`, {
    ...options,
    headers: {
      'Content-Type': 'application/json',
      ...options?.headers,
    },
  })
  if (!res.ok) {
    throw new Error(`API Error: ${res.status}`)
  }
  return res.json()
}

// Categories
export const getCategories = () => fetchAPI<Category[]>('/api/categories')

export const createCategory = (data: Omit<Category, 'id'>) =>
  fetchAPI<Category>('/api/categories', {
    method: 'POST',
    body: JSON.stringify(data),
  })

// Tags
export const getTags = () => fetchAPI<Tag[]>('/api/tags')

export const createTag = (name: string) =>
  fetchAPI<Tag>('/api/tags', {
    method: 'POST',
    body: JSON.stringify({ name }),
  })

// Tasks
export const getTasks = (categoryId?: number) => {
  const query = categoryId ? `?category_id=${categoryId}` : ''
  return fetchAPI<Task[]>(`/api/tasks${query}`)
}

export const createTask = (data: { category_id: number; title: string; description: string }) =>
  fetchAPI<Task>('/api/tasks', {
    method: 'POST',
    body: JSON.stringify(data),
  })

export const updateTask = (id: number, data: { category_id: number; title: string; description: string }) =>
  fetchAPI<Task>(`/api/tasks/${id}`, {
    method: 'PUT',
    body: JSON.stringify(data),
  })

export const deleteTask = (id: number) =>
  fetchAPI<{ success: boolean }>(`/api/tasks/${id}`, {
    method: 'DELETE',
  })

// Daily Tasks
export const getDailyTasks = (date: string) =>
  fetchAPI<DailyTask[]>(`/api/daily-tasks?date=${date}`)

export const generateDailyTasks = (data: { date: string; category_ids: number[]; count: number }) =>
  fetchAPI<{ success: boolean; count: number }>('/api/daily-tasks/generate', {
    method: 'POST',
    body: JSON.stringify(data),
  })

export const updateDailyTask = (
  id: number,
  data: { is_completed?: boolean; is_starred?: boolean; memo?: string }
) =>
  fetchAPI<{ success: boolean }>(`/api/daily-tasks/${id}`, {
    method: 'PUT',
    body: JSON.stringify(data),
  })

// Stats
export const getStats = () => fetchAPI<Stats>('/api/stats')

// Search
export const searchTasks = (query: string) =>
  fetchAPI<DailyTask[]>(`/api/search?q=${encodeURIComponent(query)}`)

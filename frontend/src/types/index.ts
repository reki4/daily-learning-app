export interface Category {
  id: number
  name: string
  icon: string | null
  color: string | null
}

export interface Tag {
  id: number
  name: string
}

export interface Task {
  id: number
  category_id: number
  title: string
  description: string | null
  created_at: string
  category_name?: string
  category_icon?: string
  category_color?: string
}

export interface DailyTask {
  id: number
  task_id: number
  date: string
  is_completed: number
  is_starred: number
  memo: string | null
  completed_at: string | null
  title: string
  description: string | null
  category_name: string | null
  category_icon: string | null
  category_color: string | null
}

export interface Stats {
  total_completed: number
  weekly_completed: number
  streak: number
  category_stats: {
    name: string
    color: string
    completed_count: number
  }[]
}

export type Theme = 'notion' | 'tonal' | 'industrial'

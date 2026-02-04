import { useState, useEffect, useCallback } from 'react'
import type { Category, DailyTask, Theme } from './types'
import {
  getCategories,
  getDailyTasks,
  updateDailyTask,
  generateDailyTasks,
} from './lib/api'
import {
  Calendar,
  CategoryList,
  TaskList,
  TaskModal,
  GenerateTasksModal,
  Header,
  SearchModal,
  Dashboard,
} from './components'

function App() {
  const [theme, setTheme] = useState<Theme>('tonal')
  const [selectedDate, setSelectedDate] = useState(new Date())
  const [categories, setCategories] = useState<Category[]>([])
  const [selectedCategoryId, setSelectedCategoryId] = useState<number | null>(null)
  const [dailyTasks, setDailyTasks] = useState<DailyTask[]>([])
  const [selectedTask, setSelectedTask] = useState<DailyTask | null>(null)
  const [showGenerateModal, setShowGenerateModal] = useState(false)
  const [showSearchModal, setShowSearchModal] = useState(false)
  const [showDashboard, setShowDashboard] = useState(false)
  const [loading, setLoading] = useState(true)

  const dateString = selectedDate.toISOString().split('T')[0]

  // Load categories
  useEffect(() => {
    const loadCategories = async () => {
      try {
        const data = await getCategories()
        setCategories(data)
      } catch (error) {
        console.error('Failed to load categories:', error)
      }
    }
    loadCategories()
  }, [])

  // Load daily tasks
  const loadDailyTasks = useCallback(async () => {
    setLoading(true)
    try {
      const data = await getDailyTasks(dateString)
      setDailyTasks(data)
    } catch (error) {
      console.error('Failed to load daily tasks:', error)
    } finally {
      setLoading(false)
    }
  }, [dateString])

  useEffect(() => {
    loadDailyTasks()
  }, [loadDailyTasks])

  // Filter tasks by category
  const filteredTasks = selectedCategoryId
    ? dailyTasks.filter((t) => {
        const category = categories.find((c) => c.name === t.category_name)
        return category?.id === selectedCategoryId
      })
    : dailyTasks

  // Handle star toggle
  const handleStarToggle = async (task: DailyTask) => {
    try {
      await updateDailyTask(task.id, { is_starred: !task.is_starred })
      setDailyTasks((prev) =>
        prev.map((t) =>
          t.id === task.id ? { ...t, is_starred: t.is_starred ? 0 : 1 } : t
        )
      )
    } catch (error) {
      console.error('Failed to toggle star:', error)
    }
  }

  // Handle task complete
  const handleTaskComplete = async (task: DailyTask, memo: string) => {
    try {
      await updateDailyTask(task.id, { is_completed: true, memo })
      setDailyTasks((prev) =>
        prev.map((t) =>
          t.id === task.id
            ? { ...t, is_completed: 1, memo, completed_at: new Date().toISOString() }
            : t
        )
      )
      setSelectedTask(null)
    } catch (error) {
      console.error('Failed to complete task:', error)
    }
  }

  // Handle generate tasks
  const handleGenerateTasks = async (categoryIds: number[], count: number) => {
    try {
      await generateDailyTasks({ date: dateString, category_ids: categoryIds, count })
      await loadDailyTasks()
      setShowGenerateModal(false)
    } catch (error) {
      console.error('Failed to generate tasks:', error)
    }
  }

  // Theme classes
  const themeClasses = {
    notion: 'bg-white',
    tonal: 'bg-amber-50',
    industrial: 'bg-gray-100',
  }

  return (
    <div className={`min-h-screen ${themeClasses[theme]}`}>
      <Header
        theme={theme}
        onThemeChange={setTheme}
        onSearchClick={() => setShowSearchModal(true)}
        onDashboardClick={() => setShowDashboard(true)}
      />

      <div className="flex">
        {/* Sidebar */}
        <aside className="w-72 p-6 border-r border-gray-200 min-h-[calc(100vh-57px)]">
          <div className="flex items-center gap-2 mb-6">
            <span className="text-2xl">📚</span>
            <h1 className="text-xl font-bold text-gray-900">学習記録</h1>
          </div>

          <Calendar selectedDate={selectedDate} onDateSelect={setSelectedDate} />

          <div className="mt-6">
            <CategoryList
              categories={categories}
              selectedCategoryId={selectedCategoryId}
              onCategorySelect={setSelectedCategoryId}
            />
          </div>
        </aside>

        {/* Main content */}
        <main className="flex-1 p-8 pr-12">
          <div>
            {loading ? (
              <div className="text-center py-12 text-gray-500">読み込み中...</div>
            ) : (
              <>
                <TaskList
                  tasks={filteredTasks}
                  date={selectedDate}
                  onTaskClick={setSelectedTask}
                  onStarToggle={handleStarToggle}
                />

                {filteredTasks.length === 0 && (
                  <button
                    onClick={() => setShowGenerateModal(true)}
                    className="mt-4 w-full py-3 bg-orange-500 hover:bg-orange-600 text-white rounded-lg font-medium transition-colors"
                  >
                    タスクを生成
                  </button>
                )}
              </>
            )}
          </div>
        </main>
      </div>

      {/* Modals */}
      {selectedTask && (
        <TaskModal
          task={selectedTask}
          onClose={() => setSelectedTask(null)}
          onComplete={handleTaskComplete}
        />
      )}

      {showGenerateModal && (
        <GenerateTasksModal
          categories={categories}
          onClose={() => setShowGenerateModal(false)}
          onGenerate={handleGenerateTasks}
        />
      )}

      {showSearchModal && (
        <SearchModal
          onClose={() => setShowSearchModal(false)}
          onTaskClick={setSelectedTask}
        />
      )}

      {showDashboard && <Dashboard onClose={() => setShowDashboard(false)} />}
    </div>
  )
}

export default App

import { useState, useEffect } from 'react'
import type { DailyTask } from '../types'
import { searchTasks } from '../lib/api'

interface SearchModalProps {
  onClose: () => void
  onTaskClick: (task: DailyTask) => void
}

export function SearchModal({ onClose, onTaskClick }: SearchModalProps) {
  const [query, setQuery] = useState('')
  const [results, setResults] = useState<DailyTask[]>([])
  const [loading, setLoading] = useState(false)

  useEffect(() => {
    if (query.length < 2) {
      setResults([])
      return
    }

    const timer = setTimeout(async () => {
      setLoading(true)
      try {
        const data = await searchTasks(query)
        setResults(data)
      } catch (error) {
        console.error('Search error:', error)
      } finally {
        setLoading(false)
      }
    }, 300)

    return () => clearTimeout(timer)
  }, [query])

  return (
    <div className="fixed inset-0 bg-black/50 flex items-start justify-center z-50 pt-20 px-4">
      <div className="bg-white rounded-xl max-w-2xl w-full shadow-xl">
        <div className="p-4 border-b border-gray-200">
          <div className="flex items-center gap-3">
            <span className="text-gray-400">🔍</span>
            <input
              type="text"
              value={query}
              onChange={(e) => setQuery(e.target.value)}
              placeholder="タスクやメモを検索..."
              className="flex-1 outline-none text-lg"
              autoFocus
            />
            <button
              onClick={onClose}
              className="text-gray-400 hover:text-gray-600"
            >
              ✕
            </button>
          </div>
        </div>

        <div className="max-h-96 overflow-y-auto">
          {loading && (
            <div className="p-4 text-center text-gray-500">検索中...</div>
          )}

          {!loading && query.length >= 2 && results.length === 0 && (
            <div className="p-4 text-center text-gray-500">
              結果が見つかりませんでした
            </div>
          )}

          {results.map((task) => (
            <button
              key={task.id}
              onClick={() => {
                onTaskClick(task)
                onClose()
              }}
              className="w-full p-4 text-left hover:bg-gray-50 border-b border-gray-100 last:border-0"
            >
              <div className="flex items-center justify-between">
                <div>
                  <div className="font-medium text-gray-900">{task.title}</div>
                  {task.category_name && (
                    <span className="text-sm text-gray-500">
                      {task.category_name}
                    </span>
                  )}
                </div>
                <span className="text-sm text-gray-400">{task.date}</span>
              </div>
              {task.memo && (
                <p className="text-sm text-gray-500 mt-1 line-clamp-1">
                  メモ: {task.memo}
                </p>
              )}
            </button>
          ))}
        </div>
      </div>
    </div>
  )
}

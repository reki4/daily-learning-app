import { useState } from 'react'
import type { Category } from '../types'

interface GenerateTasksModalProps {
  categories: Category[]
  onClose: () => void
  onGenerate: (categoryIds: number[], count: number) => void
}

export function GenerateTasksModal({
  categories,
  onClose,
  onGenerate,
}: GenerateTasksModalProps) {
  const [selectedCategories, setSelectedCategories] = useState<number[]>([])
  const [count, setCount] = useState<5 | 10>(5)

  const toggleCategory = (id: number) => {
    setSelectedCategories((prev) =>
      prev.includes(id) ? prev.filter((c) => c !== id) : [...prev, id]
    )
  }

  const selectAll = () => {
    setSelectedCategories(categories.map((c) => c.id))
  }

  const handleGenerate = () => {
    if (selectedCategories.length === 0) return
    onGenerate(selectedCategories, count)
  }

  return (
    <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
      <div className="bg-white rounded-xl max-w-md w-full shadow-xl">
        <div className="p-6">
          <div className="flex items-center justify-between mb-6">
            <h2 className="text-xl font-semibold text-gray-900">
              タスクを生成
            </h2>
            <button
              onClick={onClose}
              className="text-gray-400 hover:text-gray-600 text-2xl leading-none"
            >
              ×
            </button>
          </div>

          {/* Category selection */}
          <div className="mb-6">
            <div className="flex items-center justify-between mb-2">
              <label className="block text-sm font-medium text-gray-700">
                カテゴリを選択
              </label>
              <button
                onClick={selectAll}
                className="text-sm text-orange-500 hover:text-orange-600"
              >
                すべて選択
              </button>
            </div>
            <div className="space-y-2 max-h-48 overflow-y-auto">
              {categories.map((category) => (
                <label
                  key={category.id}
                  className="flex items-center gap-3 p-2 rounded-lg hover:bg-gray-50 cursor-pointer"
                >
                  <input
                    type="checkbox"
                    checked={selectedCategories.includes(category.id)}
                    onChange={() => toggleCategory(category.id)}
                    className="w-4 h-4 text-orange-500 rounded focus:ring-orange-500"
                  />
                  <span className="text-gray-700">{category.name}</span>
                </label>
              ))}
            </div>
          </div>

          {/* Count selection */}
          <div className="mb-6">
            <label className="block text-sm font-medium text-gray-700 mb-2">
              タスク数
            </label>
            <div className="flex gap-4">
              <button
                onClick={() => setCount(5)}
                className={`flex-1 py-2 rounded-lg border-2 font-medium transition-colors
                  ${count === 5
                    ? 'border-orange-500 bg-orange-50 text-orange-600'
                    : 'border-gray-200 text-gray-600 hover:border-gray-300'
                  }
                `}
              >
                5件
              </button>
              <button
                onClick={() => setCount(10)}
                className={`flex-1 py-2 rounded-lg border-2 font-medium transition-colors
                  ${count === 10
                    ? 'border-orange-500 bg-orange-50 text-orange-600'
                    : 'border-gray-200 text-gray-600 hover:border-gray-300'
                  }
                `}
              >
                10件
              </button>
            </div>
          </div>

          {/* Generate button */}
          <button
            onClick={handleGenerate}
            disabled={selectedCategories.length === 0}
            className={`w-full py-3 rounded-lg font-medium transition-colors
              ${selectedCategories.length > 0
                ? 'bg-orange-500 hover:bg-orange-600 text-white'
                : 'bg-gray-200 text-gray-400 cursor-not-allowed'
              }
            `}
          >
            生成する
          </button>
        </div>
      </div>
    </div>
  )
}

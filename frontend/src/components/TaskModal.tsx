import { useState } from 'react'
import type { DailyTask } from '../types'

interface TaskModalProps {
  task: DailyTask
  onClose: () => void
  onComplete: (task: DailyTask, memo: string) => void
}

const categoryIcons: Record<string, string> = {
  docker: '🐳',
  go: '🔵',
  dynamodb: '📦',
  ecs: '☁️',
  kubernetes: '⎈',
  aws: '☁️',
  react: '⚛️',
  typescript: '📘',
  python: '🐍',
  default: '📚',
}

export function TaskModal({ task, onClose, onComplete }: TaskModalProps) {
  const [memo, setMemo] = useState(task.memo || '')
  const iconKey = task.category_icon?.toLowerCase() || 'default'
  const icon = categoryIcons[iconKey] || categoryIcons.default

  const handleComplete = () => {
    onComplete(task, memo)
  }

  // Simple markdown renderer (basic)
  const renderDescription = (text: string | null) => {
    if (!text) return null

    // Convert markdown-like syntax to HTML
    // Important: Process code blocks BEFORE inline code to prevent corruption
    const html = text
      // Multi-line code blocks (```lang\n...\n```)
      .replace(/```(\w*)\n([\s\S]*?)```/g, (_match, _lang, code) => {
        const escapedCode = code
          .replace(/&/g, '&amp;')
          .replace(/</g, '&lt;')
          .replace(/>/g, '&gt;')
          .trimEnd()
        return `<pre class="bg-gray-800 text-gray-100 p-3 rounded-lg overflow-x-auto my-3 text-sm"><code>${escapedCode}</code></pre>`
      })
      // Blockquotes (> text)
      .replace(/^> (.+)$/gm, '<blockquote class="border-l-4 border-gray-300 pl-4 my-2 text-gray-600 italic">$1</blockquote>')
      // Headers
      .replace(/^### (.+)$/gm, '<h3 class="text-lg font-semibold mt-4 mb-2">$1</h3>')
      .replace(/^## (.+)$/gm, '<h2 class="text-xl font-semibold mt-4 mb-2">$1</h2>')
      .replace(/^# (.+)$/gm, '<h1 class="text-2xl font-bold mt-4 mb-2">$1</h1>')
      // Links [text](url)
      .replace(/\[([^\]]+)\]\(([^)]+)\)/g, '<a href="$2" target="_blank" rel="noopener noreferrer" class="text-blue-600 hover:underline">$1</a>')
      // Bold and italic
      .replace(/\*\*(.+?)\*\*/g, '<strong>$1</strong>')
      .replace(/\*(.+?)\*/g, '<em>$1</em>')
      // Inline code (after code blocks)
      .replace(/`([^`]+)`/g, '<code class="bg-gray-100 px-1 rounded text-red-600">$1</code>')
      // Numbered lists (1. item)
      .replace(/^\d+\. (.+)$/gm, '<li class="ml-4 list-decimal">$1</li>')
      // Unordered lists
      .replace(/^- (.+)$/gm, '<li class="ml-4 list-disc">$1</li>')
      // Line breaks (but not inside <pre> tags)
      .replace(/\n(?![^<]*<\/pre>)/g, '<br />')

    return (
      <div
        className="prose prose-sm max-w-none text-gray-600"
        dangerouslySetInnerHTML={{ __html: html }}
      />
    )
  }

  return (
    <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
      <div className="bg-white rounded-xl max-w-lg w-full max-h-[90vh] overflow-hidden shadow-xl">
        <div className="p-6">
          {/* Header */}
          <div className="flex items-start justify-between mb-4">
            <div className="flex items-center gap-3">
              <span className="text-2xl">{icon}</span>
              <div>
                <h2 className="text-xl font-semibold text-gray-900">
                  {task.title}
                </h2>
                {task.category_name && (
                  <span className="text-sm text-gray-500">
                    {task.category_name}
                  </span>
                )}
              </div>
            </div>
            <button
              onClick={onClose}
              className="text-gray-400 hover:text-gray-600 text-2xl leading-none"
            >
              ×
            </button>
          </div>

          {/* Description */}
          <div className="mb-6 overflow-y-auto max-h-60">
            {renderDescription(task.description)}
          </div>

          {/* Memo input */}
          {!task.is_completed && (
            <div className="mb-4">
              <label className="block text-sm font-medium text-gray-700 mb-1">
                メモ（学んだこと）
              </label>
              <textarea
                value={memo}
                onChange={(e) => setMemo(e.target.value)}
                className="w-full border border-gray-300 rounded-lg p-3 text-sm focus:ring-2 focus:ring-orange-500 focus:border-transparent"
                rows={3}
                placeholder="学んだことや気づきを記録..."
              />
            </div>
          )}

          {/* Existing memo display */}
          {task.is_completed && task.memo && (
            <div className="mb-4 p-3 bg-gray-50 rounded-lg">
              <div className="text-sm font-medium text-gray-700 mb-1">メモ</div>
              <p className="text-sm text-gray-600">{task.memo}</p>
            </div>
          )}

          {/* Complete button */}
          {!task.is_completed && (
            <button
              onClick={handleComplete}
              className="w-full bg-green-100 hover:bg-green-200 text-green-700 font-medium py-3 px-4 rounded-lg transition-colors flex items-center justify-center gap-2"
            >
              <span>⭐</span>
              <span>このタスクは完了しました</span>
            </button>
          )}

          {task.is_completed && (
            <div className="w-full bg-gray-100 text-gray-500 font-medium py-3 px-4 rounded-lg text-center">
              完了済み
              {task.completed_at && (
                <span className="text-sm ml-2">
                  ({new Date(task.completed_at).toLocaleString('ja-JP')})
                </span>
              )}
            </div>
          )}
        </div>
      </div>
    </div>
  )
}

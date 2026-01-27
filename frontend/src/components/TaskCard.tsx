import type { DailyTask } from '../types'

interface TaskCardProps {
  task: DailyTask
  onTaskClick: (task: DailyTask) => void
  onStarToggle: (task: DailyTask) => void
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

const categoryColors: Record<string, string> = {
  docker: 'bg-blue-500',
  go: 'bg-cyan-500',
  dynamodb: 'bg-orange-500',
  ecs: 'bg-purple-500',
  kubernetes: 'bg-blue-600',
  aws: 'bg-yellow-500',
  react: 'bg-sky-500',
  typescript: 'bg-blue-700',
  python: 'bg-green-500',
  default: 'bg-gray-500',
}

export function TaskCard({ task, onTaskClick, onStarToggle }: TaskCardProps) {
  const iconKey = task.category_icon?.toLowerCase() || 'default'
  const icon = categoryIcons[iconKey] || categoryIcons.default
  const colorClass = task.category_color || categoryColors[iconKey] || categoryColors.default

  return (
    <div
      className={`bg-white rounded-lg p-4 shadow-sm border-l-4 cursor-pointer hover:shadow-md transition-shadow
        ${task.is_completed ? 'opacity-60' : ''}
      `}
      style={{ borderLeftColor: task.category_color || undefined }}
      onClick={() => onTaskClick(task)}
    >
      <div className="flex items-start gap-3">
        <div
          className={`w-10 h-10 rounded-lg flex items-center justify-center text-white text-lg ${colorClass}`}
        >
          {icon}
        </div>

        <div className="flex-1 min-w-0">
          <div className="flex items-start justify-between gap-2">
            <h3
              className={`font-medium text-gray-900 ${
                task.is_completed ? 'line-through' : ''
              }`}
            >
              {task.title}
            </h3>
            <button
              onClick={(e) => {
                e.stopPropagation()
                onStarToggle(task)
              }}
              className="text-xl"
            >
              {task.is_starred ? '⭐' : '☆'}
            </button>
          </div>

          {task.description && (
            <p className="text-sm text-gray-500 mt-1 line-clamp-2">
              {task.description}
            </p>
          )}

          {task.category_name && (
            <span
              className="inline-block mt-2 px-2 py-0.5 text-xs rounded-full"
              style={{
                backgroundColor: task.category_color
                  ? `${task.category_color}20`
                  : '#f3f4f6',
                color: task.category_color || '#6b7280',
              }}
            >
              {task.category_name}
            </span>
          )}
        </div>
      </div>
    </div>
  )
}

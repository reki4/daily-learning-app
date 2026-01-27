import type { DailyTask } from '../types'
import { TaskCard } from './TaskCard'

interface TaskListProps {
  tasks: DailyTask[]
  date: Date
  onTaskClick: (task: DailyTask) => void
  onStarToggle: (task: DailyTask) => void
}

export function TaskList({ tasks, date, onTaskClick, onStarToggle }: TaskListProps) {
  const formatDate = (d: Date) => {
    const month = d.getMonth() + 1
    const day = d.getDate()
    return `${month}月${day}日`
  }

  const completedCount = tasks.filter((t) => t.is_completed).length

  return (
    <div>
      <div className="mb-6">
        <h1 className="text-3xl font-bold text-gray-900">{formatDate(date)}</h1>
        <p className="text-orange-500 mt-1">
          今日のタスク: {tasks.length}件
          {completedCount > 0 && (
            <span className="text-gray-400 ml-2">
              ({completedCount}件完了)
            </span>
          )}
        </p>
      </div>

      {tasks.length === 0 ? (
        <div className="text-center py-12 text-gray-500">
          <p>タスクがありません</p>
          <p className="text-sm mt-1">タスクを生成してください</p>
        </div>
      ) : (
        <div className="space-y-4">
          {tasks.map((task) => (
            <TaskCard
              key={task.id}
              task={task}
              onTaskClick={onTaskClick}
              onStarToggle={onStarToggle}
            />
          ))}
        </div>
      )}
    </div>
  )
}

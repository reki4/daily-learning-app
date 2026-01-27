import { useEffect, useState } from 'react'
import type { Stats } from '../types'
import { getStats } from '../lib/api'

interface DashboardProps {
  onClose: () => void
}

export function Dashboard({ onClose }: DashboardProps) {
  const [stats, setStats] = useState<Stats | null>(null)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    const loadStats = async () => {
      try {
        const data = await getStats()
        setStats(data)
      } catch (error) {
        console.error('Failed to load stats:', error)
      } finally {
        setLoading(false)
      }
    }
    loadStats()
  }, [])

  if (loading) {
    return (
      <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50">
        <div className="bg-white rounded-xl p-8">
          <p className="text-gray-500">読み込み中...</p>
        </div>
      </div>
    )
  }

  return (
    <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
      <div className="bg-white rounded-xl max-w-2xl w-full shadow-xl max-h-[90vh] overflow-y-auto">
        <div className="p-6">
          <div className="flex items-center justify-between mb-6">
            <h2 className="text-2xl font-bold text-gray-900">📊 ダッシュボード</h2>
            <button
              onClick={onClose}
              className="text-gray-400 hover:text-gray-600 text-2xl leading-none"
            >
              ×
            </button>
          </div>

          {stats && (
            <>
              {/* Stats cards */}
              <div className="grid grid-cols-3 gap-4 mb-8">
                <div className="bg-gradient-to-br from-orange-50 to-orange-100 rounded-xl p-4">
                  <div className="text-3xl font-bold text-orange-600">
                    {stats.streak}
                  </div>
                  <div className="text-sm text-orange-700">連続学習日数 🔥</div>
                </div>

                <div className="bg-gradient-to-br from-blue-50 to-blue-100 rounded-xl p-4">
                  <div className="text-3xl font-bold text-blue-600">
                    {stats.weekly_completed}
                  </div>
                  <div className="text-sm text-blue-700">今週の完了数</div>
                </div>

                <div className="bg-gradient-to-br from-green-50 to-green-100 rounded-xl p-4">
                  <div className="text-3xl font-bold text-green-600">
                    {stats.total_completed}
                  </div>
                  <div className="text-sm text-green-700">総完了数</div>
                </div>
              </div>

              {/* Category stats */}
              <div>
                <h3 className="text-lg font-semibold text-gray-900 mb-4">
                  カテゴリ別進捗
                </h3>
                {stats.category_stats.length === 0 ? (
                  <p className="text-gray-500 text-center py-4">
                    まだデータがありません
                  </p>
                ) : (
                  <div className="space-y-3">
                    {stats.category_stats.map((cat, index) => {
                      const maxCount = Math.max(
                        ...stats.category_stats.map((c) => c.completed_count)
                      )
                      const percentage = (cat.completed_count / maxCount) * 100

                      return (
                        <div key={index}>
                          <div className="flex items-center justify-between text-sm mb-1">
                            <span className="text-gray-700">{cat.name}</span>
                            <span className="text-gray-500">
                              {cat.completed_count}件
                            </span>
                          </div>
                          <div className="h-3 bg-gray-100 rounded-full overflow-hidden">
                            <div
                              className="h-full rounded-full transition-all duration-500"
                              style={{
                                width: `${percentage}%`,
                                backgroundColor: cat.color || '#f97316',
                              }}
                            />
                          </div>
                        </div>
                      )
                    })}
                  </div>
                )}
              </div>
            </>
          )}
        </div>
      </div>
    </div>
  )
}

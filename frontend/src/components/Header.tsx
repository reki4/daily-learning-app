import type { Theme } from '../types'

interface HeaderProps {
  theme: Theme
  onThemeChange: (theme: Theme) => void
  onSearchClick: () => void
  onDashboardClick: () => void
}

const themeNames: Record<Theme, string> = {
  notion: 'Notion',
  tonal: 'トーナルカラー',
  industrial: 'インダストリアルモダン',
}

export function Header({
  theme,
  onThemeChange,
  onSearchClick,
  onDashboardClick,
}: HeaderProps) {
  const themes: Theme[] = ['notion', 'tonal', 'industrial']

  return (
    <header className="bg-white border-b border-gray-200 px-6 py-3">
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-4">
          {themes.map((t) => (
            <button
              key={t}
              onClick={() => onThemeChange(t)}
              className={`px-4 py-2 rounded-lg text-sm font-medium transition-colors
                ${theme === t
                  ? 'bg-orange-100 text-orange-700'
                  : 'text-gray-600 hover:bg-gray-100'
                }
              `}
            >
              {themeNames[t]}
            </button>
          ))}
        </div>

        <div className="flex items-center gap-3">
          <button
            onClick={onSearchClick}
            className="p-2 hover:bg-gray-100 rounded-lg text-gray-600"
            title="検索"
          >
            🔍
          </button>
          <button
            onClick={onDashboardClick}
            className="p-2 hover:bg-gray-100 rounded-lg text-gray-600"
            title="ダッシュボード"
          >
            📊
          </button>
        </div>
      </div>
    </header>
  )
}

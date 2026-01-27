import type { Category } from '../types'

interface CategoryListProps {
  categories: Category[]
  selectedCategoryId: number | null
  onCategorySelect: (categoryId: number | null) => void
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

export function CategoryList({
  categories,
  selectedCategoryId,
  onCategorySelect,
}: CategoryListProps) {
  const getIcon = (iconName: string | null) => {
    if (!iconName) return categoryIcons.default
    return categoryIcons[iconName.toLowerCase()] || categoryIcons.default
  }

  return (
    <div className="space-y-1">
      <h3 className="text-sm font-medium text-gray-500 mb-2">カテゴリ</h3>

      <button
        onClick={() => onCategorySelect(null)}
        className={`w-full text-left px-3 py-2 rounded-lg text-sm transition-colors
          ${selectedCategoryId === null
            ? 'bg-orange-100 text-orange-700'
            : 'hover:bg-gray-100 text-gray-700'
          }
        `}
      >
        すべて
      </button>

      {categories.map((category) => (
        <button
          key={category.id}
          onClick={() => onCategorySelect(category.id)}
          className={`w-full text-left px-3 py-2 rounded-lg text-sm transition-colors flex items-center gap-2
            ${selectedCategoryId === category.id
              ? 'bg-orange-100 text-orange-700'
              : 'hover:bg-gray-100 text-gray-700'
            }
          `}
        >
          <span>{getIcon(category.icon)}</span>
          <span>{category.name}</span>
        </button>
      ))}
    </div>
  )
}

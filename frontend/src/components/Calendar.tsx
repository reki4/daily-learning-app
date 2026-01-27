import { useMemo } from 'react'

interface CalendarProps {
  selectedDate: Date
  onDateSelect: (date: Date) => void
}

export function Calendar({ selectedDate, onDateSelect }: CalendarProps) {
  const today = new Date()

  const { year, month, days, prevMonthDays, nextMonthDays } = useMemo(() => {
    const y = selectedDate.getFullYear()
    const m = selectedDate.getMonth()

    const firstDay = new Date(y, m, 1)
    const lastDay = new Date(y, m + 1, 0)

    const daysInMonth = lastDay.getDate()
    const startWeekday = firstDay.getDay()

    const days = Array.from({ length: daysInMonth }, (_, i) => i + 1)

    // Previous month days
    const prevMonthLastDay = new Date(y, m, 0).getDate()
    const prevMonthDays = Array.from(
      { length: startWeekday },
      (_, i) => prevMonthLastDay - startWeekday + i + 1
    )

    // Next month days
    const totalCells = Math.ceil((startWeekday + daysInMonth) / 7) * 7
    const nextMonthDays = Array.from(
      { length: totalCells - startWeekday - daysInMonth },
      (_, i) => i + 1
    )

    return { year: y, month: m, days, prevMonthDays, nextMonthDays }
  }, [selectedDate])

  const monthNames = [
    '1月', '2月', '3月', '4月', '5月', '6月',
    '7月', '8月', '9月', '10月', '11月', '12月'
  ]

  const weekDays = ['日', '月', '火', '水', '木', '金', '土']

  const goToPrevMonth = () => {
    onDateSelect(new Date(year, month - 1, 1))
  }

  const goToNextMonth = () => {
    onDateSelect(new Date(year, month + 1, 1))
  }

  const isToday = (day: number) => {
    return (
      today.getFullYear() === year &&
      today.getMonth() === month &&
      today.getDate() === day
    )
  }

  const isSelected = (day: number) => {
    return selectedDate.getDate() === day
  }

  return (
    <div className="bg-white rounded-lg p-4 shadow-sm">
      <div className="flex items-center justify-between mb-4">
        <button
          onClick={goToPrevMonth}
          className="p-1 hover:bg-gray-100 rounded text-gray-600"
        >
          &lt;
        </button>
        <span className="font-medium">
          {year}年{monthNames[month]}
        </span>
        <button
          onClick={goToNextMonth}
          className="p-1 hover:bg-gray-100 rounded text-gray-600"
        >
          &gt;
        </button>
      </div>

      <div className="grid grid-cols-7 gap-1 text-center text-sm">
        {weekDays.map((day) => (
          <div key={day} className="py-1 text-gray-500 text-xs">
            {day}
          </div>
        ))}

        {prevMonthDays.map((day) => (
          <div key={`prev-${day}`} className="py-1 text-gray-300">
            {day}
          </div>
        ))}

        {days.map((day) => (
          <button
            key={day}
            onClick={() => onDateSelect(new Date(year, month, day))}
            className={`py-1 rounded-full text-sm transition-colors
              ${isToday(day) ? 'bg-orange-500 text-white' : ''}
              ${isSelected(day) && !isToday(day) ? 'bg-orange-100 text-orange-600' : ''}
              ${!isToday(day) && !isSelected(day) ? 'hover:bg-gray-100' : ''}
            `}
          >
            {day}
          </button>
        ))}

        {nextMonthDays.map((day) => (
          <div key={`next-${day}`} className="py-1 text-gray-300">
            {day}
          </div>
        ))}
      </div>
    </div>
  )
}

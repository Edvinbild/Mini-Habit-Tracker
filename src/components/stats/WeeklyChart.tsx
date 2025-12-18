interface DayData {
  date: string
  dayName: string
  percentage: number
}

interface WeeklyChartProps {
  data: DayData[]
}

export function WeeklyChart({ data }: WeeklyChartProps) {
  const today = new Date().toISOString().split('T')[0]

  return (
    <div className="bg-white dark:bg-gray-800 rounded-xl p-4 border border-gray-200 dark:border-gray-700">
      <h3 className="text-sm font-medium text-gray-700 dark:text-gray-300 mb-4">
        Zadnjih 7 dana
      </h3>

      <div className="flex items-end justify-between gap-2 h-32">
        {data.map((day) => {
          const isToday = day.date === today
          const height = Math.max(4, day.percentage) // Minimum height for visibility

          return (
            <div key={day.date} className="flex-1 flex flex-col items-center gap-2">
              {/* Percentage label */}
              <span className="text-xs text-gray-500 dark:text-gray-400">
                {day.percentage}%
              </span>

              {/* Bar */}
              <div className="w-full flex-1 flex items-end">
                <div
                  className={`w-full rounded-t-md transition-all ${
                    day.percentage === 0
                      ? 'bg-gray-200 dark:bg-gray-700'
                      : day.percentage < 50
                        ? 'bg-green-300 dark:bg-green-800'
                        : day.percentage < 100
                          ? 'bg-green-500 dark:bg-green-600'
                          : 'bg-green-600 dark:bg-green-500'
                  } ${isToday ? 'ring-2 ring-indigo-500' : ''}`}
                  style={{ height: `${height}%` }}
                />
              </div>

              {/* Day label */}
              <span className={`text-xs font-medium ${
                isToday
                  ? 'text-indigo-600 dark:text-indigo-400'
                  : 'text-gray-500 dark:text-gray-400'
              }`}>
                {day.dayName}
              </span>
            </div>
          )
        })}
      </div>
    </div>
  )
}

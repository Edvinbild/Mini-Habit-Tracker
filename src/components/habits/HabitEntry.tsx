import { HabitWithEntry } from '../../types'

interface HabitEntryProps {
  habit: HabitWithEntry
  onToggle: () => void
  streak?: number
}

export function HabitEntry({ habit, onToggle, streak }: HabitEntryProps) {
  const isCompleted = habit.todayEntry?.completed || false

  return (
    <button
      onClick={onToggle}
      className={`w-full flex items-center gap-4 p-4 rounded-xl transition-all ${
        isCompleted
          ? 'bg-gray-50 dark:bg-gray-800/50'
          : 'bg-white dark:bg-gray-800 hover:bg-gray-50 dark:hover:bg-gray-750'
      } border border-gray-200 dark:border-gray-700`}
    >
      {/* Animated Checkbox */}
      <div
        className={`w-10 h-10 rounded-xl flex items-center justify-center transition-all duration-200 ${
          isCompleted ? 'scale-110' : 'scale-100'
        }`}
        style={{ backgroundColor: isCompleted ? habit.color : `${habit.color}20` }}
      >
        {isCompleted ? (
          <svg
            className="w-6 h-6 text-white animate-[scale_0.2s_ease-in-out]"
            fill="none"
            viewBox="0 0 24 24"
            stroke="currentColor"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={3}
              d="M5 13l4 4L19 7"
            />
          </svg>
        ) : (
          <div
            className="w-4 h-4 rounded-md"
            style={{ backgroundColor: habit.color }}
          />
        )}
      </div>

      {/* Habit Info */}
      <div className="flex-1 text-left">
        <h3
          className={`font-semibold transition-all ${
            isCompleted
              ? 'text-gray-400 dark:text-gray-500'
              : 'text-gray-900 dark:text-white'
          }`}
        >
          {habit.title}
        </h3>
        {habit.description && (
          <p className="text-sm text-gray-500 dark:text-gray-400 truncate">
            {habit.description}
          </p>
        )}
      </div>

      {/* Streak Badge */}
      {streak !== undefined && streak > 0 && (
        <div className="flex items-center gap-1 px-2 py-1 bg-orange-100 dark:bg-orange-900/30 rounded-lg">
          <span className="text-orange-500">🔥</span>
          <span className="text-sm font-medium text-orange-600 dark:text-orange-400">
            {streak}
          </span>
        </div>
      )}
    </button>
  )
}

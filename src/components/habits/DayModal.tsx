import { Habit, HabitEntry } from '../../types'
import { formatDateHR } from '../../utils/calendar'

interface DayModalProps {
  date: string
  habits: Habit[]
  entries: HabitEntry[]
  onToggle: (habitId: string, date: string, completed: boolean) => void
  onClose: () => void
}

export function DayModal({ date, habits, entries, onToggle, onClose }: DayModalProps) {
  // Get entry status for a habit on this date
  const getEntryForHabit = (habitId: string): HabitEntry | undefined => {
    return entries.find(e => e.habit_id === habitId && e.date === date)
  }

  const isCompleted = (habitId: string): boolean => {
    const entry = getEntryForHabit(habitId)
    return entry?.completed || false
  }

  const handleToggle = (habitId: string) => {
    const currentlyCompleted = isCompleted(habitId)
    onToggle(habitId, date, !currentlyCompleted)
  }

  const completedCount = habits.filter(h => isCompleted(h.id)).length
  const percentage = habits.length > 0 ? Math.round((completedCount / habits.length) * 100) : 0

  return (
    <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
      <div className="bg-white dark:bg-gray-800 rounded-xl p-6 max-w-md w-full shadow-xl max-h-[80vh] flex flex-col">
        {/* Header */}
        <div className="flex items-center justify-between mb-4">
          <div>
            <h3 className="text-lg font-semibold text-gray-900 dark:text-white capitalize">
              {formatDateHR(date)}
            </h3>
            <p className="text-sm text-gray-500 dark:text-gray-400">
              {completedCount}/{habits.length} habit-a ({percentage}%)
            </p>
          </div>
          <button
            onClick={onClose}
            className="p-2 hover:bg-gray-100 dark:hover:bg-gray-700 rounded-lg transition-colors"
          >
            <svg className="w-5 h-5 text-gray-500 dark:text-gray-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
            </svg>
          </button>
        </div>

        {/* Progress bar */}
        <div className="bg-gray-200 dark:bg-gray-700 rounded-full h-2 mb-4">
          <div
            className="bg-green-500 h-2 rounded-full transition-all duration-300"
            style={{ width: `${percentage}%` }}
          />
        </div>

        {/* Habits list */}
        <div className="flex-1 overflow-y-auto space-y-2">
          {habits.length === 0 ? (
            <p className="text-center text-gray-500 dark:text-gray-400 py-8">
              Nema habit-a za prikazati
            </p>
          ) : (
            habits.map(habit => {
              const completed = isCompleted(habit.id)

              return (
                <button
                  key={habit.id}
                  onClick={() => handleToggle(habit.id)}
                  className={`
                    w-full flex items-center gap-3 p-3 rounded-lg transition-all
                    ${completed
                      ? 'bg-gray-50 dark:bg-gray-700/50'
                      : 'bg-white dark:bg-gray-800 hover:bg-gray-50 dark:hover:bg-gray-700'
                    }
                    border border-gray-200 dark:border-gray-700
                  `}
                >
                  {/* Checkbox */}
                  <div
                    className={`
                      w-8 h-8 rounded-lg flex items-center justify-center transition-all
                      ${completed ? 'scale-105' : 'scale-100'}
                    `}
                    style={{ backgroundColor: completed ? habit.color : `${habit.color}20` }}
                  >
                    {completed ? (
                      <svg className="w-5 h-5 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={3} d="M5 13l4 4L19 7" />
                      </svg>
                    ) : (
                      <div className="w-3 h-3 rounded" style={{ backgroundColor: habit.color }} />
                    )}
                  </div>

                  {/* Habit info */}
                  <div className="flex-1 text-left">
                    <span
                      className={`
                        font-medium transition-all
                        ${completed
                          ? 'text-gray-400 dark:text-gray-500 line-through'
                          : 'text-gray-900 dark:text-white'
                        }
                      `}
                    >
                      {habit.title}
                    </span>
                  </div>

                  {/* Status indicator */}
                  {completed && (
                    <svg className="w-5 h-5 text-green-500" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
                    </svg>
                  )}
                </button>
              )
            })
          )}
        </div>

        {/* Footer */}
        <div className="mt-4 pt-4 border-t border-gray-200 dark:border-gray-700">
          <button
            onClick={onClose}
            className="w-full py-2 px-4 bg-gray-100 dark:bg-gray-700 text-gray-700 dark:text-gray-300 font-medium rounded-lg hover:bg-gray-200 dark:hover:bg-gray-600 transition-colors"
          >
            Zatvori
          </button>
        </div>
      </div>
    </div>
  )
}

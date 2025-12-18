import { Habit, HabitEntry } from '../../types'
import { getHabitStats } from '../../utils/stats'

interface HabitStatsListProps {
  habits: Habit[]
  entries: HabitEntry[]
}

export function HabitStatsList({ habits, entries }: HabitStatsListProps) {
  if (habits.length === 0) {
    return (
      <div className="bg-white dark:bg-gray-800 rounded-xl p-6 border border-gray-200 dark:border-gray-700 text-center">
        <p className="text-gray-500 dark:text-gray-400">Nema habit-a za prikaz</p>
      </div>
    )
  }

  return (
    <div className="bg-white dark:bg-gray-800 rounded-xl border border-gray-200 dark:border-gray-700 overflow-hidden">
      <div className="p-4 border-b border-gray-200 dark:border-gray-700">
        <h3 className="text-sm font-medium text-gray-700 dark:text-gray-300">
          Po habit-u
        </h3>
      </div>

      <div className="divide-y divide-gray-200 dark:divide-gray-700">
        {habits.map((habit) => {
          const stats = getHabitStats(habit, entries)

          return (
            <div key={habit.id} className="p-4">
              {/* Header row */}
              <div className="flex items-center justify-between mb-2">
                <div className="flex items-center gap-2">
                  <div
                    className="w-3 h-3 rounded-full"
                    style={{ backgroundColor: habit.color }}
                  />
                  <span className="font-medium text-gray-900 dark:text-white">
                    {habit.title}
                  </span>
                </div>
                <span className="text-lg font-bold text-gray-900 dark:text-white">
                  {stats.completionRate}%
                </span>
              </div>

              {/* Progress bar */}
              <div className="h-2 bg-gray-200 dark:bg-gray-700 rounded-full mb-3">
                <div
                  className="h-full rounded-full transition-all"
                  style={{
                    width: `${stats.completionRate}%`,
                    backgroundColor: habit.color
                  }}
                />
              </div>

              {/* Stats row */}
              <div className="flex items-center gap-4 text-xs text-gray-500 dark:text-gray-400">
                <div className="flex items-center gap-1">
                  <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17.657 18.657A8 8 0 016.343 7.343S7 9 9 10c0-2 .5-5 2.986-7C14 5 16.09 5.777 17.656 7.343A7.975 7.975 0 0120 13a7.975 7.975 0 01-2.343 5.657z" />
                  </svg>
                  <span>Streak: {stats.currentStreak}</span>
                </div>
                <div className="flex items-center gap-1">
                  <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 7h8m0 0v8m0-8l-8 8-4-4-6 6" />
                  </svg>
                  <span>Najbolji: {stats.bestStreak}</span>
                </div>
                <div className="flex items-center gap-1">
                  <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
                  </svg>
                  <span>{stats.totalCompleted} ukupno</span>
                </div>
              </div>
            </div>
          )
        })}
      </div>
    </div>
  )
}

import { HabitWithEntry } from '../../types'
import { HabitCard } from './HabitCard'

interface HabitListProps {
  habits: HabitWithEntry[]
  onToggle: (id: string) => void
  onEdit: (habit: HabitWithEntry) => void
  onDelete: (id: string) => void
}

export function HabitList({ habits, onToggle, onEdit, onDelete }: HabitListProps) {
  if (habits.length === 0) {
    return (
      <div className="text-center py-12">
        <div className="w-16 h-16 mx-auto mb-4 bg-gray-100 dark:bg-gray-800 rounded-full flex items-center justify-center">
          <svg className="w-8 h-8 text-gray-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2" />
          </svg>
        </div>
        <h3 className="text-lg font-medium text-gray-900 dark:text-white mb-1">
          No habits yet
        </h3>
        <p className="text-gray-500 dark:text-gray-400">
          Create your first habit to start tracking!
        </p>
      </div>
    )
  }

  return (
    <div className="space-y-3">
      {habits.map((habit) => (
        <HabitCard
          key={habit.id}
          habit={habit}
          onToggle={() => onToggle(habit.id)}
          onEdit={() => onEdit(habit)}
          onDelete={() => onDelete(habit.id)}
        />
      ))}
    </div>
  )
}

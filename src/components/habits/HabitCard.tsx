import { useState } from 'react'
import { HabitWithEntry } from '../../types'

interface HabitCardProps {
  habit: HabitWithEntry
  onToggle: () => void
  onEdit: () => void
  onDelete: () => void
}

export function HabitCard({ habit, onToggle, onEdit, onDelete }: HabitCardProps) {
  const [showMenu, setShowMenu] = useState(false)
  const isCompleted = habit.todayEntry?.completed || false

  return (
    <div
      className="bg-white dark:bg-gray-800 rounded-lg shadow-sm border border-gray-200 dark:border-gray-700 p-4 transition-all hover:shadow-md"
    >
      <div className="flex items-center gap-4">
        {/* Checkbox */}
        <button
          onClick={onToggle}
          className={`w-8 h-8 rounded-full border-2 flex items-center justify-center transition-all ${
            isCompleted
              ? 'border-transparent'
              : 'border-gray-300 dark:border-gray-600 hover:border-gray-400'
          }`}
          style={{ backgroundColor: isCompleted ? habit.color : 'transparent' }}
        >
          {isCompleted && (
            <svg className="w-5 h-5 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
            </svg>
          )}
        </button>

        {/* Habit Info */}
        <div className="flex-1 min-w-0">
          <h3 className={`font-medium truncate ${
            isCompleted
              ? 'text-gray-400 dark:text-gray-500 line-through'
              : 'text-gray-900 dark:text-white'
          }`}>
            {habit.title}
          </h3>
          {habit.description && (
            <p className="text-sm text-gray-500 dark:text-gray-400 truncate">
              {habit.description}
            </p>
          )}
        </div>

        {/* Color indicator */}
        <div
          className="w-3 h-3 rounded-full flex-shrink-0"
          style={{ backgroundColor: habit.color }}
        />

        {/* Menu */}
        <div className="relative">
          <button
            onClick={() => setShowMenu(!showMenu)}
            className="p-1 text-gray-400 hover:text-gray-600 dark:hover:text-gray-300 rounded"
          >
            <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 20 20">
              <path d="M10 6a2 2 0 110-4 2 2 0 010 4zM10 12a2 2 0 110-4 2 2 0 010 4zM10 18a2 2 0 110-4 2 2 0 010 4z" />
            </svg>
          </button>

          {showMenu && (
            <>
              <div
                className="fixed inset-0 z-10"
                onClick={() => setShowMenu(false)}
              />
              <div className="absolute right-0 mt-1 w-32 bg-white dark:bg-gray-700 rounded-lg shadow-lg border border-gray-200 dark:border-gray-600 py-1 z-20">
                <button
                  onClick={() => { onEdit(); setShowMenu(false); }}
                  className="w-full px-4 py-2 text-left text-sm text-gray-700 dark:text-gray-200 hover:bg-gray-100 dark:hover:bg-gray-600"
                >
                  Edit
                </button>
                <button
                  onClick={() => { onDelete(); setShowMenu(false); }}
                  className="w-full px-4 py-2 text-left text-sm text-red-600 dark:text-red-400 hover:bg-gray-100 dark:hover:bg-gray-600"
                >
                  Delete
                </button>
              </div>
            </>
          )}
        </div>
      </div>
    </div>
  )
}

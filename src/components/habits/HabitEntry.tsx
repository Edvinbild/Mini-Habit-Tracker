import { useState, useRef, useEffect } from 'react'
import { HabitWithEntry } from '../../types'

interface HabitEntryProps {
  habit: HabitWithEntry
  onToggle: () => void
  onNotesClick?: () => void
  onEdit?: () => void
  onDelete?: () => void
  streak?: number
}

export function HabitEntry({ habit, onToggle, onNotesClick, onEdit, onDelete, streak }: HabitEntryProps) {
  const isCompleted = habit.todayEntry?.completed || false
  const [showMenu, setShowMenu] = useState(false)
  const menuRef = useRef<HTMLDivElement>(null)

  // Close menu when clicking outside
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (menuRef.current && !menuRef.current.contains(event.target as Node)) {
        setShowMenu(false)
      }
    }

    if (showMenu) {
      document.addEventListener('mousedown', handleClickOutside)
    }

    return () => {
      document.removeEventListener('mousedown', handleClickOutside)
    }
  }, [showMenu])

  const handleEdit = (e: React.MouseEvent) => {
    e.stopPropagation()
    setShowMenu(false)
    onEdit?.()
  }

  const handleDelete = (e: React.MouseEvent) => {
    e.stopPropagation()
    setShowMenu(false)
    onDelete?.()
  }

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
        <div className="flex items-center gap-2">
          <h3
            className={`font-semibold transition-all ${
              isCompleted
                ? 'text-gray-400 dark:text-gray-500'
                : 'text-gray-900 dark:text-white'
            }`}
          >
            {habit.title}
          </h3>
          {/* Category Badge */}
          <span className="text-xs px-2 py-0.5 rounded-full bg-gray-100 dark:bg-gray-700 text-gray-500 dark:text-gray-400">
            {habit.category || 'Ostalo'}
          </span>
        </div>
        {habit.description && (
          <p className="text-sm text-gray-500 dark:text-gray-400 truncate">
            {habit.description}
          </p>
        )}
      </div>

      {/* Notes Icon */}
      {onNotesClick && (
        <button
          onClick={(e) => {
            e.stopPropagation()
            onNotesClick()
          }}
          className={`p-2 rounded-lg transition-colors ${
            habit.todayEntry?.note
              ? 'text-indigo-500 hover:bg-indigo-50 dark:hover:bg-indigo-900/30'
              : 'text-gray-400 hover:text-gray-600 dark:hover:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-700'
          }`}
          title={habit.todayEntry?.note ? 'Uredi bilješku' : 'Dodaj bilješku'}
        >
          {habit.todayEntry?.note ? (
            // Filled note icon
            <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 24 24">
              <path d="M14 2H6a2 2 0 00-2 2v16a2 2 0 002 2h12a2 2 0 002-2V8l-6-6zm-1 2l5 5h-5V4zM6 20V4h6v6h6v10H6z"/>
              <path d="M8 12h8v2H8zm0 4h8v2H8z"/>
            </svg>
          ) : (
            // Empty note icon
            <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z" />
            </svg>
          )}
        </button>
      )}

      {/* Streak Badge */}
      {streak !== undefined && streak > 0 && (
        <div className="flex items-center gap-1 px-2 py-1 bg-orange-100 dark:bg-orange-900/30 rounded-lg">
          <span className="text-orange-500">🔥</span>
          <span className="text-sm font-medium text-orange-600 dark:text-orange-400">
            {streak}
          </span>
        </div>
      )}

      {/* Three-dot Menu */}
      {(onEdit || onDelete) && (
        <div className="relative" ref={menuRef}>
          <button
            onClick={(e) => {
              e.stopPropagation()
              setShowMenu(!showMenu)
            }}
            className="p-2 rounded-lg text-gray-400 hover:text-gray-600 dark:hover:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-700 transition-colors"
            title="Opcije"
          >
            <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 20 20">
              <path d="M10 6a2 2 0 110-4 2 2 0 010 4zM10 12a2 2 0 110-4 2 2 0 010 4zM10 18a2 2 0 110-4 2 2 0 010 4z" />
            </svg>
          </button>

          {/* Dropdown Menu */}
          {showMenu && (
            <div className="absolute right-0 top-full mt-1 w-36 bg-white dark:bg-gray-800 rounded-lg shadow-lg border border-gray-200 dark:border-gray-700 py-1 z-10">
              {onEdit && (
                <button
                  onClick={handleEdit}
                  className="w-full flex items-center gap-2 px-3 py-2 text-sm text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-700 transition-colors"
                >
                  <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15.232 5.232l3.536 3.536m-2.036-5.036a2.5 2.5 0 113.536 3.536L6.5 21.036H3v-3.572L16.732 3.732z" />
                  </svg>
                  Uredi
                </button>
              )}
              {onDelete && (
                <button
                  onClick={handleDelete}
                  className="w-full flex items-center gap-2 px-3 py-2 text-sm text-red-600 dark:text-red-400 hover:bg-red-50 dark:hover:bg-red-900/20 transition-colors"
                >
                  <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
                  </svg>
                  Obriši
                </button>
              )}
            </div>
          )}
        </div>
      )}
    </button>
  )
}

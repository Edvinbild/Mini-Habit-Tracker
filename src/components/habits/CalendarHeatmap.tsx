import { useState } from 'react'
import { Habit, HabitEntry } from '../../types'
import {
  getDaysInMonth,
  getFirstDayOfMonth,
  getMonthNameHR,
  getDayNamesHR,
  dateToString,
  isToday,
  isFutureDate,
  getPreviousMonth,
  getNextMonth
} from '../../utils/calendar'

interface CalendarHeatmapProps {
  entries: HabitEntry[]
  habits: Habit[]
  onDayClick: (date: string) => void
}

export function CalendarHeatmap({ entries, habits, onDayClick }: CalendarHeatmapProps) {
  const today = new Date()
  const [currentYear, setCurrentYear] = useState(today.getFullYear())
  const [currentMonth, setCurrentMonth] = useState(today.getMonth())

  const days = getDaysInMonth(currentYear, currentMonth)
  const firstDayOffset = getFirstDayOfMonth(currentYear, currentMonth)
  const dayNames = getDayNamesHR()

  // Calculate completion percentage for a given date
  const getCompletionPercentage = (dateStr: string): number => {
    if (habits.length === 0) return 0

    const dayEntries = entries.filter(e => e.date === dateStr)
    const completedCount = dayEntries.filter(e => e.completed).length

    return Math.round((completedCount / habits.length) * 100)
  }

  // Check if any entry on this date has a note
  const hasNoteOnDate = (dateStr: string): boolean => {
    return entries.some(e => e.date === dateStr && e.note && e.note.trim().length > 0)
  }

  // Get background color class based on completion percentage
  const getColorClass = (dateStr: string): string => {
    if (isFutureDate(dateStr)) {
      return 'bg-gray-50 dark:bg-gray-900 cursor-not-allowed'
    }

    const percentage = getCompletionPercentage(dateStr)

    if (percentage === 0) {
      return 'bg-gray-100 dark:bg-gray-800 hover:ring-2 hover:ring-indigo-400 cursor-pointer'
    } else if (percentage <= 33) {
      return 'bg-green-200 dark:bg-green-900 hover:ring-2 hover:ring-indigo-400 cursor-pointer'
    } else if (percentage <= 66) {
      return 'bg-green-400 dark:bg-green-700 hover:ring-2 hover:ring-indigo-400 cursor-pointer'
    } else if (percentage < 100) {
      return 'bg-green-500 dark:bg-green-600 hover:ring-2 hover:ring-indigo-400 cursor-pointer'
    } else {
      return 'bg-green-600 dark:bg-green-500 hover:ring-2 hover:ring-indigo-400 cursor-pointer'
    }
  }

  const handlePreviousMonth = () => {
    const prev = getPreviousMonth(currentYear, currentMonth)
    setCurrentYear(prev.year)
    setCurrentMonth(prev.month)
  }

  const handleNextMonth = () => {
    const next = getNextMonth(currentYear, currentMonth)
    // Don't allow navigating past current month
    const now = new Date()
    if (next.year > now.getFullYear() || (next.year === now.getFullYear() && next.month > now.getMonth())) {
      return
    }
    setCurrentYear(next.year)
    setCurrentMonth(next.month)
  }

  const handleDayClick = (dateStr: string) => {
    if (!isFutureDate(dateStr)) {
      onDayClick(dateStr)
    }
  }

  const isCurrentMonth = currentYear === today.getFullYear() && currentMonth === today.getMonth()

  return (
    <div className="bg-white dark:bg-gray-800 rounded-xl p-4 border border-gray-200 dark:border-gray-700">
      {/* Header with navigation */}
      <div className="flex items-center justify-between mb-4">
        <button
          onClick={handlePreviousMonth}
          className="p-2 hover:bg-gray-100 dark:hover:bg-gray-700 rounded-lg transition-colors"
        >
          <svg className="w-5 h-5 text-gray-600 dark:text-gray-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
          </svg>
        </button>

        <h3 className="text-lg font-semibold text-gray-900 dark:text-white">
          {getMonthNameHR(currentMonth)} {currentYear}
        </h3>

        <button
          onClick={handleNextMonth}
          disabled={isCurrentMonth}
          className={`p-2 rounded-lg transition-colors ${
            isCurrentMonth
              ? 'text-gray-300 dark:text-gray-600 cursor-not-allowed'
              : 'hover:bg-gray-100 dark:hover:bg-gray-700 text-gray-600 dark:text-gray-400'
          }`}
        >
          <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
          </svg>
        </button>
      </div>

      {/* Day names header */}
      <div className="grid grid-cols-7 gap-1 mb-2">
        {dayNames.map(day => (
          <div
            key={day}
            className="text-center text-xs font-medium text-gray-500 dark:text-gray-400 py-1"
          >
            {day}
          </div>
        ))}
      </div>

      {/* Calendar grid */}
      <div className="grid grid-cols-7 gap-1">
        {/* Empty cells for offset */}
        {Array.from({ length: firstDayOffset }).map((_, i) => (
          <div key={`empty-${i}`} className="aspect-square" />
        ))}

        {/* Day cells */}
        {days.map(date => {
          const dateStr = dateToString(date)
          const isTodayDate = isToday(dateStr)
          const isFuture = isFutureDate(dateStr)
          const percentage = getCompletionPercentage(dateStr)

          const hasNote = hasNoteOnDate(dateStr)

          return (
            <button
              key={dateStr}
              onClick={() => handleDayClick(dateStr)}
              disabled={isFuture}
              className={`
                aspect-square rounded-md flex items-center justify-center text-xs font-medium
                transition-all duration-150 relative
                ${getColorClass(dateStr)}
                ${isTodayDate ? 'ring-2 ring-indigo-500' : ''}
                ${percentage > 50 ? 'text-white' : 'text-gray-700 dark:text-gray-300'}
                ${isFuture ? 'text-gray-300 dark:text-gray-600' : ''}
              `}
              title={`${dateStr}: ${percentage}% completed${hasNote ? ' • ima bilješku' : ''}`}
            >
              {date.getDate()}
              {/* Note indicator */}
              {hasNote && (
                <svg
                  className="absolute top-0.5 right-0.5 w-2.5 h-2.5 text-amber-500"
                  fill="currentColor"
                  viewBox="0 0 20 20"
                >
                  <path d="M13.586 3.586a2 2 0 112.828 2.828l-.793.793-2.828-2.828.793-.793zM11.379 5.793L3 14.172V17h2.828l8.38-8.379-2.83-2.828z" />
                </svg>
              )}
            </button>
          )
        })}
      </div>

      {/* Legend */}
      <div className="flex items-center justify-center gap-2 mt-4 text-xs text-gray-500 dark:text-gray-400">
        <span>Manje</span>
        <div className="flex gap-1">
          <div className="w-3 h-3 rounded-sm bg-gray-100 dark:bg-gray-800" />
          <div className="w-3 h-3 rounded-sm bg-green-200 dark:bg-green-900" />
          <div className="w-3 h-3 rounded-sm bg-green-400 dark:bg-green-700" />
          <div className="w-3 h-3 rounded-sm bg-green-500 dark:bg-green-600" />
          <div className="w-3 h-3 rounded-sm bg-green-600 dark:bg-green-500" />
        </div>
        <span>Više</span>
      </div>
    </div>
  )
}

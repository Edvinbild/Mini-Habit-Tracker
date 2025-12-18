import { Habit, HabitEntry } from '../types'

/**
 * Calculate overall completion rate across all habits and days
 */
export function calculateOverallCompletionRate(habits: Habit[], entries: HabitEntry[]): number {
  if (habits.length === 0) return 0

  const completedEntries = entries.filter(e => e.completed).length
  const uniqueDates = [...new Set(entries.map(e => e.date))]
  const totalPossible = habits.length * uniqueDates.length

  if (totalPossible === 0) return 0
  return Math.round((completedEntries / totalPossible) * 100)
}

/**
 * Find the best streak ever among all habits
 */
export function findBestStreakEver(habits: Habit[], entries: HabitEntry[]): { streak: number; habitId: string | null; habitTitle: string } {
  let bestStreak = 0
  let bestHabitId: string | null = null
  let bestHabitTitle = ''

  for (const habit of habits) {
    const habitEntries = entries
      .filter(e => e.habit_id === habit.id && e.completed)
      .map(e => e.date)
      .sort((a, b) => new Date(b).getTime() - new Date(a).getTime())

    let currentStreak = 0
    let maxStreak = 0

    for (let i = 0; i < habitEntries.length; i++) {
      if (i === 0) {
        currentStreak = 1
      } else {
        const prevDate = new Date(habitEntries[i - 1])
        const currDate = new Date(habitEntries[i])
        const diffDays = Math.round((prevDate.getTime() - currDate.getTime()) / (1000 * 60 * 60 * 24))

        if (diffDays === 1) {
          currentStreak++
        } else {
          currentStreak = 1
        }
      }
      maxStreak = Math.max(maxStreak, currentStreak)
    }

    if (maxStreak > bestStreak) {
      bestStreak = maxStreak
      bestHabitId = habit.id
      bestHabitTitle = habit.title
    }
  }

  return { streak: bestStreak, habitId: bestHabitId, habitTitle: bestHabitTitle }
}

/**
 * Calculate average completions per week
 */
export function calculateWeeklyAverage(habits: Habit[], entries: HabitEntry[]): number {
  if (habits.length === 0 || entries.length === 0) return 0

  const completedEntries = entries.filter(e => e.completed)
  if (completedEntries.length === 0) return 0

  const dates = completedEntries.map(e => new Date(e.date).getTime())
  const minDate = Math.min(...dates)
  const maxDate = Math.max(...dates)
  const weeks = Math.max(1, Math.ceil((maxDate - minDate) / (1000 * 60 * 60 * 24 * 7)))

  return Math.round((completedEntries.length / weeks) * 10) / 10
}

/**
 * Count unique days with at least one completion
 */
export function countActiveDays(entries: HabitEntry[]): number {
  const completedDates = entries.filter(e => e.completed).map(e => e.date)
  return new Set(completedDates).size
}

/**
 * Get completion stats for the last 7 days
 */
export function getLast7DaysStats(habits: Habit[], entries: HabitEntry[]): { date: string; dayName: string; percentage: number }[] {
  const result: { date: string; dayName: string; percentage: number }[] = []
  const dayNames = ['Ned', 'Pon', 'Uto', 'Sri', 'Čet', 'Pet', 'Sub']

  for (let i = 6; i >= 0; i--) {
    const date = new Date()
    date.setDate(date.getDate() - i)
    const dateStr = date.toISOString().split('T')[0]
    const dayName = dayNames[date.getDay()]

    const dayEntries = entries.filter(e => e.date === dateStr)
    const completed = dayEntries.filter(e => e.completed).length
    const percentage = habits.length > 0 ? Math.round((completed / habits.length) * 100) : 0

    result.push({ date: dateStr, dayName, percentage })
  }

  return result
}

/**
 * Get detailed stats for a single habit
 */
export function getHabitStats(habit: Habit, entries: HabitEntry[]): {
  completionRate: number
  currentStreak: number
  bestStreak: number
  totalCompleted: number
  totalDays: number
} {
  const habitEntries = entries.filter(e => e.habit_id === habit.id)
  const completedEntries = habitEntries.filter(e => e.completed)
  const totalCompleted = completedEntries.length

  // Count unique dates for this habit
  const uniqueDates = new Set(habitEntries.map(e => e.date))
  const totalDays = uniqueDates.size

  const completionRate = totalDays > 0 ? Math.round((totalCompleted / totalDays) * 100) : 0

  // Calculate current streak
  const sortedDates = completedEntries
    .map(e => e.date)
    .sort((a, b) => new Date(b).getTime() - new Date(a).getTime())

  let currentStreak = 0
  const today = new Date()
  today.setHours(0, 0, 0, 0)

  for (let i = 0; i < sortedDates.length; i++) {
    const expectedDate = new Date(today)
    expectedDate.setDate(expectedDate.getDate() - currentStreak)
    const entryDate = new Date(sortedDates[i])
    entryDate.setHours(0, 0, 0, 0)

    if (entryDate.getTime() === expectedDate.getTime()) {
      currentStreak++
    } else if (currentStreak === 0) {
      // Check if it was yesterday (today not yet completed)
      expectedDate.setDate(expectedDate.getDate() - 1)
      if (entryDate.getTime() === expectedDate.getTime()) {
        currentStreak++
      } else {
        break
      }
    } else {
      break
    }
  }

  // Calculate best streak
  let bestStreak = 0
  let tempStreak = 0

  for (let i = 0; i < sortedDates.length; i++) {
    if (i === 0) {
      tempStreak = 1
    } else {
      const prevDate = new Date(sortedDates[i - 1])
      const currDate = new Date(sortedDates[i])
      const diffDays = Math.round((prevDate.getTime() - currDate.getTime()) / (1000 * 60 * 60 * 24))

      if (diffDays === 1) {
        tempStreak++
      } else {
        tempStreak = 1
      }
    }
    bestStreak = Math.max(bestStreak, tempStreak)
  }

  return {
    completionRate,
    currentStreak,
    bestStreak,
    totalCompleted,
    totalDays
  }
}

/**
 * Get the first date a habit was tracked
 */
export function getFirstTrackingDate(entries: HabitEntry[]): string | null {
  if (entries.length === 0) return null
  const dates = entries.map(e => e.date).sort()
  return dates[0]
}

// Calendar utility functions

/**
 * Get all days in a month as Date objects
 */
export function getDaysInMonth(year: number, month: number): Date[] {
  const days: Date[] = []
  const date = new Date(year, month, 1)

  while (date.getMonth() === month) {
    days.push(new Date(date))
    date.setDate(date.getDate() + 1)
  }

  return days
}

/**
 * Get the day of week for the first day of month (0 = Sunday, 1 = Monday, etc.)
 * Adjusted for Monday-first week (returns 0 = Monday, 6 = Sunday)
 */
export function getFirstDayOfMonth(year: number, month: number): number {
  const day = new Date(year, month, 1).getDay()
  // Convert Sunday (0) to 6, Monday (1) to 0, etc.
  return day === 0 ? 6 : day - 1
}

/**
 * Format date string (YYYY-MM-DD) to Croatian locale
 */
export function formatDateHR(dateStr: string): string {
  const date = new Date(dateStr)
  return date.toLocaleDateString('hr-HR', {
    weekday: 'long',
    day: 'numeric',
    month: 'long',
    year: 'numeric'
  })
}

/**
 * Format date for short display (e.g., "18. pro")
 */
export function formatDateShort(dateStr: string): string {
  const date = new Date(dateStr)
  return date.toLocaleDateString('hr-HR', {
    day: 'numeric',
    month: 'short'
  })
}

/**
 * Get month name in Croatian
 */
export function getMonthNameHR(month: number): string {
  const months = [
    'Siječanj', 'Veljača', 'Ožujak', 'Travanj',
    'Svibanj', 'Lipanj', 'Srpanj', 'Kolovoz',
    'Rujan', 'Listopad', 'Studeni', 'Prosinac'
  ]
  return months[month]
}

/**
 * Get short day names in Croatian (starting from Monday)
 */
export function getDayNamesHR(): string[] {
  return ['Pon', 'Uto', 'Sri', 'Čet', 'Pet', 'Sub', 'Ned']
}

/**
 * Convert Date to YYYY-MM-DD string
 */
export function dateToString(date: Date): string {
  const year = date.getFullYear()
  const month = String(date.getMonth() + 1).padStart(2, '0')
  const day = String(date.getDate()).padStart(2, '0')
  return `${year}-${month}-${day}`
}

/**
 * Check if a date string is today
 */
export function isToday(dateStr: string): boolean {
  const today = new Date()
  return dateStr === dateToString(today)
}

/**
 * Check if a date string is in the future
 */
export function isFutureDate(dateStr: string): boolean {
  const today = new Date()
  today.setHours(0, 0, 0, 0)
  const date = new Date(dateStr)
  date.setHours(0, 0, 0, 0)
  return date > today
}

/**
 * Get previous month
 */
export function getPreviousMonth(year: number, month: number): { year: number; month: number } {
  if (month === 0) {
    return { year: year - 1, month: 11 }
  }
  return { year, month: month - 1 }
}

/**
 * Get next month
 */
export function getNextMonth(year: number, month: number): { year: number; month: number } {
  if (month === 11) {
    return { year: year + 1, month: 0 }
  }
  return { year, month: month + 1 }
}

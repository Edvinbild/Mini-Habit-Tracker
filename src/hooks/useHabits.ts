import { useState, useEffect, useCallback } from 'react'
import { supabase } from '../lib/supabase'
import { useAuth } from '../context/AuthContext'
import { Habit, HabitEntry, HabitWithEntry } from '../types'

// Helper funkcija za izračun streak-a
function calculateStreak(habitId: string, entries: HabitEntry[]): number {
  const habitEntries = entries
    .filter(e => e.habit_id === habitId && e.completed)
    .map(e => e.date)
    .sort((a, b) => new Date(b).getTime() - new Date(a).getTime())

  if (habitEntries.length === 0) return 0

  let streak = 0
  const today = new Date()
  today.setHours(0, 0, 0, 0)

  for (let i = 0; i < habitEntries.length; i++) {
    const expectedDate = new Date(today)
    expectedDate.setDate(expectedDate.getDate() - streak)
    const entryDate = new Date(habitEntries[i])
    entryDate.setHours(0, 0, 0, 0)

    if (entryDate.getTime() === expectedDate.getTime()) {
      streak++
    } else if (streak === 0) {
      // Provjeri je li jučer ako danas nije označen
      expectedDate.setDate(expectedDate.getDate() - 1)
      if (entryDate.getTime() === expectedDate.getTime()) {
        streak++
      } else {
        break
      }
    } else {
      break
    }
  }

  return streak
}

export function useHabits() {
  const { user } = useAuth()
  const [habits, setHabits] = useState<HabitWithEntry[]>([])
  const [allEntries, setAllEntries] = useState<HabitEntry[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  const today = new Date().toISOString().split('T')[0]

  // Fetch all habits with today's entries
  const fetchHabits = useCallback(async () => {
    if (!user) return

    try {
      setLoading(true)
      setError(null)

      // Fetch habits
      const { data: habitsData, error: habitsError } = await supabase
        .from('habits')
        .select('*')
        .eq('user_id', user.id)
        .order('created_at', { ascending: true })

      if (habitsError) throw habitsError

      // Fetch all entries for streak calculation (last 365 days)
      const yearAgo = new Date()
      yearAgo.setFullYear(yearAgo.getFullYear() - 1)
      const yearAgoStr = yearAgo.toISOString().split('T')[0]

      const { data: entriesData, error: entriesError } = await supabase
        .from('habit_entries')
        .select('*')
        .in('habit_id', habitsData?.map(h => h.id) || [])
        .gte('date', yearAgoStr)
        .order('date', { ascending: false })

      if (entriesError) throw entriesError

      // Store all entries for calendar
      setAllEntries(entriesData || [])

      // Combine habits with entries and calculate streak
      const habitsWithEntries: HabitWithEntry[] = (habitsData || []).map(habit => ({
        ...habit,
        todayEntry: entriesData?.find(e => e.habit_id === habit.id && e.date === today),
        streak: calculateStreak(habit.id, entriesData || [])
      }))

      setHabits(habitsWithEntries)
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to fetch habits')
    } finally {
      setLoading(false)
    }
  }, [user, today])

  // Create a new habit
  const createHabit = async (title: string, description?: string, color?: string, category?: string) => {
    if (!user) return { error: new Error('Not authenticated') }

    try {
      const { data, error } = await supabase
        .from('habits')
        .insert({
          user_id: user.id,
          title,
          description: description || null,
          color: color || '#6366f1',
          category: category || 'Ostalo'
        })
        .select()
        .single()

      if (error) throw error

      setHabits(prev => [...prev, { ...data, todayEntry: undefined }])
      return { data, error: null }
    } catch (err) {
      return { data: null, error: err as Error }
    }
  }

  // Get unique categories from habits
  const getCategories = (): string[] => {
    const categories = habits.map(h => h.category || 'Ostalo')
    return [...new Set(categories)].sort()
  }

  // Update a habit
  const updateHabit = async (id: string, updates: Partial<Habit>) => {
    try {
      const { data, error } = await supabase
        .from('habits')
        .update({ ...updates, updated_at: new Date().toISOString() })
        .eq('id', id)
        .select()
        .single()

      if (error) throw error

      setHabits(prev => prev.map(h => h.id === id ? { ...h, ...data } : h))
      return { data, error: null }
    } catch (err) {
      return { data: null, error: err as Error }
    }
  }

  // Delete a habit
  const deleteHabit = async (id: string) => {
    try {
      const { error } = await supabase
        .from('habits')
        .delete()
        .eq('id', id)

      if (error) throw error

      setHabits(prev => prev.filter(h => h.id !== id))
      return { error: null }
    } catch (err) {
      return { error: err as Error }
    }
  }

  // Toggle today's entry for a habit
  const toggleEntry = async (habitId: string) => {
    const habit = habits.find(h => h.id === habitId)
    if (!habit) return { error: new Error('Habit not found') }

    try {
      if (habit.todayEntry) {
        // Update existing entry
        const newCompleted = !habit.todayEntry.completed
        const { data, error } = await supabase
          .from('habit_entries')
          .update({ completed: newCompleted })
          .eq('id', habit.todayEntry.id)
          .select()
          .single()

        if (error) throw error

        setHabits(prev => prev.map(h => 
          h.id === habitId ? { ...h, todayEntry: data } : h
        ))
      } else {
        // Create new entry
        const { data, error } = await supabase
          .from('habit_entries')
          .insert({
            habit_id: habitId,
            date: today,
            completed: true
          })
          .select()
          .single()

        if (error) throw error

        setHabits(prev => prev.map(h => 
          h.id === habitId ? { ...h, todayEntry: data } : h
        ))
      }

      return { error: null }
    } catch (err) {
      return { error: err as Error }
    }
  }

  // Toggle entry for any date (for calendar)
  const toggleEntryForDate = async (habitId: string, date: string, completed: boolean) => {
    try {
      // Check if entry exists for this date
      const existingEntry = allEntries.find(e => e.habit_id === habitId && e.date === date)

      if (existingEntry) {
        // Update existing entry
        const { data, error } = await supabase
          .from('habit_entries')
          .update({ completed })
          .eq('id', existingEntry.id)
          .select()
          .single()

        if (error) throw error

        // Update allEntries state
        setAllEntries(prev => prev.map(e =>
          e.id === existingEntry.id ? data : e
        ))

        // If it's today, also update habits state
        if (date === today) {
          setHabits(prev => prev.map(h =>
            h.id === habitId ? { ...h, todayEntry: data } : h
          ))
        }
      } else {
        // Create new entry
        const { data, error } = await supabase
          .from('habit_entries')
          .insert({
            habit_id: habitId,
            date,
            completed
          })
          .select()
          .single()

        if (error) throw error

        // Add to allEntries state
        setAllEntries(prev => [...prev, data])

        // If it's today, also update habits state
        if (date === today) {
          setHabits(prev => prev.map(h =>
            h.id === habitId ? { ...h, todayEntry: data } : h
          ))
        }
      }

      // Recalculate streaks after entry change
      setHabits(prev => prev.map(habit => ({
        ...habit,
        streak: calculateStreak(habit.id, allEntries)
      })))

      return { error: null }
    } catch (err) {
      return { error: err as Error }
    }
  }

  // Calculate streak for a habit
  const getStreak = async (habitId: string): Promise<number> => {
    try {
      const { data, error } = await supabase
        .from('habit_entries')
        .select('date, completed')
        .eq('habit_id', habitId)
        .eq('completed', true)
        .order('date', { ascending: false })
        .limit(365)

      if (error) throw error

      let streak = 0
      const checkDate = new Date()
      
      for (const entry of data || []) {
        const entryDate = new Date(entry.date)
        const expectedDate = new Date(checkDate)
        expectedDate.setDate(expectedDate.getDate() - streak)
        expectedDate.setHours(0, 0, 0, 0)
        entryDate.setHours(0, 0, 0, 0)

        if (entryDate.getTime() === expectedDate.getTime()) {
          streak++
        } else if (streak === 0 && entryDate < expectedDate) {
          // Allow for today not being completed yet
          checkDate.setDate(checkDate.getDate() - 1)
          if (entryDate.getTime() === checkDate.getTime()) {
            streak++
            checkDate.setDate(checkDate.getDate() + 1)
          } else {
            break
          }
        } else {
          break
        }
      }

      return streak
    } catch {
      return 0
    }
  }

  // Get completion stats
  const getStats = () => {
    const total = habits.length
    const completed = habits.filter(h => h.todayEntry?.completed).length
    const percentage = total > 0 ? Math.round((completed / total) * 100) : 0
    return { total, completed, percentage }
  }

  useEffect(() => {
    fetchHabits()
  }, [fetchHabits])

  return {
    habits,
    allEntries,
    loading,
    error,
    fetchHabits,
    createHabit,
    updateHabit,
    deleteHabit,
    toggleEntry,
    toggleEntryForDate,
    getStreak,
    getStats,
    getCategories
  }
}

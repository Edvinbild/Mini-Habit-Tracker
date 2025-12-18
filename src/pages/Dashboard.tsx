import { useState } from 'react'
import { useAuth } from '../context/AuthContext'
import { useHabits } from '../hooks/useHabits'
import { HabitEntry } from '../components/habits/HabitEntry'
import { HabitForm } from '../components/habits/HabitForm'
import { CalendarHeatmap } from '../components/habits/CalendarHeatmap'
import { DayModal } from '../components/habits/DayModal'
import { ThemeToggle } from '../components/layout/ThemeToggle'
import { HabitWithEntry } from '../types'

export function Dashboard() {
  const { user, signOut } = useAuth()
  const { habits, allEntries, loading, createHabit, updateHabit, deleteHabit, toggleEntry, toggleEntryForDate, getStats } = useHabits()

  const [showForm, setShowForm] = useState(false)
  const [editingHabit, setEditingHabit] = useState<HabitWithEntry | null>(null)
  const [showDeleteConfirm, setShowDeleteConfirm] = useState<string | null>(null)
  const [selectedDate, setSelectedDate] = useState<string | null>(null)
  const [showCalendar, setShowCalendar] = useState(false)

  const today = new Date().toLocaleDateString('hr-HR', {
    weekday: 'long',
    year: 'numeric',
    month: 'long',
    day: 'numeric'
  })

  const stats = getStats()

  const handleCreateHabit = async (title: string, description?: string, color?: string) => {
    await createHabit(title, description, color)
    setShowForm(false)
  }

  const handleUpdateHabit = async (title: string, description?: string, color?: string) => {
    if (!editingHabit) return
    await updateHabit(editingHabit.id, { title, description: description || null, color })
    setEditingHabit(null)
  }

  const handleDeleteHabit = async (id: string) => {
    await deleteHabit(id)
    setShowDeleteConfirm(null)
  }

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-900">
      <header className="bg-white dark:bg-gray-800 shadow">
        <div className="max-w-2xl mx-auto px-4 py-4 flex justify-between items-center">
          <h1 className="text-xl font-bold text-gray-900 dark:text-white">Mini Habit Tracker</h1>
          <div className="flex items-center gap-2">
            <ThemeToggle />
            <button onClick={signOut} className="text-sm text-gray-600 dark:text-gray-400 hover:text-gray-900 dark:hover:text-white">Sign Out</button>
          </div>
        </div>
      </header>

      <main className="max-w-2xl mx-auto px-4 py-6">
        <div className="mb-6">
          <button
            onClick={() => setShowCalendar(!showCalendar)}
            className="flex items-center gap-2 text-gray-600 dark:text-gray-400 hover:text-indigo-600 dark:hover:text-indigo-400 transition-colors"
          >
            <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
            </svg>
            <span className="capitalize">{today}</span>
            <svg className={`w-4 h-4 transition-transform ${showCalendar ? 'rotate-180' : ''}`} fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
            </svg>
          </button>
          {habits.length > 0 && (
            <div className="mt-2 flex items-center gap-2">
              <div className="bg-gray-200 dark:bg-gray-700 rounded-full h-2 w-32">
                <div className="bg-indigo-600 h-2 rounded-full transition-all" style={{ width: `${stats.percentage}%` }} />
              </div>
              <span className="text-sm font-medium text-gray-600 dark:text-gray-400">{stats.completed}/{stats.total}</span>
            </div>
          )}

          {/* Calendar Heatmap - appears below date when toggled */}
          {showCalendar && habits.length > 0 && !loading && (
            <div className="mt-4">
              <CalendarHeatmap
                entries={allEntries}
                habits={habits}
                onDayClick={(date) => setSelectedDate(date)}
              />
            </div>
          )}
        </div>

        {!showForm && !editingHabit && (
          <button onClick={() => setShowForm(true)} className="w-full mb-6 py-3 border-2 border-dashed border-gray-300 dark:border-gray-600 rounded-xl text-gray-500 dark:text-gray-400 hover:border-indigo-500 hover:text-indigo-500 transition-colors flex items-center justify-center gap-2">
            <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" /></svg>
            Add New Habit
          </button>
        )}

        {showForm && (
          <div className="mb-6 bg-white dark:bg-gray-800 rounded-xl shadow-sm border border-gray-200 dark:border-gray-700 p-4">
            <h2 className="text-lg font-semibold text-gray-900 dark:text-white mb-4">Create New Habit</h2>
            <HabitForm onSubmit={handleCreateHabit} onCancel={() => setShowForm(false)} />
          </div>
        )}

        {editingHabit && (
          <div className="mb-6 bg-white dark:bg-gray-800 rounded-xl shadow-sm border border-gray-200 dark:border-gray-700 p-4">
            <h2 className="text-lg font-semibold text-gray-900 dark:text-white mb-4">Edit Habit</h2>
            <HabitForm habit={editingHabit} onSubmit={handleUpdateHabit} onCancel={() => setEditingHabit(null)} />
          </div>
        )}

        {loading ? (
          <div className="flex justify-center py-12"><div className="animate-spin rounded-full h-8 w-8 border-b-2 border-indigo-600" /></div>
        ) : habits.length === 0 ? (
          <div className="text-center py-12">
            <div className="w-16 h-16 mx-auto mb-4 bg-gray-100 dark:bg-gray-800 rounded-full flex items-center justify-center">
              <svg className="w-8 h-8 text-gray-400" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2" /></svg>
            </div>
            <h3 className="text-lg font-medium text-gray-900 dark:text-white mb-1">No habits yet</h3>
            <p className="text-gray-500 dark:text-gray-400">Create your first habit to start tracking!</p>
          </div>
        ) : (
          <div className="space-y-3">
            {habits.map((habit) => (
              <div key={habit.id} className="relative group">
                <HabitEntry habit={habit} onToggle={() => toggleEntry(habit.id)} streak={habit.streak} />
                <div className="absolute right-2 top-1/2 -translate-y-1/2 opacity-0 group-hover:opacity-100 transition-opacity flex gap-1">
                  <button onClick={() => setEditingHabit(habit)} className="p-2 text-gray-400 hover:text-gray-600 dark:hover:text-gray-300 bg-white dark:bg-gray-800 rounded-lg shadow-sm">
                    <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15.232 5.232l3.536 3.536m-2.036-5.036a2.5 2.5 0 113.536 3.536L6.5 21.036H3v-3.572L16.732 3.732z" /></svg>
                  </button>
                  <button onClick={() => setShowDeleteConfirm(habit.id)} className="p-2 text-gray-400 hover:text-red-500 bg-white dark:bg-gray-800 rounded-lg shadow-sm">
                    <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" /></svg>
                  </button>
                </div>
              </div>
            ))}
          </div>
        )}

        {/* Day Modal */}
        {selectedDate && (
          <DayModal
            date={selectedDate}
            habits={habits}
            entries={allEntries}
            onToggle={toggleEntryForDate}
            onClose={() => setSelectedDate(null)}
          />
        )}

        {showDeleteConfirm && (
          <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
            <div className="bg-white dark:bg-gray-800 rounded-xl p-6 max-w-sm w-full shadow-xl">
              <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-2">Delete Habit?</h3>
              <p className="text-gray-600 dark:text-gray-400 mb-6">This action cannot be undone.</p>
              <div className="flex gap-3">
                <button onClick={() => handleDeleteHabit(showDeleteConfirm)} className="flex-1 bg-red-600 hover:bg-red-700 text-white font-medium py-2 px-4 rounded-lg">Delete</button>
                <button onClick={() => setShowDeleteConfirm(null)} className="flex-1 bg-gray-100 dark:bg-gray-700 text-gray-700 dark:text-gray-300 font-medium py-2 px-4 rounded-lg">Cancel</button>
              </div>
            </div>
          </div>
        )}

        <p className="text-center text-xs text-gray-400 dark:text-gray-600 mt-8">{user?.email}</p>
      </main>
    </div>
  )
}

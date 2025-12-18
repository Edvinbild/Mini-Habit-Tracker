import { useState } from 'react'
import { HabitWithEntry } from '../../types'
import { formatDateHR } from '../../utils/calendar'

interface EntryNotesModalProps {
  habit: HabitWithEntry
  date: string
  currentNote: string | null
  onSave: (note: string | null) => Promise<void>
  onClose: () => void
}

const MAX_NOTE_LENGTH = 500

export function EntryNotesModal({ habit, date, currentNote, onSave, onClose }: EntryNotesModalProps) {
  const [note, setNote] = useState(currentNote || '')
  const [loading, setLoading] = useState(false)
  // Start in edit mode if there's no note, otherwise view mode
  const [isEditing, setIsEditing] = useState(!currentNote)

  const handleSave = async () => {
    setLoading(true)
    try {
      await onSave(note.trim() || null)
      onClose()
    } finally {
      setLoading(false)
    }
  }

  const handleCancel = () => {
    if (currentNote) {
      // If there was an existing note, go back to view mode and reset
      setNote(currentNote)
      setIsEditing(false)
    } else {
      // If creating new note, close modal
      onClose()
    }
  }

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === 'Escape') {
      if (isEditing && currentNote) {
        handleCancel()
      } else {
        onClose()
      }
    }
  }

  return (
    <div
      className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4"
      onKeyDown={handleKeyDown}
    >
      <div className="bg-white dark:bg-gray-800 rounded-xl p-6 max-w-md w-full shadow-xl">
        {/* Header */}
        <div className="flex items-center justify-between mb-4">
          <div className="flex items-center gap-3">
            <div
              className="w-10 h-10 rounded-lg flex items-center justify-center"
              style={{ backgroundColor: habit.color }}
            >
              <svg className="w-5 h-5 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z" />
              </svg>
            </div>
            <div>
              <h3 className="text-lg font-semibold text-gray-900 dark:text-white">
                {habit.title}
              </h3>
              <p className="text-sm text-gray-500 dark:text-gray-400 capitalize">
                {formatDateHR(date)}
              </p>
            </div>
          </div>
          <div className="flex items-center gap-1">
            {/* Edit button - show only in view mode when there's a note */}
            {!isEditing && currentNote && (
              <button
                onClick={() => setIsEditing(true)}
                className="p-2 hover:bg-gray-100 dark:hover:bg-gray-700 rounded-lg transition-colors"
                title="Uredi bilješku"
              >
                <svg className="w-5 h-5 text-gray-500 dark:text-gray-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15.232 5.232l3.536 3.536m-2.036-5.036a2.5 2.5 0 113.536 3.536L6.5 21.036H3v-3.572L16.732 3.732z" />
                </svg>
              </button>
            )}
            <button
              onClick={onClose}
              className="p-2 hover:bg-gray-100 dark:hover:bg-gray-700 rounded-lg transition-colors"
            >
              <svg className="w-5 h-5 text-gray-500 dark:text-gray-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
              </svg>
            </button>
          </div>
        </div>

        {/* Textarea / View area */}
        <div className="mb-4">
          {isEditing ? (
            <>
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                Bilješka
              </label>
              <textarea
                value={note}
                onChange={(e) => setNote(e.target.value.slice(0, MAX_NOTE_LENGTH))}
                placeholder="Dodaj bilješku o ovom unosu..."
                rows={4}
                autoFocus
                className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 text-gray-900 dark:text-white placeholder-gray-400 dark:placeholder-gray-500 focus:ring-2 focus:ring-indigo-500 focus:border-transparent resize-none"
              />
              <div className="mt-1 text-xs text-gray-400 dark:text-gray-500 text-right">
                {note.length}/{MAX_NOTE_LENGTH}
              </div>
            </>
          ) : (
            <>
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                Bilješka
              </label>
              <div className="w-full px-3 py-2 border border-gray-200 dark:border-gray-700 rounded-lg bg-gray-50 dark:bg-gray-700/50 text-gray-900 dark:text-white min-h-[100px] whitespace-pre-wrap">
                {note || <span className="text-gray-400 dark:text-gray-500 italic">Nema bilješke</span>}
              </div>
            </>
          )}
        </div>

        {/* Footer */}
        <div className="flex gap-3">
          {isEditing ? (
            <>
              <button
                onClick={handleSave}
                disabled={loading}
                className="flex-1 py-2 px-4 bg-indigo-600 hover:bg-indigo-700 text-white font-medium rounded-lg transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
              >
                {loading ? 'Spremanje...' : 'Spremi'}
              </button>
              <button
                onClick={handleCancel}
                className="px-4 py-2 text-gray-600 dark:text-gray-400 hover:text-gray-800 dark:hover:text-gray-200 transition-colors"
              >
                Odustani
              </button>
            </>
          ) : (
            <button
              onClick={onClose}
              className="w-full py-2 px-4 bg-gray-100 dark:bg-gray-700 text-gray-700 dark:text-gray-300 font-medium rounded-lg hover:bg-gray-200 dark:hover:bg-gray-600 transition-colors"
            >
              Zatvori
            </button>
          )}
        </div>
      </div>
    </div>
  )
}

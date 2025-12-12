import { useAuth } from '../context/AuthContext'

export function Dashboard() {
  const { user, signOut } = useAuth()

  const today = new Date().toLocaleDateString('hr-HR', {
    weekday: 'long',
    year: 'numeric',
    month: 'long',
    day: 'numeric'
  })

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-900">
      <header className="bg-white dark:bg-gray-800 shadow">
        <div className="max-w-7xl mx-auto px-4 py-4 sm:px-6 lg:px-8 flex justify-between items-center">
          <h1 className="text-2xl font-bold text-gray-900 dark:text-white">
            Mini Habit Tracker
          </h1>
          <button
            onClick={signOut}
            className="text-gray-600 dark:text-gray-400 hover:text-gray-900 dark:hover:text-white transition-colors"
          >
            Sign Out
          </button>
        </div>
      </header>

      <main className="max-w-7xl mx-auto px-4 py-8 sm:px-6 lg:px-8">
        <div className="mb-8">
          <p className="text-gray-600 dark:text-gray-400">{today}</p>
          <p className="text-sm text-gray-500 dark:text-gray-500 mt-1">
            Logged in as: {user?.email}
          </p>
        </div>

        <div className="bg-white dark:bg-gray-800 rounded-lg shadow p-6">
          <h2 className="text-xl font-semibold text-gray-900 dark:text-white mb-4">
            Your Habits
          </h2>
          <p className="text-gray-600 dark:text-gray-400">
            No habits yet. Create your first habit to get started!
          </p>
          <button className="mt-4 bg-indigo-600 hover:bg-indigo-700 text-white font-medium py-2 px-4 rounded-lg transition-colors">
            + Add Habit
          </button>
        </div>
      </main>
    </div>
  )
}

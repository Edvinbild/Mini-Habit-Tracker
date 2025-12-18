import { ReactNode } from 'react'

interface StatCardProps {
  value: string | number
  label: string
  sublabel?: string
  icon: ReactNode
}

export function StatCard({ value, label, sublabel, icon }: StatCardProps) {
  return (
    <div className="bg-white dark:bg-gray-800 rounded-xl p-4 border border-gray-200 dark:border-gray-700">
      <div className="flex items-center gap-3">
        <div className="p-2 bg-indigo-100 dark:bg-indigo-900/30 rounded-lg text-indigo-600 dark:text-indigo-400">
          {icon}
        </div>
        <div>
          <div className="text-2xl font-bold text-gray-900 dark:text-white">
            {value}
          </div>
          <div className="text-sm text-gray-500 dark:text-gray-400">
            {label}
          </div>
          {sublabel && (
            <div className="text-xs text-gray-400 dark:text-gray-500">
              {sublabel}
            </div>
          )}
        </div>
      </div>
    </div>
  )
}

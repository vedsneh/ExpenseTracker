"use client"

import { useAuth } from "@/components/auth-provider"

export function DashboardHeader() {
  const { user } = useAuth()

  return (
    <header className="bg-white dark:bg-gray-800 border-b border-gray-200 dark:border-gray-700 px-6 py-4">
      <div className="flex items-center justify-between">
        <div className="flex items-center space-x-4 lg:ml-0 ml-16">
          <div>
            <h2 className="text-lg font-semibold text-gray-900 dark:text-white">
              Welcome back, {user?.name}!
            </h2>
            <p className="text-sm text-gray-500 dark:text-gray-400">
              Here's your financial overview
            </p>
          </div>
        </div>
      </div>
    </header>
  )
}

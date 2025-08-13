import { IncomeManager } from "@/components/income-manager"

export default function IncomePage() {
  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold text-gray-900 dark:text-white">
          Income Management
        </h1>
        <p className="text-gray-600 dark:text-gray-400">
          Track and manage your income sources
        </p>
      </div>
      
      <IncomeManager />
    </div>
  )
}

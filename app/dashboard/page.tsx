import { DashboardOverview } from "@/components/dashboard-overview"
import { RecentTransactions } from "@/components/recent-transactions"
import { ExpenseChart } from "@/components/expense-chart"

export default function DashboardPage() {
  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold text-gray-900 dark:text-white">
          Dashboard
        </h1>
        <p className="text-gray-600 dark:text-gray-400">
          Overview of your financial activity
        </p>
      </div>
      
      <DashboardOverview />
      
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <ExpenseChart />
        <RecentTransactions />
      </div>
    </div>
  )
}

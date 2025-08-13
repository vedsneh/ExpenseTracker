import { ExpenseManager } from "@/components/expense-manager"

export default function ExpensesPage() {
  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold text-gray-900 dark:text-white">
          Expense Management
        </h1>
        <p className="text-gray-600 dark:text-gray-400">
          Track and categorize your expenses
        </p>
      </div>
      
      <ExpenseManager />
    </div>
  )
}

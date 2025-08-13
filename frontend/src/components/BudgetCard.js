import { useTransactions } from "../contexts/TransactionContext"
import { Target, AlertTriangle } from "lucide-react"

const BudgetCard = () => {
  const { monthlyStats } = useTransactions()

  if (!monthlyStats.budget || monthlyStats.budget === 0) {
    return null
  }

  const { budget, expenses, budgetUsed, budgetRemaining } = monthlyStats
  const isOverBudget = expenses > budget
  const isNearLimit = budgetUsed > 80 && !isOverBudget

  return (
    <div className="card" style={{ padding: "1.5rem", marginBottom: "2rem" }}>
      <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", marginBottom: "1rem" }}>
        <div style={{ display: "flex", alignItems: "center", gap: "0.75rem" }}>
          <div
            style={{
              padding: "0.5rem",
              backgroundColor: isOverBudget ? "#fee2e2" : isNearLimit ? "#fef3c7" : "#dcfce7",
              borderRadius: "50%",
              color: isOverBudget ? "#dc2626" : isNearLimit ? "#d97706" : "#16a34a",
            }}
          >
            {isOverBudget ? <AlertTriangle size={20} /> : <Target size={20} />}
          </div>
          <div>
            <h3 style={{ fontSize: "1.125rem", fontWeight: "600", color: "var(--text-primary)" }}>Monthly Budget</h3>
            <p style={{ fontSize: "0.875rem", color: "var(--text-secondary)" }}>
              {new Date().toLocaleDateString("en-US", { month: "long", year: "numeric" })}
            </p>
          </div>
        </div>
        <div style={{ textAlign: "right" }}>
          <p
            style={{
              fontSize: "1.5rem",
              fontWeight: "bold",
              color: isOverBudget ? "#dc2626" : "var(--text-primary)",
            }}
          >
            ${expenses.toLocaleString("en-US", { minimumFractionDigits: 2 })}
          </p>
          <p style={{ fontSize: "0.875rem", color: "var(--text-secondary)" }}>
            of ${budget.toLocaleString("en-US", { minimumFractionDigits: 2 })}
          </p>
        </div>
      </div>

      {/* Progress Bar */}
      <div className="budget-progress">
        <div
          className="budget-progress-fill"
          style={{
            width: `${Math.min(budgetUsed, 100)}%`,
            backgroundColor: isOverBudget ? "#dc2626" : isNearLimit ? "#d97706" : "#10b981",
          }}
        />
      </div>

      <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginTop: "0.75rem" }}>
        <span style={{ fontSize: "0.875rem", color: "var(--text-secondary)" }}>{budgetUsed.toFixed(1)}% used</span>
        <span
          style={{
            fontSize: "0.875rem",
            fontWeight: "500",
            color: isOverBudget ? "#dc2626" : "#16a34a",
          }}
        >
          {isOverBudget
            ? `$${(expenses - budget).toLocaleString("en-US", { minimumFractionDigits: 2 })} over budget`
            : `$${budgetRemaining.toLocaleString("en-US", { minimumFractionDigits: 2 })} remaining`}
        </span>
      </div>

      {isOverBudget && (
        <div
          style={{
            marginTop: "1rem",
            padding: "0.75rem",
            backgroundColor: "#fee2e2",
            borderRadius: "6px",
            border: "1px solid #fecaca",
          }}
        >
          <p style={{ fontSize: "0.875rem", color: "#dc2626", fontWeight: "500" }}>
            ⚠️ You've exceeded your monthly budget. Consider reviewing your expenses.
          </p>
        </div>
      )}
    </div>
  )
}

export default BudgetCard

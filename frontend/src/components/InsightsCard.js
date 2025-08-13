import { useTransactions } from "../contexts/TransactionContext"
import { TrendingUp, TrendingDown, Award, AlertCircle } from "lucide-react"

const InsightsCard = () => {
  const { monthlyStats } = useTransactions()

  if (!monthlyStats.insights) {
    return null
  }

  const { insights } = monthlyStats
  const { expenseChange, topCategory } = insights

  const getChangeIcon = (change) => {
    if (change > 0) return <TrendingUp size={16} className="insight-negative" />
    if (change < 0) return <TrendingDown size={16} className="insight-positive" />
    if (change < 0) return <TrendingDown size={16} className="insight-positive" />
    return <AlertCircle size={16} style={{ color: "var(--text-secondary)" }} />
  }

  const getChangeText = (change) => {
    if (change > 0) return `${change.toFixed(1)}% more than last month`
    if (change < 0) return `${Math.abs(change).toFixed(1)}% less than last month`
    return "Same as last month"
  }

  return (
    <div className="card" style={{ padding: "1.5rem", marginBottom: "2rem" }}>
      <h3 style={{ fontSize: "1.125rem", fontWeight: "600", color: "var(--text-primary)", marginBottom: "1rem" }}>
        💡 Monthly Insights
      </h3>

      <div className="grid md:grid-cols-2" style={{ gap: "1rem" }}>
        {/* Expense Change */}
        <div className="insight-card">
          <div
            style={{
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              gap: "0.5rem",
              marginBottom: "0.5rem",
            }}
          >
            {getChangeIcon(expenseChange)}
            <span
              className="insight-value"
              style={{
                color: expenseChange > 0 ? "#dc2626" : expenseChange < 0 ? "#16a34a" : "var(--text-primary)",
              }}
            >
              {expenseChange === 0 ? "0%" : `${expenseChange > 0 ? "+" : ""}${expenseChange.toFixed(1)}%`}
            </span>
          </div>
          <p className="insight-label">{getChangeText(expenseChange)}</p>
        </div>

        {/* Top Category */}
        {topCategory && (
          <div className="insight-card">
            <div
              style={{
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                gap: "0.5rem",
                marginBottom: "0.5rem",
              }}
            >
              <Award size={16} style={{ color: "#f59e0b" }} />
              <span className="insight-value" style={{ color: "var(--text-primary)" }}>
                {topCategory.name}
              </span>
            </div>
            <p className="insight-label">
              Top category: ${topCategory.amount.toLocaleString("en-US", { minimumFractionDigits: 2 })}
            </p>
          </div>
        )}
      </div>
    </div>
  )
}

export default InsightsCard

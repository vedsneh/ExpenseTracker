import { useTransactions } from "../contexts/TransactionContext"
import StatsCards from "../components/StatsCards"
import RecentTransactions from "../components/RecentTransactions"
import ExpenseChart from "../components/ExpenseChart"
import BudgetCard from "../components/BudgetCard"
import InsightsCard from "../components/InsightsCard"

const Dashboard = () => {
  const { loading } = useTransactions()

  if (loading) {
    return (
      <div style={{ display: "flex", justifyContent: "center", alignItems: "center", height: "50vh" }}>
        <div className="spinner"></div>
      </div>
    )
  }

  return (
    <div className="fade-in">
      <div style={{ marginBottom: "2rem" }}>
        <h1 style={{ fontSize: "2rem", fontWeight: "bold", color: "var(--text-primary)", marginBottom: "0.5rem" }}>
          Dashboard
        </h1>
        <p style={{ color: "var(--text-secondary)" }}>Overview of your financial activity</p>
      </div>

      <BudgetCard />
      <InsightsCard />
      <StatsCards />

      <div className="grid lg:grid-cols-2" style={{ marginTop: "2rem" }}>
        <ExpenseChart />
        <RecentTransactions />
      </div>
    </div>
  )
}

export default Dashboard

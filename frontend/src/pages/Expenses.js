"use client"

import { useState } from "react"
import { useTransactions } from "../contexts/TransactionContext"
import TransactionForm from "../components/TransactionForm"
import TransactionList from "../components/TransactionList"
import FilterBar from "../components/FilterBar"
import { TrendingDown, Download } from "lucide-react"

const Expenses = () => {
  const { getTransactionsByType, stats, exportToCSV } = useTransactions()
  const [showForm, setShowForm] = useState(false)

  const expenseTransactions = getTransactionsByType("expense")

  const handleExport = () => {
    exportToCSV("expense")
  }

  return (
    <div className="fade-in">
      <div style={{ marginBottom: "2rem" }}>
        <h1 style={{ fontSize: "2rem", fontWeight: "bold", color: "#1e293b", marginBottom: "0.5rem" }}>
          Expense Management
        </h1>
        <p style={{ color: "#64748b" }}>Track and categorize your expenses</p>
      </div>

      {/* Summary Card */}
      <div className="card" style={{ padding: "1.5rem", marginBottom: "2rem" }}>
        <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between" }}>
          <div style={{ display: "flex", alignItems: "center", gap: "1rem" }}>
            <div
              style={{
                padding: "0.75rem",
                backgroundColor: "#fee2e2",
                borderRadius: "50%",
                color: "#dc2626",
              }}
            >
              <TrendingDown size={24} />
            </div>
            <div>
              <h3 style={{ fontSize: "1.125rem", fontWeight: "600", color: "#1e293b", marginBottom: "0.25rem" }}>
                Total Expenses
              </h3>
              <p style={{ fontSize: "1.75rem", fontWeight: "bold", color: "#dc2626" }}>
                ${stats.totalExpenses.toLocaleString("en-US", { minimumFractionDigits: 2 })}
              </p>
            </div>
          </div>
          <button onClick={handleExport} className="btn btn-secondary">
            <Download size={16} />
            Export CSV
          </button>
        </div>
      </div>

      {/* Filter Bar */}
      <FilterBar />

      {/* Add Expense Button */}
      <div style={{ marginBottom: "2rem" }}>
        <button onClick={() => setShowForm(!showForm)} className="btn btn-primary">
          {showForm ? "Cancel" : "Add Expense"}
        </button>
      </div>

      {/* Add Expense Form */}
      {showForm && (
        <div style={{ marginBottom: "2rem" }}>
          <TransactionForm type="expense" onSuccess={() => setShowForm(false)} onCancel={() => setShowForm(false)} />
        </div>
      )}

      {/* Expense List */}
      <TransactionList transactions={expenseTransactions} type="expense" title="Expense History" />
    </div>
  )
}

export default Expenses

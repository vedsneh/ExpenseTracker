"use client"

import { useState } from "react"
import { useTransactions } from "../contexts/TransactionContext"
import TransactionForm from "../components/TransactionForm"
import TransactionList from "../components/TransactionList"
import FilterBar from "../components/FilterBar"
import { TrendingUp, Download } from "lucide-react"

const Income = () => {
  const { getTransactionsByType, stats, exportToCSV } = useTransactions()
  const [showForm, setShowForm] = useState(false)

  const incomeTransactions = getTransactionsByType("income")

  const handleExport = () => {
    exportToCSV("income")
  }

  return (
    <div className="fade-in">
      <div style={{ marginBottom: "2rem" }}>
        <h1 style={{ fontSize: "2rem", fontWeight: "bold", color: "#1e293b", marginBottom: "0.5rem" }}>
          Income Management
        </h1>
        <p style={{ color: "#64748b" }}>Track and manage your income sources</p>
      </div>

      {/* Summary Card */}
      <div className="card" style={{ padding: "1.5rem", marginBottom: "2rem" }}>
        <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between" }}>
          <div style={{ display: "flex", alignItems: "center", gap: "1rem" }}>
            <div
              style={{
                padding: "0.75rem",
                backgroundColor: "#dcfce7",
                borderRadius: "50%",
                color: "#16a34a",
              }}
            >
              <TrendingUp size={24} />
            </div>
            <div>
              <h3 style={{ fontSize: "1.125rem", fontWeight: "600", color: "#1e293b", marginBottom: "0.25rem" }}>
                Total Income
              </h3>
              <p style={{ fontSize: "1.75rem", fontWeight: "bold", color: "#16a34a" }}>
                ${stats.totalIncome.toLocaleString("en-US", { minimumFractionDigits: 2 })}
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

      {/* Add Income Button */}
      <div style={{ marginBottom: "2rem" }}>
        <button onClick={() => setShowForm(!showForm)} className="btn btn-primary">
          {showForm ? "Cancel" : "Add Income"}
        </button>
      </div>

      {/* Add Income Form */}
      {showForm && (
        <div style={{ marginBottom: "2rem" }}>
          <TransactionForm type="income" onSuccess={() => setShowForm(false)} onCancel={() => setShowForm(false)} />
        </div>
      )}

      {/* Income List */}
      <TransactionList transactions={incomeTransactions} type="income" title="Income History" />
    </div>
  )
}

export default Income

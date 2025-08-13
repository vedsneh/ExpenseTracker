"use client"

import { useState, useEffect } from "react"
import { useTransactions } from "../contexts/TransactionContext"
import { Plus, Edit, Trash2, Repeat, Play, Pause } from "lucide-react"

const Recurring = () => {
  const {
    recurringTransactions,
    addRecurringTransaction,
    updateRecurringTransaction,
    deleteRecurringTransaction,
    fetchRecurringTransactions,
    categories,
  } = useTransactions()

  const [showForm, setShowForm] = useState(false)
  const [editingRecurring, setEditingRecurring] = useState(null)
  const [formData, setFormData] = useState({
    type: "expense",
    amount: "",
    category: "",
    description: "",
    frequency: "monthly",
    startDate: new Date().toISOString().split("T")[0],
    endDate: "",
  })

  useEffect(() => {
    fetchRecurringTransactions()
  }, [])

  const handleSubmit = async (e) => {
    e.preventDefault()

    let result
    if (editingRecurring) {
      result = await updateRecurringTransaction(editingRecurring._id, formData)
    } else {
      result = await addRecurringTransaction(formData)
    }

    if (result.success) {
      setShowForm(false)
      setEditingRecurring(null)
      setFormData({
        type: "expense",
        amount: "",
        category: "",
        description: "",
        frequency: "monthly",
        startDate: new Date().toISOString().split("T")[0],
        endDate: "",
      })
    }
  }

  const handleEdit = (recurring) => {
    setEditingRecurring(recurring)
    setFormData({
      type: recurring.type,
      amount: recurring.amount.toString(),
      category: recurring.category,
      description: recurring.description,
      frequency: recurring.frequency,
      startDate: new Date(recurring.startDate).toISOString().split("T")[0],
      endDate: recurring.endDate ? new Date(recurring.endDate).toISOString().split("T")[0] : "",
    })
    setShowForm(true)
  }

  const handleDelete = async (id) => {
    if (window.confirm("Are you sure you want to delete this recurring transaction?")) {
      await deleteRecurringTransaction(id)
    }
  }

  const handleCancel = () => {
    setShowForm(false)
    setEditingRecurring(null)
    setFormData({
      type: "expense",
      amount: "",
      category: "",
      description: "",
      frequency: "monthly",
      startDate: new Date().toISOString().split("T")[0],
      endDate: "",
    })
  }

  const toggleActive = async (recurring) => {
    await updateRecurringTransaction(recurring._id, { isActive: !recurring.isActive })
  }

  const getFrequencyText = (frequency) => {
    const frequencies = {
      daily: "Daily",
      weekly: "Weekly",
      monthly: "Monthly",
      yearly: "Yearly",
    }
    return frequencies[frequency] || frequency
  }

  const getNextDate = (recurring) => {
    if (!recurring.lastProcessed) {
      return new Date(recurring.startDate)
    }

    const lastProcessed = new Date(recurring.lastProcessed)
    const next = new Date(lastProcessed)

    switch (recurring.frequency) {
      case "daily":
        next.setDate(next.getDate() + 1)
        break
      case "weekly":
        next.setDate(next.getDate() + 7)
        break
      case "monthly":
        next.setMonth(next.getMonth() + 1)
        break
      case "yearly":
        next.setFullYear(next.getFullYear() + 1)
        break
    }

    return next
  }

  const activeRecurring = recurringTransactions.filter((r) => r.isActive)
  const inactiveRecurring = recurringTransactions.filter((r) => !r.isActive)

  return (
    <div className="fade-in">
      <div style={{ marginBottom: "2rem" }}>
        <h1 style={{ fontSize: "2rem", fontWeight: "bold", color: "var(--text-primary)", marginBottom: "0.5rem" }}>
          Recurring Transactions
        </h1>
        <p style={{ color: "var(--text-secondary)" }}>Set up automatic recurring income and expenses</p>
      </div>

      {/* Add Recurring Button */}
      <div style={{ marginBottom: "2rem" }}>
        <button onClick={() => setShowForm(!showForm)} className="btn btn-primary">
          <Plus size={16} />
          {showForm ? "Cancel" : "Add Recurring Transaction"}
        </button>
      </div>

      {/* Recurring Form */}
      {showForm && (
        <div className="card" style={{ padding: "1.5rem", marginBottom: "2rem" }}>
          <h3 style={{ fontSize: "1.125rem", fontWeight: "600", color: "var(--text-primary)", marginBottom: "1rem" }}>
            {editingRecurring ? "Edit Recurring Transaction" : "Add New Recurring Transaction"}
          </h3>

          <form onSubmit={handleSubmit}>
            <div className="grid md:grid-cols-2" style={{ gap: "1rem", marginBottom: "1rem" }}>
              <div className="form-group">
                <label className="form-label">Type</label>
                <select
                  className="form-select"
                  value={formData.type}
                  onChange={(e) => setFormData({ ...formData, type: e.target.value })}
                  required
                >
                  <option value="income">Income</option>
                  <option value="expense">Expense</option>
                </select>
              </div>

              <div className="form-group">
                <label className="form-label">Amount</label>
                <input
                  type="number"
                  className="form-input"
                  placeholder="0.00"
                  step="0.01"
                  min="0.01"
                  value={formData.amount}
                  onChange={(e) => setFormData({ ...formData, amount: e.target.value })}
                  required
                />
              </div>
            </div>

            <div className="grid md:grid-cols-2" style={{ gap: "1rem", marginBottom: "1rem" }}>
              <div className="form-group">
                <label className="form-label">Category</label>
                <select
                  className="form-select"
                  value={formData.category}
                  onChange={(e) => setFormData({ ...formData, category: e.target.value })}
                  required
                >
                  <option value="">Select category</option>
                  {categories
                    .filter((c) => c.type === formData.type)
                    .map((category) => (
                      <option key={category._id} value={category.name}>
                        {category.name}
                      </option>
                    ))}
                </select>
              </div>

              <div className="form-group">
                <label className="form-label">Frequency</label>
                <select
                  className="form-select"
                  value={formData.frequency}
                  onChange={(e) => setFormData({ ...formData, frequency: e.target.value })}
                  required
                >
                  <option value="daily">Daily</option>
                  <option value="weekly">Weekly</option>
                  <option value="monthly">Monthly</option>
                  <option value="yearly">Yearly</option>
                </select>
              </div>
            </div>

            <div className="form-group" style={{ marginBottom: "1rem" }}>
              <label className="form-label">Description</label>
              <textarea
                className="form-textarea"
                placeholder="Enter description..."
                value={formData.description}
                onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                required
              />
            </div>

            <div className="grid md:grid-cols-2" style={{ gap: "1rem", marginBottom: "1rem" }}>
              <div className="form-group">
                <label className="form-label">Start Date</label>
                <input
                  type="date"
                  className="form-input"
                  value={formData.startDate}
                  onChange={(e) => setFormData({ ...formData, startDate: e.target.value })}
                  required
                />
              </div>

              <div className="form-group">
                <label className="form-label">End Date (Optional)</label>
                <input
                  type="date"
                  className="form-input"
                  value={formData.endDate}
                  onChange={(e) => setFormData({ ...formData, endDate: e.target.value })}
                />
              </div>
            </div>

            <div style={{ display: "flex", gap: "1rem", justifyContent: "flex-end" }}>
              <button type="button" onClick={handleCancel} className="btn btn-secondary">
                Cancel
              </button>
              <button type="submit" className="btn btn-primary">
                {editingRecurring ? "Update" : "Add"} Recurring Transaction
              </button>
            </div>
          </form>
        </div>
      )}

      {/* Active Recurring Transactions */}
      <div className="card" style={{ padding: "1.5rem", marginBottom: "2rem" }}>
        <h3
          style={{
            fontSize: "1.125rem",
            fontWeight: "600",
            color: "var(--text-primary)",
            marginBottom: "1rem",
            display: "flex",
            alignItems: "center",
            gap: "0.5rem",
          }}
        >
          <Play size={16} style={{ color: "#10b981" }} />
          Active Recurring Transactions ({activeRecurring.length})
        </h3>

        {activeRecurring.length === 0 ? (
          <div className="empty-state">
            <Repeat className="empty-state-icon" />
            <h4>No active recurring transactions</h4>
            <p>Set up your first recurring transaction to automate your finances</p>
          </div>
        ) : (
          <div style={{ display: "flex", flexDirection: "column", gap: "1rem" }}>
            {activeRecurring.map((recurring) => {
              const isIncome = recurring.type === "income"
              const nextDate = getNextDate(recurring)

              return (
                <div
                  key={recurring._id}
                  style={{
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "space-between",
                    padding: "1rem",
                    border: "1px solid var(--border-color)",
                    borderRadius: "8px",
                    transition: "background-color 0.2s",
                  }}
                  onMouseEnter={(e) => {
                    e.currentTarget.style.backgroundColor = "var(--bg-secondary)"
                  }}
                  onMouseLeave={(e) => {
                    e.currentTarget.style.backgroundColor = "transparent"
                  }}
                >
                  <div style={{ display: "flex", alignItems: "center", gap: "1rem", flex: 1 }}>
                    <div
                      style={{
                        padding: "0.5rem",
                        backgroundColor: isIncome ? "#dcfce7" : "#fee2e2",
                        borderRadius: "50%",
                        color: isIncome ? "#16a34a" : "#dc2626",
                      }}
                    >
                      <Repeat size={16} />
                    </div>
                    <div style={{ flex: 1 }}>
                      <h4
                        style={{
                          fontSize: "0.875rem",
                          fontWeight: "500",
                          color: "var(--text-primary)",
                          marginBottom: "0.25rem",
                        }}
                      >
                        {recurring.description}
                      </h4>
                      <div style={{ display: "flex", alignItems: "center", gap: "0.5rem", flexWrap: "wrap" }}>
                        <span
                          style={{
                            fontSize: "0.75rem",
                            padding: "0.125rem 0.5rem",
                            backgroundColor: "var(--bg-secondary)",
                            borderRadius: "9999px",
                            color: "var(--text-secondary)",
                          }}
                        >
                          {recurring.category}
                        </span>
                        <span
                          style={{
                            fontSize: "0.75rem",
                            padding: "0.125rem 0.5rem",
                            backgroundColor: "#f3f4f6",
                            borderRadius: "9999px",
                            color: "#6b7280",
                          }}
                        >
                          {getFrequencyText(recurring.frequency)}
                        </span>
                        <span style={{ fontSize: "0.75rem", color: "var(--text-secondary)" }}>
                          Next: {nextDate.toLocaleDateString()}
                        </span>
                      </div>
                    </div>
                  </div>

                  <div style={{ display: "flex", alignItems: "center", gap: "1rem" }}>
                    <span
                      style={{
                        fontSize: "1rem",
                        fontWeight: "600",
                        color: isIncome ? "#16a34a" : "#dc2626",
                      }}
                    >
                      {isIncome ? "+" : "-"}${recurring.amount.toLocaleString("en-US", { minimumFractionDigits: 2 })}
                    </span>

                    <div style={{ display: "flex", gap: "0.5rem" }}>
                      <button
                        onClick={() => toggleActive(recurring)}
                        className="btn btn-secondary"
                        style={{ padding: "0.25rem" }}
                        title="Pause recurring transaction"
                      >
                        <Pause size={14} />
                      </button>
                      <button
                        onClick={() => handleEdit(recurring)}
                        className="btn btn-secondary"
                        style={{ padding: "0.25rem" }}
                      >
                        <Edit size={14} />
                      </button>
                      <button
                        onClick={() => handleDelete(recurring._id)}
                        className="btn btn-danger"
                        style={{ padding: "0.25rem" }}
                      >
                        <Trash2 size={14} />
                      </button>
                    </div>
                  </div>
                </div>
              )
            })}
          </div>
        )}
      </div>

      {/* Inactive Recurring Transactions */}
      {inactiveRecurring.length > 0 && (
        <div className="card" style={{ padding: "1.5rem" }}>
          <h3
            style={{
              fontSize: "1.125rem",
              fontWeight: "600",
              color: "var(--text-primary)",
              marginBottom: "1rem",
              display: "flex",
              alignItems: "center",
              gap: "0.5rem",
            }}
          >
            <Pause size={16} style={{ color: "#6b7280" }} />
            Paused Recurring Transactions ({inactiveRecurring.length})
          </h3>

          <div style={{ display: "flex", flexDirection: "column", gap: "1rem" }}>
            {inactiveRecurring.map((recurring) => {
              const isIncome = recurring.type === "income"

              return (
                <div
                  key={recurring._id}
                  style={{
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "space-between",
                    padding: "1rem",
                    border: "1px solid var(--border-color)",
                    borderRadius: "8px",
                    opacity: 0.6,
                    transition: "all 0.2s",
                  }}
                  onMouseEnter={(e) => {
                    e.currentTarget.style.backgroundColor = "var(--bg-secondary)"
                    e.currentTarget.style.opacity = 1
                  }}
                  onMouseLeave={(e) => {
                    e.currentTarget.style.backgroundColor = "transparent"
                    e.currentTarget.style.opacity = 0.6
                  }}
                >
                  <div style={{ display: "flex", alignItems: "center", gap: "1rem", flex: 1 }}>
                    <div
                      style={{
                        padding: "0.5rem",
                        backgroundColor: "#f3f4f6",
                        borderRadius: "50%",
                        color: "#6b7280",
                      }}
                    >
                      <Repeat size={16} />
                    </div>
                    <div style={{ flex: 1 }}>
                      <h4
                        style={{
                          fontSize: "0.875rem",
                          fontWeight: "500",
                          color: "var(--text-primary)",
                          marginBottom: "0.25rem",
                        }}
                      >
                        {recurring.description}
                      </h4>
                      <div style={{ display: "flex", alignItems: "center", gap: "0.5rem", flexWrap: "wrap" }}>
                        <span
                          style={{
                            fontSize: "0.75rem",
                            padding: "0.125rem 0.5rem",
                            backgroundColor: "var(--bg-secondary)",
                            borderRadius: "9999px",
                            color: "var(--text-secondary)",
                          }}
                        >
                          {recurring.category}
                        </span>
                        <span
                          style={{
                            fontSize: "0.75rem",
                            padding: "0.125rem 0.5rem",
                            backgroundColor: "#f3f4f6",
                            borderRadius: "9999px",
                            color: "#6b7280",
                          }}
                        >
                          {getFrequencyText(recurring.frequency)}
                        </span>
                        <span style={{ fontSize: "0.75rem", color: "#ef4444" }}>Paused</span>
                      </div>
                    </div>
                  </div>

                  <div style={{ display: "flex", alignItems: "center", gap: "1rem" }}>
                    <span
                      style={{
                        fontSize: "1rem",
                        fontWeight: "600",
                        color: "var(--text-secondary)",
                      }}
                    >
                      {isIncome ? "+" : "-"}${recurring.amount.toLocaleString("en-US", { minimumFractionDigits: 2 })}
                    </span>

                    <div style={{ display: "flex", gap: "0.5rem" }}>
                      <button
                        onClick={() => toggleActive(recurring)}
                        className="btn btn-success"
                        style={{ padding: "0.25rem" }}
                        title="Resume recurring transaction"
                      >
                        <Play size={14} />
                      </button>
                      <button
                        onClick={() => handleEdit(recurring)}
                        className="btn btn-secondary"
                        style={{ padding: "0.25rem" }}
                      >
                        <Edit size={14} />
                      </button>
                      <button
                        onClick={() => handleDelete(recurring._id)}
                        className="btn btn-danger"
                        style={{ padding: "0.25rem" }}
                      >
                        <Trash2 size={14} />
                      </button>
                    </div>
                  </div>
                </div>
              )
            })}
          </div>
        </div>
      )}
    </div>
  )
}

export default Recurring

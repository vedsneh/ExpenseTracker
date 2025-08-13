"use client"

import { useState, useEffect } from "react"
import { useTransactions } from "../contexts/TransactionContext"
import { Plus, Edit, Trash2, Tag } from "lucide-react"

const Categories = () => {
  const { categories, addCategory, updateCategory, deleteCategory, fetchCategories } = useTransactions()
  const [showForm, setShowForm] = useState(false)
  const [editingCategory, setEditingCategory] = useState(null)
  const [formData, setFormData] = useState({
    name: "",
    type: "expense",
    color: "#3b82f6",
    icon: "Tag",
  })

  useEffect(() => {
    fetchCategories()
  }, [])

  const handleSubmit = async (e) => {
    e.preventDefault()

    let result
    if (editingCategory) {
      result = await updateCategory(editingCategory._id, formData)
    } else {
      result = await addCategory(formData)
    }

    if (result.success) {
      setShowForm(false)
      setEditingCategory(null)
      setFormData({
        name: "",
        type: "expense",
        color: "#3b82f6",
        icon: "Tag",
      })
    }
  }

  const handleEdit = (category) => {
    setEditingCategory(category)
    setFormData({
      name: category.name,
      type: category.type,
      color: category.color,
      icon: category.icon,
    })
    setShowForm(true)
  }

  const handleDelete = async (id) => {
    if (window.confirm("Are you sure you want to delete this category?")) {
      await deleteCategory(id)
    }
  }

  const handleCancel = () => {
    setShowForm(false)
    setEditingCategory(null)
    setFormData({
      name: "",
      type: "expense",
      color: "#3b82f6",
      icon: "Tag",
    })
  }

  const incomeCategories = categories.filter((c) => c.type === "income")
  const expenseCategories = categories.filter((c) => c.type === "expense")

  return (
    <div className="fade-in">
      <div style={{ marginBottom: "2rem" }}>
        <h1 style={{ fontSize: "2rem", fontWeight: "bold", color: "var(--text-primary)", marginBottom: "0.5rem" }}>
          Category Management
        </h1>
        <p style={{ color: "var(--text-secondary)" }}>Create and manage your custom categories</p>
      </div>

      {/* Add Category Button */}
      <div style={{ marginBottom: "2rem" }}>
        <button onClick={() => setShowForm(!showForm)} className="btn btn-primary">
          <Plus size={16} />
          {showForm ? "Cancel" : "Add Category"}
        </button>
      </div>

      {/* Category Form */}
      {showForm && (
        <div className="card" style={{ padding: "1.5rem", marginBottom: "2rem" }}>
          <h3 style={{ fontSize: "1.125rem", fontWeight: "600", color: "var(--text-primary)", marginBottom: "1rem" }}>
            {editingCategory ? "Edit Category" : "Add New Category"}
          </h3>

          <form onSubmit={handleSubmit}>
            <div className="grid md:grid-cols-2" style={{ gap: "1rem", marginBottom: "1rem" }}>
              <div className="form-group">
                <label className="form-label">Category Name</label>
                <input
                  type="text"
                  className="form-input"
                  placeholder="Enter category name"
                  value={formData.name}
                  onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                  required
                />
              </div>

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
            </div>

            <div className="grid md:grid-cols-2" style={{ gap: "1rem", marginBottom: "1rem" }}>
              <div className="form-group">
                <label className="form-label">Color</label>
                <input
                  type="color"
                  className="form-input"
                  value={formData.color}
                  onChange={(e) => setFormData({ ...formData, color: e.target.value })}
                  style={{ height: "40px" }}
                />
              </div>

              <div className="form-group">
                <label className="form-label">Icon</label>
                <select
                  className="form-select"
                  value={formData.icon}
                  onChange={(e) => setFormData({ ...formData, icon: e.target.value })}
                >
                  <option value="Tag">Tag</option>
                  <option value="DollarSign">Dollar Sign</option>
                  <option value="Home">Home</option>
                  <option value="Car">Car</option>
                  <option value="ShoppingBag">Shopping</option>
                  <option value="Utensils">Food</option>
                  <option value="Gamepad2">Entertainment</option>
                  <option value="GraduationCap">Education</option>
                  <option value="Plane">Travel</option>
                  <option value="Heart">Health</option>
                </select>
              </div>
            </div>

            <div style={{ display: "flex", gap: "1rem", justifyContent: "flex-end" }}>
              <button type="button" onClick={handleCancel} className="btn btn-secondary">
                Cancel
              </button>
              <button type="submit" className="btn btn-primary">
                {editingCategory ? "Update" : "Add"} Category
              </button>
            </div>
          </form>
        </div>
      )}

      {/* Categories List */}
      <div className="grid lg:grid-cols-2" style={{ gap: "2rem" }}>
        {/* Income Categories */}
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
            <div style={{ width: "8px", height: "8px", backgroundColor: "#10b981", borderRadius: "50%" }}></div>
            Income Categories ({incomeCategories.length})
          </h3>

          {incomeCategories.length === 0 ? (
            <div className="empty-state">
              <Tag className="empty-state-icon" />
              <h4>No income categories</h4>
              <p>Add your first income category to get started</p>
            </div>
          ) : (
            <div style={{ display: "flex", flexDirection: "column", gap: "0.75rem" }}>
              {incomeCategories.map((category) => (
                <div
                  key={category._id}
                  style={{
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "space-between",
                    padding: "0.75rem",
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
                  <div style={{ display: "flex", alignItems: "center", gap: "0.75rem" }}>
                    <div
                      style={{
                        width: "32px",
                        height: "32px",
                        backgroundColor: category.color,
                        borderRadius: "6px",
                        display: "flex",
                        alignItems: "center",
                        justifyContent: "center",
                        color: "white",
                      }}
                    >
                      <Tag size={16} />
                    </div>
                    <span style={{ fontWeight: "500", color: "var(--text-primary)" }}>{category.name}</span>
                  </div>
                  <div style={{ display: "flex", gap: "0.5rem" }}>
                    <button
                      onClick={() => handleEdit(category)}
                      className="btn btn-secondary"
                      style={{ padding: "0.25rem" }}
                    >
                      <Edit size={14} />
                    </button>
                    <button
                      onClick={() => handleDelete(category._id)}
                      className="btn btn-danger"
                      style={{ padding: "0.25rem" }}
                    >
                      <Trash2 size={14} />
                    </button>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>

        {/* Expense Categories */}
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
            <div style={{ width: "8px", height: "8px", backgroundColor: "#ef4444", borderRadius: "50%" }}></div>
            Expense Categories ({expenseCategories.length})
          </h3>

          {expenseCategories.length === 0 ? (
            <div className="empty-state">
              <Tag className="empty-state-icon" />
              <h4>No expense categories</h4>
              <p>Add your first expense category to get started</p>
            </div>
          ) : (
            <div style={{ display: "flex", flexDirection: "column", gap: "0.75rem" }}>
              {expenseCategories.map((category) => (
                <div
                  key={category._id}
                  style={{
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "space-between",
                    padding: "0.75rem",
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
                  <div style={{ display: "flex", alignItems: "center", gap: "0.75rem" }}>
                    <div
                      style={{
                        width: "32px",
                        height: "32px",
                        backgroundColor: category.color,
                        borderRadius: "6px",
                        display: "flex",
                        alignItems: "center",
                        justifyContent: "center",
                        color: "white",
                      }}
                    >
                      <Tag size={16} />
                    </div>
                    <span style={{ fontWeight: "500", color: "var(--text-primary)" }}>{category.name}</span>
                  </div>
                  <div style={{ display: "flex", gap: "0.5rem" }}>
                    <button
                      onClick={() => handleEdit(category)}
                      className="btn btn-secondary"
                      style={{ padding: "0.25rem" }}
                    >
                      <Edit size={14} />
                    </button>
                    <button
                      onClick={() => handleDelete(category._id)}
                      className="btn btn-danger"
                      style={{ padding: "0.25rem" }}
                    >
                      <Trash2 size={14} />
                    </button>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  )
}

export default Categories

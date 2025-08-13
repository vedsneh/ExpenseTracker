"use client"

import { createContext, useContext, useState, useEffect } from "react"
import axios from "axios"
import toast from "react-hot-toast"
import { useAuth } from "./AuthContext"

const TransactionContext = createContext()

export const useTransactions = () => {
  const context = useContext(TransactionContext)
  if (!context) {
    throw new Error("useTransactions must be used within a TransactionProvider")
  }
  return context
}

export const TransactionProvider = ({ children }) => {
  const [transactions, setTransactions] = useState([])
  const [categories, setCategories] = useState([])
  const [recurringTransactions, setRecurringTransactions] = useState([])
  const [stats, setStats] = useState({
    totalIncome: 0,
    totalExpenses: 0,
    balance: 0,
    transactionCount: 0,
    expensesByCategory: {},
  })
  const [monthlyStats, setMonthlyStats] = useState({})
  const [loading, setLoading] = useState(false)
  const [filters, setFilters] = useState({
    type: "",
    category: "",
    startDate: "",
    endDate: "",
    search: "",
    sortBy: "date",
    sortOrder: "desc",
  })
  const { isAuthenticated } = useAuth()

  // Fetch transactions with filters
  const fetchTransactions = async (customFilters = {}) => {
    if (!isAuthenticated) return

    setLoading(true)
    try {
      const params = { ...filters, ...customFilters }
      const response = await axios.get("/api/transactions", { params })
      setTransactions(response.data.transactions || response.data)
    } catch (error) {
      toast.error("Failed to fetch transactions")
    } finally {
      setLoading(false)
    }
  }

  // Fetch categories
  const fetchCategories = async (type = "") => {
    if (!isAuthenticated) return

    try {
      const params = type ? { type } : {}
      const response = await axios.get("/api/categories", { params })
      setCategories(response.data)
    } catch (error) {
      toast.error("Failed to fetch categories")
    }
  }

  // Fetch recurring transactions
  const fetchRecurringTransactions = async () => {
    if (!isAuthenticated) return

    try {
      const response = await axios.get("/api/recurring")
      setRecurringTransactions(response.data)
    } catch (error) {
      toast.error("Failed to fetch recurring transactions")
    }
  }

  // Fetch statistics
  const fetchStats = async () => {
    if (!isAuthenticated) return

    try {
      const response = await axios.get("/api/transactions/stats")
      setStats(response.data)
    } catch (error) {
      toast.error("Failed to fetch statistics")
    }
  }

  // Fetch monthly summary
  const fetchMonthlyStats = async (year, month) => {
    if (!isAuthenticated) return

    try {
      const params = {}
      if (year) params.year = year
      if (month) params.month = month

      const response = await axios.get("/api/transactions/monthly-summary", { params })
      setMonthlyStats(response.data)
    } catch (error) {
      toast.error("Failed to fetch monthly summary")
    }
  }

  // Add transaction
  const addTransaction = async (transactionData) => {
    try {
      const response = await axios.post("/api/transactions", transactionData)
      await fetchTransactions()
      await fetchStats()
      await fetchMonthlyStats()
      toast.success(`${transactionData.type === "income" ? "Income" : "Expense"} added successfully!`)
      return { success: true }
    } catch (error) {
      const message = error.response?.data?.message || "Failed to add transaction"
      toast.error(message)
      return { success: false, message }
    }
  }

  // Update transaction
  const updateTransaction = async (id, transactionData) => {
    try {
      await axios.put(`/api/transactions/${id}`, transactionData)
      await fetchTransactions()
      await fetchStats()
      await fetchMonthlyStats()
      toast.success("Transaction updated successfully!")
      return { success: true }
    } catch (error) {
      const message = error.response?.data?.message || "Failed to update transaction"
      toast.error(message)
      return { success: false, message }
    }
  }

  // Delete transaction
  const deleteTransaction = async (id) => {
    try {
      await axios.delete(`/api/transactions/${id}`)
      await fetchTransactions()
      await fetchStats()
      await fetchMonthlyStats()
      toast.success("Transaction deleted successfully!")
      return { success: true }
    } catch (error) {
      const message = error.response?.data?.message || "Failed to delete transaction"
      toast.error(message)
      return { success: false, message }
    }
  }

  // Category management
  const addCategory = async (categoryData) => {
    try {
      await axios.post("/api/categories", categoryData)
      await fetchCategories()
      toast.success("Category added successfully!")
      return { success: true }
    } catch (error) {
      const message = error.response?.data?.message || "Failed to add category"
      toast.error(message)
      return { success: false, message }
    }
  }

  const updateCategory = async (id, categoryData) => {
    try {
      await axios.put(`/api/categories/${id}`, categoryData)
      await fetchCategories()
      toast.success("Category updated successfully!")
      return { success: true }
    } catch (error) {
      const message = error.response?.data?.message || "Failed to update category"
      toast.error(message)
      return { success: false, message }
    }
  }

  const deleteCategory = async (id) => {
    try {
      await axios.delete(`/api/categories/${id}`)
      await fetchCategories()
      toast.success("Category deleted successfully!")
      return { success: true }
    } catch (error) {
      const message = error.response?.data?.message || "Failed to delete category"
      toast.error(message)
      return { success: false, message }
    }
  }

  // Recurring transaction management
  const addRecurringTransaction = async (recurringData) => {
    try {
      await axios.post("/api/recurring", recurringData)
      await fetchRecurringTransactions()
      toast.success("Recurring transaction added successfully!")
      return { success: true }
    } catch (error) {
      const message = error.response?.data?.message || "Failed to add recurring transaction"
      toast.error(message)
      return { success: false, message }
    }
  }

  const updateRecurringTransaction = async (id, recurringData) => {
    try {
      await axios.put(`/api/recurring/${id}`, recurringData)
      await fetchRecurringTransactions()
      toast.success("Recurring transaction updated successfully!")
      return { success: true }
    } catch (error) {
      const message = error.response?.data?.message || "Failed to update recurring transaction"
      toast.error(message)
      return { success: false, message }
    }
  }

  const deleteRecurringTransaction = async (id) => {
    try {
      await axios.delete(`/api/recurring/${id}`)
      await fetchRecurringTransactions()
      toast.success("Recurring transaction deleted successfully!")
      return { success: true }
    } catch (error) {
      const message = error.response?.data?.message || "Failed to delete recurring transaction"
      toast.error(message)
      return { success: false, message }
    }
  }

  // Filter and search functions
  const updateFilters = (newFilters) => {
    const updatedFilters = { ...filters, ...newFilters }
    setFilters(updatedFilters)
    fetchTransactions(updatedFilters)
  }

  const clearFilters = () => {
    const clearedFilters = {
      type: "",
      category: "",
      startDate: "",
      endDate: "",
      search: "",
      sortBy: "date",
      sortOrder: "desc",
    }
    setFilters(clearedFilters)
    fetchTransactions(clearedFilters)
  }

  // Quick filter presets
  const applyQuickFilter = (preset) => {
    const now = new Date()
    let startDate = ""
    let endDate = ""

    switch (preset) {
      case "today":
        startDate = now.toISOString().split("T")[0]
        endDate = startDate
        break
      case "week":
        const weekStart = new Date(now.setDate(now.getDate() - now.getDay()))
        startDate = weekStart.toISOString().split("T")[0]
        endDate = new Date().toISOString().split("T")[0]
        break
      case "month":
        startDate = new Date(now.getFullYear(), now.getMonth(), 1).toISOString().split("T")[0]
        endDate = new Date(now.getFullYear(), now.getMonth() + 1, 0).toISOString().split("T")[0]
        break
      case "year":
        startDate = new Date(now.getFullYear(), 0, 1).toISOString().split("T")[0]
        endDate = new Date(now.getFullYear(), 11, 31).toISOString().split("T")[0]
        break
      default:
        break
    }

    updateFilters({ startDate, endDate })
  }

  // Get transactions by type
  const getTransactionsByType = (type) => {
    return transactions.filter((t) => t.type === type)
  }

  // Get recent transactions
  const getRecentTransactions = (limit = 5) => {
    return transactions.sort((a, b) => new Date(b.date) - new Date(a.date)).slice(0, limit)
  }

  // Export transactions to CSV
  const exportToCSV = (type = "all") => {
    let dataToExport = transactions

    if (type !== "all") {
      dataToExport = transactions.filter((t) => t.type === type)
    }

    const csvContent = [
      ["Date", "Type", "Category", "Description", "Amount"],
      ...dataToExport.map((t) => [new Date(t.date).toLocaleDateString(), t.type, t.category, t.description, t.amount]),
    ]
      .map((row) => row.join(","))
      .join("\n")

    const blob = new Blob([csvContent], { type: "text/csv" })
    const url = window.URL.createObjectURL(blob)
    const a = document.createElement("a")
    a.href = url
    a.download = `${type}-transactions.csv`
    a.click()
    window.URL.revokeObjectURL(url)

    toast.success("Export completed!")
  }

  // Fetch data when authenticated
  useEffect(() => {
    if (isAuthenticated) {
      fetchTransactions()
      fetchStats()
      fetchCategories()
      fetchRecurringTransactions()
      fetchMonthlyStats()
    } else {
      setTransactions([])
      setCategories([])
      setRecurringTransactions([])
      setStats({
        totalIncome: 0,
        totalExpenses: 0,
        balance: 0,
        transactionCount: 0,
        expensesByCategory: {},
      })
      setMonthlyStats({})
    }
  }, [isAuthenticated])

  const value = {
    transactions,
    categories,
    recurringTransactions,
    stats,
    monthlyStats,
    loading,
    filters,
    fetchTransactions,
    fetchStats,
    fetchCategories,
    fetchRecurringTransactions,
    fetchMonthlyStats,
    addTransaction,
    updateTransaction,
    deleteTransaction,
    addCategory,
    updateCategory,
    deleteCategory,
    addRecurringTransaction,
    updateRecurringTransaction,
    deleteRecurringTransaction,
    getTransactionsByType,
    getRecentTransactions,
    exportToCSV,
    updateFilters,
    clearFilters,
    applyQuickFilter,
  }

  return <TransactionContext.Provider value={value}>{children}</TransactionContext.Provider>
}

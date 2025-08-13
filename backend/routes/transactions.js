const express = require("express")
const { body, validationResult } = require("express-validator")
const Transaction = require("../models/Transaction")
const User = require("../models/User") // Added User model import
const auth = require("../middleware/auth")

const router = express.Router()

// Get all transactions for user with filtering and sorting
router.get("/", auth, async (req, res) => {
  try {
    const {
      type,
      category,
      startDate,
      endDate,
      sortBy = "date",
      sortOrder = "desc",
      search,
      page = 1,
      limit = 50,
    } = req.query

    // Build filter object
    const filter = { user: req.user._id }

    if (type) {
      filter.type = type
    }

    if (category) {
      filter.category = { $regex: category, $options: "i" }
    }

    if (startDate || endDate) {
      filter.date = {}
      if (startDate) {
        filter.date.$gte = new Date(startDate)
      }
      if (endDate) {
        filter.date.$lte = new Date(endDate)
      }
    }

    if (search) {
      filter.$or = [{ description: { $regex: search, $options: "i" } }, { category: { $regex: search, $options: "i" } }]
    }

    // Build sort object
    const sort = {}
    sort[sortBy] = sortOrder === "desc" ? -1 : 1

    // Execute query with pagination
    const skip = (Number.parseInt(page) - 1) * Number.parseInt(limit)

    const transactions = await Transaction.find(filter).sort(sort).skip(skip).limit(Number.parseInt(limit))

    const total = await Transaction.countDocuments(filter)

    res.json({
      transactions,
      pagination: {
        page: Number.parseInt(page),
        limit: Number.parseInt(limit),
        total,
        pages: Math.ceil(total / Number.parseInt(limit)),
      },
    })
  } catch (error) {
    console.error(error)
    res.status(500).json({ message: "Server error" })
  }
})

// Create new transaction
router.post(
  "/",
  [
    auth,
    body("type").isIn(["income", "expense"]).withMessage("Type must be income or expense"),
    body("amount").isNumeric().isFloat({ min: 0.01 }).withMessage("Amount must be a positive number"),
    body("category").trim().isLength({ min: 1 }).withMessage("Category is required"),
    body("description").trim().isLength({ min: 1 }).withMessage("Description is required"),
    body("date").isISO8601().withMessage("Valid date is required"),
  ],
  async (req, res) => {
    try {
      const errors = validationResult(req)
      if (!errors.isEmpty()) {
        return res.status(400).json({ errors: errors.array() })
      }

      const { type, amount, category, description, date } = req.body

      const transaction = new Transaction({
        user: req.user._id,
        type,
        amount: Number.parseFloat(amount),
        category,
        description,
        date: new Date(date),
      })

      await transaction.save()
      res.status(201).json(transaction)
    } catch (error) {
      console.error(error)
      res.status(500).json({ message: "Server error" })
    }
  },
)

// Update transaction
router.put(
  "/:id",
  [
    auth,
    body("type").optional().isIn(["income", "expense"]).withMessage("Type must be income or expense"),
    body("amount").optional().isNumeric().isFloat({ min: 0.01 }).withMessage("Amount must be a positive number"),
    body("category").optional().trim().isLength({ min: 1 }).withMessage("Category is required"),
    body("description").optional().trim().isLength({ min: 1 }).withMessage("Description is required"),
    body("date").optional().isISO8601().withMessage("Valid date is required"),
  ],
  async (req, res) => {
    try {
      const errors = validationResult(req)
      if (!errors.isEmpty()) {
        return res.status(400).json({ errors: errors.array() })
      }

      const transaction = await Transaction.findOne({
        _id: req.params.id,
        user: req.user._id,
      })

      if (!transaction) {
        return res.status(404).json({ message: "Transaction not found" })
      }

      const updates = req.body
      Object.keys(updates).forEach((key) => {
        if (key === "amount") {
          transaction[key] = Number.parseFloat(updates[key])
        } else if (key === "date") {
          transaction[key] = new Date(updates[key])
        } else {
          transaction[key] = updates[key]
        }
      })

      await transaction.save()
      res.json(transaction)
    } catch (error) {
      console.error(error)
      res.status(500).json({ message: "Server error" })
    }
  },
)

// Delete transaction
router.delete("/:id", auth, async (req, res) => {
  try {
    const transaction = await Transaction.findOneAndDelete({
      _id: req.params.id,
      user: req.user._id,
    })

    if (!transaction) {
      return res.status(404).json({ message: "Transaction not found" })
    }

    res.json({ message: "Transaction deleted successfully" })
  } catch (error) {
    console.error(error)
    res.status(500).json({ message: "Server error" })
  }
})

// Get transaction statistics
router.get("/stats", auth, async (req, res) => {
  try {
    const transactions = await Transaction.find({ user: req.user._id })

    const totalIncome = transactions.filter((t) => t.type === "income").reduce((sum, t) => sum + t.amount, 0)

    const totalExpenses = transactions.filter((t) => t.type === "expense").reduce((sum, t) => sum + t.amount, 0)

    const balance = totalIncome - totalExpenses

    // Group expenses by category
    const expensesByCategory = transactions
      .filter((t) => t.type === "expense")
      .reduce((acc, t) => {
        acc[t.category] = (acc[t.category] || 0) + t.amount
        return acc
      }, {})

    res.json({
      totalIncome,
      totalExpenses,
      balance,
      transactionCount: transactions.length,
      expensesByCategory,
    })
  } catch (error) {
    console.error(error)
    res.status(500).json({ message: "Server error" })
  }
})

// Get monthly summary
router.get("/monthly-summary", auth, async (req, res) => {
  try {
    const { year, month } = req.query
    const currentDate = new Date()
    const targetYear = year ? Number.parseInt(year) : currentDate.getFullYear()
    const targetMonth = month ? Number.parseInt(month) - 1 : currentDate.getMonth()

    const startDate = new Date(targetYear, targetMonth, 1)
    const endDate = new Date(targetYear, targetMonth + 1, 0)

    const transactions = await Transaction.find({
      user: req.user._id,
      date: {
        $gte: startDate,
        $lte: endDate,
      },
    })

    const income = transactions.filter((t) => t.type === "income").reduce((sum, t) => sum + t.amount, 0)

    const expenses = transactions.filter((t) => t.type === "expense").reduce((sum, t) => sum + t.amount, 0)

    // Get user budget
    const user = await User.findById(req.user._id)
    const budget = user.budget || 0

    // Calculate insights
    const previousMonth = new Date(targetYear, targetMonth - 1, 1)
    const previousMonthEnd = new Date(targetYear, targetMonth, 0)

    const previousTransactions = await Transaction.find({
      user: req.user._id,
      date: {
        $gte: previousMonth,
        $lte: previousMonthEnd,
      },
    })

    const previousExpenses = previousTransactions
      .filter((t) => t.type === "expense")
      .reduce((sum, t) => sum + t.amount, 0)

    const expenseChange = previousExpenses > 0 ? ((expenses - previousExpenses) / previousExpenses) * 100 : 0

    // Top category
    const expensesByCategory = transactions
      .filter((t) => t.type === "expense")
      .reduce((acc, t) => {
        acc[t.category] = (acc[t.category] || 0) + t.amount
        return acc
      }, {})

    const topCategory = Object.entries(expensesByCategory).sort(([, a], [, b]) => b - a)[0]

    res.json({
      month: targetMonth + 1,
      year: targetYear,
      income,
      expenses,
      balance: income - expenses,
      budget,
      budgetUsed: budget > 0 ? (expenses / budget) * 100 : 0,
      budgetRemaining: Math.max(0, budget - expenses),
      insights: {
        expenseChange: Math.round(expenseChange * 100) / 100,
        topCategory: topCategory
          ? {
              name: topCategory[0],
              amount: topCategory[1],
            }
          : null,
      },
    })
  } catch (error) {
    console.error(error)
    res.status(500).json({ message: "Server error" })
  }
})

module.exports = router

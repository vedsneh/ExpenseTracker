const express = require("express")
const { body, validationResult } = require("express-validator")
const RecurringTransaction = require("../models/RecurringTransaction")
const Transaction = require("../models/Transaction")
const auth = require("../middleware/auth")

const router = express.Router()

// Get all recurring transactions for user
router.get("/", auth, async (req, res) => {
  try {
    const recurringTransactions = await RecurringTransaction.find({
      user: req.user._id,
    }).sort({ createdAt: -1 })

    res.json(recurringTransactions)
  } catch (error) {
    console.error(error)
    res.status(500).json({ message: "Server error" })
  }
})

// Create new recurring transaction
router.post(
  "/",
  [
    auth,
    body("type").isIn(["income", "expense"]).withMessage("Type must be income or expense"),
    body("amount").isNumeric().isFloat({ min: 0.01 }).withMessage("Amount must be a positive number"),
    body("category").trim().isLength({ min: 1 }).withMessage("Category is required"),
    body("description").trim().isLength({ min: 1 }).withMessage("Description is required"),
    body("frequency").isIn(["daily", "weekly", "monthly", "yearly"]).withMessage("Invalid frequency"),
    body("startDate").isISO8601().withMessage("Valid start date is required"),
  ],
  async (req, res) => {
    try {
      const errors = validationResult(req)
      if (!errors.isEmpty()) {
        return res.status(400).json({ errors: errors.array() })
      }

      const { type, amount, category, description, frequency, startDate, endDate } = req.body

      const recurringTransaction = new RecurringTransaction({
        user: req.user._id,
        type,
        amount: Number.parseFloat(amount),
        category,
        description,
        frequency,
        startDate: new Date(startDate),
        endDate: endDate ? new Date(endDate) : null,
      })

      await recurringTransaction.save()
      res.status(201).json(recurringTransaction)
    } catch (error) {
      console.error(error)
      res.status(500).json({ message: "Server error" })
    }
  },
)

// Update recurring transaction
router.put(
  "/:id",
  [
    auth,
    body("type").optional().isIn(["income", "expense"]).withMessage("Type must be income or expense"),
    body("amount").optional().isNumeric().isFloat({ min: 0.01 }).withMessage("Amount must be a positive number"),
    body("category").optional().trim().isLength({ min: 1 }).withMessage("Category is required"),
    body("description").optional().trim().isLength({ min: 1 }).withMessage("Description is required"),
    body("frequency").optional().isIn(["daily", "weekly", "monthly", "yearly"]).withMessage("Invalid frequency"),
  ],
  async (req, res) => {
    try {
      const errors = validationResult(req)
      if (!errors.isEmpty()) {
        return res.status(400).json({ errors: errors.array() })
      }

      const recurringTransaction = await RecurringTransaction.findOne({
        _id: req.params.id,
        user: req.user._id,
      })

      if (!recurringTransaction) {
        return res.status(404).json({ message: "Recurring transaction not found" })
      }

      const updates = req.body
      Object.keys(updates).forEach((key) => {
        if (key === "amount") {
          recurringTransaction[key] = Number.parseFloat(updates[key])
        } else if (key === "startDate" || key === "endDate") {
          recurringTransaction[key] = updates[key] ? new Date(updates[key]) : null
        } else {
          recurringTransaction[key] = updates[key]
        }
      })

      await recurringTransaction.save()
      res.json(recurringTransaction)
    } catch (error) {
      console.error(error)
      res.status(500).json({ message: "Server error" })
    }
  },
)

// Delete recurring transaction
router.delete("/:id", auth, async (req, res) => {
  try {
    const recurringTransaction = await RecurringTransaction.findOneAndDelete({
      _id: req.params.id,
      user: req.user._id,
    })

    if (!recurringTransaction) {
      return res.status(404).json({ message: "Recurring transaction not found" })
    }

    res.json({ message: "Recurring transaction deleted successfully" })
  } catch (error) {
    console.error(error)
    res.status(500).json({ message: "Server error" })
  }
})

// Process recurring transactions (should be called by a cron job)
router.post("/process", auth, async (req, res) => {
  try {
    const now = new Date()
    const recurringTransactions = await RecurringTransaction.find({
      user: req.user._id,
      isActive: true,
      startDate: { $lte: now },
      $or: [{ endDate: null }, { endDate: { $gte: now } }],
    })

    let processedCount = 0

    for (const recurring of recurringTransactions) {
      const shouldProcess = shouldProcessRecurring(recurring, now)

      if (shouldProcess) {
        // Create new transaction
        const transaction = new Transaction({
          user: recurring.user,
          type: recurring.type,
          amount: recurring.amount,
          category: recurring.category,
          description: `${recurring.description} (Recurring)`,
          date: now,
        })

        await transaction.save()

        // Update last processed date
        recurring.lastProcessed = now
        await recurring.save()

        processedCount++
      }
    }

    res.json({ message: `Processed ${processedCount} recurring transactions` })
  } catch (error) {
    console.error(error)
    res.status(500).json({ message: "Server error" })
  }
})

function shouldProcessRecurring(recurring, now) {
  if (!recurring.lastProcessed) {
    return true
  }

  const lastProcessed = new Date(recurring.lastProcessed)
  const diffInDays = Math.floor((now - lastProcessed) / (1000 * 60 * 60 * 24))

  switch (recurring.frequency) {
    case "daily":
      return diffInDays >= 1
    case "weekly":
      return diffInDays >= 7
    case "monthly":
      return diffInDays >= 30
    case "yearly":
      return diffInDays >= 365
    default:
      return false
  }
}

module.exports = router

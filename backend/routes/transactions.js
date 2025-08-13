const express = require('express');
const { body, validationResult } = require('express-validator');
const Transaction = require('../models/Transaction');
const auth = require('../middleware/auth');

const router = express.Router();

// Get all transactions for user
router.get('/', auth, async (req, res) => {
  try {
    const transactions = await Transaction.find({ user: req.user._id })
      .sort({ date: -1 });

    // Convert cents back to normal currency for frontend
    const formatted = transactions.map(t => ({
      ...t.toObject(),
      amount: t.amount / 100
    }));

    res.json(formatted);
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Server error' });
  }
});

// Create new transaction
router.post('/', [
  auth,
  body('type').isIn(['income', 'expense']).withMessage('Type must be income or expense'),
  body('amount').isNumeric().isFloat({ min: 0.01 }).withMessage('Amount must be a positive number'),
  body('category').trim().isLength({ min: 1 }).withMessage('Category is required'),
  body('description').trim().isLength({ min: 1 }).withMessage('Description is required'),
  body('date').isISO8601().withMessage('Valid date is required')
], async (req, res) => {
  try {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ errors: errors.array() });
    }

    const { type, amount, category, description, date } = req.body;

    const transaction = new Transaction({
      user: req.user._id,
      type,
      amount: Math.round(parseFloat(amount) * 100), // store in cents
      category,
      description,
      date: new Date(date)
    });

    await transaction.save();
    res.status(201).json({
      ...transaction.toObject(),
      amount: transaction.amount / 100
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Server error' });
  }
});

// Update transaction
router.put('/:id', [
  auth,
  body('type').optional().isIn(['income', 'expense']).withMessage('Type must be income or expense'),
  body('amount').optional().isNumeric().isFloat({ min: 0.01 }).withMessage('Amount must be a positive number'),
  body('category').optional().trim().isLength({ min: 1 }).withMessage('Category is required'),
  body('description').optional().trim().isLength({ min: 1 }).withMessage('Description is required'),
  body('date').optional().isISO8601().withMessage('Valid date is required')
], async (req, res) => {
  try {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ errors: errors.array() });
    }

    const transaction = await Transaction.findOne({
      _id: req.params.id,
      user: req.user._id
    });

    if (!transaction) {
      return res.status(404).json({ message: 'Transaction not found' });
    }

    const updates = req.body;
    Object.keys(updates).forEach(key => {
      if (key === 'amount') {
        transaction[key] = Math.round(parseFloat(updates[key]) * 100); // store in cents
      } else if (key === 'date') {
        transaction[key] = new Date(updates[key]);
      } else {
        transaction[key] = updates[key];
      }
    });

    await transaction.save();
    res.json({
      ...transaction.toObject(),
      amount: transaction.amount / 100
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Server error' });
  }
});

// Delete transaction
router.delete('/:id', auth, async (req, res) => {
  try {
    const transaction = await Transaction.findOneAndDelete({
      _id: req.params.id,
      user: req.user._id
    });

    if (!transaction) {
      return res.status(404).json({ message: 'Transaction not found' });
    }

    res.json({ message: 'Transaction deleted successfully' });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Server error' });
  }
});

// Get transaction statistics
router.get('/stats', auth, async (req, res) => {
  try {
    const transactions = await Transaction.find({ user: req.user._id });

    const totalIncomeCents = transactions
      .filter(t => t.type === 'income')
      .reduce((sum, t) => sum + t.amount, 0);

    const totalExpensesCents = transactions
      .filter(t => t.type === 'expense')
      .reduce((sum, t) => sum + t.amount, 0);

    const expensesByCategoryCents = transactions
      .filter(t => t.type === 'expense')
      .reduce((acc, t) => {
        acc[t.category] = (acc[t.category] || 0) + t.amount;
        return acc;
      }, {});

    res.json({
      totalIncome: totalIncomeCents / 100,
      totalExpenses: totalExpensesCents / 100,
      balance: (totalIncomeCents - totalExpensesCents) / 100,
      transactionCount: transactions.length,
      expensesByCategory: Object.fromEntries(
        Object.entries(expensesByCategoryCents).map(([cat, cents]) => [cat, cents / 100])
      )
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Server error' });
  }
});

module.exports = router;

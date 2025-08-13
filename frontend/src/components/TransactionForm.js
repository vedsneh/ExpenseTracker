import React, { useState } from 'react';
import { useTransactions } from '../contexts/TransactionContext';

const incomeCategories = [
  'Salary',
  'Freelance',
  'Business',
  'Investment',
  'Rental',
  'Other'
];

const expenseCategories = [
  'Food',
  'Transportation',
  'Housing',
  'Utilities',
  'Healthcare',
  'Entertainment',
  'Shopping',
  'Education',
  'Travel',
  'Other'
];

const TransactionForm = ({ type, onSuccess, onCancel, transaction = null }) => {
  const { addTransaction, updateTransaction } = useTransactions();
  const [loading, setLoading] = useState(false);
  
  const [formData, setFormData] = useState({
    amount: transaction?.amount || '',
    category: transaction?.category || '',
    description: transaction?.description || '',
    date: transaction?.date ? new Date(transaction.date).toISOString().split('T')[0] : new Date().toISOString().split('T')[0]
  });

  const categories = type === 'income' ? incomeCategories : expenseCategories;
  const isEditing = !!transaction;

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);

    const transactionData = {
      ...formData,
      type,
      amount: parseFloat(formData.amount)
    };

    let result;
    if (isEditing) {
      result = await updateTransaction(transaction._id, transactionData);
    } else {
      result = await addTransaction(transactionData);
    }

    if (result.success) {
      onSuccess();
    }

    setLoading(false);
  };

  return (
    <div className="card" style={{ padding: '1.5rem' }}>
      <h3 style={{ fontSize: '1.125rem', fontWeight: '600', color: '#1e293b', marginBottom: '1rem' }}>
        {isEditing ? `Edit ${type}` : `Add New ${type}`}
      </h3>

      <form onSubmit={handleSubmit}>
        <div className="grid md:grid-cols-2" style={{ marginBottom: '1rem' }}>
          <div className="form-group">
            <label htmlFor="amount" className="form-label">Amount</label>
            <input
              type="number"
              id="amount"
              name="amount"
              className="form-input"
              placeholder="0.00"
              step="0.01"
              min="0.01"
              value={formData.amount}
              onChange={handleChange}
              required
            />
          </div>

          <div className="form-group">
            <label htmlFor="category" className="form-label">Category</label>
            <select
              id="category"
              name="category"
              className="form-select"
              value={formData.category}
              onChange={handleChange}
              required
            >
              <option value="">Select category</option>
              {categories.map((category) => (
                <option key={category} value={category}>
                  {category}
                </option>
              ))}
            </select>
          </div>
        </div>

        <div className="form-group">
          <label htmlFor="description" className="form-label">Description</label>
          <textarea
            id="description"
            name="description"
            className="form-textarea"
            placeholder="Enter description..."
            value={formData.description}
            onChange={handleChange}
            required
          />
        </div>

        <div className="form-group">
          <label htmlFor="date" className="form-label">Date</label>
          <input
            type="date"
            id="date"
            name="date"
            className="form-input"
            value={formData.date}
            onChange={handleChange}
            required
          />
        </div>

        <div style={{ display: 'flex', gap: '1rem', justifyContent: 'flex-end' }}>
          <button
            type="button"
            onClick={onCancel}
            className="btn btn-secondary"
          >
            Cancel
          </button>
          <button
            type="submit"
            className="btn btn-primary"
            disabled={loading}
          >
            {loading ? (
              <>
                <div className="spinner" style={{ marginRight: '0.5rem' }}></div>
                {isEditing ? 'Updating...' : 'Adding...'}
              </>
            ) : (
              isEditing ? 'Update' : 'Add'
            )}
          </button>
        </div>
      </form>
    </div>
  );
};

export default TransactionForm;

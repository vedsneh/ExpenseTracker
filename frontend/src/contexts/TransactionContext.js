import React, { createContext, useContext, useState, useEffect } from 'react';
import axios from 'axios';
import toast from 'react-hot-toast';
import { useAuth } from './AuthContext';

const TransactionContext = createContext();

export const useTransactions = () => {
  const context = useContext(TransactionContext);
  if (!context) {
    throw new Error('useTransactions must be used within a TransactionProvider');
  }
  return context;
};

export const TransactionProvider = ({ children }) => {
  const [transactions, setTransactions] = useState([]);
  const [stats, setStats] = useState({
    totalIncome: 0,
    totalExpenses: 0,
    balance: 0,
    transactionCount: 0,
    expensesByCategory: {}
  });
  const [loading, setLoading] = useState(false);
  const { isAuthenticated } = useAuth();

  // Fetch transactions
  const fetchTransactions = async () => {
    if (!isAuthenticated) return;
    
    setLoading(true);
    try {
      const response = await axios.get('/api/transactions');
      setTransactions(response.data);
    } catch (error) {
      toast.error('Failed to fetch transactions');
    } finally {
      setLoading(false);
    }
  };

  // Fetch statistics
  const fetchStats = async () => {
    if (!isAuthenticated) return;
    
    try {
      const response = await axios.get('/api/transactions/stats');
      setStats(response.data);
    } catch (error) {
      toast.error('Failed to fetch statistics');
    }
  };

  // Add transaction
  const addTransaction = async (transactionData) => {
    try {
      const response = await axios.post('/api/transactions', transactionData);
      setTransactions(prev => [response.data, ...prev]);
      fetchStats(); // Refresh stats
      toast.success(`${transactionData.type === 'income' ? 'Income' : 'Expense'} added successfully!`);
      return { success: true };
    } catch (error) {
      const message = error.response?.data?.message || 'Failed to add transaction';
      toast.error(message);
      return { success: false, message };
    }
  };

  // Update transaction
  const updateTransaction = async (id, transactionData) => {
    try {
      const response = await axios.put(`/api/transactions/${id}`, transactionData);
      setTransactions(prev => 
        prev.map(t => t._id === id ? response.data : t)
      );
      fetchStats(); // Refresh stats
      toast.success('Transaction updated successfully!');
      return { success: true };
    } catch (error) {
      const message = error.response?.data?.message || 'Failed to update transaction';
      toast.error(message);
      return { success: false, message };
    }
  };

  // Delete transaction
  const deleteTransaction = async (id) => {
    try {
      await axios.delete(`/api/transactions/${id}`);
      setTransactions(prev => prev.filter(t => t._id !== id));
      fetchStats(); // Refresh stats
      toast.success('Transaction deleted successfully!');
      return { success: true };
    } catch (error) {
      const message = error.response?.data?.message || 'Failed to delete transaction';
      toast.error(message);
      return { success: false, message };
    }
  };

  // Get transactions by type
  const getTransactionsByType = (type) => {
    return transactions.filter(t => t.type === type);
  };

  // Get recent transactions
  const getRecentTransactions = (limit = 5) => {
    return transactions
      .sort((a, b) => new Date(b.date) - new Date(a.date))
      .slice(0, limit);
  };

  // Export transactions to CSV
  const exportToCSV = (type = 'all') => {
    let dataToExport = transactions;
    
    if (type !== 'all') {
      dataToExport = transactions.filter(t => t.type === type);
    }

    const csvContent = [
      ['Date', 'Type', 'Category', 'Description', 'Amount'],
      ...dataToExport.map(t => [
        new Date(t.date).toLocaleDateString(),
        t.type,
        t.category,
        t.description,
        t.amount
      ])
    ].map(row => row.join(',')).join('\n');

    const blob = new Blob([csvContent], { type: 'text/csv' });
    const url = window.URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `${type}-transactions.csv`;
    a.click();
    window.URL.revokeObjectURL(url);
    
    toast.success('Export completed!');
  };

  // Fetch data when authenticated
  useEffect(() => {
    if (isAuthenticated) {
      fetchTransactions();
      fetchStats();
    } else {
      setTransactions([]);
      setStats({
        totalIncome: 0,
        totalExpenses: 0,
        balance: 0,
        transactionCount: 0,
        expensesByCategory: {}
      });
    }
  }, [isAuthenticated]);

  const value = {
    transactions,
    stats,
    loading,
    fetchTransactions,
    fetchStats,
    addTransaction,
    updateTransaction,
    deleteTransaction,
    getTransactionsByType,
    getRecentTransactions,
    exportToCSV
  };

  return (
    <TransactionContext.Provider value={value}>
      {children}
    </TransactionContext.Provider>
  );
};


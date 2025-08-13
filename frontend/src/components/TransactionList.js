import React, { useState } from 'react';
import { useTransactions } from '../contexts/TransactionContext';
import TransactionForm from './TransactionForm';
import { TrendingUp, TrendingDown, Trash2, Edit } from 'lucide-react';

const TransactionList = ({ transactions, type, title }) => {
  const { deleteTransaction } = useTransactions();
  const [editingTransaction, setEditingTransaction] = useState(null);

  const handleDelete = async (id) => {
    if (window.confirm('Are you sure you want to delete this transaction?')) {
      await deleteTransaction(id);
    }
  };

  const handleEdit = (transaction) => {
    setEditingTransaction(transaction);
  };

  const handleEditSuccess = () => {
    setEditingTransaction(null);
  };

  const handleEditCancel = () => {
    setEditingTransaction(null);
  };

  if (editingTransaction) {
    return (
      <TransactionForm
        type={type}
        transaction={editingTransaction}
        onSuccess={handleEditSuccess}
        onCancel={handleEditCancel}
      />
    );
  }

  return (
    <div className="card" style={{ padding: '1.5rem' }}>
      <h3 style={{ fontSize: '1.125rem', fontWeight: '600', color: '#1e293b', marginBottom: '1rem' }}>
        {title}
      </h3>

      {transactions.length === 0 ? (
        <div style={{ textAlign: 'center', padding: '2rem', color: '#64748b' }}>
          <p>No {type} records yet. Add your first {type}!</p>
        </div>
      ) : (
        <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
          {transactions.map((transaction) => {
            const isIncome = transaction.type === 'income';
            const Icon = isIncome ? TrendingUp : TrendingDown;
            
            return (
              <div
                key={transaction._id}
                className="group"
                style={{
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'space-between',
                  padding: '1rem',
                  border: '1px solid #e2e8f0',
                  borderRadius: '8px',
                  transition: 'background-color 0.2s'
                }}
                onMouseEnter={(e) => {
                  e.currentTarget.style.backgroundColor = '#f8fafc';
                }}
                onMouseLeave={(e) => {
                  e.currentTarget.style.backgroundColor = 'transparent';
                }}
              >
                <div style={{ display: 'flex', alignItems: 'center', gap: '1rem', flex: 1 }}>
                  <div style={{ 
                    padding: '0.5rem', 
                    backgroundColor: isIncome ? '#dcfce7' : '#fee2e2', 
                    borderRadius: '50%',
                    color: isIncome ? '#16a34a' : '#dc2626'
                  }}>
                    <Icon size={16} />
                  </div>
                  <div style={{ flex: 1 }}>
                    <h4 style={{ fontSize: '0.875rem', fontWeight: '500', color: '#1e293b', marginBottom: '0.25rem' }}>
                      {transaction.description}
                    </h4>
                    <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                      <span style={{ 
                        fontSize: '0.75rem', 
                        padding: '0.125rem 0.5rem', 
                        backgroundColor: '#f1f5f9', 
                        borderRadius: '9999px',
                        color: '#64748b'
                      }}>
                        {transaction.category}
                      </span>
                      <span style={{ fontSize: '0.75rem', color: '#64748b' }}>
                        {new Date(transaction.date).toLocaleDateString()}
                      </span>
                    </div>
                  </div>
                </div>

                <div style={{ display: 'flex', alignItems: 'center', gap: '1rem' }}>
                  <span style={{ 
                    fontSize: '1rem', 
                    fontWeight: '600',
                    color: isIncome ? '#16a34a' : '#dc2626'
                  }}>
                    {isIncome ? '+' : '-'}${transaction.amount.toLocaleString('en-US', { minimumFractionDigits: 2 })}
                  </span>

                  <div style={{ display: 'flex', gap: '0.5rem', opacity: 0 }} className="group-hover:opacity-100" 
                       onMouseEnter={(e) => { e.currentTarget.style.opacity = 1; }}
                       onMouseLeave={(e) => { e.currentTarget.style.opacity = 0; }}>
                    <button
                      onClick={() => handleEdit(transaction)}
                      className="btn btn-secondary"
                      style={{ padding: '0.5rem' }}
                      title="Edit transaction"
                    >
                      <Edit size={14} />
                    </button>
                    <button
                      onClick={() => handleDelete(transaction._id)}
                      className="btn btn-danger"
                      style={{ padding: '0.5rem' }}
                      title="Delete transaction"
                    >
                      <Trash2 size={14} />
                    </button>
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
};

export default TransactionList;

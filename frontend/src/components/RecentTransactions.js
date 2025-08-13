import React from 'react';
import { useTransactions } from '../contexts/TransactionContext';
import { TrendingUp, TrendingDown } from 'lucide-react';

const RecentTransactions = () => {
  const { getRecentTransactions, loading } = useTransactions();
  const recentTransactions = getRecentTransactions(5);

  if (loading) {
    return (
      <div className="card" style={{ padding: '1.5rem' }}>
        <h3 style={{ fontSize: '1.125rem', fontWeight: '600', color: '#1e293b', marginBottom: '1rem' }}>
          Recent Transactions
        </h3>
        <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
          {[...Array(5)].map((_, i) => (
            <div key={i} style={{ display: 'flex', alignItems: 'center', gap: '1rem' }}>
              <div style={{ width: '40px', height: '40px', backgroundColor: '#e5e7eb', borderRadius: '50%' }}></div>
              <div style={{ flex: 1 }}>
                <div style={{ width: '150px', height: '16px', backgroundColor: '#e5e7eb', borderRadius: '4px', marginBottom: '0.5rem' }}></div>
                <div style={{ width: '100px', height: '12px', backgroundColor: '#e5e7eb', borderRadius: '4px' }}></div>
              </div>
              <div style={{ width: '80px', height: '20px', backgroundColor: '#e5e7eb', borderRadius: '4px' }}></div>
            </div>
          ))}
        </div>
      </div>
    );
  }

  return (
    <div className="card" style={{ padding: '1.5rem' }}>
      <h3 style={{ fontSize: '1.125rem', fontWeight: '600', color: '#1e293b', marginBottom: '1rem' }}>
        Recent Transactions
      </h3>
      
      {recentTransactions.length === 0 ? (
        <div style={{ textAlign: 'center', padding: '2rem', color: '#64748b' }}>
          <p>No transactions yet. Add your first transaction!</p>
        </div>
      ) : (
        <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
          {recentTransactions.map((transaction) => {
            const isIncome = transaction.type === 'income';
            const Icon = isIncome ? TrendingUp : TrendingDown;
            
            return (
              <div key={transaction._id} style={{ display: 'flex', alignItems: 'center', gap: '1rem' }}>
                <div style={{ 
                  padding: '0.5rem', 
                  backgroundColor: isIncome ? '#dcfce7' : '#fee2e2', 
                  borderRadius: '50%',
                  color: isIncome ? '#16a34a' : '#dc2626'
                }}>
                  <Icon size={16} />
                </div>
                <div style={{ flex: 1, minWidth: 0 }}>
                  <p style={{ fontSize: '0.875rem', fontWeight: '500', color: '#1e293b', marginBottom: '0.25rem' }}>
                    {transaction.description}
                  </p>
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
                <div style={{ 
                  fontSize: '0.875rem', 
                  fontWeight: '600',
                  color: isIncome ? '#16a34a' : '#dc2626'
                }}>
                  {isIncome ? '+' : '-'}Rs.{transaction.amount.toLocaleString('en-US', { minimumFractionDigits: 2 })}
                </div>
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
};

export default RecentTransactions;

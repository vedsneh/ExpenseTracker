import React from 'react';
import { useTransactions } from '../contexts/TransactionContext';
import { Wallet, TrendingUp, TrendingDown, Receipt } from 'lucide-react';

const StatsCards = () => {
  const { stats, loading } = useTransactions();

  const cards = [
    {
      title: 'Total Balance',
      value: stats.balance,
      icon: Wallet,
      color: stats.balance >= 0 ? '#16a34a' : '#dc2626',
      bgColor: stats.balance >= 0 ? '#dcfce7' : '#fee2e2',
      format: 'currency'
    },
    {
      title: 'Total Income',
      value: stats.totalIncome,
      icon: TrendingUp,
      color: '#16a34a',
      bgColor: '#dcfce7',
      format: 'currency'
    },
    {
      title: 'Total Expenses',
      value: stats.totalExpenses,
      icon: TrendingDown,
      color: '#dc2626',
      bgColor: '#fee2e2',
      format: 'currency'
    },
    {
      title: 'Transactions',
      value: stats.transactionCount,
      icon: Receipt,
      color: '#3b82f6',
      bgColor: '#dbeafe',
      format: 'number'
    }
  ];

  if (loading) {
    return (
      <div className="grid md:grid-cols-2 lg:grid-cols-4">
        {[...Array(4)].map((_, i) => (
          <div key={i} className="card" style={{ padding: '1.5rem' }}>
            <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '1rem' }}>
              <div style={{ width: '100px', height: '16px', backgroundColor: '#e5e7eb', borderRadius: '4px' }}></div>
              <div style={{ width: '40px', height: '40px', backgroundColor: '#e5e7eb', borderRadius: '50%' }}></div>
            </div>
            <div style={{ width: '120px', height: '32px', backgroundColor: '#e5e7eb', borderRadius: '4px' }}></div>
          </div>
        ))}
      </div>
    );
  }

  return (
    <div className="grid md:grid-cols-2 lg:grid-cols-4">
      {cards.map((card) => {
        const Icon = card.icon;
        return (
          <div key={card.title} className="card" style={{ padding: '1.5rem' }}>
            <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '1rem' }}>
              <h3 style={{ fontSize: '0.875rem', fontWeight: '500', color: '#64748b' }}>
                {card.title}
              </h3>
              <div style={{ 
                padding: '0.5rem', 
                backgroundColor: card.bgColor, 
                borderRadius: '50%',
                color: card.color
              }}>
                <Icon size={20} />
              </div>
            </div>
            <p style={{ fontSize: '1.5rem', fontWeight: 'bold', color: card.color }}>
              {card.format === 'currency' 
                ? `$${card.value.toLocaleString('en-US', { minimumFractionDigits: 2 })}`
                : card.value.toLocaleString()
              }
            </p>
          </div>
        );
      })}
    </div>
  );
};

export default StatsCards;

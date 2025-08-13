import React from 'react';
import { useTransactions } from '../contexts/TransactionContext';
import StatsCards from '../components/StatsCards';
import RecentTransactions from '../components/RecentTransactions';
import ExpenseChart from '../components/ExpenseChart';

const Dashboard = () => {
  const { loading } = useTransactions();

  if (loading) {
    return (
      <div style={{ display: 'flex', justifyContent: 'center', alignItems: 'center', height: '50vh' }}>
        <div className="spinner"></div>
      </div>
    );
  }

  return (
    <div className="fade-in">
      <div style={{ marginBottom: '2rem' }}>
        <h1 style={{ fontSize: '2rem', fontWeight: 'bold', color: '#1e293b', marginBottom: '0.5rem' }}>
          Dashboard
        </h1>
        <p style={{ color: '#64748b' }}>
          Overview of your financial activity
        </p>
      </div>
      
      <StatsCards />
      
      <div className="grid lg:grid-cols-2" style={{ marginTop: '2rem' }}>
        <ExpenseChart />
        <RecentTransactions />
      </div>
    </div>
  );
};

export default Dashboard;

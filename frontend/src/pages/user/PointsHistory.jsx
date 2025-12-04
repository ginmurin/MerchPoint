import React, { useState, useEffect } from 'react';
import pointsService from '../../services/pointsService';

const PointsHistory = () => {
  const [transactions, setTransactions] = useState([]);
  const [filteredTransactions, setFilteredTransactions] = useState([]);
  const [activeFilter, setActiveFilter] = useState('All');
  const [currentPoints, setCurrentPoints] = useState(0);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchTransactions();
    
    // Get current user points from localStorage
    const userData = localStorage.getItem('user');
    if (userData) {
      const user = JSON.parse(userData);
      setCurrentPoints(user.pointsBalance || 0);
    }
  }, []);

  useEffect(() => {
    filterTransactions(activeFilter);
  }, [transactions, activeFilter]);

  const fetchTransactions = async () => {
    try {
      setLoading(true);
      const userData = localStorage.getItem('user');
      if (!userData) {
        console.error('No user data found');
        return;
      }

      const user = JSON.parse(userData);
      const data = await pointsService.getUserTransactions(user.userId);
      setTransactions(data);
    } catch (error) {
      console.error('Error fetching transactions:', error);
    } finally {
      setLoading(false);
    }
  };

  const filterTransactions = (filterType) => {
    if (filterType === 'All') {
      setFilteredTransactions(transactions);
    } else {
      setFilteredTransactions(transactions.filter(tx => tx.type === filterType.toUpperCase()));
    }
  };

  const handleFilterClick = (filterType) => {
    setActiveFilter(filterType);
  };

  const formatDateTime = (dateTimeString) => {
    const date = new Date(dateTimeString);
    const dateStr = date.toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' });
    const timeStr = date.toLocaleTimeString('en-US', { hour: 'numeric', minute: '2-digit', hour12: true });
    return { dateStr, timeStr };
  };

  if (loading) {
    return <div className="container">Loading...</div>;
  }

  return (
    <div className="container">
      <h1 className="points-history-title">Points Transaction History</h1>

      <div className="points-history-box">
        <div className="points-history-value">{currentPoints}</div>
        <div className="points-history-label">Current Points Balance</div>
      </div>
      
      <div className="points-history-filter-section">
        <span className="points-history-filter-label">Filter by Type:</span>
        <div className="points-history-filter-buttons">
          <button 
            className={`points-history-filter-btn ${activeFilter === 'All' ? 'active' : ''}`}
            onClick={() => handleFilterClick('All')}
          >
            All
          </button>
          <button 
            className={`points-history-filter-btn ${activeFilter === 'Earned' ? 'active' : ''}`}
            onClick={() => handleFilterClick('Earned')}
          >
            Earned
          </button>
          <button 
            className={`points-history-filter-btn ${activeFilter === 'Redeemed' ? 'active' : ''}`}
            onClick={() => handleFilterClick('Redeemed')}
          >
            Redeemed
          </button>
          <button 
            className={`points-history-filter-btn ${activeFilter === 'Refund' ? 'active' : ''}`}
            onClick={() => handleFilterClick('Refund')}
          >
            Refund
          </button>
        </div>
      </div>

      {loading ? (
        <div className="empty-state">Loading transactions...</div>
      ) : !filteredTransactions || filteredTransactions.length === 0 ? (
        <div className="empty-state">No transactions found</div>
      ) : (
        <table className="table">
          <thead>
            <tr>
              <th>Transaction ID</th>
              <th>Date & Time</th>
              <th>Type</th>
              <th>Description</th>
              <th>Points</th>
              <th>Balance After</th>
            </tr>
          </thead>
          <tbody>
            {filteredTransactions.map((tx) => {
              const { dateStr, timeStr } = formatDateTime(tx.createdAt);
              return (
                <tr key={tx.id}>
                  <td><strong>{tx.code}</strong></td>
                  <td>{dateStr}<br/><span className="points-history-time">{timeStr}</span></td>
                  <td><span className={`points-history-status ${tx.type.toLowerCase()}`}>{tx.type}</span></td>
                  <td>{tx.description}</td>
                  <td>
                    <strong className={tx.points > 0 ? 'points-history-earned' : 'points-history-redeemed'}>
                      {tx.points > 0 ? `+${tx.points}` : tx.points}
                    </strong>
                  </td>
                  <td><strong>{tx.balanceAfter}</strong></td>
                </tr>
              );
            })}
          </tbody>
        </table>
      )}
    </div>
  );
};

export default PointsHistory;
import React from 'react';

// Mock data
const transactions = [
  { id: 'TXN-0015', date: 'Nov 10, 2025', time: '10:30 AM', type: 'REDEEMED', desc: 'Points redeemed for RES-001', points: -50, balance: 150 },
  { id: 'TXN-0014', date: 'Nov 8, 2025', time: '4:20 PM', type: 'EARNED', desc: 'Points earned from RES-002', points: 35, balance: 200 },
  { id: 'TXN-0013', date: 'Nov 5, 2025', time: '2:15 PM', type: 'REFUND', desc: 'Points refunded from RES-003', points: 25, balance: 165 },
];

const PointsHistory = () => {
  return (
    <div className="container">
      <h1 className="points-history-title">Points Transaction History</h1>

      <div className="points-history-box">
        <div className="points-history-value">150</div>
        <div className="points-history-label">Current Points Balance</div>
      </div>
      
      <div className="points-history-filter-section">
        <span className="points-history-filter-label">Filter by Type:</span>
        <div className="points-history-filter-buttons">
          <button className="points-history-filter-btn active">All</button>
          <button className="points-history-filter-btn">Earned</button>
          <button className="points-history-filter-btn">Redeemed</button>
          <button className="points-history-filter-btn">Refund</button>
        </div>
      </div>

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
          {transactions.map((tx) => (
            <tr key={tx.id}>
              <td><strong>{tx.id}</strong></td>
              <td>{tx.date}<span className="points-history-time">{tx.time}</span></td>
              <td><span className={`points-history-status ${tx.type.toLowerCase()}`}>{tx.type}</span></td>
              <td>{tx.desc}</td>
              <td>
                <strong className={tx.points > 0 ? 'points-history-earned' : 'points-history-redeemed'}>
                  {tx.points > 0 ? `+${tx.points}` : tx.points}
                </strong>
              </td>
              <td><strong>{tx.balance}</strong></td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
};

export default PointsHistory;
import React from 'react';
import StatCard from '../../components/common/StatCard';

const Dashboard = () => {
  return (
    <div className="container">
      <h1 className="dashboard-title">My Dashboard</h1>

      <div className="dashboard-points-box">
        <div className="dashboard-points-value">150</div>
        <div className="dashboard-points-label">Available Reward Points</div>
      </div>

      <div className="dashboard-stats-grid">
        <StatCard label="Total Reservations" value="8" color="maroon" />
        <StatCard label="Pending Approval" value="2" color="gold" />
        <StatCard label="Approved" value="5" color="maroon" />
        <StatCard label="Rejected" value="1" color="maroon" />
      </div>

      <h2 className="dashboard-recent-title">Recent Reservations</h2>
      <table className="table">
        <thead>
          <tr>
            <th>Code</th>
            <th>Date</th>
            <th>Items</th>
            <th>Total</th>
            <th>Points</th>
            <th>Status</th>
          </tr>
        </thead>
        <tbody>
          {/* Mock Data */}
          <tr>
            <td><strong>RES-001</strong></td>
            <td>Nov 10, 2025</td>
            <td>4 items</td>
            <td><strong>₱1,050.00</strong></td>
            <td><span className="status-points-used">50 used</span></td>
            <td><span className="status-badge status-pending">Pending</span></td>
          </tr>
          <tr>
            <td><strong>RES-002</strong></td>
            <td>Nov 8, 2025</td>
            <td>2 items</td>
            <td><strong>₱350.00</strong></td>
            <td><span className="status-points-earned">35 earned</span></td>
            <td><span className="status-badge status-approved">Approved</span></td>
          </tr>
          <tr>
            <td><strong>RES-003</strong></td>
            <td>Nov 5, 2025</td>
            <td>1 item</td>
            <td><strong>₱225.00</strong></td>
            <td><span className="status-points-refunded">25 refunded</span></td>
            <td><span className="status-badge status-rejected">Rejected</span></td>
          </tr>
        </tbody>
      </table>
    </div>
  );
};

export default Dashboard;
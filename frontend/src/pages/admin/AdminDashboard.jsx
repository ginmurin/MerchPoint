import React from 'react';
import StatCard from '../../components/common/StatCard';

const AdminDashboard = () => {
  return (
    <div className="container">
      <h1 className="admin-title">Admin Dashboard</h1>

      <div className="dashboard-stats-grid">
        <StatCard label="Total Products" value="156" color="maroon" />
        <StatCard label="Pending Reservations" value="45" color="gold" />
        <StatCard label="Total Users" value="320" color="maroon" />
        <StatCard label="Total Revenue" value="₱125,450" color="maroon" />
      </div>

      <div className="admin-grid-layout">
        <div className="admin-card">
          <h3 className="admin-card-title">📊 Recent Activity</h3>
          <div className="admin-activity-feed">
            <div className="admin-activity-item">
              <div>
                <div className="admin-activity-title">New Reservation - RES-045</div>
                <div className="admin-activity-meta">John Doe placed a reservation</div>
              </div>
              <div className="admin-activity-time">2 min ago</div>
            </div>
            <div className="admin-activity-item">
              <div>
                <div className="admin-activity-title">Low Stock Alert</div>
                <div className="admin-activity-meta">School T-Shirt (Blue) - Only 5 left</div>
              </div>
              <div className="admin-activity-time">15 min ago</div>
            </div>
          </div>
        </div>
        
        <div className="admin-card">
          <h3 className="admin-card-title">⚡ Quick Actions</h3>
          <button className="button button-primary" style={{ width: '100%', marginBottom: '10px' }}>
            ➕ Add New Product
          </button>
          <button className="button button-secondary" style={{ width: '100%' }}>
            ✅ Review Pending Reservations
          </button>
        </div>
      </div>

      <div className="admin-card">
        <h3 className="admin-card-title">🔔 Pending Reservations</h3>
        <table className="table">
          <thead>
            <tr>
              <th>Code</th>
              <th>User</th>
              <th>Date</th>
              <th>Amount</th>
              <th>Action</th>
            </tr>
          </thead>
          <tbody>
            <tr>
              <td><strong>RES-045</strong></td>
              <td>John Doe</td>
              <td>Nov 11, 2025</td>
              <td><strong>₱650.00</strong></td>
              <td>
                <button className="button button-primary" style={{ padding: '6px 12px', fontSize: '11px', marginRight: '5px' }}>Approve</button>
                <button className="button button-secondary" style={{ padding: '6px 12px', fontSize: '11px' }}>Reject</button>
              </td>
            </tr>
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default AdminDashboard;
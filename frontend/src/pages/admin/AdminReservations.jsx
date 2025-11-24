import React from 'react';

const AdminReservations = () => {
  return (
    <div className="container">
      <h1 className="admin-title">Reservation Management</h1>

      <div className="dashboard-stats-grid">
        <StatCard label="Total" value="285" color="maroon" />
        <StatCard label="Pending" value="45" color="gold" />
        <StatCard label="Approved" value="220" color="maroon" />
        <StatCard label="Rejected" value="20" color="maroon" />
      </div>

      <div className="products-search-section">
        <div className="products-search-bar">
          <input className="input" placeholder="Search by code or user name..." />
          <button className="button button-primary">Search</button>
        </div>
        <div className="products-filter-bar">
          <span className="products-filter-label">Filter by Status:</span>
          <button className="products-filter-btn active">All</button>
          <button className="products-filter-btn">Pending</button>
          <button className="products-filter-btn">Approved</button>
          <button className="products-filter-btn">Rejected</button>
        </div>
      </div>

      <table className="table">
        <thead>
          <tr>
            <th>Code</th>
            <th>User</th>
            <th>Date</th>
            <th>Total</th>
            <th>Points</th>
            <th>Status</th>
            <th>Actions</th>
          </tr>
        </thead>
        <tbody>
          <tr>
            <td><strong>RES-045</strong></td>
            <td>John Doe<br/><span className="table-time">john.doe@email.com</span></td>
            <td>Nov 11, 2025</td>
            <td><strong>₱650.00</strong></td>
            <td><span className="status-points-used">-50</span> / <span className="status-points-earned">+65</span></td>
            <td><span className="status-badge status-pending">Pending</span></td>
            <td>
              <button className="button button-primary" style={{ padding: '6px 12px', fontSize: '11px', marginRight: '5px' }}>Approve</button>
              <button className="button button-secondary" style={{ padding: '6px 12px', fontSize: '11px' }}>Reject</button>
            </td>
          </tr>
          <tr style={{ background: '#d4edda' }}>
            <td><strong>RES-042</strong></td>
            <td>Sarah Williams<br/><span className="table-time">sarah.w@email.com</span></td>
            <td>Nov 10, 2025</td>
            <td><strong>₱800.00</strong></td>
            <td><span className="status-points-used">-50</span> / <span className="status-points-earned">+80</span></td>
            <td><span className="status-badge status-approved">Approved</span></td>
            <td>
              <button className="button button-secondary" style={{ padding: '6px 12px', fontSize: '11px' }}>View</button>
            </td>
          </tr>
        </tbody>
      </table>
    </div>
  );
};

export default AdminReservations;
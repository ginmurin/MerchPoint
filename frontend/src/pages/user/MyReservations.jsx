import React from 'react';
import { Link } from 'react-router-dom';

const MyReservations = () => {
  return (
    <div className="container">
      <h1 className="my-reservations-title">My Reservations</h1>

      <div className="products-filter-bar" style={{ marginBottom: '2rem' }}>
        <span className="products-filter-label">Filter by:</span>
        <button className="products-filter-btn active">All</button>
        <button className="products-filter-btn">Pending</button>
        <button className="products-filter-btn">Approved</button>
        <button className="products-filter-btn">Rejected</button>
      </div>

      <table className="table">
        <thead>
          <tr>
            <th>Code</th>
            <th>Date Created</th>
            <th>Items</th>
            <th>Total Amount</th>
            <th>Points</th>
            <th>Status</th>
            <th>Action</th>
          </tr>
        </thead>
        <tbody>
          {/* Mock Data */}
          <tr>
            <td><strong>RES-001</strong></td>
            <td>Nov 10, 2025<br/><span className="table-time">10:30 AM</span></td>
            <td>4 items</td>
            <td><strong>₱1,050.00</strong></td>
            <td><span className="status-points-used">-50</span> / <span className="status-points-earned">+110</span></td>
            <td><span className="status-badge status-pending">Pending</span></td>
            <td>
              <Link to="/reservations/1" className="button button-secondary" style={{ padding: '8px 16px', fontSize: '12px' }}>
                View Details
              </Link>
            </td>
          </tr>
          <tr>
            <td><strong>RES-002</strong></td>
            <td>Nov 8, 2025<br/><span className="table-time">2:15 PM</span></td>
            <td>2 items</td>
            <td><strong>₱350.00</strong></td>
            <td><span className="status-points-earned">+35</span></td>
            <td><span className="status-badge status-approved">Approved</span></td>
            <td>
              <Link to="/reservations/2" className="button button-secondary" style={{ padding: '8px 16px', fontSize: '12px' }}>
                View Details
              </Link>
            </td>
          </tr>
          <tr>
            <td><strong>RES-003</strong></td>
            <td>Nov 5, 2025<br/><span className="table-time">11:00 AM</span></td>
            <td>1 item</td>
            <td><strong>₱225.00</strong></td>
            <td><span className="status-points-refunded">+25 (Refunded)</span></td>
            <td><span className="status-badge status-rejected">Rejected</span></td>
            <td>
              <Link to="/reservations/3" className="button button-secondary" style={{ padding: '8px 16px', fontSize: '12px' }}>
                View Details
              </Link>
            </td>
          </tr>
        </tbody>
      </table>
    </div>
  );
};

export default MyReservations;
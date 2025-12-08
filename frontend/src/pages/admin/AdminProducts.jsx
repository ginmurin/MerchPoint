import React from 'react';

const AdminProducts = () => {
  return (
    <div className="container">
      <div className="admin-page-header">
        <h1 className="admin-title">Product Management</h1>
        <button className="button button-primary">Add New Product</button>
      </div>

      <div className="products-search-section">
        <div className="products-search-bar">
          <input className="input" placeholder="Search products by name or ID..." />
          <button className="button button-primary">Search</button>
        </div>
        <div className="products-filter-bar">
          <span className="products-filter-label">Filter by:</span>
          <button className="products-filter-btn active">All</button>
          <button className="products-filter-btn">Low Stock</button>
          <button className="products-filter-btn">Out of Stock</button>
        </div>
      </div>

      <table className="table">
        <thead>
          <tr>
            <th>Product ID</th>
            <th>Name</th>
            <th>Price</th>
            <th>Points</th>
            <th>Stock</th>
            <th>Status</th>
            <th>Actions</th>
          </tr>
        </thead>
        <tbody>
          <tr>
            <td><strong>PRD-001</strong></td>
            <td>School T-Shirt</td>
            <td><strong>₱350.00</strong></td>
            <td>35 pts</td>
            <td><span style={{ color: 'var(--success-green)', fontWeight: 600 }}>50 units</span></td>
            <td><span className="status-badge status-approved">Available</span></td>
            <td>
              <button className="button button-secondary" style={{ padding: '6px 12px', fontSize: '11px', marginRight: '5px' }}>Edit</button>
            </td>
          </tr>
          <tr style={{ background: '#fff8f8' }}>
            <td><strong>PRD-003</strong></td>
            <td>Coffee Mug</td>
            <td><strong>₱150.00</strong></td>
            <td>15 pts</td>
            <td><span style={{ color: 'var(--danger-red)', fontWeight: 600 }}>5 units ⚠️</span></td>
            <td><span className="status-badge status-approved">Available</span></td>
            <td>
              <button className="button button-secondary" style={{ padding: '6px 12px', fontSize: '11px', marginRight: '5px' }}>Edit</button>
            </td>
          </tr>
        </tbody>
      </table>
    </div>
  );
};

export default AdminProducts;
import React, { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import StatCard from '../../components/common/StatCard';
import { api } from '../../services/api';

const AdminDashboard = () => {
  const navigate = useNavigate();
  const [stats, setStats] = useState({
    totalProducts: 0,
    totalCategories: 0,
    totalUsers: 0,
    lowStockItems: 0
  });
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchDashboardData();
  }, []);

  const fetchDashboardData = async () => {
    try {
      setLoading(true);
      const [productsRes, categoriesRes, usersRes] = await Promise.all([
        api.get('product'),
        api.get('category'),
        api.get('user')
      ]);

      const lowStock = productsRes.filter(p => p.stockQuantity < 10).length;

      setStats({
        totalProducts: productsRes.length,
        totalCategories: categoriesRes.length,
        totalUsers: usersRes.length,
        lowStockItems: lowStock
      });

      // Get products with low stock for display
      setProducts(productsRes.filter(p => p.stockQuantity < 10).slice(0, 5));
    } catch (error) {
      console.error('Error fetching dashboard data:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleLogout = () => {
    localStorage.removeItem('user');
    navigate('/login');
  };

  return (
    <div className="container">
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '2rem' }}>
        <h1 className="admin-title">Admin Dashboard</h1>
        <div style={{ display: 'flex', gap: '1rem' }}>
          <Link to="/admin/products" className="button button-primary">
            ➕ Manage Products
          </Link>
          <Link to="/admin/user-list" className="button button-secondary">
            👥 View Users
          </Link>
          <button onClick={handleLogout} className="button button-secondary">
            🚪 Logout
          </button>
        </div>
      </div>

      {loading ? (
        <div style={{ textAlign: 'center', padding: '2rem' }}>Loading...</div>
      ) : (
        <>
          <div className="dashboard-stats-grid">
            <StatCard label="Total Products" value={stats.totalProducts} color="maroon" />
            <StatCard label="Categories" value={stats.totalCategories} color="gold" />
            <StatCard label="Total Users" value={stats.totalUsers} color="maroon" />
            <StatCard label="Low Stock Items" value={stats.lowStockItems} color="maroon" />
          </div>
        </>
      )}

      {!loading && (
        <>
          <div className="admin-grid-layout">
            <div className="admin-card">
              <h3 className="admin-card-title">⚠️ Low Stock Alerts</h3>
              <div className="admin-activity-feed">
                {products.length > 0 ? (
                  products.map(product => (
                    <div key={product.productId} className="admin-activity-item">
                      <div>
                        <div className="admin-activity-title">{product.productName}</div>
                        <div className="admin-activity-meta">Only {product.stockQuantity} left in stock</div>
                      </div>
                      <div className="admin-activity-time">
                        {product.stockQuantity < 5 ? (
                          <span style={{ color: '#d32f2f', fontWeight: 'bold' }}>Critical</span>
                        ) : (
                          <span style={{ color: '#f57c00' }}>Low</span>
                        )}
                      </div>
                    </div>
                  ))
                ) : (
                  <div style={{ padding: '1rem', textAlign: 'center', color: '#666' }}>
                    All products have sufficient stock
                  </div>
                )}
              </div>
            </div>
          
            <div className="admin-card">
              <h3 className="admin-card-title">⚡ Quick Actions</h3>
              <Link to="/admin/products" className="button button-primary" style={{ width: '100%', marginBottom: '10px', textAlign: 'center', display: 'block', textDecoration: 'none' }}>
                ➕ Add New Product
              </Link>
              <Link to="/admin/user-list" className="button button-secondary" style={{ width: '100%', textAlign: 'center', display: 'block', textDecoration: 'none' }}>
                👥 View Users
              </Link>
            </div>
          </div>
        </>
      )}
    </div>
  );
};

export default AdminDashboard;
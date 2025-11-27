import React, { useEffect } from 'react';
import { Outlet, useNavigate } from 'react-router-dom';
import Header from '../common/Header';
import { getCurrentUser } from '../../services/authService';

const Layout = () => {
  const navigate = useNavigate();

  useEffect(() => {
    const user = getCurrentUser();
    if (!user) {
      navigate('/login');
    } else if (user.role === 'admin') {
      navigate('/admin/dashboard');
    }
  }, [navigate]);

  return (
    <div className="layout">
      <Header />
      <main className="layout-main-content">
        <Outlet /> {/* Routed pages render here */}
      </main>
    </div>
  );
};

export default Layout;
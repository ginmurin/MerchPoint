import React, { useEffect } from 'react';
import { Outlet, useNavigate } from 'react-router-dom';
import AdminHeader from '../common/AdminHeader';
import { getCurrentUser } from '../../services/authService';

const AdminLayout = () => {
  const navigate = useNavigate();

  useEffect(() => {
    const user = getCurrentUser();
    if (!user) {
      navigate('/login');
    } else if (user.role !== 'admin') {
      navigate('/dashboard');
    }
  }, [navigate]);

  return (
    <div className="layout">
      <AdminHeader />
      <main className="layout-main-content">
        <Outlet /> {/* Admin pages render here */}
      </main>
    </div>
  );
};

export default AdminLayout;
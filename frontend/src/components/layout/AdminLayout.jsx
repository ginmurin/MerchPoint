import React from 'react';
import { Outlet } from 'react-router-dom';
import AdminHeader from '../common/AdminHeader';

const AdminLayout = () => {
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
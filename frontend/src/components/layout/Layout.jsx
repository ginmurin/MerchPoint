import React from 'react';
import { Outlet } from 'react-router-dom';
import Header from '../common/Header';

const Layout = () => {
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
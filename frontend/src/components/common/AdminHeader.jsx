import React from 'react';
import { NavLink, Link } from 'react-router-dom';

const AdminHeader = () => {
  const user = { name: 'Admin User', initials: 'AD' };

  return (
    <header className="header admin-header">
      <div className="header-container">
        <Link to="/admin" className="header-logo">
          MerchPoint <span className="admin-header-tag">Admin</span>
        </Link>
        <nav className="header-nav-menu">
          <NavLink
            to="/admin/dashboard"
            className={({ isActive }) =>
              isActive ? 'header-nav-item active' : 'header-nav-item'
            }
          >
            Dashboard
          </NavLink>
          <NavLink
            to="/admin/products"
            className={({ isActive }) =>
              isActive ? 'header-nav-item active' : 'header-nav-item'
            }
          >
            Products
          </NavLink>
          <NavLink
            to="/admin/reservations"
            className={({ isActive }) =>
              isActive ? 'header-nav-item active' : 'header-nav-item'
            }
          >
            Reservations
          </NavLink>
        </nav>
        <div className="header-user-info">
          <div className="header-user-details">
            <div className="header-user-name">{user.name}</div>
            <div className="admin-header-role">Administrator</div>
          </div>
          <div className="header-user-avatar admin-header-avatar">{user.initials}</div>
        </div>
      </div>
    </header>
  );
};

export default AdminHeader;
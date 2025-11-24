import React, { useState, useEffect } from 'react';
import { NavLink, Link, useNavigate } from 'react-router-dom'; // 1. Import useNavigate
import { logout, getCurrentUser } from '../../services/authService'; // 2. Import logout and getCurrentUser

const Header = () => {
  // 3. Get the real user data
  const [user, setUser] = useState({ name: 'Guest', points: 0, initials: '?' });
  const navigate = useNavigate();

  useEffect(() => {
    const currentUser = getCurrentUser();
    if (currentUser) {
      setUser({
        name: currentUser.name || 'Guest',
        points: currentUser.points || 0,
        initials: currentUser.name ? currentUser.name.charAt(0).toUpperCase() : '?'
      });
    }
  }, []); 

  const handleLogout = () => {
    logout();
    navigate('/login'); // 4. Redirect to login after logout
  };

  return (
    <header className="header">
      <div className="header-container">
        <Link to="/dashboard" className="header-logo">
          MerchPoint
        </Link>
        <nav className="header-nav-menu">
          <NavLink
            to="/dashboard"
            className={({ isActive }) =>
              isActive ? 'header-nav-item active' : 'header-nav-item'
            }
          >
            Dashboard
          </NavLink>
          <NavLink
            to="/products"
            className={({ isActive }) =>
              isActive ? 'header-nav-item active' : 'header-nav-item'
            }
          >
            Products
          </NavLink>
          <NavLink
            to="/reservations"
            className={({ isActive }) =>
              isActive ? 'header-nav-item active' : 'header-nav-item'
            }
          >
            My Reservations
          </NavLink>
          <NavLink
            to="/points"
            className={({ isActive }) =>
              isActive ? 'header-nav-item active' : 'header-nav-item'
            }
          >
            Points History
          </NavLink>
          
          {/* 5. ADD THE LOGOUT BUTTON HERE */}
          <button onClick={handleLogout} className="header-logout-btn">
            Logout
          </button>
        </nav>
        
        <Link to="/profile" className="header-user-info-link">
          <div className="header-user-info">
            <div className="header-user-details">
              <div className="header-user-name">{user.name}</div>
              {/* Only show points if they are logged in */}
              {user.name !== 'Guest' && (
                <div className="header-user-points">⭐ {user.points || 0} Points</div>
              )}
            </div>
            <div className="header-user-avatar">{user.initials}</div>
          </div>
        </Link>

      </div>
    </header>
  );
};

export default Header;
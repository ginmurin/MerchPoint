import React, { useState, useEffect } from 'react';
import { NavLink, Link, useNavigate } from 'react-router-dom';
import { logout, getCurrentUser } from '../../services/authService';
import { getUserById } from '../../services/userService';
import { useCart } from '../../context/CartContext';

const Header = () => {
  const [user, setUser] = useState({ name: 'Guest', points: 0, initials: '?', profileImage: null });
  const navigate = useNavigate();
  const { getCartItemsCount } = useCart();

  useEffect(() => {
    fetchUserData();
  }, []);

  const fetchUserData = async () => {
    const currentUser = getCurrentUser();
    if (currentUser && currentUser.userId) {
      try {
        // Fetch fresh user data from API
        const freshUserData = await getUserById(currentUser.userId);
        const displayName = freshUserData.fullName || freshUserData.name || 'Guest';
        setUser({
          name: displayName,
          points: freshUserData.pointsBalance || 0,
          initials: displayName.charAt(0).toUpperCase(),
          profileImage: freshUserData.profileImage ? `http://localhost:8080/api/upload/profile-image/file/${freshUserData.profileImage}` : null
        });
        
        // Update localStorage with fresh data
        localStorage.setItem('user', JSON.stringify({ ...currentUser, ...freshUserData }));
      } catch (error) {
        console.error('Error fetching user data:', error);
        // Fallback to localStorage data
        const displayName = currentUser.fullName || currentUser.name || 'Guest';
        setUser({
          name: displayName,
          points: currentUser.pointsBalance || 0,
          initials: displayName.charAt(0).toUpperCase(),
          profileImage: currentUser.profileImage ? `http://localhost:8080/api/upload/profile-image/file/${currentUser.profileImage}` : null
        });
      }
    }
  }; 

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
          
          <NavLink
            to="/cart"
            className={({ isActive }) =>
              isActive ? 'header-nav-item active' : 'header-nav-item'
            }
            style={{ position: 'relative' }}
          >
            🛒 Cart
            {getCartItemsCount() > 0 && (
              <span style={{
                position: 'absolute',
                top: '-5px',
                right: '-10px',
                background: '#8B0000',
                color: 'white',
                borderRadius: '50%',
                width: '20px',
                height: '20px',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                fontSize: '12px',
                fontWeight: 'bold'
              }}>
                {getCartItemsCount()}
              </span>
            )}
          </NavLink>
          
          <button onClick={handleLogout} className="header-logout-btn">
            Logout
          </button>
        </nav>
        
        <Link to="/profile" className="header-user-info-link">
          <div className="header-user-info">
            <div className="header-user-details">
              <div className="header-user-name">{user.name}</div>
              {user.name !== 'Guest' && (
                <div className="header-user-points">⭐ {user.points || 0} Points</div>
              )}
            </div>
            <div className="header-user-avatar" style={{
              backgroundImage: user.profileImage ? `url(${user.profileImage})` : 'none',
              backgroundSize: 'cover',
              backgroundPosition: 'center'
            }}>
              {!user.profileImage && user.initials}
            </div>
          </div>
        </Link>

      </div>
    </header>
  );
};

export default Header;
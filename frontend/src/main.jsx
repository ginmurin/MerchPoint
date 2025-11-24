import React from 'react';
import ReactDOM from 'react-dom/client';
import { BrowserRouter } from 'react-router-dom';
import App from './App';
import './App.css'; // Global styles

// Import all page-specific CSS files globally
import './pages/Login.css';
import './pages/Register.css';
import './pages/user/Dashboard.css';
import './pages/user/Products.css';
import './pages/user/ProductDetails.css';
import './pages/user/Cart.css';
import './pages/user/MyReservations.css';
import './pages/user/ReservationDetails.css';
import './pages/user/PointsHistory.css';
import './pages/admin/AdminDashboard.css';
import './pages/admin/AdminProducts.css';
import './pages/admin/AdminReservations.css';
import './pages/user/UserProfile.css';

// Import all component-specific CSS files globally
import './components/common/Header.css';
import './components/common/AdminHeader.css';
import './components/common/ProductCard.css';
import './components/common/StatCard.css';  
import './components/layout/Layout.css';
import './components/layout/AdminLayout.css';

ReactDOM.createRoot(document.getElementById('root')).render(
  <React.StrictMode>
    <BrowserRouter>
      <App />
    </BrowserRouter>
  </React.StrictMode>
);
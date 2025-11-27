import React from 'react';
import { Routes, Route, Navigate } from 'react-router-dom';

// Import Layouts
import Layout from './components/layout/Layout';
import AdminLayout from './components/layout/AdminLayout.jsx';

// Import Pages
import Login from './pages/Login';
import Register from './pages/Register';
import Dashboard from './pages/user/Dashboard';
import Products from './pages/user/Products';
import ProductDetails from './pages/user/ProductDetails';
import Cart from './pages/user/Cart';
import MyReservations from './pages/user/MyReservations';
import ReservationDetails from './pages/user/ReservationDetails';
import PointsHistory from './pages/user/PointsHistory';
import AdminDashboard from './pages/admin/AdminDashboard';
import AdminProducts from './pages/admin/AdminProducts';
import AdminReservations from './pages/admin/AdminReservations';
import UserProfile from './pages/user/UserProfile';
import UserManagement from './pages/admin/UserManagement';
import UserList from './pages/admin/UserList';
import ProductManagement from './pages/admin/ProductManagement';
function App() {
  return (
    <Routes>
      {/* Auth Routes */}
      <Route path="/login" element={<Login />} />
      <Route path="/register" element={<Register />} />

      {/* User Routes (Protected) */}
      <Route path="/" element={<Layout />}>
        <Route index element={<Navigate to="/login" replace />} />
        <Route path="dashboard" element={<Dashboard />} />
        <Route path="products" element={<Products />} />
        <Route path="products/:id" element={<ProductDetails />} />
        <Route path="cart" element={<Cart />} />
        <Route path="reservations" element={<MyReservations />} />
        <Route path="reservations/:id" element={<ReservationDetails />} />
        <Route path="points" element={<PointsHistory />} />
        <Route path="profile" element={<UserProfile />} />
      </Route>

      {/* Admin Routes (Protected) */}
      <Route path="/admin" element={<AdminLayout />}>
        <Route index element={<Navigate to="/admin/dashboard" replace />} />
        <Route path="dashboard" element={<AdminDashboard />} />
        <Route path="products" element={<ProductManagement />} />
        <Route path="reservations" element={<AdminReservations />} />
        <Route path="users" element={<UserManagement />} />
        <Route path="user-list" element={<UserList />} />
      </Route>

      {/* 404 Not Found */}
      <Route path="*" element={<h1 style={{ textAlign: 'center', marginTop: '5rem' }}>404: Page Not Found</h1>} />
    </Routes>
  );
}

export default App;
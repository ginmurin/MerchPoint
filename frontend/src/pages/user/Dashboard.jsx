import React, { useState, useEffect } from 'react';
import { useLocation } from 'react-router-dom';
import StatCard from '../../components/common/StatCard';
import Notification from '../../components/common/Notification';
import reservationService from '../../services/reservationService';
import { getUserById } from '../../services/userService';
import { useNotification } from '../../hooks/useNotification';

const Dashboard = () => {
  const location = useLocation();
  const { notification, showNotification, hideNotification } = useNotification();
  const [user, setUser] = useState(null);
  const [stats, setStats] = useState({
    total: 0,
    pending: 0,
    approved: 0,
    rejected: 0
  });
  const [recentReservations, setRecentReservations] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const userData = JSON.parse(localStorage.getItem('user') || '{}');
    
    // Show notification if passed from navigation (only once)
    if (location.state?.message) {
      showNotification(location.state.message, location.state.type || 'info');
    }
    
    // Fetch reservations and fresh user data if userId exists
    if (userData.userId) {
      fetchUserDataAndReservations(userData.userId);
    } else {
      setUser(userData);
      setLoading(false);
    }
  }, []); // Empty dependency array - only run once on mount

  const fetchUserDataAndReservations = async (userId) => {
    try {
      setLoading(true);
      // Fetch fresh user data from API
      const freshUserData = await getUserById(userId);
      setUser(freshUserData);
      
      // Update localStorage with fresh data
      const currentUser = JSON.parse(localStorage.getItem('user') || '{}');
      localStorage.setItem('user', JSON.stringify({ ...currentUser, ...freshUserData }));
      
      // Fetch reservations
      await fetchReservations(userId);
    } catch (error) {
      console.error('Error fetching user data:', error);
      // Fallback to localStorage data
      const userData = JSON.parse(localStorage.getItem('user') || '{}');
      setUser(userData);
    } finally {
      setLoading(false);
    }
  };

  const fetchReservations = async (userId) => {
    try {
      const reservations = await reservationService.getReservationsByUser(userId);
      
      // Calculate stats
      const statsData = {
        total: reservations.length,
        pending: reservations.filter(r => r.status === 'PENDING').length,
        approved: reservations.filter(r => r.status === 'APPROVED').length,
        rejected: reservations.filter(r => r.status === 'REJECTED').length
      };
      setStats(statsData);
      
      // Get recent reservations (last 5)
      setRecentReservations(reservations.slice(0, 5));
    } catch (error) {
      console.error('Error fetching reservations:', error);
    }
  };

  const userPoints = user?.pointsBalance || 0;

  return (
    <div className="container">
      {notification.show && (
        <Notification 
          message={notification.message} 
          type={notification.type}
          onClose={hideNotification}
        />
      )}
      <h1 className="dashboard-title">My Dashboard</h1>

      <div className="dashboard-points-box">
        <div className="dashboard-points-value">{loading ? '...' : userPoints}</div>
        <div className="dashboard-points-label">Available Reward Points</div>
      </div>

      <div className="dashboard-stats-grid">
        <StatCard label="Total Reservations" value={stats.total} color="maroon" />
        <StatCard label="Pending Approval" value={stats.pending} color="gold" />
        <StatCard label="Approved" value={stats.approved} color="maroon" />
        <StatCard label="Rejected" value={stats.rejected} color="maroon" />
      </div>

      <h2 className="dashboard-recent-title">Recent Reservations</h2>
      
      {loading ? (
        <div style={{ textAlign: 'center', padding: '3rem', color: '#666' }}>
          <p>Loading reservations...</p>
        </div>
      ) : recentReservations.length === 0 ? (
        <div style={{ textAlign: 'center', padding: '3rem', color: '#666' }}>
          <p>No reservations yet</p>
          <p style={{ marginTop: '1rem', fontSize: '14px' }}>Start shopping to create your first reservation!</p>
        </div>
      ) : (
        <table className="table">
          <thead>
            <tr>
              <th>Code</th>
              <th>Date</th>
              <th>Items</th>
              <th>Total</th>
              <th>Points</th>
              <th>Status</th>
            </tr>
          </thead>
          <tbody>
            {recentReservations.map((reservation) => {
              const date = new Date(reservation.createdAt);
              const dateStr = date.toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' });
              
              return (
                <tr key={reservation.id}>
                  <td><strong>{reservation.code}</strong></td>
                  <td>{dateStr}</td>
                  <td>{reservation.itemCount} items</td>
                  <td><strong>₱{reservation.totalAmount.toFixed(2)}</strong></td>
                  <td>
                    {reservation.pointsUsed > 0 && <span style={{color: '#dc3545'}}>-{reservation.pointsUsed}</span>}
                    {reservation.pointsUsed > 0 && reservation.pointsEarned > 0 && ' / '}
                    {reservation.pointsEarned > 0 && <span style={{color: '#28a745'}}>+{reservation.pointsEarned}</span>}
                  </td>
                  <td>
                    <span className={`status-badge status-${reservation.status.toLowerCase()}`}>
                      {reservation.status}
                    </span>
                  </td>
                </tr>
              );
            })}
          </tbody>
        </table>
      )}
    </div>
  );
};

export default Dashboard;
import React, { useState, useEffect } from 'react';
import StatCard from '../../components/common/StatCard';
import Notification from '../../components/common/Notification';
import { useNotification } from '../../hooks/useNotification';
import reservationService from '../../services/reservationService';
import { getUserById } from '../../services/userService';

const AdminReservations = () => {
  const [reservations, setReservations] = useState([]);
  const [filteredReservations, setFilteredReservations] = useState([]);
  const [statusFilter, setStatusFilter] = useState('All');
  const [searchQuery, setSearchQuery] = useState('');
  const [loading, setLoading] = useState(true);
  const [stats, setStats] = useState({ total: 0, pending: 0, approved: 0, rejected: 0 });
  const { notification, showNotification, hideNotification } = useNotification();
  const [userCache, setUserCache] = useState({});

  useEffect(() => {
    fetchReservations();
  }, []);

  useEffect(() => {
    applyFilters();
  }, [reservations, statusFilter, searchQuery]);

  const fetchReservations = async () => {
    try {
      setLoading(true);
      const data = await reservationService.getAllReservations();
      setReservations(data);
      
      // Calculate stats
      const statsData = {
        total: data.length,
        pending: data.filter(r => r.status === 'PENDING').length,
        approved: data.filter(r => r.status === 'APPROVED').length,
        rejected: data.filter(r => r.status === 'REJECTED').length
      };
      setStats(statsData);

      // Fetch user data for all reservations
      const userIds = [...new Set(data.map(r => r.userId))];
      const users = {};
      for (const userId of userIds) {
        try {
          const userData = await getUserById(userId);
          users[userId] = userData;
        } catch (error) {
          console.error(`Error fetching user ${userId}:`, error);
        }
      }
      setUserCache(users);
    } catch (error) {
      console.error('Error fetching reservations:', error);
      showNotification('Failed to load reservations', 'error');
    } finally {
      setLoading(false);
    }
  };

  const applyFilters = () => {
    let filtered = [...reservations];

    // Apply status filter
    if (statusFilter !== 'All') {
      filtered = filtered.filter(r => r.status === statusFilter.toUpperCase());
    }

    // Apply search filter
    if (searchQuery.trim()) {
      filtered = filtered.filter(r => {
        const user = userCache[r.userId];
        const userName = user?.fullName?.toLowerCase() || '';
        const userEmail = user?.email?.toLowerCase() || '';
        const code = r.code.toLowerCase();
        const query = searchQuery.toLowerCase();
        return code.includes(query) || userName.includes(query) || userEmail.includes(query);
      });
    }

    setFilteredReservations(filtered);
  };

  const handleStatusUpdate = async (reservationId, newStatus) => {
    try {
      await reservationService.updateReservationStatus(reservationId, newStatus);
      showNotification(`Reservation ${newStatus.toLowerCase()} successfully!`, 'success');
      fetchReservations(); // Refresh the list
    } catch (error) {
      console.error('Error updating reservation status:', error);
      showNotification('Failed to update reservation status', 'error');
    }
  };

  const handleFilterClick = (filter) => {
    setStatusFilter(filter);
  };

  const handleSearch = () => {
    applyFilters();
  };

  return (
    <div className="container">
      {notification.show && (
        <Notification 
          message={notification.message} 
          type={notification.type}
          onClose={hideNotification}
        />
      )}
      
      <h1 className="admin-title">Reservation Management</h1>

      <div className="dashboard-stats-grid">
        <StatCard label="Total" value={stats.total} color="maroon" />
        <StatCard label="Pending" value={stats.pending} color="gold" />
        <StatCard label="Approved" value={stats.approved} color="maroon" />
        <StatCard label="Rejected" value={stats.rejected} color="maroon" />
      </div>

      <div className="products-search-section">
        <div className="products-search-bar">
          <input 
            className="input" 
            placeholder="Search by code or user name..." 
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            onKeyPress={(e) => e.key === 'Enter' && handleSearch()}
          />
          <button className="button button-primary" onClick={handleSearch}>Search</button>
        </div>
        <div className="products-filter-bar">
          <span className="products-filter-label">Filter by Status:</span>
          <button 
            className={`products-filter-btn ${statusFilter === 'All' ? 'active' : ''}`}
            onClick={() => handleFilterClick('All')}
          >
            All
          </button>
          <button 
            className={`products-filter-btn ${statusFilter === 'Pending' ? 'active' : ''}`}
            onClick={() => handleFilterClick('Pending')}
          >
            Pending
          </button>
          <button 
            className={`products-filter-btn ${statusFilter === 'Approved' ? 'active' : ''}`}
            onClick={() => handleFilterClick('Approved')}
          >
            Approved
          </button>
          <button 
            className={`products-filter-btn ${statusFilter === 'Rejected' ? 'active' : ''}`}
            onClick={() => handleFilterClick('Rejected')}
          >
            Rejected
          </button>
        </div>
      </div>

      {loading ? (
        <div style={{ textAlign: 'center', padding: '3rem' }}>Loading reservations...</div>
      ) : (
        <table className="table">
          <thead>
            <tr>
              <th>Code</th>
              <th>User</th>
              <th>Date</th>
              <th>Total</th>
              <th>Points</th>
              <th>Status</th>
              <th>Actions</th>
            </tr>
          </thead>
          <tbody>
            {filteredReservations.length === 0 ? (
              <tr>
                <td colSpan="7" style={{ textAlign: 'center', padding: '2rem' }}>
                  No reservations found
                </td>
              </tr>
            ) : (
              filteredReservations.map((reservation) => {
                const user = userCache[reservation.userId] || {};
                const date = new Date(reservation.createdAt);
                const dateStr = date.toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' });
                
                return (
                  <tr key={reservation.id}>
                    <td><strong>{reservation.code}</strong></td>
                    <td>
                      {user.fullName || 'Unknown User'}
                      <br/>
                      <span className="table-time">{user.email || ''}</span>
                    </td>
                    <td>{dateStr}</td>
                    <td><strong>₱{reservation.totalAmount.toFixed(2)}</strong></td>
                    <td>
                      {reservation.pointsUsed > 0 && (
                        <span className="status-points-used">-{reservation.pointsUsed}</span>
                      )}
                      {reservation.pointsUsed > 0 && reservation.pointsEarned > 0 && ' / '}
                      {reservation.pointsEarned > 0 && (
                        <span className="status-points-earned">+{reservation.pointsEarned}</span>
                      )}
                      {reservation.pointsUsed === 0 && reservation.pointsEarned === 0 && '-'}
                    </td>
                    <td>
                      <span className={`status-badge status-${reservation.status.toLowerCase()}`}>
                        {reservation.status}
                      </span>
                    </td>
                    <td>
                      {reservation.status === 'PENDING' ? (
                        <>
                          <button 
                            className="button button-primary" 
                            style={{ padding: '6px 12px', fontSize: '11px', marginRight: '5px' }}
                            onClick={() => handleStatusUpdate(reservation.id, 'APPROVED')}
                          >
                            Approve
                          </button>
                          <button 
                            className="button button-secondary" 
                            style={{ padding: '6px 12px', fontSize: '11px' }}
                            onClick={() => handleStatusUpdate(reservation.id, 'REJECTED')}
                          >
                            Reject
                          </button>
                        </>
                      ) : (
                        <span style={{ color: '#666', fontSize: '12px' }}>No actions available</span>
                      )}
                    </td>
                  </tr>
                );
              })
            )}
          </tbody>
        </table>
      )}
    </div>
  );
};

export default AdminReservations;
import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import reservationService from '../../services/reservationService';

const MyReservations = () => {
  const [reservations, setReservations] = useState([]);
  const [filteredReservations, setFilteredReservations] = useState([]);
  const [activeFilter, setActiveFilter] = useState('All');
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchReservations();
  }, []);

  useEffect(() => {
    filterReservations(activeFilter);
  }, [reservations, activeFilter]);

  const fetchReservations = async () => {
    try {
      setLoading(true);
      const userData = localStorage.getItem('user');
      if (!userData) {
        console.error('No user data found');
        return;
      }

      const user = JSON.parse(userData);
      const data = await reservationService.getReservationsByUser(user.userId);
      setReservations(data);
    } catch (error) {
      console.error('Error fetching reservations:', error);
    } finally {
      setLoading(false);
    }
  };

  const filterReservations = (filterType) => {
    if (filterType === 'All') {
      setFilteredReservations(reservations);
    } else {
      setFilteredReservations(reservations.filter(res => res.status === filterType.toUpperCase()));
    }
  };

  const handleFilterClick = (filterType) => {
    setActiveFilter(filterType);
  };

  const formatDateTime = (dateTimeString) => {
    const date = new Date(dateTimeString);
    const dateStr = date.toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' });
    const timeStr = date.toLocaleTimeString('en-US', { hour: 'numeric', minute: '2-digit', hour12: true });
    return { dateStr, timeStr };
  };

  const getStatusBadgeClass = (status) => {
    switch (status) {
      case 'PENDING':
        return 'status-badge status-pending';
      case 'APPROVED':
        return 'status-badge status-approved';
      case 'REJECTED':
        return 'status-badge status-rejected';
      default:
        return 'status-badge';
    }
  };

  if (loading) {
    return <div className="container">Loading...</div>;
  }

  return (
    <div className="container">
      <h1 className="my-reservations-title">My Reservations</h1>

      <div className="products-filter-bar" style={{ marginBottom: '2rem' }}>
        <span className="products-filter-label">Filter by:</span>
        <button 
          className={`products-filter-btn ${activeFilter === 'All' ? 'active' : ''}`}
          onClick={() => handleFilterClick('All')}
        >
          All
        </button>
        <button 
          className={`products-filter-btn ${activeFilter === 'Pending' ? 'active' : ''}`}
          onClick={() => handleFilterClick('Pending')}
        >
          Pending
        </button>
        <button 
          className={`products-filter-btn ${activeFilter === 'Approved' ? 'active' : ''}`}
          onClick={() => handleFilterClick('Approved')}
        >
          Approved
        </button>
        <button 
          className={`products-filter-btn ${activeFilter === 'Rejected' ? 'active' : ''}`}
          onClick={() => handleFilterClick('Rejected')}
        >
          Rejected
        </button>
      </div>

      {filteredReservations.length === 0 ? (
        <div className="empty-state">No reservations found</div>
      ) : (
        <table className="table">
          <thead>
            <tr>
              <th>Code</th>
              <th>Date Created</th>
              <th>Items</th>
              <th>Total Amount</th>
              <th>Points</th>
              <th>Status</th>
              <th>Action</th>
            </tr>
          </thead>
          <tbody>
            {filteredReservations.map((reservation) => {
              const { dateStr, timeStr } = formatDateTime(reservation.createdAt);
              return (
                <tr key={reservation.id}>
                  <td><strong>{reservation.code}</strong></td>
                  <td>{dateStr}<br/><span className="table-time">{timeStr}</span></td>
                  <td>{reservation.itemCount} {reservation.itemCount === 1 ? 'item' : 'items'}</td>
                  <td><strong>₱{reservation.totalAmount.toFixed(2)}</strong></td>
                  <td>
                    {reservation.pointsUsed > 0 && (
                      <span className="status-points-used">-{reservation.pointsUsed}</span>
                    )}
                    {reservation.pointsUsed > 0 && reservation.pointsEarned > 0 && ' / '}
                    {reservation.pointsEarned > 0 && (
                      <span className="status-points-earned">+{reservation.pointsEarned}</span>
                    )}
                    {reservation.status === 'REJECTED' && reservation.pointsUsed > 0 && (
                      <span className="status-points-refunded"> (Refunded)</span>
                    )}
                  </td>
                  <td><span className={getStatusBadgeClass(reservation.status)}>{reservation.status}</span></td>
                  <td>
                    <Link to={`/reservations/${reservation.id}`} className="button button-secondary" style={{ padding: '8px 16px', fontSize: '12px' }}>
                      View Details
                    </Link>
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

export default MyReservations;
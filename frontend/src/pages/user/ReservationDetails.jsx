import React, { useState, useEffect } from 'react';
import { Link, useParams } from 'react-router-dom';
import reservationService from '../../services/reservationService';

const ReservationDetails = () => {
  const { id } = useParams();
  const [reservation, setReservation] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchReservationDetails();
  }, [id]);

  const fetchReservationDetails = async () => {
    try {
      setLoading(true);
      const data = await reservationService.getReservationDetails(id);
      setReservation(data);
    } catch (error) {
      console.error('Error fetching reservation details:', error);
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return (
      <div className="container">
        <div style={{ textAlign: 'center', padding: '3rem' }}>
          <p>Loading reservation details...</p>
        </div>
      </div>
    );
  }

  if (!reservation) {
    return (
      <div className="container">
        <Link to="/reservations" className="button button-secondary" style={{ marginBottom: '2rem' }}>
          ← Back to My Reservations
        </Link>
        <div style={{ textAlign: 'center', padding: '3rem' }}>
          <p>Reservation not found</p>
        </div>
      </div>
    );
  }

  const formatDateTime = (dateTimeString) => {
    const date = new Date(dateTimeString);
    return date.toLocaleString('en-US', {
      month: 'long',
      day: 'numeric',
      year: 'numeric',
      hour: 'numeric',
      minute: '2-digit',
      hour12: true
    });
  };

  return (
    <div className="container">
      <Link to="/reservations" className="button button-secondary" style={{ marginBottom: '2rem' }}>
        ← Back to My Reservations
      </Link>

      <div className="res-details-box">
        <div className="res-details-header">
          <div>
            <div className="res-details-title">Reservation Details</div>
            <div className="res-details-code">Code: <strong>{reservation.code}</strong></div>
          </div>
          <span className={`status-badge status-${reservation.status.toLowerCase()}`}>
            {reservation.status}
          </span>
        </div>

        <div className="res-details-grid">
          <div>
            <h3 className="res-details-subtitle">Reservation Information</h3>
            <div className="res-details-row">
              <div className="res-details-label">Date:</div>
              <div className="res-details-value">{formatDateTime(reservation.createdAt)}</div>
            </div>
            <div className="res-details-row">
              <div className="res-details-label">Status:</div>
              <div className="res-details-value">{reservation.status}</div>
            </div>
            <div className="res-details-row">
              <div className="res-details-label">Total Items:</div>
              <div className="res-details-value"><strong>{reservation.items.length} items</strong></div>
            </div>
          </div>
          
          <div>
            <h3 className="res-details-subtitle">Payment Summary</h3>
            <div className="res-details-row">
              <div className="res-details-label">Subtotal:</div>
              <div className="res-details-value">
                <strong>₱{(reservation.totalAmount + (reservation.pointsUsed || 0)).toFixed(2)}</strong>
              </div>
            </div>
            <div className="res-details-row">
              <div className="res-details-label">Points Redeemed:</div>
              <div className="res-details-value status-points-used">
                -{reservation.pointsUsed || 0} points (-₱{(reservation.pointsUsed || 0).toFixed(2)})
              </div>
            </div>
            <div className="res-details-row">
              <div className="res-details-label">Points to Earn:</div>
              <div className="res-details-value status-points-earned">
                +{reservation.pointsEarned || 0} points
              </div>
            </div>
            <div className="res-details-row total">
              <div className="res-details-label">Total Amount:</div>
              <div className="res-details-value total-price">₱{reservation.totalAmount.toFixed(2)}</div>
            </div>
          </div>
        </div>
      </div>

      <div className="res-details-box">
        <h3 className="res-details-subtitle">Ordered Items</h3>
        <table className="table">
          <thead>
            <tr>
              <th>Product</th>
              <th>Unit Price</th>
              <th>Quantity</th>
              <th>Points Per Item</th>
              <th>Subtotal</th>
            </tr>
          </thead>
          <tbody>
            {reservation.items.map(item => (
              <tr key={item.productId}>
                <td><strong>{item.productName}</strong></td>
                <td>₱{item.price.toFixed(2)}</td>
                <td>{item.quantity}</td>
                <td><span className="status-points-earned">{item.pointsPerItem} pts</span></td>
                <td><strong>₱{(item.price * item.quantity).toFixed(2)}</strong></td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default ReservationDetails;
import React from 'react';
import { Link, useParams } from 'react-router-dom';

const ReservationDetails = () => {
  const { id } = useParams();
  
  // Mock data - fetch based on ID
  const reservation = {
    id: id,
    code: 'RES-001',
    date: 'November 10, 2025 at 10:30 AM',
    status: 'Pending',
    itemsCount: 4,
    notes: 'Please prepare for pickup by Friday.',
    subtotal: 1100,
    pointsUsed: 50,
    pointsToEarn: 110,
    total: 1050,
    items: [
      { id: 1, name: 'School T-Shirt', price: 350, qty: 2, points: 35 },
      { id: 2, name: 'Coffee Mug', price: 150, qty: 1, points: 15 },
      { id: 3, name: 'School Cap', price: 250, qty: 1, points: 25 },
    ]
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
          <span className="status-badge status-pending">{reservation.status}</span>
        </div>

        <div className="res-details-grid">
          <div>
            <h3 className="res-details-subtitle">Reservation Information</h3>
            <div className="res-details-row">
              <div className="res-details-label">Date:</div>
              <div className="res-details-value">{reservation.date}</div>
            </div>
            <div className="res-details-row">
              <div className="res-details-label">Status:</div>
              <div className="res-details-value">{reservation.status}</div>
            </div>
            <div className="res-details-row">
              <div className="res-details-label">Total Items:</div>
              <div className="res-details-value"><strong>{reservation.itemsCount} items</strong></div>
            </div>
            <div className="res-details-row">
              <div className="res-details-label">Notes:</div>
              <div className="res-details-value" style={{ fontStyle: 'italic', color: '#555' }}>
                {reservation.notes || 'N/A'}
              </div>
            </div>
          </div>
          
          <div>
            <h3 className="res-details-subtitle">Payment Summary</h3>
            <div className="res-details-row">
              <div className="res-details-label">Subtotal:</div>
              <div className="res-details-value"><strong>₱{reservation.subtotal.toFixed(2)}</strong></div>
            </div>
            <div className="res-details-row">
              <div className="res-details-label">Points Redeemed:</div>
              <div className="res-details-value status-points-used">
                -{reservation.pointsUsed} points (-₱{reservation.pointsUsed.toFixed(2)})
              </div>
            </div>
            <div className="res-details-row">
              <div className="res-details-label">Points to Earn:</div>
              <div className="res-details-value status-points-earned">
                +{reservation.pointsToEarn} points
              </div>
            </div>
            <div className="res-details-row total">
              <div className="res-details-label">Total Amount:</div>
              <div className="res-details-value total-price">₱{reservation.total.toFixed(2)}</div>
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
              <tr key={item.id}>
                <td><strong>{item.name}</strong></td>
                <td>₱{item.price.toFixed(2)}</td>
                <td>{item.qty}</td>
                <td><span className="status-points-earned">{item.points} pts</span></td>
                <td><strong>₱{(item.price * item.qty).toFixed(2)}</strong></td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default ReservationDetails;
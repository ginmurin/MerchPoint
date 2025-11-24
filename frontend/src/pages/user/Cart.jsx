import React from 'react';
import { Link } from 'react-router-dom';

const Cart = () => {
  return (
    <div className="container">
      <h1 className="cart-title">Shopping Cart</h1>

      <div className="cart-layout">
        <div className="cart-items-list">
          {/* Mock Cart Item 1 */}
          <div className="cart-item">
            <div className="cart-item-info">
              <div className="cart-item-image">Image</div>
              <div>
                <div className="cart-item-name">School T-Shirt</div>
                <div className="cart-item-meta">Quantity: 2</div>
                <div className="cart-item-price-each">₱350.00 each</div>
              </div>
            </div>
            <div className="cart-item-actions">
              <div className="cart-item-subtotal">₱700.00</div>
              <button className="button button-secondary" style={{ padding: '8px 16px', fontSize: '12px' }}>Remove</button>
            </div>
          </div>
          {/* Mock Cart Item 2 */}
          <div className="cart-item">
            <div className="cart-item-info">
              <div className="cart-item-image">Image</div>
              <div>
                <div className="cart-item-name">Coffee Mug</div>
                <div className="cart-item-meta">Quantity: 1</div>
                <div className="cart-item-price-each">₱150.00 each</div>
              </div>
            </div>
            <div className="cart-item-actions">
              <div className="cart-item-subtotal">₱150.00</div>
              <button className="button button-secondary" style={{ padding: '8px 16px', fontSize: '12px' }}>Remove</button>
            </div>
          </div>
          
          <Link to="/products" className="button button-secondary" style={{ width: '100%', marginTop: '20px' }}>
            ← Continue Shopping
          </Link>
        </div>

        <div className="cart-summary-wrapper">
          <div className="cart-summary">
            <h2 className="cart-summary-title">Order Summary</h2>
            
            <div className="cart-summary-row">
              <span>Subtotal (3 items):</span>
              <span>₱850.00</span>
            </div>
            <div className="cart-summary-row">
              <span>Points to Earn:</span>
              <span className="cart-summary-points-earn">⭐ 85 points</span>
            </div>
            
            <div className="cart-summary-redeem-box">
              <div className="cart-summary-redeem-title">💎 Redeem Your Points</div>
              <div className="cart-summary-redeem-meta">Available: 150 points</div>
              <input className="input" placeholder="Enter points to redeem" />
              <div className="cart-summary-redeem-discount">
                Discount Applied: -₱50.00
              </div>
            </div>

            <div className="cart-summary-row total">
              <span>Total Amount:</span>
              <span className="cart-summary-total-price">₱800.00</span>
            </div>

            <button className="button button-primary" style={{ width: '100%', padding: '18px', fontSize: '16px' }}>
              🎯 Place Reservation
            </button>

            <div className="cart-summary-note">
              <strong>Note:</strong> Your reservation will be pending admin approval.
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Cart;
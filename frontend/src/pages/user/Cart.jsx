import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useCart } from '../../context/CartContext';
import Notification from '../../components/common/Notification';
import { useNotification } from '../../hooks/useNotification';
import reservationService from '../../services/reservationService';
import { getUserById } from '../../services/userService';

const Cart = () => {
  const { cart, removeFromCart, updateQuantity, getCartTotal, getCartItemsCount, clearCart } = useCart();
  const { notification, showNotification, hideNotification } = useNotification();
  const [pointsToRedeem, setPointsToRedeem] = useState(0);
  const [isProcessing, setIsProcessing] = useState(false);
  const navigate = useNavigate();

  const user = JSON.parse(localStorage.getItem('user') || '{}');
  const availablePoints = user.pointsBalance || 0;

  const handleQuantityChange = (productId, newQuantity) => {
    const product = cart.find(item => item.productId === productId);
    if (newQuantity > product.stockQuantity) {
      showNotification(`Only ${product.stockQuantity} units available`, 'warning');
      return;
    }
    updateQuantity(productId, parseInt(newQuantity));
  };

  const handleRemove = (productId) => {
    removeFromCart(productId);
    showNotification('Item removed from cart', 'info');
  };

  const handleRedeemPoints = () => {
    const points = parseInt(pointsToRedeem) || 0;
    if (points > availablePoints) {
      showNotification('Insufficient points balance', 'error');
      setPointsToRedeem(0);
      return;
    }
    if (points > getCartTotal()) {
      showNotification('Points exceed cart total', 'warning');
      setPointsToRedeem(0);
      return;
    }
  };

  const discount = parseInt(pointsToRedeem) || 0;
  const subtotal = getCartTotal();
  const totalAmount = subtotal - discount;
  // Only earn points if no discount is applied
  const pointsToEarn = (discount === 0) ? Math.round(totalAmount * 0.20) : 0;

  const handlePlaceReservation = async () => {
    if (cart.length === 0) {
      showNotification('Your cart is empty', 'warning');
      return;
    }

    setIsProcessing(true);

    try {
      const reservationData = {
        userId: user.userId,
        totalAmount: totalAmount,
        pointsUsed: discount,
        items: cart.map(item => ({
          productId: item.productId,
          quantity: item.quantity,
          price: item.price
        }))
      };

      const reservation = await reservationService.createReservation(reservationData);
      
      console.log('Reservation created:', reservation);
      
      // Update user points in localStorage
      const updatedUser = await getUserById(user.userId);
      localStorage.setItem('user', JSON.stringify(updatedUser));
      
      // Trigger header refresh
      window.dispatchEvent(new Event('userUpdated'));
      
      clearCart();
      setPointsToRedeem(0);
      
      // Navigate to dashboard and show notification there
      navigate('/dashboard', { state: { message: 'Reservation placed successfully! Awaiting admin approval.', type: 'success' } });
      
    } catch (error) {
      console.error('Error placing reservation:', error);
      console.error('Error details:', error.message);
      showNotification(error.message || 'Failed to place reservation. Please try again.', 'error');
    } finally {
      setIsProcessing(false);
    }
  };

  if (cart.length === 0) {
    return (
      <div className="container">
        <h1 className="cart-title">Shopping Cart</h1>
        <div style={{ textAlign: 'center', padding: '4rem' }}>
          <p style={{ fontSize: '1.2rem', marginBottom: '2rem' }}>Your cart is empty</p>
          <Link to="/products" className="button button-primary">
            Browse Products
          </Link>
        </div>
      </div>
    );
  }

  return (
    <div className="container">
      <h1 className="cart-title">Shopping Cart</h1>

      <div className="cart-layout">
        <div className="cart-items-list">
          {cart.map((item) => (
            <div key={item.productId} className="cart-item">
              <div className="cart-item-info">
                <div className="cart-item-image">{item.imageUrl ? <img src={item.imageUrl} alt={item.productName} /> : 'Image'}</div>
                <div>
                  <div className="cart-item-name">{item.productName}</div>
                  <div className="cart-item-meta">
                    <input
                      type="number"
                      min="1"
                      max={item.stockQuantity}
                      value={item.quantity}
                      onChange={(e) => handleQuantityChange(item.productId, e.target.value)}
                      style={{ width: '60px', padding: '4px', marginRight: '8px' }}
                    />
                    {item.stockQuantity} available
                  </div>
                  <div className="cart-item-price-each">₱{item.price.toFixed(2)} each</div>
                </div>
              </div>
              <div className="cart-item-actions">
                <div className="cart-item-subtotal">₱{(item.price * item.quantity).toFixed(2)}</div>
                <button 
                  className="button button-secondary" 
                  style={{ padding: '8px 16px', fontSize: '12px' }}
                  onClick={() => handleRemove(item.productId)}
                >
                  Remove
                </button>
              </div>
            </div>
          ))}
          
          <Link to="/products" className="button button-secondary" style={{ width: '100%', marginTop: '20px' }}>
            ← Continue Shopping
          </Link>
        </div>

        <div className="cart-summary-wrapper">
          <div className="cart-summary">
            <h2 className="cart-summary-title">Order Summary</h2>
            
            <div className="cart-summary-row">
              <span>Subtotal ({getCartItemsCount()} items):</span>
              <span>₱{subtotal.toFixed(2)}</span>
            </div>
            <div className="cart-summary-row">
              <span>Points to Earn:</span>
              <span className="cart-summary-points-earn">{pointsToEarn} points</span>
            </div>
            
            <div className="cart-summary-redeem-box">
              <div className="cart-summary-redeem-title">💎 Redeem Your Points</div>
              <div className="cart-summary-redeem-meta">Available: {availablePoints} points</div>
              <div style={{ display: 'flex', gap: '8px' }}>
                <input 
                  className="input" 
                  type="number"
                  min="0"
                  max={Math.min(availablePoints, subtotal)}
                  placeholder="Enter points"
                  value={pointsToRedeem}
                  onChange={(e) => setPointsToRedeem(e.target.value)}
                />
                <button 
                  className="button button-secondary"
                  onClick={handleRedeemPoints}
                >
                  Apply
                </button>
              </div>
              {discount > 0 && (
                <div className="cart-summary-redeem-discount">
                  Discount Applied: -₱{discount.toFixed(2)}
                </div>
              )}
            </div>

            <div className="cart-summary-row total">
              <span>Total Amount:</span>
              <span className="cart-summary-total-price">₱{totalAmount.toFixed(2)}</span>
            </div>

            <button 
              className="button button-primary" 
              style={{ width: '100%', padding: '18px', fontSize: '16px' }}
              onClick={handlePlaceReservation}
              disabled={isProcessing}
            >
              {isProcessing ? 'Processing...' : '🎯 Place Reservation'}
            </button>

            <div className="cart-summary-note">
              <strong>Note:</strong> Your reservation will be pending admin approval.
            </div>
          </div>
        </div>
      </div>

      {notification.show && (
        <Notification 
          message={notification.message} 
          type={notification.type} 
          onClose={hideNotification} 
        />
      )}
    </div>
  );
};

export default Cart;
import React from 'react';
import { Link } from 'react-router-dom';
import { useCart } from '../../context/CartContext';
import { useNotification } from '../../hooks/useNotification';

const ProductCard = ({ product }) => {
  const { addToCart } = useCart();
  const { showNotification } = useNotification();

  const handleAddToCart = (e) => {
    e.preventDefault();
    if (product.stockQuantity <= 0) {
      showNotification('Product is out of stock', 'error');
      return;
    }
    addToCart(product, 1);
    showNotification(`${product.productName} added to cart!`, 'success');
  };

  return (
    <div className="product-card">
      <Link to={`/products/${product.productId}`} className="product-card-link">
        <div className="product-card-image">
          {product.imageUrl ? (
            <img src={product.imageUrl} alt={product.productName} style={{ width: '100%', height: '100%', objectFit: 'cover' }} />
          ) : (
            <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', height: '100%', background: '#f5f5f5' }}>
              No Image
            </div>
          )}
        </div>
        <div className="product-card-info">
          <h3 className="product-card-name">{product.productName}</h3>
          <div className="product-card-price">₱{product.price.toFixed(2)}</div>
          <div className="product-card-points">Earn {product.pointsValue || 0} points</div>
          <div className="product-card-stock">
            {product.stockQuantity > 0 ? (
              <span style={{ color: '#28a745', fontWeight: '500' }}>{product.stockQuantity} in stock</span>
            ) : (
              <span style={{ color: '#d32f2f', fontWeight: 'bold' }}>Out of Stock</span>
            )}
          </div>
        </div>
      </Link>
      <button 
        className="button button-primary product-card-button"
        onClick={handleAddToCart}
        disabled={product.stockQuantity <= 0}
      >
        {product.stockQuantity > 0 ? 'Add to Cart' : 'Out of Stock'}
      </button>
    </div>
  );
};

export default ProductCard;
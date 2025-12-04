import React, { useState, useEffect } from 'react';
import { Link, useParams, useNavigate } from 'react-router-dom';
import productService from '../../services/productService';
import { useCart } from '../../context/CartContext';
import { useNotification } from '../../hooks/useNotification';
import Notification from '../../components/common/Notification';

const ProductDetails = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const { addToCart } = useCart();
  const { notification, showNotification, hideNotification } = useNotification();
  
  const [product, setProduct] = useState(null);
  const [quantity, setQuantity] = useState(1);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchProduct();
  }, [id]);

  const fetchProduct = async () => {
    try {
      setLoading(true);
      const data = await productService.getProductById(id);
      setProduct(data);
    } catch (error) {
      console.error('Error fetching product:', error);
      showNotification('Failed to load product details', 'error');
    } finally {
      setLoading(false);
    }
  };

  const handleAddToCart = () => {
    if (!product) return;

    if (product.stock < quantity) {
      showNotification('Not enough stock available', 'warning');
      return;
    }

    if (quantity < 1) {
      showNotification('Quantity must be at least 1', 'warning');
      return;
    }

    addToCart(product, quantity);
    showNotification(`Added ${quantity} ${product.name} to cart!`, 'success');
    setQuantity(1);
  };

  if (loading) {
    return <div className="container">Loading...</div>;
  }

  if (!product) {
    return <div className="container">Product not found</div>;
  }

  return (
    <div className="container">
      {notification && (
        <Notification
          message={notification.message}
          type={notification.type}
          onClose={hideNotification}
        />
      )}

      <Link to="/products" className="button button-secondary product-details-back-btn">
        ← Back to Products
      </Link>

      <div className="product-details-layout">
        <div className="product-details-image-wrapper">
          <div className="product-details-image">
            {product.imageUrl && <img src={product.imageUrl} alt={product.name} />}
          </div>
        </div>
        
        <div className="product-details-info">
          <h1 className="product-details-name">{product.name}</h1>
          <div className="product-details-price">₱{product.price.toFixed(2)}</div>
          <div className="product-details-points">⭐ Earn {product.points} reward points</div>
          
          <div className="product-details-stock-box">
            <div className="product-details-stock-status"></div>
            <span>{product.stock} units available</span>
          </div>

          <div className="product-details-actions">
            <div className="product-details-qty">
              <label htmlFor="quantity" className="product-details-label">Quantity</label>
              <input 
                id="quantity" 
                type="number" 
                className="input" 
                value={quantity}
                onChange={(e) => setQuantity(parseInt(e.target.value) || 1)}
                min="1" 
                max={product.stock} 
              />
            </div>
            <button 
              className="button button-primary product-details-add-btn"
              onClick={handleAddToCart}
              disabled={product.stock === 0}
            >
              🛒 Add to Cart
            </button>
          </div>
          
          <div className="product-details-card">
            <h3 className="product-details-card-title">Product Description</h3>
            <p className="product-details-card-body">{product.description || 'No description available'}</p>
          </div>

          {product.specs && (
            <div className="product-details-card">
              <h3 className="product-details-card-title">Specifications</h3>
              {Object.entries(product.specs).map(([key, value]) => (
                <div className="product-details-spec-row" key={key}>
                  <strong>{key}:</strong>
                  <span>{value}</span>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default ProductDetails;
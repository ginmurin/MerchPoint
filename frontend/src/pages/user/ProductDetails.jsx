import React from 'react';
import { Link, useParams } from 'react-router-dom';

const ProductDetails = () => {
  const { id } = useParams();
  
  // Mock data - you would fetch this based on the ID
  const product = { 
    id: id, 
    name: 'School T-Shirt', 
    price: 350, 
    points: 35, 
    stock: 50,
    description: 'High-quality cotton t-shirt featuring the official school logo. Available in multiple sizes (S, M, L, XL, XXL). Perfect for everyday wear, school events, and sports activities.',
    specs: {
      Material: '100% Cotton',
      Sizes: 'S, M, L, XL, XXL',
      Color: 'Navy Blue'
    }
  };

  return (
    <div className="container">
      <Link to="/products" className="button button-secondary product-details-back-btn">
        ← Back to Products
      </Link>

      <div className="product-details-layout">
        <div className="product-details-image-wrapper">
          <div className="product-details-image">
            
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
              <input id="quantity" type="number" className="input" defaultValue="1" min="1" max={product.stock} />
            </div>
            <button className="button button-primary product-details-add-btn">
              🛒 Add to Cart
            </button>
          </div>
          
          <div className="product-details-card">
            <h3 className="product-details-card-title">Product Description</h3>
            <p className="product-details-card-body">{product.description}</p>
          </div>

          <div className="product-details-card">
            <h3 className="product-details-card-title">Specifications</h3>
            {Object.entries(product.specs).map(([key, value]) => (
              <div className="product-details-spec-row" key={key}>
                <strong>{key}:</strong>
                <span>{value}</span>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};

export default ProductDetails;
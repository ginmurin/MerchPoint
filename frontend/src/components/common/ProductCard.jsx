import React from 'react';
import { Link } from 'react-router-dom';

const ProductCard = ({ product }) => {
  return (
    <div className="product-card">
      <Link to={`/products/${product.id}`} className="product-card-link">
        <div className="product-card-image">
          
        </div>
        <div className="product-card-info">
          <h3 className="product-card-name">{product.name}</h3>
          <div className="product-card-price">₱{product.price.toFixed(2)}</div>
          <div className="product-card-points">⭐ Earn {product.points} points</div>
          <div className="product-card-stock">✓ {product.stock} in stock</div>
        </div>
      </Link>
      <button className="button button-primary product-card-button">
        Add to Cart
      </button>
    </div>
  );
};

export default ProductCard;
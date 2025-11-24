import React from 'react';
import ProductCard from '../../components/common/ProductCard';

// Mock Data
const mockProducts = [
  { id: 1, name: 'School T-Shirt', price: 350, points: 35, stock: 50 },
  { id: 2, name: 'Hoodie Jacket', price: 750, points: 75, stock: 30 },
  { id: 3, name: 'Coffee Mug', price: 150, points: 15, stock: 100 },
  { id: 4, name: 'School Cap', price: 250, points: 25, stock: 75 },
];

const Products = () => {
  return (
    <div className="container">
      <h1 className="products-title">Product Catalog</h1>

      <div className="products-search-section">
        <div className="products-search-bar">
          <input className="input" placeholder="Search for products..." />
          <button className="button button-primary">Search</button>
        </div>
        <div className="products-filter-bar">
          <span className="products-filter-label">Filter by:</span>
          <button className="products-filter-btn active">All</button>
          <button className="products-filter-btn">T-Shirts</button>
          <button className="products-filter-btn">Hoodies</button>
          <button className="products-filter-btn">Mugs</button>
        </div>
      </div>

      <div className="products-grid">
        {mockProducts.map((product) => (
          <ProductCard key={product.id} product={product} />
        ))}
      </div>
    </div>
  );
};

export default Products;
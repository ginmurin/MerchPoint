import React, { useState, useEffect } from 'react';
import ProductCard from '../../components/common/ProductCard';
import productService from '../../services/productService';
import categoryService from '../../services/categoryService';
import Notification from '../../components/common/Notification';
import { useNotification } from '../../hooks/useNotification';

const Products = () => {
  const [products, setProducts] = useState([]);
  const [categories, setCategories] = useState([]);
  const [loading, setLoading] = useState(true);
  const [selectedCategory, setSelectedCategory] = useState('all');
  const [searchQuery, setSearchQuery] = useState('');
  const { notification, showNotification, hideNotification } = useNotification();

  useEffect(() => {
    fetchData();
  }, []);

  const fetchData = async () => {
    try {
      setLoading(true);
      const [productsData, categoriesData] = await Promise.all([
        productService.getAllProducts(),
        categoryService.getAllCategories()
      ]);
      setProducts(productsData);
      setCategories(categoriesData);
    } catch (error) {
      console.error('Error fetching data:', error);
      showNotification('Failed to load products', 'error');
    } finally {
      setLoading(false);
    }
  };

  const handleSearch = () => {
    if (!searchQuery.trim()) {
      fetchData();
      return;
    }
    const filtered = products.filter(p =>
      p.productName.toLowerCase().includes(searchQuery.toLowerCase())
    );
    setProducts(filtered);
  };

  const handleCategoryFilter = (categoryId) => {
    setSelectedCategory(categoryId);
    if (categoryId === 'all') {
      fetchData();
    } else {
      const filtered = products.filter(p => p.category?.categoryId === categoryId);
      setProducts(filtered);
    }
  };

  return (
    <div className="container">
      <h1 className="products-title">Product Catalog</h1>

      <div className="products-search-section">
        <div className="products-search-bar">
          <input 
            className="input" 
            placeholder="Search for products..." 
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            onKeyPress={(e) => e.key === 'Enter' && handleSearch()}
          />
          <button className="button button-primary" onClick={handleSearch}>Search</button>
        </div>
        <div className="products-filter-bar">
          <span className="products-filter-label">Filter by:</span>
          <button 
            className={`products-filter-btn ${selectedCategory === 'all' ? 'active' : ''}`}
            onClick={() => handleCategoryFilter('all')}
          >
            All
          </button>
          {categories.map(cat => (
            <button 
              key={cat.categoryId}
              className={`products-filter-btn ${selectedCategory === cat.categoryId ? 'active' : ''}`}
              onClick={() => handleCategoryFilter(cat.categoryId)}
            >
              {cat.categoryName}
            </button>
          ))}
        </div>
      </div>

      {loading ? (
        <div style={{ textAlign: 'center', padding: '3rem' }}>Loading products...</div>
      ) : (
        <div className="products-grid">
          {products.length > 0 ? (
            products.map((product) => (
              <ProductCard key={product.productId} product={product} />
            ))
          ) : (
            <div style={{ textAlign: 'center', padding: '3rem', gridColumn: '1 / -1' }}>
              No products found
            </div>
          )}
        </div>
      )}

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

export default Products;
import React, { useState, useEffect } from 'react';
import productService from '../../services/productService';
import categoryService from '../../services/categoryService';
import Notification from '../../components/common/Notification';
import { useNotification } from '../../hooks/useNotification';

const ProductManagement = () => {
  const [products, setProducts] = useState([]);
  const [categories, setCategories] = useState([]);
  const [loading, setLoading] = useState(true);
  const { notification, showNotification, hideNotification } = useNotification();
  const [showModal, setShowModal] = useState(false);
  const [editingProduct, setEditingProduct] = useState(null);
  const [formData, setFormData] = useState({
    productName: '',
    description: '',
    price: '',
    stockQuantity: '',
    imageUrl: '',
    categoryId: '',
    isAvailable: true
  });

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
      showNotification('Failed to load data', 'error');
    } finally {
      setLoading(false);
    }
  };

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData({
      ...formData,
      [name]: value
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const productData = {
        productName: formData.productName,
        description: formData.description || '',
        price: parseFloat(formData.price),
        // pointsValue is auto-calculated as 20% of price on the backend
        stockQuantity: parseInt(formData.stockQuantity),
        imageUrl: formData.imageUrl || '',
        isAvailable: formData.isAvailable,
        category: { categoryId: parseInt(formData.categoryId) }
      };

      if (editingProduct) {
        await productService.updateProduct(editingProduct.productId, productData);
        showNotification('Product updated successfully!', 'success');
      } else {
        await productService.createProduct(productData);
        showNotification('Product created successfully!', 'success');
      }

      resetForm();
      fetchData();
    } catch (error) {
      console.error('Error saving product:', error);
      showNotification(error.message || 'Failed to save product', 'error');
    }
  };

  const handleEdit = (product) => {
    setEditingProduct(product);
    setFormData({
      productName: product.productName,
      description: product.description || '',
      price: product.price.toString(),
      stockQuantity: product.stockQuantity.toString(),
      imageUrl: product.imageUrl || '',
      categoryId: product.category?.categoryId?.toString() || '',
      isAvailable: product.isAvailable !== undefined ? product.isAvailable : true
    });
    setShowModal(true);
  };

  const handleDelete = async (id) => {
    if (window.confirm('Are you sure you want to delete this product?')) {
      try {
        await productService.deleteProduct(id);
        showNotification('Product deleted successfully!', 'success');
        fetchData();
      } catch (error) {
        console.error('Error deleting product:', error);
        showNotification(error.message || 'Failed to delete product', 'error');
      }
    }
  };

  const handleToggleAvailability = async (product) => {
    try {
      const updatedProduct = {
        ...product,
        isAvailable: !product.isAvailable
      };
      await productService.updateProduct(product.productId, updatedProduct);
      showNotification(
        `Product ${updatedProduct.isAvailable ? 'enabled' : 'disabled'} successfully!`, 
        'success'
      );
      fetchData();
    } catch (error) {
      console.error('Error toggling availability:', error);
      showNotification(error.message || 'Failed to update product', 'error');
    }
  };

  const resetForm = () => {
    setFormData({
      productName: '',
      description: '',
      price: '',
      stockQuantity: '',
      imageUrl: '',
      categoryId: '',
      isAvailable: true
    });
    setEditingProduct(null);
    setShowModal(false);
  };

  return (
    <div className="container">
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '2rem' }}>
        <h1 className="admin-title">Product Management</h1>
        <button className="button button-primary" onClick={() => setShowModal(true)}>
          Add Product
        </button>
      </div>

      {loading ? (
        <div style={{ textAlign: 'center', padding: '2rem' }}>Loading...</div>
      ) : (
        <div className="admin-card">
          <table className="table">
            <thead>
              <tr>
                <th>ID</th>
                <th>Product Name</th>
                <th>Category</th>
                <th>Price</th>
                <th>Points</th>
                <th>Stock</th>
                <th>Available</th>
                <th>Actions</th>
              </tr>
            </thead>
            <tbody>
              {products.length > 0 ? (
                products.map(product => (
                  <tr key={product.productId}>
                    <td>{product.productId}</td>
                    <td><strong>{product.productName}</strong></td>
                    <td>{product.category?.categoryName || 'N/A'}</td>
                    <td>₱{product.price.toFixed(2)}</td>
                    <td>{product.pointsValue || 0}</td>
                    <td>
                      <span className={`status-badge ${
                        product.stockQuantity < 5 ? 'status-rejected' :
                        product.stockQuantity < 10 ? 'status-pending' :
                        'status-approved'
                      }`}>
                        {product.stockQuantity}
                      </span>
                    </td>
                    <td>
                      <button
                        className={`status-badge ${
                          product.isAvailable ? 'status-approved' : 'status-rejected'
                        }`}
                        onClick={() => handleToggleAvailability(product)}
                        style={{ 
                          cursor: 'pointer',
                          border: 'none',
                          transition: 'all 0.2s'
                        }}
                        title={`Click to ${product.isAvailable ? 'disable' : 'enable'}`}
                      >
                        {product.isAvailable ? 'Yes' : 'No'}
                      </button>
                    </td>
                    <td>
                      <button
                        className="button button-secondary"
                        style={{ marginRight: '0.5rem', padding: '0.3rem 0.8rem' }}
                        onClick={() => handleEdit(product)}
                      >
                        Edit
                      </button>
                      <button
                        className="button button-secondary"
                        style={{ padding: '0.3rem 0.8rem' }}
                        onClick={() => handleDelete(product.productId)}
                      >
                        Delete
                      </button>
                    </td>
                  </tr>
                ))
              ) : (
                <tr>
                  <td colSpan="8" style={{ textAlign: 'center', padding: '2rem' }}>
                    No products found
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      )}

      {showModal && (
        <div className="modal-overlay" onClick={resetForm}>
          <div className="modal-content" onClick={(e) => e.stopPropagation()}>
            <h2>{editingProduct ? 'Edit Product' : 'Add New Product'}</h2>
            <form onSubmit={handleSubmit}>
              <div className="form-group">
                <label htmlFor="productName">Product Name *</label>
                <input
                  type="text"
                  id="productName"
                  name="productName"
                  value={formData.productName}
                  onChange={handleInputChange}
                  required
                />
              </div>

              <div className="form-group">
                <label htmlFor="description">Description</label>
                <textarea
                  id="description"
                  name="description"
                  value={formData.description}
                  onChange={handleInputChange}
                  rows="3"
                />
              </div>

              <div className="form-group">
                <label htmlFor="categoryId">Category *</label>
                <select
                  id="categoryId"
                  name="categoryId"
                  value={formData.categoryId}
                  onChange={handleInputChange}
                  required
                >
                  <option value="">Select a category</option>
                  {categories.map(cat => (
                    <option key={cat.categoryId} value={cat.categoryId}>
                      {cat.categoryName}
                    </option>
                  ))}
                </select>
              </div>

              <div className="form-row">
                <div className="form-group">
                  <label htmlFor="price">Price (₱) *</label>
                  <input
                    type="number"
                    id="price"
                    name="price"
                    value={formData.price}
                    onChange={handleInputChange}
                    step="0.01"
                    min="0"
                    required
                  />
                </div>

                <div className="form-group">
                  <label htmlFor="pointsValue">Points Value</label>
                  <input
                    type="number"
                    id="pointsValue"
                    name="pointsValue"
                    value={formData.price ? Math.round(parseFloat(formData.price) * 0.20) : 0}
                    readOnly
                    style={{ backgroundColor: '#f5f5f5', cursor: 'not-allowed' }}
                  />
                  <small style={{ color: '#666', fontSize: '12px', marginTop: '4px', display: 'block' }}>
                    Auto-calculated as 20% of price
                  </small>
                </div>
              </div>

              <div className="form-group">
                <label htmlFor="stockQuantity">Stock Quantity *</label>
                <input
                  type="number"
                  id="stockQuantity"
                  name="stockQuantity"
                  value={formData.stockQuantity}
                  onChange={handleInputChange}
                  min="0"
                  required
                />
              </div>

              <div className="form-group">
                <label style={{ display: 'flex', alignItems: 'center', cursor: 'pointer', userSelect: 'none' }}>
                  <input
                    type="checkbox"
                    name="isAvailable"
                    checked={formData.isAvailable}
                    onChange={(e) => setFormData({ ...formData, isAvailable: e.target.checked })}
                    style={{ marginRight: '8px', width: '18px', height: '18px', cursor: 'pointer' }}
                  />
                  <span>Product is available for purchase</span>
                </label>
                <small style={{ color: '#666', fontSize: '12px', marginTop: '4px', display: 'block' }}>
                  Unchecking this will hide the product from customers
                </small>
              </div>

              <div className="modal-actions">
                <button type="button" className="button button-secondary" onClick={resetForm}>
                  Cancel
                </button>
                <button type="submit" className="button button-primary">
                  {editingProduct ? 'Update' : 'Create'}
                </button>
              </div>
            </form>
          </div>
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

export default ProductManagement;

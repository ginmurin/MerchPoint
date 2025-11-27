import { api } from './api';

const productService = {
  getAllProducts: async () => {
    return await api.get('product');
  },

  getProductById: async (id) => {
    return await api.get(`product/${id}`);
  },

  createProduct: async (productData) => {
    return await api.post('product', productData);
  },

  updateProduct: async (id, productData) => {
    return await api.put(`product/${id}`, productData);
  },

  deleteProduct: async (id) => {
    return await api.delete(`product/${id}`);
  }
};

export default productService;

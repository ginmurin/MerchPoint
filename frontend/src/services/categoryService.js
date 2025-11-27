import { api } from './api';

const categoryService = {
  getAllCategories: async () => {
    return await api.get('category');
  },

  getCategoryById: async (id) => {
    return await api.get(`category/${id}`);
  },

  createCategory: async (categoryData) => {
    return await api.post('category', categoryData);
  },

  updateCategory: async (id, categoryData) => {
    return await api.put(`category/${id}`, categoryData);
  },

  deleteCategory: async (id) => {
    return await api.delete(`category/${id}`);
  }
};

export default categoryService;

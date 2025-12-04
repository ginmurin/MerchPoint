import { api } from './api';

const pointsService = {
  async getUserTransactions(userId) {
    return await api.get(`/points/user/${userId}`);
  },

  async getUserTransactionsByType(userId, type) {
    return await api.get(`/points/user/${userId}/type/${type}`);
  },

  async getAllTransactions() {
    return await api.get('/points');
  }
};

export default pointsService;

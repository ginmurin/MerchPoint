import { api } from './api';

const reservationService = {
  async getAllReservations() {
    return await api.get('/reservation');
  },

  async getReservationsByUser(userId) {
    return await api.get(`/reservation/user/${userId}`);
  },

  async getReservationById(id) {
    return await api.get(`/reservation/${id}`);
  },

  async getReservationById(id) {
    return await api.get(`/reservation/${id}`);
  },

  async getReservationDetails(id) {
    return await api.get(`/reservation/${id}`);
  },

  async createReservation(reservationData) {
    return await api.post('/reservation', reservationData);
  },

  async updateReservationStatus(id, status) {
    return await api.put(`/reservation/${id}/status`, { status });
  },

  async deleteReservation(id) {
    return await api.delete(`/reservation/${id}`);
  }
};

export default reservationService;

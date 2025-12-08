import { api } from './api';

const reservationService = {
  async getAllReservations(archived = false) {
    return await api.get(`/reservation?archived=${archived}`);
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
  },

  async archiveReservation(id) {
    return await api.patch(`/reservation/${id}/archive`);
  },

  async unarchiveReservation(id) {
    return await api.patch(`/reservation/${id}/unarchive`);
  },

  async archiveMultiple(ids) {
    return await api.post('/reservation/archive-multiple', { ids });
  }
};

export default reservationService;

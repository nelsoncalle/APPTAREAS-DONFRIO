import api from './api';

export const workerService = {
  async getAllWorkers() {
    try {
      const response = await api.get('/trabajadores');
      return response.data;
    } catch (error) {
      throw error.response?.data || error;
    }
  },

  async createWorker(workerData) {
    try {
      const response = await api.post('/trabajadores', workerData);
      return response.data;
    } catch (error) {
      throw error.response?.data || error;
    }
  },

  async updateWorker(id, workerData) {
    try {
      const response = await api.put(`/trabajadores/${id}`, workerData);
      return response.data;
    } catch (error) {
      throw error.response?.data || error;
    }
  },

  async deleteWorker(id) {
    try {
      const response = await api.delete(`/trabajadores/${id}`);
      return response.data;
    } catch (error) {
      throw error.response?.data || error;
    }
  }
};
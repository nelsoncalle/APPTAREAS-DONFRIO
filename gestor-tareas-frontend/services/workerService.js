import api from './api';

export const workerService = {
  async getAllWorkers() {
    try {
      const response = await api.get('/trabajadores');
      return response.data;
    } catch (error) {
      throw error.response?.data || error;
    }
  }
};
import api from './api';

export const taskService = {
  async getAllTasks() {
    try {
      const response = await api.get('/tareas');
      return response.data;
    } catch (error) {
      throw error.response?.data || error;
    }
  },

  async createTask(taskData) {
    try {
      const response = await api.post('/tareas', taskData);
      return response.data;
    } catch (error) {
      throw error.response?.data || error;
    }
  }
};
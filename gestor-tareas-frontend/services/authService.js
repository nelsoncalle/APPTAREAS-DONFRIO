import api from './api';

export const authService = {
  async login(correo, contrasena) {
    try {
      const response = await api.post('/auth/login', { 
        correo, 
        contrasena 
      });
      return response.data;
    } catch (error) {
      throw error.response?.data || error;
    }
  }
};
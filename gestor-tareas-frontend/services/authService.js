import api from './api';

export const authService = {
  login: async (correo, contrasena) => {
    try {
      const response = await api.post('/auth/login', {
        username: correo,    // ← Mapear "correo" a "username"
        password: contrasena // ← Mapear "contrasena" a "password"
      });
      return response.data;
    } catch (error) {
      throw new Error(error.response?.data?.error || 'Error en el login');
    }
  }
};
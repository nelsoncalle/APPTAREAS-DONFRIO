import api from './api';

export const authService = {
  login: async (username, password) => {
    try {
      console.log('🔐 Intentando login...', username);
      
      const response = await api.post('/auth/login', {
        username,    // ← El backend espera "username"
        password     // ← El backend espera "password"  
      });
      
      console.log('✅ Login response:', response.data);
      
      return response.data;
    } catch (error) {
      console.log('❌ Login error:', error.response?.data || error.message);
      throw new Error(error.response?.data?.error || 'Error en el login');
    }
  }
};
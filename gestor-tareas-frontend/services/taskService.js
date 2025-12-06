import { Platform } from 'react-native';

const getBaseUrl = () => {
  if (__DEV__) {
    if (Platform.OS === 'android') {
      return 'http://10.0.2.2:3001';
    }
    if (Platform.OS === 'ios') {
      return 'http://localhost:3001';
    }
    // ⭐⭐ TU IP REAL: 192.168.1.27 ⭐⭐
    return 'http://192.168.1.27:3001';
  }
  return 'https://tudominio.com';
};

const API_URL = getBaseUrl();

export const taskService = {
  async createTask(taskData) {
    try {
      console.log('🌐 Creando tarea en:', `${API_URL}/api/tasks`);
      console.log('📤 Datos tarea:', taskData);
      
      const response = await fetch(`${API_URL}/api/tasks`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(taskData),
        timeout: 10000
      });
      
      const data = await response.json();
      console.log('✅ Respuesta tarea:', data);
      
      if (!response.ok) {
        throw new Error(data.message || data.error || 'Error creando tarea');
      }
      
      return data;
    } catch (error) {
      console.error('❌ Error creando tarea:', error);
      throw error;
    }
  },

  async getAllTasks() {
    try {
      const response = await fetch(`${API_URL}/api/tasks`, {
        timeout: 10000
      });
      return response.json();
    } catch (error) {
      console.error('Error fetching tasks:', error);
      throw error;
    }
  }
};
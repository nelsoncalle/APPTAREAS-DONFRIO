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

// services/taskService.js - ACTUALIZA ESTE ARCHIVO
export const taskService = {
  async createTask(taskData) {
    try {
      console.log('🌐 Creando tarea...');
      
      // ⭐⭐ IMPORTANTE: Convertir a español si es necesario ⭐⭐
      const datosEnEspanol = {
        titulo: taskData.titulo || taskData.title,
        descripcion: taskData.descripcion || taskData.description,
        fecha_limite: taskData.fecha_limite || taskData.due_date,
        trabajador_id: taskData.trabajador_id || taskData.assigned_to_worker_id
      };
      
      console.log('📤 Datos en español:', datosEnEspanol);
      
      const response = await fetch(`${API_URL}/api/tasks`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(datosEnEspanol),
      });
      
      const data = await response.json();
      console.log('✅ Respuesta:', data);
      
      if (!response.ok) {
        throw new Error(data.error || data.message || 'Error creando tarea');
      }
      
      return data;
    } catch (error) {
      console.error('❌ Error creando tarea:', error);
      throw error;
    }
  },
  // ... otras funciones
};
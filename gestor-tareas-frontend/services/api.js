import axios from 'axios';

// ✅ CONFIGURAR CON TU IP REAL
const API_BASE_URL = 'http://192.168.1.27:3001/api';

const api = axios.create({
  baseURL: API_BASE_URL,
  timeout: 10000,
  headers: {
    'Content-Type': 'application/json',
  },
});

// Servicio de Trabajadores
export const workerService = {
  // ✅ CREAR TRABAJADOR
  createWorker: async (workerData) => {
    try {
      console.log('📤 Enviando trabajador:', workerData);
      const response = await api.post('/workers', workerData);
      console.log('✅ Respuesta del servidor:', response.data);
      return response.data;
    } catch (error) {
      console.error('❌ Error creando trabajador:', error.response?.data || error.message);
      throw error;
    }
  },

  // ✅ OBTENER TRABAJADORES
  getWorkers: async () => {
    try {
      const response = await api.get('/workers');
      return response.data;
    } catch (error) {
      console.error('❌ Error obteniendo trabajadores:', error);
      throw error;
    }
  },

  // ✅ ACTUALIZAR TRABAJADOR
  updateWorker: async (id, workerData) => {
    try {
      const response = await api.put(`/workers/${id}`, workerData);
      return response.data;
    } catch (error) {
      console.error('❌ Error actualizando trabajador:', error);
      throw error;
    }
  },

  // ✅ ELIMINAR TRABAJADOR
  deleteWorker: async (id) => {
    try {
      const response = await api.delete(`/workers/${id}`);
      return response.data;
    } catch (error) {
      console.error('❌ Error eliminando trabajador:', error);
      throw error;
    }
  }
};

// Servicio de Tareas
export const taskService = {
  // ✅ CREAR TAREA
  createTask: async (taskData) => {
    try {
      console.log('📤 Enviando tarea:', taskData);
      const response = await api.post('/tareas', taskData);
      console.log('✅ Respuesta del servidor:', response.data);
      return response.data;
    } catch (error) {
      console.error('❌ Error creando tarea:', error.response?.data || error.message);
      throw error;
    }
  },

  // ✅ OBTENER TAREAS
  getTasks: async () => {
    try {
      const response = await api.get('/tareas');
      return response.data;
    } catch (error) {
      console.error('❌ Error obteniendo tareas:', error);
      throw error;
    }
  }
};

export default api;
import api from './api';

export const taskService = {
  async getAllTasks() {
    try {
      const response = await api.get('/tareas'); // ← Esto ahora funcionará
      return response.data;
    } catch (error) {
      throw error.response?.data || error;
    }
  },

  async createTask(taskData) {
    try {
      const taskDataForBackend = {
        titulo: taskData.titulo,
        descripcion: taskData.descripcion,  
        id_trabajador: taskData.id_trabajador,
        estado: taskData.estado || 'pendiente',
        fecha_limite: taskData.fecha_limite,
        id_usuario: taskData.id_usuario
      };
      
      const response = await api.post('/tareas', taskDataForBackend);
      return response.data;
    } catch (error) {
      throw error.response?.data || error;
    }
  }
  // ... resto de métodos igual
};
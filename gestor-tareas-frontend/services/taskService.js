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
      const taskDataForBackend = {
        titulo: taskData.titulo,           // ✅ usa "titulo"
        descripcion: taskData.descripcion, // ✅ usa "descripcion"  
        id_trabajador: taskData.id_trabajador, // ✅ usa "id_trabajador"
        estado: taskData.estado || 'pendiente', // ✅ usa "estado"
        fecha_limite: taskData.fecha_limite, // ✅ usa "fecha_limite"
        id_usuario: taskData.id_usuario    // ✅ usa "id_usuario"
      };
    } catch (error) {
      throw error.response?.data || error;
    }
  }
};
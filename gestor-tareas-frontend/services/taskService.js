// services/taskService.js
import apiService from './api.js';

export const taskService = {
  // Obtener todas las tareas
  async getAllTasks() {
    try {
      const response = await apiService.get('/api/tasks');
      console.log('✅ Tareas obtenidas:', response.data?.length || 0);
      return response;
    } catch (error) {
      console.error('❌ Error obteniendo tareas:', error);
      throw error;
    }
  },

  // Crear una tarea
  async createTask(taskData) {
    try {
      console.log('📝 Creando tarea:', taskData);
      const response = await apiService.post('/api/tasks', taskData);
      console.log('✅ Tarea creada:', response);
      return response;
    } catch (error) {
      console.error('❌ Error creando tarea:', error);
      throw error;
    }
  },

  // Actualizar una tarea
  async updateTask(id, taskData) {
    try {
      const response = await apiService.put(`/api/tasks/${id}`, taskData);
      console.log('✅ Tarea actualizada:', response);
      return response;
    } catch (error) {
      console.error('❌ Error actualizando tarea:', error);
      throw error;
    }
  },

  // Eliminar una tarea
  async deleteTask(id) {
    try {
      const response = await apiService.delete(`/api/tasks/${id}`);
      console.log('✅ Tarea eliminada:', response);
      return response;
    } catch (error) {
      console.error('❌ Error eliminando tarea:', error);
      throw error;
    }
  },

  // Obtener tarea por ID
  async getTaskById(id) {
    try {
      const response = await apiService.get(`/api/tasks/${id}`);
      console.log('✅ Tarea obtenida:', response);
      return response;
    } catch (error) {
      console.error('❌ Error obteniendo tarea:', error);
      throw error;
    }
  },

  // Obtener tareas por trabajador
  async getTasksByWorker(workerId) {
    try {
      const response = await apiService.get(`/api/tasks/worker/${workerId}`);
      console.log(`✅ Tareas del trabajador ${workerId}:`, response.data?.length || 0);
      return response;
    } catch (error) {
      console.error('❌ Error obteniendo tareas por trabajador:', error);
      throw error;
    }
  },

  // Actualizar estado de tarea
  async updateTaskStatus(id, status) {
    try {
      const response = await apiService.put(`/api/tasks/${id}/status`, { status });
      console.log('✅ Estado de tarea actualizado:', response);
      return response;
    } catch (error) {
      console.error('❌ Error actualizando estado:', error);
      throw error;
    }
  }
};
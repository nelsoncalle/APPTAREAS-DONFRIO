// services/workerService.js
import apiService from './api.js';

export const workerService = {
  // Obtener todos los trabajadores
  async getAllWorkers() {
    try {
      const response = await apiService.get('/api/workers');
      console.log('✅ Trabajadores obtenidos:', response.data?.length || 0);
      return response;
    } catch (error) {
      console.error('❌ Error obteniendo trabajadores:', error);
      throw error;
    }
  },

  // Crear un trabajador
  async createWorker(workerData) {
    try {
      console.log('📝 Creando trabajador:', workerData);
      const response = await apiService.post('/api/workers', workerData);
      console.log('✅ Trabajador creado:', response);
      return response;
    } catch (error) {
      console.error('❌ Error creando trabajador:', error);
      throw error;
    }
  },

  // Actualizar un trabajador
  async updateWorker(id, workerData) {
    try {
      const response = await apiService.put(`/api/workers/${id}`, workerData);
      console.log('✅ Trabajador actualizado:', response);
      return response;
    } catch (error) {
      console.error('❌ Error actualizando trabajador:', error);
      throw error;
    }
  },

  // Eliminar un trabajador
  async deleteWorker(id) {
    try {
      const response = await apiService.delete(`/api/workers/${id}`);
      console.log('✅ Trabajador eliminado:', response);
      return response;
    } catch (error) {
      console.error('❌ Error eliminando trabajador:', error);
      throw error;
    }
  },

  // Obtener trabajador por ID
  async getWorkerById(id) {
    try {
      const response = await apiService.get(`/api/workers/${id}`);
      console.log('✅ Trabajador obtenido:', response);
      return response;
    } catch (error) {
      console.error('❌ Error obteniendo trabajador:', error);
      throw error;
    }
  }
};
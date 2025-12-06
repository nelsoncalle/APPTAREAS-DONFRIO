import { Platform } from 'react-native';

const getBaseUrl = () => {
  if (__DEV__) {
    if (Platform.OS === 'android') {
      return 'http://10.0.2.2:3001'; // Android emulador
    }
    if (Platform.OS === 'ios') {
      return 'http://localhost:3001'; // iOS simulador
    }
    // ⭐⭐ TU IP REAL: 192.168.1.27 ⭐⭐
    return 'http://192.168.1.27:3001'; // Dispositivo físico
  }
  return 'https://tudominio.com';
};

const API_URL = getBaseUrl();

export const workerService = {
  async getAllWorkers() {
    try {
      console.log('🌐 Conectando a:', `${API_URL}/api/workers`);
      const response = await fetch(`${API_URL}/api/workers`, {
        timeout: 10000 // 10 segundos timeout
      });
      
      if (!response.ok) {
        throw new Error(`Error HTTP: ${response.status}`);
      }
      
      const data = await response.json();
      console.log('✅ Respuesta recibida:', data);
      return data;
    } catch (error) {
      console.error('❌ Error conectando:', error.message);
      console.error('❌ URL intentada:', `${API_URL}/api/workers`);
      throw new Error(`No se pudo conectar al servidor: ${error.message}`);
    }
  },
  
  async createWorker(workerData) {
    try {
      console.log('🌐 Creando trabajador en:', `${API_URL}/api/workers`);
      console.log('📤 Datos:', workerData);
      
      const response = await fetch(`${API_URL}/api/workers`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          name: workerData.nombre,  // "name" no "nombre"
          contact_info: workerData.email || workerData.telefono || null
        }),
        timeout: 10000
      });
      
      const data = await response.json();
      console.log('✅ Respuesta creación:', data);
      
      if (!response.ok) {
        throw new Error(data.message || data.error || 'Error del servidor');
      }
      
      return data;
    } catch (error) {
      console.error('❌ Error creando trabajador:', error);
      throw error;
    }
  }
};
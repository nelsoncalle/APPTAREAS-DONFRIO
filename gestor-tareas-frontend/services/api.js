import axios from 'axios';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { Alert, Platform } from 'react-native';

// ✅ CAMBIA ESTA IP POR LA TUYA (ej: 192.168.1.45)
const API_BASE_URL = 'http://172.17.60.16:3001/api'; // ← TU IP AQUÍ




console.log('🌐 Conectando a:', API_BASE_URL);

const api = axios.create({
  baseURL: API_BASE_URL,
  timeout: 15000,
  headers: {
    'Content-Type': 'application/json',
  },
});

// El resto del código igual...
api.interceptors.request.use(
  async (config) => {
    try {
      const token = await AsyncStorage.getItem('userToken');
      if (token) {
        config.headers.Authorization = `Bearer ${token}`;
      }
    } catch (error) {
      console.log('Error obteniendo token:', error);
    }
    return config;
  },
  (error) => Promise.reject(error)
);

export default api;
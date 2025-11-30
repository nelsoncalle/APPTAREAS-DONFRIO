import axios from 'axios';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { Alert, Platform } from 'react-native';

// ✅ IP CORRECTA Y CONSISTENTE
const API_BASE_URL = 'http://192.168.100.236:3001/api';

console.log('🌐 Conectando a:', API_BASE_URL);

const api = axios.create({
  baseURL: API_BASE_URL,
  timeout: 15000,
  headers: {
    'Content-Type': 'application/json',
  },
});

api.interceptors.response.use(
  (response) => {
    console.log('✅ Respuesta exitosa:', response.config.url);
    return response;
  },
  (error) => {
    console.error('❌ Error:', error.message);
    return Promise.reject(error);
  }
);

export default api;
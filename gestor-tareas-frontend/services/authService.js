import apiService from './api.js';

export const authService = {
  /**
   * Iniciar sesión en la aplicación
   * @param {string} identifier - Puede ser username o email
   * @param {string} password - Contraseña del usuario
   */
  async login(identifier, password) {
    console.log('🔐 ========== AUTH SERVICE: LOGIN ==========');
    console.log('📧 Identificador recibido:', identifier);
    console.log('🔑 Password recibido:', password ? '***' : 'VACÍO');
    
    // Validaciones básicas
    if (!identifier || !password) {
      console.error('❌ ERROR: Identificador o password vacíos');
      throw new Error('Usuario y contraseña son requeridos');
    }
    
    // Preparar datos para el backend
    // IMPORTANTE: Tu backend espera "username" como campo
    const loginData = {
      username: identifier,  // Siempre envía como username
      password: password
    };
    
    console.log('📦 Datos a enviar al backend:', {
      ...loginData,
      password: '***' // No mostrar password en logs
    });
    
    try {
      console.log('🚀 Enviando petición a /api/auth/login...');
      
      const response = await apiService.post('/api/auth/login', loginData);
      
      console.log('✅ RESPUESTA DEL BACKEND:');
      console.log('   Success:', response.success);
      console.log('   Message:', response.message);
      console.log('   Token recibido:', response.token ? 'SÍ (' + response.token.substring(0, 20) + '...)' : 'NO');
      console.log('   Usuario:', response.user);
      
      if (response.success && response.token) {
        // Guardar token y datos del usuario
        try {
          await this.saveAuthData(response.token, response.user);
          console.log('💾 Datos de autenticación guardados');
        } catch (saveError) {
          console.warn('⚠️  No se pudieron guardar datos de autenticación:', saveError);
        }
      }
      
      console.log('🔐 ========== FIN AUTH SERVICE ==========');
      
      return response;
      
    // En authService.js, en la función login, modifica el catch:
    // En authService.js, en la función login, modifica el catch:
    } catch (error) {
      console.error('❌ ERROR en authService.login():');
      
      // Extraer mensaje de error de forma segura
      let errorMessage = 'Error de conexión con el servidor';
      
      if (error.response?.data?.error) {
        errorMessage = error.response.data.error;
      } else if (error.response?.data?.message) {
        errorMessage = error.response.data.message;
      } else if (error.message) {
        errorMessage = error.message;
      }
      
      console.error('   Mensaje final:', errorMessage);
      
      // Crear un nuevo error con mensaje amigable
      const friendlyError = new Error(errorMessage);
      
      // Preservar la respuesta original si existe (manejo seguro de tipos)
      if (error.response) {
        // Usar type assertion segura
        Object.assign(friendlyError, { response: error.response });
      }
      
      throw friendlyError;
    }
  },

  /**
   * Registrar nuevo usuario
   * @param {object} userData - Datos del usuario
   */
  async register(userData) {
    console.log('📝 ========== AUTH SERVICE: REGISTER ==========');
    console.log('📦 Datos recibidos:', userData);
    
    try {
      const response = await apiService.post('/api/auth/register', userData);
      console.log('✅ Registro exitoso:', response);
      console.log('📝 ========== FIN REGISTER ==========');
      return response;
    } catch (error) {
      console.error('❌ Error en registro:', error);
      throw error;
    }
  },

  /**
   * Cerrar sesión
   */
  async logout() {
    console.log('🚪 ========== AUTH SERVICE: LOGOUT ==========');
    try {
      // Limpiar datos locales primero
      await this.clearAuthData();
      
      // Llamar al backend si es necesario
      const response = await apiService.post('/api/auth/logout');
      console.log('✅ Logout exitoso:', response);
      console.log('🚪 ========== FIN LOGOUT ==========');
      return response;
    } catch (error) {
      console.error('❌ Error en logout:', error);
      // Aun así limpiar datos locales
      await this.clearAuthData();
      throw error;
    }
  },

  /**
   * Obtener perfil del usuario
   */
  async getProfile() {
    console.log('👤 ========== AUTH SERVICE: GET PROFILE ==========');
    try {
      const response = await apiService.get('/api/auth/profile');
      console.log('✅ Perfil obtenido:', response);
      console.log('👤 ========== FIN PROFILE ==========');
      return response;
    } catch (error) {
      console.error('❌ Error obteniendo perfil:', error);
      throw error;
    }
  },

  /**
   * Verificar si el usuario está autenticado
   */
  async isAuthenticated() {
    try {
      const token = await this.getToken();
      return !!token;
    } catch (error) {
      return false;
    }
  },

  /**
   * Guardar datos de autenticación
   * @private
   */
  async saveAuthData(token, user) {
    try {
      // Usar AsyncStorage en React Native
      const AsyncStorage = await import('@react-native-async-storage/async-storage').then(m => m.default);
      
      await AsyncStorage.setItem('userToken', token);
      await AsyncStorage.setItem('userData', JSON.stringify(user));
      
      console.log('💾 Token y datos de usuario guardados');
    } catch (error) {
      console.warn('⚠️  No se pudo guardar en AsyncStorage:', error);
      // Fallback a localStorage para web
      if (typeof localStorage !== 'undefined') {
        localStorage.setItem('userToken', token);
        localStorage.setItem('userData', JSON.stringify(user));
      }
    }
  },

  /**
   * Limpiar datos de autenticación
   * @private
   */
  async clearAuthData() {
    try {
      const AsyncStorage = await import('@react-native-async-storage/async-storage').then(m => m.default);
      await AsyncStorage.removeItem('userToken');
      await AsyncStorage.removeItem('userData');
      console.log('🧹 Datos de autenticación eliminados');
    } catch (error) {
      if (typeof localStorage !== 'undefined') {
        localStorage.removeItem('userToken');
        localStorage.removeItem('userData');
      }
    }
  },

  /**
   * Obtener token almacenado
   * @private
   */
  async getToken() {
    try {
      const AsyncStorage = await import('@react-native-async-storage/async-storage').then(m => m.default);
      return await AsyncStorage.getItem('userToken');
    } catch (error) {
      if (typeof localStorage !== 'undefined') {
        return localStorage.getItem('userToken');
      }
      return null;
    }
  },

  /**
   * Obtener datos del usuario almacenados
   * @private
   */
  async getUserData() {
    try {
      const AsyncStorage = await import('@react-native-async-storage/async-storage').then(m => m.default);
      const userData = await AsyncStorage.getItem('userData');
      return userData ? JSON.parse(userData) : null;
    } catch (error) {
      if (typeof localStorage !== 'undefined') {
        const userData = localStorage.getItem('userData');
        return userData ? JSON.parse(userData) : null;
      }
      return null;
    }
  }
};
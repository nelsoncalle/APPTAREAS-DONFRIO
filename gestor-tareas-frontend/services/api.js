import axios from 'axios';

class ApiService {
  constructor() {
    this.baseURL = null;
    this.isConnected = false;
    this.init();
  }

  async init() {
    try {
      await this.detectBestUrl();
    } catch (error) {
      console.error('Error inicializando ApiService:', error);
    }
  }

  async detectBestUrl() {
    console.log('🔍 Detectando servidor backend...');
    
    // === ¡¡¡TUS IPs REALES!!! ===
    const urlCandidates = [
      // 1. PRIMERO: Tu IP de WiFi REAL (la que mostró tu servidor)
      'http://172.17.87.26:3001',
      
      // 2. SEGUNDO: Tu IP de Ethernet
      'http://172.20.48.1:3001',
      
      // 3. Si inicias ngrok manualmente, descomenta esta línea:
      // 'https://apptareas-donfrio.ngrok.io',
      
      // 4. Para desarrollo local (emulador)
      'http://localhost:3001',
      
      // 5. Para Android emulator
      'http://10.0.2.2:3001',
    ];

    console.log('📋 URLs a probar:');
    urlCandidates.forEach(url => console.log(`   - ${url}`));

    // Probar cada URL
    for (const url of urlCandidates) {
      console.log(`\n🔍 Probando conexión a: ${url}`);
      
      const isConnected = await this.testConnection(url);
      if (isConnected) {
        this.baseURL = url;
        this.isConnected = true;
        console.log(`✅ ¡CONECTADO! Usando: ${url}`);
        
        // Intentar guardar para futuras sesiones
        try {
          if (typeof localStorage !== 'undefined') {
            localStorage.setItem('api_base_url', url);
          }
        } catch (e) {
          // Ignorar error en React Native
        }
        
        return url;
      }
    }

    console.error('❌ ERROR: No se pudo conectar a ninguna URL');
    this.isConnected = false;
    
    // Mensaje de ayuda
    console.log('\n💡 SOLUCIÓN:');
    console.log('1. Asegúrate que el servidor backend esté corriendo');
    console.log('2. Verifica que tu teléfono esté en la MISMA WiFi');
    console.log('3. Prueba estas URLs en tu navegador:');
    console.log('   - http://192.168.3.91:3001/api/health');
    console.log('   - http://172.20.48.1:3001/api/health');
    
    throw new Error('No se pudo conectar al servidor. ¿Está corriendo el backend?');
  }

  async testConnection(url) {
    try {
      console.log(`   Probando: ${url}/api/health`);
      
      const controller = new AbortController();
      const timeoutId = setTimeout(() => controller.abort(), 3000);
      
      const response = await axios.get(`${url}/api/health`, {
        signal: controller.signal,
        timeout: 3000,
        validateStatus: function (status) {
          return status >= 200 && status < 500; // Aceptar más códigos para debug
        }
      });
      
      clearTimeout(timeoutId);
      
      if (response.status === 200) {
        console.log(`   ✅ Respuesta recibida: ${response.status}`);
        console.log(`   📊 Datos:`, response.data);
        return true;
      } else {
        console.log(`   ⚠️  Respuesta inesperada: ${response.status}`);
        return false;
      }
      
    } catch (error) {
      if (error.name === 'AbortError' || error.code === 'ECONNABORTED') {
        console.log(`   ⏱️  Timeout: No hay respuesta en 3 segundos`);
      } else if (error.code === 'ECONNREFUSED' || error.response?.status === 0) {
        console.log(`   🔌 Conexión rechazada: El servidor no responde`);
      } else if (error.message.includes('Network Error')) {
        console.log(`   📡 Error de red: No se puede alcanzar la URL`);
      } else {
        console.log(`   ❌ Error: ${error.message}`);
      }
      return false;
    }
  }

  async request(method, endpoint, data = null, headers = {}) {
    // Si no tenemos URL base, detectarla
    if (!this.baseURL || !this.isConnected) {
      console.log('🔄 Reconectando...');
      await this.detectBestUrl();
    }

    const fullUrl = `${this.baseURL}${endpoint}`;
    console.log(`📡 ${method.toUpperCase()} ${fullUrl}`);
    
    if (data) {
      console.log(`📦 Datos enviados:`, data);
    }

    const config = {
      method,
      url: fullUrl,
      headers: {
        'Content-Type': 'application/json',
        ...headers
      },
      timeout: 10000, // 10 segundos
    };

    if (data) {
      config.data = data;
    }

    try {
      const response = await axios(config);
      console.log(`✅ Respuesta recibida: ${response.status}`);
      
      if (response.data) {
        console.log(`📊 Datos recibidos:`, 
          Array.isArray(response.data) ? 
          `Array con ${response.data.length} elementos` : 
          'Objeto recibido'
        );
      }
      
      return response.data;
      
    } catch (error) {
      console.error(`❌ Error en ${method} ${endpoint}:`, error.message);
      
      // Información detallada del error
      if (error.response) {
        console.error(`   Status: ${error.response.status}`);
        console.error(`   Data:`, error.response.data);
      }
      
      // Si es error de conexión, intentar reconectar
      if (error.code === 'ECONNREFUSED' || error.code === 'ECONNABORTED' || 
          error.message.includes('Network Error')) {
        console.log('🔄 Intentando reconexión automática...');
        
        try {
          await this.detectBestUrl();
          // Reintentar la petición con la nueva URL
          return this.request(method, endpoint, data, headers);
        } catch (reconnectError) {
          console.error('❌ Reconexión fallida');
          throw new Error('No se pudo conectar al servidor después de reintentar');
        }
      }
      
      throw error;
    }
  }

  async get(endpoint, headers = {}) {
    return this.request('GET', endpoint, null, headers);
  }

  async post(endpoint, data, headers = {}) {
    return this.request('POST', endpoint, data, headers);
  }

  async put(endpoint, data, headers = {}) {
    return this.request('PUT', endpoint, data, headers);
  }

  async delete(endpoint, headers = {}) {
    return this.request('DELETE', endpoint, null, headers);
  }

  // Método para forzar una nueva detección
  async forceReconnect() {
    console.log('🔄 Forzando reconexión...');
    this.baseURL = null;
    this.isConnected = false;
    return this.detectBestUrl();
  }

  // Obtener la URL actual
  getCurrentUrl() {
    return this.baseURL;
  }

  // Verificar estado de conexión
  checkConnection() {
    return this.isConnected;
  }
}

// Crear instancia global única
const apiService = new ApiService();

export default apiService;
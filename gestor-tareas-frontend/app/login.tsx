import React, { useState, useEffect } from 'react';
import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  Alert,
  StyleSheet,
  ActivityIndicator,
  KeyboardAvoidingView,
  Platform,
  ScrollView
} from 'react-native';
import { useRouter } from 'expo-router';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { authService } from '../services/authService';

// Definir tipo para el error
type ApiError = {
  message: string;
  response?: {
    data?: {
      error?: string;
    };
  };
};

export default function LoginScreen() {
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [loading, setLoading] = useState(false);
  const [rememberMe, setRememberMe] = useState(false);
  const router = useRouter();

  // Cargar credenciales guardadas al inicio
  useEffect(() => {
    loadSavedCredentials();
  }, []);

  const loadSavedCredentials = async () => {
    try {
      const savedUsername = await AsyncStorage.getItem('savedUsername');
      if (savedUsername) {
        setUsername(savedUsername);
        setRememberMe(true);
        console.log('📱 Credenciales cargadas:', savedUsername);
      }
    } catch (error) {
      console.log('⚠️  No se pudieron cargar credenciales guardadas');
    }
  };

  const handleLogin = async () => {
    console.log('🎯 ========== INICIO LOGIN ==========');
    
    // Validaciones
    if (!username.trim()) {
      Alert.alert('Error', 'Por favor ingresa tu nombre de usuario');
      return;
    }
    
    if (!password.trim()) {
      Alert.alert('Error', 'Por favor ingresa tu contraseña');
      return;
    }
    
    setLoading(true);
    
    try {
      console.log('🚀 Intentando login con:', {
        username,
        password: '***'
      });
      
      // Llamar al servicio de autenticación
      const result = await authService.login(username, password);
      
      console.log('🎉 Login exitoso!', {
        success: result.success,
        user: result.user?.username
      });
      
      // Guardar credenciales si "Recordarme" está activado
      if (rememberMe) {
        await AsyncStorage.setItem('savedUsername', username);
      } else {
        await AsyncStorage.removeItem('savedUsername');
      }
      
      // Guardar token y datos del usuario
      if (result.token && result.user) {
        await AsyncStorage.setItem('userToken', result.token);
        await AsyncStorage.setItem('userData', JSON.stringify(result.user));
        console.log('💾 Token y datos guardados');
      }
      
      // Navegar a la pantalla principal
      console.log('🔄 Navegando a pantalla principal...');
      router.replace('/(tabs)');
      
    } catch (error: unknown) {
      console.error('🔥 ERROR en login:', error);
      
      // Manejar el error de forma segura
      let errorMessage = 'Error de inicio de sesión';
      
      if (error instanceof Error) {
        // Error estándar de JavaScript
        console.error('   Mensaje:', error.message);
        
        if (error.message.includes('incorrectos')) {
          errorMessage = 'Usuario o contraseña incorrectos';
        } else if (error.message.includes('conexión') || error.message.includes('Network')) {
          errorMessage = 'Error de conexión. Verifica tu internet.';
        } else if (error.message.includes('servidor') || error.message.includes('timeout')) {
          errorMessage = 'El servidor no está disponible. Intenta más tarde.';
        } else {
          errorMessage = error.message;
        }
      } else if (typeof error === 'object' && error !== null) {
        // Error con estructura personalizada
        const apiError = error as ApiError;
        if (apiError.response?.data?.error) {
          errorMessage = apiError.response.data.error;
        } else if (apiError.message) {
          errorMessage = apiError.message;
        }
      }
      
      Alert.alert('Error', errorMessage);
      
    } finally {
      setLoading(false);
      console.log('🎯 ========== FIN LOGIN ==========');
    }
  };

  const handleTestLogin = (testUsername: string, testPassword: string) => {
    console.log('🧪 Cargando credenciales de prueba:', testUsername);
    setUsername(testUsername);
    setPassword(testPassword);
    
    // Mostrar alerta informativa
    Alert.alert(
      'Datos de prueba cargados',
      `Usuario: ${testUsername}\nContraseña: ${testPassword}`,
      [{ text: 'OK' }]
    );
  };

  return (
    <KeyboardAvoidingView 
      style={styles.container}
      behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
    >
      <ScrollView contentContainerStyle={styles.scrollContainer}>
        <View style={styles.header}>
          <Text style={styles.title}>App Tareas DonFrío</Text>
          <Text style={styles.subtitle}>Gestión de Tareas y Trabajadores</Text>
        </View>
        
        <View style={styles.formContainer}>
          <Text style={styles.formTitle}>Iniciar Sesión</Text>
          
          <View style={styles.inputGroup}>
            <Text style={styles.label}>Usuario:</Text>
            <TextInput
              style={styles.input}
              placeholder="Ingresa tu usuario"
              placeholderTextColor="#999"
              value={username}
              onChangeText={setUsername}
              autoCapitalize="none"
              autoCorrect={false}
              editable={!loading}
            />
          </View>
          
          <View style={styles.inputGroup}>
            <Text style={styles.label}>Contraseña:</Text>
            <TextInput
              style={styles.input}
              placeholder="••••••••"
              placeholderTextColor="#999"
              value={password}
              onChangeText={setPassword}
              secureTextEntry
              editable={!loading}
            />
          </View>
          
          <View style={styles.rememberContainer}>
            <TouchableOpacity 
              style={styles.rememberCheckbox}
              onPress={() => setRememberMe(!rememberMe)}
            >
              <View style={[styles.checkbox, rememberMe && styles.checkboxChecked]}>
                {rememberMe && <Text style={styles.checkmark}>✓</Text>}
              </View>
              <Text style={styles.rememberText}>Recordar usuario</Text>
            </TouchableOpacity>
          </View>
          
          <TouchableOpacity
            style={[styles.loginButton, loading && styles.loginButtonDisabled]}
            onPress={handleLogin}
            disabled={loading}
          >
            {loading ? (
              <ActivityIndicator color="#fff" />
            ) : (
              <Text style={styles.loginButtonText}>Iniciar Sesión</Text>
            )}
          </TouchableOpacity>
          
          {/* Botones de prueba rápida */}
          <View style={styles.testSection}>
            <Text style={styles.testTitle}>Pruebas rápidas:</Text>
            
            <TouchableOpacity 
              style={styles.testButton}
              onPress={() => handleTestLogin('nelson', 'nelson7')}
            >
              <Text style={styles.testButtonText}>Usuario: nelson</Text>
            </TouchableOpacity>
            
            <TouchableOpacity 
              style={styles.testButton}
              onPress={() => handleTestLogin('admin', 'admin123')}
            >
              <Text style={styles.testButtonText}>Usuario: admin</Text>
            </TouchableOpacity>
            
            <TouchableOpacity 
              style={[styles.testButton, styles.testButtonSecondary]}
              onPress={() => {
                console.log('🚀 Saltando login (modo desarrollo)');
                router.replace('/(tabs)');
              }}
            >
              <Text style={styles.testButtonSecondaryText}>Entrar sin login</Text>
            </TouchableOpacity>
          </View>
          
          {/* Información de ayuda */}
          <View style={styles.helpContainer}>
            <Text style={styles.helpText}>
              💡 Usa "nelson" como usuario y "nelson7" como contraseña
            </Text>
            <Text style={styles.helpText}>
              🔧 Si hay problemas, verifica que el backend esté corriendo
            </Text>
          </View>
        </View>
        
        <View style={styles.footer}>
          <Text style={styles.footerText}>DonFrío App © 2025</Text>
          <Text style={styles.footerText}>Versión 1.0.0</Text>
        </View>
      </ScrollView>
    </KeyboardAvoidingView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#f8f9fa'
  },
  scrollContainer: {
    flexGrow: 1,
    justifyContent: 'center',
    paddingHorizontal: 20,
    paddingVertical: 30
  },
  header: {
    alignItems: 'center',
    marginBottom: 40
  },
  title: {
    fontSize: 32,
    fontWeight: 'bold',
    color: '#2c3e50',
    marginBottom: 8
  },
  subtitle: {
    fontSize: 16,
    color: '#7f8c8d',
    textAlign: 'center'
  },
  formContainer: {
    backgroundColor: 'white',
    borderRadius: 15,
    padding: 25,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.1,
    shadowRadius: 8,
    elevation: 5,
    marginBottom: 30
  },
  formTitle: {
    fontSize: 24,
    fontWeight: '600',
    color: '#2c3e50',
    marginBottom: 25,
    textAlign: 'center'
  },
  inputGroup: {
    marginBottom: 20
  },
  label: {
    fontSize: 16,
    fontWeight: '500',
    color: '#34495e',
    marginBottom: 8
  },
  input: {
    borderWidth: 1,
    borderColor: '#ddd',
    borderRadius: 10,
    paddingHorizontal: 15,
    paddingVertical: 14,
    fontSize: 16,
    backgroundColor: '#fafafa'
  },
  rememberContainer: {
    marginBottom: 25
  },
  rememberCheckbox: {
    flexDirection: 'row',
    alignItems: 'center'
  },
  checkbox: {
    width: 20,
    height: 20,
    borderWidth: 2,
    borderColor: '#3498db',
    borderRadius: 4,
    marginRight: 10,
    justifyContent: 'center',
    alignItems: 'center'
  },
  checkboxChecked: {
    backgroundColor: '#3498db'
  },
  checkmark: {
    color: 'white',
    fontWeight: 'bold',
    fontSize: 14
  },
  rememberText: {
    color: '#7f8c8d',
    fontSize: 14
  },
  loginButton: {
    backgroundColor: '#3498db',
    borderRadius: 10,
    paddingVertical: 16,
    alignItems: 'center',
    marginBottom: 20
  },
  loginButtonDisabled: {
    backgroundColor: '#95a5a6'
  },
  loginButtonText: {
    color: 'white',
    fontSize: 18,
    fontWeight: '600'
  },
  testSection: {
    borderTopWidth: 1,
    borderTopColor: '#eee',
    paddingTop: 20,
    marginBottom: 20
  },
  testTitle: {
    fontSize: 16,
    fontWeight: '500',
    color: '#7f8c8d',
    marginBottom: 10,
    textAlign: 'center'
  },
  testButton: {
    backgroundColor: '#2ecc71',
    borderRadius: 8,
    paddingVertical: 12,
    alignItems: 'center',
    marginBottom: 10
  },
  testButtonSecondary: {
    backgroundColor: 'transparent',
    borderWidth: 1,
    borderColor: '#3498db'
  },
  testButtonText: {
    color: 'white',
    fontWeight: '500'
  },
  testButtonSecondaryText: {
    color: '#3498db',
    fontWeight: '500'
  },
  helpContainer: {
    backgroundColor: '#f8f9fa',
    borderRadius: 10,
    padding: 15,
    marginTop: 10
  },
  helpText: {
    color: '#7f8c8d',
    fontSize: 12,
    marginBottom: 5
  },
  footer: {
    alignItems: 'center',
    marginTop: 20
  },
  footerText: {
    color: '#95a5a6',
    fontSize: 12,
    marginBottom: 5
  }
});
import React, { useState } from 'react';
import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  Alert,
  KeyboardAvoidingView,
  Platform,
  TouchableWithoutFeedback,
  Keyboard,
  ScrollView,
  StatusBar
} from 'react-native';
import { useRouter } from 'expo-router';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { authService } from '../services/authService';

export default function LoginScreen() {
  const [correo, setCorreo] = useState('');
  const [contrasena, setContrasena] = useState('');
  const [loading, setLoading] = useState(false);
  const router = useRouter();

  const handleLogin = async () => {
    if (!correo || !contrasena) {
      Alert.alert('Error', 'Por favor completa todos los campos');
      return;
    }

    setLoading(true);
    try {
      const result = await authService.login(correo, contrasena);
      
      // Guardar token y usuario
      await AsyncStorage.setItem('userToken', result.token);
      await AsyncStorage.setItem('userData', JSON.stringify(result.usuario));
      
      // Navegar al home
      router.replace('/(tabs)');
    } catch (error: any) {
      Alert.alert('Error', error.message || 'Error en el login');
    } finally {
      setLoading(false);
    }
  };

  return (
    <KeyboardAvoidingView 
      style={{ flex: 1, backgroundColor: '#f8f9fa' }}
      behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
    >
      <StatusBar barStyle="dark-content" backgroundColor="#fff" />
      
      <TouchableWithoutFeedback onPress={Keyboard.dismiss}>
        <ScrollView 
          contentContainerStyle={{ 
            flexGrow: 1, 
            justifyContent: 'center', 
            paddingHorizontal: 25,
            paddingTop: Platform.OS === 'ios' ? 60 : 40,
            paddingBottom: 30
          }}
          keyboardShouldPersistTaps="handled"
        >
          <View style={{ alignItems: 'center', marginBottom: 40 }}>
            <Text style={{ fontSize: 28, fontWeight: 'bold', color: '#2c3e50', marginBottom: 5 }}>
              Gestor de Tareas
            </Text>
            <Text style={{ fontSize: 16, color: '#7f8c8d' }}>Don Frío</Text>
          </View>

          <View style={{ width: '100%' }}>
            <TextInput
              style={{
                backgroundColor: '#fff',
                borderWidth: 1,
                borderColor: '#ddd',
                borderRadius: 12,
                paddingHorizontal: 15,
                paddingVertical: Platform.OS === 'ios' ? 15 : 12,
                fontSize: 16,
                marginBottom: 15,
              }}
              placeholder="Usuario"
              placeholderTextColor="#999"
              value={correo}
              onChangeText={setCorreo}
              autoCapitalize="none"
            
            />
            
            <TextInput
              style={{
                backgroundColor: '#fff',
                borderWidth: 1,
                borderColor: '#ddd',
                borderRadius: 12,
                paddingHorizontal: 15,
                paddingVertical: Platform.OS === 'ios' ? 15 : 12,
                fontSize: 16,
                marginBottom: 15,
              }}
              placeholder="Contraseña"
              placeholderTextColor="#999"
              value={contrasena}
              onChangeText={setContrasena}
              secureTextEntry
            />
            
            <TouchableOpacity 
              style={{
                backgroundColor: loading ? '#bdc3c7' : '#3498db',
                paddingVertical: 15,
                borderRadius: 12,
                alignItems: 'center',
                marginTop: 10,
              }}
              onPress={handleLogin}
              disabled={loading}
            >
              <Text style={{ color: '#fff', fontSize: 16, fontWeight: '600' }}>
                {loading ? 'Iniciando...' : 'Iniciar Sesión'}
              </Text>
            </TouchableOpacity>
          </View>
        </ScrollView>
      </TouchableWithoutFeedback>
    </KeyboardAvoidingView>
  );
}
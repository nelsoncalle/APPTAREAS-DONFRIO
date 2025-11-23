import React, { useState } from 'react';
import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  Alert,
  ScrollView,
  Modal
} from 'react-native';
import { useRouter } from 'expo-router';
import { authService } from '../services/authService';

export default function CreateUserModal() {
  const [nombre, setNombre] = useState('');
  const [email, setEmail] = useState('');
  const [contrasena, setContrasena] = useState('');
  const [loading, setLoading] = useState(false);
  const router = useRouter();

  const handleCreateUser = async () => {
    if (!nombre || !email || !contrasena) {
      Alert.alert('Error', 'Por favor completa todos los campos');
      return;
    }

    if (contrasena.length < 6) {
      Alert.alert('Error', 'La contraseña debe tener al menos 6 caracteres');
      return;
    }

    setLoading(true);
    try {
      const userData = {
        nombre,
        email,
        contrasena,
        rol: 'usuario' // Siempre crea usuarios normales
      };

      await authService.register(userData);
      Alert.alert('Éxito', 'Usuario creado correctamente');
      router.back();
    } catch (error: any) {
      Alert.alert('Error', error.message || 'Error al crear el usuario');
    } finally {
      setLoading(false);
    }
  };

  const handleCancel = () => {
    router.back();
  };

  return (
    <Modal
      animationType="slide"
      presentationStyle="pageSheet"
      visible={true}
      onRequestClose={handleCancel}
    >
      <View style={{ flex: 1, padding: 20, backgroundColor: '#f8f9fa' }}>
        <View style={{ flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', marginBottom: 20 }}>
          <Text style={{ fontSize: 24, fontWeight: 'bold', color: '#2c3e50' }}>Crear Usuario</Text>
          <TouchableOpacity onPress={handleCancel}>
            <Text style={{ color: '#e74c3c', fontWeight: '600' }}>Cancelar</Text>
          </TouchableOpacity>
        </View>

        <ScrollView showsVerticalScrollIndicator={false}>
          <Text style={{ color: '#7f8c8d', marginBottom: 15 }}>
            Crear nuevo usuario normal para el sistema
          </Text>

          <TextInput
            style={{
              backgroundColor: '#fff',
              borderWidth: 1,
              borderColor: '#ddd',
              borderRadius: 12,
              paddingHorizontal: 15,
              paddingVertical: 12,
              fontSize: 16,
              marginBottom: 15,
            }}
            placeholder="Nombre completo *"
            value={nombre}
            onChangeText={setNombre}
          />

          <TextInput
            style={{
              backgroundColor: '#fff',
              borderWidth: 1,
              borderColor: '#ddd',
              borderRadius: 12,
              paddingHorizontal: 15,
              paddingVertical: 12,
              fontSize: 16,
              marginBottom: 15,
            }}
            placeholder="Email *"
            value={email}
            onChangeText={setEmail}
            autoCapitalize="none"
            keyboardType="email-address"
          />

          <TextInput
            style={{
              backgroundColor: '#fff',
              borderWidth: 1,
              borderColor: '#ddd',
              borderRadius: 12,
              paddingHorizontal: 15,
              paddingVertical: 12,
              fontSize: 16,
              marginBottom: 20,
            }}
            placeholder="Contraseña *"
            value={contrasena}
            onChangeText={setContrasena}
            secureTextEntry
          />

          <Text style={{ color: '#7f8c8d', fontSize: 12, marginBottom: 20 }}>
            * La contraseña debe tener al menos 6 caracteres
          </Text>

          <TouchableOpacity 
            style={{
              backgroundColor: loading ? '#bdc3c7' : '#e67e22',
              paddingVertical: 15,
              borderRadius: 12,
              alignItems: 'center',
              marginTop: 10,
            }}
            onPress={handleCreateUser}
            disabled={loading}
          >
            <Text style={{ color: '#fff', fontSize: 16, fontWeight: '600' }}>
              {loading ? 'Creando...' : 'Crear Usuario'}
            </Text>
          </TouchableOpacity>
        </ScrollView>
      </View>
    </Modal>
  );
}
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
import { workerService } from '../services/workerService';

export default function CreateWorkerModal() {
  const [nombre, setNombre] = useState('');
  const [cargo, setCargo] = useState('');
  const [email, setEmail] = useState('');
  const [telefono, setTelefono] = useState('');
  const [loading, setLoading] = useState(false);
  const router = useRouter();

  const handleCreateWorker = async () => {
    if (!nombre || !cargo || !email) {
      Alert.alert('Error', 'Por favor completa los campos obligatorios: Nombre, Cargo y Email');
      return;
    }

    setLoading(true);
    try {
      const workerData = {
        nombre,
        cargo,
        email,
        telefono: telefono || null
      };

      await workerService.createWorker(workerData);
      Alert.alert('Éxito', 'Trabajador creado correctamente');
      router.back();
    } catch (error: any) {
      Alert.alert('Error', error.message || 'Error al crear el trabajador');
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
          <Text style={{ fontSize: 24, fontWeight: 'bold', color: '#2c3e50' }}>Crear Trabajador</Text>
          <TouchableOpacity onPress={handleCancel}>
            <Text style={{ color: '#e74c3c', fontWeight: '600' }}>Cancelar</Text>
          </TouchableOpacity>
        </View>

        <ScrollView showsVerticalScrollIndicator={false}>
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
            placeholder="Cargo *"
            value={cargo}
            onChangeText={setCargo}
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
            placeholder="Teléfono (opcional)"
            value={telefono}
            onChangeText={setTelefono}
            keyboardType="phone-pad"
          />

          <TouchableOpacity 
            style={{
              backgroundColor: loading ? '#bdc3c7' : '#9b59b6',
              paddingVertical: 15,
              borderRadius: 12,
              alignItems: 'center',
              marginTop: 10,
            }}
            onPress={handleCreateWorker}
            disabled={loading}
          >
            <Text style={{ color: '#fff', fontSize: 16, fontWeight: '600' }}>
              {loading ? 'Creando...' : 'Crear Trabajador'}
            </Text>
          </TouchableOpacity>
        </ScrollView>
      </View>
    </Modal>
  );
}
import React, { useState, useEffect } from 'react';
import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  Alert,
  ScrollView,
  Platform,
  Modal,
  Image
} from 'react-native';
import { useRouter } from 'expo-router';
import DateTimePicker from '@react-native-community/datetimepicker';
import * as ImagePicker from 'expo-image-picker';
import { taskService } from '../services/taskService';
import { workerService } from '../services/workerService';
import AsyncStorage from '@react-native-async-storage/async-storage';

interface Trabajador {
  id: number;
  nombre: string;
  cargo: string;
}

export default function CreateTaskModal() {
  const [titulo, setTitulo] = useState('');
  const [descripcion, setDescripcion] = useState('');
  const [idTrabajador, setIdTrabajador] = useState('');
  const [fechaLimite, setFechaLimite] = useState(new Date());
  const [showDatePicker, setShowDatePicker] = useState(false);
  const [trabajadores, setTrabajadores] = useState<Trabajador[]>([]);
  const [foto, setFoto] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);
  const router = useRouter();

  useEffect(() => {
    loadTrabajadores();
  }, []);

  const loadTrabajadores = async () => {
    try {
      const trabajadoresData = await workerService.getAllWorkers();
      setTrabajadores(trabajadoresData);
    } catch (error: any) {
      Alert.alert('Error', error.message || 'No se pudieron cargar los trabajadores');
    }
  };

  const seleccionarFoto = async () => {
    try {
      const { status } = await ImagePicker.requestMediaLibraryPermissionsAsync();
      
      if (status !== 'granted') {
        Alert.alert('Permiso requerido', 'Se necesita acceso a la galería para seleccionar fotos');
        return;
      }

      const result = await ImagePicker.launchImageLibraryAsync({
        mediaTypes: ImagePicker.MediaTypeOptions.Images,
        allowsEditing: true,
        aspect: [4, 3],
        quality: 0.7,
      });

      if (!result.canceled && result.assets[0]) {
        setFoto(result.assets[0].uri);
      }
    } catch (error) {
      Alert.alert('Error', 'No se pudo seleccionar la foto');
    }
  };

  const handleCreateTask = async () => {
    if (!titulo || !descripcion || !idTrabajador) {
      Alert.alert('Error', 'Por favor completa todos los campos obligatorios');
      return;
    }

    setLoading(true);
    try {
      const userData = await AsyncStorage.getItem('userData');
      const user = userData ? JSON.parse(userData) : null;

      const taskData = {
        titulo,
        descripcion,
        id_trabajador: parseInt(idTrabajador),
        estado: 'pendiente',
        fecha_limite: fechaLimite.toISOString().split('T')[0],
        id_usuario: user.id,
        foto: foto ? {
          uri: foto,
          type: 'image/jpeg',
          name: `tarea_${Date.now()}.jpg`
        } : null
      };

      await taskService.createTask(taskData);
      Alert.alert('Éxito', 'Tarea creada correctamente');
      router.back();
    } catch (error: any) {
      Alert.alert('Error', error.message || 'Error al crear la tarea');
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
          <Text style={{ fontSize: 24, fontWeight: 'bold', color: '#2c3e50' }}>Crear Tarea</Text>
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
            placeholder="Título de la tarea *"
            value={titulo}
            onChangeText={setTitulo}
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
              height: 100,
              textAlignVertical: 'top',
            }}
            placeholder="Descripción *"
            value={descripcion}
            onChangeText={setDescripcion}
            multiline
            numberOfLines={4}
          />

          <Text style={{ fontSize: 16, fontWeight: '600', marginBottom: 10, color: '#2c3e50' }}>Asignar a:</Text>
          <ScrollView horizontal showsHorizontalScrollIndicator={false} style={{ marginBottom: 15 }}>
            {trabajadores.map(trabajador => (
              <TouchableOpacity
                key={trabajador.id}
                style={{
                  backgroundColor: idTrabajador === trabajador.id.toString() ? '#3498db' : '#fff',
                  padding: 12,
                  borderRadius: 8,
                  marginRight: 10,
                  borderWidth: 1,
                  borderColor: idTrabajador === trabajador.id.toString() ? '#3498db' : '#ddd',
                  minWidth: 100,
                  alignItems: 'center',
                }}
                onPress={() => setIdTrabajador(trabajador.id.toString())}
              >
                <Text style={{ 
                  color: idTrabajador === trabajador.id.toString() ? '#fff' : '#2c3e50',
                  fontWeight: '600',
                  textAlign: 'center'
                }}>
                  {trabajador.nombre}
                </Text>
                <Text style={{ 
                  color: idTrabajador === trabajador.id.toString() ? '#ecf0f1' : '#7f8c8d',
                  fontSize: 12,
                  textAlign: 'center',
                  marginTop: 4
                }}>
                  {trabajador.cargo}
                </Text>
              </TouchableOpacity>
            ))}
          </ScrollView>

          <Text style={{ fontSize: 16, fontWeight: '600', marginBottom: 10, color: '#2c3e50' }}>Fecha límite:</Text>
          <TouchableOpacity 
            style={{
              backgroundColor: '#fff',
              borderWidth: 1,
              borderColor: '#ddd',
              borderRadius: 12,
              padding: 15,
              marginBottom: 20,
            }}
            onPress={() => setShowDatePicker(true)}
          >
            <Text style={{ color: '#2c3e50' }}>
              {fechaLimite.toLocaleDateString('es-ES', { 
                weekday: 'long', 
                year: 'numeric', 
                month: 'long', 
                day: 'numeric' 
              })}
            </Text>
          </TouchableOpacity>

          {showDatePicker && (
            <DateTimePicker
              value={fechaLimite}
              mode="date"
              display={Platform.OS === 'ios' ? 'spinner' : 'default'}
              onChange={(event, selectedDate) => {
                setShowDatePicker(false);
                if (selectedDate) setFechaLimite(selectedDate);
              }}
            />
          )}

          <Text style={{ fontSize: 16, fontWeight: '600', marginBottom: 10, color: '#2c3e50' }}>Foto (opcional):</Text>
          <TouchableOpacity 
            style={{
              backgroundColor: '#fff',
              borderWidth: 1,
              borderColor: '#ddd',
              borderRadius: 12,
              padding: 15,
              marginBottom: 20,
              alignItems: 'center'
            }}
            onPress={seleccionarFoto}
          >
            {foto ? (
              <Image source={{ uri: foto }} style={{ width: 100, height: 100, borderRadius: 8 }} />
            ) : (
              <Text style={{ color: '#7f8c8d' }}>Seleccionar foto</Text>
            )}
          </TouchableOpacity>

          <TouchableOpacity 
            style={{
              backgroundColor: loading ? '#bdc3c7' : '#27ae60',
              paddingVertical: 15,
              borderRadius: 12,
              alignItems: 'center',
              marginTop: 10,
            }}
            onPress={handleCreateTask}
            disabled={loading}
          >
            <Text style={{ color: '#fff', fontSize: 16, fontWeight: '600' }}>
              {loading ? 'Creando...' : 'Crear Tarea'}
            </Text>
          </TouchableOpacity>
        </ScrollView>
      </View>
    </Modal>
  );
}
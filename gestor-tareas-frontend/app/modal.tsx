// app/modal.tsx
import React, { useState, useEffect } from 'react';
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
import AsyncStorage from '@react-native-async-storage/async-storage';

// ⭐ IMPORTANTE: Como tus servicios son .js, los importas así:
import { workerService } from '../services/workerService';
import { taskService } from '../services/taskService';


// Tu interfaz (ajustada a tu base de datos)
interface Trabajador {
  id: number;
  name: string;          // "name" en MySQL
  contact_info?: string; // Campo opcional
}

export default function CreateTaskModal() {
  const [titulo, setTitulo] = useState('');
  const [descripcion, setDescripcion] = useState('');
  const [idTrabajador, setIdTrabajador] = useState('');
  const [fechaLimite, setFechaLimite] = useState('');
  const [trabajadores, setTrabajadores] = useState<Trabajador[]>([]);
  const [loading, setLoading] = useState(false);
  const [loadingWorkers, setLoadingWorkers] = useState(true);
  const router = useRouter();

  useEffect(() => {
    loadTrabajadores();
    // Establecer fecha por defecto (mañana)
    const manana = new Date();
    manana.setDate(manana.getDate() + 1);
    setFechaLimite(manana.toISOString().split('T')[0]);
  }, []);

  // ⭐⭐ FUNCIÓN loadTrabajadores CORREGIDA ⭐⭐
  const loadTrabajadores = async () => {
    try {
      setLoadingWorkers(true);
      const response = await workerService.getAllWorkers();
      
      console.log('Respuesta de trabajadores:', response);
      
      // Verifica la estructura de la respuesta
      if (response && response.success && Array.isArray(response.data)) {
        setTrabajadores(response.data);
      } else if (Array.isArray(response)) {
        // Si la API devuelve directamente un array
        setTrabajadores(response);
      } else {
        setTrabajadores([]);
        console.warn('Formato de respuesta inesperado:', response);
      }
    } catch (error) {
      console.error('Error cargando trabajadores:', error);
      Alert.alert('Error', 'No se pudieron cargar los trabajadores');
      setTrabajadores([]);
    } finally {
      setLoadingWorkers(false);
    }
  };

  // ⭐⭐ FUNCIÓN handleCreateTask ACTUALIZADA ⭐⭐
  // ⭐⭐ FUNCIÓN CORREGIDA - Enviar en ESPAÑOL ⭐⭐
const handleCreateTask = async () => {
  console.log('=== INICIANDO CREACIÓN DE TAREA ===');
  
  if (!titulo || !descripcion || !idTrabajador || !fechaLimite) {
    Alert.alert('Error', 'Por favor completa todos los campos obligatorios');
    return;
  }

  setLoading(true);
  
  try {
    // ⭐⭐ DATOS en ESPAÑOL (como espera tu backend) ⭐⭐
    const taskData = {
      titulo: titulo,                    // ⭐ "titulo" no "title"
      descripcion: descripcion,          // ⭐ "descripcion" no "description"
      fecha_limite: fechaLimite,         // ⭐ "fecha_limite" no "due_date"
      trabajador_id: parseInt(idTrabajador) // ⭐ "trabajador_id" no "assigned_to_worker_id"
      // ⭐ NOTA: No envíes status ni created_by_user_id
      // ⭐ El backend los asigna automáticamente
    };

    console.log('📤 Enviando datos (ESPAÑOL):', taskData);
    console.log('📤 JSON:', JSON.stringify(taskData));
    
    // ⭐⭐ TU IP: 192.168.1.27 ⭐⭐
    const API_URL = 'http://192.168.1.27:3001/api/tasks';
    console.log('🌐 URL:', API_URL);
    
    const response = await fetch(API_URL, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(taskData),
    });
    
    console.log('📥 Status:', response.status);
    console.log('📥 OK?', response.ok);
    
    const responseText = await response.text();
    console.log('📥 Respuesta texto:', responseText);
    
    let data;
    try {
      data = JSON.parse(responseText);
      console.log('📥 Respuesta JSON:', data);
    } catch (error) {
      console.error('❌ Error parseando JSON:', error);
      throw new Error('Respuesta inválida del servidor');
    }
    
    if (response.ok && data.success) {
      console.log('✅ TAREA CREADA CON ÉXITO');
      Alert.alert('✅ Éxito', 'Tarea creada correctamente');
      router.back();
    } else {
      console.log('❌ Error del servidor:', data);
      Alert.alert('❌ Error', data.error || data.message || 'Error al crear tarea');
    }
    
  } catch (error: any) {
    console.error('❌ Error completo:', error);
    Alert.alert('❌ Error', error.message || 'Error al crear la tarea');
  } finally {
    setLoading(false);
    console.log('=== FIN ===');
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
          
          {loadingWorkers ? (
            <Text style={{ marginBottom: 15, color: '#7f8c8d' }}>Cargando trabajadores...</Text>
          ) : !Array.isArray(trabajadores) || trabajadores.length === 0 ? (
            <View style={{ marginBottom: 15 }}>
              <Text style={{ color: '#e74c3c', marginBottom: 10 }}>
                No hay trabajadores disponibles
              </Text>
              <TouchableOpacity 
                style={{ backgroundColor: '#3498db', padding: 10, borderRadius: 8 }}
                onPress={() => router.push('/create-worker')}
              >
                <Text style={{ color: '#fff', textAlign: 'center' }}>
                  Crear Trabajador
                </Text>
              </TouchableOpacity>
            </View>
          ) : (
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
                    {trabajador.name} {/* ⭐ "name" no "nombre" */}
                  </Text>
                  {trabajador.contact_info && (
                    <Text style={{ 
                      color: idTrabajador === trabajador.id.toString() ? '#ecf0f1' : '#7f8c8d',
                      fontSize: 10,
                      textAlign: 'center',
                      marginTop: 4
                    }}>
                      {trabajador.contact_info.substring(0, 20)}...
                    </Text>
                  )}
                </TouchableOpacity>
              ))}
            </ScrollView>
          )}

          <Text style={{ fontSize: 16, fontWeight: '600', marginBottom: 10, color: '#2c3e50' }}>Fecha límite:</Text>
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
            placeholder="YYYY-MM-DD"
            value={fechaLimite}
            onChangeText={setFechaLimite}
          />
          <Text style={{ color: '#7f8c8d', fontSize: 12, marginBottom: 20 }}>
            Formato: Año-Mes-Día (ej: 2024-01-15)
          </Text>

          <TouchableOpacity 
            style={{
              backgroundColor: loading || trabajadores.length === 0 ? '#bdc3c7' : '#27ae60',
              paddingVertical: 15,
              borderRadius: 12,
              alignItems: 'center',
              marginTop: 10,
            }}
            onPress={handleCreateTask}
            disabled={loading || trabajadores.length === 0}
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
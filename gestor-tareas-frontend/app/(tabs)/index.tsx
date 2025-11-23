import React, { useEffect, useState } from 'react';
import { View, Text, TouchableOpacity, ScrollView, Alert } from 'react-native';
import { useRouter } from 'expo-router';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { taskService } from '../../services/taskService';
import { workerService } from '../../services/workerService';

export default function HomeScreen() {
  const [user, setUser] = useState<any>(null);
  const [tareasCount, setTareasCount] = useState(0);
  const [trabajadoresCount, setTrabajadoresCount] = useState(0);
  const [loading, setLoading] = useState(true);
  const router = useRouter();

  useEffect(() => {
    loadUserData();
    loadStats();
  }, []);

  const loadUserData = async () => {
    try {
      const userData = await AsyncStorage.getItem('userData');
      if (userData) {
        setUser(JSON.parse(userData));
      }
    } catch (error) {
      console.error('Error loading user data:', error);
    }
  };

  const loadStats = async () => {
    try {
      const [tareas, trabajadores] = await Promise.all([
        taskService.getAllTasks(),
        workerService.getAllWorkers()
      ]);
      
      setTareasCount(tareas.length);
      setTrabajadoresCount(trabajadores.length);
    } catch (error: any) {
      Alert.alert('Error', error.message || 'Error al cargar estadísticas');
    } finally {
      setLoading(false);
    }
  };

  const handleLogout = async () => {
    await AsyncStorage.removeItem('userToken');
    await AsyncStorage.removeItem('userData');
    router.replace('/login');
  };

  return (
    <ScrollView style={{ flex: 1, padding: 20, backgroundColor: '#f8f9fa' }}>
      {/* Header */}
      <View style={{ flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', marginBottom: 30 }}>
        <View>
          <Text style={{ fontSize: 24, fontWeight: 'bold', color: '#2c3e50' }}>
            ¡Hola, {user?.nombre || 'Usuario'}!
          </Text>
          <Text style={{ color: '#7f8c8d', marginTop: 5 }}>
            {user?.rol === 'superusuario' ? 'Superusuario' : 'Usuario'}
          </Text>
        </View>
        <TouchableOpacity onPress={handleLogout}>
          <Text style={{ color: '#e74c3c', fontWeight: '600' }}>Cerrar Sesión</Text>
        </TouchableOpacity>
      </View>

      {/* Estadísticas */}
      <View style={{ 
        backgroundColor: '#fff', 
        padding: 20, 
        borderRadius: 12, 
        marginBottom: 30,
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 2 },
        shadowOpacity: 0.1,
        shadowRadius: 3,
        elevation: 2
      }}>
        <Text style={{ fontSize: 18, fontWeight: '600', marginBottom: 15, color: '#2c3e50' }}>Resumen</Text>
        <View style={{ flexDirection: 'row', justifyContent: 'space-around' }}>
          <View style={{ alignItems: 'center' }}>
            <Text style={{ fontSize: 24, fontWeight: 'bold', color: '#3498db' }}>{tareasCount}</Text>
            <Text style={{ color: '#7f8c8d' }}>Tareas</Text>
          </View>
          <View style={{ alignItems: 'center' }}>
            <Text style={{ fontSize: 24, fontWeight: 'bold', color: '#9b59b6' }}>{trabajadoresCount}</Text>
            <Text style={{ color: '#7f8c8d' }}>Trabajadores</Text>
          </View>
        </View>
      </View>

      {/* Acciones rápidas */}
      <View style={{ marginBottom: 30 }}>
        <Text style={{ fontSize: 18, marginBottom: 15, color: '#7f8c8d' }}>Acciones rápidas:</Text>
        
        <TouchableOpacity 
          style={{ backgroundColor: '#3498db', padding: 15, borderRadius: 12, marginBottom: 10 }}
          onPress={() => router.push('/(tabs)/explore')}
        >
          <Text style={{ color: '#fff', textAlign: 'center', fontWeight: '600' }}>Ver Tareas</Text>
        </TouchableOpacity>

        <TouchableOpacity 
          style={{ backgroundColor: '#27ae60', padding: 15, borderRadius: 12, marginBottom: 10 }}
          onPress={() => router.push('/modal')}
        >
          <Text style={{ color: '#fff', textAlign: 'center', fontWeight: '600' }}>Crear Tarea</Text>
        </TouchableOpacity>

        <TouchableOpacity 
          style={{ backgroundColor: '#9b59b6', padding: 15, borderRadius: 12, marginBottom: 10 }}
          onPress={() => router.push('/(tabs)/workers')}
        >
          <Text style={{ color: '#fff', textAlign: 'center', fontWeight: '600' }}>Ver Trabajadores</Text>
        </TouchableOpacity>

        {user?.rol === 'superusuario' && (
          <TouchableOpacity 
            style={{ backgroundColor: '#e67e22', padding: 15, borderRadius: 12 }}
            onPress={() => Alert.alert('Próximamente', 'Funcionalidad de crear usuarios estará disponible pronto')}
          >
            <Text style={{ color: '#fff', textAlign: 'center', fontWeight: '600' }}>Crear Usuario</Text>
          </TouchableOpacity>
        )}
      </View>
    </ScrollView>
  );
}
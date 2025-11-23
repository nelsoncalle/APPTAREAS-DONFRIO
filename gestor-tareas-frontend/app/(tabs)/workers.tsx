import React, { useEffect, useState } from 'react';
import { View, Text, TouchableOpacity, FlatList, Alert, RefreshControl } from 'react-native';
import { useRouter } from 'expo-router';
import { workerService } from '../../services/workerService';

interface Trabajador {
  id: number;
  nombre: string;
  cargo: string;
  email: string;
  telefono: string;
}

export default function WorkersScreen() {
  const [trabajadores, setTrabajadores] = useState<Trabajador[]>([]);
  const [refreshing, setRefreshing] = useState(false);
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

  const onRefresh = async () => {
    setRefreshing(true);
    await loadTrabajadores();
    setRefreshing(false);
  };

  const renderTrabajadorItem = ({ item }: { item: Trabajador }) => (
    <TouchableOpacity style={{
      backgroundColor: '#fff',
      padding: 15,
      borderRadius: 12,
      marginBottom: 10,
      shadowColor: '#000',
      shadowOffset: { width: 0, height: 2 },
      shadowOpacity: 0.1,
      shadowRadius: 3,
      elevation: 2
    }}>
      <Text style={{ fontSize: 18, fontWeight: 'bold', marginBottom: 5, color: '#2c3e50' }}>
        {item.nombre}
      </Text>
      <Text style={{ color: '#7f8c8d', marginBottom: 5 }}>{item.cargo}</Text>
      <Text style={{ color: '#3498db', fontSize: 12 }}>{item.email}</Text>
      {item.telefono && (
        <Text style={{ color: '#95a5a6', fontSize: 12 }}>Tel: {item.telefono}</Text>
      )}
    </TouchableOpacity>
  );

  return (
    <View style={{ flex: 1, padding: 20, backgroundColor: '#f8f9fa' }}>
      <View style={{ flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', marginBottom: 20 }}>
        <Text style={{ fontSize: 24, fontWeight: 'bold', color: '#2c3e50' }}>Trabajadores</Text>
        <TouchableOpacity 
          style={{ backgroundColor: '#9b59b6', paddingHorizontal: 15, paddingVertical: 10, borderRadius: 8 }}
          onPress={() => router.push('/create-worker')}
        >
          <Text style={{ color: '#fff', fontWeight: '600' }}>+ Nuevo</Text>
        </TouchableOpacity>
      </View>

      <FlatList
        data={trabajadores}
        renderItem={renderTrabajadorItem}
        keyExtractor={(item) => item.id.toString()}
        refreshControl={
          <RefreshControl refreshing={refreshing} onRefresh={onRefresh} />
        }
        showsVerticalScrollIndicator={false}
        contentContainerStyle={{ paddingBottom: 20 }}
      />
    </View>
  );
}
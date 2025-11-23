import React, { useEffect, useState } from 'react';
import { View, Text, TouchableOpacity, FlatList, Alert, RefreshControl, Image } from 'react-native';
import { useRouter } from 'expo-router';
import { taskService } from '../../services/taskService';

interface Tarea {
  id: number;
  titulo: string;
  descripcion: string;
  estado: string;
  trabajador_nombre: string;
  fecha_limite: string;
  foto_url: string;
}

export default function TasksScreen() {
  const [tareas, setTareas] = useState<Tarea[]>([]);
  const [refreshing, setRefreshing] = useState(false);
  const router = useRouter();

  useEffect(() => {
    loadTareas();
  }, []);

  const loadTareas = async () => {
    try {
      const tareasData = await taskService.getAllTasks();
      setTareas(tareasData);
    } catch (error: any) {
      Alert.alert('Error', error.message || 'No se pudieron cargar las tareas');
    }
  };

  const onRefresh = async () => {
    setRefreshing(true);
    await loadTareas();
    setRefreshing(false);
  };

  const getEstadoColor = (estado: string) => {
    switch (estado) {
      case 'completada': return '#27ae60';
      case 'en_progreso': return '#f39c12';
      case 'pendiente': return '#e74c3c';
      default: return '#95a5a6';
    }
  };

  const formatFecha = (fecha: string) => {
    return new Date(fecha).toLocaleDateString('es-ES');
  };

  const renderTareaItem = ({ item }: { item: Tarea }) => (
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
      <View style={{ flexDirection: 'row', alignItems: 'flex-start' }}>
        {item.foto_url ? (
          <Image 
            source={{ uri: item.foto_url }} 
            style={{ width: 60, height: 60, borderRadius: 8, marginRight: 15 }}
          />
        ) : (
          <View style={{ width: 60, height: 60, backgroundColor: '#ecf0f1', borderRadius: 8, marginRight: 15, justifyContent: 'center', alignItems: 'center' }}>
            <Text style={{ color: '#7f8c8d', fontSize: 12 }}>Sin foto</Text>
          </View>
        )}
        
        <View style={{ flex: 1 }}>
          <Text style={{ fontSize: 18, fontWeight: 'bold', marginBottom: 5, color: '#2c3e50' }}>
            {item.titulo}
          </Text>
          <Text style={{ color: '#7f8c8d', marginBottom: 10 }} numberOfLines={2}>
            {item.descripcion}
          </Text>
          
          <View style={{ flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center' }}>
            <View>
              <Text style={{ color: '#3498db', fontSize: 12 }}>Asignado a: {item.trabajador_nombre}</Text>
              <Text style={{ color: '#95a5a6', fontSize: 12 }}>
                Vence: {formatFecha(item.fecha_limite)}
              </Text>
            </View>
            
            <View style={{ 
              backgroundColor: getEstadoColor(item.estado),
              paddingHorizontal: 8,
              paddingVertical: 4,
              borderRadius: 6
            }}>
              <Text style={{ color: '#fff', fontSize: 12, fontWeight: '600' }}>
                {item.estado.toUpperCase()}
              </Text>
            </View>
          </View>
        </View>
      </View>
    </TouchableOpacity>
  );

  return (
    <View style={{ flex: 1, padding: 20, backgroundColor: '#f8f9fa' }}>
      <View style={{ flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', marginBottom: 20 }}>
        <Text style={{ fontSize: 24, fontWeight: 'bold', color: '#2c3e50' }}>Tareas</Text>
        <TouchableOpacity 
          style={{ backgroundColor: '#3498db', paddingHorizontal: 15, paddingVertical: 10, borderRadius: 8 }}
          onPress={() => router.push('/modal')}
        >
          <Text style={{ color: '#fff', fontWeight: '600' }}>+ Nueva Tarea</Text>
        </TouchableOpacity>
      </View>

      <FlatList
        data={tareas}
        renderItem={renderTareaItem}
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
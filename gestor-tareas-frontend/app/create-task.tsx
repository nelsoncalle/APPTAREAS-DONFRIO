// app/create-task.tsx - VERSIÓN CORREGIDA
import React, { useState, useEffect } from 'react';
import { 
  View, 
  Text, 
  TextInput, 
  TouchableOpacity, 
  StyleSheet,
  Alert,
  ActivityIndicator,
  ScrollView,
  Platform,
  Modal,
  FlatList
} from 'react-native';
import { router } from 'expo-router';
import DateTimePicker from '@react-native-community/datetimepicker';

type Worker = {
  id: number;
  name: string;
  contact_info: string;
};

export default function CreateTaskScreen() {
  const [titulo, setTitulo] = useState('');
  const [descripcion, setDescripcion] = useState('');
  const [fechaLimite, setFechaLimite] = useState<Date | null>(null);
  const [trabajadorId, setTrabajadorId] = useState<number | null>(null);
  const [trabajadorNombre, setTrabajadorNombre] = useState('');
  const [loading, setLoading] = useState(false);
  const [loadingWorkers, setLoadingWorkers] = useState(true);
  const [workers, setWorkers] = useState<Worker[]>([]);
  const [showDatePicker, setShowDatePicker] = useState(false);
  const [showWorkerModal, setShowWorkerModal] = useState(false);
  const [showTimePicker, setShowTimePicker] = useState(false);
  const [selectedTime, setSelectedTime] = useState<string>('17:00');

  const getAPIUrl = (endpoint: string) => {
    const baseUrl = __DEV__ ? 
      (Platform.OS === 'android' ? 'http://10.0.2.2:3001' : 'http://localhost:3001') :
      'https://tudominio.com';
    return `${baseUrl}/api${endpoint}`;
  };

  useEffect(() => {
    fetchWorkers();
  }, []);

  const fetchWorkers = async () => {
    try {
      setLoadingWorkers(true);
      const response = await fetch(getAPIUrl('/workers'));
      const data = await response.json();
      
      if (data.success) {
        setWorkers(data.data || []);
      } else {
        Alert.alert('Error', 'No se pudieron cargar los trabajadores');
      }
    } catch (error) {
      console.error('Error cargando trabajadores:', error);
      Alert.alert('Error', 'No se pudo conectar al servidor');
    } finally {
      setLoadingWorkers(false);
    }
  };

  const handleCreateTask = async () => {
    if (!titulo.trim()) {
      Alert.alert('Error', 'El título es requerido');
      return;
    }

    if (!trabajadorId) {
      Alert.alert('Error', 'Debe seleccionar un trabajador');
      return;
    }

    setLoading(true);
    try {
      // Formatear fecha para MySQL: 'YYYY-MM-DD HH:MM:SS'
      let fechaMySQL = null;
      if (fechaLimite) {
        const year = fechaLimite.getFullYear();
        const month = String(fechaLimite.getMonth() + 1).padStart(2, '0');
        const day = String(fechaLimite.getDate()).padStart(2, '0');
        fechaMySQL = `${year}-${month}-${day} ${selectedTime}:00`;
      }

      const taskData = {
        titulo,
        descripcion: descripcion || null,
        fecha_limite: fechaMySQL,
        trabajador_id: trabajadorId,
        status: 'pending'
      };

      console.log('📤 Enviando tarea:', taskData);

      const response = await fetch(getAPIUrl('/tasks'), {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(taskData),
      });

      const data = await response.json();
      console.log('📥 Respuesta:', data);

      if (response.ok) {
        Alert.alert('✅ Éxito', 'Tarea creada correctamente');
        
        setTimeout(() => {
          setTitulo('');
          setDescripcion('');
          setFechaLimite(null);
          setTrabajadorId(null);
          setTrabajadorNombre('');
          setSelectedTime('17:00');
          router.back();
        }, 1000);
      } else {
        Alert.alert('❌ Error', data.error || 'No se pudo crear la tarea');
      }
      
    } catch (error: any) {
      console.error('💥 Error:', error);
      Alert.alert(
        '❌ Error de conexión', 
        'No se pudo conectar con el servidor.'
      );
    } finally {
      setLoading(false);
    }
  };

  const handleDateChange = (event: any, selectedDate?: Date) => {
    setShowDatePicker(false);
    if (selectedDate) {
      setFechaLimite(selectedDate);
    }
  };

  const handleTimeChange = (event: any, selectedTime?: Date) => {
    setShowTimePicker(false);
    if (selectedTime) {
      const hours = String(selectedTime.getHours()).padStart(2, '0');
      const minutes = String(selectedTime.getMinutes()).padStart(2, '0');
      setSelectedTime(`${hours}:${minutes}`);
    }
  };

  const formatDate = (date: Date) => {
    return date.toLocaleDateString('es-ES', {
      weekday: 'long',
      year: 'numeric',
      month: 'long',
      day: 'numeric'
    });
  };

  const selectWorker = (worker: Worker) => {
    setTrabajadorId(worker.id);
    setTrabajadorNombre(worker.name);
    setShowWorkerModal(false);
  };

  return (
    <ScrollView style={styles.container}>
      <View style={styles.card}>
        <Text style={styles.title}>Crear Nueva Tarea</Text>
        
        {/* Título */}
        <View style={styles.inputContainer}>
          <Text style={styles.label}>Título *</Text>
          <TextInput
            style={styles.input}
            placeholder="Ej: Instalar sistema de refrigeración"
            value={titulo}
            onChangeText={setTitulo}
            editable={!loading}
          />
        </View>

        {/* Descripción */}
        <View style={styles.inputContainer}>
          <Text style={styles.label}>Descripción</Text>
          <TextInput
            style={[styles.input, styles.textArea]}
            placeholder="Describe los detalles de la tarea..."
            value={descripcion}
            onChangeText={setDescripcion}
            editable={!loading}
            multiline
            numberOfLines={4}
            textAlignVertical="top"
          />
        </View>

        {/* Fecha y Hora Límite */}
        <View style={styles.inputContainer}>
          <Text style={styles.label}>Fecha y Hora Límite</Text>
          
          <View style={styles.datetimeContainer}>
            <TouchableOpacity
              style={styles.dateButton}
              onPress={() => setShowDatePicker(true)}
              disabled={loading}
            >
              <Text style={fechaLimite ? styles.dateText : styles.placeholderText}>
                {fechaLimite ? formatDate(fechaLimite) : 'Seleccionar fecha'}
              </Text>
            </TouchableOpacity>
            
            <TouchableOpacity
              style={styles.timeButton}
              onPress={() => setShowTimePicker(true)}
              disabled={loading || !fechaLimite}
            >
              <Text style={styles.timeText}>{selectedTime}</Text>
            </TouchableOpacity>
          </View>
          
          {fechaLimite && (
            <TouchableOpacity
              style={styles.clearButton}
              onPress={() => {
                setFechaLimite(null);
                setSelectedTime('17:00');
              }}
              disabled={loading}
            >
              <Text style={styles.clearButtonText}>✕ Limpiar</Text>
            </TouchableOpacity>
          )}
        </View>

        {showDatePicker && (
          <DateTimePicker
            value={fechaLimite || new Date()}
            mode="date"
            display="default"
            minimumDate={new Date()}
            onChange={handleDateChange}
          />
        )}

        {showTimePicker && (
          <DateTimePicker
            value={new Date(`2000-01-01T${selectedTime}:00`)}
            mode="time"
            display="default"
            onChange={handleTimeChange}
          />
        )}

        {/* Trabajador Asignado */}
        <View style={styles.inputContainer}>
          <Text style={styles.label}>Trabajador Asignado *</Text>
          <TouchableOpacity
            style={styles.workerButton}
            onPress={() => setShowWorkerModal(true)}
            disabled={loading || loadingWorkers}
          >
            <Text style={trabajadorNombre ? styles.workerText : styles.placeholderText}>
              {trabajadorNombre || 'Seleccionar trabajador'}
            </Text>
            {loadingWorkers && <ActivityIndicator size="small" color="#666" />}
          </TouchableOpacity>
          
          {trabajadorNombre && (
            <Text style={styles.selectedWorkerText}>
              ✅ Asignado a: {trabajadorNombre}
            </Text>
          )}
        </View>

        {/* Botones */}
        <TouchableOpacity
          style={[styles.button, (loading || !trabajadorId) && styles.buttonDisabled]}
          onPress={handleCreateTask}
          disabled={loading || !trabajadorId}
        >
          {loading ? (
            <ActivityIndicator color="#fff" />
          ) : (
            <Text style={styles.buttonText}>Crear Tarea</Text>
          )}
        </TouchableOpacity>

        <TouchableOpacity
          style={styles.cancelButton}
          onPress={() => router.back()}
          disabled={loading}
        >
          <Text style={styles.cancelButtonText}>Cancelar</Text>
        </TouchableOpacity>
      </View>

      {/* Modal para seleccionar trabajador */}
      <Modal
        visible={showWorkerModal}
        animationType="slide"
        transparent={true}
      >
        <View style={styles.modalOverlay}>
          <View style={styles.modalContent}>
            <Text style={styles.modalTitle}>Seleccionar Trabajador</Text>
            
            {loadingWorkers ? (
              <ActivityIndicator size="large" color="#4CAF50" />
            ) : workers.length === 0 ? (
              <View style={styles.noWorkersContainer}>
                <Text style={styles.noWorkersText}>No hay trabajadores disponibles</Text>
                <TouchableOpacity
                  style={styles.refreshButton}
                  onPress={fetchWorkers}
                >
                  <Text style={styles.refreshButtonText}>⟳ Actualizar</Text>
                </TouchableOpacity>
              </View>
            ) : (
              <FlatList
                data={workers}
                keyExtractor={(item) => item.id.toString()}
                renderItem={({ item }) => (
                  <TouchableOpacity
                    style={[
                      styles.workerItem,
                      trabajadorId === item.id && styles.workerItemSelected
                    ]}
                    onPress={() => selectWorker(item)}
                  >
                    <View>
                      <Text style={styles.workerItemName}>{item.name}</Text>
                      <Text style={styles.workerItemContact}>{item.contact_info}</Text>
                    </View>
                    {trabajadorId === item.id && (
                      <Text style={styles.selectedCheck}>✓</Text>
                    )}
                  </TouchableOpacity>
                )}
              />
            )}
            
            <TouchableOpacity
              style={styles.closeModalButton}
              onPress={() => setShowWorkerModal(false)}
            >
              <Text style={styles.closeModalText}>Cerrar</Text>
            </TouchableOpacity>
          </View>
        </View>
      </Modal>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#f5f5f5',
  },
  card: {
    backgroundColor: '#fff',
    margin: 20,
    padding: 20,
    borderRadius: 10,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
  },
  title: {
    fontSize: 24,
    fontWeight: 'bold',
    marginBottom: 30,
    textAlign: 'center',
    color: '#333',
  },
  inputContainer: {
    marginBottom: 25,
  },
  label: {
    fontSize: 16,
    fontWeight: '600',
    marginBottom: 8,
    color: '#555',
  },
  input: {
    borderWidth: 1,
    borderColor: '#ddd',
    borderRadius: 8,
    padding: 12,
    fontSize: 16,
    backgroundColor: '#f9f9f9',
  },
  textArea: {
    minHeight: 100,
    paddingTop: 12,
  },
  datetimeContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    gap: 10,
  },
  dateButton: {
    flex: 2,
    borderWidth: 1,
    borderColor: '#ddd',
    borderRadius: 8,
    padding: 12,
    backgroundColor: '#f9f9f9',
  },
  timeButton: {
    flex: 1,
    borderWidth: 1,
    borderColor: '#ddd',
    borderRadius: 8,
    padding: 12,
    backgroundColor: '#f9f9f9',
    alignItems: 'center',
  },
  dateText: {
    fontSize: 16,
    color: '#333',
  },
  timeText: {
    fontSize: 16,
    color: '#333',
    fontWeight: '500',
  },
  placeholderText: {
    fontSize: 16,
    color: '#999',
  },
  clearButton: {
    alignSelf: 'flex-end',
    marginTop: 8,
    paddingHorizontal: 12,
    paddingVertical: 6,
    backgroundColor: '#ffebee',
    borderRadius: 6,
  },
  clearButtonText: {
    color: '#d32f2f',
    fontSize: 14,
  },
  workerButton: {
    borderWidth: 1,
    borderColor: '#ddd',
    borderRadius: 8,
    padding: 12,
    backgroundColor: '#f9f9f9',
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  workerText: {
    fontSize: 16,
    color: '#333',
  },
  selectedWorkerText: {
    marginTop: 8,
    fontSize: 14,
    color: '#4CAF50',
    fontStyle: 'italic',
  },
  button: {
    backgroundColor: '#2196F3',
    padding: 16,
    borderRadius: 8,
    alignItems: 'center',
    marginTop: 10,
  },
  buttonDisabled: {
    backgroundColor: '#90CAF9',
  },
  buttonText: {
    color: '#fff',
    fontSize: 18,
    fontWeight: 'bold',
  },
  cancelButton: {
    padding: 16,
    alignItems: 'center',
    marginTop: 10,
  },
  cancelButtonText: {
    color: '#f44336',
    fontSize: 16,
  },
  modalOverlay: {
    flex: 1,
    backgroundColor: 'rgba(0, 0, 0, 0.5)',
    justifyContent: 'center',
    alignItems: 'center',
    padding: 20,
  },
  modalContent: {
    backgroundColor: '#fff',
    borderRadius: 10,
    padding: 20,
    width: '100%',
    maxHeight: '80%',
  },
  modalTitle: {
    fontSize: 20,
    fontWeight: 'bold',
    marginBottom: 20,
    textAlign: 'center',
    color: '#333',
  },
  workerItem: {
    padding: 15,
    borderBottomWidth: 1,
    borderBottomColor: '#eee',
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  workerItemSelected: {
    backgroundColor: '#E8F5E9',
    borderLeftWidth: 4,
    borderLeftColor: '#4CAF50',
  },
  workerItemName: {
    fontSize: 16,
    fontWeight: '600',
    color: '#333',
    marginBottom: 4,
  },
  workerItemContact: {
    fontSize: 14,
    color: '#666',
  },
  selectedCheck: {
    color: '#4CAF50',
    fontSize: 20,
    fontWeight: 'bold',
  },
  noWorkersContainer: {
    alignItems: 'center',
    padding: 30,
  },
  noWorkersText: {
    textAlign: 'center',
    fontSize: 16,
    color: '#999',
    marginBottom: 15,
  },
  refreshButton: {
    paddingHorizontal: 20,
    paddingVertical: 10,
    backgroundColor: '#E3F2FD',
    borderRadius: 6,
  },
  refreshButtonText: {
    color: '#1976D2',
    fontSize: 14,
    fontWeight: '500',
  },
  closeModalButton: {
    marginTop: 20,
    padding: 15,
    backgroundColor: '#f5f5f5',
    borderRadius: 8,
    alignItems: 'center',
  },
  closeModalText: {
    fontSize: 16,
    color: '#666',
    fontWeight: '600',
  },
});
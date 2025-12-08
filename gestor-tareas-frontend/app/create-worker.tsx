import React, { useState } from 'react';
import { 
  View, 
  Text, 
  TextInput, 
  TouchableOpacity, 
  StyleSheet,
  Alert,
  ActivityIndicator,
  ScrollView,
  Modal // ⭐ NUEVO: Importar Modal
} from 'react-native';
import { router } from 'expo-router';

export default function CreateWorkerScreen() {
  const [nombre, setNombre] = useState('');
  const [email, setEmail] = useState('');
  const [telefono, setTelefono] = useState('');
  const [loading, setLoading] = useState(false);
  const [showConfirmation, setShowConfirmation] = useState(false); // ⭐ NUEVO estado
  const [trabajadorCreado, setTrabajadorCreado] = useState(''); // ⭐ Para guardar el nombre creado

  const handleCreateWorker = async () => {
    if (!nombre.trim()) {
      Alert.alert('Error', 'El nombre es requerido');
      return;
    }

    setLoading(true);
    try {
      const API_URL = 'http://192.168.1.27:3001/api/workers';
      
      const response = await fetch(API_URL, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          name: nombre.trim(),
          contact_info: email.trim() || telefono.trim() || null
        }),
      });

      const data = await response.json();

      if (response.ok && data.success) {
        // ⭐⭐ GUARDAR DATOS Y MOSTRAR MODAL VISIBLE ⭐⭐
        setTrabajadorCreado(nombre);
        setShowConfirmation(true); // Mostrar modal en pantalla
        
      } else {
        Alert.alert('❌ Error', data.message || data.error || 'Error al crear');
      }
      
    } catch (error: any) {
      Alert.alert('Error', 'Error de conexión');
      console.error(error);
    } finally {
      setLoading(false);
    }
  };

  // ⭐⭐ FUNCIÓN PARA CONFIRMAR Y LIMPIAR ⭐⭐
  const handleConfirm = () => {
    // 1. Ocultar el modal
    setShowConfirmation(false);
    
    // 2. Limpiar los campos
    setNombre('');
    setEmail('');
    setTelefono('');
    
    // 3. Limpiar el nombre guardado
    setTrabajadorCreado('');
  };

  return (
    <ScrollView style={styles.container}>
      {/* ⭐⭐ MODAL DE CONFIRMACIÓN VISIBLE EN PANTALLA ⭐⭐ */}
      <Modal
        animationType="fade"
        transparent={true}
        visible={showConfirmation}
        onRequestClose={() => setShowConfirmation(false)}
      >
        <View style={styles.modalOverlay}>
          <View style={styles.modalContainer}>
            <View style={styles.modalHeader}>
              <Text style={styles.modalTitle}>✅ ÉXITO</Text>
            </View>
            
            <View style={styles.modalBody}>
              <Text style={styles.modalMessage}>
                Trabajador creado exitosamente
              </Text>
              
              <View style={styles.successCard}>
                <Text style={styles.successName}>{trabajadorCreado}</Text>
                <Text style={styles.successText}>
                  Ha sido registrado en el sistema
                </Text>
              </View>
              
              <Text style={styles.modalHint}>
                Los campos se limpiarán automáticamente
              </Text>
            </View>
            
            <View style={styles.modalFooter}>
              <TouchableOpacity
                style={styles.confirmButton}
                onPress={handleConfirm}
              >
                <Text style={styles.confirmButtonText}>ACEPTAR</Text>
              </TouchableOpacity>
            </View>
          </View>
        </View>
      </Modal>

      <View style={styles.card}>
        <Text style={styles.title}>Crear Trabajador</Text>
        
        {/* Indicador de que se mostrará confirmación */}
        {showConfirmation && (
          <View style={styles.pendingConfirmation}>
            <Text style={styles.pendingText}>✅ Esperando confirmación...</Text>
          </View>
        )}
        
        <View style={styles.inputContainer}>
          <Text style={styles.label}>Nombre *</Text>
          <TextInput
            style={styles.input}
            placeholder="Nombre completo"
            value={nombre}
            onChangeText={setNombre}
            editable={!loading && !showConfirmation}
          />
        </View>

        <View style={styles.inputContainer}>
          <Text style={styles.label}>Email</Text>
          <TextInput
            style={styles.input}
            placeholder="Email (opcional)"
            value={email}
            onChangeText={setEmail}
            keyboardType="email-address"
            editable={!loading && !showConfirmation}
          />
        </View>

        <View style={styles.inputContainer}>
          <Text style={styles.label}>Teléfono</Text>
          <TextInput
            style={styles.input}
            placeholder="Teléfono (opcional)"
            value={telefono}
            onChangeText={setTelefono}
            keyboardType="phone-pad"
            editable={!loading && !showConfirmation}
          />
        </View>

        <TouchableOpacity
          style={[styles.button, (loading || showConfirmation) && styles.buttonDisabled]}
          onPress={handleCreateWorker}
          disabled={loading || showConfirmation}
        >
          {loading ? (
            <ActivityIndicator color="#fff" />
          ) : showConfirmation ? (
            <Text style={styles.buttonText}>✅ CREADO</Text>
          ) : (
            <Text style={styles.buttonText}>Crear Trabajador</Text>
          )}
        </TouchableOpacity>

        <TouchableOpacity
          style={[styles.cancelButton, (loading || showConfirmation) && styles.buttonDisabled]}
          onPress={() => router.back()}
          disabled={loading || showConfirmation}
        >
          <Text style={styles.cancelButtonText}>Cancelar</Text>
        </TouchableOpacity>
      </View>
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
  pendingConfirmation: {
    backgroundColor: '#d4edda',
    padding: 10,
    borderRadius: 8,
    marginBottom: 20,
    borderWidth: 1,
    borderColor: '#c3e6cb',
  },
  pendingText: {
    color: '#155724',
    textAlign: 'center',
    fontWeight: '600',
  },
  inputContainer: {
    marginBottom: 20,
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
  button: {
    backgroundColor: '#4CAF50',
    padding: 16,
    borderRadius: 8,
    alignItems: 'center',
    marginTop: 10,
  },
  buttonDisabled: {
    backgroundColor: '#95a5a6',
    opacity: 0.7,
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
  
  // ⭐⭐ ESTILOS DEL MODAL DE CONFIRMACIÓN ⭐⭐
  modalOverlay: {
    flex: 1,
    backgroundColor: 'rgba(0, 0, 0, 0.5)',
    justifyContent: 'center',
    alignItems: 'center',
    padding: 20,
  },
  modalContainer: {
    backgroundColor: '#fff',
    borderRadius: 15,
    width: '90%',
    maxWidth: 400,
    overflow: 'hidden',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.3,
    shadowRadius: 10,
    elevation: 10,
  },
  modalHeader: {
    backgroundColor: '#27ae60',
    padding: 20,
    alignItems: 'center',
  },
  modalTitle: {
    fontSize: 24,
    fontWeight: 'bold',
    color: '#fff',
  },
  modalBody: {
    padding: 25,
    alignItems: 'center',
  },
  modalMessage: {
    fontSize: 18,
    color: '#2c3e50',
    marginBottom: 20,
    textAlign: 'center',
  },
  successCard: {
    backgroundColor: '#f8f9fa',
    padding: 20,
    borderRadius: 10,
    borderWidth: 2,
    borderColor: '#27ae60',
    marginBottom: 20,
    width: '100%',
    alignItems: 'center',
  },
  successName: {
    fontSize: 22,
    fontWeight: 'bold',
    color: '#27ae60',
    marginBottom: 8,
  },
  successText: {
    fontSize: 16,
    color: '#555',
  },
  modalHint: {
    fontSize: 14,
    color: '#7f8c8d',
    fontStyle: 'italic',
    textAlign: 'center',
  },
  modalFooter: {
    padding: 20,
    borderTopWidth: 1,
    borderTopColor: '#eee',
  },
  confirmButton: {
    backgroundColor: '#27ae60',
    padding: 16,
    borderRadius: 8,
    alignItems: 'center',
  },
  confirmButtonText: {
    color: '#fff',
    fontSize: 18,
    fontWeight: 'bold',
  },
});
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
  Platform 
} from 'react-native';
import { router } from 'expo-router';

export default function CreateWorkerScreen() {
  const [nombre, setNombre] = useState('');
  const [email, setEmail] = useState('');
  const [telefono, setTelefono] = useState('');
  const [loading, setLoading] = useState(false);

  // ⭐⭐ FUNCIÓN SIMPLIFICADA Y CORREGIDA ⭐⭐
  const handleCreateWorker = async () => {
    console.log('=== INICIANDO CREACIÓN ===');
    
    // Validaciones
    if (!nombre.trim()) {
      Alert.alert('Error', 'El nombre es requerido');
      return;
    }

    setLoading(true);

    try {
      // ⭐⭐ IP CORRECTA: 192.168.1.27 ⭐⭐
      const API_URL = 'http://192.168.1.27:3001/api/workers';
      
      // Datos que espera el backend
      const datosParaEnviar = {
        name: nombre.trim(),  // "name" no "nombre"
        contact_info: email.trim() || telefono.trim() || null
      };

      console.log('Enviando a:', API_URL);
      console.log('Datos:', datosParaEnviar);

      const response = await fetch(API_URL, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(datosParaEnviar),
      });

      console.log('Status:', response.status);
      
      // IMPORTANTE: Manejar respuesta como texto primero
      const responseText = await response.text();
      console.log('Respuesta texto:', responseText);
      
      let data;
      try {
        data = JSON.parse(responseText);
        console.log('Respuesta JSON:', data);
      } catch (error) {
        console.error('Error parseando JSON:', error);
        throw new Error('Respuesta inválida del servidor');
      }

      // ⭐⭐ VERIFICAR RESPUESTA CORRECTAMENTE ⭐⭐
      if (response.ok) {
        // El backend devuelve { success: true, message: "...", workerId: X }
        if (data.success) {
          console.log('✅ TRABAJADOR CREADO CON ÉXITO');
          
          // 1. Mostrar mensaje de éxito
          Alert.alert(
            '✅ Éxito', 
            data.message || 'Trabajador creado correctamente',
            [
              {
                text: 'OK',
                onPress: () => {
                  console.log('Alert cerrado, limpiando formulario...');
                  // 2. Limpiar TODOS los campos
                  setNombre('');
                  setEmail('');
                  setTelefono('');
                  // 3. Regresar a la pantalla anterior
                  router.back();
                }
              }
            ]
          );
          
        } else {
          // El backend devolvió success: false
          Alert.alert('❌ Error', data.message || data.error || 'Error desconocido');
        }
      } else {
        // Error HTTP (404, 500, etc.)
        Alert.alert('❌ Error del servidor', 
          `Código: ${response.status}\n${data.message || data.error || 'Error desconocido'}`
        );
      }

    } catch (error: any) {
      console.error('Error completo:', error);
      
      // Mensajes de error más específicos
      let mensaje = 'Error desconocido';
      
      if (error.message.includes('Network request failed')) {
        mensaje = 'Error de red. Verifica tu conexión.';
      } else if (error.message.includes('Failed to fetch')) {
        mensaje = 'No se pudo conectar al servidor.';
      } else {
        mensaje = error.message;
      }
      
      Alert.alert('❌ Error', mensaje);
      
    } finally {
      setLoading(false);
      console.log('=== FIN DEL PROCESO ===');
    }
  };

  // ⭐⭐ BOTÓN PARA LIMPIAR MANUALMENTE (OPCIONAL) ⭐⭐
  const handleClearForm = () => {
    setNombre('');
    setEmail('');
    setTelefono('');
  };

  return (
    <ScrollView style={styles.container}>
      <View style={styles.card}>
        <Text style={styles.title}>Crear Nuevo Trabajador</Text>
        
        <Text style={styles.note}>
          📍 Conectando a: 192.168.1.27:3001
        </Text>
        
        <View style={styles.inputContainer}>
          <Text style={styles.label}>Nombre *</Text>
          <TextInput
            style={styles.input}
            placeholder="Ingrese el nombre completo"
            value={nombre}
            onChangeText={setNombre}
            editable={!loading}
          />
        </View>

        <View style={styles.inputContainer}>
          <Text style={styles.label}>Email (Opcional)</Text>
          <TextInput
            style={styles.input}
            placeholder="ejemplo@correo.com"
            value={email}
            onChangeText={setEmail}
            keyboardType="email-address"
            autoCapitalize="none"
            editable={!loading}
          />
        </View>

        <View style={styles.inputContainer}>
          <Text style={styles.label}>Teléfono (Opcional)</Text>
          <TextInput
            style={styles.input}
            placeholder="Ingrese el teléfono"
            value={telefono}
            onChangeText={setTelefono}
            keyboardType="phone-pad"
            editable={!loading}
          />
        </View>

        {/* Botón para limpiar manualmente */}
        <TouchableOpacity
          style={[styles.clearButton, loading && styles.buttonDisabled]}
          onPress={handleClearForm}
          disabled={loading}
        >
          <Text style={styles.clearButtonText}>Limpiar Formulario</Text>
        </TouchableOpacity>

        {/* Botón principal */}
        <TouchableOpacity
          style={[styles.button, loading && styles.buttonDisabled]}
          onPress={handleCreateWorker}
          disabled={loading}
        >
          {loading ? (
            <View style={styles.loadingContainer}>
              <ActivityIndicator color="#fff" size="small" />
              <Text style={styles.buttonText}>Creando...</Text>
            </View>
          ) : (
            <Text style={styles.buttonText}>Crear Trabajador</Text>
          )}
        </TouchableOpacity>

        <TouchableOpacity
          style={styles.cancelButton}
          onPress={() => router.back()}
          disabled={loading}
        >
          <Text style={styles.cancelButtonText}>Cancelar y Volver</Text>
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
    marginBottom: 15,
    textAlign: 'center',
    color: '#333',
  },
  note: {
    fontSize: 12,
    color: '#3498db',
    marginBottom: 20,
    textAlign: 'center',
    fontStyle: 'italic',
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
  clearButton: {
    backgroundColor: '#f39c12',
    padding: 12,
    borderRadius: 8,
    alignItems: 'center',
    marginBottom: 10,
  },
  clearButtonText: {
    color: '#fff',
    fontSize: 16,
    fontWeight: '600',
  },
  button: {
    backgroundColor: '#2ecc71',
    padding: 16,
    borderRadius: 8,
    alignItems: 'center',
    marginTop: 5,
  },
  buttonDisabled: {
    backgroundColor: '#95a5a6',
    opacity: 0.7,
  },
  loadingContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 10,
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
    color: '#e74c3c',
    fontSize: 16,
    fontWeight: '600',
  },
});
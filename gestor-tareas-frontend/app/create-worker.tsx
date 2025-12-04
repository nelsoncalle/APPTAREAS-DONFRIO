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

  const getAPIUrl = () => {
    if (__DEV__) {
      if (Platform.OS === 'android') {
        return 'http://10.0.2.2:3001/api/workers';
      }
      if (Platform.OS === 'ios') {
        return 'http://localhost:3001/api/workers';
      }
      return 'http://localhost:3001/api/workers';
    }
    return 'https://tudominio.com/api/workers';
  };

  const handleCreateWorker = async () => {
    if (!nombre.trim()) {
      Alert.alert('Error', 'El nombre es requerido');
      return;
    }

    if (!email.trim() || !email.includes('@')) {
      Alert.alert('Error', 'Ingrese un email válido');
      return;
    }

    setLoading(true);
    try {
      const API_URL = getAPIUrl();
      
      const response = await fetch(API_URL, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          nombre,
          email,
          telefono: telefono || ''
        }),
      });

      const data = await response.json();

      // ⭐⭐ AQUÍ VA EL CÓDIGO QUE PREGUNTASTE ⭐⭐
      if (response.ok) {
        Alert.alert('✅ Éxito', 'Trabajador creado correctamente');
        
        // Esperar 1 segundo antes de limpiar y regresar
        setTimeout(() => {
          setNombre('');
          setEmail('');
          setTelefono('');
          router.back();
        }, 1000);
        
      } else {
        Alert.alert('❌ Error', data.error || 'No se pudo crear el trabajador');
      }
      // ⭐⭐ FIN DEL CÓDIGO ⭐⭐
      
    } catch (error: any) {
      console.error('Error:', error);
      Alert.alert(
        '❌ Error de conexión', 
        'No se pudo conectar con el servidor. Por favor, intente nuevamente.'
      );
    } finally {
      setLoading(false);
    }
  };

  return (
    <ScrollView style={styles.container}>
      <View style={styles.card}>
        <Text style={styles.title}>Crear Nuevo Trabajador</Text>
        
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
          <Text style={styles.label}>Email *</Text>
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

        <TouchableOpacity
          style={[styles.button, loading && styles.buttonDisabled]}
          onPress={handleCreateWorker}
          disabled={loading}
        >
          {loading ? (
            <ActivityIndicator color="#fff" />
          ) : (
            <Text style={styles.buttonText}>Crear Trabajador</Text>
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
    backgroundColor: '#a5d6a7',
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
});
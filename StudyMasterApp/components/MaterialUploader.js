import React, { useState } from 'react';
import { View, Text, TextInput, TouchableOpacity, StyleSheet, Alert, Platform } from 'react-native';
import * as DocumentPicker from 'expo-document-picker';

const MaterialUploader = ({ onMaterialAdded, selectedCategory }) => {
  const [textInput, setTextInput] = useState('');
  const [uploading, setUploading] = useState(false);

  const pickDocument = async () => {
    try {
      const result = await DocumentPicker.getDocumentAsync({
        type: ['application/pdf', 'application/vnd.openxmlformats-officedocument.wordprocessingml.document', 'text/plain'],
        multiple: false,
      });
      if (result.type === 'success') {
        // For now, just notify parent with file info
        onMaterialAdded({
          id: Date.now().toString(),
          type: 'file',
          name: result.name,
          uri: result.uri,
          categoryId: selectedCategory.id,
        });
        Alert.alert('Successo', `File "${result.name}" aggiunto alla categoria "${selectedCategory.name}"`);
      }
    } catch (error) {
      Alert.alert('Errore', 'Impossibile selezionare il file');
    }
  };

  const addTextMaterial = () => {
    const trimmed = textInput.trim();
    if (!trimmed) {
      Alert.alert('Errore', 'Il testo non può essere vuoto');
      return;
    }
    onMaterialAdded({
      id: Date.now().toString(),
      type: 'text',
      content: trimmed,
      categoryId: selectedCategory.id,
    });
    setTextInput('');
    Alert.alert('Successo', `Testo aggiunto alla categoria "${selectedCategory.name}"`);
  };

  if (!selectedCategory) {
    return <Text style={styles.infoText}>Seleziona una categoria per aggiungere materiali</Text>;
  }

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Aggiungi Materiale a "{selectedCategory.name}"</Text>
      <TouchableOpacity style={styles.button} onPress={pickDocument}>
        <Text style={styles.buttonText}>Carica PDF o DOCX</Text>
      </TouchableOpacity>
      <Text style={styles.orText}>o incolla testo qui sotto:</Text>
      <TextInput
        style={styles.textInput}
        multiline
        placeholder="Incolla il testo qui..."
        value={textInput}
        onChangeText={setTextInput}
      />
      <TouchableOpacity style={styles.button} onPress={addTextMaterial}>
        <Text style={styles.buttonText}>Aggiungi Testo</Text>
      </TouchableOpacity>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    backgroundColor: 'white',
    borderRadius: 12,
    padding: 16,
    marginVertical: 16,
    elevation: 2,
  },
  title: {
    fontSize: 18,
    fontWeight: '700',
    marginBottom: 12,
  },
  button: {
    backgroundColor: '#4F46E5',
    paddingVertical: 12,
    borderRadius: 8,
    alignItems: 'center',
    marginBottom: 12,
  },
  buttonText: {
    color: 'white',
    fontWeight: '700',
    fontSize: 16,
  },
  orText: {
    textAlign: 'center',
    marginVertical: 8,
    color: '#666',
  },
  textInput: {
    height: 100,
    borderColor: '#aaa',
    borderWidth: 1,
    borderRadius: 8,
    padding: 12,
    fontSize: 16,
    textAlignVertical: 'top',
    marginBottom: 12,
  },
  infoText: {
    fontStyle: 'italic',
    color: '#666',
    marginVertical: 20,
    textAlign: 'center',
  },
});

export default MaterialUploader;

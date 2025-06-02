import React, { useState, useRef } from 'react';
import { View, Text, TextInput, TouchableOpacity, StyleSheet, Alert, Platform } from 'react-native';

const MaterialUploader = ({ onMaterialAdded, selectedCategory }) => {
  const [textInput, setTextInput] = useState('');
  const [uploading, setUploading] = useState(false);
  const [successMessage, setSuccessMessage] = useState('');
  const fileInputRef = useRef(null);

  const showSuccess = (message) => {
    setSuccessMessage(message);
    setTimeout(() => setSuccessMessage(''), 3000);
  };

  const pickDocument = async () => {
    if (!selectedCategory) {
      Alert.alert('Errore', 'Seleziona prima una categoria');
      return;
    }

    if (Platform.OS === 'web') {
      fileInputRef.current?.click();
    } else {
      Alert.alert('Info', 'File upload is only supported on web platform');
    }
  };

  const handleFileSelected = (event) => {
    if (!selectedCategory) return;

    const file = event.target.files[0];
    if (file) {
      onMaterialAdded({
        id: Date.now().toString(),
        type: 'file',
        name: file.name,
        uri: URL.createObjectURL(file),
        categoryId: selectedCategory.id,
      });
      showSuccess(`File "${file.name}" aggiunto alla categoria "${selectedCategory.name}"`);
      event.target.value = '';
    }
  };

  const addTextMaterial = () => {
    if (!selectedCategory) {
      Alert.alert('Errore', 'Seleziona prima una categoria');
      return;
    }

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
    showSuccess(`Testo aggiunto alla categoria "${selectedCategory.name}"`);
  };

  return (
    <View style={styles.container}>
      <Text style={styles.title}>
        {selectedCategory 
          ? `Aggiungi Materiale a "${selectedCategory.name}"`
          : 'Seleziona una categoria per aggiungere materiali'}
      </Text>
      {successMessage ? (
        <Text style={styles.successMessage}>{successMessage}</Text>
      ) : null}
      {Platform.OS === 'web' && (
        <input
          type="file"
          ref={fileInputRef}
          style={{ display: 'none' }}
          accept=".pdf,.docx,.txt"
          onChange={handleFileSelected}
        />
      )}
      <TouchableOpacity 
        style={[styles.button, !selectedCategory && styles.buttonDisabled]} 
        onPress={pickDocument}
      >
        <Text style={styles.buttonText}>Carica PDF o DOCX</Text>
      </TouchableOpacity>
      <Text style={styles.orText}>o incolla testo qui sotto:</Text>
      <TextInput
        style={[styles.textInput, !selectedCategory && styles.inputDisabled]}
        multiline
        placeholder="Incolla il testo qui..."
        value={textInput}
        onChangeText={setTextInput}
        editable={!!selectedCategory}
      />
      <TouchableOpacity 
        style={[styles.button, !selectedCategory && styles.buttonDisabled]} 
        onPress={addTextMaterial}
      >
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
  buttonDisabled: {
    backgroundColor: '#9CA3AF',
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
  inputDisabled: {
    backgroundColor: '#f3f4f6',
    borderColor: '#d1d5db',
  },
  successMessage: {
    backgroundColor: '#DEF7EC',
    color: '#03543F',
    padding: 12,
    borderRadius: 8,
    marginBottom: 12,
    textAlign: 'center',
  },
});

export default MaterialUploader;

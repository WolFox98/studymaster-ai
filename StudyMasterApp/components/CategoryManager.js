import React, { useState } from 'react';
import { View, Text, TextInput, FlatList, TouchableOpacity, StyleSheet, Alert } from 'react-native';

const CategoryManager = ({ categories, setCategories, onSelectCategory, selectedCategory }) => {
  const [newCategory, setNewCategory] = useState('');

  const addCategory = () => {
    const trimmed = newCategory.trim();
    if (!trimmed) {
      Alert.alert('Errore', 'Il nome della categoria non può essere vuoto');
      return;
    }
    if (categories.some(cat => cat.name.toLowerCase() === trimmed.toLowerCase())) {
      Alert.alert('Errore', 'Categoria già esistente');
      return;
    }
    const newCat = { id: Date.now().toString(), name: trimmed };
    setCategories([...categories, newCat]);
    setNewCategory('');
  };

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Categorie</Text>
      <FlatList
        data={categories}
        keyExtractor={item => item.id}
        renderItem={({ item }) => (
          <TouchableOpacity 
            style={[
              styles.categoryItem,
              selectedCategory?.id === item.id && styles.selectedCategory
            ]} 
            onPress={() => onSelectCategory(item)}
          >
            <Text style={[
              styles.categoryText,
              selectedCategory?.id === item.id && styles.selectedCategoryText
            ]}>
              {item.name}
            </Text>
          </TouchableOpacity>
        )}
        ListEmptyComponent={<Text style={styles.emptyText}>Nessuna categoria creata</Text>}
      />
      <View style={styles.inputRow}>
        <TextInput
          style={styles.input}
          placeholder="Nuova categoria"
          value={newCategory}
          onChangeText={setNewCategory}
          onSubmitEditing={addCategory}
          returnKeyType="done"
        />
        <TouchableOpacity style={styles.addButton} onPress={addCategory}>
          <Text style={styles.addButtonText}>Aggiungi</Text>
        </TouchableOpacity>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    padding: 16,
    backgroundColor: 'white',
    borderRadius: 12,
    marginBottom: 16,
    elevation: 2,
  },
  title: {
    fontSize: 20,
    fontWeight: '700',
    marginBottom: 12,
  },
  categoryItem: {
    paddingVertical: 10,
    paddingHorizontal: 12,
    borderBottomColor: '#ddd',
    borderBottomWidth: 1,
    borderRadius: 6,
  },
  selectedCategory: {
    backgroundColor: '#E0E7FF',
    borderBottomColor: '#6366F1',
  },
  categoryText: {
    fontSize: 16,
  },
  selectedCategoryText: {
    color: '#4F46E5',
    fontWeight: '600',
  },
  emptyText: {
    fontStyle: 'italic',
    color: '#666',
    textAlign: 'center',
    marginVertical: 20,
  },
  inputRow: {
    flexDirection: 'row',
    marginTop: 12,
  },
  input: {
    flex: 1,
    borderColor: '#aaa',
    borderWidth: 1,
    borderRadius: 8,
    paddingHorizontal: 12,
    paddingVertical: 8,
    fontSize: 16,
  },
  addButton: {
    backgroundColor: '#4F46E5',
    marginLeft: 8,
    borderRadius: 8,
    paddingHorizontal: 16,
    justifyContent: 'center',
  },
  addButtonText: {
    color: 'white',
    fontWeight: '700',
    fontSize: 16,
  },
});

export default CategoryManager;

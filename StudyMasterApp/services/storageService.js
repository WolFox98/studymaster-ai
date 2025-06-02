import { Platform } from 'react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';

const CATEGORIES_KEY = 'studymaster_categories';
const MATERIALS_KEY = 'studymaster_materials';
const USER_STATS_KEY = 'studymaster_user_stats';

const storage = {
  setItem: async (key, value) => {
    if (Platform.OS === 'web') {
      localStorage.setItem(key, value);
      return Promise.resolve();
    }
    return AsyncStorage.setItem(key, value);
  },
  getItem: async (key) => {
    if (Platform.OS === 'web') {
      const value = localStorage.getItem(key);
      return Promise.resolve(value);
    }
    return AsyncStorage.getItem(key);
  }
};

export const saveCategories = async (categories) => {
  try {
    await storage.setItem(CATEGORIES_KEY, JSON.stringify(categories));
  } catch (error) {
    console.error('Error saving categories:', error);
  }
};

export const loadCategories = async () => {
  try {
    const json = await storage.getItem(CATEGORIES_KEY);
    return json != null ? JSON.parse(json) : [];
  } catch (error) {
    console.error('Error loading categories:', error);
    return [];
  }
};

export const saveMaterials = async (materials) => {
  try {
    await storage.setItem(MATERIALS_KEY, JSON.stringify(materials));
  } catch (error) {
    console.error('Error saving materials:', error);
  }
};

export const loadMaterials = async () => {
  try {
    const json = await storage.getItem(MATERIALS_KEY);
    return json != null ? JSON.parse(json) : [];
  } catch (error) {
    console.error('Error loading materials:', error);
    return [];
  }
};

export const saveUserStats = async (userStats) => {
  try {
    await storage.setItem(USER_STATS_KEY, JSON.stringify(userStats));
  } catch (error) {
    console.error('Error saving user stats:', error);
  }
};

export const loadUserStats = async () => {
  try {
    const json = await storage.getItem(USER_STATS_KEY);
    return json != null ? JSON.parse(json) : null;
  } catch (error) {
    console.error('Error loading user stats:', error);
    return null;
  }
};

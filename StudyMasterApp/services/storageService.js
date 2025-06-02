import AsyncStorage from '@react-native-async-storage/async-storage';

const CATEGORIES_KEY = 'studymaster_categories';
const MATERIALS_KEY = 'studymaster_materials';
const USER_STATS_KEY = 'studymaster_user_stats';

export const saveCategories = async (categories) => {
  try {
    await AsyncStorage.setItem(CATEGORIES_KEY, JSON.stringify(categories));
  } catch (error) {
    console.error('Error saving categories:', error);
  }
};

export const loadCategories = async () => {
  try {
    const json = await AsyncStorage.getItem(CATEGORIES_KEY);
    return json != null ? JSON.parse(json) : [];
  } catch (error) {
    console.error('Error loading categories:', error);
    return [];
  }
};

export const saveMaterials = async (materials) => {
  try {
    await AsyncStorage.setItem(MATERIALS_KEY, JSON.stringify(materials));
  } catch (error) {
    console.error('Error saving materials:', error);
  }
};

export const loadMaterials = async () => {
  try {
    const json = await AsyncStorage.getItem(MATERIALS_KEY);
    return json != null ? JSON.parse(json) : [];
  } catch (error) {
    console.error('Error loading materials:', error);
    return [];
  }
};

export const saveUserStats = async (userStats) => {
  try {
    await AsyncStorage.setItem(USER_STATS_KEY, JSON.stringify(userStats));
  } catch (error) {
    console.error('Error saving user stats:', error);
  }
};

export const loadUserStats = async () => {
  try {
    const json = await AsyncStorage.getItem(USER_STATS_KEY);
    return json != null ? JSON.parse(json) : null;
  } catch (error) {
    console.error('Error loading user stats:', error);
    return null;
  }
};

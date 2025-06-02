import React, { useState, useEffect } from 'react';
import { View, Text, StyleSheet, TouchableOpacity, FlatList, SafeAreaView, StatusBar } from 'react-native';
import CategoryManager from './components/CategoryManager';
import MaterialUploader from './components/MaterialUploader';
import {
  saveCategories,
  loadCategories,
  saveMaterials,
  loadMaterials,
  saveUserStats,
  loadUserStats,
} from './services/storageService';
import { generateStudyContent } from './services/aiService';

const analyzeErrors = (errorLogs) => {
  const weakPoints = [];
  const strongPoints = [];
  const recommendations = [];

  // Count error types
  const errorCounts = errorLogs.reduce((acc, log) => {
    acc[log.errorType] = (acc[log.errorType] || 0) + 1;
    return acc;
  }, {});

  // Analyze error patterns
  Object.entries(errorCounts).forEach(([type, count]) => {
    if (count >= 3) {
      weakPoints.push(`Difficoltà ricorrenti con ${type}`);
      recommendations.push(`Concentrati su esercizi specifici per ${type}`);
    } else if (count === 1) {
      strongPoints.push(`Buona comprensione generale di ${type}`);
    }
  });

  // Add general recommendations
  if (weakPoints.length > 0) {
    recommendations.push('Considera di rivedere i concetti fondamentali');
  }
  if (strongPoints.length > 0) {
    recommendations.push('Continua a rafforzare i punti di forza');
  }

  return {
    weakPoints,
    strongPoints,
    recommendations: recommendations.slice(0, 3) // Limit to top 3 recommendations
  };
};

const ranks = [
  { name: 'Knowledge Seeker', min: 0, color: '#6B7280' },
  { name: 'Info Gatherer', min: 500, color: '#22C55E' },
  { name: 'Pattern Finder', min: 1200, color: '#3B82F6' },
  { name: 'Concept Master', min: 2500, color: '#8B5CF6' },
  { name: 'Neural Scholar', min: 4000, color: '#F97316' },
  { name: 'Wisdom Keeper', min: 7000, color: '#EF4444' },
  { name: 'Learning Legend', min: 12000, color: '#EAB308' },
];

const studyPhases = [
  { key: 'scanning', name: 'Scansione Veloce', xp: 25 },
  { key: 'mapping', name: 'Mappa Concettuale', xp: 35 },
  { key: 'feynman', name: 'Tecnica Feynman', xp: 50 },
  { key: 'recall', name: 'Richiamo Attivo', xp: 40 },
  { key: 'testing', name: 'Testing Intensivo', xp: 60 },
];

const getCurrentRank = (xp) => {
  return ranks.filter(rank => xp >= rank.min).pop();
};

export default function App() {
  const [currentSection, setCurrentSection] = useState('dashboard');
  const [userStats, setUserStats] = useState({
    level: 12,
    xp: 2847,
    xpToNext: 3200,
    streak: 15,
    totalStudyTime: 127,
    rank: 'Neural Scholar',
    badges: ['Speed Learner', 'Consistent Warrior', 'Deep Thinker'],
  });

  const [studySession, setStudySession] = useState({
    phaseIndex: 0,
    timeLeft: 600,
    currentXP: 0,
    streak: 0,
    isActive: false,
  });

  const [categories, setCategories] = useState([]);
  const [selectedCategory, setSelectedCategory] = useState(null);
  const [materials, setMaterials] = useState([]);

  useEffect(() => {
    const loadData = async () => {
      const loadedCategories = await loadCategories();
      setCategories(loadedCategories || []);

      const loadedMaterials = await loadMaterials();
      setMaterials(loadedMaterials || []);

      const loadedUserStats = await loadUserStats();
      if (loadedUserStats) {
        setUserStats(loadedUserStats);
      }
    };
    loadData();
  }, []);

  useEffect(() => {
    saveCategories(categories);
  }, [categories]);

  useEffect(() => {
    saveMaterials(materials);
  }, [materials]);

  useEffect(() => {
    saveUserStats(userStats);
  }, [userStats]);

  const completePhase = () => {
    const phase = studyPhases[studySession.phaseIndex];
    setUserStats(stats => ({
      ...stats,
      xp: stats.xp + phase.xp,
    }));
    if (studySession.phaseIndex < studyPhases.length - 1) {
      setStudySession(prev => ({
        ...prev,
        phaseIndex: prev.phaseIndex + 1,
        timeLeft: 1500, // reset to 25 min for next phase
        currentXP: prev.currentXP + phase.xp,
      }));
    } else {
      setStudySession(prev => ({
        ...prev,
        isActive: false,
        currentXP: prev.currentXP + phase.xp,
      }));
    }
  };

  // Timer effect for study session countdown
  useEffect(() => {
    if (!studySession.isActive) return;

    if (studySession.timeLeft <= 0) {
      completePhase();
      return;
    }

    const timerId = setInterval(() => {
      setStudySession(prev => ({
        ...prev,
        timeLeft: prev.timeLeft - 1,
      }));
    }, 1000);

    return () => clearInterval(timerId);
  }, [studySession.isActive, studySession.timeLeft]);

  const onMaterialAdded = (material) => {
    setMaterials(prev => [...prev, material]);
  };

  const renderDashboard = () => {
    const rank = getCurrentRank(userStats.xp);
    const streakFire = userStats.streak > 0 ? '🔥' : '';
    const progressPercent = Math.min((userStats.xp / userStats.xpToNext) * 100, 100);

    return (
      <View style={styles.section}>
        <Text style={styles.title}>Livello {userStats.level}</Text>
        <Text style={[styles.rank, { color: rank.color }]}>{rank.name}</Text>
        <View style={styles.progressBarBackground}>
          <View style={[styles.progressBarFill, { width: `${progressPercent}%`, backgroundColor: rank.color }]} />
        </View>
        <Text style={styles.xp}>XP: {userStats.xp} / {userStats.xpToNext}</Text>
        <Text style={styles.streak}>
          Streak: {userStats.streak} giorni {streakFire}
        </Text>
        <Text>Tempo totale di studio: {userStats.totalStudyTime} ore</Text>
        <View style={styles.badgesContainer}>
          {userStats.badges.map((badge, index) => (
            <View key={index} style={styles.badge}>
              <Text style={styles.badgeText}>🏅 {badge}</Text>
            </View>
          ))}
        </View>
      </View>
    );
  };

  const renderStudy = () => {
    const phase = studyPhases[studySession.phaseIndex];
    const filteredMaterials = selectedCategory
      ? materials.filter(m => m.categoryId === selectedCategory.id)
      : [];

    return (
      <View style={styles.section}>
        <CategoryManager
          categories={categories}
          setCategories={setCategories}
          onSelectCategory={setSelectedCategory}
          selectedCategory={selectedCategory}
        />
        <MaterialUploader
          selectedCategory={selectedCategory}
          onMaterialAdded={onMaterialAdded}
        />
        {selectedCategory ? (
          <>
            <Text style={styles.title}>Sessione di Studio Guidata - {selectedCategory.name}</Text>
            <Text style={{ marginBottom: 10, fontWeight: '600' }}>Materiali caricati: {filteredMaterials.length}</Text>
            {studySession.isActive ? (
              <>
                <Text>Fase attuale: {phase.name}</Text>
                <Text>XP questa fase: {phase.xp}</Text>
                <TouchableOpacity style={styles.button} onPress={completePhase}>
                  <Text style={styles.buttonText}>Completa Fase</Text>
                </TouchableOpacity>
              </>
            ) : (
              <TouchableOpacity
                style={styles.button}
                onPress={() => setStudySession({ ...studySession, isActive: true, phaseIndex: 0, timeLeft: 1500, currentXP: 0 })}
              >
                <Text style={styles.buttonText}>Inizia Sessione (25 min)</Text>
              </TouchableOpacity>
            )}
          </>
        ) : (
          <Text style={{ marginTop: 20, fontStyle: 'italic' }}>Seleziona una categoria per iniziare</Text>
        )}
      </View>
    );
  };

  const [errorLogs, setErrorLogs] = useState([
    { questionId: 'q1', errorType: 'Concetti Base', timestamp: Date.now() - 86400000 },
    { questionId: 'q2', errorType: 'Memoria', timestamp: Date.now() - 43200000 },
    { questionId: 'q3', errorType: 'Concetti Base', timestamp: Date.now() - 3600000 },
    { questionId: 'q4', errorType: 'Applicazione', timestamp: Date.now() - 1800000 },
    { questionId: 'q5', errorType: 'Concetti Base', timestamp: Date.now() - 600000 },
  ]);

  const analysis = analyzeErrors(errorLogs);

  const renderAnalytics = () => {
    return (
      <View style={styles.section}>
        <Text style={styles.title}>Analisi AI delle Lacune</Text>
        <Text style={styles.subTitle}>Punti deboli:</Text>
        {analysis.weakPoints.length > 0 ? (
          analysis.weakPoints.map((point, index) => (
            <Text key={index} style={styles.weakPoint}>- {point}</Text>
          ))
        ) : (
          <Text>Nessun punto debole rilevato</Text>
        )}
        <Text style={styles.subTitle}>Punti forti:</Text>
        {analysis.strongPoints.length > 0 ? (
          analysis.strongPoints.map((point, index) => (
            <Text key={index} style={styles.strongPoint}>- {point}</Text>
          ))
        ) : (
          <Text>Nessun punto forte rilevato</Text>
        )}
        <Text style={styles.subTitle}>Raccomandazioni:</Text>
        {analysis.recommendations.length > 0 ? (
          analysis.recommendations.map((rec, index) => (
            <Text key={index} style={styles.recommendation}>• {rec}</Text>
          ))
        ) : (
          <Text>Nessuna raccomandazione disponibile</Text>
        )}
      </View>
    );
  };

  return (
    <SafeAreaView style={styles.container}>
      <StatusBar barStyle="dark-content" />
      <View style={styles.navbar}>
        {['dashboard', 'study', 'analytics'].map(section => (
          <TouchableOpacity
            key={section}
            style={[styles.navButton, currentSection === section && styles.navButtonActive]}
            onPress={() => setCurrentSection(section)}
          >
            <Text style={currentSection === section ? styles.navTextActive : styles.navText}>
              {section.charAt(0).toUpperCase() + section.slice(1)}
            </Text>
          </TouchableOpacity>
        ))}
      </View>
      {currentSection === 'dashboard' && renderDashboard()}
      {currentSection === 'study' && renderStudy()}
      {currentSection === 'analytics' && renderAnalytics()}
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#F3F4F6',
  },
  navbar: {
    flexDirection: 'row',
    justifyContent: 'space-around',
    backgroundColor: '#E0E7FF',
    paddingVertical: 12,
  },
  navButton: {
    paddingVertical: 6,
    paddingHorizontal: 12,
    borderRadius: 8,
  },
  navButtonActive: {
    backgroundColor: '#6366F1',
  },
  navText: {
    color: '#4B5563',
    fontWeight: '600',
  },
  navTextActive: {
    color: 'white',
    fontWeight: '700',
  },
  section: {
    flex: 1,
    padding: 20,
  },
  title: {
    fontSize: 22,
    fontWeight: '700',
    marginBottom: 12,
  },
  subTitle: {
    fontSize: 18,
    fontWeight: '600',
    marginTop: 12,
    marginBottom: 6,
  },
  weakPoint: {
    color: '#EF4444',
    fontWeight: '600',
    marginBottom: 4,
  },
  strongPoint: {
    color: '#22C55E',
    fontWeight: '600',
    marginBottom: 4,
  },
  recommendation: {
    fontStyle: 'italic',
    marginBottom: 6,
  },
  rank: {
    fontSize: 18,
    fontWeight: '600',
    marginBottom: 8,
  },
  xp: {
    fontSize: 16,
    marginBottom: 8,
  },
  streak: {
    fontSize: 16,
    marginBottom: 8,
    fontWeight: '600',
  },
  badgesContainer: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    marginTop: 10,
  },
  badge: {
    backgroundColor: '#E0E7FF',
    borderRadius: 12,
    paddingHorizontal: 10,
    paddingVertical: 6,
    marginRight: 8,
    marginBottom: 8,
  },
  badgeText: {
    fontWeight: '600',
    color: '#4B5563',
  },
  progressBarBackground: {
    height: 12,
    backgroundColor: '#E0E7FF',
    borderRadius: 6,
    overflow: 'hidden',
    marginBottom: 8,
  },
  progressBarFill: {
    height: 12,
    borderRadius: 6,
  },
  button: {
    backgroundColor: '#6366F1',
    paddingVertical: 14,
    paddingHorizontal: 24,
    borderRadius: 10,
    marginTop: 20,
    alignItems: 'center',
  },
  buttonText: {
    color: 'white',
    fontWeight: '700',
    fontSize: 16,
  },
});

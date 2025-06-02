/**
 * AI content generation and error analysis service.
 * Implements lightweight local algorithms for privacy and offline use.
 */

export const generateStudyContent = async (materialText) => {
  // Simulate analysis delay
  await new Promise(resolve => setTimeout(resolve, 1000));

  // Simple keyword extraction (mock)
  const keywords = materialText
    .split(/\W+/)
    .filter(word => word.length > 4)
    .slice(0, 10);

  // Generate mock summary
  const summary = `Questo è un riassunto sintetico del materiale con parole chiave: ${keywords.join(', ')}.`;

  // Generate mock concepts
  const concepts = keywords.map(word => ({
    name: word,
    description: `Descrizione breve per il concetto ${word}.`
  }));

  // Generate mock exercises
  const exercises = keywords.map((word, index) => ({
    question: `Domanda sull'argomento ${word}?`,
    options: ['Opzione A', 'Opzione B', 'Opzione C', 'Opzione D'],
    correct: index % 4,
    explanation: `Spiegazione della risposta corretta per ${word}.`
  })).slice(0, 5);

  // Generate mock questions
  const questions = [
    { question: 'Spiega il concetto principale del materiale.', type: 'open' },
    { question: 'Quali sono gli aspetti più importanti?', type: 'open' }
  ];

  return {
    summary,
    concepts,
    exercises,
    questions
  };
};

/**
 * Analyze user errors to identify patterns and weaknesses.
 * @param {Array} errorLogs - Array of error objects { questionId, errorType, timestamp }
 * @returns {Object} analysis results with weakPoints, strongPoints, and recommendations
 */
export const analyzeErrors = (errorLogs) => {
  // Count errors by type
  const errorCountByType = {};
  errorLogs.forEach(error => {
    errorCountByType[error.errorType] = (errorCountByType[error.errorType] || 0) + 1;
  });

  // Identify weak points (error types with highest counts)
  const sortedErrors = Object.entries(errorCountByType).sort((a, b) => b[1] - a[1]);
  const weakPoints = sortedErrors.slice(0, 3).map(([type]) => type);
  const strongPoints = sortedErrors.slice(3).map(([type]) => type);

  // Generate simple recommendations based on weak points
  const recommendations = weakPoints.map(point => `Consiglio: Rivedi il concetto di ${point} per migliorare.`);

  return {
    weakPoints,
    strongPoints,
    recommendations,
  };
};

/**
 * AI content generation and error analysis service.
 * Implements lightweight local algorithms for privacy and offline use.
 */

const stopwords = new Set([
  'e', 'il', 'la', 'lo', 'i', 'gli', 'le', 'un', 'una', 'in', 'a', 'da', 'di', 'che', 'per', 'con', 'su', 'non', 'si', 'al', 'del', 'della', 'dello', 'dei', 'degli', 'delle', 'ma', 'o', 'se', 'come', 'più', 'tra', 'fra'
]);

const tokenize = (text) => {
  return text
    .toLowerCase()
    .replace(/[^a-zàèéìòù\s]/g, '')
    .split(/\s+/)
    .filter(word => word.length > 2 && !stopwords.has(word));
};

const computeTF = (tokens) => {
  const tf = {};
  tokens.forEach(token => {
    tf[token] = (tf[token] || 0) + 1;
  });
  const len = tokens.length;
  Object.keys(tf).forEach(key => {
    tf[key] = tf[key] / len;
  });
  return tf;
};

const computeIDF = (documents) => {
  const idf = {};
  const N = documents.length;
  documents.forEach(doc => {
    const seen = new Set();
    const tokens = tokenize(doc);
    tokens.forEach(token => {
      if (!seen.has(token)) {
        idf[token] = (idf[token] || 0) + 1;
        seen.add(token);
      }
    });
  });
  Object.keys(idf).forEach(key => {
    idf[key] = Math.log(N / (idf[key] || 1));
  });
  return idf;
};

const computeTFIDF = (tf, idf) => {
  const tfidf = {};
  Object.keys(tf).forEach(key => {
    tfidf[key] = tf[key] * (idf[key] || 0);
  });
  return tfidf;
};

export const generateStudyContent = async (materialText, allMaterialsTexts = []) => {
  // Simulate analysis delay
  await new Promise(resolve => setTimeout(resolve, 500));

  // Compute IDF from all materials texts for better keyword extraction
  const idf = computeIDF(allMaterialsTexts.length > 0 ? allMaterialsTexts : [materialText]);

  // Tokenize and compute TF for current material
  const tokens = tokenize(materialText);
  const tf = computeTF(tokens);

  // Compute TF-IDF scores
  const tfidf = computeTFIDF(tf, idf);

  // Sort keywords by TF-IDF score
  const keywords = Object.entries(tfidf)
    .sort((a, b) => b[1] - a[1])
    .slice(0, 10)
    .map(entry => entry[0]);

  // Generate summary (simple concatenation of top keywords)
  const summary = `Riassunto sintetico con parole chiave: ${keywords.join(', ')}.`;

  // Generate concepts with simple descriptions
  const concepts = keywords.map(word => ({
    name: word,
    description: `Descrizione breve per il concetto ${word}.`
  }));

  // Generate exercises with simple questions and options
  const exercises = keywords.slice(0, 5).map((word, index) => ({
    question: `Domanda sull'argomento ${word}?`,
    options: ['Opzione A', 'Opzione B', 'Opzione C', 'Opzione D'],
    correct: index % 4,
    explanation: `Spiegazione della risposta corretta per ${word}.`
  }));

  // Generate open questions
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

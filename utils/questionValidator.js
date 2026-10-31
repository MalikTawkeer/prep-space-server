/**
 * Validator and sanitizer for uploaded MCQ JSON files.
 *
 * Expected structure of each item:
 * {
 *   "q": "Question prompt text",
 *   "options": {
 *     "A": "Option text 1",
 *     "B": "Option text 2",
 *     "C": "Option text 3",
 *     "D": "Option text 4"
 *   },
 *   "answer": "A",
 *   "explanation": "Rationale explanation",
 *   "section": "Optional section name",
 *   "page": 2,
 *   "id": 1
 * }
 */

function validateAndSanitizeMcqs(input) {
  let items = input;

  // If passed as raw JSON string, attempt to parse
  if (typeof input === 'string') {
    try {
      items = JSON.parse(input);
    } catch (err) {
      return {
        isValid: false,
        totalCount: 0,
        validCount: 0,
        invalidCount: 0,
        errors: [{ index: -1, error: `Invalid JSON syntax: ${err.message}` }],
        cleanedQuestions: [],
      };
    }
  }

  // Handle single object wrapped in array
  if (!Array.isArray(items)) {
    if (items && typeof items === 'object') {
      items = [items];
    } else {
      return {
        isValid: false,
        totalCount: 0,
        validCount: 0,
        invalidCount: 0,
        errors: [{ index: -1, error: 'Uploaded data must be a JSON array of question objects' }],
        cleanedQuestions: [],
      };
    }
  }

  const errors = [];
  const cleanedQuestions = [];

  items.forEach((item, index) => {
    const itemErrors = [];

    if (!item || typeof item !== 'object') {
      errors.push({
        index,
        error: `Item at index ${index} is not an object.`,
      });
      return;
    }

    // 1. Question text (q or question)
    const questionText = (item.q || item.question || '').toString().trim();
    if (!questionText) {
      itemErrors.push('Missing question text ("q")');
    }

    // 2. Options validation
    const rawOptions = item.options;
    const sanitizedOptions = {
      A: '',
      B: '',
      C: '',
      D: '',
    };

    if (!rawOptions || typeof rawOptions !== 'object') {
      itemErrors.push('Missing or invalid "options" object');
    } else if (Array.isArray(rawOptions)) {
      // Support array of option objects: [{ id: 'A', text: '...' }] or strings ['opt1', 'opt2']
      const keys = ['A', 'B', 'C', 'D'];
      rawOptions.forEach((opt, optIdx) => {
        if (optIdx < 4) {
          const key = keys[optIdx];
          sanitizedOptions[key] = (typeof opt === 'string' ? opt : opt.text || opt.value || '').trim();
        }
      });
    } else {
      // Object format: { "A": "...", "B": "..." }
      ['A', 'B', 'C', 'D'].forEach((key) => {
        if (rawOptions[key] !== undefined && rawOptions[key] !== null) {
          sanitizedOptions[key] = rawOptions[key].toString().trim();
        }
      });
    }

    if (!sanitizedOptions.A || !sanitizedOptions.B) {
      itemErrors.push('At least Option A and Option B must be provided with non-empty text');
    }

    // 3. Answer validation
    let rawAnswer = (item.answer || item.correctAnswer || item.correctOption || '').toString().trim().toUpperCase();
    
    // Normalize numeric answer: 1 -> A, 2 -> B, etc.
    if (rawAnswer === '1') rawAnswer = 'A';
    if (rawAnswer === '2') rawAnswer = 'B';
    if (rawAnswer === '3') rawAnswer = 'C';
    if (rawAnswer === '4') rawAnswer = 'D';

    if (!rawAnswer) {
      itemErrors.push('Missing "answer" property');
    } else if (!['A', 'B', 'C', 'D'].includes(rawAnswer)) {
      itemErrors.push(`Invalid answer "${rawAnswer}". Answer must be "A", "B", "C", or "D"`);
    } else if (!sanitizedOptions[rawAnswer]) {
      itemErrors.push(`Answer is "${rawAnswer}", but Option ${rawAnswer} has empty or missing text`);
    }

    // 4. Optional fields
    const explanation = (item.explanation || '').toString().trim();
    const section = (item.section || '').toString().trim();
    const page = typeof item.page === 'number' ? item.page : null;
    const sourceId = item.id !== undefined ? item.id : null;
    const difficulty = ['easy', 'medium', 'hard'].includes((item.difficulty || '').toLowerCase())
      ? item.difficulty.toLowerCase()
      : 'medium';

    if (itemErrors.length > 0) {
      errors.push({
        index,
        sourceId,
        q: questionText || `Question #${index + 1}`,
        error: itemErrors.join('; '),
      });
    } else {
      cleanedQuestions.push({
        sourceId,
        q: questionText,
        options: sanitizedOptions,
        answer: rawAnswer,
        explanation,
        section,
        page,
        difficulty,
        status: 'approved',
      });
    }
  });

  return {
    isValid: errors.length === 0,
    totalCount: items.length,
    validCount: cleanedQuestions.length,
    invalidCount: errors.length,
    errors,
    cleanedQuestions,
  };
}

module.exports = {
  validateAndSanitizeMcqs,
};


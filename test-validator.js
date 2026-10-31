const { validateAndSanitizeMcqs } = require('./utils/questionValidator');

// Sample test item from user prompt
const sampleItems = [
  {
    "section": "Flash Facts Radiation Safety",
    "page": 2,
    "q": "1 rem equals how many mSv?",
    "options": {
      "A": "10 mSv",
      "B": "0.1 mSv",
      "C": "100 mSv",
      "D": "1 mSv"
    },
    "answer": "A",
    "explanation": "1 rem = 1000 mrem = 10 mSv = 0.01 Sv.",
    "id": 1
  },
  {
    "section": "Radionuclide Decay",
    "page": 5,
    "q": "What is the half-life of Tc-99m?",
    "options": {
      "A": "6 h",
      "B": "76 s",
      "C": "64.5 h",
      "D": "8 days"
    },
    "answer": "A",
    "explanation": "Decay table: Tc-99m half-life 6 h.",
    "id": 98
  },
  // An intentionally malformed item to test validator error catching
  {
    "q": "",
    "options": { "A": "Yes" },
    "answer": "Z"
  }
];

const result = validateAndSanitizeMcqs(sampleItems);
console.log('--- VALIDATION TEST RESULTS ---');
console.log('Total:', result.totalCount);
console.log('Valid:', result.validCount);
console.log('Invalid:', result.invalidCount);
console.log('Errors caught:', JSON.stringify(result.errors, null, 2));
console.log('Cleaned item sample:', JSON.stringify(result.cleanedQuestions[0], null, 2));

if (result.validCount === 2 && result.invalidCount === 1) {
  console.log('PASS: Validator correctly accepted valid items and flagged malformed item.');
} else {
  console.error('FAIL: Unexpected validation result.');
}


const express = require('express');
const router = express.Router();
const questionController = require('../controllers/question.controller');
const { authenticateToken, requireRole } = require('../middlewares/auth.middleware');

// Public / Read
router.get('/', (req, res, next) => questionController.getQuestions(req, res, next));
router.get('/:id', (req, res, next) => questionController.getQuestionById(req, res, next));

// Validation endpoint (can be called by authenticated users or admins to preview questions)
router.post('/validate', authenticateToken, (req, res, next) =>
  questionController.validateQuestions(req, res, next)
);

// Admin batch upload endpoint
router.post('/batch', authenticateToken, requireRole('admin'), (req, res, next) =>
  questionController.batchUpload(req, res, next)
);

// Admin single question CRUD
router.post('/', authenticateToken, requireRole('admin'), (req, res, next) =>
  questionController.createQuestion(req, res, next)
);
router.put('/:id', authenticateToken, requireRole('admin'), (req, res, next) =>
  questionController.updateQuestion(req, res, next)
);
router.delete('/:id', authenticateToken, requireRole('admin'), (req, res, next) =>
  questionController.deleteQuestion(req, res, next)
);

module.exports = router;


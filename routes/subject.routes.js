const express = require('express');
const router = express.Router();
const subjectController = require('../controllers/subject.controller');
const { authenticateToken, requireRole } = require('../middlewares/auth.middleware');

// Public / Read
router.get('/', (req, res, next) => subjectController.getSubjects(req, res, next));
router.get('/:id', (req, res, next) => subjectController.getSubjectById(req, res, next));

// Admin / Write
router.post('/', authenticateToken, requireRole('admin'), (req, res, next) =>
  subjectController.createSubject(req, res, next)
);
router.put('/:id', authenticateToken, requireRole('admin'), (req, res, next) =>
  subjectController.updateSubject(req, res, next)
);
router.delete('/:id', authenticateToken, requireRole('admin'), (req, res, next) =>
  subjectController.deleteSubject(req, res, next)
);

module.exports = router;


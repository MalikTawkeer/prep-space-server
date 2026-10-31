const express = require('express');
const router = express.Router();
const chapterController = require('../controllers/chapter.controller');
const { authenticateToken, requireRole } = require('../middlewares/auth.middleware');

// Public / Read
router.get('/', (req, res, next) => chapterController.getChapters(req, res, next));
router.get('/:id', (req, res, next) => chapterController.getChapterById(req, res, next));

// Admin / Write
router.post('/', authenticateToken, requireRole('admin'), (req, res, next) =>
  chapterController.createChapter(req, res, next)
);
router.put('/:id', authenticateToken, requireRole('admin'), (req, res, next) =>
  chapterController.updateChapter(req, res, next)
);
router.delete('/:id', authenticateToken, requireRole('admin'), (req, res, next) =>
  chapterController.deleteChapter(req, res, next)
);

module.exports = router;


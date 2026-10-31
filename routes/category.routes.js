const express = require('express');
const router = express.Router();
const categoryController = require('../controllers/category.controller');
const { authenticateToken, requireRole } = require('../middlewares/auth.middleware');

// Public / Read
router.get('/', (req, res, next) => categoryController.getCategories(req, res, next));
router.get('/:id', (req, res, next) => categoryController.getCategoryById(req, res, next));

// Admin / Write
router.post('/', authenticateToken, requireRole('admin'), (req, res, next) =>
  categoryController.createCategory(req, res, next)
);
router.put('/:id', authenticateToken, requireRole('admin'), (req, res, next) =>
  categoryController.updateCategory(req, res, next)
);
router.delete('/:id', authenticateToken, requireRole('admin'), (req, res, next) =>
  categoryController.deleteCategory(req, res, next)
);

module.exports = router;


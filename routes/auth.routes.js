const express = require('express');
const router = express.Router();
const authController = require('../controllers/auth.controller');
const { authenticateToken } = require('../middlewares/auth.middleware');

// User Auth Routes
router.post('/user/signup', (req, res, next) => authController.userSignUp(req, res, next));
router.post('/user/signin', (req, res, next) => authController.userSignIn(req, res, next));

// Admin Auth Routes
router.post('/admin/signin', (req, res, next) => authController.adminSignIn(req, res, next));

// Authenticated Profile Route
router.get('/profile', authenticateToken, (req, res, next) => authController.getProfile(req, res, next));

module.exports = router;

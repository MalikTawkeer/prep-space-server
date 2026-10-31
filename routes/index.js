const express = require('express');
const router = express.Router();
const authRoutes = require('./auth.routes');
const categoryRoutes = require('./category.routes');
const subjectRoutes = require('./subject.routes');
const chapterRoutes = require('./chapter.routes');
const questionRoutes = require('./question.routes');

// Health Check
router.get('/health', (req, res) => {
  res.json({
    status: 'ok',
    timestamp: new Date().toISOString(),
    uptime: process.uptime(),
  });
});

// Mounted API Routes
router.use('/auth', authRoutes);
router.use('/categories', categoryRoutes);
router.use('/subjects', subjectRoutes);
router.use('/chapters', chapterRoutes);
router.use('/questions', questionRoutes);

module.exports = router;

const questionService = require('../services/question.service');

class QuestionController {
  /**
   * Validate JSON payload before saving
   * POST /api/questions/validate
   */
  async validateQuestions(req, res, next) {
    try {
      const { json, questions } = req.body;
      const dataToValidate = json !== undefined ? json : questions;

      if (!dataToValidate) {
        return res.status(400).json({
          success: false,
          message: 'No JSON payload or questions provided for validation',
        });
      }

      const result = questionService.validateJson(dataToValidate);

      return res.status(200).json({
        success: true,
        data: result,
      });
    } catch (error) {
      next(error);
    }
  }

  /**
   * Batch Upload approved questions to a chapter
   * POST /api/questions/batch
   */
  async batchUpload(req, res, next) {
    try {
      const { chapterId, questions } = req.body;
      const userId = req.user ? req.user.id : null;

      const result = await questionService.batchUpload({
        chapterId,
        questions,
        userId,
      });

      return res.status(201).json({
        success: true,
        message: `Successfully uploaded ${result.insertedCount} questions into chapter.`,
        data: result,
      });
    } catch (error) {
      next(error);
    }
  }

  /**
   * Get questions by chapter or by list of IDs
   * GET /api/questions?chapterId=... or GET /api/questions?ids=id1,id2
   */
  async getQuestions(req, res, next) {
    try {
      const { chapterId, ids, status } = req.query;

      let questions = [];
      if (ids) {
        const idList = typeof ids === 'string'
          ? ids.split(',').map((s) => s.trim()).filter(Boolean)
          : Array.isArray(ids) ? ids : [ids];
        questions = await questionService.getQuestionsByIds(idList);
      } else if (chapterId) {
        questions = await questionService.getQuestionsByChapter(chapterId, { status });
      } else {
        questions = await questionService.getAllQuestions({ status });
      }

      return res.status(200).json({
        success: true,
        count: questions.length,
        data: questions,
      });
    } catch (error) {
      next(error);
    }
  }

  /**
   * Get single question by ID
   * GET /api/questions/:id
   */
  async getQuestionById(req, res, next) {
    try {
      const question = await questionService.getQuestionById(req.params.id);
      return res.status(200).json({
        success: true,
        data: question,
      });
    } catch (error) {
      next(error);
    }
  }

  /**
   * Create single question
   * POST /api/questions
   */
  async createQuestion(req, res, next) {
    try {
      const userId = req.user ? req.user.id : null;
      const question = await questionService.createQuestion(req.body, userId);

      return res.status(201).json({
        success: true,
        message: 'Question created successfully',
        data: question,
      });
    } catch (error) {
      next(error);
    }
  }

  /**
   * Update question
   * PUT /api/questions/:id
   */
  async updateQuestion(req, res, next) {
    try {
      const question = await questionService.updateQuestion(req.params.id, req.body);
      return res.status(200).json({
        success: true,
        message: 'Question updated successfully',
        data: question,
      });
    } catch (error) {
      next(error);
    }
  }

  /**
   * Delete question
   * DELETE /api/questions/:id
   */
  async deleteQuestion(req, res, next) {
    try {
      await questionService.deleteQuestion(req.params.id);
      return res.status(200).json({
        success: true,
        message: 'Question deleted successfully',
      });
    } catch (error) {
      next(error);
    }
  }
}

module.exports = new QuestionController();


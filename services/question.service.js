const mongoose = require('mongoose');
const Question = require('../models/question.model');
const Chapter = require('../models/chapter.model');
const { validateAndSanitizeMcqs } = require('../utils/questionValidator');

class QuestionService {
  /**
   * Validate raw JSON of MCQs without saving to database.
   * Useful for the preview and verification stage.
   */
  validateJson(rawJson) {
    return validateAndSanitizeMcqs(rawJson);
  }

  /**
   * Batch insert approved MCQs into a specific chapter.
   */
  async batchUpload({ chapterId, questions, userId }) {
    if (!chapterId) {
      const error = new Error('chapterId is required for batch question upload');
      error.statusCode = 400;
      throw error;
    }

    // Verify chapter exists and retrieve hierarchy identifiers
    const chapter = await Chapter.findById(chapterId);
    if (!chapter) {
      const error = new Error(`Chapter not found with id: ${chapterId}`);
      error.statusCode = 404;
      throw error;
    }

    if (!Array.isArray(questions) || questions.length === 0) {
      const error = new Error('No questions provided for batch upload');
      error.statusCode = 400;
      throw error;
    }

    // Validate and sanitize the approved questions
    const validation = validateAndSanitizeMcqs(questions);
    if (!validation.isValid && validation.validCount === 0) {
      const error = new Error('None of the provided questions passed validation');
      error.statusCode = 400;
      error.validationErrors = validation.errors;
      throw error;
    }

    // Prepare documents with foreign keys
    const docsToInsert = validation.cleanedQuestions.map((q) => ({
      chapterId: chapter._id,
      subjectId: chapter.subjectId,
      categoryId: chapter.categoryId,
      q: q.q,
      options: q.options,
      answer: q.answer,
      explanation: q.explanation,
      section: q.section,
      page: q.page,
      sourceId: q.sourceId,
      difficulty: q.difficulty || 'medium',
      status: 'approved',
      isActive: true,
      createdBy: userId || null,
    }));

    const inserted = await Question.insertMany(docsToInsert, { ordered: false });

    return {
      success: true,
      chapter: {
        id: chapter._id,
        title: chapter.title,
      },
      totalSubmitted: questions.length,
      insertedCount: inserted.length,
      invalidCount: validation.invalidCount,
      errors: validation.errors,
      questions: inserted,
    };
  }

  /**
   * Fetch MCQs for a chapter
   */
  async getQuestionsByChapter(chapterId, query = {}) {
    const filter = { chapterId, isActive: true };
    if (query.status) {
      filter.status = query.status;
    }
    return Question.find(filter)
      .populate('chapterId', 'title chapterNumber subjectId')
      .populate('subjectId', 'title icon')
      .sort({ createdAt: -1 });
  }

  /**
   * Fetch MCQs by array of IDs
   */
  async getQuestionsByIds(idList) {
    if (!idList || idList.length === 0) return [];
    const validObjectIds = idList.filter((id) => mongoose.Types.ObjectId.isValid(id));

    return Question.find({
      isActive: true,
      $or: [
        { _id: { $in: validObjectIds } },
        { sourceId: { $in: idList } },
        { id: { $in: idList } },
      ],
    })
      .populate('chapterId', 'title chapterNumber subjectId')
      .populate('subjectId', 'title icon')
      .sort({ createdAt: -1 });
  }

  /**
   * Fetch all active MCQs
   */
  async getAllQuestions(query = {}) {
    const filter = { isActive: true };
    if (query.status) {
      filter.status = query.status;
    }
    return Question.find(filter)
      .populate('chapterId', 'title chapterNumber subjectId')
      .populate('subjectId', 'title icon')
      .sort({ createdAt: -1 })
      .limit(200);
  }

  /**
   * Single question operations
   */
  async getQuestionById(id) {
    const question = await Question.findById(id);
    if (!question) {
      const error = new Error('Question not found');
      error.statusCode = 404;
      throw error;
    }
    return question;
  }

  async createQuestion(data, userId) {
    if (!data.chapterId) {
      const error = new Error('chapterId is required');
      error.statusCode = 400;
      throw error;
    }

    const chapter = await Chapter.findById(data.chapterId);
    if (!chapter) {
      const error = new Error('Chapter not found');
      error.statusCode = 404;
      throw error;
    }

    const question = new Question({
      ...data,
      subjectId: chapter.subjectId,
      categoryId: chapter.categoryId,
      createdBy: userId || null,
    });

    return question.save();
  }

  async updateQuestion(id, data) {
    const question = await Question.findByIdAndUpdate(id, data, {
      new: true,
      runValidators: true,
    });
    if (!question) {
      const error = new Error('Question not found');
      error.statusCode = 404;
      throw error;
    }
    return question;
  }

  async deleteQuestion(id) {
    const question = await Question.findByIdAndDelete(id);
    if (!question) {
      const error = new Error('Question not found');
      error.statusCode = 404;
      throw error;
    }
    return question;
  }
}

module.exports = new QuestionService();


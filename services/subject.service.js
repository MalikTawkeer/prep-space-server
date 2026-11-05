const Subject = require('../models/subject.model');
const Chapter = require('../models/chapter.model');
const Question = require('../models/question.model');

class SubjectService {
  async getSubjects(filter = {}) {
    const query = { isActive: true };
    if (filter.categoryId) {
      query.categoryId = filter.categoryId;
    }
    return Subject.find(query).populate('categoryId', 'title examId color').sort({ order: 1, createdAt: 1 });
  }

  async getSubjectById(id) {
    const subject = await Subject.findById(id).populate('categoryId', 'title examId color');
    if (!subject) {
      const error = new Error('Subject not found');
      error.statusCode = 404;
      throw error;
    }
    return subject;
  }

  async createSubject(data) {
    if (!data.categoryId || !data.title) {
      const error = new Error('Category and Subject title are required');
      error.statusCode = 400;
      throw error;
    }
    const subject = new Subject(data);
    return subject.save();
  }

  async updateSubject(id, data) {
    const subject = await Subject.findByIdAndUpdate(id, data, {
      new: true,
      runValidators: true,
    });
    if (!subject) {
      const error = new Error('Subject not found');
      error.statusCode = 404;
      throw error;
    }
    return subject;
  }

  async deleteSubject(id) {
    const subject = await Subject.findById(id);
    if (!subject) {
      const error = new Error('Subject not found');
      error.statusCode = 404;
      throw error;
    }

    // Find all chapters under this subject
    const chapters = await Chapter.find({ subjectId: id });
    const chapterIds = chapters.map((c) => c._id);

    // Cascade delete all questions under this subject or its chapters
    const deletedQuestions = await Question.deleteMany({
      $or: [
        { subjectId: id },
        { chapterId: { $in: chapterIds } },
      ],
    });

    // Cascade delete all chapters under this subject
    const deletedChapters = await Chapter.deleteMany({ subjectId: id });

    // Finally delete the subject
    await Subject.findByIdAndDelete(id);

    return {
      subject,
      deletedChaptersCount: deletedChapters.deletedCount || 0,
      deletedQuestionsCount: deletedQuestions.deletedCount || 0,
    };
  }
}

module.exports = new SubjectService();


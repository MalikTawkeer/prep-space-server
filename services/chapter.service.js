const Chapter = require('../models/chapter.model');
const Subject = require('../models/subject.model');

class ChapterService {
  async getChapters(filter = {}) {
    const query = { isActive: true };
    if (filter.subjectId) {
      query.subjectId = filter.subjectId;
    }
    if (filter.categoryId) {
      query.categoryId = filter.categoryId;
    }
    return Chapter.find(query)
      .populate('subjectId', 'title categoryId')
      .sort({ chapterNumber: 1, order: 1, createdAt: 1 });
  }

  async getChapterById(id) {
    const chapter = await Chapter.findById(id).populate('subjectId', 'title categoryId');
    if (!chapter) {
      const error = new Error('Chapter not found');
      error.statusCode = 404;
      throw error;
    }
    return chapter;
  }

  async createChapter(data) {
    if (!data.subjectId || !data.title) {
      const error = new Error('Subject and Chapter title are required');
      error.statusCode = 400;
      throw error;
    }

    // Auto-populate categoryId from subject if not provided
    if (!data.categoryId && data.subjectId) {
      const parentSub = await Subject.findById(data.subjectId);
      if (parentSub) {
        data.categoryId = parentSub.categoryId;
        if (!data.examId) {
          data.examId = parentSub.examId;
        }
      }
    }

    const chapter = new Chapter(data);
    return chapter.save();
  }

  async updateChapter(id, data) {
    const chapter = await Chapter.findByIdAndUpdate(id, data, {
      new: true,
      runValidators: true,
    });
    if (!chapter) {
      const error = new Error('Chapter not found');
      error.statusCode = 404;
      throw error;
    }
    return chapter;
  }

  async deleteChapter(id) {
    const chapter = await Chapter.findByIdAndDelete(id);
    if (!chapter) {
      const error = new Error('Chapter not found');
      error.statusCode = 404;
      throw error;
    }
    return chapter;
  }
}

module.exports = new ChapterService();


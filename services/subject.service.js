const Subject = require('../models/subject.model');

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
    const subject = await Subject.findByIdAndDelete(id);
    if (!subject) {
      const error = new Error('Subject not found');
      error.statusCode = 404;
      throw error;
    }
    return subject;
  }
}

module.exports = new SubjectService();


const Category = require('../models/category.model');
const Subject = require('../models/subject.model');
const Chapter = require('../models/chapter.model');
const Question = require('../models/question.model');

class CategoryService {
  async getAllCategories() {
    return Category.find({ isActive: true }).sort({ order: 1, createdAt: 1 });
  }

  async getCategoryById(id) {
    const category = await Category.findById(id);
    if (!category) {
      const error = new Error('Category not found');
      error.statusCode = 404;
      throw error;
    }
    return category;
  }

  async createCategory(data) {
    if (!data.title) {
      const error = new Error('Category title is required');
      error.statusCode = 400;
      throw error;
    }
    const category = new Category(data);
    return category.save();
  }

  async updateCategory(id, data) {
    const category = await Category.findByIdAndUpdate(id, data, {
      new: true,
      runValidators: true,
    });
    if (!category) {
      const error = new Error('Category not found');
      error.statusCode = 404;
      throw error;
    }
    return category;
  }

  async deleteCategory(id) {
    const category = await Category.findById(id);
    if (!category) {
      const error = new Error('Category not found');
      error.statusCode = 404;
      throw error;
    }

    // Find all subjects belonging to this category
    const subjects = await Subject.find({ categoryId: id });
    const subjectIds = subjects.map((s) => s._id);

    // Find all chapters belonging to this category or its subjects
    const chapters = await Chapter.find({
      $or: [{ categoryId: id }, { subjectId: { $in: subjectIds } }],
    });
    const chapterIds = chapters.map((c) => c._id);

    // Cascade delete all questions linked to this category, its subjects, or its chapters
    const deletedQuestions = await Question.deleteMany({
      $or: [
        { categoryId: id },
        { subjectId: { $in: subjectIds } },
        { chapterId: { $in: chapterIds } },
      ],
    });

    // Cascade delete all chapters
    const deletedChapters = await Chapter.deleteMany({
      $or: [{ categoryId: id }, { subjectId: { $in: subjectIds } }],
    });

    // Cascade delete all subjects
    const deletedSubjects = await Subject.deleteMany({ categoryId: id });

    // Finally delete the category itself
    await Category.findByIdAndDelete(id);

    return {
      category,
      deletedSubjectsCount: deletedSubjects.deletedCount || 0,
      deletedChaptersCount: deletedChapters.deletedCount || 0,
      deletedQuestionsCount: deletedQuestions.deletedCount || 0,
    };
  }
}

module.exports = new CategoryService();


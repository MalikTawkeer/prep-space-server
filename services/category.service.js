const Category = require('../models/category.model');
const { ensureDefaultData } = require('../utils/autoSeed');

class CategoryService {
  async getAllCategories() {
    await ensureDefaultData();
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
    const category = await Category.findByIdAndDelete(id);
    if (!category) {
      const error = new Error('Category not found');
      error.statusCode = 404;
      throw error;
    }
    return category;
  }
}

module.exports = new CategoryService();


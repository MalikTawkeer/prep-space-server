const mongoose = require('mongoose');

const categorySchema = new mongoose.Schema(
  {
    title: {
      type: String,
      required: [true, 'Category title is required'],
      trim: true,
      minlength: [2, 'Title must be at least 2 characters long'],
      maxlength: [100, 'Title cannot exceed 100 characters'],
    },
    subtitle: {
      type: String,
      trim: true,
      default: '',
    },
    examId: {
      type: String,
      trim: true,
      default: '',
      index: true,
    },
    icon: {
      type: String,
      default: 'book-open-page-variant',
    },
    color: {
      type: String,
      enum: ['green', 'blue', 'orange', 'purple'],
      default: 'blue',
    },
    order: {
      type: Number,
      default: 0,
    },
    isActive: {
      type: Boolean,
      default: true,
    },
  },
  {
    timestamps: true,
  }
);

module.exports = mongoose.model('Category', categorySchema);


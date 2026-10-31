const mongoose = require('mongoose');

const questionSchema = new mongoose.Schema(
  {
    chapterId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Chapter',
      required: [true, 'Chapter reference (chapterId) is required'],
      index: true,
    },
    subjectId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Subject',
      index: true,
    },
    categoryId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Category',
      index: true,
    },
    // Question text matching JSON 'q'
    q: {
      type: String,
      required: [true, 'Question text (q) is required'],
      trim: true,
    },
    // Options object matching JSON 'options': { A, B, C, D }
    options: {
      A: {
        type: String,
        required: [true, 'Option A is required'],
        trim: true,
      },
      B: {
        type: String,
        required: [true, 'Option B is required'],
        trim: true,
      },
      C: {
        type: String,
        trim: true,
        default: '',
      },
      D: {
        type: String,
        trim: true,
        default: '',
      },
    },
    // Correct answer matching JSON 'answer' ('A', 'B', 'C', or 'D')
    answer: {
      type: String,
      required: [true, 'Correct answer is required'],
      trim: true,
      uppercase: true,
      validate: {
        validator: function (v) {
          return ['A', 'B', 'C', 'D'].includes(v);
        },
        message: (props) => `${props.value} is not a valid answer (must be A, B, C, or D)`,
      },
    },
    // Detailed explanation matching JSON 'explanation'
    explanation: {
      type: String,
      trim: true,
      default: '',
    },
    // Extra metadata fields found in uploaded question sets
    section: {
      type: String,
      trim: true,
      default: '',
    },
    page: {
      type: Number,
      default: null,
    },
    sourceId: {
      type: mongoose.Schema.Types.Mixed,
      default: null,
    },
    difficulty: {
      type: String,
      enum: ['easy', 'medium', 'hard'],
      default: 'medium',
    },
    status: {
      type: String,
      enum: ['approved', 'discarded', 'draft'],
      default: 'approved',
    },
    isActive: {
      type: Boolean,
      default: true,
    },
    createdBy: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
    },
  },
  {
    timestamps: true,
  }
);

// Compound index for fast queries by chapter and status
questionSchema.index({ chapterId: 1, status: 1, createdAt: -1 });

module.exports = mongoose.model('Question', questionSchema);


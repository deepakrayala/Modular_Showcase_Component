const mongoose = require('mongoose');

const componentSchema = new mongoose.Schema({
  name: {
    type: String,
    required: true,
    trim: true,
  },
  category: {
    type: String,
    required: true,
    trim: true,
  },
  description: {
    type: String,
    default: '',
  },
  codeSnippet: {
    type: String,
    default: '',
  },
  props: {
    type: String,
    default: '',
  },
  status: {
    type: String,
    enum: ['active', 'draft', 'deprecated'],
    default: 'active',
  },
  tags: {
    type: [String],
    default: [],
  },
  createdBy: {
    type: String,
    default: 'Admin',
  },
  createdAt: {
    type: Date,
    default: Date.now,
  },
  updatedAt: {
    type: Date,
    default: Date.now,
  },
});

componentSchema.pre('save', function (next) {
  this.updatedAt = new Date();
  next();
});

componentSchema.pre('findOneAndUpdate', function (next) {
  this.set({ updatedAt: new Date() });
  next();
});

module.exports = mongoose.model('Component', componentSchema);

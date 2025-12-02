const mongoose = require('mongoose');

const contentSchema = new mongoose.Schema({
  userId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true,
    unique: true,
  },
  content: {
    type: String,
    default: '',
  },
  columns: {
    type: Number,
    default: 2,
    min: 1,
    max: 3,
  },
  fontSize: {
    type: Number,
    default: 14,
    min: 8,
    max: 32,
  },
  updatedAt: {
    type: Date,
    default: Date.now,
  },
});

// Update the updatedAt field before saving
contentSchema.pre('save', function(next) {
  this.updatedAt = Date.now();
  next();
});

module.exports = mongoose.model('Content', contentSchema);

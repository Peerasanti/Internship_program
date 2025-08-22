const mongoose = require('mongoose');

const expenseSchema = new mongoose.Schema({
  categoryId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Category',
    required: true,
  },
  amount: {
    type: Number,
    required: true,
  },
  date: {
    type: String,
    required: true,
  },
  description: {
    type: String,
    default: '',
  },
});

expenseSchema.index({ date: 1 });
expenseSchema.index({ categoryId: 1 });

module.exports = mongoose.model('Expense', expenseSchema);
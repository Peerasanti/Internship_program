const express = require('express');
const router = express.Router();
const Expense = require('../models/Expense');
const Category = require('../models/Category');

// ค่าใช้จ่ายทั้งหมด และสามารถรองรับการกรอกได้ทั้งหมด
router.get('/', async (req, res) => {
  try {
    const { startDate, endDate, categoryId, minAmount, maxAmount } = req.query;
    const query = {};

    if (startDate && endDate) {
      query.date = { $gte: startDate, $lte: endDate };
    }
    if (categoryId) {
      if (!categoryId.match(/^[0-9a-fA-F]{24}$/)) {
        return res.status(400).json({ error: 'Invalid category ID' });
      }
      query.categoryId = categoryId;
    }
    if (minAmount) {
      query.amount = { ...query.amount, $gte: parseFloat(minAmount) };
    }
    if (maxAmount) {
      query.amount = { ...query.amount, $lte: parseFloat(maxAmount) };
    }

    const expenses = await Expense.find(query).populate('categoryId', 'name');
    res.json(expenses);
  } catch (error) {
    res.status(500).json({ error: 'Error fetching expenses' });
  }
});

// ค่าใช้จ่ายตามวันที่
router.get('/byDate/:startDate/:endDate', async (req, res) => {
  try {
    const { startDate, endDate } = req.params;
    const expenses = await Expense.find({
      date: { $gte: startDate, $lte: endDate },
    }).populate('categoryId', 'name');
    res.json(expenses);
  } catch (error) {
    res.status(500).json({ error: 'Error fetching expenses by date' });
  }
});

// ค่าใช้จ่ายตามประเภท
router.get('/byCategory/:categoryId', async (req, res) => {
  try {
    const { categoryId } = req.params;
    if (!categoryId.match(/^[0-9a-fA-F]{24}$/)) {
      return res.status(400).json({ error: 'Invalid category ID' });
    }
    const expenses = await Expense.find({ categoryId }).populate('categoryId', 'name');
    res.json(expenses);
  } catch (error) {
    res.status(500).json({ error: 'Error fetching expenses by category' });
  }
});

// บันทึกค่าใช้จ่าย
router.post('/', async (req, res) => {
  try {
    const expense = new Expense(req.body);
    await expense.save();
    const populatedExpense = await Expense.findById(expense._id).populate('categoryId', 'name');
    res.status(201).json(populatedExpense);
  } catch (error) {
    res.status(500).json({ error: 'Error saving expense' });
  }
});

module.exports = router;
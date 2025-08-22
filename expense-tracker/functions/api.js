const express = require('express');
const serverless = require('serverless-http');
const mongoose = require('mongoose');
const cors = require('cors');
require('dotenv').config();

// console.log('process.env.MONGODB_URI', process.env.MONGODB_URI);
const app = express();
app.use(cors({ origin: "*" }));
app.use(express.json());

mongoose.connect(process.env.MONGODB_URI).catch(err => console.error('MongoDB connection error:', err));

mongoose.connection.on('connected', () => {
  console.log('MongoDB connected successfully at', new Date().toISOString());
});

const expenseRoutes = require('./routes/expenseRoute');
const categoryRoutes = require('./routes/categoryRoute');
app.use('/expenses', expenseRoutes);
app.use('/categories', categoryRoutes);

app.get('/', (req, res) => {
  res.json({ message: 'API is working!' });
});

module.exports.handler = serverless(app);
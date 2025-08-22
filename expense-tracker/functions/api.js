const express = require('express');
const serverless = require('serverless-http');
const mongoose = require('mongoose');
const cors = require('cors');

const app = express();
app.use(cors({ origin: process.env.REACT_APP_FRONTEND_URL || 'http://localhost:3000' }));
app.use(express.json());

mongoose.connect(process.env.MONGODB_URI, {
  useNewUrlParser: true,
  useUnifiedTopology: true,
}).catch(err => console.error('MongoDB connection error:', err));

const DataSchema = new mongoose.Schema({ message: String });
const Data = mongoose.model('Data', DataSchema);

const expenseRoutes = require('./routes/expenseRoute');
const categoryRoutes = require('./routes/categoryRoute');
app.use('/expenses', expenseRoutes);
app.use('/categories', categoryRoutes);

module.exports.handler = serverless(app);
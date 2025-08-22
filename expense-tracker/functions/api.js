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

const expenseRoutes = require('./routes/expenseRoute');
const categoryRoutes = require('./routes/categoryRoute');
app.use('/expenses', expenseRoutes);
app.use('/categories', categoryRoutes);

app.get('/', (req, res) => {
  res.json({ message: 'API is working!' });
});

module.exports.handler = serverless(app);
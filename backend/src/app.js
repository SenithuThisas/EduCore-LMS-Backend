const path = require('path');
const express = require('express');
const cors = require('cors');

const apiRoutes = require('./routes');
const { errorHandler } = require('./middlewares/errorHandler');

const app = express();

const allowedOrigin = process.env.CLIENT_ORIGIN || 'http://localhost:3000';
const requestLimit = process.env.REQUEST_LIMIT || '5mb';

app.use(
  cors({
    origin: allowedOrigin,
    credentials: true
  })
);
app.use(express.json({ limit: requestLimit }));
app.use(express.urlencoded({ extended: true, limit: requestLimit }));

app.get('/', (_req, res) => {
  res.json({ status: 'ok', message: 'LMS Backend API is running' });
});

app.get('/health', (_req, res) => {
  res.json({ status: 'ok' });
});

app.use('/uploads', express.static(path.join(__dirname, '..', 'uploads')));

app.use('/api', apiRoutes);

app.use((req, res, next) => {
  res.status(404).json({ message: 'Route not found' });
});

app.use(errorHandler);

module.exports = app;

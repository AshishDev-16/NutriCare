const express = require('express');
const cors = require('cors');
const morgan = require('morgan');
const helmet = require('helmet');
const cookieParser = require('cookie-parser');
require('dotenv').config();
const connectDB = require('./config/db');
const errorMiddleware = require('./middleware/error.middleware');

const app = express();

// Middleware
app.use(helmet());
app.use(morgan('dev'));
app.use(cors({
  origin: [process.env.FRONTEND_URL, 'https://nutricare-frontend.vercel.app'],
  credentials: true
}));
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(cookieParser());

// Health check route
app.get('/health', (req, res) => {
  res.status(200).json({ status: 'ok' });
});

// Routes
app.use('/api/v1', require('./routes/index.routes'));

// Error Handler
app.use(errorMiddleware);

// Add this before your other routes
app.get('/', (req, res) => {
  res.json({ 
    message: 'NutriCare API Server',
    version: '1.0.0',
    status: 'running'
  });
});

const PORT = process.env.PORT || 5000;

// Connect to DB and start server
connectDB().then(() => {
  app.listen(PORT, () => {
    console.log(`Server running on port ${PORT}`);
  });
}); 
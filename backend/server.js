const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');
const morgan = require('morgan');
const helmet = require('helmet');
const cookieParser = require('cookie-parser');
const jwt = require('jsonwebtoken');
require('dotenv').config();
const connectDB = require('./config/db');
const errorMiddleware = require('./middleware/error.middleware');
const http = require('http');
const { Server } = require('socket.io');
const notificationService = require('./services/NotificationService');

const app = express();
const server = http.createServer(app);

// CORS Configuration
const allowedOrigins = [
  'http://localhost:3000',
  'https://hospital-food-delivery.vercel.app/',
  'https://hospital-food-delivery-git-main-ashish.vercel.app/',
  'https://hospital-food-delivery-ashish.vercel.app/'
];

// Socket.io setup with CORS
const io = new Server(server, {
    cors: {
        origin: allowedOrigins,
        methods: ["GET", "POST"],
        credentials: true,
        allowedHeaders: ['Content-Type', 'Authorization']
    },
    transports: ['websocket'],
    upgrade: false
});

// JWT authentication middleware for Socket.io
io.use((socket, next) => {
    const token = socket.handshake.auth.token;
    console.log('Socket auth attempt with token:', token ? 'Present' : 'Missing');

    if (!token) {
        console.log('Socket auth failed: No token');
        return next(new Error('Authentication error'));
    }

    try {
        const decoded = jwt.verify(token, process.env.JWT_SECRET);
        console.log('Socket authenticated:', { role: decoded.role });
        socket.user = decoded;
        next();
    } catch (err) {
        console.error('Socket auth error:', err);
        next(new Error('Authentication error'));
    }
});

// Socket.io connection handling
io.on('connection', (socket) => {
    console.log('Client connected:', {
        id: socket.id,
        role: socket.user.role
    });

    // Join room based on role
    socket.join(socket.user.role);
    console.log(`User joined ${socket.user.role} room`);

    socket.on('disconnect', () => {
        console.log('Client disconnected:', socket.id);
    });
});

// Add io instance to notificationService
notificationService.setIo(io);

// Express CORS middleware
app.use(cors({
  origin: function(origin, callback) {
    // Allow requests with no origin (like mobile apps or curl requests)
    if (!origin) return callback(null, true);
    
    if (allowedOrigins.indexOf(origin) === -1) {
      const msg = 'The CORS policy for this site does not allow access from the specified Origin.';
      return callback(new Error(msg), false);
    }
    return callback(null, true);
  },
  credentials: true,
  methods: ['GET', 'POST', 'PUT', 'DELETE', 'PATCH', 'OPTIONS'],
  allowedHeaders: ['Content-Type', 'Authorization', 'Access-Control-Allow-Origin']
}));

// Other middleware
app.use(helmet());
app.use(morgan('dev'));
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(cookieParser());

// Routes
app.use('/api/v1', require('./routes/index.routes'));
app.use('/api/v1/notifications', require('./routes/notification.routes'));

// Health check route
app.get('/health', (req, res) => {
  res.status(200).json({ status: 'ok' });
});

app.get('/', (req, res) => {
  res.json({ 
    message: 'NutriCare API Server',
    version: '1.0.0',
    status: 'running'
  });
});

// Error Handler
app.use(errorMiddleware);

const PORT = process.env.PORT || 5000;

// Connect to DB and start server
connectDB().then(() => {
  server.listen(PORT, () => {
    console.log(`Server running on port ${PORT}`);
  });
}); 
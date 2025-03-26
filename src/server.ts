import express, { Request, Response, NextFunction} from 'express';
import dotenv from 'dotenv';
import cors from 'cors';
import connectDB from './config/dbConfig';
import BookRoutes from './routes/BookRoute';
import path from 'path';

// Load environment variables
dotenv.config();

// Database connection
connectDB();

const app = express();
const port = process.env.PORT;

// CORS Configuration
const corsOptions = {
  origin: [
    'https://book-nest-frontend-h7vfquysz-neethuss-projects.vercel.app',
    'http://localhost:3000' // For development
  ],
  methods: ["GET", "POST", "PUT", "PATCH", "DELETE"],
  allowedHeaders: ["Content-Type", "Authorization"],
  credentials: true,
  optionsSuccessStatus: 200
};

interface ServerError extends Error {
  status?: number;
}


// Middleware Stack (in correct order)
app.use(cors(corsOptions));
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Static file serving
app.use('/uploads', express.static(path.join(__dirname, 'uploads')));

// Debug middleware
app.use((req, res, next) => {
  console.log('Request headers:', req.headers);
  console.log('Origin:', req.headers.origin);
  next();
});

// Routes
app.use('/', BookRoutes);
app.get('/', (req, res) => {
  res.send('hello');
});

// Error handling middleware
app.use((err:ServerError, req:Request, res:Response, next:NextFunction) => {
  console.error('Server Error:', err.stack);
  res.status(err.status || 500).json({
    error: err.message,
    stack: process.env.NODE_ENV === 'development' ? err.stack : undefined
  });
});

// Start server
app.listen(port, () => {
  console.log(`Backend server connected at port ${port}`);
});
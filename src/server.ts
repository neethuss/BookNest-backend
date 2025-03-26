import express, { Express, Request, Response, NextFunction } from 'express';
import dotenv from 'dotenv';
import connectDB from './config/dbConfig';
import BookRoutes from './routes/BookRoute';
import path from 'path';
import cors from 'cors';

dotenv.config();
connectDB();

const app = express();
const port = process.env.PORT || 3003;
app.use(cors({
  origin: [
    'https://book-nest-frontend-h7vfquysz-neethuss-projects.vercel.app', 
    'http://localhost:3000'
  ],
  credentials: true,
  methods: 'GET, POST, PUT, PATCH, DELETE',
  allowedHeaders: ['Content-Type', 'Authorization']
}));

// Ensure CORS headers are always sent, even on errors
app.use((req: Request, res: Response, next: NextFunction): void => {
  res.header("Access-Control-Allow-Origin", "https://book-nest-frontend-h7vfquysz-neethuss-projects.vercel.app");
  res.header("Access-Control-Allow-Methods", "GET, POST, PUT, PATCH, DELETE, OPTIONS");
  res.header("Access-Control-Allow-Headers", "Origin, Content-Type, Authorization");
  res.header("Access-Control-Allow-Credentials", "true");

  if (req.method === "OPTIONS") {
    res.sendStatus(204);
    return;
  }

  next();
});


// Middleware
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use('/uploads', express.static(path.join(__dirname, 'uploads')));

// Routes
app.use('/', BookRoutes);

// Default Route
app.get('/', (req: Request, res: Response) => {
  res.send('Hello from the backend!');
});

// ✅ Global Error Handling (Ensures CORS Headers on Errors)
app.use((err: any, req: Request, res: Response, next: NextFunction) => {
  console.error(err.stack);
  res.status(err.status || 500).json({
    message: err.message || 'Internal Server Error'
  });
});

// Start Server
app.listen(port, () => {
  console.log(`Backend server running on port ${port}`);
});

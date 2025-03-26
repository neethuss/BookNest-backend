import express, { Express, Request, Response, NextFunction } from 'express'
import dotenv from 'dotenv'
import connectDB from './config/dbConfig'
import BookRoutes from './routes/BookRoute'
import path from 'path'

dotenv.config()

connectDB()

const app = express()

const port = process.env.PORT || 3003

// CORS Middleware
const corsMiddleware = (req: Request, res: Response, next: NextFunction): void => {
  const allowedOrigins = [
    'https://book-nest-frontend-h7vfquysz-neethuss-projects.vercel.app',
    'http://localhost:3000'
  ];
  const origin = req.headers.origin;

  if (origin && allowedOrigins.includes(origin)) {
    res.setHeader('Access-Control-Allow-Origin', origin);
  }

  res.setHeader('Access-Control-Allow-Methods', 'GET, POST, PUT, PATCH, DELETE');
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type, Authorization');
  res.setHeader('Access-Control-Allow-Credentials', 'true');

  if (req.method === 'OPTIONS') {
    res.sendStatus(200);
    return;
  }

  next();
};

app.use(corsMiddleware);
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

app.use('/uploads', express.static(path.join(__dirname, 'uploads')));

app.use('/', BookRoutes);

app.get('/', (req: Request, res: Response) => {
  res.send('hello')
})

app.listen(port, () => {
  console.log(`Backend server connected at port ${port}`)
})
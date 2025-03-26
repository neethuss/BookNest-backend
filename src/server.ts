import express, { Request, Response, NextFunction } from 'express';
import dotenv from 'dotenv';
import cors from 'cors';
import connectDB from './config/dbConfig';
import BookRoutes from './routes/BookRoute';
import path from 'path';

dotenv.config();

connectDB();

const app = express();
const port = process.env.PORT;

const allowedOrigins = [
  "https://book-nest-frontend-puce.vercel.app",
  "http://localhost:3000"
];

app.use((req: Request, res: Response, next: NextFunction) => {
  const origin = req.headers.origin;
  if (origin && allowedOrigins.includes(origin)) {
    res.setHeader("Access-Control-Allow-Origin", origin);
    res.setHeader("Access-Control-Allow-Methods", "GET, POST, PUT, PATCH, DELETE");
    res.setHeader("Access-Control-Allow-Headers", "Content-Type, Authorization");
    res.setHeader("Access-Control-Allow-Credentials", "true");
  }

  if (req.method === "OPTIONS") {
    res.status(204).end();
    return;
  }

  next();
});

app.use(express.json());
app.use(express.urlencoded({ extended: true }));

app.use('/uploads', express.static(path.join(__dirname, 'uploads')));

app.use('/', BookRoutes);

app.listen(port, () => {
  console.log(`Backend server connected at port ${port}`);
});

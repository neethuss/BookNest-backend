import express from 'express'
import dotenv from 'dotenv'
import cors from 'cors'
import connectDB from './config/dbConfig'
import BookRoutes from './routes/BookRoute'
import path from 'path'
import { Request, Response, NextFunction } from "express";


dotenv.config()

//database connection
connectDB()

const app = express()

const port = process.env.PORT
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

  // Handle preflight requests (OPTIONS method)
  if (req.method === "OPTIONS") {
    res.status(200).end(); // Explicitly return a response
    return;
  }

  next();
});


app.use(express.json());
app.use(express.urlencoded({ extended: true }));

app.use('/uploads', express.static(path.join(__dirname, 'uploads')));

app.use('/', BookRoutes)


//port connection
app.listen(port, () => {
  console.log(`Backend server connected at port ${port}`)
})
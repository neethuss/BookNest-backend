import express from 'express'
import dotenv from 'dotenv'
import cors from 'cors'
import connectDB from './config/dbConfig'
import BookRoutes from './routes/BookRoute'
import path from 'path'

dotenv.config()

//database connection
connectDB()

const app = express()

const port = process.env.PORT

app.use(cors({
  origin:"https://book-nest-frontend-puce.vercel.app/",
  methods: ["GET", "POST", "PUT", "PATCH","DELETE"],
  credentials: true
}));

app.use(express.json());
app.use(express.urlencoded({ extended: true }));

app.use('/uploads', express.static(path.join(__dirname, 'uploads')));

app.use('/',BookRoutes)


//port connection
app.listen(port, ()=> {
  console.log(`Backend server connected at port ${port}`)
})
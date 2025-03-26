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

const corsOptions = {
  origin: [
    'https://book-nest-frontend-h7vfquysz-neethuss-projects.vercel.app',
    'http://localhost:3000' 
  ],
  methods: ["GET", "POST", "PUT", "PATCH", "DELETE"],
  credentials: true,
  optionsSuccessStatus: 200
};

app.use(cors(corsOptions));

app.use(express.json());
app.use(express.urlencoded({ extended: true }));

app.use('/uploads', express.static(path.join(__dirname, 'uploads')));

app.use('/',BookRoutes)


app.get('/',(req,res)=>{
  res.send('hello')
})

//port connection
app.listen(port, ()=> {
  console.log(`Backend server connected at port ${port}`)
})
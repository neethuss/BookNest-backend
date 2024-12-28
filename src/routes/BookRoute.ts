import { Router } from "express";
import { BookController } from "../controllers/BookController";
import { BookUseCase } from "../useCases/BookUseCase";
import { BookRepositoryImpl } from "../infrastructure/repositories/BookRepositoryImpl";
import upload from "../middlewares/uploadMiddleware";

const bookRoutes = Router()
const bookRepositoryImpl = new BookRepositoryImpl()
const bookUseCase = new BookUseCase(bookRepositoryImpl)
const bookController = new BookController(bookUseCase)

bookRoutes.get('/books', (req,res)=> bookController.getAllBooks(req,res))

bookRoutes.post('/book', upload.single('file'),(req,res)=> bookController.createBook(req,res))

bookRoutes.patch('/book/:id', upload.single('file'), (req,res)=> bookController.updateBook(req,res))

bookRoutes.delete('/book/:id', (req,res)=> bookController.deleteBook(req,res))

bookRoutes.get('/book/:id', (req,res)=> bookController.findBookById(req,res))

bookRoutes.get('/search', (req,res)=> bookController.searchBooks(req, res))


export default bookRoutes
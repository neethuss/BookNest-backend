import { Request, Response } from "express";
import { BookUseCase } from "../useCases/BookUseCase";
import CustomFile from "../domain/entities/multerS3";

export class BookController {
  constructor(private bookUseCase: BookUseCase) {

  }

  createBook = async (req: Request, res: Response): Promise<void> => {
    try {
      const title = req.body.title.trim().toLowerCase()
      const author = req.body.author.trim().toLowerCase()
      const publicationYear = Number(req.body.publicationYear)
      const description = req.body.description.trim()
      const isbn = req.body.isbn.trim()

      const file = req.file as CustomFile
      const image = file.location
      const isExistingBook = await this.bookUseCase.findByIsbn(req.body.isbn);
      if (isExistingBook) {
        res.status(409).send({ message: 'Book already exists' });
      } else {
        const newBook = await this.bookUseCase.create({ title, author, publicationYear, isbn, description, image });
        res.status(201).send({ newBook, message: 'Book added to your collection' });
      }
    } catch (error) {
      res.status(500).send({ message: 'Failed to add book', error });
    }
  };

  updateBook = async (req: Request, res: Response): Promise<void> => {
    try {
      console.log('updating');
      const { id } = req.params;
      const title = req.body.title.trim().toLowerCase();
      const author = req.body.author.trim().toLowerCase();
      const publicationYear = Number(req.body.publicationYear);
      const description = req.body.description.trim();
      const isbn = req.body.isbn.trim();
  
      const file = req.file as CustomFile;
      console.log(id, 'book id');
      
      // Check if the book exists
      const isExistingBook = await this.bookUseCase.findById(id);
      if (!isExistingBook) {
        res.status(409).send({ message: 'Book not exists' });
      } else {
        console.log(isExistingBook, 'existing');
      
        const image = file ? file.location : isExistingBook.image;
        console.log(image, 'img');
        const updatedBook = await this.bookUseCase.updateBook(id, { title, author, publicationYear, isbn, description, image });
          console.log(updatedBook, 'updatedBook');
        res.status(200).send({ updatedBook, message: 'Book updated successfully' });
      }
    } catch (error) {
      console.error(error); 
      res.status(500).send({ message: 'Failed to update book', error });
    }
  };

  deleteBook = async (req:Request, res:Response):Promise<void>=>{
    try {
      console.log('deleting')
      const {id} = req.params
      const existingBook = await this.bookUseCase.findById(id)
      if(!existingBook){
        res.status(409).send({ message: 'Book not exists' });

      }
      const deletedBook = await this.bookUseCase.deleteBook(id)
      res.status(200).send({message:'Book deleted'})
    } catch (error){
      console.error(error); 
      res.status(500).send({ message: 'Failed to update book', error });
    }
  }

  
  getAllBooks = async (req: Request, res: Response): Promise<void> => {
    try {
      const page = parseInt(req.query.page as string) || 1;
      const limit = parseInt(req.query.limit as string) || 3;
      const { allBooks, totalBooks } = await this.bookUseCase.getAllBooks(page, limit);

      res.status(200).send({
        allBooks, totalBooks, currentPage: page,
        totalPages: Math.ceil(totalBooks / limit)
      });
    } catch (error) {
      res.status(500).send({ message: 'Failed to retrieve books', error });
    }
  };

  findBookById = async (req: Request, res: Response): Promise<void> => {
    try {
      const { id } = req.params
      console.log(id, 'id')
      const book = await this.bookUseCase.findById(id)
      res.status(200).send({ book });
    } catch (error) {
      res.status(500).send({ message: 'Failed to retrieve books', error });
    }
  };


  searchBooks = async (req: Request, res: Response) => {
    try {
      console.log('query')
      const { term } = req.query; 
      console.log(term,'term as query')
      const books = await this.bookUseCase.searchBooks(term as string)
      console.log(books,'returned search')
      res.status(200).send({ allBooks: books });
    } catch (error) {
      console.error(error);
      res.status(500).send({ message: 'Failed to search books', error });
    }
  };
}



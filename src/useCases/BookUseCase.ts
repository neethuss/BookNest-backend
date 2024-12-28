import Book from "../domain/entities/Book";
import BookRepository from "../domain/repositories/BookRepository";

export class BookUseCase{
  constructor(private bookRepository: BookRepository) {}

  async create(book:Book):Promise<Book>{
    return this.bookRepository.create(book)
  }

  async findByIsbn(isbn:string):Promise<Book|null>{
    return this.bookRepository.findByIsbn(isbn)
  }

  async getAllBooks(page: number, limit: number):Promise<{allBooks:Book[], totalBooks: number}>{
    return this.bookRepository.getAllBooks(page, limit)
  }

  async findById(id:string):Promise<Book | null>{
    return this.bookRepository.findById(id)
  }

  async searchBooks(term:string):Promise<any>{
    return this.bookRepository.searchBooks(term);

  }

  async updateBook(id:string, updateBook:Book):Promise<Book|null>{
    return this.bookRepository.updateBook(id, updateBook)
  }

  async deleteBook(id:string):Promise<void>{
    return this.bookRepository.deleteBook(id)
  }

}
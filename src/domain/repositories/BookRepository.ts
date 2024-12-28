import Book from "../entities/Book";

export default interface BookRepository{
  create(book: Book): Promise<Book>;
  updateBook(id:string, updateBook:Book):Promise<Book|null>
  deleteBook(id:string):Promise<void>
  findByIsbn(isbn:string):Promise<Book | null>
  findById(id:string):Promise<Book | null>
  getAllBooks(page: number, limit: number):Promise<{allBooks:Book[], totalBooks: number}>
  searchBooks(term: string): Promise<any>;
}
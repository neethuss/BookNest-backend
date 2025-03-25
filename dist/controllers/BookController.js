"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.BookController = void 0;
class BookController {
    constructor(bookUseCase) {
        this.bookUseCase = bookUseCase;
        this.createBook = (req, res) => __awaiter(this, void 0, void 0, function* () {
            try {
                console.log('backend create book');
                const title = req.body.title.trim().toLowerCase();
                const author = req.body.author.trim().toLowerCase();
                const publicationYear = Number(req.body.publicationYear);
                const description = req.body.description.trim();
                const isbn = req.body.isbn.trim();
                const file = req.file;
                console.log(file, 'file');
                const image = file.location;
                console.log(image, 'image');
                const isExistingBook = yield this.bookUseCase.findByIsbn(req.body.isbn);
                if (isExistingBook) {
                    res.status(409).send({ message: 'Book already exists' });
                }
                else {
                    const newBook = yield this.bookUseCase.create({ title, author, publicationYear, isbn, description, image });
                    res.status(201).send({ newBook, message: 'Book added to your collection' });
                }
            }
            catch (error) {
                res.status(500).send({ message: 'Failed to add book', error });
            }
        });
        this.updateBook = (req, res) => __awaiter(this, void 0, void 0, function* () {
            try {
                console.log('updating');
                const { id } = req.params;
                const title = req.body.title.trim().toLowerCase();
                const author = req.body.author.trim().toLowerCase();
                const publicationYear = Number(req.body.publicationYear);
                const description = req.body.description.trim();
                const isbn = req.body.isbn.trim();
                const file = req.file;
                console.log(id, 'book id');
                // Check if the book exists
                const isExistingBook = yield this.bookUseCase.findById(id);
                if (!isExistingBook) {
                    res.status(409).send({ message: 'Book not exists' });
                }
                else {
                    console.log(isExistingBook, 'existing');
                    const image = file ? file.location : isExistingBook.image;
                    console.log(image, 'img');
                    const updatedBook = yield this.bookUseCase.updateBook(id, { title, author, publicationYear, isbn, description, image });
                    console.log(updatedBook, 'updatedBook');
                    res.status(200).send({ updatedBook, message: 'Book updated successfully' });
                }
            }
            catch (error) {
                console.error(error);
                res.status(500).send({ message: 'Failed to update book', error });
            }
        });
        this.deleteBook = (req, res) => __awaiter(this, void 0, void 0, function* () {
            try {
                console.log('deleting');
                const { id } = req.params;
                const existingBook = yield this.bookUseCase.findById(id);
                if (!existingBook) {
                    res.status(409).send({ message: 'Book not exists' });
                }
                const deletedBook = yield this.bookUseCase.deleteBook(id);
                res.status(200).send({ message: 'Book deleted' });
            }
            catch (error) {
                console.error(error);
                res.status(500).send({ message: 'Failed to update book', error });
            }
        });
        this.getAllBooks = (req, res) => __awaiter(this, void 0, void 0, function* () {
            try {
                const page = parseInt(req.query.page) || 1;
                const limit = parseInt(req.query.limit) || 3;
                const { allBooks, totalBooks } = yield this.bookUseCase.getAllBooks(page, limit);
                res.status(200).send({
                    allBooks, totalBooks, currentPage: page,
                    totalPages: Math.ceil(totalBooks / limit)
                });
            }
            catch (error) {
                res.status(500).send({ message: 'Failed to retrieve books', error });
            }
        });
        this.findBookById = (req, res) => __awaiter(this, void 0, void 0, function* () {
            try {
                const { id } = req.params;
                console.log(id, 'id');
                const book = yield this.bookUseCase.findById(id);
                res.status(200).send({ book });
            }
            catch (error) {
                res.status(500).send({ message: 'Failed to retrieve books', error });
            }
        });
        this.searchBooks = (req, res) => __awaiter(this, void 0, void 0, function* () {
            try {
                console.log('query');
                const { term } = req.query;
                console.log(term, 'term as query');
                const books = yield this.bookUseCase.searchBooks(term);
                console.log(books, 'returned search');
                res.status(200).send({ allBooks: books });
            }
            catch (error) {
                console.error(error);
                res.status(500).send({ message: 'Failed to search books', error });
            }
        });
    }
}
exports.BookController = BookController;

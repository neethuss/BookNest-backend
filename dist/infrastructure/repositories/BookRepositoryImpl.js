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
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.BookRepositoryImpl = void 0;
const BookModel_1 = __importDefault(require("../database/BookModel"));
const elasticSearch_1 = __importDefault(require("../../config/elasticSearch"));
class BookRepositoryImpl {
    // Ensure the Elasticsearch index exists
    createIndexIfNotExists() {
        return __awaiter(this, void 0, void 0, function* () {
            const index = 'books'; //name of index in elastic search
            const exists = yield elasticSearch_1.default.indices.exists({ index });
            console.log('is exists', exists);
            if (!exists) { // if index is not exists, create one
                yield elasticSearch_1.default.indices.create({
                    index,
                    body: {
                        mappings: {
                            properties: {
                                title: { type: "text" },
                                author: { type: "text" },
                                description: { type: "text" },
                                image: { type: "text" },
                                publicationYear: { type: "integer" },
                                isbn: { type: "text" },
                            },
                        },
                    },
                });
                console.log(`Index '${index}' created successfully.`);
            }
        });
    }
    // Create a new book entry in the database and Elasticsearch index
    create(book) {
        return __awaiter(this, void 0, void 0, function* () {
            yield this.createIndexIfNotExists(); // Ensure index exists
            const newBook = new BookModel_1.default(book);
            console.log(newBook, 'new book');
            yield newBook.save();
            //index the new book in elastic search
            yield elasticSearch_1.default.index({
                index: 'books',
                id: newBook.id,
                document: book,
            });
            return newBook;
        });
    }
    //updating an existing book in database and in elastic search index
    updateBook(id, updateBook) {
        return __awaiter(this, void 0, void 0, function* () {
            yield this.createIndexIfNotExists();
            // Update the book in the MongoDB database
            const updatedBook = yield BookModel_1.default.findByIdAndUpdate(id, updateBook, { new: true });
            // Update the book in the Elasticsearch index
            if (updatedBook) {
                yield elasticSearch_1.default.index({
                    index: 'books',
                    id: updatedBook.id.toString(), // Use the book's ID as the document ID
                    document: {
                        title: updatedBook.title,
                        author: updatedBook.author,
                        description: updatedBook.description,
                        image: updatedBook.image,
                        publicationYear: updatedBook.publicationYear,
                        isbn: updatedBook.isbn,
                    },
                });
            }
            return updatedBook;
        });
    }
    //deleting an existing book in database and deleting elastic search index
    deleteBook(id) {
        return __awaiter(this, void 0, void 0, function* () {
            yield this.createIndexIfNotExists();
            const deletedBook = yield BookModel_1.default.findByIdAndDelete(id);
            if (!deletedBook) {
                throw new Error('Book not found in database');
            }
            // Check if the book exists in Elasticsearch
            const esBookExists = yield elasticSearch_1.default.exists({
                index: 'books',
                id: id,
            });
            if (esBookExists) {
                yield elasticSearch_1.default.delete({
                    index: 'books',
                    id: id,
                });
            }
            else {
                console.warn(`Book with ID ${id} not found in Elasticsearch index`);
            }
        });
    }
    // Find a book by its ISBN
    findByIsbn(isbn) {
        return __awaiter(this, void 0, void 0, function* () {
            const book = yield BookModel_1.default.findOne({ isbn });
            return book;
        });
    }
    // Retrieve all books with pagination
    getAllBooks() {
        return __awaiter(this, arguments, void 0, function* (page = 1, limit = 3) {
            const skip = (page - 1) * limit;
            const allBooks = yield BookModel_1.default.find().sort({ createdAt: -1 }).skip(skip).limit(limit);
            const totalBooks = yield BookModel_1.default.countDocuments();
            return { allBooks, totalBooks };
        });
    }
    // Find a book by its ID
    findById(id) {
        return __awaiter(this, void 0, void 0, function* () {
            const book = yield BookModel_1.default.findById(id);
            return book;
        });
    }
    // Search books in Elasticsearch using the given term
    searchBooks(term) {
        return __awaiter(this, void 0, void 0, function* () {
            yield this.createIndexIfNotExists(); // Ensure index exists
            if (!term || term.trim() === '') {
                console.warn("Empty search term provided.");
                return []; // Return an empty array if the search term is empty
            }
            const query = {
                size: 25, // maximum number of results to return from the search
                query: {
                    multi_match: {
                        query: term,
                        fields: ["title", "author", "description"],
                        type: "phrase_prefix",
                    },
                },
            };
            try {
                const result = yield elasticSearch_1.default.search({
                    index: 'books',
                    body: query,
                });
                const hits = result.hits.hits; //extracts the actual search reasults(hits) forn teh result
                return hits.map((hit) => {
                    var _a, _b, _c, _d, _e, _f;
                    return ({
                        _id: hit._id,
                        title: (_a = hit._source) === null || _a === void 0 ? void 0 : _a.title,
                        author: (_b = hit._source) === null || _b === void 0 ? void 0 : _b.author,
                        description: (_c = hit._source) === null || _c === void 0 ? void 0 : _c.description,
                        image: (_d = hit._source) === null || _d === void 0 ? void 0 : _d.image,
                        publicationYear: ((_e = hit._source) === null || _e === void 0 ? void 0 : _e.publicationYear) || '',
                        isbn: ((_f = hit._source) === null || _f === void 0 ? void 0 : _f.isbn) || '',
                    });
                });
            }
            catch (error) {
                console.error("Error fetching data:", error);
                throw error;
            }
        });
    }
}
exports.BookRepositoryImpl = BookRepositoryImpl;

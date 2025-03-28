import Book from "../../domain/entities/Book";
import BookRepository from "../../domain/repositories/BookRepository";
import BookModel from "../database/BookModel";
import elasticClient from "../../config/elasticSearch";
import { SearchRequest, SearchResponse } from "@elastic/elasticsearch/lib/api/types";

export class BookRepositoryImpl implements BookRepository {

  // Ensure the Elasticsearch index exists
  private async createIndexIfNotExists() {
    const index = 'books'; //name of index in elastic search

    const exists = await elasticClient.indices.exists({ index });

    console.log('is exists', exists)

    if (!exists) { // if index is not exists, create one
      await elasticClient.indices.create({
        index,
        body: { // defines the body of the request
          mappings: { // specifies the data structure of the documents
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
  }

  // Create a new book entry in the database and Elasticsearch index
  async create(book: Book): Promise<Book> {
    await this.createIndexIfNotExists(); // Ensure index exists

    const newBook = new BookModel(book);
    console.log(newBook, 'new book')
    await newBook.save();
    //index the new book in elastic search
    await elasticClient.index({
      index: 'books',
      id: newBook.id,
      document: book,
    });
    return newBook;
  }


    //updating an existing book in database and in elastic search index
  async updateBook(id: string, updateBook: Book): Promise<Book | null> {
    await this.createIndexIfNotExists()

    // Update the book in the MongoDB database
    const updatedBook = await BookModel.findByIdAndUpdate(id, updateBook, { new: true });

    // Update the book in the Elasticsearch index
    if (updatedBook) {
      await elasticClient.index({
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
  }


  //deleting an existing book in database and deleting elastic search index
  async deleteBook(id: string): Promise<void> {
    await this.createIndexIfNotExists();
  
    const deletedBook = await BookModel.findByIdAndDelete(id);
    if (!deletedBook) {
      throw new Error('Book not found in database');
    }
  
    // Check if the book exists in Elasticsearch
    const esBookExists = await elasticClient.exists({
      index: 'books',
      id: id,
    });
  
    if (esBookExists) {
      await elasticClient.delete({
        index: 'books',
        id: id,
      });
    } else {
      console.warn(`Book with ID ${id} not found in Elasticsearch index`);
    }
  }
  

  // Find a book by its ISBN
  async findByIsbn(isbn: string): Promise<Book | null> {
    const book = await BookModel.findOne({ isbn });
    return book;
  }

  // Retrieve all books with pagination
  async getAllBooks(page: number = 1, limit: number = 3): Promise<{ allBooks: Book[], totalBooks: number }> {
    const skip = (page - 1) * limit;
    const allBooks = await BookModel.find().sort({ createdAt: -1 }).skip(skip).limit(limit);
    const totalBooks = await BookModel.countDocuments();
    return { allBooks, totalBooks };
  }

  // Find a book by its ID
  async findById(id: string): Promise<Book | null> {
    const book = await BookModel.findById(id);
    return book;
  }


  // Search books in Elasticsearch using the given term
  async searchBooks(term: string): Promise<Book[]> {
    await this.createIndexIfNotExists(); // Ensure index exists

    if (!term || term.trim() === '') {
      console.warn("Empty search term provided.");
      return []; // Return an empty array if the search term is empty
    }

    const query: SearchRequest = { // object that defines the structure of the search request to be sent to the elastic search
      size: 25, // maximum number of results to return from the search
      query: {
        multi_match: { //query allows searching across multiple fields
          query: term,
          fields: ["title", "author", "description"],
          type: "phrase_prefix" as const,
        },
      },
    };

    try {
      const result: SearchResponse<Book> = await elasticClient.search<Book>({
        index: 'books',
        body: query,
      });

      const hits = result.hits.hits; //extracts the actual search reasults(hits) forn teh result

      return hits.map((hit) => ({ //transforming each hit into a Book object
        _id: hit._id,
        title: hit._source?.title,
        author: hit._source?.author,
        description: hit._source?.description,
        image: hit._source?.image,
        publicationYear: hit._source?.publicationYear || '',
        isbn: hit._source?.isbn || '',
      })) as Book[];
    } catch (error) {
      console.error("Error fetching data:", error);
      throw error;
    }
  }
}

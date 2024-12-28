import { timeStamp } from "console";
import mongoose, { Schema, Document } from "mongoose";

export interface IBook extends Document {
  title: string;
  author: string;
  publicationYear: number;
  isbn: string;
  description: string;
  image: string;
  createdAt?: Date;
}

const BookSchema = new mongoose.Schema(
  {
    title: { type: String, required: true },
    author: { type: String, required: true },
    publicationYear: { type: Number, required: true },
    isbn: { type: String, required: true },
    description: { type: String, required: true },
    image: { type: String, required: true },
    createdAt: { type: Date, default: Date.now },
  }, 
);

const BookModel = mongoose.model<IBook>('Book', BookSchema)

export default BookModel
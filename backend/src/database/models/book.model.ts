import mongoose, { Schema } from 'mongoose';

interface IBook extends mongoose.Document {
    userId: string
    title: string
    author: string
    imageUrl: string
    year: number
    genre: string
    ratings: {
        userId: string
        grade: number
    }[]
    averageRating: number
}

const BookSchema = new Schema<IBook>({
    userId: { type: String, required: true },
    title: { type: String, required: true },
    author: { type: String, required: true },
    imageUrl: { type: String, required: true },
    year: { type: Number, required: true },
    genre: { type: String, required: true },
    ratings: [
        {
            userId: { type: String, required: true },
            grade: { type: Number, required: true },
        }
    ],
    averageRating: { type: Number, default: 0 },
});

export const Book = mongoose.model<IBook>('Book', BookSchema);
export type BookType = (mongoose.Document<unknown, {}, IBook> & IBook & { _id: mongoose.Types.ObjectId });

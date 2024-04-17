import type { Database } from '../database';
import { Book, BookType } from '../models/book.model';

export function get(this: Database, book_id: string) : Promise<BookType | null> {
    return new Promise((resolve, reject) => {
        Book.findOne({_id: book_id})
        .then((book) => resolve(book))
        .catch((err) => {
            console.error('[DB] [ERR]', err);
            reject(err);
        });
    });
}

export function get_all(this: Database) : Promise<BookType[]> {
    return new Promise((resolve) => {
        Book.find()
        .then((books) => resolve(books))
        .catch((err) => {
            console.error('[DB] [ERR]', err);
            resolve([]);
        });
    });
}

export function create(this: Database, options: BookOptions) : Promise<BookType | null> {
    return new Promise((resolve, reject) => {
        new Book({ ...options }).save()
        .then((book) => resolve(book))
        .catch((err) => {
            console.error('[DB] [ERR]', err)
            reject();
        });
    });
}

export function remove(this: Database, book_id: string, user_id: string) {
    return new Promise<void>((resolve, reject) => {
        Book.deleteOne({_id: book_id, userId: user_id})
        .then((result) => {
            console.log('[DB] Successfully remove', result.deletedCount, 'element !')
            resolve();
        })
        .catch((err) => {
            console.error('[DB] [ERR]', err)
            reject();
        });
    });
}

export function update(this: Database, book_id: string, user_id: string, options: BookEditOptions) {
    return new Promise<void>((resolve, reject) => {
        Book.updateOne({ _id: book_id, userId: user_id }, options)
        .then(() => resolve())
        .catch((err) => {
            console.error('[DB] [ERR]', err)
            reject();
        });
    });
}

export function add_rating(this: Database, book_id: string, user_id: string, grade: number) {
    return new Promise((resolve, reject) => {
        Book.updateOne(
            { _id: book_id, 'ratings.userId': {$ne: user_id} },
            { $addToSet: {ratings: {userId: user_id, grade}} }
        ).then(() => {
            this.book.get(book_id)
            .then(async (book) => {
                if (!book) return reject();

                const totalRating = book.ratings.length;
                let totalScore = 0;
                
                book.ratings.map((rating) => { totalScore += rating.grade; });
                let avg = totalScore / totalRating;

                if (avg != book.averageRating) {
                    this.book.update(book_id, user_id, { averageRating: avg }).then(() => resolve(book)).catch(reject);
                }
                else {
                    resolve(book);
                }
            })
            .catch((err) => {
                console.error('[DB] [ERR]', err)
                reject();
            });
        })
        .catch((err) => {
            console.error('[DB] [ERR]', err)
            reject();
        });
    });
}

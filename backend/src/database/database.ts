import mongoose = require('mongoose');
import { Book, BookType } from './models/book.model';
import { User, UserType } from './models/user.model';

export class Database {
    // ### Instance ### //
    protected static instance: Database;

    protected constructor() {
        if (!process.env.MONGODB_URL) {
            console.error('[ERR-DB] You need to provide a MONGODB_URL env var !')
            return;
        }

        mongoose.connect(process.env.MONGODB_URL)
        .then(() => console.log('[DB] MongoDB connected !'))
        .catch((err) => console.error('[ERR-DB] Connection to MongoDB fail !', err));
    }

    public static get(): Database {
        if (!Database.instance) Database.instance = new Database();
        return Database.instance;
    }

    // ### Queries ### //
    public user = {
        get: (email: string) : Promise<UserType | null> => {
            return new Promise((resolve, reject) => {
                User.findOne({email})
                .then((user) => resolve(user))
                .catch((err) => {
                    console.error('[DB] [ERR]', err);
                    reject(err);
                });
            });
        },
        create: (email: string, password_hash: string) : Promise<UserType> => {
            const user = new User({
                email,
                password: password_hash,
            });

            return user.save();
        },
    }

    public book = {
        get: (book_id: string) : Promise<BookType | null> => {
            return new Promise((resolve, reject) => {
                Book.findOne({_id: book_id})
                .then((book) => resolve(book))
                .catch((err) => {
                    console.error('[DB] [ERR]', err);
                    reject(err);
                });
            });
        },
        get_all: () : Promise<BookType[]> => {
            return new Promise((resolve) => {
                Book.find()
                .then((books) => resolve(books))
                .catch((err) => {
                    console.error('[DB] [ERR]', err);
                    resolve([]);
                });
            });
        },
        create: (options: BookOptions) : Promise<BookType | null> => {
            return new Promise((resolve, reject) => {
                new Book({ ...options }).save()
                .then((book) => resolve(book))
                .catch((err) => {
                    console.error('[DB] [ERR]', err)
                    reject();
                });
            });
        },
        remove: (book_id: string, user_id: string) => {
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
        },
        update: (book_id: string, user_id: string, options: BookEditOptions) => {
            return new Promise<void>((resolve, reject) => {
                Book.updateOne({ _id: book_id, userId: user_id }, options)
                .then(() => resolve())
                .catch((err) => {
                    console.error('[DB] [ERR]', err)
                    reject();
                });
            });
        },

        add_rating: (book_id: string, user_id: string, grade: number) => {
            return new Promise((resolve, reject) => {
                Book.updateOne(
                    {_id: book_id},
                    {$push: {ratings: {userId: user_id, grade}}}
                ).then(() => {

                    this.book.get(book_id)
                    .then((book) => {
                        // TODO : Rating

                        resolve(book)
                    })
                    .catch(() => reject());
                })
                .catch((err) => {
                    console.error('[DB] [ERR]', err)
                    reject();
                });
            });
        },
    }
}

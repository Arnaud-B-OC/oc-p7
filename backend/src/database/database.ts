import mongoose = require('mongoose');
import { Book } from './models/book';
import { User } from './models/user';

export class Database {
    protected static instance: Database;

    protected constructor() {
        mongoose.connect(process.env.MONGODB_URL!)
        .then(() => console.log('[DB] Connexion à MongoDB réussie !'))
        .catch((err) => console.error('[DB] [ERR] Connexion à MongoDB échouée !', err));
    }

    public static get(): Database {
        if (!Database.instance) Database.instance = new Database();
        return Database.instance;
    }



    public user = {
        get_hash: (email: string) => {
            return new Promise<{id:string, mail:string, hash:string} | null>((resolve, reject) => {
                User.findOne({email})
                .then((user) => {
                    if (user) {
                        resolve({
                            id: user._id.toString(),
                            mail: user.email,
                            hash: user.password
                        })
                    }
                    else {
                        resolve(null);
                    }
                }).catch((err) => {
                    console.error('[DB] [ERR]', err);
                    reject();
                });
            });
        },
        create: (email: string, password_hash: string) => {
            const user = new User({
                email,
                password: password_hash,
            });

            return user.save();
        },
    }

    public book = {
        get: (book_id: string) => {
            return new Promise((resolve, reject) => {
                Book.findOne({_id: book_id})
                .then((book) => {
                    resolve(book)
                })
                .catch((err) => {
                    console.error('[DB] [ERR]', err);
                    reject();
                });
            });
        },
        get_all: () => {
            return new Promise((resolve) => {
                Book.find()
                .then((books) => resolve(books))
                .catch((err) => {
                    console.error('[DB] [ERR]', err);
                    resolve([]);
                });
            });
        },
        create: (options: BookOptions) => {
            return new Promise<void>((resolve, reject) => {
                new Book({ ...options }).save()
                .then(() => {
                    resolve();
                })
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
        update: (book_id: string | undefined, user_id: string | undefined, options: BookEditOptions) => {
            return new Promise<void>((resolve, reject) => {
                if (!book_id) return resolve();
                if (!user_id) return resolve();
                
                Book.updateOne({_id: book_id, userId: user_id}, options)
                .then(() => {
                    resolve();
                })
                .catch((err) => {
                    console.error('[DB] [ERR]', err)
                    reject();
                });
            });
        },
        add_rating: (book_id: string | undefined, user_id: string | undefined, grade: number) => {
            return new Promise((resolve, reject) => {
                if (!book_id) return reject();
                if (!user_id) return reject();
                
                Book.updateOne(
                    {_id: book_id},
                    {$push: {ratings: {userId: user_id, grade}}}
                ).then(() => {
                    this.book.get(book_id)
                    .then((book : any) => {
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
        }
    }
}

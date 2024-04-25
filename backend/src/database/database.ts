import mongoose = require('mongoose');
import * as UserDB from './func/user.db';
import * as BookDB from './func/book.db';

export class Database {
    // ### Instance ### //
    protected static instance: Database;

    protected constructor() {
        if (!process.env.MONGODB_URL) {
            console.error('[ERR-DB] You need to provide a MONGODB_URL env var !')
            return;
        }

        mongoose.connect(process.env.MONGODB_URL, {dbName: 'monvieuxgrimoire'})
        .then(() => console.log('[DB] MongoDB connected !'))
        .catch((err) => console.error('[ERR-DB] Connection to MongoDB fail !', err));
    }

    public static get(): Database {
        if (!Database.instance) Database.instance = new Database();
        return Database.instance;
    }

    // ### Queries ### //
    public user = {
        get: UserDB.get.bind(this),
        create: UserDB.create.bind(this),
    }

    public book = {
        get: BookDB.get.bind(this),
        get_all: BookDB.get_all.bind(this),
        create: BookDB.create.bind(this),
        remove: BookDB.remove.bind(this),
        update: BookDB.update.bind(this),
        add_rating: BookDB.add_rating.bind(this),
    }
}

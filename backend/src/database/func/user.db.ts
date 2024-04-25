import type { Database } from '../database';
import { User, UserType } from '../models/user.model';

export function get(this: Database, email: string) : Promise<UserType | null> {
    return new Promise((resolve, reject) => {
        User.findOne({email})
        .then((user) => resolve(user))
        .catch((err) => {
            console.error('[DB] [ERR]', err);
            reject(err);
        });
    });
}

export function create(this: Database, email: string, password_hash: string) : Promise<UserType> {
    const user = new User({
        email,
        password: password_hash,
    });

    return user.save();
}

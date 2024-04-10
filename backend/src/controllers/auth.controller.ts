import { RequestHandler } from 'express';
import bcrypt = require('bcrypt');
import jwt = require('jsonwebtoken');
import { Database } from '../database/database';

// ### Signup ### //
export const accountSignup : RequestHandler = (req, res) => {
    console.log(req.body);

    // TODO : Pass min length ?
    
    bcrypt.hash(req.body.password, 11)
    .then((hash) => {
        Database.get().user.create(req.body.email, hash)
        .then(() => {
            res.status(201).json({ message: 'Successfully created account' });
        }).catch((err) => {
            // TODO : handle email used with plugin ?
            console.log('[ERR]', err);
            res.status(500).json({ message: 'Fail to create account' });
        });
    })
    .catch((err) => {
        console.log('[ERR]', err);
        res.status(500).json({ message: 'Fail to create account' });
    });
}

// ### Login ### //
export const accountLogin : RequestHandler = (req, res) => {
    Database.get().user.get_hash(req.body.email)
    .then((user) => {
        if (user && bcrypt.compareSync(req.body.password, user.hash)) {
            let token = jwt.sign({ userId: user.id }, process.env.JWT_SECRET_TOKEN!, { expiresIn: '24h' });
            res.status(200).json({ userId: user.id, token: token });
        }
        else {
            res.status(403).json({ message: 'Invalid mail or password' });
        }
    })
    .catch((err) => {
        res.status(500).json({ message: 'Server Error' });
    });
}

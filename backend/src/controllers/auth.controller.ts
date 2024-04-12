import { RequestHandler } from 'express';
import bcrypt = require('bcrypt');
import jwt = require('jsonwebtoken');
import { Database } from '../database/database';
import { isValidMail } from '../utils/utils';

// ### Signup ### //
export const accountSignup : RequestHandler = (req, res) => {
    if (!req.body.email || !isValidMail(req.body.email)) return res.status(400).json({message: 'Valid email is required'});
    if (!req.body.password) return res.status(400).json({message: 'Valid password is required'});

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
    Database.get().user.get(req.body.email)
    .then((user) => {
        if (user && bcrypt.compareSync(req.body.password, user.password)) {
            res.status(200).json({
                userId: user.id,
                token: jwt.sign({ userId: user.id }, process.env.JWT_SECRET_TOKEN!, { expiresIn: '24h' })
            });
        }
        else {
            res.status(403).json({ message: 'Invalid mail or password' });
        }
    })
    .catch((err) => {
        res.status(500).json({ message: 'Server Error', err: err });
    });
}

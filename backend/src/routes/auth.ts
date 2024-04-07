import { Router } from 'express';
import { Database } from '../database/database';
import jwt = require('jsonwebtoken');
import bcrypt = require('bcrypt');

const authRoutes = Router();

// ### Register ### //
authRoutes.post('/signup', (req, res, next) => {
    console.log(req.body);

    // TODO : Pass min length ?

    bcrypt.hash(req.body.password, 11)
    .then((hash) => {
        Database.get().user.create(req.body.email, hash)
        .then(() => {
            res.status(201).json({ message: 'Successfully created account' });
        }).catch((err) => {
            // TODO : handle email used
            console.log('[ERR]', err);
            res.status(500).json({ message: 'Fail to create account' });
        });
    })
    .catch((err) => {
        console.log('[ERR]', err);
        res.status(500).json({ message: 'Fail to create account' });
    });
});

// ### Login ### //
authRoutes.post('/login', (req, res, next) => {
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
});

export default authRoutes

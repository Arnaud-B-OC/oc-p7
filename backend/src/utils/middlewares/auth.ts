import { RequestHandler, Request } from 'express';
import jwt = require('jsonwebtoken');
 
export interface CustomRequest extends Request {
    auth?: jwt.JwtPayload
}

export const checkToken : RequestHandler = (req, res, next) => {
    try {
        const token = req.headers?.authorization?.split(' ')[1];
        if (!token) return res.status(401).json({ message: 'Unauthorized' });

        const decodedToken = jwt.verify(token, process.env.JWT_SECRET_TOKEN!);

        if (typeof decodedToken != 'string') {
            (req as CustomRequest).auth = decodedToken;
        }

        next();
    } catch(error) {
        res.status(401).json({ error });
    }
};

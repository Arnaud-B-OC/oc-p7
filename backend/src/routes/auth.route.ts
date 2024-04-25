import { Router } from 'express';
import { accountLogin, accountSignup } from '../controllers/auth.controller';

const authRoutes = Router();

// ### Register ### //
authRoutes.post('/signup', accountSignup);

// ### Login ### //
authRoutes.post('/login', accountLogin);

export default authRoutes;

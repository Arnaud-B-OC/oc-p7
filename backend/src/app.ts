import express = require('express');
import bookRoutes from './routes/book.route';
import authRoutes from './routes/auth.route';
import mongoSanitize = require('express-mongo-sanitize');

const app = express();

app.use((req, res, next) => {
    res.setHeader('Access-Control-Allow-Origin', '*');
    res.setHeader('Access-Control-Allow-Headers', 'Origin, X-Requested-With, Content, Accept, Content-Type, Authorization');
    res.setHeader('Access-Control-Allow-Methods', 'GET, POST, PUT, DELETE, PATCH, OPTIONS');

    console.log(`[${req.method}] ${req.url}`);

    next();
});

app.use(express.json());
app.use(mongoSanitize());

app.use(express.static('public'));

// ### Auth Routes ### //
app.use('/api/auth', authRoutes);

// ### Books Routes ### //
app.use('/api/books', bookRoutes);

export default app;

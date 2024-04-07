import { Router } from 'express';
import { Database } from '../database/database';
import { CustomRequest, checkToken } from '../auth';
import multer = require('multer');

const bookRoutes = Router();

// ### Get All Books ### //
bookRoutes.get('', (req, res) => {
    Database.get().book.get_all().then((books) => res.status(200).json(books));
});

// ### Get 3 Best Books ### //
bookRoutes.get('/bestrating', (req, res) => {
    Database.get().book.get_all().then((books) => res.status(200).json(books));
    // TODO : Get 3 Best Books
});

// ### Get Book With ID ### //
bookRoutes.get('/:id', (req, res) => {
    Database.get().book.get(req.params.id)
    .then((book) => res.status(200).json(book))
    .catch(() => {
        res.status(500).json({err: 'Fail to get book'});
    });
});

// ### Create New Book ### //
const upload = multer({ dest: 'uploads/' });
bookRoutes.post('', checkToken);
bookRoutes.post('', upload.single('image'), (req, res) => {
    console.log(req.headers.authorization)

    // TODO : Imports Image
    console.log(req.file);
    let book : IBook = JSON.parse(req.body.book)

    Database.get().book.create({
        userId: (req as CustomRequest).auth?.userId,
        title: book.title,
        author: book.author,
        imageUrl: '',
        year: book.year,
        genre: book.genre,
        ratings: [
            {
                userId: (req as CustomRequest).auth?.userId,
                grade: book.ratings[0].grade
            }
        ],
        averageRating: book.ratings[0].grade
    })
    .then(() => res.status(201).json({ message: 'Ok' }))
    .catch((err) => res.status(500).json({ message: 'Server Error' }));
});

// ### Update Book With ID ### //
bookRoutes.put('/:id', checkToken);
bookRoutes.put('/:id', upload.single('image'), (req, res) => {
    console.log(req.file)
    console.log(req.body)

    // TODO : Update Book image
    Database.get().book.update(req.params.id, (req as CustomRequest).auth?.userId, JSON.parse(req.body.book))
    .then(() => res.json({ message: 'Successfully updated book' }))
    .catch(() => res.json({ message: 'Fail to update book' }));
});

// ### Remove Book With ID ### //
bookRoutes.delete('/:id', checkToken);
bookRoutes.delete('/:id', (req, res) => {
    Database.get().book.remove(req.params.id, (req as CustomRequest).auth?.userId)
    .then(() => res.status(200).json({ message: 'Remove success' }))
    .catch(() => res.status(500).json({ message: 'Server Error' }));
});

// ### Add Rating With ID ### //
bookRoutes.post('/:id/rating', checkToken);
bookRoutes.post('/:id/rating', (req, res) => {    
    Database.get().book.add_rating(req.params.id, (req as CustomRequest).auth?.userId, req.body.rating)
    .then((book) => {
        res.status(200).json(book);
        // TODO : recalculate note
    })
    .catch(() => {
        res.status(500).json({ message: 'Server Error' });
    });
});




export default bookRoutes;

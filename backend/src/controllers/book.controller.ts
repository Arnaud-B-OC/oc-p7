import { RequestHandler } from 'express';
import { Database } from '../database/database';
import { CustomRequest } from '../utils/middlewares/auth';
import { CustomRequestConvert } from '../utils/middlewares/imageConvert';
import { isValidRating, isValidYear, tryParseJSON } from '../utils/utils';

// ### Get All Books ### //
export const getAllBooks : RequestHandler = (req, res) => {
    Database.get().book.get_all().then((books) => res.status(200).json(books));
}

// ### Get 3 Best Books ### //
export const getBestRatingBooks : RequestHandler = (req, res) => {
    Database.get().book.get_all().then((books) => {
        const bestBooks = books.sort((a, b) => b.averageRating - a.averageRating).slice(0, 3);
        res.status(200).json(bestBooks);
    });
}

// ### Get Book With ID ### //
export const getBookWithID : RequestHandler = (req, res) => {
    Database.get().book.get(req.params.id)
    .then((book) => {
        if (!book) return res.status(404).json({message: 'Book not found'});
        res.status(200).json(book);
    })
    .catch((err) => {
        res.status(500).json({message: 'Fail to get book', err: err});
    });
}

// ### Create New Book ### //
export const createNewBook : RequestHandler = (req: CustomRequestConvert, res) => {
    let book : IBook | undefined = tryParseJSON(req.body.book);
    
    if (!req.imageUrl) return res.status(400).json({message: 'Valid image is required'});
    if (!book?.title) return res.status(400).json({message: 'Valid title is required'});
    if (!book?.author) return res.status(400).json({message: 'Valid author is required'});
    if (!isValidYear(book?.year)) return res.status(400).json({message: 'Valid year is required'});
    if (!book?.genre) return res.status(400).json({message: 'Valid genre is required'});

    Database.get().book.create({
        userId: (req as CustomRequest).auth?.userId,
        title: book.title,
        author: book.author,
        imageUrl: req.imageUrl,
        year: book.year,
        genre: book.genre,
        ratings: [],
        averageRating: 0,
    })
    .then((createdBook) => {
        res.status(200).json({ message: 'Ok' });
        Database.get().book.add_rating(createdBook?._id, (req as CustomRequest).auth?.userId, book.ratings[0]?.grade);
    })
    .catch((err) => {
        res.status(500).json({ message: 'Server Error' });
    });
}

// ### Update Book With ID ### //
export const updateBookWithID : RequestHandler = (req: CustomRequestConvert, res) => {
    let book : IBook | undefined = tryParseJSON(req.body.book);
    
    Database.get().book.update(req.params.id, (req as CustomRequest).auth?.userId, {
        title: book?.title,
        author: book?.author,
        imageUrl: req.imageUrl,
        year: book?.year,
        genre: book?.genre,
    })
    .then(() => res.status(200).json({ message: 'Successfully updated book' }))
    .catch(() => res.status(500).json({ message: 'Fail to update book' }));
}

// ### Remove Book With ID ### //
export const removeBookWithID : RequestHandler = (req, res) => {
    Database.get().book.remove(req.params.id, (req as CustomRequest).auth?.userId)
    .then(() => res.status(200).json({ message: 'Remove success' }))
    .catch(() => res.status(500).json({ message: 'Internal Server Error' }));
}

// ### Add Rating With ID ### //
export const addRatingOnBookWithID : RequestHandler = (req, res) => {
    if (!isValidRating(req.body.rating)) return res.status(400).json({message: 'Valid rating is required'});

    Database.get().book.add_rating(req.params.id, (req as CustomRequest).auth?.userId, req.body.rating)
    .then((book) => res.status(200).json(book))
    .catch((err) => {
        console.log('[ERR]', err)
        res.status(500).json({ message: 'Internal Server Error' });
    });
}

import { RequestHandler } from "express";
import { Database } from "../database/database";
import { CustomRequest } from "../auth";
import fs = require('fs');

function convertImage(filename: string | undefined) {
    // TODO : refactor
    return new Promise<null | string>((resolve) => {
        if (!filename) return resolve(null);

        const uploadFilepath = process.cwd() + '/uploads/' + filename
        const resultFilepath = process.cwd() + '/public/images/' + filename + '.webp'
        
        console.log(uploadFilepath);
        console.log(resultFilepath);

        const CWebp = require('cwebp').CWebp;
        const encoder = new CWebp(uploadFilepath);
        encoder.resize(400, 568);

        encoder.write(resultFilepath).then(() => {
            fs.unlinkSync(uploadFilepath);
            
            resolve(`http://localhost:4000/images/${filename}.webp`);
        }).catch((err: any) => {
            console.error('[ERR]', err)
            resolve(null);
        });
    });
}

// ### Get All Books ### //
export const getAllBooks : RequestHandler = (req, res) => {
    Database.get().book.get_all().then((books) => res.status(200).json(books));
}

// ### Get 3 Best Books ### //
export const getBestRatingBooks : RequestHandler = (req, res) => {
    Database.get().book.get_all().then((books) => res.status(200).json(books));
    // TODO : Get 3 Best Books
}

// ### Get Book With ID ### //
export const getBookWithID : RequestHandler = (req, res) => {
    Database.get().book.get(req.params.id)
    .then((book) => res.status(200).json(book))
    .catch(() => {
        res.status(500).json({err: 'Fail to get book'});
    });
}

// ### Create New Book ### //
export const createNewBook : RequestHandler = async (req, res) => {
    console.log(req.file);

    // TODO : refactor
    let image = await convertImage(req.file?.filename);

    let book : IBook = JSON.parse(req.body.book);

    Database.get().book.create({
        userId: (req as CustomRequest).auth?.userId,
        title: book.title,
        author: book.author,
        imageUrl: image ?? '',
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
}

// ### Update Book With ID ### //
export const updateBookWithID : RequestHandler = async (req, res) => {
    let image = await convertImage(req.file?.filename);
    // TODO : refactor

    let bookData = JSON.parse(req.body.book);
    if (image) bookData.imageUrl = image;

    console.log(req.file);
    console.log(bookData);

    Database.get().book.update(req.params.id, (req as CustomRequest).auth?.userId, bookData)
    .then(() => res.json({ message: 'Successfully updated book' }))
    .catch(() => res.json({ message: 'Fail to update book' }));
}

// ### Remove Book With ID ### //
export const removeBookWithID : RequestHandler = (req, res) => {
    Database.get().book.remove(req.params.id, (req as CustomRequest).auth?.userId)
    .then(() => res.status(200).json({ message: 'Remove success' }))
    .catch(() => res.status(500).json({ message: 'Server Error' }));
}

// ### Add Rating With ID ### //
export const addRatingOnBookWithID : RequestHandler = (req, res) => {
    Database.get().book.add_rating(req.params.id, (req as CustomRequest).auth?.userId, req.body.rating)
    .then((book) => {
        res.status(200).json(book);
        // TODO : recalculate note
    })
    .catch(() => {
        res.status(500).json({ message: 'Server Error' });
    });
}

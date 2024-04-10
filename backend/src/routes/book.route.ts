import { Router } from 'express';
import { checkToken } from '../auth';
import multer = require('multer');
import { addRatingOnBookWithID, createNewBook, getAllBooks, getBestRatingBooks, getBookWithID, removeBookWithID, updateBookWithID } from '../controllers/book.controller';

const bookRoutes = Router();

// ### Get All Books ### //
bookRoutes.get('', getAllBooks);

// ### Get 3 Best Books ### //
bookRoutes.get('/bestrating', getBestRatingBooks);

// ### Get Book With ID ### //
bookRoutes.get('/:id', getBookWithID);

// ### Create New Book ### //
const upload = multer({ dest: 'uploads/' });
bookRoutes.post('', checkToken);
bookRoutes.post('', upload.single('image'), createNewBook);

// ### Update Book With ID ### //
bookRoutes.put('/:id', checkToken);
bookRoutes.put('/:id', upload.single('image'), updateBookWithID);

// ### Remove Book With ID ### //
bookRoutes.delete('/:id', checkToken);
bookRoutes.delete('/:id', removeBookWithID);

// ### Add Rating With ID ### //
bookRoutes.post('/:id/rating', checkToken);
bookRoutes.post('/:id/rating', addRatingOnBookWithID);

export default bookRoutes;

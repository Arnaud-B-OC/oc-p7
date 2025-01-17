import { Router } from 'express';
import { checkToken } from '../middlewares/auth';
import multer = require('multer');
import { addRatingOnBookWithID, createNewBook, getAllBooks, getBestRatingBooks, getBookWithID, removeBookWithID, updateBookWithID } from '../controllers/book.controller';
import { convertImageToWebp } from '../middlewares/imageConvert';

const upload = multer({ dest: 'uploads/', limits: { fileSize: 4194304 /* bytes */ }});

const bookRoutes = Router();

// ### Get All Books ### //
bookRoutes.get('', getAllBooks);

// ### Get 3 Best Books ### //
bookRoutes.get('/bestrating', getBestRatingBooks);

// ### Get Book With ID ### //
bookRoutes.get('/:id', getBookWithID);

// ### Create New Book ### //
bookRoutes.post('', checkToken);
bookRoutes.post('', upload.single('image'), convertImageToWebp);
bookRoutes.post('', createNewBook);

// ### Update Book With ID ### //
bookRoutes.put('/:id', checkToken);
bookRoutes.put('/:id', upload.single('image'), convertImageToWebp);
bookRoutes.put('/:id', updateBookWithID);

// ### Remove Book With ID ### //
bookRoutes.delete('/:id', checkToken);
bookRoutes.delete('/:id', removeBookWithID);

// ### Add Rating With ID ### //
bookRoutes.post('/:id/rating', checkToken);
bookRoutes.post('/:id/rating', addRatingOnBookWithID);

export default bookRoutes;

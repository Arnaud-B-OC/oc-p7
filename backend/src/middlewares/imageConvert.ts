import { RequestHandler, Request } from 'express';
import fs = require('fs');
import sharp = require('sharp');

export interface CustomRequestConvert extends Request {
    imageUrl?: string
    imagePath?: string
}

const SERVER_URL = process.env.SERVER_URL ?? 'http://localhost:4000';

export const convertImageToWebp : RequestHandler = (req: CustomRequestConvert, res, next) => {
    let filename = req.file?.filename;
    if (!filename) return next();

    const uploadFilepath = process.cwd() + '/uploads/' + filename
    const publicFilepath = process.cwd() + '/public/images/' + filename + '.webp'

    // Remove file cache
    sharp.cache({files: 0});

    sharp(uploadFilepath)
    .resize(400)
    .webp()
    .toFile(publicFilepath, (err, info) => {
        if (err) {
            try { fs.unlinkSync(uploadFilepath) } catch (err) { console.error('[ERR] Fail to remove old image file !', err) }

            console.error('[ERR]', err);
            res.status(500).json({ message: 'Internal Server Error', err: err });
            return;
        }

        try {
            fs.unlinkSync(uploadFilepath);
        } catch (err) {
            console.error('[ERR] Fail to remove old image file !', err);
        }

        req.imageUrl = `${SERVER_URL}/images/${filename}.webp`;
        req.imagePath = publicFilepath;
        next();
    }).end();
}

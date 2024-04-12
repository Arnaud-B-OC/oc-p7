import { RequestHandler, Request } from 'express';
import fs = require('fs');

export interface CustomRequestConvert extends Request {
    imageUrl?: string
    imagePath?: string
}

const SERVER_URL = process.env.SERVER_URL ?? 'http://localhost:4000'

export const convertImageToWebp : RequestHandler = (req: CustomRequestConvert, res, next) => {
    let filename = req.file?.filename;
    if (!filename) return next();

    const uploadFilepath = process.cwd() + '/uploads/' + filename
    const publicFilepath = process.cwd() + '/public/images/' + filename + '.webp'

    const CWebp = require('cwebp').CWebp;
    const encoder = new CWebp(uploadFilepath);
    encoder.resize(400, 0);
    encoder.write(publicFilepath)
    .then(() => {
        try {
            fs.unlinkSync(uploadFilepath);
        } catch (err) {
            console.error('[ERR] Fail to remove old image file !', err);
        }

        req.imageUrl = `${SERVER_URL}/images/${filename}.webp`;
        req.imagePath = publicFilepath;
        next();
    }).catch((err: any) => {
        try { fs.unlinkSync(uploadFilepath) } catch (err) { console.error('[ERR] Fail to remove old image file !', err) }

        console.error('[ERR]', err);
        res.status(500).json({ message: 'Internal Server Error', err: err });
    });
}

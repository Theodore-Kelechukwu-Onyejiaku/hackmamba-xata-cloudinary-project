import nc from 'next-connect';
import { getToken } from 'next-auth/jwt';
import multer from 'multer';
import path from 'path';
import DatauriParser from 'datauri/parser';
import cloudinary from '../../utils/cloudinary';
import { getXataClient } from '../../utils/xata';

const handler = nc({
    onError: (err, res) => {
        res.status(500).end('Something broke!');
    },
    onNoMatch: (req, res) => {
        res.status(404).end('Page is not found');
    },
})
    .use(multer().single('image'))
    .post(async (req, res) => {
        const xata = getXataClient();
        const image = req.file;
        try {
            const token = await getToken({ req });
            // if no token
            if (!token) {
                return res.status(403).json({ error: 'You are not signed in', data: null });
            }

            const userId = token.user.id;

            console.log(userId, req.body.userId)

            // check if user is authorised
            if (!(req.body.userId === userId)) {
                return res.status(403).json({ error: 'You cannot perform this operation.', data: null });
            }

            // instantiate a parser
            const parser = new DatauriParser();

            // check if user already has a picture
            if (req.body.imageId) {
                // destroy existing image on cloudinary
                await cloudinary.v2.uploader.destroy(req.body.imageId);
            }

            // create new one
            const base64Image = await parser.format(path.extname(image.originalname).toString(), image.buffer);
            const uploadedImageResponse = await cloudinary.uploader.upload(base64Image.content, 'flashcards', { resource_type: 'image' });
            const profilePictureId = uploadedImageResponse.public_id;
            const profilePicture = uploadedImageResponse.url;
            const updatedUser = await xata.db.Users.update(token.user.id, {
                profilePicture,
                profilePictureId
            })

            res.json({ error: null, data: updatedUser });
        } catch (error) {
            res.status(500).json({ error: "Something went wrong. Please try again", data: null });
        }
    });

// disable body parser
export const config = {
    api: {
        bodyParser: false,
    },
};

export default handler;

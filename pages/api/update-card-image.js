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

    const token = await getToken({ req });
    // if no token
    if (!token) {
      return res.status(403).json({ error: 'You are not signed in', data: null });
    }

    const userId = token.user.id;
    // check if card is user's
    if (!(req.body.userId === userId)) {
      return res.status(403).json({ error: 'You cannot update this card.', data: null });
    }

    const parser = new DatauriParser();
    try {
      // destroy existing image on cloudinary
      await cloudinary.v2.uploader.destroy(req.body.imageId);
      // create new one
      const base64Image = await parser.format(path.extname(image.originalname).toString(), image.buffer);
      const uploadedImageResponse = await cloudinary.uploader.upload(base64Image.content, 'flashcards', { resource_type: 'image' });
      const image_id = uploadedImageResponse.public_id;
      const image_signature = uploadedImageResponse.signature;
      const card = await xata.db.Cards.update(req.body.cardId, {
        image: await uploadedImageResponse.url,
        image_id,
        image_signature,
      });

      res.json({ error: null, data: card });
    } catch (error) {
      res.status(500).json({ error, data: null });
    }
  });

// disable body parser
export const config = {
  api: {
    bodyParser: false,
  },
};

export default handler;

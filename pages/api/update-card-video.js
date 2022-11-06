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
  .use(multer().single('video'))
  .post(async (req, res) => {
    const xata = getXataClient();
    const video = req.file;

    const parser = new DatauriParser();
    try {
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

      // destroy any existing video on cloudinary
      if (req.body.videoId !== 'null') {
        await cloudinary.v2.uploader.destroy(req.body.videoId);
      }

      // create new one
      const base64Video = await parser.format(path.extname(video.originalname).toString(), video.buffer);
      const uploadedVideoResponse = await cloudinary.uploader.upload(base64Video.content, 'flashcards', { resource_type: 'video' });
      const video_id = uploadedVideoResponse.public_id;
      const video_signature = uploadedVideoResponse.signature;
      const card = await xata.db.Cards.update(req.body.cardId, {
        video: await uploadedVideoResponse.url,
        video_id,
        video_signature,
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

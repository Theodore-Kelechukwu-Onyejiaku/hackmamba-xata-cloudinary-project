import nc from 'next-connect';
import { getToken } from 'next-auth/jwt';
import multer from 'multer';
import path from 'path';
import DatauriParser from 'datauri/parser';
import cloudinary from '../../utils/cloudinary';
import { getXataClient } from '../../utils/xata';

const xata = getXataClient();

const handler = nc({
  onError: (res) => {
    res.status(500).end('Something broke!');
  },
  onNoMatch: (req, res) => {
    res.status(404).end('Page is not found');
  },
})
  // uploading two files
  .use(multer().any())
  .post(async (req, res) => {
    // get user's token
    const token = await getToken({ req });

    // if no token
    if (!token) {
      return res.status(401).json({ error: 'You are not signed in', data: null });
    }
    // get parsed image and video from multer
    const image = req.files.filter((file) => file.fieldname === 'image')[0];
    const video = req.files.filter((file) => file.fieldname === 'video')[0];
    // create a neew Data URI parser
    const parser = new DatauriParser();
    try {
      // let image_id; let image_signature; let video_id; let video_signature;
      // let uploadedImageResponse; let uploadedVideoResponse;

      // create image
      const createImage = async (img) => {
        const base64Image = parser.format(path.extname(img.originalname).toString(), img.buffer);
        const uploadedImageResponse = await cloudinary.uploader.upload(base64Image.content, 'flashcards', { resource_type: 'image' });
        return uploadedImageResponse;
      };

      // create video
      const createVideo = async (vid) => {
        const base64Video = parser.format(path.extname(vid.originalname).toString(), vid.buffer);
        const uploadedVideoResponse = await cloudinary.uploader.upload(base64Video.content, 'flashcards', { resource_type: 'video' });
        return uploadedVideoResponse;
      };

      // saving information
      const createdImage = await createImage(image);
      const imageUrl = createdImage.url;
      const image_id = createdImage.public_id;
      const image_signature = createdImage.signature;
      const createdVideo = video ? await createVideo(video) : null;
      const videoUrl = createdVideo?.url;
      const video_id = createdVideo?.public_id;
      const video_signature = createVideo?.signature;

      // creating a new card
      const card = await xata.db.Cards.create({
        name: req.body.cardName,
        category: req.body.category,
        color: req.body.cardColor,
        front: req.body.front,
        back: req.body.back,
        image: imageUrl,
        image_id,
        image_signature,
        video: videoUrl,
        video_id,
        video_signature,
        user: token.user.id,
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

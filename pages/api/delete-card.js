import { getToken } from 'next-auth/jwt';
import { getXataClient } from '../../utils/xata';
import cloudinary from '../../utils/cloudinary';

const handler = async (req, res) => {
  try {
    const xata = getXataClient();
    const token = await getToken({ req });
    if (!token) {
      return res.status(403).json({ error: 'Please signin to perform this operation.', data: null });
    }

    const userId = token.user.id;
    // check if owner
    if (!(req.body.user.id === userId)) {
      return res.status(403).json({ error: 'Please you cannot delete this card', data: null });
    }

    // delete video if any
    if (req.body.video_id) {
      await cloudinary.v2.uploader.destroy(req.body.video_id);
    }

    // delete image if any
    if (req.body.image_id) {
      await cloudinary.v2.uploader.destroy(req.body.image_id);
    }

    // finally, delete card
    const record = await xata.db.Cards.delete(req.body.id);
    return res.json({ error: null, data: record });
  } catch (error) {
    res.status(500).json({ error: 'something went wrong', data: null });
  }
};

export default handler;

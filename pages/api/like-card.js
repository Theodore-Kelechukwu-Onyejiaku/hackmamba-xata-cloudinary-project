import { getToken } from 'next-auth/jwt';
import { getXataClient } from '../../utils/xata';

const handler = async (req, res) => {
  try {
    const { card } = req.body;
    const xata = getXataClient();
    const token = await getToken({ req });
    let record;

    // if no token
    if (!token) {
      return res.status(403).json({ error: 'You are not signed in', data: null });
    }

    const userId = token.user.id;

    // if no existing likes
    if (card.likes == null || card.likes.length === 0) {
      const peopleWhoLiked = [];
      peopleWhoLiked.push(userId);
      card.likes = peopleWhoLiked;

      // run the update here
      await xata.db.Cards.update(card.id, {
        likes: card.likes,
      });
    } else if (card.likes.includes(userId)) { // if user already liked
      const peopleWhoLiked = card.likes;
      const index = peopleWhoLiked.indexOf(userId);
      if (index > -1) {
        peopleWhoLiked.splice(index, 1);
      }
      card.likes = peopleWhoLiked;
      // run the update here
      record = await xata.db.Cards.update(card.id, {
        likes: card.likes,
      });
    } else { // new like
      const peopleWhoLiked = card.likes;
      peopleWhoLiked.push(userId);
      card.likes = peopleWhoLiked;
      // run the update here
      record = await xata.db.Cards.update(card.id, {
        likes: card.likes,
      });
    }

    return res.json({ error: null, data: record });
  } catch (error) {
    return res.status(500).json({ error: 'Something went wrong', data: null });
  }
};

export default handler;

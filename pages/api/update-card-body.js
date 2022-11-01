import { getToken } from 'next-auth/jwt';
import { getXataClient } from '../../utils/xata';

const handler = async (req, res) => {
  const {
    front, back, cardName, card,
  } = req.body;
  const xata = getXataClient();
  const token = await getToken({ req });
  // if no token
  if (!token) {
    return res.status(403).json({ error: 'You are not signed in', data: null });
  }

  if (!(card.user.id === token.user.id)) {
    return res.status(403).json({ error: 'You cannot update this card', data: null });
  }

  try {
    const record = await xata.db.Cards.update(card.id, {
      front,
      back,
      name: cardName,
    });
    return res.json({ error: null, data: record });
  } catch (error) {
    return res.status(500).json({ error: 'Something went wrong', data: null });
  }
};

export default handler;

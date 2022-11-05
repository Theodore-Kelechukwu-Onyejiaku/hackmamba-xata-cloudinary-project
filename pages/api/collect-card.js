import { getToken } from 'next-auth/jwt';
import { getXataClient } from '../../utils/xata';

const handler = async (req, res) => {
  try {
    const xata = getXataClient();
    const { card } = req.body;
    const token = await getToken({ req });

    // if no token
    if (!token) {
      return res.status(403).json({ error: 'You are not signed in', data: null });
    }

    const userId = token.user.id;

    const collectors = [];
    collectors.push(userId);

    // run update
    const updatedCard = await xata.db.Cards.update(card.id, {
      collectors,
    });
    res.json({ error: null, data: updatedCard });
  } catch (error) {
    res.status(500).json({ error: 'something went wrong', data: null });
  }
};

export default handler;

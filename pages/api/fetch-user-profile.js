import { getXataClient } from '../../utils/xata';

const handler = async (req, res) => {
  const {
    query: { userId },
  } = req;
  const xata = getXataClient();
  const user = await xata.db.Users.read(userId);
  res.json(user);
};

export default handler;

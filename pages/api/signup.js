import bcrypt from 'bcrypt';
import { getXataClient } from '../../utils/xata';

const xata = getXataClient();

const handler = async (req, res) => {
  try {
    // check if user already exists
    const user = await xata.db.Users.filter('email', req.body.email).getFirst();
    if (user) {
      return res.json({ data: null, error: 'User already exists' });
    }// generate hash for password
    const saltRounds = 10;
    const hash = await bcrypt.hash(req.body.password, saltRounds);
    req.body.password = hash;
    req.body.provider = 'credentials';

    // create new user
    await xata.db.Users.create(req.body);
    return res.json({ data: 'Registration', error: null });
  } catch (error) {
    res.status(500).json({ data: null, error: 'something went wrong' });
  }
};

export default handler;

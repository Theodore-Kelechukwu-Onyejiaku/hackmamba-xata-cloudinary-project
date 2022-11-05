import { getXataClient } from '../../utils/xata';

const handler = async (req, res) => {
    const {
        query: { userId },
    } = req;
    console.log(userId)
    const xata = getXataClient();
    const user = await xata.db.Users.read(userId)
    console.log(user)
    res.json(user)
}

export default handler;
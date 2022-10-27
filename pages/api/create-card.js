import { getXataClient } from "../../utils/xata";
import { getToken } from "next-auth/jwt";

const xata = getXataClient();

export default async function (req, res) {
    const token = await getToken({ req })

    if (!token) {
        return res.status(401).json({ error: "You are not signed in", data: null })
    }
    try {
        const record = await xata.db.Cards.create({
            name: req.body.cardName,
            color: req.body.cardColor,
            front: req.body.front,
            back: req.body.back,
            image: req.body.image,
            video: req.body.image,
            user: token.user.id,
            likes: [],
        });
        res.json({ error: null, data: record })
    } catch (error) {
        res.status(500).json({ error: "Something went wrong", data: null })
    }

    // console.log(req.body.image)
}
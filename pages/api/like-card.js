import { getXataClient } from "../../utils/xata"
import { getToken } from "next-auth/jwt";
import Cards from "../../components/Cards";
const handler = async (req, res) => {
    try {
        let { card } = req.body
        console.log("Hey  I am here!")
        const xata = getXataClient()
        const token = await getToken({ req })
        let record;

        // if no token
        if (!token) {
            return res.status(403).json({ error: "You are not signed in", data: null })
        }

        let userId = token.user.id;

        // if no existing likes
        if (card.likes == null || card.likes.length == 0) {
            let peopleWhoLiked = [];
            peopleWhoLiked.push(userId);
            card.likes = peopleWhoLiked

            // run the update here
            const record = await xata.db.Cards.update(card.id, {
                likes: card.likes
            })

        }
        // if user already liked 
        else if (card.likes.includes(userId)) {
            let peopleWhoLiked = card.likes
            let index = peopleWhoLiked.indexOf(userId)
            if (index > -1) {
                peopleWhoLiked.splice(index, 1)
            }
            card.likes = peopleWhoLiked
            // run the update here
            record = await xata.db.Cards.update(card.id, {
                likes: card.likes
            })
        }

        // new like
        else {
            let peopleWhoLiked = card.likes
            peopleWhoLiked.push(userId)
            card.likes = peopleWhoLiked
            // run the update here
            record = await xata.db.Cards.update(card.id, {
                likes: card.likes
            })
        }

        return res.json({ error: null, data: record })
    } catch (error) {
        console.log(error)
        return res.status(500).json({ error: "Something went wrong", data: null })
    }
}

export default handler;
import { getXataClient } from "../../utils/xata"
import { getToken } from "next-auth/jwt";
import { endsWith } from "@xata.io/client";



const handler = async (req, res) => {
    console.log(req.body)
    const xata = getXataClient()
    const token = await getToken({ req })
    // if no token
    if (!token) {
        return res.status(401).json({ error: "You are not signed in", data: null })
    }
   return
    // check if card is user's
    if(card?.user.id == token.user.id){
        console.log("heyyyyy")
        return
    }

    try {
        const record = await xata.db.Cards.update("rec_xyz", {
            name: req.body.name,
            image: req.body.image,
            video: req.body.video,
            user: "rec_xyz",
            likes: req.body.card.likes,
            color: req.body.name,
            front: "longer text",
            back: "longer text",
            video_id: "string",
            video_signature: "string",
            image_id: "string",
            image_signature: "string",
          });
        return res.json({ error: null, data: record })
    } catch (error) {
        console.log(error)
        return res.status(500).json({ error: error.message, data: null })
    }
}

export default handler;
import { getXataClient } from "../../utils/xata";
import { getToken } from "next-auth/jwt";
import cloudinary from "../../utils/cloudinary";

const handler = async (req, res) => {
    try {
        console.log("I am still here!")
        const xata = getXataClient();
        let token = await getToken({ req })
        if (!token) {
            return res.status(403).json({ error: "Please signin to perform this operation.", data: null })
        }

        let userId = token.user.id;
        // check if owner
        if (!(req.body.user.id === userId)) {
            return res.status(403).json({ error: "Please you cannot delete this card", data: null })
        }

        // delete video if any
        if (req.body.video_id) {
            await cloudinary.v2.uploader.destroy(req.body.video_id);
        }

        // delete image if any
        if (req.body.image_id) {
            await cloudinary.v2.uploader.destroy(req.body.image_id)
        }

        // finally, delete card
        const record = await xata.db.Cards.delete(req.body.id);
    } catch (error) {

    }
}

export default handler;
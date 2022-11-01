import nc from "next-connect"
import { getXataClient } from "../../utils/xata"
import { getToken } from "next-auth/jwt"
import cloudinary from "../../utils/cloudinary"
import multer from "multer"
import path from "path"
import DatauriParser from "datauri/parser"

const handler = nc({
    onError: (err, req, res, next) => {
        console.log(err)
        res.status(500).end("Something broke!");
    },
    onNoMatch: (req, res) => {
        res.status(404).end("Page is not found");
    },
})
    .use(multer().single("video"))
    .post(async (req, res) => {
        const xata = getXataClient();
        let video = req.file;

        let parser = new DatauriParser;
        try {

            let token = await getToken({ req })
            // if no token
            if (!token) {
                return res.status(403).json({ error: "You are not signed in", data: null })
            }
            let userId = token.user.id;
            // check if card is user's
            if (!(req.body.userId === userId)) {
                return res.status(403).json({ error: "You cannot update this card.", data: null })
            }
            // destroy existing video on cloudinary
            if (req.body.videoId) {
                await cloudinary.v2.uploader.destroy(req.body.videoId);
            }

            // create new one
            let base64Video = await parser.format(path.extname(video.originalname).toString(), video.buffer)
            let uploadedVideoResponse = await cloudinary.uploader.upload(base64Video.content, "flashcards", { resource_type: "video" })
            let video_id = uploadedVideoResponse.public_id;
            let video_signature = uploadedVideoResponse.signature;
            const card = await xata.db.Cards.update(req.body.cardId, {
                video: await uploadedVideoResponse.url,
                video_id,
                video_signature
            })

            console.log(card)
            res.json({ error: null, data: card })
        } catch (error) {
            console.log(error)
            res.status(500).json({ error: error, data: null })
        }

    })

// disable body parser
export const config = {
    api: {
        bodyParser: false,
    }
}

export default handler;
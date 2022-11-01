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
    .use(multer().single("image"))
    .post(async (req, res) => {
        const xata = getXataClient();
        let image = req.file;

        const token = await getToken({ req })
        // if no token
        if (!token) {
            return res.status(403).json({ error: "You are not signed in", data: null })
        }

        let userId = token.user.id;
        // check if card is user's
        if (!(req.body.userId === userId)) {
            return res.status(403).json({ error: "You cannot update this card.", data: null })
        }

        let parser = new DatauriParser;
        try {

            // destroy existing image on cloudinary
            await cloudinary.v2.uploader.destroy(req.body.imageId);
            // create new one
            let base64Image = await parser.format(path.extname(image.originalname).toString(), image.buffer)
            let uploadedImageResponse = await cloudinary.uploader.upload(base64Image.content, "flashcards", { resource_type: "image" })
            let image_id = uploadedImageResponse.public_id;
            let image_signature = uploadedImageResponse.signature;
            const card = await xata.db.Cards.update(req.body.cardId, {
                image: await uploadedImageResponse.url,
                image_id,
                image_signature
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
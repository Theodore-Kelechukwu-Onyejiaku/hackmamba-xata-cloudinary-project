import nc from "next-connect"
import { getXataClient } from "../../utils/xata";
import { getToken } from "next-auth/jwt";
import cloudinary from "../../utils/cloudinary"
import multer from "multer";
import path from "path";
import DatauriParser from "datauri/parser"

const xata = getXataClient();

const handler = nc({
    onError: (err, req, res, next) => {
        res.status(500).end("Something broke!");
    },
    onNoMatch: (req, res) => {
        res.status(404).end("Page is not found");
    },
})
    // uploading two files 
    .use(multer().any())
    .post(async (req, res) => {
        // get user's token
        const token = await getToken({ req })

        // if no token
        if (!token) {
            return res.status(401).json({ error: "You are not signed in", data: null })
        }
        // get parsed image and video from multer
        let image = req.files.filter(file => file.fieldname === "image")[0]
        let video = req.files.filter(file => file.fieldname === "video")[0]
        console.log(image)
        // create a neew Data URI parser
        let parser = new DatauriParser;
        try {
            let image_id, image_signature, video_id, video_signature, uploadedImageResponse, uploadedVideoResponse;
            if (image) {
                console.log("there is an image")
                let base64Image = parser.format(path.extname(image.originalname).toString(), image.buffer)
                uploadedImageResponse = await cloudinary.uploader.upload(base64Image.content, "flashcards", { resource_type: "image" })
                image_id = uploadedImageResponse.public_id;
                image_signature = uploadedImageResponse.signature;

            }
            if (video) {
                console.log("there is a video")
                let base64Video = parser.format(path.extname(video.originalname).toString(), video.buffer)
                uploadedVideoResponse = await cloudinary.uploader.upload(base64Video.content, "flashcards", { resource_type: "video" })
                video_id = uploadedVideoResponse.public_id;
                video_signature = uploadedVideoResponse.signature;
            }
            
            const card = await xata.db.Cards.create({
                name: req.body.cardName,
                color: req.body.cardColor,
                front: req.body.front,
                back: req.body.back,
                image: await uploadedImageResponse?.url,
                image_id,
                image_signature,
                video: await uploadedVideoResponse?.url,
                video_id,
                video_signature,
                user: token.user.id,
                likes: [],
            });
            
            // return response
            res.json({ error: null, data: card })
        } catch (error) {
            res.status(500).json({ error: error, data: null })
        }
    })

// disable body parser
export const config = {
    api: {
        bodyParser: false,
    }
}

export default handler
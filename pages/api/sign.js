import { v2 as cloudinary } from "cloudinary";

export default async function handler(req, res) {
    const body = JSON.parse(req.body) || {};
    const { paramsToSign } = body;

    console.log(paramsToSign);

    const apiSecret = process.env.NEXT_PUBLIC_CLOUDINARY_API_SECRET;

    try {
        const signature = cloudinary.utils.api_sign_request(
            paramsToSign,
            apiSecret
        );
        res.json({ signature });
    } catch (error) {
        console.log(error);
        res.send(error);
    }
}

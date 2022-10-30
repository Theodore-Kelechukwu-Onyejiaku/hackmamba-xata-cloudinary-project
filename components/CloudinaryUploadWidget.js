import { useState } from "react";
import { generateSignature } from "../utils/generateSignature";

export default function ImageUpload() {
    async function handleWidgetClick() {
        const widget = window.cloudinary.createUploadWidget(
            {
                cloudName: process.env.CLOUDINARY_NAME,
                uploadSignature: generateSignature,
                apiKey: process.env.CLOUDINARY_API_KEY,
                // resourceType: "image",
            },
            (error, result) => {
                if (!error && result && result.event === "success") {
                    console.log("Done! Here is the image info: ", result.info);
                } else if (error) {
                    console.log(error);
                }
            }
        );
        widget.open();
    }

    return (
        <div >
            <div >
                <button
                    type="button"
                    onClick={handleWidgetClick}
                >
                    Upload image
                </button>
            </div>
        </div>
    );
}
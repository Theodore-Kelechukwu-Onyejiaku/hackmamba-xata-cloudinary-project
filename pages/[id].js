import React from 'react'
import { getXataClient } from '../utils/xata';
import { useState, useEffect } from "react";
import { useSession, getSession } from "next-auth/react"
import { useRouter } from "next/router"
import SkeletonLoader from "../components/Skeleton"
import 'react-quill/dist/quill.snow.css';
import 'react-quill/dist/quill.bubble.css'
import { modules, formats } from "../utils/editor";
const ReactQuill = typeof window === 'object' ? require('react-quill') : () => false;
import ErrorComponent from '../components/ErrorComponent';
import { toast } from 'react-toastify';
import Loading from '../components/Loading';
import ProcessIndicator from '../components/ProcessIndicator';
import { validateSize } from '../utils/fileValidation';
import Image from 'next/image';

export default function Card({ card, error }) {
    const router = useRouter();
    const session = useSession()
    const { status, data } = session
    const [back, setBack] = useState(card.back);
    const [front, setFront] = useState(card.front);
    const [cardName, setCardName] = useState(card.name);
    const [newImage, setNewImage] = useState(null);
    const [newVideo, setNewVideo] = useState(null)
    const [imageError, setImageError] = useState("")
    const [videoError, setVideoError] = useState("")
    const [frontBackLoading, setFrontBackLoading] = useState(false)
    const [fileUploading, setFileUploading] = useState(false)
    const [componentLoading, setComponentLoading] = useState(true)

    const handleFrontBackUpdate = async () => {
        setFrontBackLoading(true)
        let res = await fetch("/api/update-card-body", {
            method: "POST",
            body: JSON.stringify({ front, back, cardName, card: card }),
            headers: {
                "Content-Type": "application/json"
            }
        })
        const { error } = await res.json()
        if (error) {
            toast(error, { type: "error" })
            setFrontBackLoading(false)
            return
        }
        toast("Front and Back Updated Successfully!", { type: "success" })
        setFrontBackLoading(false)
    }

    const handleImageUpdate = async () => {
        if (!newImage) {
            return
        }
        setFileUploading(true)
        let formData = new FormData();
        formData.append("image", newImage);
        formData.append("cardId", card.id);
        formData.append("imageId", card.image_id)
        formData.append("imageSignature", card.image_signature)
        formData.append("userId", card?.user.id)
        let res = await fetch("/api/update-card-image", {
            method: "POST",
            body: formData,
        })
        let { error } = await res.json();
        if (error) {
            toast("There was an error", { type: "error" })
            setFileUploading(false)
            return
        }
        toast("Image Replaced Successfully!", { type: "success" })
        setFileUploading(false)
        router.replace(router.asPath)
    }
    const handleVideoUpdate = async () => {
        if (!newVideo) {
            return
        }
        setFileUploading(true)
        let formData = new FormData();
        formData.append("video", newVideo);
        formData.append("cardId", card.id);
        formData.append("videoId", card.video_id)
        formData.append("videoSignature", card.video_signature)
        formData.append("userId", card?.user.id)
        let res = await fetch("/api/update-card-video", {
            method: "POST",
            body: formData,
        })
        let { error } = await res.json();
        if (error) {
            toast("There was an error", { type: "error" })
            setFileUploading(false)
            return
        }
        toast("Video Uploaded successfully!", { type: "success" })
        setFileUploading(false)
        router.replace(router.asPath)
    }

    const largeFile = (file) => {
        let isFileLarge = validateSize(file);
        if (isFileLarge) {
            toast("File is too large. Please upload file less than or equal to 5MB", { type: "error" })
            return true
        }
        return false
    }
    const handleImageSelect = async (e) => {
        setImageError("")
        let file = e.target.files[0]
        if (largeFile(file)) {
            setImageError("File is too large. Please upload image file less than or equal to 5MB")
            return
        }
        setNewImage(e.target.files[0])
    }

    const handleVideoSelect = async (e) => {
        setVideoError("")
        let file = e.target.files[0]
        if (largeFile(file)) {
            setVideoError("File is too large. Please upload video file less than or equal to 5MB")
        }
        setNewVideo(e.target.files[0])
    }
    useEffect(() => {
        setComponentLoading(false)
    }, [])

    if (error) {
        return <ErrorComponent />
    }

    if (componentLoading) {
        return <SkeletonLoader />
    }

    return (<div>

        {/* check if it is current user that owns the card */}
        {data?.user.id === card.user.id ? <div>
            {fileUploading ? <ProcessIndicator /> : <div className='dark:text-white dark:bg-black'>
                <div className='mx-5'>
                    <h1 className='my-5 text-lg font-extrabold'>Edit Card</h1>
                    <div className='flex flex-col md:flex-row md:space-x-10 md:justify-center md:items-center'>
                        <div className='md:basis-1/2  flex flex-col my-10'>
                            <span className='font-bold my-5'>Card Image</span>
                            <Image src={card.image} className="w-full rounded-md" alt={card.name} />
                            <div className='my-3'>
                                <label>Replace</label>
                                <input onChange={handleImageSelect} name="newImage" type="file" />
                            </div>
                            {imageError && <p className='text-red-400 my-5'>{imageError}</p>}
                            <button onClick={handleImageUpdate} className='border text-left w-fit p-2 bg-black text-white rounded-md'>Replace Image</button>
                        </div>
                        <div className="md:basis-1/2">
                            <h2 className='font-bold my-5'>Card Video</h2>
                            {card.video ? <div className='my-5'>
                                <video className="w-full md:w-3/4 h-auto my-5" controls>
                                    <source src={card.video} type="video/mp4" />
                                </video>
                                <div className='my-3'>
                                    <label>Replace</label>
                                    <input onChange={handleVideoSelect} name="newVideo" type="file" accept="video/mp4,video/x-m4v,video/*" />
                                </div>
                                <button onClick={handleVideoUpdate} className='border text-left w-fit p-2 bg-black text-white rounded-md'>Replace Video</button>
                            </div> : <>
                                <div className='my-5 p-5 md:flex md:flex-col md:justify-center md:items-center text-center border-4'>
                                    <span className="text-red-500">You have no video for this card. Please select a video</span>
                                    <input onChange={handleVideoSelect} className='block my-5 m-auto' type="file" accept="video/mp4,video/x-m4v,video/*" />
                                </div>

                                <button onClick={handleVideoUpdate} className='border text-left w-fit p-2 bg-black text-white rounded-md'>Upload</button>
                            </>
                            }
                        </div>
                    </div>

                    <div className='my-20'>
                        <h2 className='my-5 font-bold'>Card Name</h2>
                        <input type="text" value={cardName} onChange={(e) => { setCardName(e.target.value) }} className="w-full border p-2 text-black" />
                    </div>
                    <div className='my-20'>
                        <h2 className='my-5 font-bold'>Card Front</h2>
                        <ReactQuill
                            id="editor" formats={formats} modules={modules} theme="snow" value={front} onChange={setFront} className="w-full h-96 pb-10 dark:text-white"
                        />
                    </div>

                    <div className='my-10'>
                        <h2 className='my-5 font-bold'>Card Back</h2>
                        <ReactQuill
                            id="editor" formats={formats} modules={modules} theme="snow" value={back} onChange={setBack} className="w-full h-96 pb-10 dark:text-white"
                        />
                    </div>
                    {frontBackLoading ? <Loading /> : <button onClick={handleFrontBackUpdate} className='p-2 bg-black my-5 text-white rounded-md border'>Update Front/Back</button>}
                </div>
            </div>}
        </div> : <div className="h-screen flex items-center justify-center text-red-600">Sorry you don&apos;t have access to this card</div>}
    </div>
    )
}


export async function getStaticPaths() {
    const xata = getXataClient()
    try {
        let cards = await xata.db.Cards.select(["*", "user.*"]).getAll();
        let paths = cards.map(card => ({
            params: { "id": card.id }
        }))
        return {
            paths, fallback: false
        }
    } catch (error) {
        return {
            paths: [], fallback: false
        }
    }
}

export async function getStaticProps({ params }) {
    console.log("The params", params.id)
    const xata = getXataClient()
    try {
        const cards = await xata.db.Cards.filter("id", params.id).select(["*", "user.*"]).getAll();
        let card = cards[0]
        return { props: { error: null, card: card } }
    } catch (error) {
        return { props: { error: error.message, card: null } }
    }
}
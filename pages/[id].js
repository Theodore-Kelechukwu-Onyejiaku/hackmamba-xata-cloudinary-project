import React from 'react'
import { MdSimCardDownload, MdAddCircle } from 'react-icons/md';
import { getXataClient } from '../utils/xata';
import { useState, useRef, useEffect } from "react";
import { useSession, getSession } from "next-auth/react"
import LoginToContinue from "../components/LoginToContinue"
import SkeletonLoader from "../components/Skeleton"
import 'react-quill/dist/quill.snow.css';
import 'react-quill/dist/quill.bubble.css'
import { modules, formats } from "../utils/editor";
const ReactQuill = typeof window === 'object' ? require('react-quill') : () => false;
import { isImage, isVideo, validateSize } from "../utils/fileValidation";
import { toast } from 'react-toastify';
import ProcessIndicator from "../components/ProcessIndicator";

export default function Card({ card }) {
    const [back, setBack] = useState(card.back);
    const [front, setFront] = useState(card.front);

    const handleUpdate = () => {
        console.log(front, back)
        let response = fetch("/api/update-card", {
            method: "POST",
            body: JSON.stringify({ front, back, card: card })
        })
    }
    return (
        <div className='dark:text-white dark:bg-black'>
            <div className='mx-5'>
                <h1 className='my-5 text-lg font-extrabold'>Edit Card</h1>
                <div className='flex flex-col md:flex-row md:space-x-10 md:justify-center md:items-center'>
                    <div className='md:basis-1/2 flex flex-col my-10'>
                        <span className='font-bold my-5'>Card Image</span>
                        <img src={card.image} className="w-full rounded-md" />
                        <div className='my-3'>
                            <label>Replace</label>
                            <input className='' type="file" />
                        </div>
                        <button className='border text-left w-fit p-2 bg-black text-white rounded-md'>Upload</button>
                    </div>
                    <div className="md:basis-1/2">
                        <h2 className='font-bold my-5 md:text-center'>Card Video</h2>
                        {card.video ? <div className='my-5'>
                            <video className="w-full md:w-3/4 h-auto my-5" controls autoPlay>
                                <source src={card.video} type="video/mp4" />
                            </video> </div> : <>
                            <div className='my-5 p-5 md:flex md:flex-col md:justify-center md:items-center text-center border-4'>
                                <span className="text-red-500">You have no video for this card. Please select a video</span>
                                <input className='block my-5 m-auto' type="file" accept="video/mp4,video/x-m4v,video/*" />
                            </div>
                            <button className='border text-left w-fit p-2 bg-black text-white rounded-md'>Upload</button>
                        </>
                        }
                    </div>
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
                <button onClick={handleUpdate} className='p-2 bg-black my-5 text-white rounded-md'>Update Front/Back</button>
            </div>
        </div>
    )
}


export async function getStaticPaths() {
    const xata = getXataClient()
    let cards = await xata.db.Cards.select(["*", "user.*"]).getAll();
    let paths = cards.map(card => ({
        params: { "id": card.id }
    }))
    return {
        paths, fallback: false
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
import { useEffect, useState, useContext } from "react"
import Link from "next/link"
import { useRouter } from "next/router"
import { useSession } from "next-auth/react"
import { FaVideo, FaHeart, FaUserAlt } from "react-icons/fa"
import { MdOutlineClear, MdOutlineVideocamOff, MdOutlineDeleteOutline, MdOutlineAddCircleOutline } from "react-icons/md"
import ErrorComponent from "./ErrorComponent"
import SkeletonLoader from "./Skeleton"
import { TbCardboards, TbEdit } from "react-icons/tb"
import { toast } from 'react-toastify';
const ReactQuill = typeof window === 'object' ? require('react-quill') : () => false;
import AppContext from "../utils/AppContext"


export default function Cards({ cards, error, edit }) {
    const { searchValue } = useContext(AppContext)
    const session = useSession()
    const { status, data } = session
    const router = useRouter()
    const [imageOpen, setImageOpen] = useState(false)
    const [videoOpen, setVideoOpen] = useState(false)
    const [imageSource, setImageSource] = useState("")
    const [videoSource, setVideoSource] = useState("")
    const [pageLoading, setPageLoading] = useState(true)

    const front = (id) => {
        document.getElementById(id).classList.add("flip")
    }
    const back = (id) => {
        document.getElementById(id).classList.remove("flip")
    }

    const handleSearchValue = () => {
        card.filter
    }

    const handleLikeCard = async (card, id) => {
        let likeButton = document.getElementById(id.toString() + id);
        let numberOfLikes = document.getElementById(id.toString() + id.toString() + id)
        let res = await fetch("/api/like-card", {
            method: "PUT",
            body: JSON.stringify({ card }),
            headers: {
                "Content-Type": "application/json"
            }
        })
        const { error } = await res.json();
        if (error) {
            toast(error, { type: "error" })
            setFrontBackLoading(false)
            return
        }
        if (likeButton.classList.contains("liked")) {
            likeButton.classList.remove("liked")
            numberOfLikes.innerText = parseInt(numberOfLikes.innerText) - 1;
        } else {
            likeButton.classList.add("liked")
            numberOfLikes.innerText = parseInt(numberOfLikes.innerText) + 1;
        }
    }
    const handleCardDelete = async (card) => {
        let res = fetch("/api/delete-card", {
            method: "DELETE",
            body: JSON.stringify(card),
            headers: {
                "Content-Type": "application/json"
            }
        })

        let { error } = await res.json();
        if (error) {
            toast(error, { type: 'error' })
            return
        }
        toast("Card deleted successfully!", { type: "success" })
        router.replace(router.asPath)
    }

    const handleImageOpen = (imgSrc) => {
        setImageSource(imgSrc)
        setImageOpen(true)
    }

    const handleVideoOpen = (vidSrc) => {
        setVideoSource(vidSrc)
        setVideoOpen(true)
    }

    useEffect(() => {
        setPageLoading(false)
    }, [])
    if (pageLoading) {
        return <SkeletonLoader />
    }

    if (error) {
        return <ErrorComponent />
    }

    return (
        <div className='mx-5 mt-5'>
            {imageOpen &&
                <div className="h-screen fixed -top-0 bg-black bg-opacity-90 z-50 w-full left-0 mx-0 flex flex-col justify-center items-center p-10">
                    <img className="w-full md:w-3/4 h-auto" src={imageSource || ""} />
                    <span className="absolute top-20 text-3xl text-white cursor-pointer md:right-10 md:top-10 md:text-5xl" onClick={() => { setImageOpen(false) }}><MdOutlineClear /></span>
                </div>
            }
            {videoOpen &&
                <div className="h-screen fixed -top-0 bg-black bg-opacity-90 z-50 w-full left-0 mx-0 flex flex-col justify-center items-center p-10">
                    <video className="w-full md:w-3/4 h-auto" controls autoPlay>
                        <source src={videoSource} type="video/mp4" />
                    </video>
                    <span className="absolute top-20 text-3xl text-white cursor-pointer md:right-10 md:top-10 md:text-5xl" onClick={() => { setVideoOpen(false) }}><MdOutlineClear /></span>
                </div>
            }
            <div className='flex flex-col justify-center items-center sm:w-96 md:w-3/4 mx-auto'>
                {cards ? cards.filter(card => {
                    if (searchValue === "") {
                        return card
                    } else if (card?.name.toLowerCase().includes(searchValue)) {
                        return card
                    }
                })?.map((card) =>
                    <>
                        <div style={{ background: card.color }} key={card._id} className='my-5 w-96  md:w-full relative dark:bg-slate-800 drop-shadow-2xl rounded-xl shadow-2xl pb-10 md:pb-0'>
                            <figure className="flex  flex-col md:flex-row">
                                <div className="md:w-2/4 h-29">
                                    <img onClick={() => { handleImageOpen(card.image) }} className="w-full md:w-full md:h-full md:h-2/2 h-80 object-fill rounded-xl md:rounded-none cursor-pointer" src={card.image} alt="" width="384" height="512" />
                                </div>
                                <div className="flex md:flex-col md:text-left p-2 md:w-full">
                                    <div className={`${card.color === "#FFFFFF" ? "text-black " : "text-white "} basis-4/5 p-5`}>
                                        <figcaption className="font-medium">
                                            <div className="text-sky-500 dark:text-sky-400 my-3">
                                                {card.name}
                                            </div>
                                        </figcaption>
                                        <div className="card-container border rounded-3xl w-full">
                                            <div className="card" id={card.id}>
                                                <div className={`${card.color === "#FFFFFF" ? "text-black " : "text-white "} front font-medium text-xs`}>
                                                    <ReactQuill
                                                        style={{ position: "relative" }}
                                                        readOnly={true}
                                                        theme={"bubble"}
                                                        value={card.front}
                                                    />

                                                </div>
                                                <div className={`${card.color === "#FFFFFF" ? "text-black " : "text-white "} back font-medium text-xs`}>
                                                    {/* {card.back} */}
                                                    <ReactQuill
                                                        value={card.back}
                                                        readOnly={true}
                                                        theme={"bubble"}
                                                    ></ReactQuill>
                                                </div>
                                            </div>


                                        </div>

                                        <p className="text-sm my-5">{card?.user?.fullName}</p>
                                        <div className="p-2 md:flex space-x-5 hidden">
                                            <button onClick={() => { back(card.id) }} className="p-2 bg-black text-white rounded-md">Front</button>
                                            <button onClick={() => { front(card.id) }} className="p-2 bg-black text-white rounded-md">Back</button>
                                        </div>
                                    </div>

                                    <div className={`${card.color === "#FFFFFF" ? "text-black " : "text-white "} flex md:flex-row md:space-x-10 space-y-10 flex-col basis-1/5 items-end  justify-start mt-10 md:mt-0 p-5`}>
                                        <div className="relative flex flex-col md:flex-row space-y-10 items-center justify-center" ><span id={card.id.toString() + card.id} onClick={() => { handleLikeCard(card, card.id) }} className={`${card.likes.includes(data?.user?.id) ? " liked " : " "}heart-icon outline-none border-none block md:relative absolute -right-8`}></span></div>
                                        <div className="relative md:-left-10 -top-10 md:top-0 md:h-12 w-12">
                                            <span id={card.id.toString() + card.id + card.id} className="absolute md:left-0 md:bottom-0 right-0  text-sm">{card.likes.length}</span>
                                        </div>
                                        {card.video ? <FaVideo onClick={() => { handleVideoOpen(card.video) }} className='text-4xl animate-pulse text-white dark:text-white z-40 cursor-pointer font-extrabold' />
                                            : <MdOutlineVideocamOff className={`${card.color === "#FFFFFF" ? "text-black" : "text-white"} text-4xl animate-pulse text-white z-40 cursor-not-allowed font-extrabold`} />}
                                    </div>

                                </div>
                                <div className="p-2 flex space-x-5 md:hidden">
                                    <button onClick={() => { back(card.id) }} className="p-2 bg-black rounded-md text-white">Front</button>
                                    <button onClick={() => { front(card.id) }} className="p-2 bg-black rounded-md text-white">Back</button>
                                </div>
                            </figure>
                        </div>
                        {edit ? <div className="flex space-x-10">
                            <Link href={`/${card.id}`}><TbEdit className="cursor-pointer text-3xl" /></Link>
                            <MdOutlineDeleteOutline onClick={() => { handleCardDelete(card) }} className="cursor-pointer text-3xl text-red-700" />
                        </div> : null}
                    </>
                ) : <div>No cards at the moment</div>}
            </div>
        </div>
    )
}

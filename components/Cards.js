import { useEffect, useState } from "react"
import Link from "next/link"
import { FaVideo, FaHeart } from "react-icons/fa"
import { MdOutlineClear, MdOutlineVideocamOff, MdOutlineDeleteOutline } from "react-icons/md"
import ErrorComponent from "./ErrorComponent"
import SkeletonLoader from "./Skeleton"
import { TbEdit } from "react-icons/tb"

export default function Cards({ cards, error, edit }) {
    const [imageOpen, setImageOpen] = useState(false)
    const [videoOpen, setVideoOpen] = useState(false)
    const [imageSource, setImageSource] = useState("")
    const [videoSource, setVideoSource] = useState("")
    const [pageLoading, setPageLoading] = useState(true)

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
            <h1 className='dark:text-white my-5'>All Cards</h1>
            <div className='flex flex-col justify-center items-center sm:w-96 md:w-3/4 mx-auto'>
                {cards ? cards.map((card) =>
                    <>
                        <div key={card._id} style={{ backgroundColor: card.color, color: `${card.color === "#FFFFFF" ? "black" : "white"}` }} className='my-5 relative bg-slate-100 dark:bg-slate-800 rounded-xl px-8 pt-8 md:p-0 shadow-md'>
                            <figure className="md:flex ">
                                <div className="pt-6 md:p-8 md:text-left space-y-4">
                                    <p className="text-lg font-medium dark:text-white">
                                        “Tailwind CSS is the only framework that I've seen scale
                                        on large teams. It’s easy to customize, adapts to any design,
                                        and the build size is tiny.”
                                    </p>
                                    <figcaption className="font-medium">
                                        <div className="text-sky-500 text-center dark:text-sky-400">
                                            {card.name}
                                        </div>
                                    </figcaption>
                                    <p>{card?.user?.fullName}</p>
                                </div>
                                <img onClick={() => { handleImageOpen(card.image) }} className="w-full h-auto md:w-48 md:h-auto rounded md:rounded-none  mx-auto" src={card.image} alt="" width="384" height="512" />
                            </figure>
                            <div className='mt-8 mb-4 ml-2 flex justify-start items-center space-x-3'><span><FaHeart className='text-red-300' /></span><span>4</span></div>
                            {card.video ? <FaVideo onClick={() => { handleVideoOpen(card.video) }} className='absolute top-10 right-10 text-4xl animate-pulse text-white dark:text-white z-40 cursor-pointer font-extrabold' /> 
                            : <MdOutlineVideocamOff className='absolute top-10 right-10 text-5xl animate-pulse text-white dark:text-white z-40 cursor-not-allowed font-extrabold'/>}

                        </div>
                        {edit ? <div className="flex">
                            <Link href={`/${card.id}`}><TbEdit className="cursor-pointer text-3xl" /></Link>
                            <MdOutlineDeleteOutline className="cursor-pointer text-3xl" />
                        </div> : null}
                    </>
                ) : <div>No cards at the moment</div>}
            </div>
        </div>
    )
}

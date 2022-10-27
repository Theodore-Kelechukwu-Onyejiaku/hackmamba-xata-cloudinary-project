import { flashcards } from "../assets"
import { FaVideo, FaHeart } from "react-icons/fa"



export default function Cards() {
    return (
        <div className='mx-5 mt-5'>
            <h1 className='dark:text-white my-5'>All Cards</h1>
            <div className='flex flex-col justify-center items-center sm:w-96 md:w-3/4 mx-auto'>
                {flashcards.map((card) =>
                    <div className='my-5 relative bg-slate-100 dark:bg-slate-800 rounded-xl px-8 pt-8 md:p-0 shadow-md'>
                        <figure className="md:flex ">
                            <img className="w-full h-auto md:w-48 md:h-auto rounded md:rounded-none  mx-auto" src={card.image} alt="" width="384" height="512" />
                            <div className="pt-6 md:p-8 md:text-left space-y-4">
                                <p className="text-lg font-medium dark:text-white">
                                    “Tailwind CSS is the only framework that I've seen scale
                                    on large teams. It’s easy to customize, adapts to any design,
                                    and the build size is tiny.”
                                </p>
                                <figcaption className="font-medium">
                                    <div className="text-sky-500 dark:text-sky-400">
                                        What is the name of this bird?
                                    </div>
                                </figcaption>
                            </div>
                        </figure>
                        <div className='mt-8 mb-4 ml-2 flex justify-start items-center space-x-3'><span><FaHeart className='text-red-300' /></span><span>4</span></div>
                        <FaVideo className='absolute top-10 right-10 text-3xl animate-pulse text-white dark:text-white' />
                    </div>
                )}
            </div>
        </div>
    )
}

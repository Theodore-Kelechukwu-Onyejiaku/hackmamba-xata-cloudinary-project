import Link from "next/link"
import { IoIosCreate } from "react-icons/io"
import { FcAbout } from "react-icons/fc"

export default function Header() {
    return (
        <div className="">
            <div className="flex items-center justify-center md:mx-5 py-3">
                <div className="basis-1/3">
                    <span className="text-2xl nd:text-3xl font-thin">HackFlashC</span>
                </div>
                <div className="basis-2/3 flex items-center justify-end">
                    <Link href="/create">
                        <div className="flex items-center justify-around mr-5 cursor-pointer">
                            <span className="">Create</span> <IoIosCreate fill="#2196f3" />
                        </div>
                    </Link>
                    <Link href="/about">
                        <div className="flex items-center justify-around mr-5 cursor-pointer">
                            <span className="cursor-pointer font-thin">About</span>
                            <FcAbout />
                        </div>
                    </Link>
                    <Link href="/login"><span className="bg-color-orange text-white p-2 cursor-pointer">Login</span></Link>
                </div>
            </div>
        </div >
    )
}

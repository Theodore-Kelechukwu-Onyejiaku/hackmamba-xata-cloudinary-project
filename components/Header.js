import Link from "next/link"
import { useSession, signOut } from "next-auth/react"
import { useRouter } from "next/router"
import { RiSunFill, RiMoonFill } from "react-icons/ri"
import { SlArrowDown } from "react-icons/sl"
import { useContext, useState } from "react"
import AppContext from "../utils/AppContext"

export default function Header() {
    const { theme, setTheme, searchValue, setSearchValue } = useContext(AppContext)
    const [toggled, setToggled] = useState(false)
    const router = useRouter()
    const session = useSession()
    const { status, data } = session
    // console.log(data.user.email)
    const handleSignout = () => {
        signOut({ callbackUrl: "/api/auth/signin" })
    }

    return (
        <div className="m-0 fixed border dark:border-none dark:bg-slate-800 bg-white dark:text-white py-3 top-0 w-full z-50">
            <div className="flex items-center justify-center mx-2 md:mx-5 my-3">
                <div className="basis-2/4 flex items-center justify-start p-3">
                    <div className="md:mr-10">
                        <Link href="/"><span className="cursor-pointer text-2xl nd:text-3xl font-thin">HackFlashC</span></Link>
                    </div>
                    <div className="w-full hidden md:block">
                        <input value={searchValue} onChange={(e) => { setSearchValue(e.target.value) }} type="text" className="w-full p-2 border rounded-md text-black dark:placeholder:text-black placeholder:text-color-light" placeholder="Search for flashcard by name" />
                    </div>
                </div>

                <div className="basis-2/4 flex items-center justify-end">
                    {status === "authenticated" ?
                        <>
                            <div onClick={handleSignout} className="cursor-pointer hidden md:block mr-3 md:mr-5">
                                <span className="bg-color-orange text-white p-2 hover:text-gray-400">Logout</span>
                            </div>
                            <div className="hidden md:flex items-center justify-around mr-3 md:mr-5 cursor-pointer">
                                <Link href="/create" className="">
                                    <span className="cursor-pointer hover:text-gray-400">Create</span>
                                </Link>
                            </div>
                            <div className="hidden md:flex items-center justify-around mr-3 md:mr-5 cursor-pointer">
                                <Link href="/my-cards" className="">
                                    <span className="cursor-pointer hover:text-gray-400">My Cards</span>
                                </Link>
                            </div>

                        </>
                        :
                        <Link href="/api/auth/signin">
                            <div className="cursor-pointer block mr-5">
                                <span className="bg-color-orange text-white p-2 hover:text-gray-400">Login</span>
                            </div>
                        </Link>
                    }
                    <div className="hidden md:flex items-center justify-around mr-3 md:mr-5 cursor-pointer">
                        <Link href="/about" className="">
                            <span className="cursor-pointer hover:text-gray-400">About</span>
                        </Link>
                    </div>

                    {theme == "dark" ? <button className="border-none text-2xl outline-none ml-0 mr-3 md:mr-5"><RiSunFill onClick={() => { localStorage.theme = "light"; setTheme("light") }} /></button>
                        : <button className="border-none text-3xl outline-none mr-3 ml-0 md:mr-5"><RiMoonFill onClick={() => { localStorage.theme = 'dark'; setTheme("dark") }} /></button>}
                    {status ?
                        data?.user &&
                        <div className="ml-0 md:ml-5 flex flex-col relative z-50">
                            <div onClick={() => { setToggled(!toggled) }} className="flex w-40 md:w-fit items-center justify-end space-x-4 cursor-pointer md:cursor-default bg-white dark:bg-slate-800   relative z-50 mr-0">
                                <span className="uppercase text-xl block  w-12  h-12 text-center p-2 border rounded-full">
                                    {data?.user?.fullName.split(" ")[0].split("")[0]}
                                </span>
                                <span className={`${toggled ? "rotate-180" : "rotate-0"} transition-all duration-500 md:hidden`}><SlArrowDown /></span>
                            </div>

                            <div className={`${toggled ? "top-12 z-50 bg-white" : "-z-50  border-none"} flex flex-col absolute top-0 w-full dark:bg-slate-800 transition-all duration-500 border border-t-0 dark:border-none md:hidden`}>
                                <Link href="/create"><span onClick={() => { setToggled(!toggled) }} className={`${toggled ? "my-5 left-0" : "h-0 my-0"} relative cursor-pointer hover:text-gray-400 text-center transition-all duration-75`}>Create</span></Link>
                                <Link href="/about"><span onClick={() => { setToggled(!toggled) }} className={`${toggled ? "my-5 left-0" : "h-0 my-0"} relative cursor-pointer hover:text-gray-400 text-center transition-all duration-100`}>About</span></Link>
                                <Link href="/my-cards"><span onClick={() => { setToggled(!toggled) }} className={`${toggled ? "my-5 left-0" : "h-0 my-0"} relative cursor-pointer hover:text-gray-400 text-center transition-all duration-500`}>My Cards</span></Link>
                            </div>

                        </div>
                        : null}
                </div>
            </div>
        </div >
    )
}

import Link from "next/link"
import { useSession, signOut } from "next-auth/react"
import { useRouter } from "next/router"
import { getToken } from "next-auth/jwt"

export default function Header() {
    const router = useRouter()
    const session = useSession()
    console.log(session)
    const { status, data } = session
    // console.log(data.user.email)
    const handleSignOut = () => {
        signOut({ callbackUrl: "/api/auth/signin" })
    }

    return (
        <div className="">
            <div className="flex items-center  md:mx-5 py-3">
                <div className="basis-2/4 flex items-center justify-start">
                    <div className="mr-10">
                        <Link href="/"><span className="cursor-pointer text-2xl nd:text-3xl font-thin">HackFlashC</span></Link>
                    </div>
                    <div className="w-full">
                        <input type="text" className="w-full p-2 border rounded-md" placeholder="Search for flashcard" />
                    </div>
                </div>

                <div className="basis-2/4 flex items-center justify-end">
                    <Link href="/create">
                        <div className="flex items-center justify-around mr-5 cursor-pointer">
                            <span className="">Create</span>
                        </div>
                    </Link>
                    <Link href="/about">
                        <div className="flex items-center justify-around mr-5 cursor-pointer">
                            <span className="cursor-pointer">About</span>
                        </div>
                    </Link>
                    {status === "authenticated" ? <span onClick={handleSignOut} className="underline cursor-pointer">Logout </span> :
                        <Link href="/api/auth/signin">
                            <span className="bg-color-orange text-white p-2 cursor-pointer ">Login</span>
                        </Link>
                    }
                    {status ?
                        data?.user &&
                        <Link href="/dashboard">
                            <div className="ml-5">
                                <span className="uppercase text-xl block  w-12  h-12 text-center p-2 border rounded-full">
                                    {data?.user?.fullName.split(" ")[0].split("")[0]}
                                </span>
                            </div>
                        </Link>
                        : null}
                </div>
            </div>
        </div >
    )
}

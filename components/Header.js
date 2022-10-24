import Link from "next/link"
import { useSession, signOut } from "next-auth/react"

export default function Header() {
    const session = useSession()
    const { status } = session
    console.log(session)

    const handleSignOut = () => {
        signOut()
    }

    return (
        <div className="">
            <div className="flex items-center justify-center md:mx-5 py-3">
                <div className="basis-1/3">
                    <Link href="/"><span className="cursor-pointer text-2xl nd:text-3xl font-thin">HackFlashC</span></Link>
                </div>
                <div className="basis-2/3 flex items-center justify-end">
                    <Link href="/create">
                        <div className="flex items-center justify-around mr-5 cursor-pointer">
                            <span className="">Create</span> 
                        </div>
                    </Link>
                    <Link href="/about">
                        <div className="flex items-center justify-around mr-5 cursor-pointer">
                            <span className="cursor-pointer font-thin">About</span>
                        </div>
                    </Link>
                    {status === "authenticated" ? <span onClick={handleSignOut} className="underline cursor-pointer">Logout </span> :
                        <Link href="/api/auth/signin"><span className="bg-color-orange text-white p-2 cursor-pointer ">Login</span></Link>}
                </div>
            </div>
        </div >
    )
}

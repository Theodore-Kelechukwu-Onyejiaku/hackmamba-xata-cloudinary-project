import { RiGithubLine, RiGoogleLine } from "react-icons/ri"
import Link from "next/link"
export default function Login() {
    return (
        <div>
            <div className='h-screen border flex flex-col justify-center items-center'>
                <form className='w-4/5 sm:w-96 md:lg-1/3 lg:w-1/4'>
                    <h1 className="text-center my-5">Please login </h1>
                    <div>
                        <label>Email</label>
                        <input name='username' className='mt-2 mb-5 block border w-full p-2 rounded-md' />
                    </div>
                    <div>
                        <label>Password</label>
                        <input name="password" className='mt-2 mb-5 block border w-full p-2 rounded-md' />
                    </div>
                </form>
                <div className='w-4/5 sm:w-96 md:lg-1/3 lg:w-1/4'>
                    <h2 className='text-center my-4'>Signin Using</h2>
                    <div className='flex justify-around'>
                        <span className='p-2 bg-[#171515] text-white text-2xl rounded-3xl border basis-1/2 flex items-center justify-center'><RiGithubLine /></span>
                    </div>
                </div>
                <div className="my-4">
                    <p>Don't Have an account? <Link href="/signup"><span className="underline cursor-pointer border-2 border-dashed">Signup</span></Link></p>
                </div>
            </div>
        </div>
    )
}

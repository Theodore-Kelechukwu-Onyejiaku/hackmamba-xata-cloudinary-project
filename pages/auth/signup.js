import { signIn, getCsrfToken, getProviders } from 'next-auth/react'
import { RiGithubLine } from "react-icons/ri"
import Link from "next/link"
import { useState } from 'react'
import { useRouter } from 'next/router';

export default function SignIn({ providers }) {
    const router = useRouter()
    const [userInfo, setUserInfo] = useState({ username: "", fullName: "", email: "", password: "" });
    const [errors, setErrors] = useState({ username: "", fullName: "", email: "", password: "" })

    const handleFormInput = (e) => {
        setErrors(prev => ({ ...prev, [e.target.name]: "" }))
        setUserInfo(prev => ({ ...prev, [e.target.name]: e.target.value }))
    }
    const handleCredentialsSubmit = async (e) => {
        e.preventDefault();

        if (userInfo.username === "") {
            setErrors(prev => ({ ...prev, username: "Please enter username" }))
            return
        }

        if (userInfo.fullName === "") {
            setErrors(prev => ({ ...prev, fullName: "Please enter full name" }))
            return
        }

        if (userInfo.email === "") {
            setErrors(prev => ({ ...prev, email: "Please enter email address" }))
            return
        }
        const emailCorrect = validateEmail(userInfo.email)
        if (!emailCorrect) {
            setErrors(prev => ({ ...prev, email: "Please enter a correct email address" }))
            return
        }

        if (userInfo.password === "") {
            setErrors(prev => ({ ...prev, password: "Please enter password" }))
            return
        }

        const res = await fetch("/api/signup", { method: "POST", body: JSON.stringify({ name: "Kelechukwu", email: "kelechukwu@gmail.com" }) })

    }

    const validateEmail = (email) => {
        let emailRegex = /^(([^<>()[\]\\.,;:\s@"]+(\.[^<>()[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/
        if (email.match(emailRegex)) {
            return true
        } else {
            return false
        }
    }

    const handleGithubSubmit = async () => {
        const res = await signIn("github", { callbackUrl: "/" });
        console.log(res)
    }

    return (
        <div>
            <div className='h-screen border flex flex-col justify-center items-center'>
                <form onSubmit={handleCredentialsSubmit} method="post" className='w-4/5 sm:w-96 md:lg-1/3 lg:w-1/4'>
                    <h1 className="text-center my-5">Please Signup </h1>
                    {JSON.stringify(userInfo, null, 4)}
                    <div>
                        <label htmlFor='username'>Username</label>
                        <input onChange={handleFormInput} name='username' className='mt-2 block border w-full p-2 rounded-md' />
                        {errors.username && <p className='text-red-400'>{errors.username}</p>}
                    </div>
                    <div className='mt-5'>
                        <label htmlFor='fullName'>Full Name</label>
                        <input onChange={handleFormInput} name='fullName' className='mt-2 block border w-full p-2 rounded-md' />
                        {errors.fullName && <p className='text-red-400'>{errors.fullName}</p>}
                    </div>
                    <div className='mt-5'>
                        <label htmlFor='email'>Email</label>
                        <input onChange={handleFormInput} name='email' className='mt-2 block border w-full p-2 rounded-md' />
                        {errors.email && <p className='text-red-400'>{errors.email}</p>}
                    </div>
                    <div className='mt-5'>
                        <label htmlFor='password'>Password</label>
                        <input onChange={handleFormInput} name="password" type="password" className='mt-2block border w-full p-2 rounded-md' />
                        {errors.password && <p className='text-red-400'>{errors.password}</p>}
                    </div>
                    <button type="submit" className='bg-black text-white p-2 rounded-md mt-5'>Sign up</button>
                </form>
                <div className='w-4/5 sm:w-96 md:lg-1/3 lg:w-1/4 mt-5'>

                    {providers &&
                        <div className='w-full' key="github">
                            <h2 className='text-center my-4' >
                                Signup using Github
                            </h2>
                            <div className=''>
                                <div className='flex justify-around'>
                                    <span onClick={handleGithubSubmit} className='cursor-pointer p-2 bg-[#171515] text-white text-2xl rounded-3xl border basis-1/2 flex items-center justify-center'><RiGithubLine /></span>
                                </div>
                            </div>
                        </div>
                    }
                </div>

                <div className="my-4">
                    <p>Already Have an account? <Link href="/auth/signin"><span className="underline cursor-pointer border-2 border-dashed">Login</span></Link></p>
                </div>
            </div>
        </div>
    )
}

export async function getServerSideProps(context) {
    const providers = await getProviders()
    return {
        props: {
            providers,
        },
    }
}
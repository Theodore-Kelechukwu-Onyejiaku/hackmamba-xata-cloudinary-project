import { signIn, getCsrfToken, getProviders } from 'next-auth/react'
import { RiGithubLine } from "react-icons/ri"
import Link from "next/link"
import { useState } from 'react'
import { useRouter } from 'next/router';
import Loading from '../../components/Loading';


export default function SignIn({ csrfToken, providers }) {
    const router = useRouter()
    const [loading, setLoading] = useState(false)
    const [signinError, setSigninError] = useState("")
    const [userInfo, setUserInfo] = useState({ email: "", password: "" });
    const [errors, setErrors] = useState({ email: "", password: "" })

    const handleFormInput = (e) => {
        setSigninError("")
        setErrors(prev => ({ ...prev, [e.target.name]: "" }))
        setUserInfo(prev => ({ ...prev, [e.target.name]: e.target.value }))
    }
    const handleCredentialsSubmit = async (e) => {
        e.preventDefault();
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

        setLoading(true)
        const res = await signIn("credentials", { password: userInfo.password, email: userInfo.email, redirect: false })
        if (res.status !== 200) {
            setSigninError(res.error);
            setLoading(false)
            return
        }
        setLoading(false)
        alert("Signin successful!")
        router.push("/")
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
    }

    return (
        <div>
            <div className='h-screen border flex flex-col justify-center items-center'>
                <form onSubmit={handleCredentialsSubmit} method="post" action="/api/auth/callback/credentials" className='w-4/5 sm:w-96 md:lg-1/3 lg:w-1/4'>
                    <input name="csrfToken" type="hidden" defaultValue={csrfToken} />
                    <h1 className="text-center my-5">Please login </h1>
                    {signinError && <p className='text-red-400'>{signinError}</p>}
                    <div>
                        <label>Email</label>
                        <input onChange={handleFormInput} name='email' className='mt-2 block border w-full p-2 rounded-md' />
                        {errors.email && <p className='text-red-400'>{errors.email}</p>}
                    </div>
                    <div className='mt-5'>
                        <label>Password</label>
                        <input onChange={handleFormInput} name="password" type="password" className='mt-2block border w-full p-2 rounded-md' />
                        {errors.password && <p className='text-red-400'>{errors.password}</p>}
                    </div>
                    {loading ? <Loading /> : <button type="submit" className='bg-black text-white p-2 rounded-md mt-5 w-20'>Sign in</button>}
                </form>
                <div className='w-4/5 sm:w-96 md:lg-1/3 lg:w-1/4 mt-5'>
                    {providers &&
                        <div className='w-full' key="github">
                            <h2 className='text-center my-4' >
                                Sign in with
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
                    <p>Don&apos;t Have an account? </p>
                    <Link href="/auth/signup"><span className="underline cursor-pointer border-2 border-dashed">Signup</span></Link>
                </div>
            </div>
        </div>
    )
}

export async function getServerSideProps(context) {
    const providers = await getProviders()
    const csrfToken = await getCsrfToken(context)
    return {
        props: {
            providers,
            csrfToken
        },
    }
}
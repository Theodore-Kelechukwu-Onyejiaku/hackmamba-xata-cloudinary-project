import Link from 'next/link'

export default function LoginToContinue() {
    return (
        <div>
            <div className='h-screen border flex flex-col justify-center gap-4 items-center'>
                <p className='text-slate-300 text-3xl'>Ooops</p>
                <p className='text-red-300'>Please login to continue</p>
                <Link href="/api/auth/signin"><span className='underline'>Login to continue</span></Link>
            </div>
        </div>
    )
}

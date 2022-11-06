import Link from 'next/link';
import { useSession, signOut } from 'next-auth/react';
import { SlArrowDown, SlLogout, SlUser } from 'react-icons/sl';
import { useContext, useEffect, useState } from 'react';
import { useRouter } from 'next/router';
import AppContext from '../utils/AppContext';

export default function Header() {
  const { searchValue, setSearchValue, profilePicture } = useContext(AppContext);
  const [toggled, setToggled] = useState(false);
  const [userProfile, setUserProfile] = useState('');
  const session = useSession();
  const router = useRouter();

  const { status, data } = session;
  const handleSignout = () => {
    signOut({ callbackUrl: '/api/auth/signin' });
  };

  const fetchUserProfile = async () => {
    const user = await fetch(`/api/fetch-user-profile?userId=${data?.user?.id}`);
    const response = await user.json();
    setUserProfile(response?.profilePicture);
  };

  useEffect(() => {
    fetchUserProfile();
  });

  return (
    <div className="m-0 fixed border dark:border-none dark:bg-slate-800 bg-white dark:text-white py-3 top-0 w-full z-50">
      <div className="flex items-center justify-center mx-2 md:mx-5 my-3">
        <div className="basis-2/4 flex items-center justify-start p-3">
          <div className="md:mr-10">
            <Link href="/"><span className="cursor-pointer text-2xl nd:text-3xl font-thin">HackFlashC</span></Link>
          </div>
          <div className="w-full hidden md:block">
            <input value={searchValue} onChange={(e) => { setSearchValue(e.target.value); }} type="text" className="w-full p-2 border rounded-md text-black dark:placeholder:text-black placeholder:text-color-light" placeholder="Search for flashcard by name or category" />
          </div>
        </div>

        <div className="basis-2/4 flex items-center justify-end">
          {status === 'authenticated' ? (
            <>
              <div onClick={handleSignout} className="cursor-pointer hidden md:block mr-3 md:mr-5">
                <span className="bg-color-orange text-white p-2 hover:text-gray-400">Logout</span>
              </div>
              <div className="hidden md:flex items-center justify-around mr-3 md:mr-5 cursor-pointer">
                <Link href="/create">
                  <span className={`${router.pathname === '/create' ? 'border-b-4 ' : ''}cursor-pointer hover:text-gray-400`}>Create</span>
                </Link>
              </div>
              <div className="hidden md:flex items-center justify-around mr-3 md:mr-5 cursor-pointer">
                <Link href="/my-cards" className="">
                  <span className={`${router.pathname === '/my-cards' ? 'border-b-4 ' : ''}cursor-pointer hover:text-gray-400`}>My Cards</span>
                </Link>
              </div>
              <div className="hidden md:flex items-center justify-around mr-3 md:mr-5 cursor-pointer">
                <Link href="/my-collections" className="">
                  <span className={`${router.pathname === '/my-collections' ? 'border-b-4 ' : ''}cursor-pointer hover:text-gray-400`}>My Collections</span>
                </Link>
              </div>
            </>
          )
            : (
              <div className="flex flex-row">
                <Link href="/api/auth/signin">
                  <div className="cursor-pointer block mr-5">
                    <span className="bg-color-orange text-white p-2 hover:text-gray-400">Login</span>
                  </div>
                </Link>
                <Link href="/about" className="">
                  <span className={`${router.pathname === '/about' ? 'border-b-4 ' : ''}md:hidden cursor-pointer hover:text-gray-400 mr-5`}>About</span>
                </Link>
              </div>
            )}
          <div className="hidden md:flex items-center justify-around mr-3 md:mr-5 cursor-pointer">
            <Link href="/about" className="">
              <span className={`${router.pathname === '/about' ? 'border-b-4 ' : ''}cursor-pointer hover:text-gray-400`}>About</span>
            </Link>
          </div>

          {status
            ? data?.user
            && (
              <div className="ml-0 md:ml-5 flex flex-col relative z-50">
                <div onClick={() => { setToggled(!toggled); }} className="flex w-40 md:w-fit items-center justify-end space-x-4 cursor-pointer md:cursor-default bg-white dark:bg-slate-800   relative z-50 mr-0">
                  {userProfile ? (
                    <>
                      <Link href="/profile">
                        <img className="w-12 border cursor-pointer hidden md:block rounded-full h-12" alt="profile" src={userProfile} />
                      </Link>
                      <img className="w-12 border block md:hidden rounded-full h-12" alt="profile" src={userProfile} />
                    </>
                  )
                    : (
                      <>
                        <span className="uppercase md:hidden text-xl block  w-12  h-12 text-center p-2 border rounded-full">
                          {data?.user?.fullName[0]}
                        </span>
                        <Link href="/profile">
                          <span className="uppercase hidden text-xl md:block  w-12  h-12 text-center p-2 border rounded-full">
                            {data?.user?.fullName[0]}
                          </span>
                        </Link>
                      </>
                    )}
                  <span className={`${toggled ? 'rotate-180' : 'rotate-0'} transition-all duration-500 md:hidden p-3`}><SlArrowDown /></span>
                </div>

                <div className={`${toggled ? 'top-12 z-50 bg-white' : '-z-50 top-0 border-none'} flex flex-col absolute -z-50 -right-2 top-0 w-full  dark:bg-slate-800 transition-all duration-500 border border-t-0 dark:border-none md:hidden`}>
                  <Link href="/profile">
                    <p onClick={() => { setToggled(!toggled); }} className={`${toggled ? 'my-5 left-0' : 'h-0 my-0 top-5'} ${router.pathname === '/profile' ? 'border-l-8 border-r-8' : ''} relative cursor-pointer hover:text-gray-400 text-center flex items-center justify-center transition-all duration-150`}>
                      <SlUser size={24} className="border rounded-full p-1" />
                      <span className="ml-3">Profile</span>
                    </p>
                  </Link>
                  <Link href="/create"><span onClick={() => { setToggled(!toggled); }} className={`${toggled ? 'my-5 left-0' : 'h-0 my-0'} ${router.pathname === '/create' ? 'border-l-8 border-r-8' : ''} relative cursor-pointer hover:text-gray-400 text-center transition-all duration-300`}>Create</span></Link>
                  <Link href="/about"><span onClick={() => { setToggled(!toggled); }} className={`${toggled ? 'my-5 left-0' : 'h-0 my-0'} ${router.pathname === '/about' ? 'border-l-8 border-r-8' : ''} relative cursor-pointer hover:text-gray-400 text-center transition-all duration-500`}>About</span></Link>
                  <Link href="/my-cards"><span onClick={() => { setToggled(!toggled); }} className={`${toggled ? 'my-5 left-0' : 'h-0 my-0'} ${router.pathname === '/my-cards' ? 'border-l-8 border-r-8' : ''} relative cursor-pointer hover:text-gray-400 text-center transition-all duration-700`}>My Cards</span></Link>
                  <Link href="/my-collections"><span onClick={() => { setToggled(!toggled); }} className={`${toggled ? 'my-5 left-0' : 'h-0 my-0'} ${router.pathname === '/my-collections' ? 'border-l-8 border-r-8' : ''} relative cursor-pointer hover:text-gray-400 text-center transition-all duration-700`}>My Collections</span></Link>
                  <p onClick={handleSignout} className="flex items-center justify-center cursor-pointer text-color-orange text-center p-2 hover:text-gray-400">
                    <SlLogout />
                    <span className="ml-4">Logout</span>
                  </p>
                </div>
              </div>
            )
            : null}
        </div>
      </div>
    </div>
  );
}

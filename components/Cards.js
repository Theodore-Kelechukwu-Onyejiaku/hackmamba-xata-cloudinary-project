import { useEffect, useState, useContext } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/router';
import { useSession } from 'next-auth/react';
import { FaVideo } from 'react-icons/fa';
import {
  MdOutlineClear, MdOutlineVideocamOff, MdOutlineDeleteOutline, MdAdd,
} from 'react-icons/md';
import { BsCheck2Circle } from 'react-icons/bs';
import { TbEdit } from 'react-icons/tb';
import { toast } from 'react-toastify';
import AOS from 'aos';
import ErrorComponent from './ErrorComponent';
import SkeletonLoader from './SkeletonLoader';
import AppContext from '../utils/AppContext';
import 'aos/dist/aos.css';

// import ReactQuill Editor
const ReactQuill = typeof window === 'object' ? require('react-quill') : () => false;

export default function Cards({ cards, error, edit }) {
  const animations = ['fade-up', 'fade-right', 'flip-left', 'zoom-in-down', 'zoom-in', 'flip-down', 'slide-right', 'zoom-out-right'];
  const { searchValue, setSearchValue } = useContext(AppContext);
  const session = useSession();
  const { data } = session;
  const router = useRouter();
  const [imageOpen, setImageOpen] = useState(false);
  const [videoOpen, setVideoOpen] = useState(false);
  const [imageSource, setImageSource] = useState('');
  const [videoSource, setVideoSource] = useState('');
  const [pageLoading, setPageLoading] = useState(true);

  // adding the flipping effect
  const front = (id) => {
    document.getElementById(id).classList.add('flip');
  };
  const back = (id) => {
    document.getElementById(id).classList.remove('flip');
  };

  // add to collection
  const addToCollection = async (card) => {
    const res = await fetch('/api/collect-card', {
      method: 'PUT',
      body: JSON.stringify({ card }),
      headers: {
        'Content-Type': 'application/json',
      },
    });
    const { error } = await res.json();
    if (error) {
      toast(error, { type: 'error' });
      return;
    }
    toast('Card Added to Collections', { type: 'success' });
    router.replace(router.asPath);
  };

  // like a card
  const handleLikeCard = async (card, id) => {
    const likeButton = document.getElementById(id.toString() + id);
    const numberOfLikes = document.getElementById(id.toString() + id.toString() + id);
    // send request to api/like-card
    const res = await fetch('/api/like-card', {
      method: 'PUT',
      body: JSON.stringify({ card }),
      headers: {
        'Content-Type': 'application/json',
      },
    });

    const { error } = await res.json();
    if (error) {
      toast(error, { type: 'error' });
      return;
    }

    // add like button css effect
    if (likeButton.classList.contains('liked')) {
      likeButton.classList.remove('liked');
      numberOfLikes.innerText = parseInt(numberOfLikes.innerText, 10) - 1;
    } else {
      likeButton.classList.add('liked');
      numberOfLikes.innerText = parseInt(numberOfLikes.innerText, 10) + 1;
    }
  };

  // delete a card by sending request to api/delete-card
  const handleCardDelete = async (card) => {
    const res = await fetch('/api/delete-card', {
      method: 'DELETE',
      body: JSON.stringify(card),
      headers: {
        'Content-Type': 'application/json',
      },
    });
    const { error } = await res.json();
    if (error) {
      toast(error, { type: 'error' });
      return;
    }
    toast('Card deleted successfully!', { type: 'success' });
    router.replace(router.asPath);
  };

  const handleImageOpen = (imgSrc) => {
    setImageSource(imgSrc);
    setImageOpen(true);
  };

  const handleVideoOpen = (vidSrc) => {
    setVideoSource(vidSrc);
    setVideoOpen(true);
  };

  useEffect(() => {
    AOS.init();
    setPageLoading(false);
  }, []);
  if (pageLoading) {
    return <SkeletonLoader />;
  }

  if (error) {
    return <ErrorComponent />;
  }

  return (
    <div className="mx-5 mt-5">
      <div className="w-full md:hidden">
        <input value={searchValue} onChange={(e) => { setSearchValue(e.target.value); }} type="text" className="w-full p-2 border rounded-md text-black dark:placeholder:text-black placeholder:text-color-light" placeholder="Search for flashcard by name or category" />
      </div>
      {imageOpen
        && (
          <div className="h-screen fixed -top-0 bg-black bg-opacity-90 z-50 w-full left-0 mx-0 flex flex-col justify-center items-center p-10">
            <img alt="card" className="w-full md:w-3/4 h-auto md:p-40" src={imageSource} />
            <span className="absolute top-20 text-3xl text-white cursor-pointer md:right-10 md:top-10 md:text-5xl" onClick={() => { setImageOpen(false); }}><MdOutlineClear /></span>
          </div>
        )}
      {videoOpen
        && (
          <div className="h-screen fixed -top-0 bg-black bg-opacity-90 z-50 w-full left-0 mx-0 flex flex-col justify-center items-center p-10">
            <video className="w-full md:w-3/4 h-auto" controls autoPlay>
              <source src={videoSource} type="video/mp4" />
            </video>
            <span className="absolute top-20 text-3xl text-white cursor-pointer md:right-10 sm:top-5 md:top-10 md:text-5xl" onClick={() => { setVideoOpen(false); }}><MdOutlineClear /></span>
          </div>
        )}
      <div className="flex flex-col justify-center items-center sm:w-96 md:w-3/4 mx-auto">
        {cards?.length ? cards.filter((card) => {
          if (searchValue === '') {
            return card;
          } if (card?.name.toLowerCase().includes(searchValue.toLowerCase()) || card.category.includes(searchValue.toLowerCase())) {
            return card;
          }
        })?.map((card) => (
          <>
            <div data-aos={animations[Math.floor(Math.random() * animations.length)]} style={{ background: card.color }} key={card.id} className="my-5 w-full  md:w-full relative dark:bg-slate-800 rounded-xl shadow-2xl pb-10 md:pb-0">
              <figure className="flex  flex-col md:flex-row">
                <div className="md:w-2/4 p-4">
                  <img alt="card" onClick={() => { handleImageOpen(card.image); }} className="md:w-full w-full h-60 md:h-full md:h-2/2 object-contain rounded-xl cursor-pointer" src={card.image} />
                </div>
                <div className="flex md:flex-col md:text-left md:p-0 p-2 md:w-full md:h-1/2">
                  <div className={`${card.color === '#FFFFFF' ? 'text-black ' : 'text-white '} w-full md:pt-0 p-5`}>
                    <figcaption className="font-medium my-5">
                      <div className="text-sky-500 dark:text-sky-400 md:py-0 py-3">
                        {card.name}
                        {' '}
                        -
                        {' '}
                        <span className="text-orange-500 underline">{card.category}</span>
                      </div>
                    </figcaption>
                    <div className="card-container border p-1 overscroll-contain  overflow-y-scroll w-full">
                      <div className="card" id={card.id}>
                        <div className={`${card.color === '#FFFFFF' ? 'text-black ' : 'text-white '} front font-medium overflow-y-scroll text-left`}>
                          <ReactQuill
                            className="overflow-y-scroll"
                            readOnly
                            theme="bubble"
                            value={card.front}
                          />

                        </div>
                        <div className={`${card.color === '#FFFFFF' ? 'text-black ' : 'text-white '} back font-medium text-left overflow-y-scroll`}>
                          {/* {card.back} */}
                          <ReactQuill
                            className="overflow-y-scroll"
                            value={card.back}
                            readOnly
                            theme="bubble"
                          />
                        </div>
                      </div>
                    </div>
                    <div>
                      <div className="flex items-center justify-between w-full">
                        <div className="flex items-center">
                          {card?.user?.profilePicture ? <img alt="profile" className="h-10 w-10 rounded-full" src={card?.user?.profilePicture} /> : (
                            <span className="uppercase text-xl block  w-12  h-12 text-center p-2 border rounded-full">
                              {card?.user?.fullName[0]}
                            </span>
                          )}
                          <p className="text-sm my-5 ml-3">{card?.user?.fullName}</p>
                        </div>
                        <div className="relative">
                          <div><span id={card.id.toString() + card.id} onClick={() => { handleLikeCard(card, card.id); }} className={`${card.likes.includes(data?.user?.id) ? ' liked ' : ' '} border heart-icon outline-none border-none block`} /></div>
                          <div className=" absolute right-5 bottom-0">
                            <span id={card.id.toString() + card.id + card.id} className="">{card.likes.length}</span>
                          </div>
                        </div>
                      </div>
                      <div className="p-2 md:flex space-x-5 hidden">
                        <div>
                          <button type="button" onClick={() => { back(card.id); }} className="p-2 bg-black border text-white rounded-md">Front</button>
                          <button type="button" onClick={() => { front(card.id); }} className="p-2 bg-black border text-white rounded-md">Back</button>
                        </div>
                        <div className={`${card.color === '#FFFFFF' ? 'text-black ' : 'text-white '} flex flex-row ml-5 items-center justify-start pr-5`}>
                          {card?.collectors?.includes(data?.user?.id) || card?.user?.id === data?.user?.id ? <BsCheck2Circle className="text-4xl mr-4" /> : <MdAdd className="text-4xl mr-4 cursor-pointer" onClick={() => { addToCollection(card); }} />}
                          {card.video ? <FaVideo onClick={() => { handleVideoOpen(card.video); }} className={`${card.color === '#FFFFFF' ? 'text-black dark:text-black' : 'text-white dark:text-white'} text-4xl animate-pulse  z-40 cursor-pointer font-extrabold`} />
                            : <MdOutlineVideocamOff className={`${card.color === '#FFFFFF' ? 'text-black' : 'text-white'} text-4xl animate-pulse text-white z-40 cursor-not-allowed font-extrabold`} />}
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
                <div className="ml-5 flex items-center md:space-x-5 md:hidden">
                  <div>
                    <button type="button" onClick={() => { back(card.id); }} className="p-3 bg-black rounded-md text-white border">Front</button>
                    <button type="button" onClick={() => { front(card.id); }} className="p-3 bg-black rounded-md text-white border">Back</button>
                  </div>
                  <div className={`${card.color === '#FFFFFF' ? 'text-black ' : 'text-white '} flex ml-5   pr-5`}>
                    {card?.collectors?.includes(data?.user?.id) ? <BsCheck2Circle className="text-4xl mr-4" /> : <MdAdd className="text-4xl mr-4 cursor-pointer" onClick={() => { addToCollection(card); }} />}
                    {card.video ? <FaVideo onClick={() => { handleVideoOpen(card.video); }} className={`${card.color === '#FFFFFF' ? 'text-black dark:text-black' : 'text-white dark:text-white'} text-4xl animate-pulse  z-40 cursor-pointer font-extrabold`} />
                      : <MdOutlineVideocamOff className={`${card.color === '#FFFFFF' ? 'text-black' : 'text-white'} text-4xl animate-pulse text-white z-40 cursor-not-allowed font-extrabold`} />}
                  </div>
                </div>
              </figure>
            </div>
            {edit ? (
              <div className="flex space-x-10 mb-20">
                <Link href={`/${card.id}`}><TbEdit className="cursor-pointer text-3xl" /></Link>
                <MdOutlineDeleteOutline onClick={() => { handleCardDelete(card); }} className="cursor-pointer text-3xl text-red-700" />
              </div>
            ) : null}
          </>
        )) : <div className="dark:text-white text-red-500">No cards at the moment</div>}
      </div>
    </div>
  );
}

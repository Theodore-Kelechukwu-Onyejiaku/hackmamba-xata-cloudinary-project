import { useState, useContext, useEffect } from 'react';
import { useRouter } from 'next/router';
import { getToken } from 'next-auth/jwt';
import { FaEye, FaUser } from 'react-icons/fa';
import { toast } from 'react-toastify';
import Link from 'next/link';
import { includes } from '@xata.io/client';
import { getXataClient } from '../utils/xata';
import ErrorComponent from '../components/ErrorComponent';
import SkeletonLoader from '../components/SkeletonLoader';
import Loading from '../components/Loading';
import AppContext from '../utils/AppContext';

export default function profile({
  error, user, cards, collections,
}) {
  const router = useRouter();
  const { setProfilePicture } = useContext(AppContext);
  const [componentLoading, setComponentLoading] = useState(true);
  const [imageUploading, setImageUploading] = useState(false);
  const [newImage, setNewImage] = useState();
  useEffect(() => {
    setComponentLoading(false);
  }, []);

  if (componentLoading) {
    return <SkeletonLoader />;
  }
  if (error) {
    return <ErrorComponent />;
  }
  const handleSelectImage = (e) => {
    const file = e.target.files[0];
    if (file.size > 5000000) {
      toast('Please select file size less or equal to 5MB', { type: 'error' });
      return;
    }

    setNewImage(e.target.files[0]);
  };
  const handleImageChange = async () => {
    if (!newImage) return;
    setImageUploading(true);
    const formData = new FormData();
    formData.append('image', newImage);
    formData.append('imageId', user.profilePictureId);
    formData.append('userId', user.id);
    setImageUploading(true);
    const res = await fetch('/api/update-profile-picture', {
      method: 'POST',
      body: formData,
    });
    const { error, data } = await res.json();
    if (error) {
      toast(error, { type: 'error' });
      setImageUploading(false);
    } else {
      setProfilePicture(data.profilePicture);
      setImageUploading(false);
      router.replace(router.asPath);
    }
  };

  return (
    <div className="dark:bg-black dark:text-white">
      <div className="mx-5">
        <h1 className="my-5 text-3xl">
          Welcome,
          {' '}
          {' '}
          {user.fullName}
        </h1>
        <div>
          <h1 className="my-5">Your Profile Picture</h1>
          <div className="my-5">
            {user.profilePicture ? <img alt="profile" className="w-36 h-36 rounded-full my-5" src={user.profilePicture} />
              : <FaUser size={100} className="my-5 border p-5" />}
            <div className="my-5">
              <label>Replace Image </label>
              <input type="file" onChange={handleSelectImage} name="image" className="my-5 block" />
              {imageUploading ? <Loading /> : <button type="button" onClick={handleImageChange} className="border p-2 bg-black text-white rounded">Change</button>}
            </div>
          </div>
        </div>
        <div className="flex flex-col mb-20 pb-20 md:mb-0 md:space-y-0 space-y-5 md:flex-row items-center md:space-x-5 justify-center">
          <div className="p-20 shadow-lg rounded-md w-96 flex flex-col justify-center items-center text-center border">
            <span>Number of cards</span>
            <span className="text-4xl">{cards.length}</span>
            <Link href="/my-cards"><FaEye className="text-3xl hover:cursor-pointer" /></Link>
          </div>
          <div className="p-20 shadow-lg rounded-md w-96 flex flex-col justify-center items-center text-center border">
            <span>Number of Collections</span>
            <span className="text-4xl">
              {collections.length}
            </span>
            <Link href="/my-collections"><FaEye className="text-3xl hover:cursor-pointer" /></Link>
          </div>
        </div>
      </div>
    </div>
  );
}

export const getServerSideProps = async ({ req }) => {
  const token = await getToken({ req });
  if (!token) {
    return {
      props: {
        error: 'You are not signed in', data: null,
      },
    };
  }
  try {
    const xata = getXataClient();
    const [user, cards, collections] = await Promise.allSettled(
      [xata.db.Users.read(token.user.id), xata.db.Cards.filter('user.id', token.user.id)
        .select(['*', 'user.*'])
        .getAll(),
      xata.db.Cards.filter(
        'collectors',
        includes(token.user.id),
      )
        .select(['*', 'user.*'])
        .getAll(),
      ],
    );
    return {
      props: {
        error: null, user: user.value, cards: cards.value, collections: collections.value,
      },
    };
  } catch (error) {
    return { props: { error: error.message, data: null } };
  }
};

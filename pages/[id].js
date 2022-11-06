import React, { useState, useEffect } from 'react';
import { useSession } from 'next-auth/react';
import { useRouter } from 'next/router';
import { toast } from 'react-toastify';
import { getXataClient } from '../utils/xata';
import SkeletonLoader from '../components/SkeletonLoader';
import 'react-quill/dist/quill.snow.css';
import 'react-quill/dist/quill.bubble.css';
import { modules, formats } from '../utils/editor';
import ErrorComponent from '../components/ErrorComponent';
import Loading from '../components/Loading';
import ProcessIndicator from '../components/ProcessIndicator';
import { validateSize } from '../utils/fileValidation';

const ReactQuill = typeof window === 'object' ? require('react-quill') : () => false;

export default function Card({ card, error }) {
  const router = useRouter();
  const session = useSession();
  const { data } = session;
  const [back, setBack] = useState(card?.back);
  const [category, setCategory] = useState(card?.categoruy);
  const [front, setFront] = useState(card?.front);
  const [cardName, setCardName] = useState(card?.name);
  const [newImage, setNewImage] = useState(null);
  const [newVideo, setNewVideo] = useState(null);
  const [imageError, setImageError] = useState('');
  const [videoError, setVideoError] = useState('');
  const [frontBackLoading, setFrontBackLoading] = useState(false);
  const [fileUploading, setFileUploading] = useState(false);
  const [componentLoading, setComponentLoading] = useState(true);

  const handleFrontBackUpdate = async () => {
    setFrontBackLoading(true);
    const res = await fetch('/api/update-card-body', {
      method: 'POST',
      body: JSON.stringify({
        front, back, cardName, card, category,
      }),
      headers: {
        'Content-Type': 'application/json',
      },
    });
    const { error } = await res.json();
    if (error) {
      toast(error, { type: 'error' });
      setFrontBackLoading(false);
      return;
    }
    toast('Front and Back Updated Successfully!', { type: 'success' });
    setFrontBackLoading(false);
    router.push('/my-cards');
  };

  const handleImageUpdate = async () => {
    if (!newImage) return;
    setFileUploading(true);
    const formData = new FormData();
    formData.append('image', newImage);
    formData.append('cardId', card.id);
    formData.append('imageId', card.image_id);
    formData.append('imageSignature', card.image_signature);
    formData.append('userId', card?.user.id);
    const res = await fetch('/api/update-card-image', {
      method: 'POST',
      body: formData,
    });
    const { error } = await res.json();
    if (error) {
      toast('There was an error', { type: 'error' });
      setFileUploading(false);
      return;
    }
    toast('Image Replaced Successfully!', { type: 'success' });
    setFileUploading(false);
    router.push('/my-cards');
  };
  const handleVideoUpdate = async () => {
    if (!newVideo) {
      return;
    }
    setFileUploading(true);
    const formData = new FormData();
    formData.append('video', newVideo);
    formData.append('cardId', card.id);
    formData.append('videoId', card.video_id);
    formData.append('videoSignature', card.video_signature);
    formData.append('userId', card?.user.id);
    const res = await fetch('/api/update-card-video', {
      method: 'POST',
      body: formData,
    });
    const { error } = await res.json();
    if (error) {
      toast('There was an error', { type: 'error' });
      setFileUploading(false);
      return;
    }
    toast('Video Uploaded successfully!', { type: 'success' });
    setFileUploading(false);
    router.push('/my-cards');
  };

  const largeFile = (file) => {
    const isFileLarge = validateSize(file);
    if (isFileLarge) {
      toast('File is too large. Please upload file less than or equal to 5MB', { type: 'error' });
      return true;
    }
    return false;
  };
  const handleImageSelect = async (e) => {
    setImageError('');
    const file = e.target.files[0];
    if (largeFile(file)) {
      setImageError('File is too large. Please upload image file less than or equal to 5MB');
      return;
    }
    setNewImage(e.target.files[0]);
  };

  const handleVideoSelect = async (e) => {
    setVideoError('');
    const file = e.target.files[0];
    if (largeFile(file)) {
      setVideoError('File is too large. Please upload video file less than or equal to 5MB');
    }
    setNewVideo(e.target.files[0]);
  };
  useEffect(() => {
    setComponentLoading(false);
  }, []);

  if (error) {
    return <ErrorComponent />;
  }

  if (componentLoading) {
    return <SkeletonLoader />;
  }

  return (
    <div>
      {/* check if it is current user that owns the card */}
      {data?.user?.id === card?.user?.id ? (
        <div>
          {fileUploading ? <ProcessIndicator /> : (
            <div className="dark:text-white dark:bg-black">
              <div className="mx-5">
                <h1 className="my-5 text-lg font-extrabold">Edit Card</h1>

                <div className="flex flex-col md:flex-row md:space-x-10 md:justify-center md:items-center">
                  <div className="md:basis-1/2  flex flex-col my-10">
                    <span className="font-bold my-5">Card Image</span>
                    <img src={card.image} className="w-full rounded-md" alt={card.name} />
                    <div className="my-3">
                      <label>Replace</label>
                      <input onChange={handleImageSelect} name="newImage" type="file" />
                    </div>
                    {imageError && <p className="text-red-400 my-5">{imageError}</p>}
                    <button type="button" onClick={handleImageUpdate} className="border text-left w-fit p-2 bg-black text-white rounded-md">Replace Image</button>
                  </div>
                  <div className="md:basis-1/2">
                    <h2 className="font-bold my-5">Card Video</h2>
                    {card.video ? (
                      <div className="my-5">
                        <video className="w-full md:w-3/4 h-auto my-5" controls>
                          <source src={card.video} type="video/mp4" />
                        </video>
                        <div className="my-3">
                          <label>Replace</label>
                          <input onChange={handleVideoSelect} name="newVideo" type="file" accept="video/mp4,video/x-m4v,video/*" />
                        </div>
                        {videoError && <p className="text-red-400 my-5">{videoError}</p>}
                        <button type="button" onClick={handleVideoUpdate} className="border text-left w-fit p-2 bg-black text-white rounded-md">Replace Video</button>
                      </div>
                    ) : (
                      <>
                        <div className="my-5 p-5 md:flex md:flex-col md:justify-center md:items-center text-center border-4">
                          <span className="text-red-500">You have no video for this card. Please select a video</span>
                          <input onChange={handleVideoSelect} className="block my-5 m-auto" type="file" accept="video/mp4,video/x-m4v,video/*" />
                        </div>

                        <button type="button" onClick={handleVideoUpdate} className="border text-left w-fit p-2 bg-black text-white rounded-md">Upload</button>
                      </>
                    )}
                  </div>
                </div>

                <div className="my-20">
                  <h2 className="my-5 font-bold">Card Name</h2>
                  <input type="text" value={cardName} onChange={(e) => { setCardName(e.target.value); }} className="w-full border p-2 text-black" />
                </div>
                <div className="dark:tex-white">
                  <h2 className="my-5 font-bold">Card Category</h2>
                  <select className="dark:bg-black" defaultValue={card.category} name="category" onChange={(e) => { setCategory(e.target.value); }}>
                    <option value="">__Select__</option>
                    <option value="programming">Programming</option>
                    <option value="science">Science</option>
                    <option value="art">Art</option>
                    <option value="technology">Technology</option>
                    <option value="technical-writing">Technical Writing</option>
                    <option value="education">Education</option>
                  </select>
                </div>
                <div className="my-20">
                  <h2 className="my-5 font-bold">Card Front</h2>
                  <ReactQuill
                    id="editor"
                    formats={formats}
                    modules={modules}
                    theme="snow"
                    value={front}
                    onChange={setFront}
                    className="w-full h-96 pb-10 dark:text-white"
                  />
                </div>

                <div className="my-10">
                  <h2 className="my-5 font-bold">Card Back</h2>
                  <ReactQuill
                    id="editor"
                    formats={formats}
                    modules={modules}
                    theme="snow"
                    value={back}
                    onChange={setBack}
                    className="w-full h-96 pb-10 dark:text-white"
                  />
                </div>
                {frontBackLoading ? <Loading /> : <button type="button" onClick={handleFrontBackUpdate} className="p-2 bg-black my-5 text-white rounded-md border">Update Front/Back</button>}
              </div>
            </div>
          )}
        </div>
      ) : <div className="h-screen flex items-center justify-center text-red-600">Sorry you don&apos;t have access to this card</div>}
    </div>
  );
}

export async function getServerSideProps(context) {
  const xata = getXataClient();
  const { id } = context.query;
  const card = await xata.db.Cards.filter('id', id).select(['*', 'user.*']).getAll();
  return {
    props: { card: card[0] },
  };
}

// export async function getStaticPaths() {
//   const xata = getXataClient();
//   const cards = await xata.db.Cards.select(['*', 'user.*']).getAll();
//   const paths = cards.map((card) => ({
//     params: { id: card.id },
//   }));
//   return {
//     paths, fallback: true,
//   };
// }

// export async function getStaticProps({ params }) {
//   const xata = getXataClient();
//   try {
//     const cards = await xata.db.Cards.filter('id', params.id).select(['*', 'user.*']).getAll();
//     const card = cards[0];
//     return { props: { error: null, card } };
//   } catch (error) {
//     return { props: { error: error.message, card: null } };
//   }
// }

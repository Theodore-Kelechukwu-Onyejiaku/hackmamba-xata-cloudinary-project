import { useState } from "react";
import { useSession } from "next-auth/react"
import { useRouter } from "next/router";
import LoginToContinue from "../components/LoginToContinue"
import SkeletonLoader from "../components/Skeleton"
import 'react-quill/dist/quill.snow.css';
import 'react-quill/dist/quill.bubble.css'
import { modules, formats } from "../utils/editor";
const ReactQuill = typeof window === 'object' ? require('react-quill') : () => false;
import { isImage, isVideo, validateSize } from "../utils/fileValidation";
import { toast } from 'react-toastify';
import ProcessIndicator from "../components/ProcessIndicator";

export default function create({edit}) {
  const router = useRouter()
  const colors = ["#FFFFFF", "#000000", "#251447", "#870A30"]
  const { data: session, status } = useSession()
  const [imageSrc, setImageSrc] = useState("");
  const [videoSrc, setVideoSrc] = useState("");
  const [image, setImage] = useState()
  const [video, setVideo] = useState()
  const [front, setFront] = useState('');
  const [back, setBack] = useState("");
  const [imageError, setImageError] = useState("")
  const [videoError, setVideoError] = useState("")
  const [cardName, setCardName] = useState("")
  const [cardColor, setCardColor] = useState("#FFFFFF")
  const [loading, setLoading] = useState(false)


  if (status === "loading") {
    return <SkeletonLoader />
  }

  const handleCardName = (e) => {
    setCardName(e.target.value)
  }
  const handleImageChange = (e) => {
    setImageError("")
    let img = e.target.files[0];
    // if no image selected
    if (!img) {
      return
    }

    //check if image
    const result = isImage(img.name)
    if (!result) {
      let error = "File type should be a image"
      toast(error, { type: "error" })
      setImageError(error)
      return
    }
    const isImageLarge = validateSize(img)
    if (isImageLarge) {
      let error = "File must be less or equal to 5MB"
      toast(error, { type: "error" })
      setImageError(error)
      return
    }
    let reader = new FileReader()
    // converts to BASE 64
    reader.readAsDataURL(img)
    reader.addEventListener("load", () => {
      let newImage = new Image();
      newImage.src = reader.result;
      setImageSrc(reader.result)
      setImage(img)
    })
  }

  const handleVideoChange = (e) => {
    setVideoError("")
    let vid = e.target.files[0];
    // if no video selected
    if (!vid) {
      return
    }

    // check if video
    const result = isVideo(vid.name)
    if (!result) {
      let error = "File type should be a video"
      toast(error, { type: "error" })
      setVideoError(error)
      return
    }
    const isFileLarge = validateSize(vid)
    if (isFileLarge) {
      let error = "Video file must be less or equal to 5MB"
      toast(error, { type: "error" })
      setVideoError((error))
      return
    }
    let blobURL = URL.createObjectURL(vid);
    let reader = new FileReader()
    // converts to BASE 64
    reader.readAsDataURL(vid)
    reader.addEventListener("load", () => {
      console.log("I have run oo")
      setVideo("")
      setVideoSrc(reader.result)
      setVideo(vid)
    })
  }

  if (status === "unauthenticated") {
    return <LoginToContinue />
  }

  const handleSubmit = async () => {
    console.log("hi there")
    if (!cardName || !front || !back) {
      toast("Please enter required fields", { type: "error" })
      return
    }
    console.log(video, image)
    setLoading(true)
    let formData = new FormData()
    formData.append("cardName", cardName)
    formData.append("cardColor", cardColor)
    formData.append("front", front)
    formData.append("back", back)
    formData.append("image", image)
    formData.append("video", video)


    const res = await fetch("/api/create-card", {
      method: "POST",
      body: formData
    })
    const { error, data } = await res.json();
    console.log(error, data)
    console.log("hello")
    if (error) {
      toast("There was error", { type: "error" })
      setLoading(false)
      return
    }
    toast("Card created successfully!!!", { type: "success" })
    setLoading(false)
    router.push("/my-cards")
  }

  return (

    <div className=" p-5 dark:bg-black w-full dark:text-white">
      {loading ? <ProcessIndicator /> :
        <div className="">
          <div className="my-5">
            <label>Name of Card<span className="text-red-400">*</span></label>
            <input onChange={handleCardName} value={cardName} className="w-full border p-2 my-5" placeholder="Xata Multiple-Select" />
          </div>
          {/* SELECT CARD COLOR */}
          <div>
            <h1 className="my-5 dark:text-white">Select Card Color<span className="text-red-400">*</span></h1>
            <div className="flex space-x-10 py-5 overflow-x-scroll items-center max-w-5xl justify-between md:justify-start md:space-x-10  dark:text-gray-400">
              {colors.map((color, index) =>
                <span onClick={() => { setCardColor(color) }} key={index} style={{ background: color }} className={`p-10 rounded-md dark:border shadow-xl ${color === cardColor ? "border-4 border-blue-700" : ""}`}></span>
              )}
            </div>
          </div>
          {/* CHOOSE VIDEO OR PICTURE */}

          <div className="my-5">
            <div className="">
              <label>Select Picture (Max 5MB)<span className="text-red-400">*</span></label>
              <p className="my-5 text-red-400">{imageError}</p>
              <input type="file" onChange={handleImageChange} className="block" />
            </div>
            {image && <img src={imageSrc} alt="card image" className="basis-1/2 h-auto w-48 my-5" accept="image/*" />}
          </div>

          <div className="my-5">
            <label>Select Video (Max 5MB)</label>
            <p className="my-5 text-red-400">{videoError}</p>
            <input type="file" onChange={handleVideoChange} className="block my-5" accept="video/mp4,video/x-m4v,video/*" />
            {video && <video src={videoSrc} className="w-48 h-auto" controls>
            </video>}
          </div>

          {/* ENTER CONTENT */}
          <div className="w-full my-5 dark:text-white">
            {/* FRONT */}
            <h1 className="my-5">FRONT<span className="text-red-400">*</span></h1>
            <ReactQuill id="editor" formats={formats} modules={modules} theme="snow" value={front} onChange={setFront} className="w-full h-96 pb-10  dark:text-white" />
          </div>
          <div className="w-full my-10 dark:text-white">
            {/* BACK */}
            <h1 className="my-5">BACK<span className="text-red-400">*</span></h1>
            <ReactQuill id="editor" formats={formats} modules={modules} theme="snow" value={back} onChange={setBack} className="w-full h-96 pb-10 dark:text-white" />
          </div>
          <button onClick={handleSubmit} className="p-2 bg-black text-white my-5 rounded-md">
            Create Flashcard
          </button>

        </div >}
    </div>
  )
}
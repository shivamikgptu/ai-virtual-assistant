import React, { useRef, useContext } from 'react'
import Card from '../components/Card'
import image1 from "../assets/image1.png"
import image2 from "../assets/image2.jpg"
import image3 from "../assets/authBg.png"
import image4 from "../assets/image4.png"
import image5 from "../assets/image5.png"
import image6 from "../assets/image6.jpeg"
import { LuImagePlus } from "react-icons/lu"
import { userDataContext } from '../context/UserContext'
import { useNavigate } from 'react-router-dom'
import { IoArrowBackOutline } from "react-icons/io5"

function Customize() {
  const {
    userData, setUserData,
    backendImage, setBackendImage,
    frontendImage, setFrontendImage,
    selectedImage, setSelectedImage
  } = useContext(userDataContext)

  const navigate = useNavigate()
  const inputImage = useRef()

  const handleImage = (e) => {
    const file = e.target.files[0]
    setBackendImage(file)
    setFrontendImage(URL.createObjectURL(file))
  }

  // Predefined image options
  const predefinedImages = [image1, image2, image3, image4, image5, image6]

  return (
    <div className='w-full h-[100vh] bg-gradient-to-r from-black to-blue-500 flex justify-center items-center flex-col p-[20px] relative'>

      {/* Back to home */}
      <IoArrowBackOutline
        className='absolute cursor-pointer top-[30px] left-[30px] text-white w-[25px] h-[25px]'
        onClick={() => {
          // Ensure userData has what Home route needs
          if (!userData.assistantImage || !userData.assistantName) {
            setUserData({
              ...userData,
              assistantImage: selectedImage === 'input' ? frontendImage : selectedImage,
              assistantName: userData.assistantName || 'Assistant'
            })
          }
          navigate("/", { replace: true })
        }}
      />

      <h1 className='text-white mb-[40px] text-[30px] text-center'>
        Select your <span className='text-blue-500'>Assistant Image</span>
      </h1>

      <div className='w-full max-w-[900px] flex justify-center items-center flex-wrap gap-[15px]'>
        {predefinedImages.map((img, index) => (
          <Card key={index} image={img} />
        ))}

        {/* Upload custom image */}
        <div
          className={`w-[70px] h-[140px] lg:w-[150px] lg:h-[250px] bg-[#0400ff5e] border-2 border-[blue] rounded-2xl
          hover:shadow-2xl hover:shadow-blue-950 hover:border-4 hover:border-white
          overflow-hidden flex items-center justify-center ${
            selectedImage === "input" ? "border-4 border-white shadow-2xl shadow-blue-950" : ""
          }`}
          onClick={() => {
            inputImage.current.click()
            setSelectedImage("input")
          }}
        >
          {!frontendImage && <LuImagePlus className='text-white w-[25px] h-[25px]' />}
          {frontendImage && <img src={frontendImage} className='h-full object-cover' />}
        </div>

        <input type="file" accept="image/*" ref={inputImage} hidden onChange={handleImage} />
      </div>

      {selectedImage && (
        <button
          className='min-w-[150px] cursor-pointer h-[60px] mt-[30px] font-semibold bg-white rounded-full text-[19px]'
          onClick={() => navigate("/customize2")}
        >
          Next
        </button>
      )}
    </div>
  )
}

export default Customize

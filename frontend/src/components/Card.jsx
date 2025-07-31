import React, { useContext } from 'react'
import { userDataContext } from '../context/UserContext'

function Card({image}) {
    const{ serverUrl,userData,setUserData,backendImage,setBackendImage,
      frontendImage,setFrontendImage,selectedImage,setSelectedImage}=useContext(userDataContext)
  return (
    <div className={`w-[70px] h-[140px]  lg:w-[150px] lg:h-[250px] bg-[#0400ff5e] border-2 border-[blue] rounded-2xl
    hover:shadow-2xl hover:shadow-blue-950 hover:border-4 hover:border-white
    overflow-hidden ${selectedImage==image?"border-4 border-white  shadow-2xl shadow-blue-950" :null}`} 
    onClick={()=>{
      setSelectedImage(image)
      setBackendImage(null)
      setFrontendImage(null)
    }}>
    <img src={image} className='h-full object-cover'/>

    </div>
  )
}

export default Card
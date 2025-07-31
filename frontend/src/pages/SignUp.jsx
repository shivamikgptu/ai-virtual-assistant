import React, { useContext, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import bg from "../assets/authBg.png"
import { IoMdEye, IoMdEyeOff } from "react-icons/io";
import axios from "axios"
import { userDataContext } from '../context/userContext';

function SignUp() {
  const [showPassword, setShowPassword] = useState(false)
  const { serverUrl,userData,setUserData } = useContext(userDataContext)
  const navigate = useNavigate()
  const [name, setName] = useState("")
  const [email, setEmail] = useState("")
  const [password, setPassword] = useState("")  
const [err,setErr]=useState("")
  const [loading, setLoading] = useState(false) 

  const handleSignUp=async (e)=>{
    e.preventDefault()
    setErr("")
try{
let result=await axios.post(`${serverUrl}/api/auth/signup`, {
  name,
  email,  
  password
},{withCredentials:true})

setUserData(result.data)
setLoading(false)
navigate("/customize")
}
catch(error){
console.log(error)
setUserData(null)
setLoading(false)
setErr(error.response.data.message)
}
  }


  return (
    <div
      className='w-full h-[100vh] bg-cover flex justify-center items-center'
      style={{ backgroundImage: `url(${bg})` }}
    >
      <form className='w-[90%] h-[600px] max-w-[500px] bg-[#00000066] backdrop-blur shadow-lg shadow-black flex flex-col items-center justify-center gap-[20px] px-[20px]'
       onSubmit={handleSignUp} >
        <h1 className='text-white text-[30px] font-semibold mb-[30px]'>
          Register to <span className='text-blue-400'>Virtual Assistant</span>
        </h1>

        <input
          type="text"
          placeholder="Enter your name"
          className='w-full h-[60px] outline-none border-2 border-white bg-transparent text-white placeholder-gray-300 px-[20px] py-[10px] rounded-full text-[18px]'
          required onChange={(e)=>setName(e.target.value)} value={name}
        />

        <input
          type="email"
          placeholder="Email"
          className='w-full h-[60px] outline-none border-2 border-white bg-transparent text-white placeholder-gray-300 px-[20px] py-[10px] rounded-full text-[18px]'
          required onChange={(e)=>setEmail(e.target.value)} value={email}
        />

        <div className='w-full h-[60px] text-[18px] rounded-full border-2 border-white bg-transparent relative'>
          <input
            type={showPassword ? "text" : "password"}
            placeholder="Password"
            className='w-full h-full outline-none border-none bg-transparent text-white placeholder-gray-300 px-[20px] py-[10px] rounded-full '
            required onChange={(e)=>setPassword(e.target.value)} value={password}
          />
          {showPassword ? (
            <IoMdEyeOff
              className='absolute top-[18px] right-[20px] w-[25px] h-[25px] text-white cursor-pointer'
              onClick={() => setShowPassword(false)}
            />
          ) : (
            <IoMdEye
              className='absolute top-[18px] right-[20px] w-[25px] h-[25px] text-white cursor-pointer'
              onClick={() => setShowPassword(true)}
            />
          )}
        </div>
        {err.length>0 && <p className='text-red-500 text-[17px]'>*{err}</p>}
        <button className='min-w-[150px] h-[60px] mt-[30px] font-semibold bg-white rounded-full text-[19px]' disabled={loading}>{loading?"Loading...":"Sign Up"}</button>

        <p className='text-white text-[18px] cursor-pointer' onClick={()=>navigate("/signin")}>Already have an account ? <span className='text-blue-400'>Sign In</span></p>
      </form>
    </div>
  );
}

export default SignUp
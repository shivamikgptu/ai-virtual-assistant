import React, { useContext, useEffect, useRef, useState } from 'react'
import { userDataContext } from '../context/userContext'
import { useNavigate } from 'react-router-dom'
import axios from 'axios'
import aiImg from "../assets/ai.gif"
import userImg from "../assets/user.gif"
import { IoMdMenu } from "react-icons/io";
import { ImCross } from "react-icons/im";

function Home() {
  const { userData, serverUrl, setUserData, getGeminiResponse } = useContext(userDataContext)
  const navigate = useNavigate()
  const [listening, setListening] = useState(false)
  const [userText, setUserText] = useState("")
  const [aiText, setAiText] = useState("")
  const isSpeakingRef = useRef(false)
  const recognitionRef = useRef(null)
  const [ham, setHam] = useState(false)
  const isRecognizingRef = useRef(false)
  const synth = window.speechSynthesis

  const handleLogout = async () => {
    try {
      const result = await axios.get(`${serverUrl}/api/auth/logout`, { withCredentials: true })
      setUserData(null)
      navigate("/signin")
    }
    catch (error) {
      setUserData(null)
      console.log(error)

    }
  }

  const startRecognition = () => {

    if (!isSpeakingRef.current && !isRecognizingRef.current) {
      try {
        recognitionRef.current?.start();
        console.log("Recognition requested to start");
      }
      catch (error) {
        if (error.name !== "InvalidStateError") {
          console.error("Start error:", error);
        }

      }

    }

  }


  const speak = (text) => {
    const utterence = new SpeechSynthesisUtterance(text)
    utterence.lang = 'hi_IN';
    const voices = window.speechSynthesis.getVoices()
    const hindiVoice = voices.find(v => v.lang === 'hi-IN');
    if (hindiVoice) {
      utterence.voice = hindiVoice;
    }

    isSpeakingRef.current = true
    utterence.onend = () => {
      setAiText("")
      isSpeakingRef.current = false

      setTimeout(() => {
        startRecognition();
      }, 800);

    }
    synth.cancel();
    synth.speak(utterence);

  }
const handleCommand = (data) => {
  const { type, userInput, userinput, response } = data;
  const finalInput = userInput || userinput || "";

  speak(response);

  if (type === 'calculator-open') {
    window.open(`https://www.google.com/search?q=calculator`, '_blank');
  }

  if (type === 'instagram-open') {
    window.open(`https://www.instagram.com/`, '_blank');
  }

  if (type === 'facebook-open') {
    window.open(`https://www.facebook.com`, '_blank');
  }

  if (type === 'weather-show') {
    window.open(`https://www.google.com/search?q=weather`, '_blank');
  }

  if (type === 'youtube-search' || type === 'youtube-play') {
    const query = encodeURIComponent(finalInput);
    window.open(`https://www.youtube.com/results?search_query=${query}`, '_blank');
  }

  if (type === 'google-search') {
    const query = encodeURIComponent(finalInput);
    window.open(`https://www.google.com/search?q=${query}`, '_blank');
  }
};


  useEffect(() => {

    const SpeechRecognition = window.SpeechRecognition || window.webkitSpeechRecognition

    const recognition = new SpeechRecognition()

    recognition.continuous = true;
    recognition.lang = 'en-US';
    recognition.interimResults = false;

    recognitionRef.current = recognition;

    let isMounted = true;

    const startTimeOut = setTimeout(() => {
      if (isMounted && !isSpeakingRef.current && !isRecognizingRef.current) {
        try {
          recognition.start();
          console.log("Recognition requested to start");
        }
        catch (e) {
          if (e.name !== "InvalidStateError") {
            console.error(e);
          }
        }
      }
    }, 1000);

    recognition.onstart = () => {

      isRecognizingRef.current = true;
      setListening(true);
    };


    recognition.onend = () => {
      isRecognizingRef.current = false;
      setListening(false);
      if (isMounted && !isSpeakingRef.current) {
        setTimeout(() => {
          if (isMounted) {
            try {
              recognition.start();
              console.log("Recognition restarted");
            }
            catch (e) {
              if (e.name !== "InvalidStateError")
                console.error(e);
            }

          }


        }, 1000); //delay avoids rapid loop
      }
    };




    recognition.onerror = (event) => {
      console.warn("Recogniton error:", event.error);
      isRecognizingRef.current = false;
      setListening(false);
      if (event.error !== "aborted" && isMounted && !isSpeakingRef.current) {
        setTimeout(() => {
          if (isMounted) {
            try {

              recognition.start();
              console.log("Recognition restarted after error");
            }
            catch (e) {
              if (e.name !== "InvalidStateError")
                console.log(e);

            }
          }

        }, 1000);
      }
    };


    recognition.onresult = async (e) => {
      const transcript = e.results[e.results.length - 1][0].transcript.trim();


      if (transcript.toLowerCase().includes(userData.assistantName.toLowerCase())) {
        setAiText("");
        setUserText(transcript);
        recognition.stop();
        isRecognizingRef.current = false;
        setListening(false);

        const data = await getGeminiResponse(transcript);
        handleCommand(data);
        setAiText(data.response);
        setUserText("");

      }
    };


      const greeting=new SpeechSynthesisUtterance(
        `Hello ${userData.name},
        what can I help you with?`);
       
        window.speechSynthesis.speak(greeting);
    


    return () => {
      isMounted = false;
      clearTimeout(startTimeOut);
      recognition.stop();
      setListening(false);
      isRecognizingRef.current = false;

    };


  }, []);








  
  return (
    <div className='w-full min-h-screen bg-gradient-to-t from-black to-[#02023d] flex flex-col items-center justify-center gap-4 relative'>

      {/* Mobile Menu Button */}
      <IoMdMenu
        className='lg:hidden text-white absolute top-5 right-5 w-6 h-6 z-50 cursor-pointer'
        onClick={() => setHam(true)}
      />

      {/* Top-Right Buttons (Large Screens Only) */}
      <div className='hidden lg:flex gap-4 absolute top-5 right-5 z-40'>
        <button
          className='min-w-[120px] h-[40px] px-4 font-semibold bg-white text-black rounded-full text-sm'
          onClick={handleLogout}
        >
          Log Out
        </button>
        <button
          className='min-w-[180px] h-[40px] px-4 font-semibold bg-white text-black rounded-full text-sm'
          onClick={() => navigate("/customize")}
        >
          Customize your Assistant
        </button>
      </div>

      {/* Sidebar for Mobile */}
      <div
        className={`lg:hidden fixed top-0 right-0 z-50 flex flex-col gap-5 w-full h-full bg-[#00000053] backdrop-blur-lg p-5 items-start transition-transform duration-300 ease-in-out ${ham ? "translate-x-0" : "translate-x-full"}`}
      >
        {/* Cross Icon */}
        <ImCross
          className='text-white absolute top-5 right-5 w-6 h-6 cursor-pointer'
          onClick={() => setHam(false)}
        />

        {/* Mobile Buttons */}
        <button
          className='w-[150px] h-[50px] font-semibold bg-white rounded-full text-[16px]'
          onClick={handleLogout}
        >
          Log Out
        </button>
        <button
          className='w-[200px] h-[50px] font-semibold bg-white rounded-full text-[16px]'
          onClick={() => navigate("/customize")}
        >
          Customize your Assistant
        </button>

        <div className='w-full h-[2px] bg-gray-400' />

        <h1 className='text-white font-semibold text-[19px]'>History</h1>

        <div className='w-full h-[400px] overflow-y-auto flex flex-col gap-3'>
          {userData?.history && userData.history.length > 0 ? (
            userData.history.map((his, index) => (
              <span key={index} className='text-gray-200 text-[16px] truncate'>
                {his}
              </span>
            ))
          ) : (
            <span className='text-gray-400'>No history yet</span>
          )}
        </div>
      </div>

      {/* Assistant Image Box */}
      <div className='w-[300px] h-[400px] flex justify-center items-center overflow-hidden rounded-3xl shadow-lg'>
        <img src={userData?.assistantImage} alt="Assistant" className='h-full object-cover' />
      </div>

      {/* Assistant Name */}
      <h1 className='text-white text-lg font-semibold text-center'>
        I'm {userData?.assistantName}
      </h1>

      {/* Dynamic Image */}
      <img
        src={aiText ? aiImg : userImg}
        alt="Response"
        className='w-[200px]'
      />

      {/* Response Text */}
      {(userText || aiText) && (
        <h1 className='text-white text-[18px] font-semibold text-center px-4'>
          {userText || aiText}
        </h1>
      )}
    </div>
  );
};

export default Home;
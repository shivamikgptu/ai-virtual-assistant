import React, { useEffect, useState, createContext } from 'react';
import axios from 'axios';

// Create Context
export const userDataContext = createContext();

// Context Provider Component
function UserContext({ children }) {
  const serverUrl = "https://ai-virtual-backend.onrender.com";

  const [userData, setUserData] = useState(null);
  const [frontendImage, setFrontendImage] = useState(null);
  const [backendImage, setBackendImage] = useState(null);
  const [selectedImage, setSelectedImage] = useState(null);

  const handleCurrentUser = async () => {
    try {
      const result = await axios.get(`${serverUrl}/api/user/current`, {
        withCredentials: true,
      });
      setUserData(result.data);
      console.log("Current User:", result.data);
    } catch (error) {
      console.error("Error fetching current user:", error.response?.data?.message || error.message);
      setUserData(null); // Reset userData on failure
    }
  };

  const getGeminiResponse=async (command)=>{
    try{

      const result =await axios.post(`${serverUrl}/api/user/asktoassistant`,{command},{withCredentials:true})
   return result.data
    }
    catch(error){
   console.log(error)
    }

  }

  useEffect(() => {
    handleCurrentUser();
  }, []);

  const value = {
    serverUrl,
    userData,
    setUserData,
    frontendImage,
    setFrontendImage,
    backendImage,
    setBackendImage,
    selectedImage,
    setSelectedImage,
    getGeminiResponse
  };

  return (
    <userDataContext.Provider value={value}>
      {children}
    </userDataContext.Provider>
  );
}

export default UserContext;

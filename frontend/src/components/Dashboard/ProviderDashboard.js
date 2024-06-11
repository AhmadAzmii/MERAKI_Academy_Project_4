import axios from 'axios';
import { jwtDecode } from 'jwt-decode';
import React, { useEffect, useState } from 'react'

const ProviderDashboard = () => {
  const token = localStorage.getItem("token")
  const specialist=localStorage.getItem("specialist")
  const [title, setTitle] = useState("")
  const [description, setDescription] = useState("")
  const [message, setMessage] = useState("")
  const [image, setImage] = useState("")
  const [experience, setExperience] = useState("")
  const [availability, setAvailability] = useState("")
  const [userName, setUserName] = useState("")
  
  useEffect(()=>{
    const decodedToken=jwtDecode(token)
    const userId=decodedToken.userId
    setUserName(userName)
    
  },[])

  const handleAddProviderInfo =()=>{
  
    const headers = {
      Authorization: `Bearer ${token}`
    };
    axios.post("http://localhost:5000/providerInfo/",{title,description,availability,experience,specialist},{headers})
  .then((result)=>{
    setMessage(result.data.message)
  })
  .catch((err)=>{
    setMessage(err.response.data.message)
  })
  }
  return (
    <div className='ProviderDashboard'>
     <h2>Add info</h2>
   

     <input type='text' placeholder='Title' value={title} onChange={(e)=>setTitle(e.target.value)}/>
     <input type='text' placeholder='Description' value={description} onChange={(e)=>setDescription(e.target.value)}/>
     <input type='text' placeholder='Experience' value={experience} onChange={(e)=>setExperience(e.target.value)}/>
     <input type='text'placeholder='Availability' value={availability} onChange={(e)=>setAvailability(e.target.value)}/>
     {message && <p>{message}</p>}
     <button onClick={handleAddProviderInfo}>Create New Provider Information</button>
    </div>
  )
};

export default ProviderDashboard

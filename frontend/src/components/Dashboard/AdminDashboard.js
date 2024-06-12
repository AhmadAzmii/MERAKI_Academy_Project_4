import axios from 'axios';
import { jwtDecode } from 'jwt-decode';
import React, { useEffect, useState } from 'react'

const AdminDashboard = () => {
  const token =localStorage.getItem("token")
  const [users, setUsers] = useState([])
  const [userId, setUserId] = useState('');

  useEffect(()=>{
    if (token){
      const decodedToken=jwtDecode(token);
      const userId=decodedToken.userId;
      setUserId(userId)
      getAllUsers()
    }
  },[])
  const getAllUsers= ()=>{
    axios.get("http://localhost:5000/users/")
    .then((result)=>{
    
      setUsers(result.data.Users)
    })
    .catch((err)=>{
      console.log(err);
    })
  }
  return (
    <div className='AdminDashboard'>
     <h2>{users?.map((user)=>(
      <div key={user._id}>
        <h2>{user.userName}</h2>
      </div>
     ))}</h2>
    </div>
  )
};

export default AdminDashboard

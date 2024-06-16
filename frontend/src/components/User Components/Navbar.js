import React, { useContext, useEffect,useState } from 'react'
import { UserContext } from '../../App'
import { useNavigate, Link } from 'react-router-dom'
import "./Navbar.css"
import { jwtDecode } from 'jwt-decode'
import { GoogleLogout } from 'react-google-login'
const clientId = "562371595229-m3ggl0fnth8ngobannl8lpc1461bnmoc.apps.googleusercontent.com";
const Navbar = () => {
    // const token=localStorage.getItem("token")
    const { isLoggedIn, setIsLoggedIn, setToken ,isProvider,token ,isLoggedInWithGoogle,  } = useContext(UserContext)
    const [userName, setUserName] = useState("")
    const [image, setImage] = useState("")
    const navigate = useNavigate()
    
    useEffect(()=>{
        console.log(token)
        if(token){
            const decodedToken=jwtDecode(token)
            const userName=decodedToken.user
            setUserName(userName)
            const image=decodedToken.image
            setImage(image)
        }
    },[token])
    const handleLogout = () => {
        setIsLoggedIn(false)
        setToken("")
        localStorage.clear()
        navigate('/login')
    }
//    const onSuccess =()=>{
//     console.log();
//    }
    return (
        <div className='navbar'>
            {console.log(userName)}
            
            {isLoggedIn && isProvider && <Link to='/dashboard'>Dashboard</Link> }
            {isLoggedIn && isProvider && <Link to='/Provider-Dashboard'>Provider Dashboard</Link>}
            {isLoggedIn && !isLoggedInWithGoogle &&<div> <div><h2>{userName}</h2></div> <div> <button onClick={handleLogout}>Logout</button></div></div>}
           {isLoggedIn && isLoggedInWithGoogle && <div> <div><h2>{userName}</h2><img src={image} alt='Sample'/></div>  <GoogleLogout
            clientId={clientId}
            buttonText={"Logout"}
            onLogoutSuccess={handleLogout}
            />
            </div>}
        </div>
    )
}

export default Navbar

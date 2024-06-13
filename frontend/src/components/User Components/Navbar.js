import React, { useContext, useEffect,useState } from 'react'
import { UserContext } from '../../App'
import { useNavigate, Link } from 'react-router-dom'
import "./Navbar.css"
import { jwtDecode } from 'jwt-decode'

const Navbar = () => {
    const token=localStorage.getItem("token")
    const { isLoggedIn, setIsLoggedIn, setToken,isAdmin ,isProvider } = useContext(UserContext)
    const [userName, setUserName] = useState("")
    const navigate = useNavigate()
    
    useEffect(()=>{
        if(token){
            const decodedToken=jwtDecode(token)
            const userName=decodedToken.user
            setUserName(userName)
            
        }
    },[])
    const handleLogout = () => {
        setIsLoggedIn(false)
        setToken("")
        localStorage.clear()
        navigate('/login')
    }

    return (
        <div className='navbar'>
            {console.log(userName)}
            {!isLoggedIn && <Link to='/login'>Login</Link>}
            {!isLoggedIn && <Link to='/register'>Register</Link>}
            {isLoggedIn && isProvider && <Link to='/dashboard'>Dashboard</Link> }
            {isLoggedIn && isProvider && <Link to='/Provider-Dashboard'>Provider Dashboard</Link>}
            {isLoggedIn && <div> <div><h2>{userName}</h2></div> <div> <button onClick={handleLogout}>Logout</button></div></div>}
        </div>
    )
}

export default Navbar

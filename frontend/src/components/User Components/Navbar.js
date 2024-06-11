import React, { useContext } from 'react'
import { UserContext } from '../../App'
import { useNavigate, Link } from 'react-router-dom'

const Navbar = () => {
    const { isLoggedIn, setIsLoggedIn, setToken,isAdmin ,isProvider } = useContext(UserContext)
    const navigate = useNavigate()

    const handleLogout = () => {
        setIsLoggedIn(false)
        setToken("")
        localStorage.clear()
        navigate('/login')
    }

    return (
        <div className='navbar'>
            {!isLoggedIn && <Link to='/login'>Login</Link>}
            {!isLoggedIn && <Link to='/register'>Register</Link>}
            {isLoggedIn &&!isAdmin && !isProvider && <Link to='/dashboard'>Dashboard</Link>}
            {isLoggedIn && <button onClick={handleLogout}>Logout</button>}
        </div>
    )
}

export default Navbar

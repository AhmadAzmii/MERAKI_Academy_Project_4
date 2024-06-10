import axios from 'axios'
import React, { useContext, useState } from 'react'
import { UserContext } from '../../App'
import { useNavigate } from 'react-router-dom'

function Login() {
    const { setToken, setIsLoggedIn,setIsAdmin  } = useContext(UserContext)
    const [email, setEmail] = useState("")
    const [password, setPassword] = useState("")
    const [message, setMessage] = useState("")
    const navigate = useNavigate()

    const handleLogin = async () => {
      if (email === 'Admin@Yahoo.com' && password === '123456789') {
        setIsLoggedIn(true)
            setIsAdmin(true)
            navigate('/admin-dashboard')
    }else{
        try {
            const result = await axios.post("http://localhost:5000/users/login", { email, password })
            setToken(result.data.token)
            localStorage.setItem('token', result.data.token)
            setMessage(result.data.message)
            setIsLoggedIn(true)
            navigate('/dashboard')
        } catch (err) {
            setMessage(err.response?.data?.message || "Login failed")
        }
    }
  }

    return (
        <div className='login'>
            <h2>Login</h2>
            <input
                className='input-logIn'
                placeholder='Email'
                value={email}
                onChange={(e) => setEmail(e.target.value)}
            />
            <input
                className='input-logIn'
                placeholder='Password'
                type='password'
                value={password}
                onChange={(e) => setPassword(e.target.value)}
            />
            <button className='login-btn' onClick={handleLogin}>
                Login
            </button>
            {message && <p>{message}</p>}
        </div>
    )
}

export default Login

import axios from 'axios'
import React, { useContext, useEffect, useState } from 'react'
import { UserContext } from '../../App'
import { useNavigate } from 'react-router-dom'
import { jwtDecode } from 'jwt-decode';

function Login() {
    const token = localStorage.getItem("token")
    const { setToken, setIsLoggedIn, setIsAdmin } = useContext(UserContext)
    const [specialist, setSpecialist] = useState("")
    const [email, setEmail] = useState("")
    const [password, setPassword] = useState("")
    const [message, setMessage] = useState("")
    const navigate = useNavigate()

    const handleLogin = async () => {
        try {
            const result = await axios.post("http://localhost:5000/users/login", { email, password });
            setToken(result.data.token);
            localStorage.setItem('token', result.data.token);
           
           
            setIsLoggedIn(true);

           
            const decodedToken = jwtDecode(result.data.token);
            console.log(decodedToken);
            const role = decodedToken.role.role;
            localStorage.setItem("specialist",decodedToken.specialist._id)
            console.log("Role from token:", role);
            setSpecialist(role);

            if (role === "serviceProvider") {
                setIsAdmin(false);
                navigate('/Provider-Dashboard');
            } else if (role === "Admin") {
                setIsAdmin(true);
                navigate('/admin-dashboard');
            } else {
                navigate('/dashboard');
            }
        } catch (err) {
            console.error(err);
            setMessage(err.response?.data?.message || "Login failed");
        }
    };

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

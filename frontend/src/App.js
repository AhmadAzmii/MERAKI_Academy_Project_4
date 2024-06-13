import React, { createContext, useContext, useState } from 'react'
import { Routes, Route } from 'react-router-dom'
import "./App.css"
import '@fortawesome/fontawesome-free/css/all.min.css';
import Register from './components/User Components/Register'
import './components/User Components/Register.css'
import { GoogleLogin } from '@react-oauth/google';
import { GoogleOAuthProvider } from '@react-oauth/google';
import Login from './components/User Components/Login'
import UserDashboard from './components/Dashboard/UserDashboard'
import Navbar from './components/User Components/Navbar'
import AdminDashboard from './components/Dashboard/AdminDashboard'
import ProviderDashboard from './components/Dashboard/ProviderDashboard'
import "./components/User Components/Login.css"
export const UserContext = createContext()

const App = () => {
    const [token, setToken] = useState(localStorage.getItem('token') ||null )
    const [isLoggedIn, setIsLoggedIn] = useState(!!token)
    const [isAdmin, setIsAdmin] = useState(false)
    const [isProvider, setIsProvider] = useState(false)
    // const [u, setu] = useState(second)
    return (
        <div className="App">
            <header className="App-header">
                <UserContext.Provider value={{ setToken, token, isLoggedIn, setIsLoggedIn,isAdmin, setIsAdmin,isProvider, setIsProvider}}>
                <GoogleOAuthProvider clientId='562371595229-m3ggl0fnth8ngobannl8lpc1461bnmoc.apps.googleusercontent.com'>
                <GoogleLogin
  onSuccess={credentialResponse => {
    console.log(credentialResponse);
  }}
  onError={() => {
    console.log('Login Failed');
  }}
/>;
                    <Navbar />
                    <Routes>
                        <Route path='/login' element={<Login />} />
                        <Route path='/register' element={<Register />} />
                        <Route path='/dashboard' element={<UserDashboard />} />
                        <Route path='/admin-dashboard' element={<AdminDashboard/>} />
                        <Route path='/Provider-Dashboard' element={<ProviderDashboard/>}/>
                    </Routes>
                    </GoogleOAuthProvider>
                </UserContext.Provider>
            </header>
        </div>
    )
}

export default App

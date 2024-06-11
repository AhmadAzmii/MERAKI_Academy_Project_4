import React, { createContext, useState } from 'react'
import { Routes, Route } from 'react-router-dom'
import "./App.css"
import Register from './components/User Components/Register'
import "./components/User Components/Register.css"
import Login from './components/User Components/Login'
import UserDashboard from './components/Dashboard/UserDashboard'
import Navbar from './components/User Components/Navbar'
import AdminDashboard from './components/Dashboard/AdminDashboard'
import ProviderDashboard from './components/Dashboard/ProviderDashboard'
export const UserContext = createContext()

const App = () => {
    const [token, setToken] = useState(localStorage.getItem('token') || "")
    const [isLoggedIn, setIsLoggedIn] = useState(!!token)
    const [isAdmin, setIsAdmin] = useState(false)
    const [isProvider, setIsProvider] = useState(false)
    return (
        <div className="App">
            <header className="App-header">
                <UserContext.Provider value={{ setToken, token, isLoggedIn, setIsLoggedIn,isAdmin, setIsAdmin,isProvider, setIsProvider}}>
                    <Navbar />
                    <Routes>
                        <Route path='/login' element={<Login />} />
                        <Route path='/register' element={<Register />} />
                        <Route path='/dashboard' element={<UserDashboard />} />
                        <Route path='/admin-dashboard' element={<AdminDashboard/>} />
                        <Route path='/Provider-Dashboard' element={<ProviderDashboard/>}/>
                    </Routes>
                </UserContext.Provider>
            </header>
        </div>
    )
}

export default App

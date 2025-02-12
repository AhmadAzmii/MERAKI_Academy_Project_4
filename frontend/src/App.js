import React, { createContext, useEffect, useState } from 'react';
import { Routes, Route, useLocation, useNavigate } from 'react-router-dom';
import 'bootstrap/dist/css/bootstrap.min.css';
import "./App.css";
import '@fortawesome/fontawesome-free/css/all.min.css';
import Register from './components/User Components/Register';
import './components/User Components/Register.css';
import Login from './components/User Components/Login';
import Navbar from './components/User Components/Navbar';
import "./components/User Components/Login.css";
import "./components/Dashboard/UserSettings.css"
import ForgotPassword from './components/User Components/ForgotPassword';


import UserDashboard from './components/Dashboard/UserDashboard';

import AdminDashboard from './components/Dashboard/AdminDashboard';
import ProviderDashboard from './components/Dashboard/ProviderDashboard';

import { gapi } from 'gapi-script';
import UserSettings from './components/Dashboard/UserSettings';
import CreatePost from './components/Dashboard/CreatePost';
import Message from './components/Dashboard/Message';


export const UserContext = createContext();
const clientId = "562371595229-m3ggl0fnth8ngobannl8lpc1461bnmoc.apps.googleusercontent.com";

const App = () => {
    const [token, setToken] = useState(localStorage.getItem('token') || null);
    const [isLoggedIn, setIsLoggedIn] = useState(!!token);
    const [isAdmin, setIsAdmin] = useState(false);
    const [isProvider, setIsProvider] = useState(false);
    const [isLoggedInWithGoogle, setIsLoggedInWithGoogle] = useState(false);
    const [userName, setUserName] = useState("");
    const [image, setImage] = useState("");
    const navigate = useNavigate();
    const location = useLocation();

    useEffect(() => {
        function start() {
            gapi.client.init({
                clientId: clientId,
                scope: ""
            });
        }
        gapi.load('client:auth2', start);
    }, []);

    const shouldDisplayNavbar = !(location.pathname === '/login' || location.pathname === '/register' || location.pathname === '/admin-dashboard');

    useEffect(() => {
        if (!isLoggedIn && shouldDisplayNavbar && location.pathname !== '/forgot-password') {
            navigate('/dashboard');
        }
    }, [isLoggedIn, navigate, shouldDisplayNavbar, location.pathname]);

    return (
        <div className="App">
            <header className="App-header">
                <UserContext.Provider value={{
                    isLoggedInWithGoogle,
                    setIsLoggedInWithGoogle,
                    setToken,
                    token,
                    isLoggedIn,
                    setIsLoggedIn,
                    isAdmin,
                    setIsAdmin,
                    isProvider,
                    setIsProvider,
                    userName,
                    setUserName,
                    image,
                    setImage
                }}>
                    {shouldDisplayNavbar && <Navbar />}
                    <Routes>
                        <Route path='/' element={<UserDashboard />} />
                        <Route path='/login' element={<Login />} />
                        <Route path='/register' element={<Register />} />
                        <Route path='/dashboard' element={<UserDashboard />} />
                        <Route path='/admin-dashboard' element={<AdminDashboard />} />
                        <Route path='/provider-dashboard' element={<ProviderDashboard />} />
                        <Route path="/user-settings" element={<UserSettings />} />
                        <Route path='/forgot-password' element={<ForgotPassword />} />
                        <Route path='/Create-Post' element={<CreatePost/>}/>
                        <Route path='/message' element={<Message/>} />
                    </Routes>
                </UserContext.Provider>
            </header>
        </div>
    );
}

export default App;
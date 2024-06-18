import React, { useContext, useEffect, useState } from 'react';
import { UserContext } from '../../App';
import { useNavigate, Link } from 'react-router-dom';
import "./Navbar.css";
import { jwtDecode } from 'jwt-decode';
import { GoogleLogout } from 'react-google-login';
import axios from 'axios';

const clientId = "562371595229-m3ggl0fnth8ngobannl8lpc1461bnmoc.apps.googleusercontent.com";

const Navbar = () => {
    const { isLoggedIn, setIsLoggedIn, setToken, isProvider, token, isLoggedInWithGoogle } = useContext(UserContext);
   
    const [userName, setUserName] = useState("");
    const [image, setImage] = useState("");
    const navigate = useNavigate();
    
    useEffect(() => {
        if (token) {
            const decodedToken = jwtDecode(token);
            const userName = decodedToken.user;
            setUserName(userName);
            const userId=decodedToken.userId
            
            axios.get(`http://localhost:5000/users/${userId}`)
            .then((result) => {
                const user = result.data.user;
                
                setImage(user.image);
            })
            .catch((err) => {
                console.error(err);
            });
        }
    }, [token]);
  
    
    const handleLogout = () => {
        setIsLoggedIn(false);
        setToken("");
        localStorage.clear();
        navigate('/login');
    };

    return (
        <div className='navbar'>
            {isLoggedIn && isProvider && <Link to='/dashboard'>Dashboard</Link>}
            {isLoggedIn && isProvider && <Link to='/Provider-Dashboard'>Provider Dashboard</Link>}
            
            <div className="navbar-right">
                {isLoggedIn &&
                    <div>
                        <h2>{userName}</h2>
                        {!isLoggedInWithGoogle ?
                            <button onClick={handleLogout}>Logout</button> :
                            <GoogleLogout
                                clientId={clientId}
                                buttonText={"Logout"}
                                onLogoutSuccess={handleLogout}
                            />
                        }
                    </div>
                }
            </div>
            {isLoggedIn && isLoggedInWithGoogle &&
                <div className="avatar-container">
                    <img className="avatar-image" src={image} alt="Avatar" />
                </div>
            }
        </div>
    );
};

export default Navbar;

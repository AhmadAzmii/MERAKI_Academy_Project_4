import React, { useContext, useEffect, useState } from 'react';
import { UserContext } from '../../App';
import { useNavigate, Link } from 'react-router-dom';
import "./Navbar.css";
import {jwtDecode} from 'jwt-decode';
import { GoogleLogout } from 'react-google-login';

const clientId = "562371595229-m3ggl0fnth8ngobannl8lpc1461bnmoc.apps.googleusercontent.com";

const Navbar = () => {
    const {
        isLoggedInWithGoogle,
        setToken,
        token,
        isLoggedIn,
        setIsLoggedIn,
        isAdmin,
        isProvider,
    } = useContext(UserContext);

    const [userName, setUserName] = useState("");
    const [image, setImage] = useState("");
    const navigate = useNavigate();

    useEffect(() => {
        if (token) {
            const decodedToken = jwtDecode(token);
            const userName = decodedToken.user;
            setUserName(userName);
            
            const firstLetter = userName.charAt(0).toUpperCase();
            const imagePath = require(`../../alphabetImages/${firstLetter}.png`);
            setImage(imagePath);
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
                                render={renderProps => (
                                    <button onClick={renderProps.onClick} className="google-logout-button">
                                        Logout
                                    </button>
                                )}
                            />
                        }
                    </div>
                }
            </div>
            {isLoggedIn &&
                <div className="avatar-container">
                    <Link to="/user-settings">
                        <img className="avatar-image" src={image} alt="Avatar" />
                    </Link>
                </div>
            }
        </div>
    );
};

export default Navbar;

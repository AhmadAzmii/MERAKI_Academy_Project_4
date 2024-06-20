import React, { useContext, useEffect } from 'react';
import { UserContext } from '../../App';
import { useNavigate, Link } from 'react-router-dom';
import { GoogleLogout } from 'react-google-login';
import axios from 'axios';
import "./Navbar.css";
import {jwtDecode} from 'jwt-decode';

const clientId = "562371595229-m3ggl0fnth8ngobannl8lpc1461bnmoc.apps.googleusercontent.com";

const Navbar = () => {
  const {
    isLoggedInWithGoogle,
    setToken,
    token,
    isLoggedIn,
    setIsLoggedIn,
    isProvider,
    setIsProvider,
    userName,
    setUserName,
    image,
    setImage
  } = useContext(UserContext);

  const navigate = useNavigate();

  useEffect(() => {
    if (token) {
      const decodedToken = jwtDecode(token);
      const userId = decodedToken.userId;

      axios.get(`http://localhost:5000/users/${userId}`)
        .then(response => {
          const userImage = response.data.user.image;
          const userName = response.data.user.userName;
          const userSpecialist = response.data.user.specialist;
          
          setUserName(userName);
          setImage(userImage);
          setIsProvider(userSpecialist !== null); // Set isProvider based on the specialist attribute
        })
        .catch(error => {
          console.error('Error fetching user info:', error);
        });
    }
  }, [token, setUserName, setImage, setIsProvider]);

  const getDefaultImage = (name) => {
    const firstLetter = name?.charAt(0)?.toUpperCase();
    if (firstLetter) {
      return require(`../../alphabetImages/${firstLetter}.png`);
    }
  };

  const getImage = (image, name) => {
    return image || getDefaultImage(name);
  };

  const handleLogout = () => {
    setIsLoggedIn(false);
    setToken("");
    localStorage.clear();
    navigate('/login');
  };

  return (
    <div className='navbar'>
      {isLoggedIn && (
        <div className="avatar-container">
          <img className="avatar-image" src={getImage(image, userName)} alt="Avatar" />
        </div>
      )}
      {isLoggedIn && (
        <>
          <Link to='/user-settings'>Settings</Link>
          {isProvider ? (
            <Link to='/provider-dashboard'>Dashboard </Link>
          ) : (
            <Link to='/dashboard'>Dashboard </Link>
          )}
        </>
      )}
      <div className="navbar-right">
        {isLoggedIn && (
          <div className="logout-container">
            <h2>{userName}</h2>
            {!isLoggedInWithGoogle ? (
              <button onClick={handleLogout}>Logout</button>
            ) : (
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
            )}
          </div>
        )}
      </div>
    </div>
  );
};

export default Navbar;

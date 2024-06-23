import React, { useContext, useEffect, useState } from 'react';
import { UserContext } from '../../App';
import { useNavigate, Link } from 'react-router-dom';
import { GoogleLogout } from 'react-google-login';
import axios from 'axios';
import "./Navbar.css";
import { jwtDecode } from 'jwt-decode';
import {

  MDBRow,
  MDBCol,

  MDBBtn,
} from 'mdb-react-ui-kit';

const apiKey = '374f6b9a93c2d20666eb4a186bd0df01';
const clientId = "562371595229-m3ggl0fnth8ngobannl8lpc1461bnmoc.apps.googleusercontent.com";

const Navbar = () => {
  const {
    isAdmin,
    setIsAdmin,
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

  const [weather, setWeather] = useState(null);
  const [search, setSearch] = useState("");
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
          setIsProvider(userSpecialist !== null);
        })
        .catch(error => {
          console.error('Error fetching user info:', error);
        });
    }
  }, [token, setUserName, setImage, setIsProvider]);

  useEffect(() => {
    if (navigator.geolocation) {
      navigator.geolocation.getCurrentPosition(
        (position) => {
          const { latitude, longitude } = position.coords;
          fetchWeather(latitude, longitude);
        },
        (error) => {
          console.error('Error fetching location', error);
        }
      );
    }
  }, []);

  const fetchWeather = async (latitude, longitude) => {
    try {
      const response = await axios.get(`https://api.openweathermap.org/data/2.5/weather?lat=${latitude}&lon=${longitude}&units=metric&appid=${apiKey}`);
      setWeather(response.data);
    } catch (error) {
      console.error('Error fetching weather data:', error);
    }
  };

  const handleSearch = () => {
    if (search) {
      fetchWeatherByCity(search);
    }
  };

  const fetchWeatherByCity = async (city) => {
    try {
      const response = await axios.get(`https://api.openweathermap.org/data/2.5/weather?q=${city}&units=metric&appid=${apiKey}`);
      setWeather(response.data);
    } catch (error) {
      console.error('Error fetching weather data:', error);
    }
  };

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
          {/* {weather && (
            <div className="weather-card">
              <div className="weather-card-header">
                <MDBRow>
                  <MDBCol md="6">
                    <input
                      type='text'
                      className="form-control"
                      placeholder='Enter a City'
                      onChange={(e) => setSearch(e.target.value)}
                    />
                  </MDBCol>
                  <MDBCol md="6">
                    <MDBBtn onClick={handleSearch}>Search</MDBBtn>
                  </MDBCol>
                </MDBRow>
              </div>
              <div className="weather-card-body">
                <div className="weather-location">
                  <h6>{weather.name}</h6>
                  <p>{new Date().toLocaleTimeString()}</p>
                </div>
                <div className="weather-temperature">
                  <h1>{weather.main.temp}°C</h1>
                  <p className="weather-description">{weather.weather[0].description}</p>
                </div>
                <div className="weather-details">
                  <div className="weather-detail">
                    <i className="fas fa-wind fa-fw" style={{ color: "#868B94" }}></i> {weather.wind.speed} km/h
                  </div>
                  <div className="weather-detail">
                    <i className="fas fa-tint fa-fw" style={{ color: "#868B94" }}></i> {weather.main.humidity}%
                  </div>
                  <div className="weather-detail">
                    <i className="fas fa-sun fa-fw" style={{ color: "#868B94" }}></i> {weather.clouds.all}%
                  </div>
                </div>
                <div className="weather-icon">
                  <img src={`https://openweathermap.org/img/wn/${weather.weather[0].icon}.png`} alt="Weather icon" />
                </div>
              </div>
            </div>
          )} */}
          <img className="avatar-image" src={getImage(image, userName)} alt="Avatar" />
        </div>
      )}
       {isLoggedIn && (
  <>
    <Link to='/user-settings'>Settings</Link>
    {isProvider ? (
      <Link to='/provider-dashboard'>Dashboard</Link>
    ) : (
      <Link to='/dashboard'>Dashboard</Link>
    )}
    {isAdmin && (
      <Link to='/admin-dashboard'>Admin Dashboard</Link>
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

import React, { useEffect, useState, useContext } from 'react';
import axios from 'axios';
import "bootstrap/dist/css/bootstrap.min.css";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faRemove, faEdit, faHome, faUser, faCog, faEnvelope } from "@fortawesome/free-solid-svg-icons";
import {jwtDecode} from 'jwt-decode';
import { UserContext } from '../../App';
import StarRating from './StarRating';
import './UserDashboard.css';
import { useNavigate } from 'react-router-dom';
import { formatDistanceToNow } from "date-fns";
import {
  MDBContainer,
  MDBRow,
  MDBCol,
  MDBCard,
  MDBCardBody,
  MDBCardTitle,
  MDBCardText,
  MDBCardSubTitle,
  MDBInput,
  MDBBtn,
} from 'mdb-react-ui-kit';

const apiKey = '374f6b9a93c2d20666eb4a186bd0df01';

const UserDashboard = () => {
  const { token, isLoggedIn, userName, image } = useContext(UserContext);
  const navigate = useNavigate();
  const [providerInfo, setProviderInfo] = useState([]);
  const [userId, setUserId] = useState('');
  const [newReview, setNewReview] = useState({});
  const [rating, setRating] = useState({});
  const [selectedSpecialist, setSelectedSpecialist] = useState('');
  const [showLoginPopup, setShowLoginPopup] = useState(false);
  const [showContactUsPopup, setShowContactUsPopup] = useState(false);
  const [isUpdated, setIsUpdated] = useState(false);
  const [user_id, setUser_id] = useState("");
  const [tokenOne, setTokenOne] = useState("");
  const [socket, setSocket] = useState(null);
  const [isConnected, setIsConnected] = useState(false);
  const [weather, setWeather] = useState(null);
  const [search, setSearch] = useState("");
  const [providerId, setProviderId] = useState('');
  const [providerUserName, setProviderUserName] = useState("");

  useEffect(() => {
    if (token) {
      const decodedToken = jwtDecode(token);
      const userId = decodedToken.userId;
      setUserId(userId);
    }
    getAllProvidersInfo();
  }, [token]);

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

  const getAllProvidersInfo = () => {
    axios
      .get('http://localhost:5000/providerInfo/')
      .then((result) => {
        setProviderInfo(result.data.providersInfo);
      })
      .catch((err) => {
        console.error('Error fetching provider info:', err);
      });
  };

  const handleReview = (postId) => {
    if (!isLoggedIn) {
      setShowLoginPopup(true);
      return;
    }

    const headers = {
      Authorization: `Bearer ${token}`,
    };

    axios
      .post(
        `http://localhost:5000/providerInfo/${postId}/reviews`,
        { review: newReview[postId], rating: rating[postId], customer: userId },
        { headers }
      )
      .then((result) => {
        if (result.status === 201 && result.data.success) {
          console.log("New review added:", result.data.review);
          console.log("Customer object:", result.data.review.customer);

          setProviderInfo((prevInfo) =>
            prevInfo.map((post) =>
              postId === post._id
                ? {
                  ...post,
                  reviews: [
                    ...post.reviews,
                    {
                      ...result.data.review,
                      customer: { ...result.data.review.customer, userName, image, _id: userId },
                    },
                  ],
                }
                : post
            )
          );

          setRating((prev) => ({ ...prev, [postId]: 0 }));
        }
        setNewReview((prev) => ({ ...prev, [postId]: "" }));
      })
      .catch((err) => {
        console.error('Error adding review:', err);
      });
  };
  
  const handleSpecialistChange = (e) => {
    setSelectedSpecialist(e.target.value);
  };
  
 
  const getUniqueSpecialistNames = (providers) => {
    const specialistNames = providers.map((post) => post.specialist.name);
    return [...new Set(specialistNames)];
  };
  const uniqueSpecialists = getUniqueSpecialistNames(providerInfo);
  const getDefaultImage = (name) => {
    const firstLetter = name?.charAt(0)?.toUpperCase();
    if (firstLetter) {
      return require(`../../alphabetImages/${firstLetter}.png`);
    }
  };

  const getImage = (image, name) => {
    return image || getDefaultImage(name);
  };

  const filteredProviderInfo = selectedSpecialist
    ? providerInfo.filter((post) => post.specialist.name === selectedSpecialist)
    : providerInfo;

  const toggleContactUsPopup = () => {
    if (!isLoggedIn) {
      setShowLoginPopup(true);
      return;
    }
    setShowContactUsPopup(!showContactUsPopup);
  };

  const handleDelete = (reviewId) => {
    const headers = {
      Authorization: `Bearer ${token}`,
    };

    axios
      .delete(`http://localhost:5000/providerInfo/${reviewId}/reviews`, { headers })
      .then((result) => {
        if (result.status === 200 && result.data.success) {
          setProviderInfo((prevInfo) =>
            prevInfo.map((post) => ({
              ...post,
              reviews: post.reviews.filter((review) => review._id !== reviewId),
            }))
          );
        }
      })
      .catch((err) => {
        console.error('Error deleting review:', err);
      });
  };

  const handleUpdate = (reviewId, newReview, newRating) => {
    const headers = {
      Authorization: `Bearer ${token}`,
    };

    axios
      .put(
        `http://localhost:5000/providerInfo/${reviewId}/reviews`,
        { review: newReview, rating: newRating },
        { headers }
      )
      .then((result) => {
        if (result.status === 200 && result.data.success) {
          setProviderInfo((prevInfo) =>
            prevInfo.map((post) => ({
              ...post,
              reviews: post.reviews.map((rev) =>
                rev._id === reviewId ? { ...rev, review: newReview, rating: newRating } : rev
              ),
            }))
          );
          setIsUpdated(false);
        }
      })
      .catch((err) => {
        console.error('Error updating review:', err);
      });
  };

  useEffect(() => {
    socket?.on("connect", () => {
      setIsConnected(true);
      console.log("Connected to socket");
    });

    socket?.on("connect_error", (error) => {
      setIsConnected(false);
      console.log(error);
    });

    return () => {
      setIsConnected(false);
      socket?.close();
      socket?.removeAllListeners();
    };
  }, [socket]);

  return (
    <MDBContainer className="UserDashboard">
      <div className="sidebar">
        <h3>Menu</h3>
        <a href="#home"><FontAwesomeIcon icon={faHome} className="me-2" />Home</a>
        <a href="#profile"><FontAwesomeIcon icon={faUser} className="me-2" />Profile</a>
        <a href="#settings"><FontAwesomeIcon icon={faCog} className="me-2" />Settings</a>
        <a href="#messages"><FontAwesomeIcon icon={faEnvelope} className="me-2" />Messages</a>
      </div>
      <MDBRow className="offset-md-3">
        <MDBCol md="12">
          <h2>User Dashboard</h2>
          {weather && (
            <div>
              <h3>Weather Information</h3>
              <p>Temperature: {weather.main.temp}°C</p>
              <p>City: {weather.name}</p>
            </div>
          )}
          <MDBRow>
            <MDBCol size="4" md="6">
              <MDBInput label="Search City" type="text" value={search} onChange={(e) => setSearch(e.target.value)} />
              <MDBBtn onClick={handleSearch}>Search</MDBBtn>
            </MDBCol>
          </MDBRow>
          <MDBRow>
            <MDBCol md="12">
              <select value={selectedSpecialist} onChange={handleSpecialistChange} className="form-control">
                <option value="">All Specialists</option>
                {uniqueSpecialists.map((specialist, index) => (
                  <option key={index} value={specialist}>
                    {specialist}
                  </option>
                ))}
              </select>
            </MDBCol>
          </MDBRow>
          <MDBRow>
            {filteredProviderInfo.map((post, index) => (
              <MDBCol key={index} md="4">
                <MDBCard className="mb-4">
                  <MDBCardBody>
                    <div className="d-flex align-items-center mb-3">
                      <img
                        src={getImage(post.specialist.image, post.specialist.name)}
                        alt={post.specialist.name}
                        className="specialist-img"
                      />
                      <div className="ms-3">
                        <MDBCardTitle>{post.specialist.name}</MDBCardTitle>
                        <MDBCardSubTitle>{post.specialist.category}</MDBCardSubTitle>
                      </div>
                    </div>
                    <MDBCardText>{post.specialist.bio}</MDBCardText>
                    <StarRating
                      rating={rating[post._id]}
                      onRatingChange={(newRating) => setRating({ ...rating, [post._id]: newRating })}
                    />
                    <textarea
                      value={newReview[post._id] || ''}
                      onChange={(e) => setNewReview({ ...newReview, [post._id]: e.target.value })}
                      className="form-control mb-2"
                      rows="2"
                      placeholder="Write a review"
                    ></textarea>
                    <MDBBtn size="sm" onClick={() => handleReview(post._id)}>
                      Submit Review
                    </MDBBtn>
                    <MDBBtn size="sm" className="ms-2" color="danger" onClick={() => handleDelete(post._id)}>
                      <FontAwesomeIcon icon={faRemove} />
                    </MDBBtn>
                    <MDBBtn size="sm" className="ms-2" color="info" onClick={() => handleUpdate(post._id, newReview[post._id], rating[post._id])}>
                      <FontAwesomeIcon icon={faEdit} />
                    </MDBBtn>
                    <div>
                      {post.reviews}
                    </div>
                  </MDBCardBody>
                </MDBCard>
              </MDBCol>
            ))}
          </MDBRow>
        </MDBCol>
      </MDBRow>
    </MDBContainer>
  );
};

export default UserDashboard;

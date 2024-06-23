import React, { useEffect, useState, useContext } from 'react';
import axios from 'axios';
import "bootstrap/dist/css/bootstrap.min.css";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faRemove, faEdit, faHome, faUser, faCog, faEnvelope ,faBars, faTimes,faClipboard} from "@fortawesome/free-solid-svg-icons";
import { jwtDecode } from 'jwt-decode';
import { UserContext } from '../../App';
import StarRating from './StarRating';
import './UserDashboard.css';
import { Link, useNavigate } from 'react-router-dom';
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
import ContactUs from './ContactUs';
import Message from './Message';
import socketInit from '../../socket.server';

const apiKey = '374f6b9a93c2d20666eb4a186bd0df01';

const UserDashboard = () => {
  const { token, isLoggedIn, userName, image } = useContext(UserContext);
  const [sidebarVisible, setSidebarVisible] = useState(true);
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
  const [providerUserName, setProviderUserName] = useState("")

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
 

  const toggleSidebar = () => {
    setSidebarVisible(!sidebarVisible);
  };

  useEffect(() => {
    if (userId && token) {
      setSocket(socketInit({ user_id: userId, token }));
      setIsConnected(true)
    }
  }, [userId, token]);
  return (
    <MDBContainer id='home' className="UserDashboard">
      <FontAwesomeIcon
        icon={sidebarVisible ? faTimes : faBars}
        className="toggle-sidebar-icon"
        onClick={toggleSidebar}
      />
      <div className={`sidebar ${sidebarVisible ? 'sidebar-visible' : ''}`}>
        <div>
          <h3>Menu</h3>
          <a href="#home"><FontAwesomeIcon icon={faHome} className="me-2" />Home</a>
          
          <a ><Link to='/user-settings'><FontAwesomeIcon icon={faCog} className="me-2" />Settings</Link></a>
          <a href="#Posts"><FontAwesomeIcon icon={faClipboard} className="me-2" />Posts</a>
          <a href="#message"><FontAwesomeIcon icon={faEnvelope} className="me-2" />Contact Us</a>
        </div>
        
      </div>
      <MDBRow className={sidebarVisible ? "offset-md-3" : ""}>
        <MDBCol md="12">
          {/* <div>
            <input
              type="text"
              placeholder="user id"
              value={userId}
            />
            <input
              type="text"
              placeholder="token"
              value={token}
            />
            <button onClick={() => setSocket(socketInit({ user_id: userId, token }))}>
              Connect
            </button>
          </div> */}
          {isConnected && <Message socket={socket} providerId={providerId} />}

          <div className="image-container">
            <img
              src="https://media.istockphoto.com/id/1589417945/photo/hand-of-mechanic-holding-car-service-and-checking.webp?b=1&s=170667a&w=0&k=20&c=ve2SFpPfslb8-QEgtqkHPLG4SR15aLlJiaJrqqfa164="
              alt="Background"
              className="dashboard-image"
            />
          </div>
          <MDBRow className="mb-4">
            <MDBCol md="6">
              <select
                className="form-select"
                value={selectedSpecialist}
                onChange={handleSpecialistChange}
              >
                <option value="">All Posts</option>
                {uniqueSpecialists.map((specialistName) => (
                  <option key={specialistName} value={specialistName}>
                    {specialistName}
                  </option>
                ))}
              </select>
            </MDBCol>
          </MDBRow>

          <MDBRow>
            {filteredProviderInfo?.map((post, i) => (
              <MDBCol id='Posts' md="6" key={post._id}>
                <MDBCard className="mb-4">
                  <MDBCardBody className="post">
                    <div className="d-flex align-items-center mb-3">
                      <img
                        src={getImage(post.author.image, post.author.userName)}
                        alt={post.author.userName}
                        onClick={() => {
                          setIsConnected(true)
                          setProviderId(post.author._id);
                          setProviderUserName(post.author.userName)
                          console.log("provider" + post.author._id);
                        }}
                        className="author-image rounded-circle me-3"
                      />
                      <div>
                        <MDBCardTitle className="text-center mb-0">
                          {post.author.userName}
                        </MDBCardTitle>
                        <MDBCardSubTitle className="text-center text-muted">
                          <b> Specialty : {post?.specialist?.name}</b>
                        </MDBCardSubTitle>
                      </div>
                    </div>
                    {post.image && (
                      <div className="post-image-container">
                        <img
                          src={post.image}
                          alt="Provider Post"
                          className="post-image"
                        />
                      </div>
                    )}
                    <MDBCardText className="mt-3">
                      <b>{post.title}</b>
                    </MDBCardText>
                    <MDBCardText>{post.description}</MDBCardText>
                    <ul className="list-group mb-3">
                      <li className="list-group-item">
                        <b>Availability: </b>{post.availability}
                      </li>
                      <li className="list-group-item">
                        <b>Experience:</b> {post.experience}
                      </li>
                    </ul>
                    {post.reviews?.length > 0 && (
                      <div className="reviews-section">
                        <h4>Reviews:</h4>
                        {post.reviews.map((review, i) => (
                          <div key={i} className="review-card">
                            <MDBCardBody>
                              <div key={i} className="review-card">
                                <div className="review-author">
                                  <img
                                    src={getImage(review.customer.image, review.customer.userName)}
                                    alt={review.customer.userName}
                                    className="author-image rounded-circle me-3"
                                  />
                                  <div>
                                    <span className="review-author-name">{review.customer.userName}</span>
                                    <p>{formatDistanceToNow(new Date(review.date))} ago</p>
                                  </div>
                                </div>
                                <div className="review-content">
                                  <p>{review.review}</p>
                                  <StarRating rating={review.rating} postId={post._id} />
                                </div>
                              </div>
                              {isLoggedIn && userId === review.customer._id && (
                                <>
                                  <button
                                    onClick={() => handleDelete(review._id)}
                                    className="btn btn-sm btn-danger"
                                  >
                                    <FontAwesomeIcon icon={faRemove} /> Delete
                                  </button>
                                  <button
                                    onClick={() => setIsUpdated(review._id)}
                                    className="btn btn-sm btn-primary mr-2"
                                  >
                                    <FontAwesomeIcon icon={faEdit} />
                                  </button>
                                  {isUpdated === review._id && (
                                    <div className="update-review-form">
                                      <div className="form-group">
                                        <label>New Review</label>
                                        <MDBInput
                                          value={newReview[review._id] || review.review}
                                          onChange={(e) => setNewReview({ ...newReview, [review._id]: e.target.value })}
                                        />
                                      </div>
                                      <div>
                                        <StarRating
                                          rating={rating[review._id] || review.rating}
                                          setRating={(newRating) => setRating({ ...rating, [review._id]: newRating })}
                                        />
                                      </div>
                                      <button
                                        onClick={() => handleUpdate(review._id, newReview[review._id] || review.review, rating[review._id] || review.rating)}
                                        className="btn btn-sm btn-primary"
                                      >
                                        Save
                                      </button>
                                    </div>
                                  )}
                                </>
                              )}
                            </MDBCardBody>
                          </div>
                        ))}
                      </div>
                    )}
                    <MDBInput
                      value={newReview[post._id] || ""}
                      onChange={(e) => setNewReview({ ...newReview, [post._id]: e.target.value })}
                      placeholder="Write your review..."
                    />
                    <StarRating
                      rating={rating[post._id] || 0}
                      setRating={(newRating) => setRating({ ...rating, [post._id]: newRating })}
                    />
                    <MDBBtn
                      className="mt-2"
                      onClick={() => handleReview(post._id)}
                    >
                      Add review
                    </MDBBtn>
                  </MDBCardBody>
                </MDBCard>
              </MDBCol>
            ))}
          </MDBRow>
          {weather && (
          <div className="row d-flex justify-content-center py-5">
            <div className="col-md-8 col-lg-6 col-xl-5">
              <div className="card text-body" style={{ borderRadius: "35px" }}>
                <div className="card-body p-4">
                  <MDBRow>
                    <MDBCol md="6" className="mb-4">
                      <input
                        type='text'
                        className="form-control"
                        placeholder='Enter a City'
                        onChange={(e) => setSearch(e.target.value)}
                      />
                    </MDBCol>
                    <MDBCol md="6" className="mb-4">
                      <MDBBtn onClick={handleSearch}> Search</MDBBtn>
                    </MDBCol>
                  </MDBRow>
                  <div className="d-flex">
                    <h6 className="flex-grow-1">{weather.name}</h6>
                    <h6>{new Date().toLocaleTimeString()}</h6>
                  </div>
                  <div className="d-flex flex-column text-center mt-5 mb-4">
                    <h6 className="display-4 mb-0 font-weight-bold">{weather.main.temp}°C</h6>
                    <span className="small" style={{ color: "#868B94" }}>{weather.weather[0].description}</span>
                  </div>
                  <div className="d-flex align-items-center">
                    <div className="flex-grow-1" style={{ fontSize: "1rem" }}>
                      <div><i className="fas fa-wind fa-fw" style={{ color: "#868B94" }}></i> <span className="ms-1"> {weather.wind.speed} km/h </span></div>
                      <div><i className="fas fa-tint fa-fw" style={{ color: "#868B94" }}></i> <span className="ms-1"> {weather.main.humidity}% </span></div>
                      <div><i className="fas fa-sun fa-fw" style={{ color: "#868B94" }}></i> <span className="ms-1"> {weather.clouds.all}% </span></div>
                    </div>
                    <div>
                      <img src={`https://openweathermap.org/img/wn/${weather.weather[0].icon}.png`} width="100px" alt="Weather icon" />
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        )}
          <MDBBtn id='Contact_Us' onClick={toggleContactUsPopup}>Contact Us</MDBBtn>

          {showContactUsPopup && (
            <div className="contact-us-popup">
              <div className="popup-content">
                <ContactUs onClose={toggleContactUsPopup} />
              </div>
            </div>
          )}

          {showLoginPopup && (
            <div className="login-popup">
              <div className="popup-content">
                <p>You need to login first to perform this action.</p>
                <button
                  className="btn btn-primary"
                  onClick={() => navigate('/login')}
                >
                  Login
                </button>
              </div>
            </div>
          )}
        </MDBCol>
      </MDBRow>
    </MDBContainer>
  );
};

export default UserDashboard;

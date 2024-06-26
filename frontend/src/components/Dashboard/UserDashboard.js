import React, { useEffect, useState, useContext } from "react";
import axios from "axios";
import "bootstrap/dist/css/bootstrap.min.css";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import {
  faRemove,
  faEdit,
  faHome,
  faUser,
  faCog,
  faEnvelope,
  faBars,
  faTimes,
  faClipboard,
  faComment,
  faDollarSign,
  faClock,
  faCreditCard,
  faTools,
  faQuestionCircle,
  faTruck,
  faCar,
  faKey,
  faWrench,
  faList,
  faArrowDown,
  faArrowUp,
} from "@fortawesome/free-solid-svg-icons";
import { jwtDecode } from "jwt-decode";
import { UserContext } from "../../App";
import StarRating from "./StarRating";
import "./UserDashboard.css";
import { Link, useNavigate } from "react-router-dom";
import { formatDistanceToNow } from "date-fns";
import tierService from "../../images/tire sevices.png";
import contactUs from "../../images/ContactUs.webp";
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
} from "mdb-react-ui-kit";
import ContactUs from "./ContactUs";
import Message from "./Message";
import socketInit from "../../socket.server";
import { Carousel } from "react-bootstrap";
const apiKey = "374f6b9a93c2d20666eb4a186bd0df01";

const UserDashboard = () => {
  const [showChatPopup, setShowChatPopup] = useState(false);
  const [users, setUsers] = useState([]);
  const { token, isLoggedIn, userName, image, isProvider } =
    useContext(UserContext);
  console.log(image);
  const [sidebarVisible, setSidebarVisible] = useState(true);
  const navigate = useNavigate();
  const [providerInfo, setProviderInfo] = useState([]);
  const [userId, setUserId] = useState("");
  const [newReview, setNewReview] = useState({});
  const [rating, setRating] = useState({});
  const [selectedSpecialist, setSelectedSpecialist] = useState("");
  const [showLoginPopup, setShowLoginPopup] = useState(false);
  const [showContactUsPopup, setShowContactUsPopup] = useState(false);
  const [showAll, setShowAll] = useState(false);
  const [isUpdated, setIsUpdated] = useState(false);
  const [user_id, setUser_id] = useState("");
  const [tokenOne, setTokenOne] = useState("");
  const [socket, setSocket] = useState(null);
  const [isConnected, setIsConnected] = useState(false);
  const [weather, setWeather] = useState(null);
  const [search, setSearch] = useState("");
  const [providerId, setProviderId] = useState("");
  const [providerUserName, setProviderUserName] = useState("");
  const [isPopupVisible, setIsPopupVisible] = useState(false);
  const [showAllReviews, setShowAllReviews] = useState({});
  const handleUserClick = (user) => {
    setIsConnected(true);
    setProviderId(user._id);
    setProviderUserName(user.userName);
    setIsPopupVisible(true);
  };

  const closeChatToggle = () => {
    setIsPopupVisible(false);
    setIsConnected(false);
    setProviderUserName("");
    setProviderId(null);
  };
  useEffect(() => {
    if (token) {
      const decodedToken = jwtDecode(token);
      const userId = decodedToken.userId;
      setUserId(userId);
    }
    getAllProvidersInfo();
    getAllUsers();
  }, [token]);

  useEffect(() => {
    if (navigator.geolocation) {
      navigator.geolocation.getCurrentPosition(
        (position) => {
          const { latitude, longitude } = position.coords;
          fetchWeather(latitude, longitude);
        },
        (error) => {
          console.error("Error fetching location", error);
        }
      );
    }
  }, []);
  const toggleShowAllReviews = (postId) => {
    setShowAllReviews((prev) => ({ ...prev, [postId]: !prev[postId] }));
  };
  const getAllUsers = () => {
    axios
      .get("http://localhost:5000/users")
      .then((result) => {
        // console.log(result.data.Users);
        const serviceProviderUsers = result.data.Users.filter(
          (user) => user.role.role === "serviceProvider"
        );
        setUsers(serviceProviderUsers);
        console.log(users);
      })
      .catch((err) => {
        console.log(err);
      });
  };
  const fetchWeather = async (latitude, longitude) => {
    try {
      const response = await axios.get(
        `https://api.openweathermap.org/data/2.5/weather?lat=${latitude}&lon=${longitude}&units=metric&appid=${apiKey}`
      );
      setWeather(response.data);
    } catch (error) {
      console.error("Error fetching weather data:", error);
    }
  };

  const handleSearch = () => {
    if (search) {
      fetchWeatherByCity(search);
    }
  };

  const fetchWeatherByCity = async (city) => {
    try {
      const response = await axios.get(
        `https://api.openweathermap.org/data/2.5/weather?q=${city}&units=metric&appid=${apiKey}`
      );
      setWeather(response.data);
    } catch (error) {
      console.error("Error fetching weather data:", error);
    }
  };

  const getAllProvidersInfo = () => {
    axios
      .get("http://localhost:5000/providerInfo/")
      .then((result) => {
        setProviderInfo(result.data.providersInfo);
      })
      .catch((err) => {
        console.error("Error fetching provider info:", err);
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
                        customer: {
                          ...result.data.review.customer,
                          userName,
                          image,
                          _id: userId,
                        },
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
        console.error("Error adding review:", err);
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
      .delete(`http://localhost:5000/providerInfo/${reviewId}/reviews`, {
        headers,
      })
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
        console.error("Error deleting review:", err);
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
                rev._id === reviewId
                  ? { ...rev, review: newReview, rating: newRating }
                  : rev
              ),
            }))
          );
          setIsUpdated(false);
        }
      })
      .catch((err) => {
        console.error("Error updating review:", err);
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
      setIsConnected(true);
    }
  }, [userId, token]);
  return (
    <MDBContainer id="home" className="UserDashboard">
      <FontAwesomeIcon
        icon={sidebarVisible ? faTimes : faBars}
        className={sidebarVisible ? "white" : "toggle-sidebar-icon"}
        onClick={toggleSidebar}
      />
      <div className={`sidebar ${sidebarVisible ? "sidebar-visible" : ""}`}>
        <div className="menu-sidebar">
          <h3>Menu</h3>
          <a href="#home">
            <FontAwesomeIcon icon={faHome} className="me-2" />
            Home
          </a>

          <a>
            <Link to="/user-settings">
              <FontAwesomeIcon icon={faCog} className="me-2" />
              Settings
            </Link>
          </a>
          <a href="#Posts">
            <FontAwesomeIcon icon={faClipboard} className="me-2" />
            Posts
          </a>
          <a href="#Contact_Us">
            <FontAwesomeIcon icon={faEnvelope} className="me-2" />
            Contact Us
          </a>
          <a
            href="#message"
            onClick={() => {
              setIsPopupVisible(!isPopupVisible);
            }}
          >
            <FontAwesomeIcon icon={faComment} className="me-2" /> Messages
          </a>
          <a href="#more">
            <FontAwesomeIcon icon={faQuestionCircle} className="me-2" /> What
            you need to know{" "}
          </a>
          <a href="#what-we-do">
            <FontAwesomeIcon icon={faList} className="me-2" />
            what we do ?
          </a>
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

          <div>
            {isPopupVisible && (
              <div className="contact-us-popup">
                <div className="popup-content">
                  <div className="chat-container">
                    <div className="user-list">
                      {users?.map((user, i) => (
                        <div
                          key={i}
                          className="user-item"
                          onClick={() => handleUserClick(user)}
                        >
                          <div>
                            <img
                              src={getImage(user.image, user.userName)}
                              alt={user.userName}
                              className="user-image"
                            />
                            <span className="user-name">{user.userName}</span>
                          </div>
                          <div>
                            <p>
                              <b>specialist: </b>
                              {user.specialist.name}
                            </p>
                          </div>
                        </div>
                      ))}
                    </div>
                    <div className="chat-window">
                      {isConnected && (
                        <Message
                          socket={socket}
                          providerId={providerId}
                          image={image}
                          providerName={providerUserName}
                        />
                      )}
                    </div>
                  </div>
                  <button onClick={closeChatToggle}>Close</button>
                </div>
              </div>
            )}
          </div>

          <Carousel>
            <Carousel.Item>
              <img
                className="d-block w-100"
                src={tierService}
                alt="First slide"
              />
              <Carousel.Caption className="representation">
                <h3>YOU HAVE QUESTIONS, WE HAVE SOLUTIONS</h3>
                <p>
                  An accident can dent more than just your vehicle. It can wreck
                  your day, whole week, or more. If everyone’s safe, you want
                  immediate answers: “What shop can I bring it to right now?”
                  “Who can I rely on to fix it well, fast, reliably, honestly?”
                  And, big time—“Who will fix it so it doesn’t put a huge dent
                  in my wallet?” You want a <a href="#home">Bansharji</a> you
                  can trust that won’t take advantage of your lack of expertise.
                  Few people know how much it costs to repair a car bumper on
                  average. How about a cracked windshield? Or a deep paint
                  scratch?{" "}
                </p>
              </Carousel.Caption>
            </Carousel.Item>
            <Carousel.Item>
              <img
                className="d-block w-100"
                src={contactUs}
                alt="Second slide"
              />
              <Carousel.Caption id="Contact_Us">
                <h3>Get in Touch</h3>
                <p>
                  We're here to help! Reach out to us for any inquiries or
                  support.
                </p>
                <MDBBtn onClick={toggleContactUsPopup}>Contact Us</MDBBtn>
              </Carousel.Caption>
            </Carousel.Item>
            <Carousel.Item>
            <img
  className="d-block w-100"
  src="https://images.unsplash.com/photo-1517816743773-6e0fd518b4a6"
  alt="Third slide"
/>

  <Carousel.Caption>
    <h3>See the weather in your city</h3>
    {weather && (
      <div className="weather-card-container">
        <div className="weather-card">
          <div className="weather-card-body">
            <div className="row">
              <div className="col-md-6 mb-4">
                <input
                  type="text"
                  className="form-control"
                  placeholder="Enter a City"
                  onChange={(e) => setSearch(e.target.value)}
                />
              </div>
              <div className="col-md-6 mb-4">
                <button className="btn btn-primary" onClick={handleSearch}>
                  Search
                </button>
              </div>
            </div>
            <div className="d-flex justify-content-between">
              <h6>{weather.name}</h6>
              <h6>{new Date().toLocaleTimeString()}</h6>
            </div>
            <div className="text-center mt-5 mb-4">
              <h6 className="display-4 mb-0 font-weight-bold">
                {weather.main.temp}°C
              </h6>
              <span className="small text-muted">
                {weather.weather[0].description}
              </span>
            </div>
            <div className="d-flex align-items-center justify-content-between">
              <div className="weather-details">
                <div>
                  <i className="fas fa-wind text-muted"></i>
                  <span className="ms-1">{weather.wind.speed} km/h</span>
                </div>
                <div>
                  <i className="fas fa-tint text-muted"></i>
                  <span className="ms-1">{weather.main.humidity}%</span>
                </div>
                <div>
                  <i className="fas fa-sun text-muted"></i>
                  <span className="ms-1">{weather.clouds.all}%</span>
                </div>
              </div>
              <div>
                <img
                  src={`https://openweathermap.org/img/wn/${weather.weather[0].icon}.png`}
                  width="100px"
                  alt="Weather icon"
                />
              </div>
            </div>
          </div>
        </div>
      </div>
    )}
  </Carousel.Caption>
</Carousel.Item>

          </Carousel>
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
              <MDBCol id="Posts" md="6" key={post._id}>
                <MDBCard className="mb-4">
                  <MDBCardBody className="post">
                    <div className="d-flex align-items-center mb-3">
                      <img
                        src={getImage(post.author.image, post.author.userName)}
                        alt={post.author.userName}
                        onClick={() => {
                          setIsConnected(true);
                          setProviderId(post.author._id);
                          setProviderUserName(post.author.userName);
                          console.log("provider" + post.author._id);
                        }}
                        className="author-image rounded-circle me-3"
                      />
                      <div className="author-info">
                        <MDBCardTitle className="text-center mb-0">
                          {post.author.userName}
                        </MDBCardTitle>
                        <MDBCardSubTitle className="text-center text-muted">
                          <b> Specialty : {post?.specialist?.name}</b>
                        </MDBCardSubTitle>
                      </div>
                    </div>
                    
                    <div className="post-info">
                      <MDBCardText className="mt-3">
                        <b>{post.title}</b>
                      </MDBCardText>
                      <MDBCardText>
                        {" "}
                        <b>Description : </b>
                        {post.description}
                      </MDBCardText>
                      <div>
                      <ul className="list-group mb-3">
                        <li>
                          <b>Availability: </b>
                          {post.availability}
                        </li>
                        <li>
                          <b>Experience:</b> {post.experience}
                        </li>
                      </ul>
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
                    <div className="reviews-section">
                      
                      <h4>Reviews:</h4>
                      {post.reviews?.length > 0 && (
                        <>
                          {!showAllReviews[post._id] && (
                            <a
                              className="show-reviews"
                              href="#nothing"
                              onClick={() => toggleShowAllReviews(post._id)}
                            >
                              Show Reviews{" "}
                              <FontAwesomeIcon icon={faArrowDown} size="sm" />
                            </a>
                          )}
                          {showAllReviews[post._id] && (
                            <>
                              <a
                                className="show-reviews"
                                href="#nothing"
                                onClick={() => toggleShowAllReviews(post._id)}
                              >
                                Hide Reviews{" "}
                                <FontAwesomeIcon icon={faArrowUp} size="sm" />
                              </a>
                              {post.reviews.map((review, i) => (
                                <div key={i} className="review-card">
                                  {isLoggedIn &&
                                    userId === review.customer._id && (
                                      <>
                                        <div className="review-buttons">
                                          <button
                                            onClick={() =>
                                              handleDelete(review._id)
                                            }
                                            className="btn btn-sm btn-danger"
                                            title="Delete this review"
                                          >
                                            <FontAwesomeIcon icon={faRemove} />
                                          </button>
                                          <button
                                            onClick={() =>
                                              setIsUpdated(review._id)
                                            }
                                            className="btn btn-sm btn-primary mr-2"
                                            title="Update this review"
                                          >
                                            <FontAwesomeIcon icon={faEdit} />
                                          </button>
                                        </div>
                                        {isUpdated === review._id && (
                                          <div className="update-review-form">
                                            <div className="form-group">
                                              <label>New Review</label>
                                              <MDBInput
                                                value={
                                                  newReview[review._id] ||
                                                  review.review
                                                }
                                                onChange={(e) =>
                                                  setNewReview({
                                                    ...newReview,
                                                    [review._id]:
                                                      e.target.value,
                                                  })
                                                }
                                              />
                                            </div>
                                            <div>
                                              <StarRating
                                                rating={
                                                  rating[review._id] ||
                                                  review.rating
                                                }
                                                setRating={(newRating) =>
                                                  setRating({
                                                    ...rating,
                                                    [review._id]: newRating,
                                                  })
                                                }
                                              />
                                            </div>
                                            <button
                                              onClick={() =>
                                                handleUpdate(
                                                  review._id,
                                                  newReview[review._id] ||
                                                    review.review,
                                                  rating[review._id] ||
                                                    review.rating
                                                )
                                              }
                                              className="btn btn-sm btn-primary"
                                            >
                                              Save
                                            </button>
                                          </div>
                                        )}
                                      </>
                                    )}
                                  <MDBCardBody>
                                    <div key={i} className="review-card">
                                      <div 
                                      className="review-author">
                                        <div>
                                        <div>
                                        
                                          <img
                                          src={getImage(
                                            review.customer.image,
                                            review.customer.userName
                                          )}
                                          alt={review.customer.userName}
                                          className="author-image rounded-circle me-3"
                                        />
                                        
                                        </div>
                                        <div className="review-date">
                                        <p className="date">
                                            {formatDistanceToNow(
                                              new Date(review.date)
                                            )}{" "}
                                            ago
                                          </p>
                                          <span className="review-author-name">
                                            {review.customer.userName}
                                          </span>
                                        </div>
                                        </div>
                                        <div>
                                        <p className="review">{review.review}</p>
                                     
                                          <StarRating
                                          rating={review.rating}
                                          postId={post._id}
                                        />
                                          </div>
                                        <div>
                                          
                                        </div>
                                      </div>
                                      <div className="review-content">
                                        
                                        
                                      </div>
                                    </div>
                                  </MDBCardBody>
                                </div>
                              ))}
                            </>
                          )}
                        </>
                      )}
                    </div>
                    <MDBInput
                      value={newReview[post._id] || ""}
                      onChange={(e) =>
                        setNewReview({
                          ...newReview,
                          [post._id]: e.target.value,
                        })
                      }
                      placeholder="Write your review..."
                    />
                    <StarRating
                      rating={rating[post._id] || 0}
                      setRating={(newRating) =>
                        setRating({ ...rating, [post._id]: newRating })
                      }
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
          <div>
          <div id="what-we-do" className="service-list-container">
            <h2>OUR FULL SERVICE LIST</h2>
            <div className="service-list">
              <div className="service-category">
                <FontAwesomeIcon icon={faCar} className="service-icon" />
                <ul>
                  <li>Body & Trim</li>
                  <li>Painting</li>
                  <li>Welding</li>
                  <li>All Makes And Models</li>
                  <li>Auto Body And Repair</li>
                  <li>Auto Collision Repair</li>
                  <li>Auto Dent Repair & Removal</li>
                  <li>Auto Paint Shop</li>
                  <li>Bumper Repair</li>
                </ul>
              </div>
              <div className="service-category">
                <FontAwesomeIcon icon={faKey} className="service-icon" />
                <ul>
                  <li>Bumper Scrape</li>
                  <li>Car Bumper</li>
                  <li>Car Painting</li>
                  <li>Car Scratch</li>
                  <li>Car Towed</li>
                  <li>Clean Up</li>
                  <li>Collision Center</li>
                  <li>Computerized Paint Match System</li>
                  <li>Custom Paint</li>
                  <li>Final Inspection</li>
                  <li>Full Body Work</li>
                  <li>Hail Damage Car Repair</li>
                </ul>
              </div>
              <div className="service-category">
                <FontAwesomeIcon icon={faWrench} className="service-icon" />
                <ul>
                  <li>Hand Car Wash</li>
                  <li>Hour Towing</li>
                  <li>Minor Damage</li>
                  <li>Paint Job</li>
                  <li>Paint Perfection</li>
                  <li>Paint Restoration</li>
                  <li>Painting And Polishing</li>
                  <li>Paintless Dent Removal</li>
                  <li>Paintless Dent Repair</li>
                  <li>Rental Car</li>
                  <li>Scratch Repair</li>
                  <li>Total Restoration</li>
                  <li>Wash & Detailing</li>
                </ul>
              </div>
            </div>
          </div>
          <div id="more" className="features-container">
            <div className="feature-item">
              <FontAwesomeIcon icon={faDollarSign} className="feature-icon" />
              <p>Reasonable/affordable pricing</p>
            </div>
            <div className="feature-item">
              <FontAwesomeIcon icon={faTools} className="feature-icon" />
              <p>Certified technicians</p>
            </div>
            <div className="feature-item">
              <FontAwesomeIcon icon={faClock} className="feature-icon" />
              <p>
                Call and we’re on the way to pick up your car and pick you up
                too
              </p>
            </div>
            <div className="feature-item">
              <FontAwesomeIcon icon={faCreditCard} className="feature-icon" />
              <p>All credit cards accepted</p>
            </div>
            <div className="feature-item">
              <FontAwesomeIcon icon={faTruck} className="feature-icon" />
              <p>Delivery ASAHP (As soon as humanly possible)</p>
            </div>
            <div className="feature-item">
              <FontAwesomeIcon icon={faCar} className="feature-icon" />
              <p>All makes and models repaired and restored</p>
            </div>
          </div>
          </div>
          
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
                  onClick={() => navigate("/login")}
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

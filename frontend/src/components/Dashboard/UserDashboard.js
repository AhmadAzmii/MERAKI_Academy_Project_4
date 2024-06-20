import React, { useEffect, useState, useContext } from 'react';
import axios from 'axios';
import "bootstrap/dist/css/bootstrap.min.css";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faRemove, faEdit } from "@fortawesome/free-solid-svg-icons";
import { jwtDecode } from 'jwt-decode';
import { UserContext } from '../../App';
import StarRating from './StarRating';
import './UserDashboard.css';
import { useNavigate } from 'react-router-dom';
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

const UserDashboard = () => {
  const { token, isLoggedIn, userName, image } = useContext(UserContext);
  const navigate = useNavigate();
  const [providerInfo, setProviderInfo] = useState([]);
  const [userId, setUserId] = useState('');
  const [newReview, setNewReview] = useState('');
  const [rating, setRating] = useState(0);
  const [selectedSpecialist, setSelectedSpecialist] = useState('');
  const [showLoginPopup, setShowLoginPopup] = useState(false);
  const [showContactUsPopup, setShowContactUsPopup] = useState(false);
  const [review, setReview] = useState([])
  const [isUpdated, setIsUpdated] = useState(false);

  useEffect(() => {
    if (token) {
      const decodedToken = jwtDecode(token);
      const userId = decodedToken.userId;
      setUserId(userId);
    }
    getAllProvidersInfo();
  }, [token]);

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
        { review: newReview, rating, customer: userId },
        { headers }
      )
      .then((result) => {
        if (result.status === 201 && result.data.success) {
          setProviderInfo((prevInfo) =>
            prevInfo.map((post) =>
              postId === post._id
                ? { ...post, reviews: [...post.reviews, { ...result.data.review, customer: { userName, image } }] }
                : post
            )
          );

          setRating(0);
        }
        setNewReview('');
      })
      .catch((err) => {
        console.error('Error adding review:', err);
      });
  };



  const handleSpecialistChange = (e) => {
    setSelectedSpecialist(e.target.value);
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


  return (
    <MDBContainer className="UserDashboard">
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
            {providerInfo?.map((post) => (
              <option key={post._id} value={post?.specialist?.name}>
                {post?.specialist?.name}
              </option>
            ))}
          </select>
        </MDBCol>
      </MDBRow>

      <MDBRow>
        {filteredProviderInfo?.map((post) => {
          return (
            <MDBCol md="6" key={post._id}>
              <MDBCard className="mb-4">
                <MDBCardBody className='post'>
                  <div className="d-flex align-items-center mb-3">
                    <img
                      src={getImage(post.author.image, post.author.userName)}
                      alt={post.author.userName}
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
                  <MDBCardText className="mt-3"><b>{post.title}</b></MDBCardText>
                  <MDBCardText>{post.description}</MDBCardText>
                  <ul className="list-group mb-3">
                    <li className="list-group-item">
                      <b>Availability: </b>{post.availability}
                    </li>
                    <li className="list-group-item">
                      <b>Experience:</b> {post.experience}
                    </li>
                  </ul>
                  {post.reviews.map((review, i) => (
                    <MDBCard key={i} className="card-review mb-3">
                      <MDBCardBody>
                        <div className="d-flex align-items-center mb-3">
                          <img
                            src={getImage(review.customer.image, review.customer.userName)}
                            alt={review.customer.userName}
                            className="author-image rounded-circle me-3"
                          />
                          <div>
                            <MDBCardTitle className="text-center mb-0">
                              {review.customer.userName}
                            </MDBCardTitle>
                          </div>
                        </div>
                        <MDBCardText>{review.review}</MDBCardText>
                        <StarRating rating={review.rating} />
                        {isLoggedIn && userId === review.customer._id && (
        <button
          onClick={() => handleDelete(review._id)}
          className="btn btn-sm btn-danger"
        >
          <FontAwesomeIcon icon={faRemove} />
        </button>
      )}
                        {isUpdated && (
                          <div className="update-review-form">
                            <div className="form-group">
                              <label>New Review</label>
                              <MDBInput
                                type="text"

                                onChange={(e) => setNewReview(e.target.value)}
                                className="form-control"
                              />
                            </div>
                            <div>
                              <StarRating rating={rating} setRating={setRating} />
                            </div>
                          </div>
                        )}


{isLoggedIn && userId === review.customer._id && (
        <button
          onClick={() => {
            setIsUpdated(!isUpdated);
            if (isUpdated) {
              handleUpdate(review._id, newReview, rating);
            }
          }}
          className="btn btn-sm btn-primary mr-2"
        >
          {isUpdated ? "Save" : ""}
          <FontAwesomeIcon icon={faEdit} />
        </button>
      )}
                      </MDBCardBody>
                    </MDBCard>
                  ))}
                  <MDBInput
                    className="form-control mb-2"
                    type="text"
                    placeholder="Review..."
                    onChange={(e) => setNewReview(e.target.value)}
                  />
                  <StarRating rating={rating} setRating={setRating} />
                  <MDBBtn
                    className="mt-2"
                    onClick={() => handleReview(post._id)}
                  >
                    Add review
                  </MDBBtn>
                </MDBCardBody>
              </MDBCard>
            </MDBCol>
          );
        })}
      </MDBRow>

      <MDBBtn onClick={toggleContactUsPopup}>Contact Us</MDBBtn>

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
    </MDBContainer>
  );
};

export default UserDashboard;

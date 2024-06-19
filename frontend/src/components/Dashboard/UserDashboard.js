import React, { useEffect, useState, useContext } from 'react';
import axios from 'axios';
import { UserContext } from '../../App';
import { jwtDecode } from 'jwt-decode';
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
import  ContactUs  from './ContactUs';

const UserDashboard = () => {
  const { token, isLoggedIn } = useContext(UserContext);
  const navigate = useNavigate();
  const [providerInfo, setProviderInfo] = useState([]);
  const [userId, setUserId] = useState('');
  const [newReview, setNewReview] = useState('');
  const [rating, setRating] = useState(0);
  const [selectedSpecialist, setSelectedSpecialist] = useState('');
  const [showLoginPopup, setShowLoginPopup] = useState(false);
  const [showContactUsPopup, setShowContactUsPopup] = useState(false); 
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
                ? { ...post, reviews: [...post.reviews, result.data.review] }
                : post
            )
          );
          setNewReview('');
          setRating(0);
        }
      })
      .catch((err) => {
        console.error('Error adding review:', err);
      });
  };

  const handleSpecialistChange = (e) => {
    setSelectedSpecialist(e.target.value);
  };

  const getDefaultImage = (name) => {
    const firstLetter = name.charAt(0).toUpperCase();
    return require(`../../alphabetImages/${firstLetter}.png`);
  };

  const filteredProviderInfo = selectedSpecialist
    ? providerInfo.filter((post) => post.specialist.name === selectedSpecialist)
    : providerInfo;

  
  const toggleContactUsPopup = () => {
    setShowContactUsPopup(!showContactUsPopup);
  };

  return (
    <MDBContainer className="UserDashboard">
      <h2>User Dashboard</h2>
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
        {filteredProviderInfo.map((post) => {
          return (
            <MDBCol md="6" key={post._id}>
              <MDBCard className="mb-4">
                <MDBCardBody>
                  <div className="d-flex align-items-center mb-3">
                    <img
                      src={post.author.image || getDefaultImage(post.author.userName)}
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
                    <MDBCard key={i} className="mb-3">
                      <MDBCardBody>
                        <div className="d-flex align-items-center mb-3">
                          <img
                            src={review.customer.image || getDefaultImage(review.customer.userName)}
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
                      </MDBCardBody>
                    </MDBCard>
                  ))}
                  <MDBInput
                    className="form-control mb-2"
                    type="text"
                    placeholder="Review..."
                    value={newReview}
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

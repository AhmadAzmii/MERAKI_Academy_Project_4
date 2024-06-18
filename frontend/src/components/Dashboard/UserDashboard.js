import React, { useEffect, useState, useContext } from "react";
import axios from "axios";
import { UserContext } from "../../App";
import {jwtDecode} from "jwt-decode"; // Correct import
import StarRating from "./StarRating";
import "./UserDashboard.css";
import { useNavigate } from "react-router-dom";
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

const UserDashboard = () => {
  const { token, isLoggedIn } = useContext(UserContext);
  const navigate = useNavigate();
  const [providerInfo, setProviderInfo] = useState([]);
  const [userId, setUserId] = useState("");
  const [newReview, setNewReview] = useState("");
  const [rating, setRating] = useState(0);
  const [selectedSpecialist, setSelectedSpecialist] = useState("");
  const [showLoginPopup, setShowLoginPopup] = useState(false);
  const [userName, setUserName] = useState("");

  useEffect(() => {
    if (token) {
      const decodedToken = jwtDecode(token);
      const userId = decodedToken.userId;
      const userName = decodedToken.user;
      setUserId(userId);
      setUserName(userName);
    }
    getAllProvidersInfo();
  }, [token]);

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
          setNewReview("");
          setRating(0);
        }
      })
      .catch((err) => {
        console.error("Error adding review:", err);
      });
  };

  const handleSpecialistChange = (e) => {
    setSelectedSpecialist(e.target.value);
  };

  const filteredProviderInfo = selectedSpecialist
    ? providerInfo.filter((post) => post.specialist.name === selectedSpecialist)
    : providerInfo;

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
            {providerInfo.map((post) => (
              <option key={post._id} value={post.specialist.name}>
                {post.specialist.name}
              </option>
            ))}
          </select>
        </MDBCol>
      </MDBRow>

      <MDBRow>
        {filteredProviderInfo.map((post) => (
          <MDBCol md="6" key={post._id}>
            <MDBCard className="mb-4">
              <MDBCardBody>
                <div className="d-flex align-items-center mb-3">
                  {post.author.image && (
                    <img
                      src={post.author.image}
                      alt={post.author.userName}
                      className="author-image rounded-circle me-3"
                    />
                  )}
                  <div>
                    <MDBCardTitle className="text-center mb-0">
                      {post.author.userName}
                    </MDBCardTitle>
                    <MDBCardSubTitle className="text-center text-muted">
                      {post.specialist.name}
                    </MDBCardSubTitle>
                  </div>
                </div>
                <MDBCardText className="mt-3">{post.title}</MDBCardText>
                <MDBCardText>{post.description}</MDBCardText>
                <ul className="list-group mb-3">
                  <li className="list-group-item">
                    Availability: {post.availability}
                  </li>
                  <li className="list-group-item">
                    Experience: {post.experience}
                  </li>
                </ul>
                {post.reviews.map((review, i) => (
                  <MDBCard key={i} className="mb-3">
                    <MDBCardBody>
                      <MDBCardTitle>Review: {review.review}</MDBCardTitle>
                      <MDBCardSubTitle>
                        {review.customer && review.customer.name
                          ? `Customer: ${review.customer.name}`
                          : "Customer: Anonymous"}
                      </MDBCardSubTitle>
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
        ))}
      </MDBRow>

      {showLoginPopup && (
        <div className="alert alert-danger text-center" role="alert">
          <p>You need to login first to perform this action.</p>
          <MDBBtn onClick={() => navigate("/login")}>Login</MDBBtn>
        </div>
      )}
    </MDBContainer>
  );
};

export default UserDashboard;

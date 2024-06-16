import React, { useEffect, useState } from 'react';
import axios from 'axios';
import {jwtDecode} from 'jwt-decode';
import StarRating from './StarRating';
import './UserDashboard.css';

const UserDashboard = () => {
  const token = localStorage.getItem("token");

  const [providerInfo, setProviderInfo] = useState([]);
  const [userId, setUserId] = useState('');
  const [newReview, setNewReview] = useState('');
  const [rating, setRating] = useState(0);
  const [selectedSpecialist, setSelectedSpecialist] = useState('');

  useEffect(() => {
    if (token) {
      const decodedToken = jwtDecode(token);
      const userId = decodedToken.userId;
      setUserId(userId);
      getAllProvidersInfo();
    }
  }, [token]);

  const getAllProvidersInfo = () => {
    axios.get("http://localhost:5000/providerInfo/")
      .then((result) => {
        setProviderInfo(result.data.providersInfo);
      })
      .catch((err) => {
        console.log("Error fetching provider info:", err);
      });
  };

  const handleReview = (postId) => {
    const headers = {
      Authorization: `Bearer ${token}`
    };

    console.log("Sending review data:", { review: newReview, rating, customer: userId });

    axios.post(`http://localhost:5000/providerInfo/${postId}/reviews`,
      { review: newReview, rating, customer: userId },
      { headers }
    )
    .then((result) => {
      if (result.status === 201 && result.data.success) {
        setProviderInfo(providerInfo.map((post) =>
          postId === post._id ? { ...post, reviews: [...post.reviews, result.data.review] } : post
        ));
      }
      setNewReview("");
      setRating(0);
    })
    .catch((err) => {
      console.error("Error adding review:", err);
    });
  };

  const handleSpecialistChange = (e) => {
    setSelectedSpecialist(e.target.value);
  };

  let filteredProviderInfo = providerInfo;
  if (selectedSpecialist) {
    filteredProviderInfo = providerInfo.filter(post => post.specialist.name === selectedSpecialist);
  }

  return (
    <div className='UserDashboard'>
      <h2>UserDashboard</h2>
      <div className="select-container">
        <select className="custom-select" onChange={handleSpecialistChange}>
          <option value="">All Posts</option>
          {providerInfo.map(post => (
            <option key={post._id} value={post.specialist.name}>{post.specialist.name}</option>
          ))}
        </select>
      </div>

      <div className="container">
        {filteredProviderInfo.map((post) => (
          <div key={post._id} className="card mb-3">
            <div className="card mb-3">
              <div className="card-body">
                <h2 className="card-title text-center">{post.author.userName}</h2>
                <h2 className="card-subtitle mb-2 text-muted text-center">{post.specialist.name}</h2>
                <h3 className="mt-3">{post.title}</h3>
                <p className="card-text">{post.description}</p>
                <ul className="list-group">
                  <li className="list-group-item">Availability: {post.availability}</li>
                  <li className="list-group-item">Experience: {post.experience}</li>
                </ul>
                {post.reviews.map((review, i) => (
                  <div key={i} className="card mt-3">
                    <div className="card-body">
                      <h4 className="card-title">Review: {review.review}</h4>
                      <StarRating rating={review.rating} />
                    </div>
                  </div>
                ))}
                <div className="mt-3">
                  <input
                    className="form-control review-input"
                    type="text"
                    placeholder="Review..."
                    value={newReview}
                    onChange={(e) => setNewReview(e.target.value)}
                  />
                  <StarRating rating={rating} setRating={setRating} />
                  <button className="btn btn-primary mt-2" onClick={() => handleReview(post._id)}>Add review</button>
                </div>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default UserDashboard;

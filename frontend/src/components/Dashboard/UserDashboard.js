import axios from 'axios';
import { jwtDecode } from 'jwt-decode';
import React, { useEffect, useState } from 'react';
import './UserDashboard.css';

const UserDashboard = () => {
  const token = localStorage.getItem("token");

  const [providerInfo, setProviderInfo] = useState([]);
  const [userId, setUserId] = useState('');
  const [newReview, setNewReview] = useState('');
  const [rating, setRating] = useState(0);

  const [categories, setCategories] = useState([]);
  const [selectedSpecialist, setSelectedSpecialist] = useState('');

  useEffect(() => {
    const fetchCategories = async () => {
      try {
        const response = await axios.get("http://localhost:5000/serviceCategory/");
        if (response.data.success) {
          setCategories(response.data.categories);
        } else {
          console.error("No categories found");
        }
      } catch (error) {
        console.error("Error fetching service categories:", error);
      }
    };

    fetchCategories();
  }, []);

  useEffect(() => {
    if (token) {
      const decodedToken = jwtDecode(token);
      const userId = decodedToken.userId;
      setUserId(userId);
      getAllProvidersInfo();
    }
  }, []);

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
        console.log(err);
      });
  };

  const handleSpecialistChange = (e) => {
    setSelectedSpecialist(e.target.value);
  };

  const filteredProviderInfo = selectedSpecialist
    ? providerInfo.filter(post => post.specialist.name === selectedSpecialist)
    : providerInfo;

  return (
    <div className='UserDashboard'>
      <h2>UserDashboard Component</h2>
      <div>
        <select onChange={handleSpecialistChange}>
          <option value="">Select a specialist</option>
          {providerInfo.map(post => (
            <option key={post._id} value={post.specialist.name}>{post.specialist.name}</option>
          ))}
        </select>
      </div>

      {filteredProviderInfo.map((post) => (
        <div key={post._id} className="provider-info">
          <h2>{post.author.userName}</h2>
          <h2>{post.specialist.name}</h2>
          <h3>{post.title}</h3>
          <p>{post.description}</p>
          {post.reviews.map((review, i) => (
            <div key={i}>
              <h4>Review: {review.review}</h4>
              <p>Rating: {review.rating}</p>
            </div>
          ))}
          <input
            className="review-input"
            type="text"
            placeholder="Review..."
            value={newReview}
            onChange={(e) => setNewReview(e.target.value)}
          />
          <input
            className="rating-input"
            type="number"
            placeholder="Rating..."
            value={rating}
            onChange={(e) => setRating(e.target.value)}
            min="0"
            max="5"
          />
          <button className="add-review" onClick={() => handleReview(post._id)}>Add review</button>
        </div>
      ))}
    </div>
  );
};

export default UserDashboard;

import axios from 'axios';
import {jwtDecode} from 'jwt-decode'; 
import React, { useEffect, useState } from 'react';
import './UserDashboard.css'; 

const UserDashboard = () => {
  const token = localStorage.getItem("token");
  
  const [providerInfo, setProviderInfo] = useState([]);
  const [userId, setUserId] = useState('');
  
  const [newReview, setNewReview] = useState('');
  const [rating, setRating] = useState(0);

  useEffect(() => {
    if (token) {
      const decodedToken = jwtDecode(token);
      const userId = decodedToken.userId;
      setUserId(userId);
      getAllProvidersInfo();
    }
  }, []);

  const getAllProvidersInfo = () => {
    const headers = {
      Authorization: `Bearer ${token}`
    };
    axios.get("http://localhost:5000/providerInfo/", { headers })
      .then((result) => {
        console.log(result.data);
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
          console.log("New review added:", result.data.review); 
          setProviderInfo(providerInfo.map((post) =>
            postId === post._id ? { ...post, reviews: [...post.reviews, result.data.review] } : post

          ));
           console.log("Provider info after adding review:", providerInfo);
          setNewReview("");
          setRating(0);
        }
      })
      .catch((err) => {
        console.log(err);
      });
  };

  return (
    <div className='UserDashboard'>
      <h2>UserDashboard Component</h2>
      {providerInfo?.map((post) => (
        <div key={post._id} className="provider-info">
          <h3>{post.title}</h3>
          <p>{post.description}</p>
          {post.reviews.map((review, i) => {
            console.log(review);
           return ( <div key={i}>
              <h4>review:{review.review}</h4>
              <p>Rating: {review.rating}</p>
            </div> )
           
})}
          <input
            className="review-input"
            type="text"
            placeholder="review..."
            value={newReview}
            onChange={(e) => setNewReview(e.target.value)}
          />
          <input
            className="rating-input"
            type="number"
            placeholder="rating..."
            value={rating}
            onChange={(e) => setRating(e.target.value)}
            min="0"
            max="5"
          />
          <button className="add-review" onClick={() => handleReview(post._id)}>Add review</button>
        </div>
      )) }
    </div>
  );
};

export default UserDashboard;

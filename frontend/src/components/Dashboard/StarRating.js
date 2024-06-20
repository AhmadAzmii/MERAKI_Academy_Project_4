
import React, { useContext,useState } from 'react';
import './StarRating.css';
import { UserContext } from '../../App';

const StarRating = ({ rating, setRating }) => {
  const [showLoginPopup, setShowLoginPopup] = useState(false);
  const { isLoggedIn,isProvider } = useContext(UserContext);
  const handleClick = (index) => {
    if (!isLoggedIn&&!isProvider) {
      
      setShowLoginPopup(showLoginPopup)
      return;
    }
    setRating(index + 1);
  };

  
  const stars = Array.from({ length: 5 });

  return (
    <div className="star-rating">
      {stars.map((_, index) => (
        <span
          key={index}
          className={`star ${index < rating ? 'filled' : ''}`}
          onClick={() => handleClick(index)}
        >
          &#9733;
        </span>
      ))}
    </div>
  );
};

export default StarRating;

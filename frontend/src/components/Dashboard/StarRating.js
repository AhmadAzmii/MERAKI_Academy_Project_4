
import React from 'react';
import './StarRating.css';

const StarRating = ({ rating, setRating }) => {
  const handleClick = (index) => {
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

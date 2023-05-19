import React, { useState } from 'react';
import './styles.css'

const StarRating = ({ selectedRating, onChange }) => {
  const handleStarClick = (selectedRating) => {
    onChange(selectedRating);
  };

  return (
    <div id="review">
      {[...Array(5)].map((_, index) => {
        const starValue = index + 1;
        return (
          <span
            key={starValue}
            className={`star ${starValue <= selectedRating ? 'filled' : 'empty'}`}
            onClick={() => handleStarClick(starValue)}
          >
            ★
          </span>
        );
      })}
    </div>
  );
};

export default StarRating;
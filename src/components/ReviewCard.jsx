import React from 'react';
import '../styles/ReviewCard.css';

const ReviewCard = ({ name, review }) => {
    return (
        <div className="review-card">
            <h4 className="reviewer-name">{name}</h4>
            <p className="review-text">{review}</p>
        </div>
    );
};

export default ReviewCard;

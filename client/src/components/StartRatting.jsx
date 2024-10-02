import React from 'react';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faStar, faStarHalfAlt } from '@fortawesome/free-solid-svg-icons';

const StarRating = ({ rating, displayNumber }) => {
    const stars = [];
    const fullStars = Math.floor(rating);
    const hasHalfStar = rating % 1 !== 0;
    const emptyStars = 5 - fullStars - (hasHalfStar ? 1 : 0);

    // Define the star color
    const starColor = '#0033a0';

    // Add full stars
    for (let i = 0; i < fullStars; i++) {
        stars.push(
            <FontAwesomeIcon key={`full-${i}`} icon={faStar} className="star full-star" style={{ color: starColor }} />,
        );
    }

    // Add half star if needed
    if (hasHalfStar) {
        stars.push(
            <FontAwesomeIcon key="half" icon={faStarHalfAlt} className="star half-star" style={{ color: starColor }} />,
        );
    }

    // Add empty stars
    for (let i = 0; i < emptyStars; i++) {
        stars.push(
            <FontAwesomeIcon
                key={`empty-${i}`}
                icon={faStar}
                className="star empty-star"
                style={{ color: starColor }}
            />,
        );
    }
    const dpnb = displayNumber ? "" : "d-none"
    return (
        <div className="star-rating">
            <span style={{color:'#0033a0!important'}} className={`rating-number ${dpnb}`}>{rating.toFixed(1)}</span>
            {stars}
        </div>
    );
};

export default StarRating;

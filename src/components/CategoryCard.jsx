import React from 'react';
import { Link } from 'react-router-dom';
import '../styles/CategoryCard.css';

const CategoryCard = ({ name, image, url }) => {
    return (
        <Link to={url} className="category-link">
            <div className="category-card">
                <div className="category-image">
                    <img src={image} alt={name} />
                </div>
                <p className="category-name">{name}</p>
            </div>
        </Link>
    );
};

export default CategoryCard;

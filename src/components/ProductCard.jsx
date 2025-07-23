import React, { useState } from 'react';
import { FaShoppingCart, FaStar, FaHeart, FaEye } from 'react-icons/fa';
import '../styles/ProductCard.css'; // We'll create this CSS file next

const ProductCard = ({ product }) => {
    const [isWishlisted, setIsWishlisted] = useState(false);
    const [isHovered, setIsHovered] = useState(false);

    const {
        id,
        name,
        price,
        originalPrice,
        rating,
        reviewCount,
        imageUrl,
        isNew,
        discount,
        colorsAvailable,
    } = product;

    const handleAddToCart = () => {
        console.log(`Added ${id} to cart`);
        // Add your cart logic here
    };

    const toggleWishlist = () => {
        setIsWishlisted(!isWishlisted);
        console.log(`${name} ${isWishlisted ? 'removed from' : 'added to'} wishlist`);
    };

    return (
        <div
            className="product-card"
            onMouseEnter={() => setIsHovered(true)}
            onMouseLeave={() => setIsHovered(false)}
        >
            <div className="product-image-container">
                <img src={imageUrl} alt={name} className="product-image" />

                {isNew && <span className="product-badge new">New</span>}
                {discount > 0 && <span className="product-badge discount">-{discount}%</span>}

                <div className={`product-actions ${isHovered ? 'visible' : ''}`}>
                    <button className="action-btn" onClick={toggleWishlist}>
                        <FaHeart className={isWishlisted ? 'wishlisted' : ''} />
                    </button>
                    <button className="action-btn">
                        <FaEye />
                    </button>
                </div>
            </div>

            <div className="product-info">
                <div className="product-rating">
                    {[...Array(5)].map((_, i) => (
                        <FaStar key={i} className={i < rating ? 'filled' : ''} />
                    ))}
                    <span>({reviewCount})</span>
                </div>

                <h3 className="product-name">{name}</h3>

                <div className="product-pricing">
                    <span className="current-price">${price.toFixed(2)}</span>
                    {originalPrice > price && (
                        <span className="original-price">${originalPrice.toFixed(2)}</span>
                    )}
                </div>
                <button className="add-to-cart-btn" onClick={handleAddToCart}>
                    <FaShoppingCart /> Add to Cart
                </button>
            </div>
        </div>
    );
};

export default ProductCard;
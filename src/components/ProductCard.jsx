import React, { useState } from 'react';
import { FaShoppingCart, FaStar, FaHeart, FaEye } from 'react-icons/fa';
import '../styles/ProductCard.css';

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
        inStock, // Added inStock property
    } = product;

    const handleAddToCart = () => {
        if (!inStock) return; // Don't proceed if out of stock
        console.log(`Added ${id} to cart`);
        // Add your cart logic here
    };

    const toggleWishlist = () => {
        if (!inStock) return; // Optionally prevent wishlisting out-of-stock items
        setIsWishlisted(!isWishlisted);
        console.log(`${name} ${isWishlisted ? 'removed from' : 'added to'} wishlist`);
    };

    const handleQuickView = () => {
        if (!inStock) return;
        console.log(`Quick view for ${name}`);
        // Add quick view logic here
    };

    return (
        <div
            className={`product-card ${!inStock ? 'out-of-stock' : ''}`}
            onMouseEnter={() => setIsHovered(true)}
            onMouseLeave={() => setIsHovered(false)}
        >
            <div className="product-image-container">
                <img src={imageUrl} alt={name} className="product-image" />

                {!inStock && <span className="product-badge stock">Out of Stock</span>}
                {isNew && inStock && <span className="product-badge new">New</span>}
                {discount > 0 && inStock && <span className="product-badge discount">-{discount}%</span>}

                <div className={`product-actions ${isHovered ? 'visible' : ''}`}>
                    <button
                        className="action-btn"
                        onClick={toggleWishlist}
                        disabled={!inStock}
                    >
                        <FaHeart className={isWishlisted ? 'wishlisted' : ''} />
                    </button>
                    <button
                        className="action-btn"
                        onClick={handleQuickView}
                        disabled={!inStock}
                    >
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
                <button
                    className={`add-to-cart-btn ${!inStock ? 'disabled' : ''}`}
                    onClick={handleAddToCart}
                    disabled={!inStock}
                >
                    <FaShoppingCart />
                    {inStock ? 'Add to Cart' : 'Out of Stock'}
                </button>
            </div>
        </div>
    );
};

export default ProductCard;
import React, { useState } from 'react';
import { FaShoppingCart, FaStar, FaHeart, FaEye } from 'react-icons/fa';
import '../styles/ProductCard.css';

const ProductCard = ({ product }) => {
    const [isWishlisted, setIsWishlisted] = useState(false);
    const [isHovered, setIsHovered] = useState(false);

    const {
        id,
        name,
        originalPrice,
        discount = 0,
        rating = 0,
        reviewCount = 0,
        imageUrl,
        isNew = false,
        inStock = true,
        brand = 'Unknown',
        category = 'General',
        description = '',
    } = product;

    const price = originalPrice - (originalPrice * discount / 100);

    const handleAddToCart = () => {
        if (!inStock) return;
        console.log(`Added ${id} to cart`);
    };

    const toggleWishlist = () => {
        if (!inStock) return;
        setIsWishlisted(!isWishlisted);
        console.log(`${name} ${isWishlisted ? 'removed from' : 'added to'} wishlist`);
    };

    const handleQuickView = () => {
        if (!inStock) return;
        console.log(`Quick view for ${name}`);
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
                {discount > 0 && inStock && (
                    <span className="product-badge discount">-{discount}%</span>
                )}

                <div className={`product-actions ${isHovered ? 'visible' : ''}`}>
                    <button className="action-btn" onClick={toggleWishlist} disabled={!inStock}>
                        <FaHeart className={isWishlisted ? 'wishlisted' : ''} />
                    </button>
                    <button className="action-btn" onClick={handleQuickView} disabled={!inStock}>
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

                <div className="product-meta">
                    <p><strong>Brand:</strong> {brand}</p>
                    <p><strong>Category:</strong> {category}</p>
                </div>

                <p className="product-description">{description}</p>

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

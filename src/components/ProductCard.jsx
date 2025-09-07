import React, { useState } from 'react';
import { FaShoppingCart, FaStar, FaHeart, FaEye } from 'react-icons/fa';
import '../styles/ProductCard.css';
import { useNavigate } from 'react-router-dom';

const ProductCard = ({ product }) => {
    const [isWishlisted, setIsWishlisted] = useState(false);
    const [isHovered, setIsHovered] = useState(false);
    const navigate = useNavigate();

    const {
        _id,
        name,
        originalPrice,
        discount = 0,
        images,
        inStock = true,
        brand = 'Unknown',
        category = 'General',
        description = '',
    } = product;

    const price = originalPrice - (originalPrice * discount / 100);

    const handleAddToCart = () => {
        if (!inStock) return;
        console.log(`Added ${_id} to cart`);
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

    const redirectProductDetail = () => {
        navigate(`/product/${_id}`);
    };

    return (
        <div
            className={`product-card ${!inStock ? 'out-of-stock' : ''}`}
            onMouseEnter={() => setIsHovered(true)}
            onMouseLeave={() => setIsHovered(false)}
            onClick={()=>redirectProductDetail()}
            style={{cursor: 'pointer'}}
        >
            <div className="product-image-container">
                <img src={images?.[0]} alt={name} className="product-image" />

                {!inStock && <span className="product-badge stock">Out of Stock</span>}
                {discount > 0 && inStock && (
                    <span className="product-badge discount">-{discount}%</span>
                )}
            </div>

            <div className="product-info">
                <h3 className="product-name " >{name}</h3>

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

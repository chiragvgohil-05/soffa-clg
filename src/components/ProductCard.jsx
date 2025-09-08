import React, { useState } from 'react';
import { FaShoppingCart, FaStar, FaHeart, FaEye } from 'react-icons/fa';
import '../styles/ProductCard.css';
import { useNavigate } from 'react-router-dom';
import apiClient from '../apiClient'; // Import your apiClient
import  toast  from 'react-hot-toast'; // Optional: for notifications

const ProductCard = ({ product }) => {
    const [isWishlisted, setIsWishlisted] = useState(false);
    const [isHovered, setIsHovered] = useState(false);
    const [isAddingToCart, setIsAddingToCart] = useState(false);
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

    const handleAddToCart = async (e) => {
        e.stopPropagation(); // Prevent navigation to product detail

        if (!inStock) return;

        setIsAddingToCart(true);
        try {
            // Make API call to add product to cart
            const response = await apiClient.post('/cart/add', {
                productId: _id,
                quantity: 1
            });

            // Show success message
            toast.success(response?.data?.message, {
                position: "top-right",
                autoClose: 2000,
            });

            console.log('Added to cart:', response.data);

        } catch (error) {
            console.error('Error adding to cart:', error);

            if (error.response?.status === 401) {
                toast.error('Please login to add items to cart', {
                    position: "top-right",
                    autoClose: 3000,
                });
                // Optionally redirect to login
                // navigate('/login');
            } else {
                toast.error('Failed to add item to cart', {
                    position: "top-right",
                    autoClose: 3000,
                });
            }
        } finally {
            setIsAddingToCart(false);
        }
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
                    className={`add-to-cart-btn ${!inStock ? 'disabled' : ''} ${isAddingToCart ? 'loading' : ''}`}
                    onClick={handleAddToCart}
                    disabled={!inStock || isAddingToCart}
                >
                    <FaShoppingCart />
                    {isAddingToCart ? 'Adding...' : inStock ? 'Add to Cart' : 'Out of Stock'}
                </button>
            </div>
        </div>
    );
};

export default ProductCard;
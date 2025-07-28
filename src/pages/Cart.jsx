// src/components/Cart.jsx
import React, { useState } from 'react';
import '../styles/Cart.css';
import headphones from '../assets/soffa.jpg';
import smartwatch from '../assets/soffa.jpg';
import BannerSlider from "../components/BannerSlider";
import cartBanner from "../assets/soffa.jpg";
import {NavLink} from "react-router-dom";

const Cart = () => {
    const [cartItems, setCartItems] = useState([
        {
            id: 1,
            name: 'Premium Wireless Headphones',
            price: 299.99,
            quantity: 1,
            image: headphones,
            color: 'Black',
            delivery: 'Free shipping'
        },
        {
            id: 2,
            name: 'Smart Watch Pro',
            price: 199.99,
            quantity: 2,
            image: smartwatch,
            color: 'Silver',
            delivery: 'Express shipping'
        }
    ]);

    const slides = [
        {
            id: 1,
            image: cartBanner,
            title: 'Your Shopping Journey',
            subtitle: 'Review & checkout your favorite items',
        },
    ];

    const updateQuantity = (id, delta) => {
        setCartItems(prev =>
            prev.map(item =>
                item.id === id
                    ? { ...item, quantity: Math.max(1, item.quantity + delta) }
                    : item
            )
        );
    };

    const removeItem = (id) => {
        setCartItems(prev => prev.filter(item => item.id !== id));
    };

    const subtotal = cartItems.reduce((sum, item) => sum + item.price * item.quantity, 0);
    const shipping = subtotal > 100 ? 0 : 9.99;
    const grandTotal = subtotal + shipping;

    return (
        <>
            <BannerSlider
                slides={slides}
                height="400px"
                autoPlay={false}
                showArrows={true}
                showDots={true}
                dotActiveColor="#FF6B6B"
                textColor="#fff"
                overlayColor="rgba(0,0,0,0.3)"
            />

            <div className="cart-container">
                <div className="cart-header">
                    <h2>Your Shopping Cart</h2>
                    <span className="item-count">{cartItems.length} {cartItems.length === 1 ? 'item' : 'items'}</span>
                </div>

                {cartItems.length === 0 ? (
                    <div className="empty-cart">
                        <div className="empty-cart-icon">🛒</div>
                        <h3>Your cart feels lonely</h3>
                        <p>Looks like you haven't added anything to your cart yet</p>
                        <NavLink to="/shop" className="continue-shopping">Continue Shopping</NavLink>
                    </div>
                ) : (
                    <div className="cart-body">
                        <div className="cart-left">
                            <div className="cart-list-header">
                                <span>Product</span>
                                <span>Price</span>
                                <span>Quantity</span>
                                <span>Total</span>
                                <span>Action</span>
                            </div>
                            <ul className="cart-list">
                                {cartItems.map(item => (
                                    <li key={item.id} className="cart-item">
                                        <div className="cart-product-info">
                                            <img src={item.image} alt={item.name} className="cart-img"/>
                                            <div className="product-details">
                                                <h4>{item.name}</h4>
                                                <div className="product-meta">
                                                    <span>Color: {item.color}</span>
                                                    <span>{item.delivery}</span>
                                                </div>
                                            </div>
                                        </div>
                                        <div className="product-price">${item.price.toFixed(2)}</div>
                                        <div className="quantity-controls">
                                            <button
                                                onClick={() => updateQuantity(item.id, -1)}
                                                disabled={item.quantity <= 1}
                                            >
                                                −
                                            </button>
                                            <span>{item.quantity}</span>
                                            <button onClick={() => updateQuantity(item.id, 1)}>+</button>
                                        </div>
                                        <div className="product-total">${(item.price * item.quantity).toFixed(2)}</div>
                                        <div className="product-action">
                                            <button
                                                className="remove-btn"
                                                onClick={() => removeItem(item.id)}
                                                aria-label="Remove item"
                                            >
                                                <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor">
                                                    <path d="M18 6L6 18M6 6l12 12" strokeWidth="2" strokeLinecap="round"/>
                                                </svg>
                                            </button>
                                        </div>
                                    </li>
                                ))}
                            </ul>
                        </div>
                        <div className="cart-right">
                            <div className="order-summary">
                                <h3>Order Summary</h3>
                                <div className="summary-row">
                                    <span>Subtotal</span>
                                    <span>${subtotal.toFixed(2)}</span>
                                </div>
                                <div className="summary-row">
                                    <span>Shipping</span>
                                    <span>{shipping === 0 ? 'Free' : `$${shipping.toFixed(2)}`}</span>
                                </div>
                                <div className="summary-divider"></div>
                                <div className="summary-row grand-total">
                                    <span>Total</span>
                                    <span>${grandTotal.toFixed(2)}</span>
                                </div>
                                <button className="checkout-btn">
                                    Proceed to Checkout
                                    <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor">
                                        <path d="M5 12h14M12 5l7 7-7 7" strokeWidth="2" strokeLinecap="round"/>
                                    </svg>
                                </button>
                                <div className="payment-methods">
                                    <span>We accept:</span>
                                    <div className="payment-icons">
                                        <span>💳</span>
                                        <span>📱</span>
                                        <span>💰</span>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                )}
            </div>
        </>
    );
};

export default Cart;
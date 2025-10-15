import React, { useEffect, useState } from "react";
import "../styles/Cart.css";
import BannerSlider from "../components/BannerSlider";
import cartBanner from "../assets/soffa.jpg";
import { NavLink } from "react-router-dom";
import { useCart } from "../context/CartContext";
import apiClient from "../apiClient";
import toast from "react-hot-toast";

// Load Razorpay script dynamically
const loadRazorpay = () => {
    return new Promise((resolve) => {
        if (window.Razorpay) {
            resolve(true);
            return;
        }

        const script = document.createElement("script");
        script.src = "https://checkout.razorpay.com/v1/checkout.js";
        script.onload = () => resolve(true);
        script.onerror = () => resolve(false);
        document.body.appendChild(script);
    });
};

const Cart = () => {
    const { cart, fetchCart, loading, updateQuantity, removeFromCart } = useCart();
    const [processing, setProcessing] = useState(false);

    const slides = [
        {
            id: 1,
            image: cartBanner,
            title: "Your Shopping Journey",
            subtitle: "Review & checkout your favorite items",
        },
    ];

    useEffect(() => {
        if (cart === null && !loading) {
            fetchCart();
        }
    }, [cart, loading, fetchCart]);

    // Checkout handler
    const handleCheckout = async () => {
        if (!cart || cart.items.length === 0) return;

        setProcessing(true);

        try {
            const isLoaded = await loadRazorpay();
            if (!isLoaded) {
                toast.error("Failed to load payment gateway");
                setProcessing(false);
                return;
            }

            // Create order on backend
            const response = await apiClient.post("/cart/create-order");

            const backendData = response.data.data || response.data;
            const orderData = backendData.order;
            const orderId = backendData.orderId;

            if (!orderData || !orderData.id) {
                throw new Error("Invalid order response from server");
            }

            // Razorpay options
            const options = {
                key: process.env.REACT_APP_RAZORPAY_KEY_ID,
                amount: orderData.amount || Math.round((cart.totalPrice + (cart.totalPrice > 1000 ? 0 : 99)) * 100),
                currency: orderData.currency || "INR",
                name: "Elegent Furniture",
                description: "Order Payment",
                image: "/logo.png",
                order_id: orderData.id,
                handler: async function (response) {
                    try {
                        await apiClient.post("/cart/verify-payment", {
                            razorpay_order_id: response.razorpay_order_id,
                            razorpay_payment_id: response.razorpay_payment_id,
                            razorpay_signature: response.razorpay_signature,
                            orderId: orderId,
                        });

                        toast.success("Payment successful! Order placed.");
                        fetchCart();
                        setProcessing(false);
                    } catch (error) {
                        console.error("Payment verification failed:", error);
                        toast.error(error.response?.data?.message || "Payment verification failed");
                        setProcessing(false);
                    }
                },
                prefill: {
                    name: "Customer",
                    email: "customer@example.com",
                    contact: "9999999999",
                },
                notes: { orderId },
                theme: { color: "#3399cc" },
                modal: {
                    ondismiss: function () {
                        toast.error("Payment cancelled");
                        setProcessing(false);
                    },
                },
            };

            const rzp = new window.Razorpay(options);
            rzp.open();

            rzp.on("payment.failed", function (response) {
                console.error("Payment failed:", response.error);
                toast.error(`Payment failed: ${response.error.description}`);
                setProcessing(false);
            });
        } catch (error) {
            console.error("Checkout error:", error);

            // ✅ Handle profile missing error specifically
            if (error.response?.data?.message?.includes("mobile number") || error.response?.data?.message?.includes("address")) {
                toast.error(error.response.data.message);
            } else if (error.response?.status === 404) {
                toast.error("Checkout service unavailable. Please try again later.");
            } else if (error.response?.data?.message) {
                toast.error(error.response.data.message);
            } else if (error.message) {
                toast.error(error.message);
            } else {
                toast.error("Failed to initiate checkout");
            }

            setProcessing(false);
        }
    };

    if (loading) return <div className="cart-container">Loading cart...</div>;

    if (!cart || cart.items.length === 0) {
        return (
            <>
                <BannerSlider slides={slides} height="400px" autoPlay={false} showArrows showDots />
                <div className="cart-container">
                    <div className="empty-cart">
                        <div className="empty-cart-icon">🛒</div>
                        <h3>Your cart feels lonely</h3>
                        <p>Looks like you haven't added anything to your cart yet</p>
                        <NavLink to="/shop" className="continue-shopping">
                            Continue Shopping
                        </NavLink>
                    </div>
                </div>
            </>
        );
    }

    const shipping = cart.totalPrice > 1000 ? 0 : 99;
    const totalAmount = cart.totalPrice + shipping;

    return (
        <>
            <BannerSlider slides={slides} height="400px" autoPlay={false} showArrows showDots />
            <div className="cart-container">
                <div className="cart-header">
                    <h2>Your Shopping Cart</h2>
                    <span className="item-count">
                        {cart.items.length} {cart.items.length === 1 ? "item" : "items"}
                    </span>
                </div>

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
                            {cart.items.map((item) => (
                                <li key={item._id} className="cart-item">
                                    <div className="cart-product-info">
                                        <img
                                            src={item.product.images?.[0] || cartBanner}
                                            alt={item.product.name}
                                            className="cart-img"
                                        />
                                        <div className="product-details">
                                            <h4>{item.product.name}</h4>
                                            <div className="product-meta">
                                                <span>Brand: {item.product.brand}</span>
                                                <span>Category: {item.product.category}</span>
                                            </div>
                                        </div>
                                    </div>

                                    <div className="product-price">₹{item.price}</div>

                                    <div className="quantity-controls">
                                        <button type="button" onClick={() => updateQuantity(item.product._id, -1)}>
                                            −
                                        </button>
                                        <span>{item.quantity}</span>
                                        <button type="button" onClick={() => updateQuantity(item.product._id, 1)}>
                                            +
                                        </button>
                                    </div>

                                    <div className="product-total">₹{item.price * item.quantity}</div>

                                    <div className="product-action">
                                        <button
                                            type="button"
                                            className="remove-btn"
                                            onClick={() => removeFromCart(item.product._id)}
                                            aria-label="Remove item"
                                        >
                                            <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor">
                                                <path d="M18 6L6 18M6 6l12 12" strokeWidth="2" strokeLinecap="round" />
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
                                <span>₹{cart.totalPrice}</span>
                            </div>
                            <div className="summary-row">
                                <span>Shipping</span>
                                <span>{shipping === 0 ? "Free" : `₹${shipping}`}</span>
                            </div>
                            <div className="summary-divider" />
                            <div className="summary-row grand-total">
                                <span>Total</span>
                                <span>₹{totalAmount}</span>
                            </div>
                            <button className="checkout-btn" onClick={handleCheckout} disabled={processing}>
                                {processing ? "Processing..." : "Proceed to Checkout"}
                            </button>
                        </div>
                    </div>
                </div>
            </div>
        </>
    );
};

export default Cart;

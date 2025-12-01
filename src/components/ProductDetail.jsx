import React, { useState } from "react";
import "../styles/ProductDetail.css";
import apiClient from "../apiClient";
import toast from "react-hot-toast";
import { useCart } from "../context/CartContext"; // Import the CartContext

const ProductDetail = ({ product }) => {
    const [selectedImage, setSelectedImage] = useState(
        product?.images?.[0] || ""
    );
    const [isAddingToCart, setIsAddingToCart] = useState(false);
    const { fetchCart } = useCart(); // Get fetchCart from CartContext

    if (!product) return <p>No product data available</p>;

    const {
        _id,
        name,
        originalPrice,
        discount = 0,
        images,
        isNew,
        inStock,
        brand,
        category,
        description,
        price,
    } = product;

    const finalPrice = price || (originalPrice - (originalPrice * discount) / 100);

    // ✅ Handle Add to Cart API
    const handleAddToCart = async () => {
        if (!inStock) return;

        setIsAddingToCart(true);
        try {
            const response = await apiClient.post("/cart/add", {
                productId: _id,
                quantity: 1,
            });

            toast.success(response?.data?.message || "Added to cart!", {
                position: "top-right",
                autoPlay: 2000,
            });

            console.log("Added to cart:", response.data);

            // Refresh the cart data after successful addition
            fetchCart();

        } catch (error) {
            console.error("Error adding to cart:", error);

            if (error.response?.status === 401) {
                toast.error("Please login to add items to cart", {
                    position: "top-right",
                    autoPlay: 3000,
                });
            } else {
                toast.error("Failed to add item to cart", {
                    position: "top-right",
                    autoPlay: 3000,
                });
            }
        } finally {
            setIsAddingToCart(false);
        }
    };

    return (
        <div className="pdp">
            {/* LEFT: IMAGES */}
            <div className="pdp__images">
                <div className="pdp__main-image">
                    <img
                        src={selectedImage || "https://via.placeholder.com/400"}
                        alt={name}
                    />
                    {isNew && <span className="pdp__badge">New</span>}
                    {!inStock && <span className="pdp__badge out">Out of Stock</span>}
                </div>

                <div className="pdp__thumbnails">
                    {images?.map((img, index) => (
                        <img
                            key={index}
                            src={img}
                            alt={`${name} ${index}`}
                            className={`pdp__thumb ${
                                selectedImage === img ? "active" : ""
                            }`}
                            onClick={() => setSelectedImage(img)}
                        />
                    ))}
                </div>
            </div>

            {/* RIGHT: CONTENT */}
            <div className="pdp__content">
                <h1 className="pdp__title">{name}</h1>
                <p className="pdp__brand">Brand: {brand}</p>
                <p className="pdp__category">Category: {category}</p>

                <div className="pdp__price">
                    <span className="pdp__final">₹{finalPrice.toFixed(2)}</span>
                    {discount > 0 && (
                        <>
                            <span className="pdp__original">₹{originalPrice}</span>
                            <span className="pdp__discount">-{discount}%</span>
                        </>
                    )}
                </div>

                <p className="pdp__desc">{description}</p>

                <button
                    className="pdp__btn"
                    onClick={handleAddToCart}
                    disabled={!inStock || isAddingToCart}
                >
                    {isAddingToCart
                        ? "Adding..."
                        : inStock
                            ? "Add to Cart"
                            : "Unavailable"}
                </button>
            </div>
        </div>
    );
};

export default ProductDetail;
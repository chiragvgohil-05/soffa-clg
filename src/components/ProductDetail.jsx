import React, { useState } from "react";
import "../styles/ProductDetail.css";

const ProductDetail = ({ product }) => {
    const [selectedImage, setSelectedImage] = useState(
        product?.images?.[0] || ""
    );

    if (!product) return <p>No product data available</p>;

    const {
        name,
        originalPrice,
        discount = 0,
        rating = 0,
        reviewCount = 0,
        images,
        isNew,
        inStock,
        brand,
        category,
        description,
        price,
    } = product;

    const finalPrice = price || (originalPrice - (originalPrice * discount) / 100);

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

                <button className="pdp__btn" disabled={!inStock}>
                    {inStock ? "Add to Cart" : "Unavailable"}
                </button>
                <button className="pdp_checkout_btn">Check Out</button>
            </div>
        </div>
    );
};

export default ProductDetail;

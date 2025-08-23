import React from "react";
import ProductDetail from "../components/ProductDetail";
import soffa from '../assets/soffa.jpg';
import chair from '../assets/chair.jpg';


const ProductPage = () => {

    const product = {
        id: 1,
        name: "Luxury Toy Car",
        originalPrice: 2000,
        discount: 20,
        rating: 4.5,
        reviewCount: 120,
        imageUrl: [
            chair,
            soffa,
        ],
        isNew: true,
        inStock: true,
        brand: "SpeedX",
        category: "Toys",
        description: "A premium toy car with realistic design and durable build."
    };


    return (
        <>
            <div>
                <ProductDetail product={product} />
            </div>
        </>
    );
};

export default ProductPage;

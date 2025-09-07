// src/pages/ProductDetailPage.jsx
import React, { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import apiClient from "../apiClient";
import ProductDetail from "../components/ProductDetail";

const ProductDetailPage = () => {
    const { id } = useParams(); // get product id from URL
    const [product, setProduct] = useState(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);

    useEffect(() => {
        const fetchProduct = async () => {
            try {
                const res = await apiClient.get(`/products/${id}`);
                setProduct(res.data.data); // backend sends { data: product }
            } catch (err) {
                console.error("Error fetching product:", err);
                setError("Failed to load product details");
            } finally {
                setLoading(false);
            }
        };

        fetchProduct();
    }, [id]);

    if (loading) return <p>Loading product...</p>;
    if (error) return <p>{error}</p>;
    if (!product) return <p>No product found</p>;

    return <ProductDetail product={product} />;
};

export default ProductDetailPage;

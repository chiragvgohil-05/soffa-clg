import React, { useEffect, useState } from 'react';
import '../../styles/admin.css';
import ProductCard from '../../components/ProductCard';
import { useNavigate } from 'react-router-dom';
import apiStore from "../../../apiClient";
import toast from "react-hot-toast";

const Products = () => {
    const [products, setProducts] = useState([]);
    const [loading, setLoading] = useState(true);
    const navigate = useNavigate();

    const fetchProducts = async () => {
        try {
            const res = await apiStore.get("/products");
            console.log(res.data.data);
            setProducts(res.data.data);
        } catch (err) {
            console.error(err);
            toast.error("Failed to load profile", { id: "profile-toast" });
        }
    };

    useEffect(() => {
        fetchProducts();
    }, []);

    const handleEdit = (productId) => {
        navigate(`/admin/products/edit/${productId}`);
    };

    const handleDelete = async (productId) => {
        try {
            await fetch(`http://localhost:3000/api/products/${productId}`, {
                method: "DELETE",
            });
            // remove from state
            setProducts(prev => prev.filter(p => p.id !== productId));
        } catch (error) {
            console.error("Error deleting product:", error);
        }
    };

    const handleAddProduct = () => {
        navigate('/admin/products/create');
    };

    return (
        <>
            <div className="product-header">
                <h1 className="page-title">Products</h1>
                <button className="add-product-button" onClick={handleAddProduct}>
                    Add Product
                </button>
            </div>
        <div className="admin-content products">
            <div className="products-grid-container">
                <div className="products-grid">
                    {products.map(product => (
                        <ProductCard
                            key={product.id}
                            {...product}
                            onEdit={handleEdit}
                            onDelete={handleDelete}
                        />
                    ))}
                </div>
            </div>
        </div>
        </>
    );
};

export default Products;

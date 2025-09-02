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
            setLoading(true);
            const res = await apiStore.get("/products");
            console.log(res.data.data);
            setProducts(res.data.data);
        } catch (err) {
            console.error(err);
            toast.error("Failed to load products", { id: "products-toast" });
        } finally {
            setLoading(false);
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
            // Use the same apiStore instance for consistency
            await apiStore.delete(`/products/${productId}`);

            // Remove from state - use _id instead of id
            setProducts(prev => prev.filter(p => p._id !== productId));

            toast.success("Product deleted successfully");
        } catch (error) {
            console.error("Error deleting product:", error);
            toast.error("Failed to delete product");
        }
    };

    const handleAddProduct = () => {
        navigate('/admin/products/create');
    };

    if (loading) {
        return (
            <div className="admin-content products">
                <div className="loading-container">
                    <div className="loading-spinner"></div>
                    <p>Loading products...</p>
                </div>
            </div>
        );
    }

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
                    {products.length === 0 ? (
                        <div className="empty-state">
                            <p>No products found.</p>
                            <button className="add-product-button" onClick={handleAddProduct}>
                                Add Your First Product
                            </button>
                        </div>
                    ) : (
                        <div className="products-grid">
                            {products.map(product => (
                                <ProductCard
                                    key={product._id}
                                    {...product}
                                    onEdit={handleEdit}
                                    onDelete={handleDelete}
                                />
                            ))}
                        </div>
                    )}
                </div>
            </div>
        </>
    );
};

export default Products;
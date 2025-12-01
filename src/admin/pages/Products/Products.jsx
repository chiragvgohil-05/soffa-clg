import React, { useEffect, useState } from 'react';
import '../../styles/admin.css';
import ProductCard from '../../components/ProductCard';
import { useNavigate } from 'react-router-dom';
import apiStore from "../../../apiClient";
import toast from "react-hot-toast";

const Products = () => {
    const [products, setProducts] = useState([]);
    const [meta, setMeta] = useState({});
    const [page, setPage] = useState(1);
    const [search, setSearch] = useState("");    // 🔥 search input
    const limit = 12;
    const [loading, setLoading] = useState(true);
    const navigate = useNavigate();

    const fetchProducts = async (currentPage = 1, query = "") => {
        try {
            setLoading(true);

            const res = await apiStore.get(
                `/products?page=${currentPage}&limit=${limit}&search=${query}`
            );

            setProducts(res.data.data.data);
            setMeta(res.data.data.meta);

        } catch (err) {
            console.error(err);
            toast.error("Failed to load products");
        } finally {
            setLoading(false);
        }
    };

    // 🔍 Debounced search effect
    useEffect(() => {
        setProducts([]);
        setLoading(true);

        const timer = setTimeout(() => {
            fetchProducts(page, search);
        }, 300);

        return () => clearTimeout(timer);
    }, [page, search]);


    const handleEdit = (productId) => navigate(`/admin/products/edit/${productId}`);

    const handleDelete = async (productId) => {
        try {
            await apiStore.delete(`/products/${productId}`);
            setProducts(prev => prev.filter(p => p._id !== productId));
            toast.success("Product deleted successfully");
        } catch (error) {
            console.error("Error deleting product:", error);
            toast.error("Failed to delete product");
        }
    };

    const handleAddProduct = () => navigate('/admin/products/create');

    const handleNext = () => {
        if (meta?.hasNextPage) setPage(prev => prev + 1);
    };

    const handlePrev = () => {
        if (meta?.hasPrevPage) setPage(prev => prev - 1);
    };


    return (
        <>
            <div className="product-header">
                <h1 className="page-title">Products</h1>

                {/* 🔥 SEARCH INPUT */}
                <input
                    type="text"
                    className="search-input"
                    placeholder="Search products..."
                    value={search}
                    onChange={(e) => setSearch(e.target.value)}
                />

                <button className="add-product-button" onClick={handleAddProduct}>
                    Add Product
                </button>
            </div>

            <div className="admin-content products">
                <div className="products-grid-container">
                    {loading ? (
                        <div className="loading-container">
                            <div className="loading-spinner"></div>
                            <p>Loading products...</p>
                        </div>
                    ) : products.length === 0 ? (
                        <div className="empty-state">
                            <p>No products found.</p>
                            <button className="add-product-button" onClick={handleAddProduct}>
                                Add Your First Product
                            </button>
                        </div>
                    ) : (
                        <>
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

                            {/* 🔥 PAGINATION */}
                            <div className="pagination">
                                <button
                                    className="pagination-btn"
                                    disabled={!meta?.hasPrevPage}
                                    onClick={handlePrev}
                                >
                                    Prev
                                </button>

                                <span className="pagination-info">
                                    Page {meta?.page} of {meta?.totalPages}
                                </span>

                                <button
                                    className="pagination-btn"
                                    disabled={!meta?.hasNextPage}
                                    onClick={handleNext}
                                >
                                    Next
                                </button>
                            </div>
                        </>
                    )}
                </div>
            </div>
        </>
    );
};

export default Products;

// src/pages/Shop.jsx
import React, { useState, useEffect, useMemo } from "react";
import apiClient from "../apiClient";
import FilterSidebar from "../components/FilterSidebar";
import ProductCard from "../components/ProductCard";
import Modal from "../components/Modal";
import BannerSlider from "../components/BannerSlider";
import chair from "../assets/chair.jpg";

const Shop = () => {
    const [isOpen, setIsOpen] = useState(false);
    const [products, setProducts] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);

    const slides = [
        {
            id: 1,
            image: chair,
            title: "Shop Now",
            subtitle: "Discover our latest products",
        },
    ];

    useEffect(() => {
        const fetchProducts = async () => {
            try {
                const res = await apiClient.get("/products");
                setProducts(res.data.data); // assuming backend sends { data: [...] }
                setLoading(false);
            } catch (err) {
                console.error("Error fetching products:", err);
                setError("Failed to load products");
                setLoading(false);
            }
        };
        fetchProducts();
    }, []);

    const [filters, setFilters] = useState({
        category: "",
        brand: "",
        minRating: 0,
        inStock: false,
    });
    const [searchTerm, setSearchTerm] = useState("");

    const handleFilterChange = (key, value) => {
        setFilters((prev) => ({ ...prev, [key]: value }));
    };

    const clearFilters = () => {
        setFilters({
            category: "",
            brand: "",
            minRating: 0,
            inStock: false,
        });
        setSearchTerm("");
    };

    const categories = [...new Set(products?.map((p) => p.category))];
    const brands = [...new Set(products?.map((p) => p.brand))];

    const filteredProducts = useMemo(() => {
        return products.filter((product) => {
            const price =
                product.price ||
                product.originalPrice -
                (product.originalPrice * product.discount) / 100;
            return (
                product.name.toLowerCase().includes(searchTerm.toLowerCase()) &&
                (!filters.category || product.category === filters.category) &&
                (!filters.brand || product.brand === filters.brand) &&
                (!filters.inStock || product.inStock)
            );
        });
    }, [products, filters, searchTerm]);

    if (loading) return <p>Loading products...</p>;
    if (error) return <p>{error}</p>;

    return (
        <>
            <BannerSlider
                slides={slides}
                height="500px"
                autoPlay={true}
                interval={3000}
                showArrows={true}
                showDots={true}
            />

            <div className="container shop-page">
                {/* Sidebar (Desktop) */}
                <div className="desktop-container">
                    <FilterSidebar
                        filters={filters}
                        categories={categories}
                        brands={brands}
                        searchTerm={searchTerm}
                        onSearchChange={setSearchTerm}
                        onFilterChange={handleFilterChange}
                        onClearFilters={clearFilters}
                    />
                </div>

                {/* Sidebar (Mobile) */}
                <div className="mobile-container" style={{ padding: "1rem" }}>
                    <button
                        onClick={() => setIsOpen(true)}
                        style={{
                            backgroundColor: "#3b82f6",
                            color: "white",
                            border: "none",
                            padding: "10px 20px",
                            borderRadius: "6px",
                            cursor: "pointer",
                        }}
                    >
                        Filter
                    </button>
                </div>

                {/* Product Grid */}
                <div style={{ flex: 1 }}>
                    <div className="shop-product-grid">
                        {filteredProducts?.map((product) => (
                            <ProductCard key={product._id} product={product} />
                        ))}
                    </div>
                    {filteredProducts.length === 0 && (
                        <p style={{ marginTop: "40px" }}>No products match your filter.</p>
                    )}
                </div>

                {/* Modal Filter (Mobile) */}
                <Modal
                    isOpen={isOpen}
                    onClose={() => setIsOpen(false)}
                    title="Filters"
                    size="small"
                >
                    <FilterSidebar
                        filters={filters}
                        categories={categories}
                        brands={brands}
                        searchTerm={searchTerm}
                        onSearchChange={setSearchTerm}
                        onFilterChange={handleFilterChange}
                        onClearFilters={clearFilters}
                    />
                    <div
                        style={{
                            display: "flex",
                            justifyContent: "flex-end",
                            marginTop: "1rem",
                        }}
                    >
                        <button
                            onClick={() => setIsOpen(false)}
                            style={{
                                backgroundColor: "#10b981",
                                color: "white",
                                border: "none",
                                padding: "10px 20px",
                                borderRadius: "6px",
                                cursor: "pointer",
                            }}
                        >
                            Apply Filters
                        </button>
                    </div>
                </Modal>
            </div>
        </>
    );
};

export default Shop;

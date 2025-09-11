import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import apiClient from "../apiClient"; // your configured Axios instance

const SearchPage = () => {
    const [query, setQuery] = useState("");
    const [results, setResults] = useState([]);
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState("");
    const navigate = useNavigate();

    const handleSearch = async (e) => {
        e.preventDefault();
        if (!query.trim()) return;

        try {
            setLoading(true);
            setError("");
            setResults([]);

            const res = await apiClient.get(`/products/search?query=${query}`);

            if (res.data && res.data.data) {
                setResults(res.data.data);
            } else {
                setResults([]);
            }
        } catch (err) {
            console.error("Search error:", err);
            setError("Failed to fetch products");
        } finally {
            setLoading(false);
        }
    };

    const handleClick = (id) => {
        navigate(`/product/${id}`);
    };

    return (
        <div
            style={{
                minHeight: "100vh",
                background: "linear-gradient(135deg, #f5f7fa 0%, #c3cfe2 100%)",
                padding: "20px",
                display: "flex",
                justifyContent: "center",
                alignItems: "flex-start",
                fontFamily: "'Segoe UI', Tahoma, Geneva, Verdana, sans-serif"
            }}
        >
            <div
                style={{
                    backgroundColor: "#fff",
                    padding: "40px",
                    borderRadius: "20px",
                    boxShadow: "0 15px 30px rgba(0,0,0,0.1)",
                    width: "100%",
                    maxWidth: "800px",
                    marginTop: "40px",
                    transition: "transform 0.3s ease",
                }}
                onMouseEnter={(e) => e.currentTarget.style.transform = "translateY(-5px)"}
                onMouseLeave={(e) => e.currentTarget.style.transform = "translateY(0)"}
            >
                <div style={{ textAlign: "center", marginBottom: "30px" }}>
                    <h2 style={{
                        marginBottom: "10px",
                        color: "#2d3436",
                        fontSize: "32px",
                        fontWeight: "700",
                        background: "linear-gradient(45deg, #6c5ce7, #00cec9)",
                        WebkitBackgroundClip: "text",
                        WebkitTextFillColor: "transparent"
                    }}>
                        Discover Amazing Products
                    </h2>
                    <p style={{ color: "#636e72", marginTop: "0" }}>
                        Find exactly what you're looking for from our collection
                    </p>
                </div>

                {/* Search Form */}
                <form
                    onSubmit={handleSearch}
                    style={{
                        display: "flex",
                        gap: "15px",
                        alignItems: "center",
                        marginBottom: "30px",
                        position: "relative"
                    }}
                >
                    <div style={{ position: "relative", flex: 1 }}>
                        <input
                            type="text"
                            placeholder="Search products..."
                            value={query}
                            onChange={(e) => setQuery(e.target.value)}
                            style={{
                                width: "100%",
                                padding: "18px 20px 18px 45px",
                                borderRadius: "50px",
                                border: "2px solid #ddd",
                                fontSize: "16px",
                                outline: "none",
                                transition: "all 0.3s ease",
                                boxShadow: "0 4px 10px rgba(0,0,0,0.05)"
                            }}
                            onFocus={(e) => e.target.style.borderColor = "#6c5ce7"}
                            onBlur={(e) => e.target.style.borderColor = "#ddd"}
                        />
                        <span style={{
                            position: "absolute",
                            left: "20px",
                            top: "50%",
                            transform: "translateY(-50%)",
                            color: "#aaa"
                        }}>
                            🔍
                        </span>
                    </div>
                    <button
                        type="submit"
                        disabled={loading}
                        style={{
                            padding: "18px 30px",
                            borderRadius: "50px",
                            border: "none",
                            background: loading ? "#b2bec3" : "linear-gradient(45deg, #6c5ce7, #00cec9)",
                            color: "#fff",
                            fontSize: "16px",
                            fontWeight: "bold",
                            cursor: loading ? "default" : "pointer",
                            boxShadow: "0 4px 15px rgba(108, 92, 231, 0.3)",
                            transition: "all 0.3s ease",
                            opacity: loading ? 0.8 : 1
                        }}
                        onMouseEnter={(e) => {
                            if (!loading) {
                                e.target.style.transform = "translateY(-2px)";
                                e.target.style.boxShadow = "0 7px 15px rgba(108, 92, 231, 0.4)";
                            }
                        }}
                        onMouseLeave={(e) => {
                            if (!loading) {
                                e.target.style.transform = "translateY(0)";
                                e.target.style.boxShadow = "0 4px 15px rgba(108, 92, 231, 0.3)";
                            }
                        }}
                    >
                        {loading ? (
                            <span style={{ display: "flex", alignItems: "center", justifyContent: "center" }}>
                                <span style={{
                                    display: "inline-block",
                                    width: "16px",
                                    height: "16px",
                                    border: "2px solid rgba(255,255,255,0.3)",
                                    borderTop: "2px solid white",
                                    borderRadius: "50%",
                                    marginRight: "8px",
                                    animation: "spin 1s linear infinite"
                                }}></span>
                                Searching...
                            </span>
                        ) : "Search"}
                    </button>
                </form>

                {/* Error message */}
                {error && (
                    <div style={{
                        backgroundColor: "#ffebee",
                        color: "#c62828",
                        padding: "15px",
                        borderRadius: "10px",
                        marginBottom: "20px",
                        display: "flex",
                        alignItems: "center",
                        gap: "10px"
                    }}>
                        <span style={{ fontSize: "20px" }}>⚠️</span>
                        <span>{error}</span>
                    </div>
                )}

                {/* Results */}
                <div>
                    {results.length > 0 ? (
                        <div style={{
                            backgroundColor: "#f8f9fa",
                            borderRadius: "15px",
                            padding: "20px",
                            boxShadow: "inset 0 2px 5px rgba(0,0,0,0.05)"
                        }}>
                            <h3 style={{
                                margin: "0 0 15px 0",
                                color: "#2d3436",
                                display: "flex",
                                alignItems: "center",
                                gap: "8px"
                            }}>
                                <span>Search Results</span>
                                <span style={{
                                    backgroundColor: "#6c5ce7",
                                    color: "white",
                                    borderRadius: "50%",
                                    width: "25px",
                                    height: "25px",
                                    display: "flex",
                                    alignItems: "center",
                                    justifyContent: "center",
                                    fontSize: "12px"
                                }}>
                                    {results.length}
                                </span>
                            </h3>
                            <div style={{
                                display: "grid",
                                gridTemplateColumns: "repeat(auto-fill, minmax(300px, 1fr))",
                                gap: "20px"
                            }}>
                                {results.map((product) => (
                                    <div
                                        key={product._id}
                                        onClick={() => handleClick(product._id)}
                                        style={{
                                            backgroundColor: "#fff",
                                            border: "1px solid #eee",
                                            padding: "20px",
                                            borderRadius: "15px",
                                            cursor: "pointer",
                                            transition: "all 0.3s ease",
                                            boxShadow: "0 4px 10px rgba(0,0,0,0.05)",
                                            position: "relative",
                                            overflow: "hidden"
                                        }}
                                        onMouseEnter={(e) => {
                                            e.currentTarget.style.transform = "translateY(-5px)";
                                            e.currentTarget.style.boxShadow = "0 10px 20px rgba(0,0,0,0.1)";
                                        }}
                                        onMouseLeave={(e) => {
                                            e.currentTarget.style.transform = "translateY(0)";
                                            e.currentTarget.style.boxShadow = "0 4px 10px rgba(0,0,0,0.05)";
                                        }}
                                    >
                                        <div style={{
                                            position: "absolute",
                                            top: "0",
                                            left: "0",
                                            right: "0",
                                            height: "5px",
                                            background: "linear-gradient(90deg, #6c5ce7, #00cec9)",
                                            borderRadius: "15px 15px 0 0"
                                        }}></div>
                                        <div style={{
                                            display: "flex",
                                            alignItems: "center",
                                            gap: "15px",
                                            marginBottom: "15px"
                                        }}>
                                            <img
                                                src={product.images?.[0] || "https://via.placeholder.com/80"}
                                                alt={product.name}
                                                style={{
                                                    width: "80px",
                                                    height: "80px",
                                                    objectFit: "cover",
                                                    borderRadius: "10px",
                                                    boxShadow: "0 4px 8px rgba(0,0,0,0.1)"
                                                }}
                                            />
                                            <div style={{ textAlign: "left", flex: 1 }}>
                                                <h4 style={{
                                                    margin: "0 0 8px 0",
                                                    color: "#2d3436",
                                                    fontSize: "16px",
                                                    fontWeight: "600"
                                                }}>
                                                    {product.name}
                                                </h4>
                                                <p style={{
                                                    margin: "0 0 5px 0",
                                                    color: "#636e72",
                                                    fontSize: "14px"
                                                }}>
                                                    {product.brand || "Generic Brand"}
                                                </p>
                                                <p style={{
                                                    margin: "0",
                                                    color: "#6c5ce7",
                                                    fontWeight: "bold",
                                                    fontSize: "18px"
                                                }}>
                                                    ₹{product.price}
                                                </p>
                                            </div>
                                        </div>
                                        <div style={{
                                            display: "flex",
                                            justifyContent: "flex-end"
                                        }}>
                                            <span style={{
                                                color: "#00cec9",
                                                fontSize: "14px",
                                                fontWeight: "500",
                                                display: "flex",
                                                alignItems: "center",
                                                gap: "5px"
                                            }}>
                                                View Details →
                                            </span>
                                        </div>
                                    </div>
                                ))}
                            </div>
                        </div>
                    ) : (
                        !loading &&
                        query && (
                            <div style={{
                                textAlign: "center",
                                padding: "40px 20px",
                                color: "#636e72"
                            }}>
                                <div style={{ fontSize: "60px", marginBottom: "20px" }}>🔍</div>
                                <h3 style={{ color: "#2d3436", marginBottom: "10px" }}>No products found</h3>
                                <p>Try different keywords or check for spelling mistakes</p>
                            </div>
                        )
                    )}
                </div>
            </div>

            <style>
                {`
                @keyframes spin {
                    0% { transform: rotate(0deg); }
                    100% { transform: rotate(360deg); }
                }
                
                input::placeholder {
                    color: #aaa;
                }
                
                * {
                    box-sizing: border-box;
                }
                `}
            </style>
        </div>
    );
};

export default SearchPage;
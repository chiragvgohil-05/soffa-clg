// src/pages/Home.jsx
import React, { useEffect, useState } from "react";
import BannerSlider from "../components/BannerSlider";
import soffa from "../assets/soffa.jpg";
import singleSoffa from "../assets/single_soffa.jpg";
import singleChair from "../assets/single_chair.jpg";
import youtubeIcon from "../assets/svg/youtube.svg";
import instagramIcon from "../assets/svg/instal.svg";
import facebookIcon from "../assets/svg/facebook.svg";
import demo from "../assets/svg/demo.svg";
import chair from "../assets/chair.jpg";
import ProductCard from "../components/ProductCard";
import Banner from "../components/Banner";
import CategoryCard from "../components/CategoryCard";
import SectionHeading from "../components/SectionHeading";
import ReviewCard from "../components/ReviewCard";
import apiClient from "../apiClient";

function Home() {
    const [products, setProducts] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);

    // ✅ Fetch products from API
    useEffect(() => {
        const fetchProducts = async () => {
            try {
                const res = await apiClient.get("/products");
                setProducts(res.data.data.data); // assuming backend sends { data: [...] }
                setLoading(false);
            } catch (err) {
                console.error("Error fetching products:", err);
                setError("Failed to load products");
                setLoading(false);
            }
        };
        fetchProducts();
    }, []);

    const slides = [
        {
            id: 1,
            image: soffa,
            title: "Explore Nature",
            subtitle: "Discover the beauty of untouched landscapes",
            buttonText: "Learn More",
            buttonLink: "#",
        },
        {
            id: 2,
            image: chair,
            title: "Urban Adventures",
            subtitle: "Experience the pulse of modern city life",
            buttonText: "Explore",
            buttonLink: "#",
        },
    ];

    const categories = [
        {
            name: "Sofas",
            image: singleSoffa,
            url: "/shop?category=soffa",
        },
        {
            name: "Chairs",
            image: singleChair,
            url: "/shop?category=chair",
        },
    ];

    const followUsLinks = [
        { name: "YouTube", url: "https://www.youtube.com", image: youtubeIcon },
        { name: "Instagram", url: "https://www.instagram.com", image: instagramIcon },
        { name: "Facebook", url: "https://www.facebook.com", image: facebookIcon },
    ];

    const reviews = [
        {
            name: "Ravina B.",
            review:
                "Nice material and nice service. Rate is reasonable compare to other. Thank you.",
        },
        {
            name: "Pratima",
            review:
                "Their whatsapp service are very good. I got full support and timely answer. I have bought for my friend as gift. nice dress.",
        },
        {
            name: "Roshni raahi",
            review: "I was redirected from instagram . and this was better than expected.",
        },
    ];

    return (
        <div>
            {/* ✅ Banner Slider */}
            <BannerSlider
                slides={slides}
                height="500px"
                autoPlay={true}
                interval={3000}
                showArrows={true}
                showDots={true}
                dotActiveColor="#4CAF50"
                backgroundColor="#333"
            />

            {/* ✅ Categories */}
            <div>
                <SectionHeading title="Category" leftIcon={demo} rightIcon={demo} />
                <div className="category-container" style={{ marginTop: "0" }}>
                    {categories.map((cat, index) => (
                        <CategoryCard
                            key={index}
                            name={cat.name}
                            image={cat.image}
                            url={cat.url}
                        />
                    ))}
                </div>
            </div>

            {/* ✅ Featured Products */}
            <div className="container">
                <div>
                    <SectionHeading
                        title="Featured Products"
                        leftIcon={demo}
                        rightIcon={demo}
                    />
                </div>
                {loading ? (
                    <p>Loading products...</p>
                ) : error ? (
                    <p>{error}</p>
                ) : (
                    <div
                        style={{
                            display: "flex",
                            flexWrap: "wrap",
                            gap: "20px",
                            justifyContent: "center",
                        }}
                    >
                        {products?.slice(0, 4).map((product) => (
                            <ProductCard key={product._id} product={product} />
                        ))}
                    </div>
                )}
            </div>

            {/* ✅ Banner Section */}
            <div className="container" style={{ padding: "50px 0 0" }}>
                <Banner
                    imageUrl={soffa}
                    title="Summer Collection"
                    subtitle="New Arrivals"
                    description="Discover our new summer collection with fresh styles and colors for the season."
                    ctaText="Shop Now"
                    ctaLink="/summer-collection"
                    layout="right"
                    backgroundColor="#f0f8ff"
                    textColor="#333"
                    ctaColor="#ff6b6b"
                />
            </div>

            {/* ✅ Trending Products */}
            {products.length > 4 && (
                <div className="container">
                    <SectionHeading
                        title="Trending Products"
                        leftIcon={demo}
                        rightIcon={demo}
                    />
                    {loading ? (
                        <p>Loading products...</p>
                    ) : error ? (
                        <p>{error}</p>
                    ) : (
                        <div
                            style={{
                                display: "flex",
                                flexWrap: "wrap",
                                gap: "20px",
                                justifyContent: "center",
                            }}
                        >
                            {products.slice(4, 8).map((product) => (
                                <ProductCard key={product._id} product={product} />
                            ))}
                        </div>
                    )}
                </div>
            )}

            {/* ✅ Exclusive Banner */}
            <div className="container" style={{ padding: "50px 0" }}>
                <Banner
                    imageUrl={chair}
                    title="Exclusive Offer"
                    subtitle="Limited Time Only"
                    description="Get 20% off on your first purchase. Use code: FIRST20 at checkout."
                    ctaText="Grab Now"
                    ctaLink="#"
                    layout="left"
                    backgroundColor="#fff3e0"
                    textColor="#333"
                    ctaColor="#ff9800"
                />
            </div>

            {/* ✅ Customer Reviews */}
            <div className="container">
                <SectionHeading
                    title="Customer Reviews"
                    leftIcon={demo}
                    rightIcon={demo}
                    color="#caa636"
                />
                <div
                    style={{
                        display: "flex",
                        flexWrap: "wrap",
                        justifyContent: "center",
                        gap: "20px",
                    }}
                >
                    {reviews.map((item, index) => (
                        <ReviewCard key={index} name={item.name} review={item.review} />
                    ))}
                </div>
            </div>
            <br/>
        </div>
    );
}

export default Home;

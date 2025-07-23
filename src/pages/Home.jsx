import React from 'react'
import BannerSlider from '../components/BannerSlider';
import soffa from '../assets/soffa.jpg';
import chair from '../assets/chair.jpg';
import ProductCard from "../components/ProductCard";
import Banner from "../components/Banner";

function Home() {
 const slides = [
    {
      id: 1,
      image: soffa,
      title: 'Explore Nature',
      subtitle: 'Discover the beauty of untouched landscapes',
      buttonText: 'Learn More',
      buttonLink: '#'
    },
    {
      id: 2,
      image: chair,
      title: 'Urban Adventures',
      subtitle: 'Experience the pulse of modern city life',
      buttonText: 'Explore',
      buttonLink: '#'
    },
  ];
    const products = [
        {
            id: 1,
            name: 'Wireless Bluetooth Headphones',
            price: 89.99,
            originalPrice: 129.99,
            rating: 4,
            reviewCount: 124,
            imageUrl: soffa,
            isNew: true,
            discount: 30,
        },
        {
            id: 2,
            name: 'Smart Watch Pro',
            price: 199.99,
            originalPrice: 249.99,
            rating: 5,
            reviewCount: 89,
            imageUrl: chair,
            isNew: false,
            discount: 20,
        },
        {
            id: 3,
            name: 'Wireless Earbuds',
            price: 59.99,
            originalPrice: 79.99,
            rating: 3,
            reviewCount: 215,
            imageUrl: chair,
            isNew: true,
            discount: 25,
        },
    ];
  return (
    <div>
      <BannerSlider 
        slides={slides} 
        height="500px"
        autoPlay={true}
        interval={3000}
        showArrows={true}
        showDots={true}
        dotActiveColor="#4CAF50"
        backgroundColor="#333" />

        <div>
            <div>
                <h2 style={{ textAlign: 'center', margin: '20px 0' }}>Featured Products</h2>
            </div>
            <div style={{
                display: 'flex',
                flexWrap: "wrap",
                gap: '0',
            }}>
                {products.map((product) => (
                    <ProductCard key={product.id} product={product} />
                ))}
            </div>
        </div>

        <div>
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

    </div>
  )
}

export default Home
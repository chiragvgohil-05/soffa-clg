import React from 'react'
import BannerSlider from '../components/BannerSlider';
import soffa from '../assets/soffa.jpg';
import singleSoffa from '../assets/single_soffa.jpg';
import singleChair from '../assets/single_chair.jpg';
import youtubeIcon from '../assets/svg/youtube.svg';
import instagramIcon from '../assets/svg/instal.svg';
import facebookIcon from '../assets/svg/facebook.svg';
import demo from '../assets/svg/demo.svg';
import chair from '../assets/chair.jpg';
import ProductCard from "../components/ProductCard";
import Banner from "../components/Banner";
import CategoryCard from "../components/CategoryCard";
import SectionHeading from "../components/SectionHeading";
import ReviewCard from "../components/ReviewCard";

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
    const categories = [
        {
            name: 'Sofas',
            image: singleSoffa,
            url: '/shop?category=soffa'
        },
        {
            name: 'Chairs',
            image: singleChair,
            url: '/shop?category=chair'
        },
    ];

    const followUsLinks = [
        {
            name: 'YouTube',
            url: 'https://www.youtube.com',
            image: youtubeIcon,
        },
        {
            name: 'Instagram',
            url: 'https://www.instagram.com',
            image: instagramIcon
        },
        {
            name: 'Facebook',
            url: 'https://www.facebook.com',
            image: facebookIcon
        }
    ]

    const reviews = [
        {
            name: 'Ravina B.',
            review: 'Nice material and nice service. Rate is reasonable compare to other. Thank you.'
        },
        {
            name: 'Pratima',
            review: 'Their whatsapp service are very good. I got full support and timely answer. I have bought for my friend as gift. nice dress.'
        },
        {
            name: 'Roshni raahi',
            review: 'I was redirected from instagram . and this was better than expected.'
        }
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
            <SectionHeading title="Category" leftIcon={demo} rightIcon={demo}/>
            <div className="category-container" style={{marginTop: '0'}}>
                {categories.map((cat, index) => (
                    <CategoryCard key={index} name={cat.name} image={cat.image} url={cat.url} />
                ))}
            </div>
        </div>

        <div className='container'>
            <div>
                <SectionHeading title="Featured Products" leftIcon={demo} rightIcon={demo}/>
            </div>
            <div style={{
                display: 'flex',
                flexWrap: "wrap",
                gap: '0',
                justifyContent: 'center',
            }}>
                {products.map((product) => (
                    <ProductCard key={product.id} product={product} />
                ))}
            </div>
        </div>

        <div className='container' style={{padding: '50px 0 0'}}>
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

        <div className="container">
            <SectionHeading title="Trending Products" leftIcon={demo} rightIcon={demo}/>
            <div style={{
                display: 'flex',
                flexWrap: "wrap",
                gap: '0',
                justifyContent: 'center',
            }}>
                {products.map((product) => (
                    <ProductCard key={product.id} product={product} />
                ))}
            </div>
        </div>

        <div className='container' style={{padding: '50px 0'}}>
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

        <div className="container">
            <SectionHeading title="Customer Reviews" leftIcon={demo} rightIcon={demo} color="#caa636"/>
            <div style={{display: 'flex', flexWrap: 'wrap', justifyContent: 'center',gap: '20px'}}>
                {reviews.map((item, index) => (
                    <ReviewCard key={index} name={item.name} review={item.review} />
                ))}
            </div>
        </div>

        <div className="container">
            <SectionHeading title="Follow Us" leftIcon={demo} rightIcon={demo} color="#caa636"/>
            <div>
                <div className="category-container" style={{marginTop: '0'}}>
                    {followUsLinks.map((cat, index) => (
                        <CategoryCard key={index} name={cat.name} image={cat.image} url={cat.url} />
                    ))}
                </div>
            </div>
        </div>
    </div>
  )
}

export default Home
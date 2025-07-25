import React, { useState, useMemo } from 'react';
import FilterSidebar from '../components/FilterSidebar';
import ProductCard from '../components/ProductCard';
import Modal from "../components/Modal";
import BannerSlider from "../components/BannerSlider";
import chair from "../assets/chair.jpg";

const Shop = () => {
    const [isOpen, setIsOpen] = useState(false);
    const slides = [
        {
            id: 1,
            image: chair,
            title: 'Shop Now',
            subtitle: 'Discover our latest products',
        }
    ];
    const [products] = useState([
        {
            id: 1,
            name: 'Wireless Headphones',
            price: 299,
            originalPrice: 349,
            category: 'soffa',
            brand: 'TechSound',
            rating: 4,
            reviewCount: 120,
            imageUrl: 'https://images.unsplash.com/photo-1505740420928-5e560c06d30e?w=300',
            inStock: true,
            isNew: true,
            discount: 14,
            colorsAvailable: ['black', 'white'],
        },
        {
            id: 2,
            name: 'Running Shoes',
            price: 159,
            originalPrice: 189,
            category: 'chair',
            brand: 'SportMax',
            rating: 4,
            reviewCount: 78,
            imageUrl: 'https://images.unsplash.com/photo-1542291026-7eec264c27ff?w=300',
            inStock: true,
            isNew: false,
            discount: 16,
            colorsAvailable: ['blue', 'red'],
        },
        {
            id: 3,
            name: 'Coffee Maker',
            price: 89,
            originalPrice: 99,
            category: 'soffa',
            brand: 'BrewMaster',
            rating: 5,
            reviewCount: 230,
            imageUrl: 'https://images.unsplash.com/photo-1559056199-641a0ac8b55e?w=300',
            inStock: false,
            isNew: false,
            discount: 10,
            colorsAvailable: ['silver'],
        },
        // Add remaining products similarly...
    ]);

    const [filters, setFilters] = useState({
        category: '',
        brand: '',
        priceRange: [0, 2000],
        minRating: 0,
        inStock: false,
    });
    const [searchTerm, setSearchTerm] = useState('');

    const handleFilterChange = (key, value) => {
        setFilters(prev => ({ ...prev, [key]: value }));
    };

    const clearFilters = () => {
        setFilters({ category: '', brand: '', priceRange: [0, 2000], minRating: 0, inStock: false });
        setSearchTerm('');
    };

    const categories = [...new Set(products.map(p => p.category))];
    const brands = [...new Set(products.map(p => p.brand))];

    const filteredProducts = useMemo(() => {
        return products.filter(product => {
            return (
                product.name.toLowerCase().includes(searchTerm.toLowerCase()) &&
                (!filters.category || product.category === filters.category) &&
                (!filters.brand || product.brand === filters.brand) &&
                product.price >= filters.priceRange[0] &&
                product.price <= filters.priceRange[1] &&
                product.rating >= filters.minRating &&
                (!filters.inStock || product.inStock)
            );
        });
    }, [products, filters, searchTerm]);

    return (
        <>
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
            </div>
            <div className="container shop-page">
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
                <div className="mobile-container" style={{ padding: '1rem' }}>
                    <button
                        onClick={() => setIsOpen(true)}
                        style={{
                            backgroundColor: '#3b82f6',
                            color: 'white',
                            border: 'none',
                            padding: '10px 20px',
                            borderRadius: '6px',
                            cursor: 'pointer'
                        }}
                    >
                        Filter
                    </button>
                </div>

                <div style={{ flex: 1 }}>
                    <div className="shop-product-grid">
                        {filteredProducts.map(product => (
                            <ProductCard key={product.id} product={product} />
                        ))}
                    </div>

                    {filteredProducts.length === 0 && (
                        <p style={{ marginTop: '40px' }}>No products match your filter.</p>
                    )}
                </div>

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

                    <div style={{ display: 'flex', justifyContent: 'flex-end', marginTop: '1rem' }}>
                        <button
                            onClick={() => setIsOpen(false)}
                            style={{
                                backgroundColor: '#10b981',
                                color: 'white',
                                border: 'none',
                                padding: '10px 20px',
                                borderRadius: '6px',
                                cursor: 'pointer'
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

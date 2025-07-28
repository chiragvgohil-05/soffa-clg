import React from 'react';
import '../../styles/admin.css';
import ProductCard from '../../components/ProductCard';
import { useNavigate } from 'react-router-dom';

const Products = () => {
    const dummyProducts = [
        {
            id: 1,
            name: "Wireless Bluetooth Headphones",
            price: 89.99,
            originalPrice: 129.99,
            rating: 4.5,
            reviewCount: 124,
            imageUrl: "https://images.unsplash.com/photo-1505740420928-5e560c06d30e?w=500&auto=format&fit=crop",
            isNew: true,
            discount: 30,
            inStock: true
        },
        {
            id: 2,
            name: "Smart Watch Pro Series",
            price: 199.99,
            originalPrice: 249.99,
            rating: 4.2,
            reviewCount: 87,
            imageUrl: "https://images.unsplash.com/photo-1523275335684-37898b6baf30?w=500&auto=format&fit=crop",
            isNew: false,
            discount: 20,
            inStock: true
        },
        {
            id: 3,
            name: "4K Ultra HD Smart TV",
            price: 799.99,
            originalPrice: 999.99,
            rating: 4.8,
            reviewCount: 215,
            imageUrl: "https://images.unsplash.com/photo-1593784991095-a205069470b6?w=500&auto=format&fit=crop",
            isNew: true,
            discount: 20,
            inStock: false
        },
        {
            id: 4,
            name: "Wireless Charging Pad",
            price: 24.99,
            originalPrice: 29.99,
            rating: 3.9,
            reviewCount: 42,
            imageUrl: "https://images.unsplash.com/photo-1583394838336-acd977736f90?w=500&auto=format&fit=crop",
            isNew: false,
            discount: 16,
            inStock: true
        },
        {
            id: 5,
            name: "Noise Cancelling Earbuds",
            price: 149.99,
            originalPrice: 179.99,
            rating: 4.6,
            reviewCount: 156,
            imageUrl: "https://images.unsplash.com/photo-1590658268037-6bf12165a8df?w=500&auto=format&fit=crop",
            isNew: true,
            discount: 17,
            inStock: true
        },
        {
            id: 6,
            name: "Portable Bluetooth Speaker",
            price: 59.99,
            originalPrice: 79.99,
            rating: 4.1,
            reviewCount: 73,
            imageUrl: "https://images.unsplash.com/photo-1572569511254-d8f925fe2cbb?w=500&auto=format&fit=crop",
            isNew: false,
            discount: 25,
            inStock: true
        },
        {
            id: 7,
            name: "Gaming Keyboard RGB",
            price: 89.99,
            originalPrice: 109.99,
            rating: 4.4,
            reviewCount: 92,
            imageUrl: "https://images.unsplash.com/photo-1587829741301-dc798b83add3?w=500&auto=format&fit=crop",
            isNew: false,
            discount: 18,
            inStock: false
        },
        {
            id: 8,
            name: "Fitness Tracker Band",
            price: 49.99,
            originalPrice: 59.99,
            rating: 3.8,
            reviewCount: 38,
            imageUrl: "https://images.unsplash.com/photo-1576243345690-4e4b79b63288?w=500&auto=format&fit=crop",
            isNew: true,
            discount: 17,
            inStock: true
        },
        {
            id: 9,
            name: "DSLR Camera Kit",
            price: 899.99,
            originalPrice: 1099.99,
            rating: 4.7,
            reviewCount: 187,
            imageUrl: "https://images.unsplash.com/photo-1516035069371-29a1b244cc32?w=500&auto=format&fit=crop",
            isNew: false,
            discount: 18,
            inStock: true
        },
        {
            id: 10,
            name: "Wireless Mouse Ergonomic",
            price: 34.99,
            originalPrice: 39.99,
            rating: 4.0,
            reviewCount: 56,
            imageUrl: "https://images.unsplash.com/photo-1527814050087-3793815479db?w=500&auto=format&fit=crop",
            isNew: false,
            discount: 13,
            inStock: true
        }
    ];
    const navigate = useNavigate();

    const handleEdit = (productId) => {
        console.log('Edit product:', productId);
        // Implement edit logic
    };

    const handleDelete = (productId) => {
        console.log('Delete product:', productId);
        // Implement delete logic
    };

    const handleAddProduct = () => {
        navigate('/admin/products/create');
    };
    return (
        <>
            <div className="product-header">
                <h1 className="page-title">Products</h1>
                <button className="add-product-button" onClick={handleAddProduct}>Add Product</button>
            </div>
        <div className="admin-content products">
            <div className="products-grid-container">
                <div className="products-grid">
                    {dummyProducts.map(product => (
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
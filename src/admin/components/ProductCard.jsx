import React from 'react';
import '../styles/AdminProductCard.css';

const ProductCard = ({
                         id,
                         name,
                         price,
                         originalPrice,
                         rating,
                         reviewCount,
                         imageUrl,
                         isNew,
                         discount,
                         inStock,
                         onEdit,
                         onDelete
                     }) => {
    return (
        <div className="product-card admin">
            <div className="product-image-container">
                <img src={imageUrl || 'https://via.placeholder.com/300'} alt={name} className="product-image" />
                <div className="product-badges">
                    {isNew && <span className="badge new">NEW</span>}
                    {discount > 0 && <span className="badge discount">{discount}% OFF</span>}
                    {!inStock && <span className="badge out-of-stock">OUT OF STOCK</span>}
                </div>
            </div>

            <div className="product-info">
                <h3 className="product-name">{name}</h3>

                <div className="product-pricing">
                    <span className="current-price">${price.toFixed(2)}</span>
                    {originalPrice > price && (
                        <span className="original-price">${originalPrice.toFixed(2)}</span>
                    )}
                </div>

                <div className="product-ratings">
          <span className="rating-stars">
            {'★'.repeat(Math.floor(rating))}{'☆'.repeat(5 - Math.floor(rating))}
          </span>
                    <span className="review-count">({reviewCount})</span>
                </div>

                <div className="product-actions">
                    <button className="edit-btn" onClick={() => onEdit(id)}>Edit</button>
                    <button className="delete-btn" onClick={() => onDelete(id)}>Delete</button>
                </div>

                <div className="product-meta">
                    <span className="product-id">ID: {id}</span>
                    <span className="stock-status">
            {inStock ? 'In Stock' : 'Out of Stock'}
          </span>
                </div>
            </div>
        </div>
    );
};

export default ProductCard;
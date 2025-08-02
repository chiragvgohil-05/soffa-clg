import React, { useState } from 'react';
import '../styles/AdminProductCard.css';
import FilterSidebar from "../../components/FilterSidebar";
import Modal from "../../components/Modal";

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
    const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false);

    const handleConfirmDelete = () => {
        onDelete(id);
        setIsDeleteModalOpen(false);
    };

    return (
        <>
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

                    <div className="admin-product-actions">
                        <button className="edit-btn" onClick={() => onEdit(id)}>Edit</button>
                        <button className="delete-btn" onClick={() => setIsDeleteModalOpen(true)}>Delete</button>
                    </div>
                </div>
            </div>

            {/* Delete Confirmation Modal */}
            <Modal
                isOpen={isDeleteModalOpen}
                onClose={() => setIsDeleteModalOpen(false)}
                title="Confirm Delete"
                size="small"
            >
                <p>Are you sure you want to delete <strong>{name}</strong>?</p>
                <div style={{ display: 'flex', justifyContent: 'flex-end', marginTop: '1rem', gap: '0.5rem' }}>
                    <button
                        onClick={() => setIsDeleteModalOpen(false)}
                        style={{
                            backgroundColor: '#e5e7eb',
                            border: 'none',
                            padding: '10px 16px',
                            borderRadius: '6px',
                            cursor: 'pointer'
                        }}
                    >
                        Cancel
                    </button>
                    <button
                        onClick={handleConfirmDelete}
                        style={{
                            backgroundColor: '#ef4444',
                            color: 'white',
                            border: 'none',
                            padding: '10px 16px',
                            borderRadius: '6px',
                            cursor: 'pointer'
                        }}
                    >
                        Delete
                    </button>
                </div>
            </Modal>
        </>
    );
};

export default ProductCard;
